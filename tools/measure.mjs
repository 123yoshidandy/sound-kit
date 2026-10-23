#!/usr/bin/env node
/**
 * 曲と効果音を書き出して、音量と音割れを数値で確かめる（ヘッドレス Chrome の OfflineAudioContext で、ゲームと同じ音を作る）
 *
 *   node tools/measure.mjs [--games mine-blocks,mine-blocks-legacy] [--only pixel,select] [--out <フォルダ>] [--seconds 30]
 *
 * 曲：統合ラウドネス（LUFS）・区間ごとのラウドネス・ピーク・音割れ・明るさ（スペクトルの重心）・4kHz より上の割合
 * 効果音：最大の瞬間ラウドネス・ピーク・音割れ・長さ
 * --out を付けると、曲ごとのスペクトログラム（PNG）を書き出す
 * --parts を付けると、パートを1つずつ鳴らして、パートごとの音量（全体との差）を出す
 * 「スマホ」は、250Hz より下を削ってから測った値（スマホのスピーカーは低音がほとんど出ない）
 * --extra audition/instruments.js で、ほかの登録ファイルも読む（試聴ページの楽器のフレーズなど）
 * 音割れ（ピークが 0dBFS に届く）があれば終了コード1
 */

import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { launchChrome } from './chrome.mjs';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');

function parseArgs(argv) {
    const args = { games: ['mine-blocks', 'mine-blocks-legacy'], only: null, out: null, seconds: null, effects: true, songs: true, parts: false, extra: [] };
    for (let i = 0; i < argv.length; i++) {
        const arg = argv[i];
        if (arg === '--games') args.games = argv[++i].split(',');
        else if (arg === '--only') args.only = argv[++i].split(',');
        else if (arg === '--out') args.out = path.resolve(argv[++i]);
        else if (arg === '--seconds') args.seconds = Number(argv[++i]);
        else if (arg === '--songs-only') args.effects = false;
        else if (arg === '--effects-only') args.songs = false;
        else if (arg === '--parts') args.parts = true;
        else if (arg === '--extra') args.extra.push(argv[++i]);
    }
    return args;
}

// ===== ページの中で動かす計算 =====

