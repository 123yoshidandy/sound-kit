/**
 * mine-blocks の BGM の候補：ことのは庭（和風）
 * ニ長調のヨナ抜き音階（D E F# A B）。B は ロ短調寄りの民謡音階で、C はメロディを休ませて琴だけで歌う
 * 尺八（息の多いフルート）の長い音・風鈴（高いベル）・締めの太鼓（高中低のタム）で、和の色を足す
 */
(function () {
    const { repeat } = SoundKit;

    // 8小節の最後で、締め太鼓から大太鼓へ打ち下ろす
    const TAIKO_FILL = {
        tomHigh: repeat('................', 7, '|') + '|........x.x.....',
        tomMid: repeat('................', 7, '|') + '|............x...',
        tomLow: repeat('................', 7, '|') + '|..............x.'
    };

    const wafu = {
        title: 'ことのは庭',
        tags: ['落ち着いた'],
        genre: 'ワールド',
        melody: ['lead'],
        bpm: 92,
        gain: 0.063,
        reverb: { seconds: 2.6, tone: 0.45 },
        delay: { time: 0.75, feedback: 0.28, tone: 2400, reverb: 0.3 },
        humanize: { time: 0.008, velocity: 0.1 },
        parts: {
            lead: { instrument: 'piano', volume: 0.76, pan: -0.1, reverb: 0.28, delay: 0.14 },
            // 琴：明るくはじいて、長めに響かせる
            koto: { instrument: 'pluck', mode: 'arp', from: 'A3', brightness: 0.85, sustain: 0.997, gate: 2.5, volume: 1.06, pan: 0.3, reverb: 0.25, delay: 0.1 },
            // 琴の合いの手：メロディが伸ばしている所や休みに、高めで答える
            fill: { instrument: 'pluck', brightness: 0.9, sustain: 0.996, gate: 2, volume: 1.5, pan: 0.35, reverb: 0.3, delay: 0.2 },
            bass: { instrument: 'pluck', mode: 'bass', octave: 2, brightness: 0.3, sustain: 0.995, release: 0.15, volume: 0.98, gate: 0.95 },
            // 尺八：息の音を多めにして、ゆっくり揺らす
            shaku: { instrument: 'flute', volume: 0.47, pan: -0.3, attack: 0.12, release: 0.3, breath: 0.14, vibrato: 18, reverb: 0.45, delay: 0.12 },
            // 風鈴：高く、小さく
            chime: { instrument: 'bell', volume: 0.55, pan: 0.45, decay: 1.6, reverb: 0.5, delay: 0.25 },
            pad: { instrument: 'pad', mode: 'chords', center: 'A3', voices: 3, volume: 0.41, cutoff: 900, reverb: 0.5 },
            // 弦楽器：最後の A で、パッドに替えて低く敷く
            strings: { instrument: 'strings', mode: 'chords', center: 'D4', voices: 3, volume: 0.48, pan: 0.15, attack: 0.4, release: 0.6, brightness: 0.7, reverb: 0.45 },
            // 太鼓風：kick を大太鼓、tom を締め太鼓、rim を縁打ちに見立てる
            drums: { instrument: 'drums', kit: 'soft', mode: 'drums', volume: 0.9, levels: { kick: 0.8, tom: 0.6, rim: 0.45, tomHigh: 0.5, tomMid: 0.55, tomLow: 0.65 } }
        },
        sections: {
            intro: {
                label: 'イントロ',
                chords: 'D | G/D | Em7 | Asus4:8 A:8',
                koto: '0:2 2 3 r 4 3 2 r',
                fill: 'r:8 A5:2 B5:2 D6:4 | r:16 | r:8 E5:2 F#5:2 A5:4 | r:16',
                shaku: 'A4:12 r:4 | B4:8 D5:8 | E5:12 D5:4 | E5:16',
                bass: { pattern: 'r:16 | r:16 | R:16 | R:8 R:8' },
                drums: { tom: '................|................|................|........x...x.x.' }
            },
            A: {
                chords: 'D | Bm7 | G | Asus4:8 A:8 | D | Em7 | Gsus2:8 Asus4:8 | Asus4:8 A:8',
                lead: `A4:4 D5:3 E5:1 F#5:6 E5:2 | F#5:3 E5:1 D5:4 B4:8 | B4:4 D5:4 E5:6 D5:2 | E5:2 F#5:2 E5:4 A4:6 r:2 |
                       A4:4 D5:3 E5:1 F#5:4 A5:4 | B5:6 A5:2 F#5:4 E5:4 | D5:4 E5:4 A5:6 B5:2 | A5:6 F#5:2 E5:8`,
                koto: '0:2 2 3 r 4 3 2 r',
                bass: 'R:6 R:2 5:8',
                drums: {
                    kick: repeat('x.........x.....', 8, '|'),
                    rim: repeat('....o.......o...', 8, '|')
                }
            },
            A2: {
                label: "A'",
                chords: 'D | Bm7 | G | Asus4:8 A:8 | D | Bm7 | Em7:8 Asus4:8 | D',
                lead: `A4:4 D5:3 E5:1 F#5:6 E5:2 | F#5:3 E5:1 D5:4 B4:8 | B4:4 D5:4 E5:6 D5:2 | E5:2 F#5:2 E5:4 A4:6 r:2 |
                       A4:4 D5:3 E5:1 F#5:4 A5:4 | B5:4 A5:2 F#5:2 A5:8 | F#5:3 E5:1 D5:4 B4:4 E5:4 | D5:12 r:4`,
                koto: '0:2 2 3 r 4 3 2 r',
                bass: 'R:6 R:2 5:8',
                drums: {
                    kick: repeat('x.........x.....', 8, '|'),
                    rim: repeat('....o.......o...', 8, '|'),
                    tom: repeat('................', 3, '|') + '|............x.x.|' + repeat('................', 4, '|'),
                    ...TAIKO_FILL
                }
            },
            B: {
                chords: 'Bm7 | Em7 | G | Asus4:8 A:8 | Bm7 | Em7 | Gsus2:8 Asus4:8 | D',
                lead: `F#5:4 A5:4 B5:8 | D6:3 B5:1 A5:4 B5:8 | A5:3 F#5:1 E5:4 D5:8 | E5:4 F#5:2 E5:2 A4:8 |
                       D5:3 E5:1 F#5:4 B5:8 | D6:6 B5:2 A5:4 F#5:4 | E5:4 D5:4 E5:6 F#5:2 | A5:4 F#5:4 D5:8`,
                koto: '0:2 1 2 3 4 3 2 1',
                shaku: 'D5:16 | B4:12 D5:4 | D5:8 B4:8 | E5:16 | F#5:12 E5:4 | E5:8 D5:8 | D5:16 | A4:16',
                pad: 'hold',
                bass: 'R:4 r:4 R:4 5:4',
                drums: {
                    kick: repeat('x.......x.......', 8, '|'),
                    tom: repeat('................|............x.x.', 3, '|') + '|................|................',
                    ...TAIKO_FILL
                }
            },
            C: {
                label: 'C',
                chords: 'Gsus2 | D/F# | Em7 | Bm7 | Gsus2 | D/F# | Em7 | Asus4:8 A:8',
                // 長い音は4度・5度の重音にして、琴らしく「シャン」と鳴らす
                fill: `r:4 A5:2 B5:2 [G5,D6]:8 | r:4 F#5:2 E5:2 [A4,D5]:8 | r:4 E5:2 A5:2 [E5,B5]:8 | r:4 A5:2 F#5:2 [A4,D5]:8 |
                       r:4 A5:2 B5:2 [G5,D6]:4 E6:4 | D6:4 B5:2 A5:2 [D5,F#5]:8 | E5:4 F#5:2 A5:2 [E5,B5]:8 | [E5,A5]:8 r:4 E5:2 F#5:2`,
                chime: 'r:16 | r:8 A6:2@0.6 F#6:6@0.5 | r:16 | r:8 B6:2@0.6 F#6:6@0.5 | r:16 | r:8 A6:2@0.6 D6:6@0.5 | r:16 | r:8 E6:2@0.6 A6:6@0.5',
                koto: '0:4 2:2 3 4 3 2 1',
                pad: 'hold',
                bass: 'R:16',
                drums: {
                    kick: repeat('o...............', 8, '|'),
                    tom: repeat('................', 7, '|') + '|........x...x.x.'
                }
            },
            A3: {
                label: 'A',
                chords: 'D | Bm7 | G | Asus4:8 A:8 | D | Em7 | Gsus2:8 Asus4:8 | Asus4:8 A:8',
                lead: `A4:4 D5:3 E5:1 F#5:6 E5:2 | F#5:3 E5:1 D5:4 B4:8 | B4:4 D5:4 E5:6 D5:2 | E5:2 F#5:2 E5:4 A4:6 r:2 |
                       A4:4 D5:3 E5:1 F#5:4 A5:4 | B5:6 A5:2 F#5:4 E5:4 | D5:4 E5:4 A5:6 B5:2 | A5:6 F#5:2 E5:8`,
                fill: `r:8 A5:2 D6:2 r:4 | r:10 D6:2 B5:2 A5:2 | r:10 B5:2 D6:4 | r:8 A5:2 B5:2 E6:4 |
                       r:16 | r:16 | r:16 | r:12 A5:2 B5:2`,
                koto: '0:2 2 3 r 4 3 2 r',
                strings: 'hold',
                bass: 'R:6 R:2 5:8',
                drums: {
                    kick: repeat('x.........x.....', 8, '|'),
                    rim: repeat('....o.......o...', 8, '|'),
                    tom: repeat('................', 7, '|') + '|........x...x.x.'
                }
            }
        },
        intro: ['intro'],
        loop: ['A', 'A2', 'B', 'C', 'A3']
    };

    SoundKit.register('mine-blocks', { songs: { wafu } });
})();
