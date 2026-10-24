/**
 * 曲の一覧：真夜中のスウィング（スウィングジャズ。ピアノトリオにビブラフォンを少し）
 * ブラシとライドのドラム、サビのホーンの背景、A' のクラリネット（サックス代わり）の対旋律で、小さなコンボにする
 */
(function () {
    const { repeat } = SoundKit;

    // ライドシンバルの「チーン・チキ」（4分と、はねた8分の裏）
    const RIDE = 'x...x.o.x...x.o.';
    // ブラシのスネアは2拍目と4拍目に軽く
    const BRUSH = '....o.......o...';
    // ピアノの伴奏（2小節で1組）。1拍目と2拍目の裏を短く押さえる、チャールストンの形
    const COMP = 'x--...o-........|......o-....x--.';
    const COMP_B = 'x--...o-....x-..|..o-....x--...o-';
    // ブラシを回す「シャー」と、2拍目・4拍目のハイハットのペダル
    const SWISH = 'o...o...o...o...';
    const PEDAL = '....x.......x...';

    // A' のクラリネット：低めに伸ばして、主旋律を支える
    const SAX = 'A4:16 | F4:16 | Bb4:16 | Bb4:8 G4:8 | Bb4:8 A4:8 | D5:16 | Bb4:16 | A4:16';

    // スウィングジャズ：ウォーキングベースとブラシの上で、ピアノが ii-V-I を歌う
    const swing = {
        title: '真夜中のスウィング',
        tags: ['軽快', 'おしゃれ'],
        genre: 'ジャズ・ブルース',
        melody: ['lead'],
        bpm: 132,
        swing: 0.22,
        swingUnit: 2,
        gain: 0.075,
        reverb: { seconds: 2, tone: 0.45 },
        delay: { time: 0.75, feedback: 0.2, tone: 2400, reverb: 0.25 },
        humanize: { time: 0.008, velocity: 0.12 },
        parts: {
            lead: { instrument: 'piano', volume: 0.62, pan: -0.1, brightness: 0.85, reverb: 0.2, delay: 0.08 },
            comp: { instrument: 'piano', mode: 'chords', center: 'E4', voices: 3, decay: 0.6, brightness: 0.7, volume: 0.5, pan: 0.2, reverb: 0.22 },
            vibes: { instrument: 'vibes', volume: 0.6, pan: 0.3, reverb: 0.35, delay: 0.15 },
            sax: { instrument: 'clarinet', volume: 0.55, pan: -0.3, attack: 0.06, release: 0.2, vibrato: 12, reverb: 0.3 },
            // ホーンの背景：柔らかく伸ばす
            horns: { instrument: 'brass', mode: 'chords', center: 'F4', voices: 3, volume: 0.5, pan: 0.25, brightness: 1.5, attack: 0.08, release: 0.3, reverb: 0.35 },
            bass: { instrument: 'pluck', mode: 'bass', octave: 2, brightness: 0.35, sustain: 0.995, release: 0.1, volume: 0.72, gate: 0.92 },
            drums: { instrument: 'drums', kit: 'brush', mode: 'drums', volume: 2.2, cutoff: 9000, levels: { kick: 0.6, snare: 0.8, swish: 0.5, hat: 0.45, ride: 0.7, rim: 0.6, crash: 0.25 } }
        },
        sections: {
            intro: {
                label: 'イントロ',
                chords: 'Gm7 | C7 | Am7:8 D7:8 | Gm7:8 C7:8',
                comp: COMP,
                bass: 'G2:4 A2 Bb2 B2 | C3 Bb2 G2 Bb2 | A2 C3 D3 Ab2 | G2 Bb2 C3 E2',
                drums: {
                    ride: repeat(RIDE, 4, '|'),
                    snare: '................|................|' + BRUSH + '|....o...o...o.o.'
                }
            },
            A: {
                chords: 'Fmaj7 | Dm7 | Gm7 | C7 | Am7 | D7 | Gm7 | C7',
                lead: `r:2 C5:2 F5:2 A5:2 C6:8 | A5:2 G5:2 F5:4 D5:8 | r:2 D5:2 G5:2 Bb5:2 D6:6 C6:2 | Bb5:4 G5:4 E5:8 |
                       r:2 E5:2 A5:2 C6:2 E6:6 D6:2 | C6:4 A5:2 F#5:2 D5:8 | r:2 F5:2 A5:2 G5:2 D5:4 F5:4 | E5:6 G5:2 Bb5:4 r:4`,
                comp: COMP,
                bass: `F2:4 A2 C3 C#3 | D3 C3 A2 Ab2 | G2 A2 Bb2 B2 | C3 E2 G2 Bb2 |
                       A2 C3 E3 Eb3 | D3 C3 A2 Ab2 | G2 Bb2 D3 Db3 | C3 Bb2 G2 E2`,
                drums: {
                    ride: repeat(RIDE, 8, '|'),
                    swish: repeat(SWISH, 8, '|'),
                    hat: repeat(PEDAL, 8, '|'),
                    snare: repeat(BRUSH, 8, '|'),
                    kick: repeat('o...............', 8, '|')
                }
            },
            // A の後半を IV（Bbmaj7）へ寄り道させ、I で終える
            A2: {
                label: "A'",
                chords: 'Fmaj7 | Dm7 | Gm7 | C7 | Cm7:8 F7:8 | Bbmaj7 | Gm7:8 C7:8 | Fmaj7',
                lead: `r:2 C5:2 F5:2 A5:2 C6:8 | A5:2 G5:2 F5:4 D5:8 | r:2 D5:2 G5:2 Bb5:2 D6:6 C6:2 | Bb5:4 G5:4 E5:8 |
                       r:2 G5:2 Bb5:2 G5:2 A5:4 C6:4 | D6:6 C6:2 Bb5:4 F5:4 | r:2 G5:2 Bb5:2 A5:2 G5:4 E5:4 | F5:12 r:4`,
                sax: SAX,
                comp: COMP,
                bass: `F2:4 A2 C3 C#3 | D3 C3 A2 Ab2 | G2 A2 Bb2 B2 | C3 E3 G2 B2 |
                       C3 Eb3 F2 A2 | Bb2 D3 F2 Ab2 | G2 Bb2 C3 E2 | F2 A2 C3 B2`,
                drums: {
                    ride: repeat(RIDE, 8, '|'),
                    swish: repeat(SWISH, 8, '|'),
                    hat: repeat(PEDAL, 8, '|'),
                    snare: repeat('....o.....o.o...', 7, '|') + '|....o...o...o.o.',
                    kick: repeat('o.......o.......', 8, '|')
                }
            },
            // サビ：IV への ii-V（Cm7 F7）から始まり、ii-V で A へ戻る。ブラシの刻みを足す
            B: {
                chords: 'Cm7 | F7 | Bbmaj7 | Bbmaj7 | Am7 | D7 | Gm7 | C7',
                lead: `r:2 G5:2 Bb5:2 C6:2 Eb6:6 D6:2 | C6:4 A5:2 F5:2 Eb5:8 | D5:2 F5:2 A5:4 Bb5:8 | r:4 D6:2 C6:2 Bb5:4 F5:4 |
                       E5:2 G5:2 C6:4 E6:8 | D6:4 C6:2 A5:2 F#5:8 | G5:2 Bb5:2 D6:4 C6:2 Bb5:2 A5:4 | G5:6 E5:2 C5:4 r:4`,
                comp: COMP_B,
                // Bbmaj7 の小節は休む（長7度の A が、主旋律の Bb とぶつかる）
                horns: repeat('x-----------....', 2, '|') + '|................|................|' + repeat('x-----------....', 4, '|'),
                bass: `C3:4 Eb3 G2 Gb2 | F2 A2 C3 B2 | Bb2 C3 D3 F3 | Bb2 A2 G2 Bb2 |
                       A2 C3 E3 Eb3 | D3 C3 A2 Ab2 | G2 Bb2 D3 Db3 | C3 E2 G2 Bb2`,
                drums: {
                    ride: repeat(RIDE, 8, '|'),
                    swish: repeat(SWISH, 8, '|'),
                    hat: repeat(PEDAL, 8, '|'),
                    snare: repeat(BRUSH, 7, '|') + '|....o...o.o.o.o.',
                    kick: repeat('o.........o.....', 8, '|')
                }
            },
            // 休憩：ピアノの主旋律とブラシを抜き、ベースは2分音符に。ビブラフォンが短く歌う
            C: {
                chords: 'Am7 | D7 | Gm7 | C7 | Fmaj7 | D7b9 | Gm7 | C7',
                vibes: `r:4 E5:2 G5:2 C6:8 | r:4 F#5:2 A5:2 C6:8 | r:4 D5:2 F5:2 Bb5:8 | r:4 E5:2 G5:2 Bb5:8 |
                        r:4 A5:2 C6:2 E6:8 | r:4 F#5:2 A5:2 Eb6:8 | r:4 Bb5:2 A5:2 G5:8 | r:8 E5:4 G5:4`,
                comp: 'x--.......o-....|....o-..x--.....',
                bass: 'A2:8 E2 | D3 A2 | G2 D2 | C3 G2 | F2 C3 | D3 A2 | G2 D3 | C3:4 Bb2 G2 E2',
                drums: {
                    ride: repeat('o...o.o.o...o.o.', 8, '|'),
                    rim: repeat('............o...', 8, '|')
                }
            },
            // A に、ビブラフォンの合いの手を足す
            A3: {
                label: 'A',
                chords: 'Fmaj7 | Dm7 | Gm7 | C7 | Am7 | D7 | Gm7 | C7',
                lead: `r:2 C5:2 F5:2 A5:2 C6:8 | A5:2 G5:2 F5:4 D5:8 | r:2 D5:2 G5:2 Bb5:2 D6:6 C6:2 | Bb5:4 G5:4 E5:8 |
                       r:2 E5:2 A5:2 C6:2 E6:6 D6:2 | C6:4 A5:2 F#5:2 D5:8 | r:2 F5:2 A5:2 G5:2 D5:4 F5:4 | E5:6 G5:2 Bb5:4 r:4`,
                vibes: 'r:16 | r:10 A5:2 F5:4 | r:16 | r:10 C6:2 Bb5:4 | r:16 | r:10 A5:2 F#5:4 | r:16 | r:16',
                comp: COMP_B,
                bass: `F2:4 A2 C3 C#3 | D3 C3 A2 Ab2 | G2 A2 Bb2 B2 | C3 E2 G2 Bb2 |
                       A2 C3 E3 Eb3 | D3 C3 A2 Ab2 | G2 Bb2 D3 Db3 | C3 Bb2 G2 E2`,
                drums: {
                    ride: repeat(RIDE, 8, '|'),
                    swish: repeat(SWISH, 8, '|'),
                    hat: repeat(PEDAL, 8, '|'),
                    snare: repeat(BRUSH, 8, '|'),
                    kick: repeat('o.......o.......', 8, '|')
                }
            },
            // ループの終わり：ii-V（Gm7 C7）で終えて、頭の Fmaj7 へ戻る
            A4: {
                label: "A'",
                chords: 'Fmaj7 | Dm7 | Gm7 | C7 | Cm7:8 F7:8 | Bbmaj7 | Am7:8 D7:8 | Gm7:8 C7:8',
                lead: `r:2 C5:2 F5:2 A5:2 C6:8 | A5:2 G5:2 F5:4 D5:8 | r:2 D5:2 G5:2 Bb5:2 D6:6 C6:2 | Bb5:4 G5:4 E5:8 |
                       r:2 G5:2 Bb5:2 G5:2 A5:4 C6:4 | D6:6 C6:2 Bb5:4 F5:4 | r:2 E5:2 G5:2 C6:2 A5:4 F#5:4 | G5:4 F5:2 D5:2 E5:4 G5:4`,
                comp: COMP,
                horns: repeat('................', 4, '|') + '|x-----..x-----..|................|' + repeat('x-----..x-----..', 2, '|'),
                bass: `F2:4 A2 C3 C#3 | D3 C3 A2 Ab2 | G2 A2 Bb2 B2 | C3 E3 G2 B2 |
                       C3 Eb3 F2 A2 | Bb2 D3 C3 Bb2 | A2 C3 D3 Ab2 | G2 Bb2 C3 E2`,
                drums: {
                    ride: repeat(RIDE, 8, '|'),
                    swish: repeat(SWISH, 8, '|'),
                    hat: repeat(PEDAL, 8, '|'),
                    snare: repeat(BRUSH, 7, '|') + '|....o...o...o.o.',
                    kick: repeat('o.......o.......', 8, '|')
                }
            }
        },
        intro: ['intro'],
        loop: ['A', 'A2', 'B', 'C', 'A3', 'A4']
    };

    SoundKit.register('catalog', { songs: { swing } });
})();