function analysisCode() {
    // K 特性（ITU-R BS.1770。48kHz の係数）
    const SHELF = { b: [1.53512485958697, -2.69169618940638, 1.19839281085285], a: [-1.69065929318241, 0.73248077421585] };
    const HIGHPASS = { b: [1, -2, 1], a: [-1.99004745483398, 0.99007225036621] };

    const PHONE = (() => {
        const w = 2 * Math.PI * 250 / 48000, alpha = Math.sin(w) / (2 * 0.707), cos = Math.cos(w), a0 = 1 + alpha;
        return { b: [(1 + cos) / 2 / a0, -(1 + cos) / a0, (1 + cos) / 2 / a0], a: [-2 * cos / a0, (1 - alpha) / a0] };
    })();

    function biquad(input, { b, a }) {
        const out = new Float32Array(input.length);
        let x1 = 0, x2 = 0, y1 = 0, y2 = 0;
        for (let i = 0; i < input.length; i++) {
            const x = input[i];
            const y = b[0] * x + b[1] * x1 + b[2] * x2 - a[0] * y1 - a[1] * y2;
            out[i] = y;
            x2 = x1; x1 = x; y2 = y1; y1 = y;
        }
        return out;
    }

    // 400ms の窓（100ms ずつずらす）ごとの平均二乗。K 特性を通したもの
    function blockPowers(buffer, windowSeconds = 0.4, phone = false) {
        const rate = buffer.sampleRate;
        const channels = [0, 1].slice(0, buffer.numberOfChannels).map(c => {
            const source = phone ? biquad(biquad(buffer.getChannelData(c), PHONE), PHONE) : buffer.getChannelData(c);
            const k = biquad(biquad(source, SHELF), HIGHPASS);
            const squares = new Float64Array(k.length + 1);
            for (let i = 0; i < k.length; i++) squares[i + 1] = squares[i] + k[i] * k[i];
            return squares;
        });
        const size = Math.floor(rate * windowSeconds);
        const hop = Math.floor(rate * 0.1);
        const blocks = [];
        for (let start = 0; start + size <= buffer.length; start += hop) {
            let power = 0;
            channels.forEach(squares => { power += (squares[start + size] - squares[start]) / size; });
            blocks.push({ time: start / rate, power });
        }
        return blocks;
    }

    const toLufs = (power) => -0.691 + 10 * Math.log10(power || 1e-12);

    function integrated(blocks) {
        const absolute = blocks.filter(b => toLufs(b.power) > -70);
        if (absolute.length === 0) return -Infinity;
        const mean = absolute.reduce((s, b) => s + b.power, 0) / absolute.length;
        const relative = absolute.filter(b => toLufs(b.power) > toLufs(mean) - 10);
        return toLufs(relative.reduce((s, b) => s + b.power, 0) / relative.length);
    }

    function peakOf(buffer) {
        let peak = 0, clipped = 0;
        for (let c = 0; c < buffer.numberOfChannels; c++) {
            const data = buffer.getChannelData(c);
            for (let i = 0; i < data.length; i++) {
                const v = Math.abs(data[i]);
                if (v > peak) peak = v;
                if (v >= 0.999) clipped++;
            }
        }
        return { peak: 20 * Math.log10(peak || 1e-12), clipped };
    }

    // 2の累乗の長さの FFT（強さだけを返す）
    function spectrum(frame) {
        const n = frame.length;
        const re = Float64Array.from(frame), im = new Float64Array(n);
        for (let i = 1, j = 0; i < n; i++) {
            let bit = n >> 1;
            for (; j & bit; bit >>= 1) j ^= bit;
            j ^= bit;
            if (i < j) { [re[i], re[j]] = [re[j], re[i]]; [im[i], im[j]] = [im[j], im[i]]; }
        }
        for (let len = 2; len <= n; len <<= 1) {
            const angle = -2 * Math.PI / len;
            for (let i = 0; i < n; i += len) {
                for (let k = 0; k < len / 2; k++) {
                    const wr = Math.cos(angle * k), wi = Math.sin(angle * k);
                    const ar = re[i + k + len / 2], ai = im[i + k + len / 2];
                    const tr = ar * wr - ai * wi, ti = ar * wi + ai * wr;
                    re[i + k + len / 2] = re[i + k] - tr; im[i + k + len / 2] = im[i + k] - ti;
                    re[i + k] += tr; im[i + k] += ti;
                }
            }
        }
        const mags = new Float64Array(n / 2);
        for (let i = 0; i < n / 2; i++) mags[i] = Math.hypot(re[i], im[i]);
        return mags;
    }

    function mono(buffer) {
        const out = new Float32Array(buffer.length);
        for (let c = 0; c < buffer.numberOfChannels; c++) {
            const data = buffer.getChannelData(c);
            for (let i = 0; i < data.length; i++) out[i] += data[i] / buffer.numberOfChannels;
        }
        return out;
    }

    // 明るさ（スペクトルの重心）と、4kHz より上の割合。スペクトログラムの絵も作る
    function spectralStats(buffer, { image = false, marks = [] } = {}) {
        const rate = buffer.sampleRate;
        const data = mono(buffer);
        const size = 4096;
        const hop = Math.floor(rate * (image ? 0.1 : 0.25));
        const window = Float64Array.from({ length: size }, (_, i) => 0.5 - 0.5 * Math.cos(2 * Math.PI * i / size));
        let centroidSum = 0, weightSum = 0, highSum = 0, totalSum = 0;
        const columns = [];
        let maxDb = -Infinity;
        for (let start = 0; start + size <= data.length; start += hop) {
            const frame = new Float64Array(size);
            for (let i = 0; i < size; i++) frame[i] = data[start + i] * window[i];
            const mags = spectrum(frame);
            let energy = 0, weighted = 0, high = 0;
            for (let i = 1; i < mags.length; i++) {
                const f = i * rate / size;
                const e = mags[i] * mags[i];
                energy += e; weighted += e * f;
                if (f > 4000) high += e;
            }
            if (energy > 1e-6) {
                centroidSum += weighted; weightSum += energy;
                highSum += high; totalSum += energy;
            }
            if (image) {
                columns.push(mags);
                for (let i = 1; i < mags.length; i++) maxDb = Math.max(maxDb, 20 * Math.log10(mags[i] + 1e-9));
            }
        }
        const result = {
            centroid: weightSum ? centroidSum / weightSum : 0,
            high: totalSum ? highSum / totalSum : 0
        };
        if (image) {
            const height = 220;
            const canvas = document.createElement('canvas');
            canvas.width = columns.length;
            canvas.height = height;
            const g = canvas.getContext('2d');
            const pixels = g.createImageData(columns.length, height);
            const lo = Math.log(40), hi = Math.log(16000);
            columns.forEach((mags, x) => {
                for (let y = 0; y < height; y++) {
                    const f = Math.exp(lo + (hi - lo) * (1 - y / height));
                    const bin = Math.min(mags.length - 1, Math.round(f * size / rate));
                    const db = 20 * Math.log10(mags[bin] + 1e-9);
                    const v = Math.max(0, Math.min(1, (db - maxDb + 60) / 60));
                    const p = (y * columns.length + x) * 4;
                    pixels.data[p] = 255 * Math.min(1, v * 2);
                    pixels.data[p + 1] = 255 * Math.max(0, v * 2 - 0.6);
                    pixels.data[p + 2] = 80 + 120 * (1 - v);
                    pixels.data[p + 3] = 255;
                }
            });
            g.putImageData(pixels, 0, 0);
            g.fillStyle = 'rgba(255,255,255,0.8)';
            g.font = '12px sans-serif';
            marks.forEach(({ time, label }) => {
                const x = Math.round(time / 0.1);
                g.fillRect(x, 0, 1, height);
                g.fillText(label, x + 3, 12);
            });
            [100, 1000, 4000, 10000].forEach(f => {
                const y = Math.round((1 - (Math.log(f) - lo) / (hi - lo)) * height);
                g.fillStyle = 'rgba(255,255,255,0.35)';
                g.fillRect(0, y, canvas.width, 1);
                g.fillText(f >= 1000 ? `${f / 1000}k` : `${f}`, 2, y - 2);
            });
            result.image = canvas.toDataURL('image/png');
        }
        return result;
    }

    async function measureSong(song, { seconds, image, parts }) {
        const compiled = SoundKit.compileSong(song);
        // イントロとループ1周に、ループの頭の8小節を足して、つなぎ目も確かめる
        const barSeconds = compiled.stepSeconds * compiled.stepsPerBar;
        const total = seconds ?? compiled.length * compiled.stepSeconds + Math.min(8 * barSeconds, compiled.loopLength * compiled.stepSeconds);
        const buffer = await SoundKit.renderSong(song, { seconds: total });
        const blocks = blockPowers(buffer);
        const shortTerm = blockPowers(buffer, 3).map(b => toLufs(b.power)).filter(v => v > -70).sort((a, b) => a - b);
        const pick = (q) => shortTerm[Math.floor(q * (shortTerm.length - 1))] ?? -Infinity;
        const sections = compiled.sections.map(s => {
            const from = s.start * compiled.stepSeconds, to = (s.start + s.length) * compiled.stepSeconds;
            return { label: s.label, name: s.name, lufs: integrated(blocks.filter(b => b.time >= from && b.time + 0.4 <= to)) };
        });
        // つなぎ目（ループの終わりから頭へ）の前後1秒の音量
        const seam = compiled.length * compiled.stepSeconds;
        const near = blocks.filter(b => b.time >= seam - 1.4 && b.time <= seam + 1).map(b => toLufs(b.power));
        const marks = compiled.sections.map(s => ({ time: s.start * compiled.stepSeconds, label: s.label }));
        marks.push({ time: seam, label: '↺' });
        const firstPass = compiled.length * compiled.stepSeconds;
        const partLevels = [];
        if (parts) {
            for (const name of Object.keys(song.parts)) {
                const solo = await SoundKit.renderSong(song, { seconds: seconds ?? firstPass, parts: [name] });
                partLevels.push({ name, lufs: integrated(blockPowers(solo)), phone: integrated(blockPowers(solo, 0.4, true)) });
            }
        }
        return {
            seconds: total,
            loopSeconds: compiled.loopLength * compiled.stepSeconds,
            lufs: integrated(blocks),
            phone: integrated(blockPowers(buffer, 0.4, true)),
            partLevels,
            range: pick(0.95) - pick(0.1),
            ...peakOf(buffer),
            sections,
            seamMin: Math.min(...near),
            ...spectralStats(buffer, { image, marks })
        };
    }

    async function measureEffect(definition) {
        const buffer = await SoundKit.renderEffect(definition);
        const blocks = blockPowers(buffer, 0.2);
        const data = mono(buffer);
        let last = 0;
        for (let i = 0; i < data.length; i++) if (Math.abs(data[i]) > 0.001) last = i;
        return {
            momentary: Math.max(...blocks.map(b => toLufs(b.power))),
            ...peakOf(buffer),
            length: last / buffer.sampleRate,
            ...spectralStats(buffer)
        };
    }

    return { measureSong, measureEffect };
}

