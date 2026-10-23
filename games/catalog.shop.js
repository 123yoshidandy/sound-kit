/**
 * 曲の一覧：まいどありの店先（ゲームのショップの曲・軽く楽しい）
 */
(function () {
    const { repeat } = SoundKit;

    // A の主題（前半6小節は A' でも同じ）。短く切って、はずませる
    const THEME_HEAD = `F#5:2 r:2 A5:2 r:2 D6:4 A5:4 | B5:4 A5:2 F#5:2 D5:8 | G5:2 r:2 B5:2 r:2 D6:4 B5:4 | C#6:4 A5:2 G5:2 E5:8 |
                        F#5:2 r:2 A5:2 r:2 D6:4 A5:4 | B5:4 D6:2 B5:2 F#5:8`;
    const THEME = `${THEME_HEAD} | G5:4 B5:4 A5:4 C#5:4 | D5:8 r:8`;
    // A'：最後に A7 へ上がって、頭の D へ戻る
    const THEME_END = `${THEME_HEAD} | G5:4 B5:4 A5:4 C#5:4 | D5:8 A4:4 C#5:4`;

    // マリンバの合いの手（A' で、主題の伸ばしている所に足す）
    const COUNTER = 'r:16 | r:8 A5:2 B5:2 A5:4 | r:16 | r:8 G5:2 A5:2 G5:4 | r:16 | r:8 D6:2 C#6:2 B5:4 | r:16 | r:16';

    // エレピの裏打ち
    const KEYS = '..x...x...x...x.';
    const BASS = 'R:4 5:4 R+:4 5:4';
    const DRUMS = {
        kick: repeat('x.......x.......', 8, '|'),
        rim: repeat('....x.......x...', 8, '|'),
        hat: repeat('x.o.x.o.x.o.x.o.', 8, '|')
    };

    // ショップ：跳ねる8分、エレピの裏打ちとマリンバ
    const shop = {
        title: 'まいどありの店先',
        tags: ['明るい', '軽快'],
        genre: 'ゲーム音楽',
        melody: ['lead'],
        bpm: 120,
        swing: 0.12,
        swingUnit: 2,
        gain: 0.096,
        reverb: { seconds: 1.3, tone: 0.5 },
        delay: { time: 0.75, feedback: 0.2, tone: 2400 },
        humanize: { time: 0.004, velocity: 0.08 },
        parts: {
            lead: { instrument: 'piano', volume: 0.62, pan: -0.08, decay: 0.6, brightness: 0.85, reverb: 0.16, delay: 0.08 },
            counter: { instrument: 'marimba', volume: 0.36, pan: 0.3, reverb: 0.25, delay: 0.12 },
            keys: { instrument: 'epiano', mode: 'chords', center: 'E4', voices: 3, volume: 0.95, pan: 0.2, decay: 0.3, release: 0.05, gate: 0.6, reverb: 0.15 },
            pad: { instrument: 'pad', mode: 'chords', center: 'A3', voices: 3, volume: 0.3, cutoff: 1000, reverb: 0.4 },
            bass: { instrument: 'pluck', mode: 'bass', octave: 2, brightness: 0.4, sustain: 0.994, release: 0.08, volume: 1, gate: 0.7 },
            drums: { instrument: 'drums', kit: 'soft', mode: 'drums', volume: 0.6, cutoff: 7000, levels: { kick: 0.75, rim: 0.45, hat: 0.35 } }
        },
        sections: {
            intro: {
                label: 'イントロ',
                chords: 'D | Bm7 | Em7 | A7',
                keys: KEYS,
                bass: { pattern: `r:16 | r:16 | ${BASS} | ${BASS}` },
                drums: { hat: repeat('x.o.x.o.x.o.x.o.', 4, '|') }
            },
            A: {
                chords: 'D | Bm7 | Em7 | A7 | D | Bm7 | Em7:8 A7:8 | D',
                lead: THEME,
                keys: KEYS,
                bass: BASS,
                drums: DRUMS
            },
            // B：IV の Gmaj7 から始めて、長めの音で歌う。パッドを敷き、ドラムはリムとハイハットだけ
            B: {
                chords: 'Gmaj7 | F#m7 | Em7 | A7 | Gmaj7 | F#m7 | Em7 | A7sus4:8 A7:8',
                lead: `B5:6 A5:2 F#5:4 D5:4 | A5:6 C#6:2 E5:8 | G5:4 B5:4 D6:4 B5:4 | C#6:6 B5:2 A5:8 |
                       D6:6 B5:2 G5:4 F#5:4 | E5:4 F#5:4 A5:8 | B5:6 G5:2 E5:8 | D5:4 E5:4 C#5:4 E5:4`,
                keys: KEYS,
                pad: 'hold',
                bass: BASS,
                drums: {
                    rim: repeat('....x.......x...', 8, '|'),
                    hat: repeat('x.o.x.o.x.o.x.o.', 7, '|') + '|x.o.x.o.x.x.x.x.'
                }
            },
            // A に、マリンバの合いの手を足す。A7 で終えて、頭の D へ戻る
            A2: {
                label: "A'",
                chords: 'D | Bm7 | Em7 | A7 | D | Bm7 | Em7:8 A7:8 | D:8 A7:8',
                lead: THEME_END,
                counter: COUNTER,
                keys: KEYS,
                bass: BASS,
                drums: DRUMS
            }
        },
        intro: ['intro'],
        loop: ['A', 'B', 'A2']
    };

    SoundKit.register('catalog', { songs: { shop } });
})();
