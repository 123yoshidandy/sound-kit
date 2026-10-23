/**
 * 曲の一覧：砂の回廊（中東風・ヒジャーズの響きで神秘的に）
 * イ音を主音にしたフリジアン・ドミナント（A Bb C# D E F G）。Bb と C# の増2度が中東らしさを出す
 * 低音は A と E を伸ばすドローン。和音を変えても低音は A に留め（Gm/A・Bb/A）、Bb → A で主音へ戻る
 * 打楽器はダラブッカのマクスーム（ドゥム・タク・・タク ドゥム・・タク・）を、tom（ドゥム）と rim（タク）で叩く
 */
(function () {
    const { repeat } = SoundKit;

    const CHORDS_A = 'A | A7b9 | Gm/A | Bb/A:8 A:8 | A | A7b9 | Gm/A:8 Bb/A:8 | A';
    // A' は後半で Dm・Gm へ寄り道してから主音に戻る
    const CHORDS_A2 = 'A | A7b9 | Gm/A | Bb/A:8 A:8 | Dm/A | Gm/A | Bb/A | A';
    // ループの終わり：Bb で終えて、頭の A へ半音で下りる
    const CHORDS_A4 = 'A | A7b9 | Gm/A | Bb/A:8 A:8 | Dm | Gm | A7b9 | Bb';

    // 主題の前半4小節（どの A でも同じ）。短い装飾音（長さ1）で回してから、和音の音に落ち着く
    const THEME_HEAD = `A4:2 C#5:2 E5:6 F5:1 E5:1 C#5:4 | Bb4:4 C#5:2 A4:10 |
                        D5:4 Bb4:2 D5:2 G5:6 F5:2 | F5:2 E5:1 D5:1 Bb4:4 C#5:8`;
    const THEME = `${THEME_HEAD} | E5:2 F5:1 E5:1 A5:6 G5:2 F5:1 E5:3 | Bb5:4 A5:2 G5:2 A5:8 |
                   G5:4 D5:4 F5:4 D5:4 | C#5:2 Bb4:2 C#5:4 A4:8`;
    const THEME_END = `${THEME_HEAD} | F5:4 A5:4 D6:6 C#6:2 | Bb5:6 A5:2 G5:4 D5:4 |
                       F5:4 D5:2 E5:2 F5:4 G5:4 | A5:12 r:4`;
    const THEME_LAST = `${THEME_HEAD} | F5:4 A5:4 D6:6 C#6:2 | Bb5:6 A5:2 G5:4 D5:4 |
                        C#5:4 E5:4 G5:4 Bb5:4 | D5:4 F5:4 Bb4:6 r:2`;

    // ウード：A では低い刻み（伴奏）、A' と2回目の A では、主題が伸ばしている所に答える（対旋律）
    const OUD_RIFF_HEAD = `A3:2 r:2 A3:2 Bb3:2 C#4:2 r:2 E4:2 C#4:2 | A3:2 r:2 A3:2 Bb3:2 C#4:2 r:2 E4:2 C#4:2 |
                           G3:2 r:2 G3:2 A3:2 Bb3:2 r:2 A3:2 G3:2 | Bb3:2 r:2 D4:2 C#4:2 A3:2 r:2 E4:2 C#4:2`;
    const OUD_RIFF = `${OUD_RIFF_HEAD} | A3:2 r:2 A3:2 Bb3:2 C#4:2 r:2 E4:2 C#4:2 | A3:2 r:2 A3:2 Bb3:2 C#4:2 r:2 E4:2 C#4:2 |
                      G3:2 r:2 Bb3:2 A3:2 Bb3:2 r:2 D4:2 C#4:2 | A3:2 r:2 A3:2 Bb3:2 C#4:2 r:2 E4:2 C#4:2`;
    const OUD_RIFF_LAST = `${OUD_RIFF_HEAD} | D4:2 r:2 F4:2 A3:2 D4:2 r:2 F4:2 E4:2 | G3:2 r:2 G3:2 A3:2 Bb3:2 r:2 A3:2 G3:2 |
                           A3:2 r:2 C#4:2 E4:2 G4:2 r:2 Bb3:2 C#4:2 | Bb3:2 r:2 D4:2 F4:2 D4:2 r:2 C#4:2 Bb3:2`;
    const OUD_ANSWER_HEAD = `r:16 | r:8 C#4:2 D4:1 C#4:1 Bb3:2 A3:2 | r:16 | r:12 E4:2 C#4:2`;
    const OUD_ANSWER = `${OUD_ANSWER_HEAD} | r:16 | r:8 G4:2 F4:1 E4:1 C#4:2 A3:2 | r:16 | r:8 A3:2 C#4:2 E4:2 G4:2`;
    const OUD_ANSWER2 = `${OUD_ANSWER_HEAD} | r:16 | r:8 F4:2 E4:1 D4:1 C#4:2 A3:2 | r:16 | r:8 A3:2 C#4:2 E4:2 G4:2`;

    // ドローン：低い A と E を伸ばす（和音が変わっても動かさない）
    const DRONE_A = '[A2,E3]:64 | [A2,E3]:64';

    // マクスーム。最後の小節はドゥムを重ねて次へつなぐ
    const MAQSUM = { tom: 'x.......x.......', rim: '..x...x.....x...' };
    const MAQSUM_GHOST = { tom: 'x.......x.......', rim: '..x...x...o.x.o.' };
    const withFill = (rhythm, extra = {}) => ({
        tom: repeat(rhythm.tom, 7, '|') + '|x.......x.x.x.xx',
        rim: repeat(rhythm.rim, 7, '|') + '|..x...x.........',
        ...extra
    });
    // リク（タンバリン）の鈴を、シェイカーで細かく
    const RIQ = repeat('o.x.o.x.o.x.o.x.', 8, '|');

    const mideast = {
        title: '砂の回廊',
        tags: ['神秘的'],
        genre: 'ワールド',
        melody: ['lead'],
        bpm: 104,
        gain: 0.058,
        reverb: { seconds: 2.6, tone: 0.45 },
        delay: { time: 0.75, feedback: 0.26, tone: 2400, reverb: 0.3 },
        humanize: { time: 0.007, velocity: 0.1 },
        parts: {
            lead: { instrument: 'piano', volume: 0.8, pan: -0.08, reverb: 0.26, delay: 0.12 },
            // ウード：暗めにはじき、短めに止める
            oud: { instrument: 'pluck', brightness: 0.55, sustain: 0.994, gate: 1.2, volume: 0.95, pan: 0.28, reverb: 0.22, delay: 0.12 },
            drone: { instrument: 'pad', volume: 0.55, cutoff: 650, attack: 1.2, release: 2, reverb: 0.4 },
            pad: { instrument: 'pad', mode: 'chords', center: 'A3', voices: 3, volume: 0.5, cutoff: 900, reverb: 0.45 },
            bass: { instrument: 'pluck', mode: 'bass', octave: 2, brightness: 0.3, sustain: 0.995, release: 0.12, volume: 1.25, gate: 0.9 },
            drums: { instrument: 'drums', kit: 'soft', mode: 'drums', volume: 1.25, levels: { tom: 0.7, rim: 0.5, shaker: 0.45 } }
        },
        sections: {
            // イントロ：ドローンの上で、ウードが一人で歌い出す。最後の Bb から A へ
            intro: {
                label: 'イントロ',
                chords: 'A | A7b9 | Gm/A | Bb/A',
                oud: 'A3:4 r:4 C#4:2 D4:1 C#4:1 E4:4 | r:2 D4:1 C#4:1 Bb3:2 C#4:2 A3:8 | G3:4 Bb3:2 A3:2 D4:4 r:4 | F4:2 E4:2 D4:4 C#4:8',
                drone: '[A2,E3]:64',
                drums: { tom: '................|................|o.......o.......|x.......x.x.x.xx' }
            },
            A: {
                chords: CHORDS_A,
                lead: THEME,
                oud: OUD_RIFF,
                drone: DRONE_A,
                bass: 'R:6 r:2 R:6 r:2',
                drums: withFill(MAQSUM)
            },
            // A'：ウードが刻みをやめて答える側に回り、タクに弱い音を足す
            A2: {
                label: "A'",
                chords: CHORDS_A2,
                lead: THEME_END,
                oud: OUD_ANSWER2,
                drone: DRONE_A,
                bass: 'R:6 r:2 R:6 r:2',
                drums: withFill(MAQSUM_GHOST)
            },
            // B：ニ短調へ寄り、ドローンも和音に合わせて動く。パッドとリクを足して広げる
            B: {
                chords: 'Dm | Dm | Gm | A7b9 | Dm | Bbmaj7 | Gm | A',
                lead: `A5:8 F5:4 A5:4 | D6:8 C#6:2 D6:2 A5:4 | Bb5:6 A5:2 G5:8 | G5:4 Bb5:4 C#6:8 |
                       D6:6 C#6:1 D6:1 A5:8 | F5:4 A5:4 D6:8 | D6:4 Bb5:4 G5:4 Bb5:4 | A5:8 C#5:4 E5:4`,
                oud: `D4:2 r:2 F4:2 A3:2 D4:2 r:2 F4:2 E4:2 | D4:2 r:2 F4:2 A3:2 D4:2 r:2 F4:2 E4:2 |
                      G3:2 r:2 Bb3:2 D4:2 G4:2 r:2 D4:2 Bb3:2 | A3:2 r:2 C#4:2 E4:2 G4:2 r:2 Bb3:2 C#4:2 |
                      D4:2 r:2 F4:2 A3:2 D4:2 r:2 F4:2 E4:2 | Bb3:2 r:2 D4:2 F4:2 A4:2 r:2 F4:2 D4:2 |
                      G3:2 r:2 Bb3:2 D4:2 G4:2 r:2 D4:2 Bb3:2 | A3:2 r:2 C#4:2 E4:2 A4:2 r:2 E4:2 C#4:2`,
                drone: '[A2,D3]:32 | [G2,D3]:16 | E3:16 | [A2,D3]:16 | [Bb2,F3]:16 | [G2,D3]:16 | [A2,E3]:16',
                pad: 'hold',
                bass: 'R:6 r:2 R:6 r:2',
                drums: withFill(MAQSUM_GHOST, { shaker: RIQ })
            },
            // C（休憩）：主題はほとんど休み、ウードが高めで歌う。打楽器はドゥムだけ弱く
            C: {
                chords: 'A | A7b9 | Gm | Gm | Dm | Dm | Gm | Bb',
                lead: 'r:16 | r:16 | r:16 | D5:8 Bb4:8 | r:16 | r:16 | r:16 | D5:8 F5:8',
                oud: `E4:2 F4:1 E4:1 C#4:4 r:2 Bb3:1 C#4:1 A3:4 | r:4 A3:2 C#4:2 E4:2 G4:2 Bb4:4 |
                      A4:4 G4:4 r:2 F4:1 E4:1 D4:4 | r:16 |
                      D4:2 E4:1 F4:1 A4:4 r:2 G4:1 F4:1 E4:4 | F4:2 E4:2 D4:4 C#4:2 D4:2 A3:4 |
                      G4:4 Bb4:4 A4:2 G4:2 F4:2 E4:2 | r:16`,
                drone: '[A2,E3]:32 | [G2,D3]:32 | [A2,D3]:32 | [G2,D3]:16 | [Bb2,F3]:16',
                bass: 'R:12 r:4',
                drums: {
                    tom: repeat('o.......o.......', 7, '|') + '|o.......x.x.x.xx',
                    rim: repeat('............o...', 8, '|')
                }
            },
            // A をもう一度：ウードが答え、リクを足す
            A3: {
                label: 'A',
                chords: CHORDS_A,
                lead: THEME,
                oud: OUD_ANSWER,
                drone: DRONE_A,
                bass: 'R:6 r:2 R:6 r:2',
                drums: withFill(MAQSUM, { shaker: RIQ })
            },
            // ループの終わり：ウードの刻みに戻り、Bb で終えて頭の A へ
            A4: {
                label: "A'",
                chords: CHORDS_A4,
                lead: THEME_LAST,
                oud: OUD_RIFF_LAST,
                drone: '[A2,E3]:64 | [A2,D3]:16 | [G2,D3]:16 | [A2,E3]:16 | [Bb2,F3]:16',
                bass: 'R:6 r:2 R:6 r:2',
                drums: withFill(MAQSUM_GHOST, { shaker: RIQ })
            }
        },
        intro: ['intro'],
        loop: ['A', 'A2', 'B', 'C', 'A3', 'A4']
    };

    SoundKit.register('catalog', { songs: { mideast } });
})();
