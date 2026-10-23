/**
 * 曲の一覧：はじまりの草原（RPG のフィールドの曲。冒険に出る、広がりのある明るい曲）
 * 弦やブラスの代わりに、パッドとはじく弦・ベル・ティンパニ風のタムで広がりを出す
 */
(function () {
    const { repeat } = SoundKit;

    // A の主題（前半4小節は A' でも同じ）。D の分散和音で上がっていく
    const THEME_HEAD = `D5:4 F#5:2 A5:2 D6:8 | C#6:6 B5:2 A5:4 E5:4 | B5:6 A5:2 F#5:4 D5:4 | G5:8 r:4 A5:2 B5:2`;
    // A の後半：A7 で止まる
    const THEME_HALF = `D6:6 B5:2 G5:4 E5:4 | E5:4 A5:4 C#6:6 B5:2 | A5:4 F#5:4 G5:4 B5:4 | A5:8 G5:4 E5:2 F#5:2`;
    // A' の後半：D で落ち着いてから、D7 で B の G へ向かう
    const THEME_FULL = `G5:6 B5:2 D6:4 B5:4 | C#6:6 A5:2 E5:4 G5:4 | F#5:4 A5:4 D6:8 | D6:8 C6:4 A5:4`;
    // ループの終わり：A7 で終えて、頭の D へ戻る（C#5 から D5 へ）
    const THEME_LOOP_END = `G5:6 B5:2 D6:4 B5:4 | C#6:6 A5:2 E5:4 G5:4 | F#5:4 A5:4 D6:8 | D6:4 A5:4 G5:4 E5:2 C#5:2`;

    const A_CHORDS = 'D | A/C# | Bm | G | Em7 | A | D/F#:8 G:8 | A7sus4:8 A7:8';
    const A2_CHORDS = 'D | A/C# | Bm | G | Em7 | A7 | D | D7';
    const A4_CHORDS = 'D | A/C# | Bm | G | Em7 | A7 | D | A7sus4:8 A7:8';

    // ベルの答え（最後の A と A' で足す）。主旋律が伸ばしているところに入れる
    const BELL = 'r:8 A5:4 F#5:4 | r:16 | r:16 | r:8 D6:2 B5:2 G5:4 | r:16 | r:16 | r:16 | r:8 E6:4 C#6:4';

    const HARP = '0:2 1 2 3 2 1 2 1';
    const BASS = 'R:6 5:2 8:4 5:4';

    const DRUMS_A = {
        kick: repeat('x.......x.......', 8, '|'),
        shaker: repeat('..o...o...o...o.', 8, '|'),
        tom: repeat('................', 7, '|') + '|........x...x.x.'
    };
    // 最後の A と A'：小太鼓を軽く足して、行進のように
    const DRUMS_MARCH = {
        kick: repeat('x.......x.......', 8, '|'),
        snare: repeat('....x.......x...', 8, '|'),
        shaker: repeat('..o...o...o...o.', 8, '|'),
        tom: repeat('................', 7, '|') + '|........x...x.x.'
    };

    const field = {
        title: 'はじまりの草原',
        tags: ['明るい'],
        genre: 'ゲーム音楽',
        melody: ['lead'],   // 主旋律のパート（試聴ページで楽器を替えられる）
        bpm: 120,
        gain: 0.051,
        reverb: { seconds: 2.8, tone: 0.5 },
        delay: { time: 0.75, feedback: 0.25, tone: 2400, reverb: 0.3 },
        humanize: { time: 0.005, velocity: 0.07 },
        parts: {
            lead: { instrument: 'piano', volume: 0.97, pan: -0.1, brightness: 0.95, release: 0.25, reverb: 0.3, delay: 0.12 },
            bell: { instrument: 'bell', volume: 0.45, pan: 0.35, reverb: 0.4, delay: 0.2 },
            // ハープ：明るくはじく弦の分散和音
            harp: { instrument: 'pluck', mode: 'arp', from: 'D4', brightness: 0.75, sustain: 0.997, volume: 1.1, pan: 0.28, reverb: 0.3, delay: 0.1 },
            // 弦の代わりのパッド。左右にゆっくり揺らして広げる
            pad: { instrument: 'pad', mode: 'chords', center: 'E4', voices: 4, volume: 0.25, cutoff: 1300, reverb: 0.45, chorus: { depth: 0.003, rate: 0.4, mix: 0.45 }, autopan: { rate: 0.15, depth: 0.25 } },
            bass: { instrument: 'pluck', mode: 'bass', octave: 2, brightness: 0.4, sustain: 0.995, release: 0.12, volume: 1.1, gate: 0.9 },
            // ドラム：tom をティンパニに見立てる
            drums: { instrument: 'drums', kit: 'soft', mode: 'drums', volume: 0.8, levels: { kick: 0.7, snare: 0.35, shaker: 0.45, tom: 0.85 }, reverb: 0.2 }
        },
        sections: {
            // イントロ：パッドとティンパニで幕を開け、ハープが入って A7 で止まる
            intro: {
                label: 'イントロ',
                chords: 'D | G | Em7 | A7sus4:8 A7:8',
                pad: 'hold',
                harp: `r:16 | r:16 | ${HARP} | ${HARP}`,
                bass: 'R:16',
                drums: { tom: 'x...............|x...............|x.......x.......|x...x...x.x.x.xx' }
            },
            A: {
                chords: A_CHORDS,
                lead: `${THEME_HEAD} | ${THEME_HALF}`,
                harp: HARP,
                bass: BASS,
                drums: DRUMS_A
            },
            // A'：パッドを敷く
            A2: {
                label: "A'",
                chords: A2_CHORDS,
                lead: `${THEME_HEAD} | ${THEME_FULL}`,
                harp: HARP,
                pad: 'hold',
                bass: BASS,
                drums: DRUMS_A
            },
            // B：長い音で大きく歌う。ティンパニが拍を刻む
            B: {
                chords: 'G | A | F#m7 | Bm | Em7 | F#m7 | G | A',
                lead: `B5:8 D6:4 B5:4 | C#6:8 A5:4 E5:4 | F#5:8 A5:4 C#6:4 | B5:12 A5:2 B5:2 |
                       G5:8 B5:4 D6:4 | C#6:8 A5:4 F#5:4 | B5:6 A5:2 G5:4 B5:4 | A5:12 r:4`,
                harp: HARP,
                pad: 'hold',
                bass: 'R:8 5:8',
                drums: {
                    kick: repeat('x...............', 8, '|'),
                    tom: repeat('........x...x...', 7, '|') + '|x...x...x.x.x.xx'
                }
            },
            // C：休憩。ドラムを抜き、旋律はまばらに。ベルが答える。ハープは弱く
            C: {
                chords: 'Bm | G | D | A | Bm | G | Em7 | A7sus4:8 A7:8',
                lead: `B5:12@0.95 r:4 | r:16 | A5:12@0.95 r:4 | r:16 |
                       D6:12@0.95 r:4 | r:16 | B5:8@0.95 G5:8@0.9 | A5:8@0.95 r:4 E5:2@0.75 C#5:2@0.75`,
                bell: 'r:16 | r:4 D6:4 B5:4 G5:4 | r:16 | r:4 E6:4 C#6:4 A5:4 | r:16 | r:4 D6:4 B5:4 G5:4 | r:16 | r:16',
                harp: '0:2@0.85 1@0.75 2 3 2 1 2 1',
                pad: 'hold',
                bass: 'R:8 5:8',
                drums: { tom: repeat('................', 7, '|') + '|........o...o.o.' }
            },
            // 最後の A：ベルが答え、小太鼓を足す
            A3: {
                label: 'A',
                chords: A_CHORDS,
                lead: `${THEME_HEAD} | ${THEME_HALF}`,
                bell: BELL,
                harp: HARP,
                pad: 'hold',
                bass: BASS,
                drums: DRUMS_MARCH
            },
            // ループの終わり：A7 で終えて、頭の D へ戻る
            A4: {
                label: "A'",
                chords: A4_CHORDS,
                lead: `${THEME_HEAD} | ${THEME_LOOP_END}`,
                bell: 'r:16 | r:16 | r:16 | r:8 D6:2 B5:2 G5:4 | r:16 | r:16 | r:16 | r:16',
                harp: HARP,
                pad: 'hold',
                bass: BASS,
                drums: DRUMS_MARCH
            }
        },
        intro: ['intro'],
        loop: ['A', 'A2', 'B', 'C', 'A3', 'A4']
    };

    SoundKit.register('catalog', { songs: { field } });
})();
