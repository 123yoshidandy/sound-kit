/**
 * 曲の一覧：砂に眠るピラミッド（ゲーム音楽・ホのフリギア・ドミナントで、妖しく張りつめる）
 * ピアノの主題は E・F・G# の増2度を含む音階で、短い装飾音をからめて這うように上る。主題が伸ばす所で、蛇使いの笛のつもりのクラリネットがくねって答える
 * ギターがウードのように和音をはじき、低いタムが「ドン・ドン」と砂を踏む。パッドが乾いた風のように和音を敷く
 * B はイ短調へ移ってアンダルシアの下降（Am G F E）を巡る。休憩の C はピアノを抜き、クラリネットがひとりで歌う。最後は F から頭の E へ落ちる
 */
(function () {
    const { repeat } = SoundKit;
    const REST = '................';

    // A の主題（前半4小節は A' でも同じ）。E の和音の上では F・A・C を伸ばさない
    const THEME_HEAD = `B4:4 E5:3 F5:1 G#5:8 | A5:6 G#5:1 A5:1 C6:8 | B5:4 G#5:2 A5:1 G#5:1 E5:8 | D5:4 F5:4 A5:8`;
    const THEME = `${THEME_HEAD} |
                   G#5:6 B5:2 D6:8 | C6:6 B5:1 C6:1 A5:8 | D5:4 F5:4 A5:4 C6:4 | B5:12 r:4`;
    // A' の後半：イ短調の方へ寄り、E7 で B の Am へ
    const THEME_TURN = `${THEME_HEAD} |
                        E5:4 A5:4 C6:8 | D6:6 C6:2 A5:8 | C6:4 A5:4 F5:4 A5:4 | G#5:6 F5:1 E5:1 D5:4 B4:4`;
    // ループの終わり：F で止めて、頭の E へ落ちる
    const THEME_LAST = `${THEME_HEAD} |
                        G#5:6 B5:2 D6:8 | C6:6 B5:1 C6:1 A5:8 | D5:4 F5:4 A5:4 D6:4 | A5:6 G#5:2 F5:4 C5:4`;
    const CHORDS_A = 'E | F | E | Dm | E | F | Dm:8 F:8 | E';
    const CHORDS_A2 = 'E | F | E | Dm | Am | Dm | F | E7';
    const CHORDS_LAST = 'E | F | E | Dm | E | F | Dm | F';

    // 蛇使いの笛：主題が伸ばす所で、くねって答える
    const SNAKE_A = `r:16 | r:16 | r:8 E6:1 D6:1 C6:1 B5:1 G#5:2 B5:2 | r:16 |
                     r:16 | r:8 A5:1 B5:1 C6:1 D6:1 C6:4 | r:16 | r:8 G#5:1 A5:1 B5:1 C6:1 B5:2 G#5:2`;
    const SNAKE_A2 = `r:16 | r:16 | r:8 E6:1 D6:1 C6:1 B5:1 G#5:2 B5:2 | r:16 |
                      r:16 | r:8 F5:1 G#5:1 A5:1 B5:1 A5:4 | r:16 | r:16`;

    // B：イ短調のアンダルシアの下降を巡り、E で休憩へ
    const CHORDS_B = 'Am | G | F | E | Dm | Am | F | E';
    const SONG_B = `C6:6 B5:2 A5:8 | B5:6 A5:2 G5:8 | A5:6 G5:2 F5:8 | G#5:4 B5:4 D6:8 |
                    F5:4 A5:4 D6:8 | E5:4 A5:4 C6:8 | C6:6 A5:2 F5:4 A5:4 | G#5:8 B5:4 E5:4`;
    const SNAKE_B = `r:16 | r:16 | r:16 | r:8 E6:1 D6:1 C6:1 B5:1 G#5:4 |
                     r:16 | r:16 | r:16 | r:16`;

    // 休憩：クラリネットがひとりで歌う。F で最後の A へ
    const CHORDS_C = 'Am | Dm | F | E | Am | Dm | E | F';
    const SOLO_C = `E5:8 A5:8 | F5:16 | A5:8 C6:8 | B5:8 G#5:8 |
                    C6:8 A5:8 | D5:8 F5:8 | E5:4 G#5:4 B5:8 | A5:8 F5:4 C5:4`;

    // ウードのつもりのギターと、ベース
    const OUD = 'x..x..x.x...x...';
    const BASS = 'R:6 R:2 R:4 5:4';
    // 低いタム：「ドン・ドン」と砂を踏む
    const DUM = 'x.....x...x.....';
    const TEK = '...x......x..x..';
    const DRUMS_A = { tomLow: repeat(DUM, 8, '|') };
    const DRUMS_FULL = { tomLow: repeat(DUM, 7, '|') + '|x.....x...x.x.x.', tomMid: repeat(TEK, 8, '|'), hat: repeat('..x...x...x...x.', 8, '|') };

    // ピラミッド：ピアノの主題、蛇使いの笛、ウードと低いタム
    const pyramid = {
        title: '砂に眠るピラミッド',
        tags: ['神秘的', '緊張感'],
        genre: 'ゲーム音楽',
        melody: ['lead'],
        bpm: 92,
        gain: 0.11,
        reverb: { seconds: 2.6, tone: 0.45 },
        delay: { time: 0.75, feedback: 0.25, tone: 2000, reverb: 0.3 },
        humanize: { time: 0.006, velocity: 0.08 },
        parts: {
            lead: { instrument: 'piano', volume: 0.52, pan: -0.08, decay: 0.85, brightness: 0.8, reverb: 0.28, delay: 0.1 },
            // 蛇使いの笛のつもり：くねる合いの手
            snake: { instrument: 'clarinet', volume: 0.45, pan: 0.3, vibrato: 14, reverb: 0.35, delay: 0.2 },
            // 休憩の C で歌うクラリネット
            solo: { instrument: 'clarinet', volume: 0.6, pan: 0.15, vibrato: 12, reverb: 0.35, delay: 0.15 },
            // ウードのつもり：短くはじくギター
            oud: { instrument: 'guitar', mode: 'chords', center: 'D4', voices: 3, strum: 0.01, gate: 0.35, brightness: 0.6, volume: 0.62, pan: -0.25, reverb: 0.2 },
            pad: { instrument: 'pad', mode: 'chords', center: 'C4', voices: 3, volume: 0.35, cutoff: 1000, attack: 1, release: 1.6, pan: 0.1, reverb: 0.5 },
            bass: { instrument: 'pluck', mode: 'bass', octave: 2, brightness: 0.4, volume: 0.7 },
            // 低い太鼓のつもりのタム
            drums: { instrument: 'drums', kit: 'soft', mode: 'drums', volume: 0.65, cutoff: 6000, levels: { tomLow: 0.7, tomMid: 0.45, hat: 0.3 } }
        },
        sections: {
            // イントロ：パッドとウード、低いタムから。笛が答え、F から主題の E へ落ちる
            intro: {
                label: 'イントロ',
                chords: 'E | F | E | Dm:8 F:8',
                oud: OUD,
                pad: 'hold',
                snake: `r:16 | r:8 A5:1 B5:1 C6:1 D6:1 C6:4 | r:16 | r:8 F5:1 G#5:1 A5:1 B5:1 C6:4`,
                bass: BASS,
                drums: { tomLow: repeat(DUM, 4, '|') }
            },
            A: {
                chords: CHORDS_A,
                lead: THEME,
                snake: SNAKE_A,
                oud: OUD,
                bass: BASS,
                drums: DRUMS_A
            },
            // A'：パッドを敷き、タムが細かくなる。E7 で B の Am へ
            A2: {
                label: "A'",
                chords: CHORDS_A2,
                lead: THEME_TURN,
                snake: SNAKE_A2,
                oud: OUD,
                pad: 'hold',
                bass: BASS,
                drums: DRUMS_FULL
            },
            // B：イ短調のアンダルシアの下降
            B: {
                chords: CHORDS_B,
                lead: SONG_B,
                snake: SNAKE_B,
                oud: OUD,
                pad: 'hold',
                bass: BASS,
                drums: DRUMS_FULL
            },
            // 休憩：ピアノを抜き、クラリネットが歌う。ウードは小節の頭だけ、タムは間遠に
            C: {
                chords: CHORDS_C,
                solo: SOLO_C,
                oud: 'x.......x.......',
                pad: 'hold',
                bass: 'R:16',
                drums: { tomLow: repeat('x...............', 8, '|') }
            },
            // 最後の A：笛とタムがそろい、F で頭の E へ落ちる
            A3: {
                label: 'A',
                chords: CHORDS_LAST,
                lead: THEME_LAST,
                snake: SNAKE_A2,
                oud: OUD,
                pad: 'hold',
                bass: BASS,
                drums: DRUMS_FULL
            }
        },
        intro: ['intro'],
        loop: ['A', 'A2', 'B', 'C', 'A3']
    };

    SoundKit.register('catalog', { songs: { pyramid } });
})();