// ===== 入口 =====

async function main(argv) {
    const args = parseArgs(argv);
    const chrome = await launchChrome();
    const errors = [];
    try {
        const page = await chrome.openPage('about:blank', { onConsole: (text) => { if (/error|exception/.test(text)) errors.push(text); } });
        const files = ['src/sound-kit.js', ...fs.readdirSync(path.join(ROOT, 'games')).filter(f => f.endsWith('.js')).map(f => `games/${f}`), ...args.extra];
        for (const file of files) {
            try {
                await page.eval(fs.readFileSync(path.join(ROOT, file), 'utf8') + '\n;true');
            } catch (error) {
                // ほかの人が書きかけのファイルがあっても、測れるものは測る
                console.error(`読み込めませんでした: ${file}（${error.message.split('\n')[0]}）`);
            }
        }
        await page.eval(`window.Measure = (${analysisCode.toString()})(); true`);
        if (args.out) fs.mkdirSync(args.out, { recursive: true });

        const rows = [];
        let clipped = false;
        for (const game of args.games) {
            const library = await page.eval(`({ songs: Object.keys(SoundKit.library('${game}').songs), effects: Object.keys(SoundKit.library('${game}').effects) })`);
            if (args.songs) {
                for (const id of library.songs) {
                    if (args.only && !args.only.includes(id)) continue;
                    const result = await page.eval(`Measure.measureSong(SoundKit.library('${game}').songs['${id}'], { seconds: ${args.seconds ?? 'null'}, image: ${Boolean(args.out)}, parts: ${args.parts} })`);
                    if (result.image) {
                        fs.writeFileSync(path.join(args.out, `${game}-${id}.png`), Buffer.from(result.image.split(',')[1], 'base64'));
                    }
                    if (result.clipped > 0) clipped = true;
                    rows.push({ type: 'song', game, id, ...result });
                }
            }
            if (args.effects) {
                for (const id of library.effects) {
                    if (args.only && !args.only.includes(id)) continue;
                    const result = await page.eval(`Measure.measureEffect(SoundKit.library('${game}').effects['${id}'])`);
                    if (result.clipped > 0) clipped = true;
                    rows.push({ type: 'effect', game, id, ...result });
                }
            }
        }

        const f = (v, d = 1) => (Number.isFinite(v) ? v.toFixed(d) : '-');
        // 無音のパートは -Infinity になるが、ページから受け取ると null に変わる。引き算で 0 扱いにしない
        const diff = (a, b) => (Number.isFinite(a) && Number.isFinite(b) ? a - b : NaN);
        const songs = rows.filter(r => r.type === 'song');
        if (songs.length) {
            console.log('曲                          LUFS  スマホ  幅(LRA)  ピーク  音割れ  明るさ(Hz)  4kHz以上  つなぎ目の最小');
            songs.forEach(r => {
                console.log(`${`${r.game}/${r.id}`.padEnd(28)}${f(r.lufs).padStart(6)}  ${f(r.phone).padStart(6)}  ${f(r.range).padStart(6)}  ${f(r.peak).padStart(6)}  ${String(r.clipped).padStart(5)}  ${f(r.centroid, 0).padStart(9)}  ${(r.high * 100).toFixed(1).padStart(7)}%  ${f(r.seamMin).padStart(8)}`);
                console.log(`    区間: ${r.sections.map(s => `${s.label} ${f(s.lufs)}`).join(' / ')}`);
                if (r.partLevels.length) console.log(`    パート（全体との差 dB、スマホ）: ${r.partLevels.map(p => `${p.name} ${f(diff(p.lufs, r.lufs))}（${f(diff(p.phone, r.phone))}）`).join(' / ')}`);
            });
        }
        const effects = rows.filter(r => r.type === 'effect');
        if (effects.length) {
            console.log('\n効果音                         瞬間LUFS  ピーク  音割れ  長さ(秒)  明るさ(Hz)');
            effects.forEach(r => {
                console.log(`${`${r.game}/${r.id}`.padEnd(30)}${f(r.momentary).padStart(8)}  ${f(r.peak).padStart(6)}  ${String(r.clipped).padStart(5)}  ${f(r.length, 2).padStart(7)}  ${f(r.centroid, 0).padStart(9)}`);
            });
        }
        if (errors.length) {
            console.log('\nページのエラー:');
            errors.forEach(e => console.log(`  ${e}`));
        }
        return clipped || errors.length ? 1 : 0;
    } finally {
        await chrome.close();
    }
}

process.exitCode = await main(process.argv.slice(2));
