#!/usr/bin/env node
/**
 * 曲の書き間違いを、音を聞かずに探す
 *
 *   node tools/lint-songs.mjs [games/mine-blocks.js ...]
 *
 * - 避けたい音：メロディの長めの音（8分音符以上）が、和音の構成音の半音上にあって、構成音でない（例：C の上で伸ばす F）
 * - 同時に鳴る音のぶつかり：メロディと、ほかのパートの伸ばしている音が、半音（短9度を含む）で重なる
 * - パートごとの音域と、1秒あたりの音の数（うるささの目安）
 * 見つかっても終了コードは 0（意図した経過音もあるので、目で確かめる）
 */

import fs from 'node:fs';
import path from 'node:path';
import vm from 'node:vm';
import { fileURLToPath } from 'node:url';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const NAMES = ['C', 'C#', 'D', 'Eb', 'E', 'F', 'F#', 'G', 'Ab', 'A', 'Bb', 'B'];

// sandbox：本体から見えるグローバル（テストで、偽の OfflineAudioContext を置くときに使う）
export function loadKit(files, sandbox = {}) {
    const context = vm.createContext(Object.assign(sandbox, { console }));
    context.globalThis = context;
    vm.runInContext(fs.readFileSync(path.join(ROOT, 'src/sound-kit.js'), 'utf8'), context);
    files.forEach(file => vm.runInContext(fs.readFileSync(path.resolve(ROOT, file), 'utf8'), context));
    return context.SoundKit;
}

function noteName(midi) {
    const rounded = Math.round(midi);
    return `${NAMES[((rounded % 12) + 12) % 12]}${Math.floor(rounded / 12) - 1}`;
}

// 和音の構成音（ピッチクラス）を、区間の和音の並びから探す
function chordTracks(SoundKit, song) {
    const tracks = [];
    let start = 0;
    const stepsPerBar = song.stepsPerBar ?? 16;
    for (const name of [...(song.intro ?? []), ...song.loop]) {
        const section = song.sections[name];
        if (section.chords) {
            section.chords.split('|').forEach((bar, barIndex) => {
                const tokens = bar.trim().split(/\s+/);
                const fixed = tokens.reduce((sum, t) => sum + Number(t.split(':')[1] ?? 0), 0);
                const free = tokens.filter(t => !t.includes(':')).length;
                let position = start + barIndex * stepsPerBar;
                tokens.forEach(token => {
                    const [symbol, length] = token.split(':');
                    const chord = SoundKit.parseChord(symbol);
                    const steps = length ? Number(length) : (stepsPerBar - fixed) / free;
                    tracks.push({ start: position, end: position + steps, chord, section: name, bar: barIndex + 1 });
                    position += steps;
                });
            });
            start += section.chords.split('|').length * stepsPerBar;
        } else {
            start += (section.bars ?? 0) * stepsPerBar;
        }
    }
    return tracks;
}

export function lintSong(SoundKit, song) {
    const compiled = SoundKit.compileSong(song);
    const tracks = chordTracks(SoundKit, song);
    const warnings = [];
    const melodic = Object.entries(song.parts).filter(([, part]) => (part.mode ?? 'notes') === 'notes').map(([name]) => name);

    for (const event of compiled.events) {
        if (!melodic.includes(event.part) || event.midi === undefined) continue;
        const track = tracks.find(t => event.start >= t.start && event.start < t.end);
        if (!track) continue;
        const { chord } = track;
        const tones = chord.intervals.map(i => (chord.root + i) % 12);
        const pc = ((Math.round(event.midi) % 12) + 12) % 12;
        const strong = event.start % 4 === 0;
        const long = event.length >= 4 || (strong && event.length >= 2);
        if (long && !tones.includes(pc) && tones.some(t => (t + 1) % 12 === pc)) {
            const where = `${track.section} ${track.bar}小節 ${(event.start - Math.floor(event.start / 16) * 16) / 4 + 1}拍`;
            warnings.push(`避けたい音: ${event.part} ${noteName(event.midi)}（${event.length}）が ${chord.symbol} の上 [${where}]`);
        }
    }

    // メロディと、ほかのパートで同時に鳴っている音の半音のぶつかり（両方が4分音符以上）
    const sustained = compiled.events.filter(e => e.midi !== undefined && e.length >= 4);
    for (const a of sustained.filter(e => melodic.includes(e.part))) {
        for (const b of sustained) {
            if (b.part === a.part || b.start >= a.start + a.length || a.start >= b.start + b.length) continue;
            const interval = Math.abs(Math.round(a.midi) - Math.round(b.midi));
            if (interval === 1 || interval === 13) {
                const track = tracks.find(t => a.start >= t.start && a.start < t.end);
                warnings.push(`ぶつかり: ${a.part} ${noteName(a.midi)} と ${b.part} ${noteName(b.midi)}（${track?.chord.symbol ?? ''}）[${track?.section ?? ''} ${track?.bar ?? ''}小節]`);
            }
        }
    }

    const seconds = compiled.length * compiled.stepSeconds;
    const parts = Object.keys(song.parts).map(name => {
        const events = compiled.events.filter(e => e.part === name);
        const midis = events.filter(e => e.midi !== undefined).map(e => e.midi);
        const range = midis.length ? `${noteName(Math.min(...midis))}〜${noteName(Math.max(...midis))}` : '-';
        return { name, range, perSecond: (events.length / seconds).toFixed(1) };
    });
    return { warnings: [...new Set(warnings)], parts, seconds };
}

function main(argv) {
    const files = argv.length ? argv : fs.readdirSync(path.join(ROOT, 'games')).filter(f => f.endsWith('.js')).map(f => `games/${f}`);
    const SoundKit = loadKit(files);
    const seen = new Set();
    for (const file of files) {
        const source = fs.readFileSync(path.resolve(ROOT, file), 'utf8');
        const name = /SoundKit\.register\('([^']+)'/.exec(source)?.[1];
        if (!name || seen.has(name)) continue;
        seen.add(name);
        for (const [id, song] of Object.entries(SoundKit.library(name).songs)) {
            if (song.file) continue;
            const { warnings, parts, seconds } = lintSong(SoundKit, song);
            console.log(`\n# ${name}/${id}（${song.title}、${seconds.toFixed(1)} 秒）`);
            parts.forEach(p => console.log(`  ${p.name.padEnd(8)} ${p.range.padEnd(10)} ${p.perSecond} 音/秒`));
            warnings.forEach(w => console.log(`  ! ${w}`));
            if (warnings.length === 0) console.log('  （気になる音はありません）');
        }
    }
    return 0;
}

if (process.argv[1] && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
    process.exitCode = main(process.argv.slice(2));
}
