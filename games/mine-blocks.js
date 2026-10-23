/**
 * mine-blocks の BGM と効果音
 * 曲の書き方は docs/composing.md にある。長さは16分音符の数で、'|' は小節の区切り
 */

(function () {
    const { repeat } = SoundKit;

    // ===== BGM の候補 =====

    // チップチューン：ファミコンのような音で、軽快に
    const pixel = {
        title: 'ピクセル・ステップ',
        description: 'チップチューン・軽快',
        genre: 'チップチューン',
        melody: ['lead', 'leadB'],   // 主旋律のパート（試聴ページで楽器を替えられる）
        bpm: 132,
        gain: 0.127,
        reverb: { seconds: 1.2, tone: 0.4 },
        delay: { time: 0.75, feedback: 0.22, tone: 2200 },
        parts: {
            lead: { instrument: 'chip', wave: 'pulse', duty: 0.25, level: 0.2, vibrato: 14, sustain: 0.55, decay: 0.35, gate: 0.92, pan: -0.1, delay: 0.14, reverb: 0.08 },
            leadB: { instrument: 'chip', wave: 'pulse', duty: 0.125, level: 0.26, vibrato: 16, sustain: 0.65, decay: 0.4, gate: 0.95, pan: -0.1, delay: 0.18, reverb: 0.1 },
            counter: { instrument: 'chip', wave: 'pulse', duty: 0.5, level: 0.07, sustain: 0.7, pan: 0.3, reverb: 0.1 },
            arp: { instrument: 'chip', wave: 'pulse', duty: 0.125, level: 0.06, decay: 0.12, sustain: 0.2, mode: 'arp', from: 'C5', pan: 0.25, delay: 0.1 },
            bass: { instrument: 'chip', wave: 'triangle', level: 0.12, sustain: 0.85, mode: 'bass', octave: 2, gate: 0.85 },
            drums: { instrument: 'drums', kit: 'chip', mode: 'drums', volume: 0.54, levels: { hat: 0.8 } }
        },
        sections: {
            intro: {
                label: 'イントロ',
                chords: 'C | Am | F | G',
                arp: '0:1 1 2 3 2 1 0 1 2 3 2 1 0 1 2 1',
                bass: 'R:2 R+:2 R:2 R+:2 R:2 R+:2 R:2 R+:2',
                drums: {
                    hat: repeat('x.o.x.o.x.o.x.o.', 4, '|'),
                    kick: '................|................|................|x.......x...x...',
                    snare: '................|................|................|....x.....x.xxxx'
                }
            },
            A: {
                chords: 'C | G/B | Am | Em/G | F | C/E | Dm7 | G',
                lead: `G5:3 E5:1 G5:2 C6:2 B5:2 G5:2 E5:4 | D5:2 G5:2 B5:3 A5:1 G5:2 D5:2 r:4 |
                       C6:3 B5:1 A5:2 E5:2 A5:2 B5:2 C6:4 | B5:2 G5:2 E5:4 r:4 G5:2 A5:2 |
                       A5:3 G5:1 A5:2 C6:2 F6:4 E6:2 C6:2 | E6:3 D6:1 C6:2 G5:2 E5:4 G5:4 |
                       F5:2 A5:2 C6:2 D6:2 C6:2 A5:2 F5:2 A5:2 | G5:4 B5:2 D6:2 r:4 r:2 B5:1 A5:1`,
                bass: 'R:2 R+:2 R:2 R+:2 R:2 R+:2 5:2 R+:2',
                drums: {
                    kick: repeat('x.......x.x.....', 7, '|') + '|x.......x.x.x...',
                    snare: repeat('....x.......x...', 7, '|') + '|....x.......xxxx',
                    hat: repeat('x.o.x.o.x.o.x.o.', 8, '|')
                }
            },
            A2: {
                label: "A'",
                chords: 'C | G/B | Am | Em/G | F | G | C | C7',
                lead: `G5:3 E5:1 G5:2 C6:2 B5:2 G5:2 E5:4 | D5:2 G5:2 B5:3 A5:1 G5:2 D5:2 r:4 |
                       C6:3 B5:1 A5:2 E5:2 A5:2 B5:2 C6:4 | B5:2 G5:2 E5:4 r:4 G5:2 A5:2 |
                       A5:3 G5:1 A5:2 C6:2 F6:4 E6:2 C6:2 | D6:3 C6:1 B5:2 G5:2 D6:4 B5:2 G5:2 |
                       C6:6 G5:2 E5:2 G5:2 C6:4 | r:8 E5:2 G5:2 Bb5:2 C6:2`,
                bass: 'R:2 R+:2 R:2 R+:2 R:2 R+:2 5:2 R+:2',
                drums: {
                    kick: repeat('x.......x.x.....', 8, '|'),
                    snare: repeat('....x.......x...', 7, '|') + '|....x...x.x.x.xx',
                    hat: repeat('x.o.x.o.x.o.x.o.', 8, '|')
                }
            },
            B: {
                chords: 'Fmaj7 | G | Em7 | Am | Dm7 | Em7 | F | G',
                leadB: `A5:6 G5:2 E5:4 C5:4 | D5:6 E5:2 G5:4 B5:4 | B5:6 A5:2 G5:4 E5:4 | A5:8 r:4 C6:2 B5:2 |
                        A5:6 G5:2 F5:4 A5:4 | G5:6 A5:2 B5:4 D6:4 | C6:6 A5:2 F5:4 A5:4 | G5:2 A5:2 B5:2 D6:2 G6:4 r:2 B5:1 A5:1`,
                arp: { pattern: '0:2 2 1 2 3 2 1 2', from: 'G4' },
                bass: 'R:4 r:2 R:2 5:4 R+:4',
                drums: {
                    kick: repeat('x.........x.....', 8, '|'),
                    snare: repeat('........x.......', 7, '|') + '|........x...xxxx',
                    hat: repeat('x...x...x...x...', 8, '|')
                }
            },
            C: {
                chords: 'Am | F | C | G | Am | F | Dm7 | G7sus4:8 G7:8',
                lead: `E5:4 A5:4 C6:6 B5:2 | A5:12 r:4 | G5:4 C6:4 E6:6 D6:2 | D6:12 r:4 |
                       E6:4 D6:2 C6:2 B5:4 C6:4 | A5:12 r:4 | F5:4 A5:4 C6:4 D6:4 | C6:8 B5:4 r:4`,
                arp: { pattern: '0:1 1 2 3', from: 'A4' },
                bass: 'R:6 R:2 5:8',
                drums: {
                    hat: repeat('x.o.x.o.x.o.x.o.', 8, '|'),
                    snare: repeat('................', 7, '|') + '|........x.x.xxxx'
                }
            },
            A3: {
                label: 'A',
                chords: 'C | G/B | Am | Em/G | F | C/E | Dm7 | G',
                lead: `G5:3 E5:1 G5:2 C6:2 B5:2 G5:2 E5:4 | D5:2 G5:2 B5:3 A5:1 G5:2 D5:2 r:4 |
                       C6:3 B5:1 A5:2 E5:2 A5:2 B5:2 C6:4 | B5:2 G5:2 E5:4 r:4 G5:2 A5:2 |
                       A5:3 G5:1 A5:2 C6:2 F6:4 E6:2 C6:2 | E6:3 D6:1 C6:2 G5:2 E5:4 G5:4 |
                       F5:2 A5:2 C6:2 D6:2 C6:2 A5:2 F5:2 A5:2 | G5:4 B5:2 D6:2 r:4 r:2 B5:1 A5:1`,
                counter: 'E5:8 C5:8 | D5:8 B4:8 | C5:8 E5:8 | B4:8 E5:8 | C5:8 F5:8 | G5:8 E5:8 | F5:8 D5:8 | D5:8 B4:8',
                bass: 'R:2 R+:2 R:2 R+:2 R:2 R+:2 5:2 R+:2',
                drums: {
                    kick: repeat('x.......x.x.....', 8, '|'),
                    snare: repeat('....x.......x...', 7, '|') + '|....x.......xxxx',
                    hat: repeat('x.o.x.o.x.o.x.o.', 8, '|')
                }
            },
            A4: {
                label: "A'",
                chords: 'C | G/B | Am | Em/G | F | G | C | G',
                lead: `G5:3 E5:1 G5:2 C6:2 B5:2 G5:2 E5:4 | D5:2 G5:2 B5:3 A5:1 G5:2 D5:2 r:4 |
                       C6:3 B5:1 A5:2 E5:2 A5:2 B5:2 C6:4 | B5:2 G5:2 E5:4 r:4 G5:2 A5:2 |
                       A5:3 G5:1 A5:2 C6:2 F6:4 E6:2 C6:2 | D6:3 C6:1 B5:2 G5:2 D6:4 B5:2 G5:2 |
                       C6:6 G5:2 E5:2 G5:2 C6:4 | r:4 G5:2 A5:2 B5:2 D6:2 r:2 B5:1 A5:1`,
                counter: 'E5:8 C5:8 | D5:8 B4:8 | C5:8 E5:8 | B4:8 E5:8 | C5:8 F5:8 | D5:8 B4:8 | E5:8 G5:8 | D5:8 B4:8',
                bass: 'R:2 R+:2 R:2 R+:2 R:2 R+:2 5:2 R+:2',
                drums: {
                    kick: repeat('x.......x.x.....', 8, '|'),
                    snare: repeat('....x.......x...', 7, '|') + '|....x...x.x.xxxx',
                    hat: repeat('x.o.x.o.x.o.x.o.', 8, '|')
                }
            }
        },
        intro: ['intro'],
        loop: ['A', 'A2', 'B', 'C', 'A3', 'A4']
    };

    // マリンバとベル：明るいパズルゲームらしく
    const hidamari = {
        title: 'ひだまりパズル',
        description: 'マリンバとベル・明るい',
        genre: 'ゲーム音楽',
        melody: ['lead'],
        bpm: 110,
        swing: 0.08,
        gain: 0.06,
        reverb: { seconds: 2.2, tone: 0.5 },
        delay: { time: 0.75, feedback: 0.25, tone: 3000 },
        humanize: { time: 0.006, velocity: 0.08 },
        parts: {
            lead: { instrument: 'marimba', volume: 1, pan: -0.15, reverb: 0.22 },
            comp: { instrument: 'marimba', mode: 'arp', from: 'C4', volume: 0.45, pan: 0.25, reverb: 0.2, decay: 0.8, brightness: 0.7 },
            bell: { instrument: 'bell', volume: 0.45, pan: 0.15, reverb: 0.35, delay: 0.15 },
            bass: { instrument: 'pluck', mode: 'bass', octave: 2, brightness: 0.35, sustain: 0.995, release: 0.1, volume: 0.95, gate: 0.9 },
            pad: { instrument: 'pad', mode: 'chords', center: 'F4', voices: 4, volume: 0.45, cutoff: 1100, reverb: 0.4 },
            drums: { instrument: 'drums', kit: 'soft', mode: 'drums', volume: 0.75, levels: { kick: 0.8, rim: 0.6, shaker: 0.7 } }
        },
        sections: {
            intro: {
                label: 'イントロ',
                chords: 'F | C/E | Dm7 | Csus4:8 C:8',
                comp: '0:2 1 2 3 2 1 2 1',
                bell: 'r:8 C6:2 A5:2 F5:4 | r:16 | r:8 D6:2 A5:2 F5:4 | r:16',
                bass: { pattern: 'r:16 | r:16 | R:8 5:8 | R:8 R:8' },
                drums: { shaker: repeat('oxoxoxoxoxoxoxox', 4, '|') }
            },
            A: {
                chords: 'F | C/E | Dm7 | Am7 | Bbmaj7 | F/A | Gm7 | C7',
                lead: `A4:2 C5:2 F5:3 E5:1 F5:2 A5:2 r:2 G5:2 | E5:2 G5:2 C5:4 r:2 C5:2 D5:2 E5:2 |
                       F5:2 A5:2 D6:3 C6:1 A5:2 F5:2 r:2 E5:2 | E5:2 C5:2 A4:4 r:4 G4:2 A4:2 |
                       Bb4:2 D5:2 F5:3 E5:1 F5:2 A5:2 r:2 D5:2 | C6:2 A5:2 F5:4 r:2 F5:2 G5:2 A5:2 |
                       Bb5:3 A5:1 G5:2 F5:2 G5:2 Bb5:2 D6:2 C6:2 | C6:4 Bb5:2 G5:2 E5:4 r:2 C5:2`,
                comp: '0:2 1 2 1 3 1 2 1',
                bass: 'R:4 r:2 R:2 5:2 r:2 R+:2 5:2',
                drums: {
                    kick: repeat('x.....x...x.....', 8, '|'),
                    rim: repeat('....x.......x...', 8, '|'),
                    shaker: repeat('oxoxoxoxoxoxoxox', 8, '|')
                }
            },
            A2: {
                label: "A'",
                chords: 'F | C/E | Dm7 | Am7 | Bbmaj7 | C | F | F',
                lead: `A4:2 C5:2 F5:3 E5:1 F5:2 A5:2 r:2 G5:2 | E5:2 G5:2 C5:4 r:2 C5:2 D5:2 E5:2 |
                       F5:2 A5:2 D6:3 C6:1 A5:2 F5:2 r:2 E5:2 | E5:2 C5:2 A4:4 r:4 G4:2 A4:2 |
                       Bb4:2 D5:2 F5:3 E5:1 F5:2 A5:2 r:2 D5:2 | E5:2 G5:2 C6:3 Bb5:1 A5:2 G5:2 r:2 E5:2 |
                       F5:4 r:2 C5:2 F5:2 A5:2 C6:4 | A5:2 G5:2 F5:4 r:8`,
                comp: '0:2 1 2 1 3 1 2 1',
                bass: 'R:4 r:2 R:2 5:2 r:2 R+:2 5:2',
                drums: {
                    kick: repeat('x.....x...x.....', 8, '|'),
                    rim: repeat('....x.......x...', 7, '|') + '|....x...........',
                    shaker: repeat('oxoxoxoxoxoxoxox', 8, '|')
                }
            },
            B: {
                chords: 'Bbmaj7 | C | Am7 | Dm7 | Gm7 | C | Fmaj7 | D7',
                bell: `D6:6 C6:2 A5:8 | G5:6 A5:2 C6:8 | E6:6 D6:2 C6:8 | A5:12 r:4 |
                       Bb5:6 A5:2 G5:8 | G5:6 Bb5:2 C6:8 | A5:6 C6:2 E6:8 | F#6:8 D6:4 C6:4`,
                comp: '0:2 1 2 3 4 3 2 1',
                pad: 'hold',
                bass: 'R:6 R:2 5:6 R:2',
                drums: {
                    kick: repeat('x.......x.......', 8, '|'),
                    rim: repeat('....x.......x...', 8, '|'),
                    shaker: repeat('oxoxoxoxoxoxoxox', 8, '|')
                }
            },
            C: {
                chords: 'Gm7 | C | Am7 | Dm7 | Bbmaj7 | Am7 | Gm7 | C7sus4:8 C7:8',
                lead: `D5:2 F5:2 Bb5:4 A5:2 G5:2 F5:4 | E5:2 G5:2 C6:8 r:4 |
                       C5:2 E5:2 A5:4 G5:2 E5:2 C5:4 | D5:2 F5:2 A5:8 r:4 |
                       F5:2 A5:2 D6:4 C6:2 A5:2 F5:4 | E5:2 A5:2 C6:8 r:4 |
                       Bb5:2 A5:2 G5:2 F5:2 D5:4 F5:4 | G5:4 F5:4 E5:4 r:2 C5:2`,
                bell: 'r:16 | r:12 C6:2 E6:2 | r:16 | r:12 D6:2 F6:2 | r:16 | r:12 C6:2 E6:2 | r:16 | r:16',
                comp: '0:4 1 2 1',
                pad: 'hold',
                bass: 'R:8 5:8',
                drums: { shaker: repeat('o.o.o.o.o.o.o.o.', 8, '|') }
            },
            A3: {
                label: 'A',
                chords: 'F | C/E | Dm7 | Am7 | Bbmaj7 | F/A | Gm7 | C7',
                lead: `A4:2 C5:2 F5:3 E5:1 F5:2 A5:2 r:2 G5:2 | E5:2 G5:2 C5:4 r:2 C5:2 D5:2 E5:2 |
                       F5:2 A5:2 D6:3 C6:1 A5:2 F5:2 r:2 E5:2 | E5:2 C5:2 A4:4 r:4 G4:2 A4:2 |
                       Bb4:2 D5:2 F5:3 E5:1 F5:2 A5:2 r:2 D5:2 | C6:2 A5:2 F5:4 r:2 F5:2 G5:2 A5:2 |
                       Bb5:3 A5:1 G5:2 F5:2 G5:2 Bb5:2 D6:2 C6:2 | C6:4 Bb5:2 G5:2 E5:4 r:2 C5:2`,
                bell: 'C6:8 A5:8 | G5:8 C6:8 | A5:8 F5:8 | E5:8 C5:8 | D5:8 F5:8 | A5:8 C6:8 | Bb5:8 D6:8 | C6:8 Bb5:8',
                comp: '0:2 1 2 1 3 1 2 1',
                bass: 'R:4 r:2 R:2 5:2 r:2 R+:2 5:2',
                drums: {
                    kick: repeat('x.....x...x.....', 8, '|'),
                    rim: repeat('....x.......x...', 8, '|'),
                    shaker: repeat('oxoxoxoxoxoxoxox', 8, '|')
                }
            }
        },
        intro: ['intro'],
        loop: ['A', 'A2', 'B', 'C', 'A3', 'A2']
    };

    // エレピとピアノ：落ち着いた、大人っぽい雰囲気で
    const yofuke = {
        title: '夜更けのロジック',
        description: 'エレピとピアノ・落ち着いた',
        genre: 'ジャズ・ブルース',
        melody: ['lead'],
        bpm: 84,
        swing: 0.1,
        swingUnit: 2,
        gain: 0.098,
        reverb: { seconds: 2.8, tone: 0.4 },
        delay: { time: 0.75, feedback: 0.35, tone: 2000, reverb: 0.3 },
        humanize: { time: 0.008, velocity: 0.1 },
        parts: {
            keys: { instrument: 'epiano', mode: 'chords', center: 'E4', voices: 4, volume: 0.35, chorus: { depth: 0.002, rate: 0.6, mix: 0.45 }, autopan: { rate: 0.2, depth: 0.25 }, reverb: 0.3 },
            lead: { instrument: 'piano', volume: 0.46, pan: -0.12, cutoff: 2600, reverb: 0.3, delay: 0.22 },
            pluck: { instrument: 'pluck', volume: 0.5, pan: 0.3, brightness: 0.45, reverb: 0.3, delay: 0.3 },
            pad: { instrument: 'pad', mode: 'chords', center: 'A3', voices: 3, volume: 0.22, cutoff: 900, reverb: 0.5 },
            bass: { instrument: 'synthBass', mode: 'bass', octave: 2, cutoff: 300, envelope: 1.5, volume: 0.45, gate: 0.95 },
            drums: { instrument: 'drums', kit: 'soft', mode: 'drums', volume: 0.39, cutoff: 5000, levels: { hat: 0.6, rim: 0.8 } }
        },
        sections: {
            intro: {
                label: 'イントロ',
                chords: 'Gmaj7 | F#m7 | Em7 | A7sus4:8 A7:8',
                keys: 'x---------x-----',
                bass: { pattern: 'r:16 | r:16 | R:12 5:4 | R:8 R:8' }
            },
            A: {
                chords: 'Gmaj7 | F#m7 | Em7 | A7sus4:8 A7:8 | Dmaj7 | Bm7 | Em9 | A7sus4',
                lead: `r:2 B4:2 D5:2 F#5:4 E5:2 D5:4 | E5:6 C#5:2 A4:8 | r:2 G4:2 B4:2 D5:4 E5:2 F#5:4 | E5:6 D5:2 C#5:8 |
                       r:2 A4:2 C#5:2 E5:4 F#5:2 A5:4 | F#5:6 E5:2 D5:8 | r:2 E5:2 F#5:2 B5:4 A5:2 F#5:4 | D5:12 r:4`,
                keys: 'x-----x---x-----',
                bass: 'R:6 R:4 5:2 r:2 R:2',
                drums: {
                    kick: repeat('x......x..x.....', 8, '|'),
                    snare: repeat('....x.......x...', 8, '|'),
                    hat: repeat('x.x.x.x.x.x.x.xo', 8, '|')
                }
            },
            B: {
                chords: 'Bm7 | Gmaj7 | Em7 | F#7 | Bm7 | Gmaj7 | Em7 | A7sus4:8 A7:8',
                lead: `r:2 F#5:2 A5:2 B5:4 A5:2 F#5:4 | A5:6 F#5:2 D5:8 | r:2 E5:2 G5:2 B5:4 A5:2 G5:4 | F#5:6 E5:2 C#5:4 A#4:4 |
                       B4:2 D5:2 F#5:2 A5:6 F#5:4 | B5:6 A5:2 F#5:8 | G5:4 F#5:2 E5:2 D5:4 B4:4 | D5:8 C#5:4 E5:4`,
                keys: 'x-----x---x-----',
                pad: 'hold',
                bass: 'R:6 R:4 5:2 r:2 R:2',
                drums: {
                    kick: repeat('x......x..x.....', 8, '|'),
                    snare: repeat('....x.......x...', 8, '|'),
                    hat: repeat('x.x.x.x.x.x.x.xo', 7, '|') + '|x.x.x.x.x.x.x...',
                    openHat: repeat('................', 7, '|') + '|..............x.'
                }
            },
            A2: {
                label: "A'",
                chords: 'Gmaj7 | F#m7 | Em7 | A7sus4:8 A7:8 | Dmaj7 | Bm7 | Em9 | A7sus4',
                lead: `r:2 B4:2 D5:2 F#5:4 E5:2 D5:4 | E5:6 C#5:2 A4:8 | r:2 G4:2 B4:2 D5:4 E5:2 F#5:4 | E5:6 D5:2 C#5:8 |
                       r:2 A4:2 C#5:2 E5:4 F#5:2 A5:4 | F#5:6 E5:2 D5:8 | r:2 B5:2 A5:2 F#5:4 E5:2 D5:4 | E5:4 D5:4 A4:8`,
                keys: 'x-----x---x-----',
                pad: 'hold',
                bass: 'R:6 R:4 5:2 r:2 R:2',
                drums: {
                    kick: repeat('x......x..x.....', 8, '|'),
                    snare: repeat('....x.......x...', 8, '|'),
                    hat: repeat('x.x.x.x.x.x.x.xo', 8, '|')
                }
            },
            C: {
                chords: 'Gmaj7 | Gm6 | F#m7 | B7 | Em9 | A7sus4 | Dmaj7 | A7sus4:8 A7:8',
                pluck: `r:4 D6:2 B5:2 F#5:8 | r:4 D6:2 Bb5:2 G5:8 | r:4 C#6:2 A5:2 E5:8 | r:4 D#6:2 B5:2 F#5:8 |
                        r:4 B5:2 G5:2 E5:8 | r:4 A5:2 E5:2 D5:8 | r:4 F#5:2 A5:2 C#6:8 | r:16`,
                keys: 'x-------x-------',
                pad: 'hold',
                bass: 'R:12 5:4',
                drums: { hat: repeat('o.o.o.o.o.o.o.o.', 8, '|') }
            },
            A3: {
                label: 'A',
                chords: 'Gmaj7 | F#m7 | Em7 | A7sus4:8 A7:8 | Dmaj7 | Bm7 | Em9 | A7sus4',
                lead: `r:2 B4:2 D5:2 F#5:4 E5:2 D5:4 | E5:6 C#5:2 A4:8 | r:2 G4:2 B4:2 D5:4 E5:2 F#5:4 | E5:6 D5:2 C#5:8 |
                       r:2 A4:2 C#5:2 E5:4 F#5:2 A5:4 | F#5:6 E5:2 D5:8 | r:2 E5:2 F#5:2 B5:4 A5:2 F#5:4 | D5:12 r:4`,
                keys: 'x-----x---x-----',
                pad: 'hold',
                bass: 'R:6 R:4 5:2 r:2 R:2',
                drums: {
                    kick: repeat('x......x..x.....', 8, '|'),
                    snare: repeat('....x.......x...', 8, '|'),
                    hat: repeat('x.x.x.x.x.x.x.xo', 8, '|')
                }
            }
        },
        intro: ['intro'],
        loop: ['A', 'B', 'A2', 'C', 'A3']
    };

    // チップ×シンセポップ：チップのメロディに、今風の伴奏を合わせる
    const neon = {
        title: 'ネオンタイル',
        description: 'チップ×シンセポップ',
        genre: 'チップチューン',
        melody: ['lead'],
        bpm: 120,
        gain: 0.129,
        reverb: { seconds: 2, tone: 0.55 },
        delay: { time: 0.75, feedback: 0.3, tone: 2800, reverb: 0.25 },
        humanize: { time: 0.003, velocity: 0.06 },
        parts: {
            lead: { instrument: 'chip', wave: 'pulse', duty: 0.25, level: 0.17, vibrato: 12, sustain: 0.7, gate: 0.9, delay: 0.22, reverb: 0.18, humanize: false },
            harm: { instrument: 'chip', wave: 'pulse', duty: 0.5, level: 0.07, sustain: 0.75, pan: -0.3, reverb: 0.2, humanize: false },
            pluck: { instrument: 'pluck', mode: 'arp', from: 'E4', brightness: 0.6, volume: 0.34, pan: 0.3, reverb: 0.25, delay: 0.15 },
            pad: { instrument: 'pad', mode: 'chords', center: 'D4', voices: 4, volume: 0.19, cutoff: 1600, reverb: 0.45 },
            bass: { instrument: 'synthBass', mode: 'bass', octave: 2, cutoff: 380, envelope: 3, volume: 0.4, gate: 0.85 },
            drums: { instrument: 'drums', kit: 'soft', mode: 'drums', volume: 0.39, levels: { kick: 0.85, clap: 0.7, hat: 0.6, openHat: 0.5 } }
        },
        sections: {
            intro: {
                label: 'イントロ',
                chords: 'Em7 | Cmaj7 | G | D',
                pluck: '0:2 1 2 1 3 2 1 2',
                pad: 'hold',
                drums: {
                    hat: '................|................|o.x.o.x.o.x.o.x.|o.x.o.x.o.x.o.x.',
                    kick: '................|................|................|x...x...x...x.x.'
                }
            },
            A: {
                chords: 'Em7 | Cmaj7 | G | D/F# | Em7 | Cmaj7 | Am7 | D',
                lead: `B4:2 E5:2 G5:2 B5:4 A5:2 G5:2 E5:2 | G5:4 E5:2 D5:2 E5:8 | r:2 B4:2 D5:2 G5:4 F#5:2 G5:2 A5:2 | A5:6 F#5:2 D5:8 |
                       B4:2 E5:2 G5:2 B5:4 A5:2 G5:2 B5:2 | C6:4 B5:2 A5:2 G5:8 | r:2 A5:2 G5:2 E5:4 D5:2 E5:2 G5:2 | F#5:8 r:4 D5:2 E5:2`,
                pluck: '0:2 1 2 1 3 2 1 2',
                bass: 'R:2 r:2 R:2 R:2 r:2 R:2 5:2 R+:2',
                drums: {
                    kick: repeat('x...x...x...x...', 8, '|'),
                    clap: repeat('....x.......x...', 8, '|'),
                    hat: repeat('o.x.o.x.o.x.o.x.', 8, '|')
                }
            },
            B: {
                chords: 'C | D | Bm7 | Em7 | Am7 | Bm7 | C | D',
                lead: `G5:4 C6:4 B5:4 G5:4 | A5:6 F#5:2 D5:8 | F#5:4 B5:4 A5:4 F#5:4 | G5:6 E5:2 B4:8 |
                       C6:4 B5:4 A5:4 E5:4 | D6:6 B5:2 F#5:8 | E6:4 D6:4 C6:4 G5:4 | A5:8 F#5:4 D5:4`,
                pluck: '0:2 1 2 1 3 2 1 2',
                pad: 'hold',
                bass: 'R:2 r:2 R:2 R:2 r:2 R:2 5:2 R+:2',
                drums: {
                    kick: repeat('x...x...x...x...', 8, '|'),
                    clap: repeat('....x.......x...', 8, '|'),
                    hat: repeat('o.x.o.x.o.x.o.x.', 8, '|'),
                    openHat: repeat('..............x.', 8, '|')
                }
            },
            A2: {
                label: "A'",
                chords: 'Em7 | Cmaj7 | G | D/F# | Em7 | Cmaj7 | Am7 | D',
                lead: `B4:2 E5:2 G5:2 B5:4 A5:2 G5:2 E5:2 | G5:4 E5:2 D5:2 E5:8 | r:2 B4:2 D5:2 G5:4 F#5:2 G5:2 A5:2 | A5:6 F#5:2 D5:8 |
                       B4:2 E5:2 G5:2 B5:4 A5:2 G5:2 B5:2 | C6:4 B5:2 A5:2 G5:8 | r:2 A5:2 G5:2 E5:4 D5:2 E5:2 G5:2 | F#5:8 r:8`,
                pluck: '0:2 1 2 1 3 2 1 2',
                pad: 'hold',
                bass: 'R:2 r:2 R:2 R:2 r:2 R:2 5:2 R+:2',
                drums: {
                    kick: repeat('x...x...x...x...', 8, '|'),
                    clap: repeat('....x.......x...', 7, '|') + '|....x...x.x.x.xx',
                    hat: repeat('o.x.o.x.o.x.o.x.', 8, '|')
                }
            },
            C: {
                chords: 'Am7 | Bm7 | Cmaj7 | D | Am7 | Bm7 | Cmaj7 | Dsus4:8 D:8',
                harm: 'E5:8 G5:8 | F#5:8 D5:8 | E5:8 G5:8 | A5:16 | C6:8 B5:8 | A5:8 F#5:8 | G5:8 E5:8 | D5:8 F#5:8',
                pluck: { pattern: '0:1 1 2 3 4 3 2 1', from: 'A4' },
                pad: 'hold',
                bass: 'R:8 R:6 5:2',
                drums: {
                    hat: repeat('o.o.o.o.o.o.o.o.', 8, '|'),
                    kick: repeat('................', 7, '|') + '|x...x...x...x.x.',
                    clap: repeat('................', 7, '|') + '|....x.......x.xx'
                }
            },
            B2: {
                label: "B'",
                chords: 'C | D | Bm7 | Em7 | Am7 | Bm7 | C | D',
                lead: `G5:4 C6:4 B5:4 G5:4 | A5:6 F#5:2 D5:8 | F#5:4 B5:4 A5:4 F#5:4 | G5:6 E5:2 B4:8 |
                       C6:4 B5:4 A5:4 E5:4 | D6:6 B5:2 F#5:8 | E6:4 D6:4 C6:4 G5:4 | A5:8 F#5:4 D5:4`,
                harm: 'E5:8 G5:8 | F#5:8 A5:8 | D5:8 F#5:8 | E5:8 B4:8 | E5:8 C5:8 | F#5:8 D5:8 | G5:8 E5:8 | F#5:8 A5:8',
                pluck: '0:2 1 2 1 3 2 1 2',
                pad: 'hold',
                bass: 'R:2 r:2 R:2 R:2 r:2 R:2 5:2 R+:2',
                drums: {
                    kick: repeat('x...x...x...x...', 8, '|'),
                    clap: repeat('....x.......x...', 8, '|'),
                    hat: repeat('o.x.o.x.o.x.o.x.', 8, '|'),
                    openHat: repeat('..............x.', 8, '|')
                }
            }
        },
        intro: ['intro'],
        loop: ['A', 'B', 'A2', 'C', 'B2']
    };

    // ===== 効果音 =====
    // 各層：{ instrument, notes, unit（長さ1つの秒数）, at（始まりの秒）, volume, pan, reverb }

    const KIT = { instrument: 'drums', kit: 'soft' };
    const SOFT_BUZZ = { instrument: 'synthBass', cutoff: 380, envelope: 1.2, decay: 0.16, sustain: 0, sub: 0.5 };

    const effects = {
        // ピースを選んだ：軽く木をたたく音
        select: [{ instrument: 'marimba', notes: 'E6:1', volume: 0.5, reverb: 0.08 }],
        // ピースを置いた：低い「コトッ」と、上がる2つの音
        place: [
            { instrument: KIT, notes: 'kick:1', volume: 0.3 },
            { instrument: 'marimba', notes: 'G4:1 D5:2', unit: 0.035, volume: 0.65, reverb: 0.1 }
        ],
        // 置けなかった：こもった低い2つの音
        invalid: [{ instrument: SOFT_BUZZ, notes: 'D3:1 r:1 C#3:2', unit: 0.06, volume: 0.75 }],
        // ピースを外した：下がる2つの音
        remove: [{ instrument: 'marimba', notes: 'D5:1 A4:2', unit: 0.045, volume: 0.55, reverb: 0.1 }],
        // クリア・問題の勝ち：上がるマリンバと、ベルの和音
        clear: [
            { instrument: 'marimba', notes: 'C5:1 E5 G5 C6:6', unit: 0.07, volume: 0.6, reverb: 0.2 },
            { instrument: 'bell', notes: '[E6,G6,C7]:12', unit: 0.07, at: 0.21, volume: 0.3, reverb: 0.4 }
        ],
        // チャレンジで1問解いた（+20秒）：きらっと光る2つの音
        bonus: [
            { instrument: 'bell', notes: 'E6:1 A6:6', unit: 0.06, volume: 0.4, reverb: 0.3 },
            { instrument: 'marimba', notes: 'A5:1 E6:4', unit: 0.06, volume: 0.35 }
        ],
        // 降参：やわらかく下がる3つの音
        surrender: [{ instrument: 'vibes', notes: 'G4:3 E4:3 C4:8', unit: 0.1, volume: 0.6, reverb: 0.3 }],
        // 問題の負け：エレピで、少しさみしく下がる
        lose: [{ instrument: 'epiano', notes: 'E4:2 C4:2 A3:10', unit: 0.09, volume: 0.75, reverb: 0.35 }],
        // チャレンジの残り10秒の時計の音
        tick: [{ instrument: KIT, notes: 'rim:1', volume: 0.35 }],
        // チャレンジ終了：ベルが下がり、ビブラフォンの和音で終わる
        timeUp: [
            { instrument: 'bell', notes: 'C6:2 G5:2 E5:2 C5:8', unit: 0.09, volume: 0.4, reverb: 0.35 },
            { instrument: 'vibes', notes: '[C4,E4,G4]:10', unit: 0.09, at: 0.27, volume: 0.35, reverb: 0.3 }
        ],
        // 対戦の開始前のカウントダウン（3・2・1）と、開始
        count: [
            { instrument: 'bell', notes: 'A5:3', unit: 0.05, volume: 0.3, reverb: 0.15 },
            { instrument: 'marimba', notes: 'A5:1', volume: 0.45 }
        ],
        go: [
            { instrument: 'bell', notes: 'A6:10', unit: 0.05, volume: 0.35, reverb: 0.25 },
            { instrument: 'marimba', notes: '[A5,E6]:1', volume: 0.5 },
            { instrument: KIT, notes: 'kick:1', volume: 0.25 }
        ],
        // 対戦の優勝：マリンバのファンファーレと、ベルの和音
        victory: [
            { instrument: 'marimba', notes: 'C5:1 E5 G5 C6:2 G5:1 C6:1 E6:8', unit: 0.09, volume: 0.6, reverb: 0.25 },
            { instrument: 'pluck', notes: 'C3:3 G3:3 C4:10', unit: 0.09, volume: 0.45, reverb: 0.2 },
            { instrument: 'bell', notes: '[C6,E6,G6]:10', unit: 0.09, at: 0.54, volume: 0.28, reverb: 0.45 },
            { instrument: KIT, notes: 'kick:1 r:5 openHat:1', unit: 0.09, volume: 0.3 }
        ]
    };

    // 効果音ごとの音量（dB）。今の mine-blocks の効果音と、同じくらいの大きさにそろえる
    // （よく鳴る音は小さく、たまに鳴る音は大きく。tools/measure.mjs の瞬間 LUFS で合わせた）
    const EFFECT_LEVELS = {
        select: -24.9, place: -27.4, invalid: -10, remove: -30.7, clear: -13.3, bonus: -15.8, surrender: -12.6,
        lose: -11, tick: -3.5, timeUp: -15.3, count: -26.6, go: -20.5, victory: -12.4
    };
    for (const [name, db] of Object.entries(EFFECT_LEVELS)) {
        effects[name] = effects[name].map(layer => ({ ...layer, volume: (layer.volume ?? 1) * 10 ** (db / 20) }));
    }

    SoundKit.register('mine-blocks', { songs: { pixel, hidamari, yofuke, neon }, effects });
})();
