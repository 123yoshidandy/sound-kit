import { describe, expect, it } from 'vitest';
import { loadKit } from '../tools/lint-songs.mjs';

const SoundKit = loadKit([]);

// 1区間だけの曲を組み立てて、パートの音を返す
function compileSection(part, content, { chords = 'C', bars = null } = {}) {
    const song = {
        title: 'テスト',
        bpm: 120,
        parts: { p: part },
        sections: { A: { chords: bars ? undefined : chords, bars, p: content } },
        loop: ['A']
    };
    return SoundKit.compileSong(song).events;
}

describe('音名と和音', () => {
    it('音名を MIDI の番号にする', () => {
        expect(SoundKit.noteToMidi('A4')).toBe(69);
        expect(SoundKit.noteToMidi('C4')).toBe(60);
        expect(SoundKit.noteToMidi('F#3')).toBe(54);
        expect(SoundKit.noteToMidi('Bb2')).toBe(46);
        expect(() => SoundKit.noteToMidi('H4')).toThrow();
    });

    it('和音の記号を読む', () => {
        const chord = SoundKit.parseChord('Fmaj7/A');
        expect(chord.root).toBe(5);
        expect(chord.bass).toBe(9);
        expect([...chord.intervals]).toEqual([0, 4, 7, 11]);
        expect(SoundKit.parseChord('Bbm7').root).toBe(10);
        expect(() => SoundKit.parseChord('Cxyz')).toThrow(/和音が読めません/);
    });
});

describe('並びの記法', () => {
    it('長さを省くと、前の項目と同じになる', () => {
        const { items, length } = SoundKit.parseSequence('C5:2 D5 E5:4 r', { stepsPerBar: 0 });
        expect(items.map(i => i.length)).toEqual([2, 2, 4, 4]);
        expect(items.map(i => i.start)).toEqual([0, 2, 4, 8]);
        expect(length).toBe(12);
    });

    it('小節の区切りで長さが合わなければ、エラーにする', () => {
        expect(() => SoundKit.parseSequence('C5:4 D5:4 E5:4 | F5:16', { context: 'テスト' })).toThrow(/小節の長さが合いません/);
        expect(() => SoundKit.parseSequence('C5:4 D5 E5 F5 | G5:16')).not.toThrow();
    });

    it('強さと、同時に鳴らす音と、滑らせる音を読む', () => {
        const events = compileSection({ instrument: 'chip' }, '[C4,E4,G4]:8@0.5 C5~G5:8', { bars: 1 });
        expect(events.map(e => e.midi)).toEqual([60, 64, 67, 72]);
        expect(events[0].velocity).toBe(0.5);
        expect(events[3].glide).toBe(79);
    });

    it('区間より短い並びは、終わりまで繰り返す', () => {
        const events = compileSection({ instrument: 'chip' }, 'C5:4', { bars: 2 });
        expect(events).toHaveLength(8);
    });

    it('区間より長い並びは、エラーにする', () => {
        expect(() => compileSection({ instrument: 'chip' }, 'C5:16 | C5:16', { bars: 1 })).toThrow(/区間より長い/);
    });
});

describe('和音から音を作る', () => {
    it('ベースは、根音・分数和音の低音・度数を、指定のオクターブで鳴らす', () => {
        const events = compileSection({ instrument: 'synthBass', mode: 'bass', octave: 2 }, 'R:4 5 8 R-', { chords: 'C/E | Am7' });
        expect(events.slice(0, 4).map(e => e.midi)).toEqual([40, 43, 48, 28]);
        expect(events.slice(4, 8).map(e => e.midi)).toEqual([45, 52, 57, 33]);
    });

    it('分散和音は、from より上の構成音を数える', () => {
        const events = compileSection({ instrument: 'pluck', mode: 'arp', from: 'C4' }, '0:4 1 2 3', { chords: 'G' });
        // G の構成音を C4 から上へ：D4・G4・B4、次のオクターブの D5
        expect(events.map(e => e.midi)).toEqual([62, 67, 71, 74]);
    });

    it('和音の刻みは、x で鳴らして - の数だけ伸ばし、前の和音からなめらかにつなぐ', () => {
        const events = compileSection({ instrument: 'epiano', mode: 'chords', center: 'C4', voices: 3 }, 'x-------x-------', { chords: 'C | F' });
        const first = events.filter(e => e.start === 0);
        expect(first).toHaveLength(3);
        expect(first[0].length).toBe(8);
        const nextBar = events.filter(e => e.start === 16).map(e => e.midi).sort((a, b) => a - b);
        const firstBar = first.map(e => e.midi).sort((a, b) => a - b);
        const movement = nextBar.reduce((sum, midi, i) => sum + Math.abs(midi - firstBar[i]), 0);
        expect(movement).toBeLessThanOrEqual(4);
    });

    it('hold は、和音が変わるたびに、その長さだけ鳴らす', () => {
        const events = compileSection({ instrument: 'pad', mode: 'chords', voices: 4 }, 'hold', { chords: 'C:8 G:8 | F' });
        expect([...new Set(events.map(e => `${e.start}:${e.length}`))]).toEqual(['0:8', '8:8', '16:16']);
    });

    it('ドラムは、文字の位置と強さから鳴らす', () => {
        const events = compileSection({ instrument: 'drums', mode: 'drums' }, { kick: 'X...x...o...' + '....', hat: 'x.' }, { bars: 1 });
        const kicks = events.filter(e => e.drum === 'kick');
        expect(kicks.map(e => [e.start, e.velocity])).toEqual([[0, 1], [4, 0.8], [8, 0.5]]);
        expect(events.filter(e => e.drum === 'hat')).toHaveLength(8);
    });
});

describe('曲の組み立て', () => {
    it('イントロは1回だけで、ループの頭の位置を持つ', () => {
        const song = {
            bpm: 120,
            parts: { p: { instrument: 'chip' } },
            sections: { I: { bars: 2, p: 'C5:16' }, A: { bars: 4, p: 'E5:16' } },
            intro: ['I'],
            loop: ['A']
        };
        const compiled = SoundKit.compileSong(song);
        expect(compiled.loopStart).toBe(32);
        expect(compiled.length).toBe(96);
        expect(compiled.stepSeconds).toBeCloseTo(0.125);
        expect(compiled.sections.map(s => s.intro)).toEqual([true, false]);
    });

    it('人が弾いたようなばらつきは、毎回同じになる', () => {
        const song = () => ({ bpm: 100, humanize: { time: 0.01, velocity: 0.1 }, parts: { p: { instrument: 'chip' } }, sections: { A: { bars: 1, p: 'C5:4' } }, loop: ['A'] });
        const a = SoundKit.compileSong(song()).events.map(e => e.offset);
        const b = SoundKit.compileSong(song()).events.map(e => e.offset);
        expect(a).toEqual(b);
        expect(new Set(a).size).toBeGreaterThan(1);
    });
});
