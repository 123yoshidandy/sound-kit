/**
 * 曲の一覧：丘の上のジグ（アイルランドのジグ・8分の6拍子）
 * 1小節は12ステップ（付点4分音符×2）。8分音符3つずつのまとまりで書く
 * A はニ長調のミクソリディアン（C の和音で ♭7 を響かせる）、B はホ短調のドリアン（A の和音で ♮6 を響かせる）
 */
(function () {
    const { repeat } = SoundKit;

    // A の主題（前半6小節は、どの A でも同じ）
    const A_HEAD = `D5:4 A4:2 D5:4 F#5:2 | G5:4 E5:2 C5:2 D5:2 E5:2 | F#5:2 A5:2 F#5:2 D5:6 | E5:4 G5:2 B5:4 A5:2 |
                    A5:4 F#5:2 A5:4 D6:2 | C6:4 G5:2 E5:4 G5:2`;
    // A の終わり：A7sus4 → A で止めて、頭の D へ戻る
    const A_END_HALF = `G5:2 F#5:2 E5:2 B4:4 E5:2 | D5:2 E5:2 F#5:2 E5:4 C#5:2`;
    // A' の終わり：C → D（ミクソリディアンの終止）で落ち着いてから、B の B5 へ上がる
    const A_END_FULL = `B5:2 A5:2 G5:2 E5:4 C5:2 | D5:6 E5:2 F#5:2 A5:2`;

    // B の主題（前半6小節は、どの B でも同じ）
    const B_HEAD = `B5:4 G5:2 E5:4 G5:2 | A5:4 F#5:2 D5:2 E5:2 F#5:2 | E5:2 G5:2 B5:2 D6:4 B5:2 | A5:4 C#6:2 B5:2 A5:2 E5:2 |
                    B5:4 E6:2 D6:2 B5:2 A5:2 | F#5:4 A5:2 D6:4 A5:2`;
    const B_TURN = 'G5:2 C6:2 G5:2 E5:4 G5:2';

    // 笛の対旋律：メロディの上で長く伸ばす
    const DESCANT_A_HEAD = 'A5:6 D6:6 | E6:12 | D6:12 | E6:6 D6:6 | D6:6 F#6:6 | E6:12';

    const A_CHORDS = 'D | C | D | Em | D | C | Em | A7sus4:6 A:6';
    const A2_CHORDS = 'D | C | D | Em | D | C | G:6 C:6 | D';
    const B_CHORDS = 'Em | D | Em | A | Em | D | C | D';
    const B3_CHORDS = 'Em | D | Em | A | Em | D | C | A7sus4:6 A:6';

    // ドラム：kick と tom をバウロン（枠太鼓）、shaker と hat をタンバリンに見立てる
    const DRUMS_A = {
        kick: repeat('x.....x.....', 8, '|'),
        shaker: repeat('..o.o...o.o.', 8, '|')
    };
    const DRUMS_A2 = {
        kick: repeat('x.....x.....', 8, '|'),
        shaker: repeat('x.o.o.x.o.o.', 8, '|'),
        hat: repeat('....o.....o.', 8, '|')
    };
    const DRUMS_B = {
        kick: repeat('x...........', 8, '|'),
        tom: repeat('......x...o.', 8, '|'),
        shaker: repeat('x.o.o.x.o.o.', 8, '|')
    };
    const DRUMS_B2 = { ...DRUMS_B, hat: repeat('....o.....o.', 8, '|') };

    const celtic = {
        title: '丘の上のジグ',
        tags: ['軽快', 'のどか', 'ケルト'], meter: '6/8',
        genre: 'ワールド',
        melody: ['lead'],
        bpm: 126,
        stepsPerBar: 12,
        gain: 0.046,
        reverb: { seconds: 2.2, tone: 0.5 },
        delay: { time: 1.5, feedback: 0.2, tone: 2400, reverb: 0.3 },
        humanize: { time: 0.006, velocity: 0.1 },
        parts: {
            lead: { instrument: 'piano', volume: 0.95, decay: 0.7, brightness: 0.9, release: 0.15, pan: -0.1, reverb: 0.22, delay: 0.08 },
            // 笛：息の音を少なくして、ティンホイッスルのような澄んだ音にする
            whistle: { instrument: 'flute', volume: 0.58, vibrato: 5, breath: 0.03, attack: 0.04, pan: 0.25, reverb: 0.3, delay: 0.15 },
            // はじく弦の分散和音（ブズーキやハープのつもり）
            harp: { instrument: 'pluck', mode: 'arp', from: 'A3', brightness: 0.7, sustain: 0.996, volume: 1.15, pan: 0.2, reverb: 0.25 },
            bass: { instrument: 'pluck', mode: 'bass', octave: 2, brightness: 0.35, sustain: 0.995, release: 0.15, volume: 1.1, gate: 0.9 },
            // バグパイプ風のドローン（D と A を伸ばす）。イントロと C だけ
            drone: { instrument: 'pad', volume: 0.45, cutoff: 700, attack: 1, pan: -0.15, reverb: 0.4 },
            drums: { instrument: 'drums', kit: 'soft', mode: 'drums', volume: 1.5, levels: { kick: 0.55, tom: 0.5, shaker: 0.7, hat: 0.35 } }
        },
        sections: {
            intro: {
                label: 'イントロ',
                chords: 'D | C | D | A7sus4:6 A:6',
                harp: '0:2 1 2 3 2 1',
                drone: '[D3,A3]:12 | [D3,A3]:12 | [D3,A3]:12 | r:12',
                bass: 'r:12 | r:12 | R:6 5:6 | R:6 R:6',
                drums: { shaker: '............|............|............|..o.o...o.o.' }
            },
            A: {
                chords: A_CHORDS,
                lead: `${A_HEAD} | ${A_END_HALF}`,
                harp: '0:2 1 2 3 2 1',
                bass: 'R:6 5:6',
                drums: DRUMS_A
            },
            // A'：笛が上で伸ばし、タンバリンを増やす
            A2: {
                label: "A'",
                chords: A2_CHORDS,
                lead: `${A_HEAD} | ${A_END_FULL}`,
                whistle: `${DESCANT_A_HEAD} | D6:6 C6:6 | A5:12`,
                harp: '0:2 1 2 3 2 1',
                bass: 'R:6 5:6',
                drums: DRUMS_A2
            },
            // B：ドリアンの響き。分散和音の形を変え、バウロンを tom に
            B: {
                chords: B_CHORDS,
                lead: `${B_HEAD} | ${B_TURN} | F#5:4 D5:2 A5:6`,
                harp: '0:2 2 3 1 2 3',
                bass: 'R:4 r:2 5:4 r:2',
                drums: DRUMS_B
            },
            // B'：笛がメロディの下で和音を伸ばす
            B2: {
                label: "B'",
                chords: B_CHORDS,
                lead: `${B_HEAD} | ${B_TURN} | D5:6 r:2 E5:2 F#5:2`,
                whistle: 'G5:12 | F#5:12 | B5:12 | A5:12 | G5:12 | A5:12 | G5:12 | F#5:12',
                harp: '0:2 2 3 1 2 3',
                bass: 'R:4 r:2 5:4 r:2',
                drums: DRUMS_B2
            },
            // C：休憩。ドラムとベースを抜き、ドローンの上でピアノと笛がゆっくり歌い交わす
            C: {
                chords: 'Em | D | C | D | Em | D | C | A7sus4',
                lead: `G5:6 B5:6 | A5:12 | G5:6 E5:4 D5:2 | F#5:12 |
                       B5:6 D6:6 | A5:6 F#5:6 | E5:6 G5:4 E5:2 | E5:6 A4:6`,
                whistle: 'r:12 | r:6 D6:2 E6:2 F#6:2 | E6:12 | r:12 | r:12 | r:6 A5:2 B5:2 D6:2 | E6:6 D6:6 | r:12',
                harp: '0:4 1 2',
                drone: repeat('[D3,A3]:12', 8, ' | '),
                drums: { shaker: repeat('............', 7, '|') + '|..o.o...o.o.' }
            },
            A3: {
                label: "A'",
                chords: A2_CHORDS,
                lead: `${A_HEAD} | ${A_END_FULL}`,
                whistle: `${DESCANT_A_HEAD} | D6:6 C6:6 | A5:12`,
                harp: '0:2 1 2 3 2 1',
                bass: 'R:6 5:6',
                drums: DRUMS_A2
            },
            // 最後の B：笛が高く伸ばして盛り上げ、A へ戻る
            B3: {
                label: 'B',
                chords: B3_CHORDS,
                lead: `${B_HEAD} | ${B_TURN} | D5:2 E5:2 F#5:2 E5:4 C#5:2`,
                whistle: 'E6:12 | D6:12 | B5:6 E6:6 | C#6:12 | E6:6 D6:6 | F#6:6 D6:6 | E6:6 C6:6 | D6:6 C#6:6',
                harp: '0:2 2 3 1 2 3',
                bass: 'R:4 r:2 5:4 r:2',
                drums: DRUMS_B2
            },
            // 最後の A：笛の対旋律を付けたまま、A7 で頭へ戻る
            A4: {
                label: 'A',
                chords: A_CHORDS,
                lead: `${A_HEAD} | ${A_END_HALF}`,
                whistle: `${DESCANT_A_HEAD} | B5:12 | D6:6 C#6:6`,
                harp: '0:2 1 2 3 2 1',
                bass: 'R:6 5:6',
                drums: {
                    ...DRUMS_A2,
                    tom: repeat('............', 7, '|') + '|......x.o.o.'
                }
            }
        },
        intro: ['intro'],
        loop: ['A', 'A2', 'B', 'B2', 'C', 'A3', 'B3', 'A4']
    };

    SoundKit.register('catalog', { songs: { celtic } });
})();
