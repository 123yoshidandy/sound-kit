/**
 * 曲の一覧：真夜中のグルーヴ（ファンク。跳ねるシンセベースと短いカッティング）
 * 曲の書き方は docs/composing.md にある。長さは16分音符の数で、'|' は小節の区切り
 */
(function () {
    const { repeat } = SoundKit;

    // A の主題（前半4小節は A' でも同じ）。短く切って、休みで跳ねさせる
    const THEME_HEAD = `r:2 D5:1 F5:1 A5:2 C6:2 r:2 A5:1 C6:1 D6:2 r:2 | B5:3 A5:1 r:2 G5:2 F5:4 r:4 |
                        r:2 D5:1 F5:1 A5:2 C6:2 r:2 A5:1 G5:1 A5:2 r:2 | r:2 B5:2 r:1 A5:1 G5:2 D5:4 r:4`;
    const THEME = `${THEME_HEAD} |
                   r:2 D5:1 F5:1 A5:2 C6:2 r:2 A5:1 C6:1 D6:2 r:2 | B5:3 A5:1 r:2 G5:2 A5:2 B5:2 D6:4 |
                   r:2 B5:2 r:1 G5:1 B5:2 D6:2 B5:2 G5:2 r:2 | A5:3 G5:1 r:2 E5:2 C#5:4 r:4`;
    // A' の後半：Bbmaj7 → A7 で色を変える
    const THEME_TURN = `r:2 D6:2 r:1 C6:1 A5:2 F5:2 r:2 D5:4 | C#6:3 A5:1 r:2 G5:2 E5:4 r:2 C#5:1 D5:1 |
                        E5:2 F5:2 A5:2 C6:2 r:2 A5:4 r:2`;
    // A' は主音で落ち着き、ループの終わりは A7 で頭の Dm9 へ戻る
    const THEME_END = `${THEME_HEAD} | ${THEME_TURN} | r:2 A5:1 C6:1 D6:6 r:6`;
    const THEME_LAST = `${THEME_HEAD} | ${THEME_TURN} | B5:4 G5:2 E5:2 C#5:4 A4:2 r:2`;

    const CHORDS_A = 'Dm9 | G9 | Dm9 | G9 | Dm9 | G9 | Em7 | A7';
    const CHORDS_A2 = 'Dm9 | G9 | Dm9 | G9 | Bbmaj7 | A7 | Dm9 | Dm9';
    const CHORDS_LAST = 'Dm9 | G9 | Dm9 | G9 | Bbmaj7 | A7 | Dm9 | Em7:8 A7:8';

    // ビブラフォンの合いの手（2回目の A で、主題の休みに足す）
    const COUNTER = 'r:16 | r:12 D6:2 B5:2 | r:16 | r:12 A5:2 F5:2 | r:16 | r:16 | r:16 | r:12 E5:2 G5:2';
    const COUNTER_LAST = 'r:16 | r:12 D6:2 B5:2 | r:16 | r:12 A5:2 F5:2 | r:16 | r:16 | r:16 | r:16';

    // 16分で動くのはベースだけ。オクターブ上へ跳ね、弱い音を混ぜる
    const BASS = 'R:2 r:1 R:1@0.55 r:2 R+:1 r:1 r:2 7:1 R+:1@0.7 r:1 5:1 r:1 R:1@0.6';
    // エレピの短いカッティング（裏で切る）
    const KEYS = '..x-...x..x-..o.';

    const DRUMS = {
        kick: repeat('x......x..x.....', 8, '|'),
        snare: repeat('....x....o..x.o.', 8, '|'),
        hat: repeat('x.o.x.o.x.o.x...', 8, '|'),
        openHat: repeat('..............x.', 8, '|')
    };
    // 最後の小節にタムを入れて、次の区間へつなぐ
    const DRUMS_FILL = {
        kick: repeat('x......x..x.....', 7, '|') + '|x......x........',
        snare: repeat('....x....o..x.o.', 7, '|') + '|....x....o......',
        tom: repeat('................', 7, '|') + '|..........x.x.x.',
        hat: repeat('x.o.x.o.x.o.x...', 7, '|') + '|x.o.x.o.........',
        openHat: repeat('..............x.', 7, '|') + '|................'
    };

    // ピアノとエレピ：夜の街のように、軽く跳ねるファンク
    const funk = {
        title: '真夜中のグルーヴ',
        description: 'ピアノとシンセベース・軽く跳ねるファンク',
        genre: 'ファンク・ソウル',
        melody: ['lead'],
        bpm: 100,
        swing: 0.06,
        gain: 0.089,
        reverb: { seconds: 1.4, tone: 0.45 },
        delay: { time: 0.75, feedback: 0.2, tone: 2400 },
        humanize: { time: 0.005, velocity: 0.1 },
        parts: {
            lead: { instrument: 'piano', volume: 0.6, pan: -0.1, decay: 0.6, release: 0.1, brightness: 0.85, reverb: 0.18, delay: 0.08 },
            counter: { instrument: 'vibes', volume: 0.42, pan: 0.3, reverb: 0.3, delay: 0.15 },
            keys: { instrument: 'epiano', mode: 'chords', center: 'D4', voices: 4, volume: 0.48, pan: 0.22, decay: 0.4, release: 0.06, gate: 0.7, reverb: 0.15, chorus: { depth: 0.002, rate: 0.6, mix: 0.35 } },
            pad: { instrument: 'pad', mode: 'chords', center: 'A3', voices: 3, volume: 0.32, cutoff: 900, reverb: 0.4 },
            bass: { instrument: 'synthBass', mode: 'bass', octave: 2, volume: 1.2, cutoff: 380, decay: 0.2, sustain: 0.3, release: 0.04, gate: 0.75 },
            drums: { instrument: 'drums', kit: 'soft', mode: 'drums', volume: 0.66, cutoff: 7000, levels: { kick: 0.8, snare: 0.5, hat: 0.4, openHat: 0.35, tom: 0.45, rim: 0.5 } }
        },
        sections: {
            intro: {
                label: 'イントロ',
                chords: 'Dm9 | G9 | Dm9 | Em7:8 A7:8',
                keys: KEYS,
                bass: { pattern: `r:16 | r:16 | ${BASS} | ${BASS}` },
                drums: {
                    hat: repeat('x.o.x.o.x.o.x...', 4, '|'),
                    kick: '................|................|x......x..x.....|x......x........',
                    tom: '................|................|................|..........x.x.x.'
                }
            },
            A: {
                chords: CHORDS_A,
                lead: THEME,
                keys: KEYS,
                bass: BASS,
                drums: DRUMS
            },
            A2: {
                label: "A'",
                chords: CHORDS_A2,
                lead: THEME_END,
                keys: KEYS,
                bass: BASS,
                drums: DRUMS_FILL
            },
            // サビ：F の方へ寄り道して、長めの音で歌う。パッドを敷き、ハイハットを開く
            B: {
                chords: 'Gm9 | C9 | Fmaj7 | Bbmaj7 | Gm9 | C9 | Em7 | A7',
                lead: `D6:6 C6:2 Bb5:4 A5:4 | G5:6 Bb5:2 D6:8 | C6:6 A5:2 G5:4 E5:4 | D5:4 F5:4 A5:8 |
                       Bb5:6 A5:2 G5:4 D5:4 | E5:6 G5:2 Bb5:4 D6:4 | B5:6 G5:2 E5:4 D5:4 | C#5:6 E5:2 A5:8`,
                keys: '..x-......x-....',
                pad: 'hold',
                bass: BASS,
                drums: {
                    kick: repeat('x......x..x.....', 8, '|'),
                    snare: repeat('....x.......x...', 8, '|'),
                    hat: repeat('x.o.x.o.x.o.x.o.', 8, '|'),
                    openHat: repeat('..x.......x.....', 8, '|')
                }
            },
            // 休憩：メロディは1小節おきに短く答えるだけ。ドラムはキックとリムだけ、ベースは8分で
            C: {
                chords: 'Dm9 | G9 | Dm9 | G9 | Bbmaj7 | Am7 | Gm9 | A7',
                lead: `r:16 | r:2 B5:2 r:1 A5:1 G5:2 F5:4 r:4 | r:16 | r:2 B5:2 r:1 A5:1 G5:2 D5:4 r:4 |
                       r:16 | r:2 C6:2 r:1 A5:1 G5:2 E5:4 r:4 | r:16 | r:2 C#6:2 r:1 A5:1 G5:2 E5:4 r:4`,
                keys: 'x-........x-....',
                pad: 'hold',
                bass: 'R:3 r:3 R+:2 r:2 5:2 r:2 R:2',
                drums: {
                    kick: repeat('x.........x.....', 8, '|'),
                    rim: repeat('....x.......x...', 7, '|') + '|....x.......x.x.',
                    hat: repeat('o...o...o...o...', 8, '|')
                }
            },
            // A に、ビブラフォンの合いの手を足す
            A3: {
                label: 'A',
                chords: CHORDS_A,
                lead: THEME,
                counter: COUNTER,
                keys: KEYS,
                bass: BASS,
                drums: DRUMS
            },
            // ループの終わり：A7 で終えて、頭の Dm9 へ戻る
            A4: {
                label: "A'",
                chords: CHORDS_LAST,
                lead: THEME_LAST,
                counter: COUNTER_LAST,
                keys: KEYS,
                bass: BASS,
                drums: DRUMS_FILL
            }
        },
        intro: ['intro'],
        loop: ['A', 'A2', 'B', 'C', 'A3', 'A4']
    };

    SoundKit.register('catalog', { songs: { funk } });
})();
