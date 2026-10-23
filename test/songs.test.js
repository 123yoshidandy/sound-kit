import fs from 'node:fs';
import path from 'node:path';
import { describe, expect, it } from 'vitest';
import { loadKit, lintSong } from '../tools/lint-songs.mjs';

const GAME_FILES = fs.readdirSync(path.resolve('games')).filter(f => f.endsWith('.js')).map(f => `games/${f}`);
const SoundKit = loadKit(GAME_FILES);
const LIBRARIES = GAME_FILES.map(file => /SoundKit\.register\('([^']+)'/.exec(fs.readFileSync(file, 'utf8'))[1]);

describe.each(LIBRARIES)('%s', (name) => {
    const { songs, effects } = SoundKit.library(name);

    it.each(Object.keys(songs))('曲 %s を組み立てられ、和声の検査を通る', (id) => {
        const song = songs[id];
        const compiled = SoundKit.compileSong(song);
        expect(compiled.events.length).toBeGreaterThan(0);
        // ループは小節の区切りで終わる
        expect(compiled.loopLength % compiled.stepsPerBar).toBe(0);
        for (const part of Object.values(song.parts)) expect(SoundKit.instruments).toContain(part.instrument);
        expect(lintSong(SoundKit, song).warnings).toEqual([]);
    });

    it.each(Object.keys(effects))('効果音 %s を読める', (id) => {
        const length = SoundKit.effectLength(effects[id]);
        expect(length).toBeGreaterThan(0);
        expect(length).toBeLessThan(3);
        for (const layer of effects[id]) {
            const instrument = typeof layer.instrument === 'string' ? layer.instrument : layer.instrument.instrument;
            expect(SoundKit.instruments).toContain(instrument);
        }
    });
});

describe('ゲームに配るデータ', () => {
    it('mine-blocks の効果音は、ゲームが鳴らす名前をすべて持つ', () => {
        const names = ['select', 'place', 'invalid', 'remove', 'clear', 'bonus', 'surrender', 'lose', 'tick', 'timeUp', 'count', 'go', 'victory'];
        expect(Object.keys(SoundKit.library('mine-blocks').effects).sort()).toEqual([...names].sort());
    });
});
