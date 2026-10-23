/**
 * mine-blocks の BGM の候補：オルゴールのワルツ（オルゴールとカリンバ・やさしい3拍子）
 * 3拍子なので、1小節は12ステップ（16分音符12個）
 */
(function () {
    const { repeat } = SoundKit;

    // A の主題（前半8小節は A・A'・最後の A で同じ）
    const THEME_FIRST = `A4:4 C5:4 F5:4 | A5:8 G5:2 F5:2 | G5:8 E5:4 | C5:12 |
                         D5:4 F5:4 A5:4 | D6:8 C6:2 A5:2 | Bb5:6 A5:2 G5:4 | G5:12`;
    const THEME_SECOND = `A4:4 C5:4 F5:4 | C6:8 A5:4 | D6:6 C6:2 Bb5:4 | G5:6 A5:2 Bb5:4`;
    // A の終わり：C7 で止めて、頭の F へ戻る
    const THEME_HALF = `A5:8 F5:4 | F#5:6 A5:2 C6:4 | Bb5:8 A5:2 G5:2 | G5:4 E5:4 C5:4`;
    // A' の終わり：F で落ち着いてから、F7 で B の Bb へ向かう
    const THEME_FULL = `A5:8 F5:4 | G5:6 Bb5:2 E5:4 | F5:12 | r:4 A5:2 G5:2 F5:2 Eb5:2`;

    const A_CHORDS = 'F | F | C/E | C | Dm | Dm/C | Bb | C7 | F | F/A | Bb | Gm7 | F/C | D7 | Gm7 | C7';
    const A2_CHORDS = 'F | F | C/E | C | Dm | Dm/C | Bb | C7 | F | F/A | Bb | Gm7 | F/C | C7 | F | F7';

    const waltz = {
        title: 'オルゴールのワルツ',
        description: 'オルゴールとカリンバ・やさしい',
        genre: 'クラシック',
        melody: ['lead', 'leadB'],   // 主旋律のパート（試聴ページで楽器を替えられる）
        bpm: 132,
        stepsPerBar: 12,
        gain: 0.0575,
        reverb: { seconds: 2.6, tone: 0.45 },
        delay: { time: 0.75, feedback: 0.25, tone: 2400, reverb: 0.3 },
        humanize: { time: 0.006, velocity: 0.08 },
        parts: {
            lead: { instrument: 'musicBox', volume: 0.78, pan: -0.12, reverb: 0.3, delay: 0.15 },
            leadB: { instrument: 'kalimba', volume: 1, pan: -0.12, reverb: 0.28, delay: 0.12 },
            bell: { instrument: 'bell', volume: 0.5, pan: 0.3, reverb: 0.4, delay: 0.15 },
            harp: { instrument: 'pluck', mode: 'arp', from: 'C4', brightness: 0.65, volume: 0.9, pan: 0.22, reverb: 0.3 },
            pad: { instrument: 'pad', mode: 'chords', center: 'F4', voices: 3, volume: 0.45, cutoff: 1000, reverb: 0.45 },
            bass: { instrument: 'pluck', mode: 'bass', octave: 2, brightness: 0.35, sustain: 0.995, release: 0.15, volume: 1, gate: 0.9 },
            drums: { instrument: 'drums', kit: 'soft', mode: 'drums', volume: 1, levels: { kick: 0.6, shaker: 0.7 } }
        },
        sections: {
            intro: {
                label: 'イントロ',
                chords: 'F | Dm | Bb | C7',
                harp: '0:2 1 2 3 2 1',
                bass: 'r:12 | r:12 | R:12 | R:12'
            },
            A: {
                chords: A_CHORDS,
                lead: `${THEME_FIRST} | ${THEME_SECOND} | ${THEME_HALF}`,
                harp: '0:2 1 2 3 2 1',
                bass: 'R:8 5:4',
                drums: {
                    kick: repeat('x...........', 16, '|'),
                    shaker: repeat('....o...o...', 16, '|')
                }
            },
            A2: {
                label: "A'",
                chords: A2_CHORDS,
                lead: `${THEME_FIRST} | ${THEME_SECOND} | ${THEME_FULL}`,
                harp: '0:2 1 2 3 2 1',
                bass: 'R:8 5:4',
                drums: {
                    kick: repeat('x...........', 16, '|'),
                    shaker: repeat('..o.x.o.x.o.', 16, '|')
                }
            },
            // B：カリンバが少し低いところで歌う。分散和音も下げて、パッドを敷く
            B: {
                chords: 'Bb | C | Am | Dm | Gm7 | C | F | F7 | Bb | C | Am | Dm | Gm7 | A7 | Dm | C7',
                leadB: `F5:8 D5:4 | E5:8 C5:4 | C5:4 E5:4 A5:4 | A5:8 F5:4 |
                        Bb5:8 G5:4 | G5:6 F5:2 E5:4 | F5:12 | r:4 C5:4 Eb5:4 |
                        D5:4 F5:4 Bb5:4 | C6:8 G5:4 | A5:6 G5:2 E5:4 | F5:8 D5:4 |
                        G5:4 Bb5:4 D6:4 | C#6:8 A5:4 | D6:8 A5:2 F5:2 | E5:8 C5:4`,
                harp: { pattern: '0:2 1 2 3 2 1', from: 'F3' },
                pad: 'hold',
                bass: 'R:8 5:4',
                drums: {
                    kick: repeat('x...........', 16, '|'),
                    shaker: repeat('....o...o...', 16, '|')
                }
            },
            // C：休憩。ドラムを抜き、オルゴールは長い音だけ。分散和音は4分音符に
            C: {
                chords: `Dm | Bb | F | C | Dm | Bb | Gm7 | C |
                         Dm | Bb | F | C/E | Dm | Gm7 | Bbmaj7 | C7sus4:6 C7:6`,
                lead: `A5:12@0.9 | F5:12@0.9 | C6:8@0.9 A5:4@0.8 | G5:12@0.9 |
                       F5:8@0.9 A5:4@0.8 | D6:12@0.9 | Bb5:8@0.9 A5:4@0.8 | G5:12@0.9 |
                       A5:12@0.9 | Bb5:8@0.9 F5:4@0.8 | A5:8@0.9 C6:4@0.8 | G5:12@0.9 |
                       F5:8@0.9 E5:2@0.8 D5:2@0.8 | D5:12@0.9 | F5:12@0.9 | G5:8@0.9 E5:2@0.8 C5:2@0.8`,
                harp: { pattern: '0:4 1 2', from: 'A3' },
                pad: 'hold',
                bass: 'R:12'
            },
            // 最後の A：ベルが答え、パッドを敷く
            A3: {
                label: 'A',
                chords: A_CHORDS,
                lead: `${THEME_FIRST} | ${THEME_SECOND} | ${THEME_HALF}`,
                bell: `r:12 | r:12 | r:12 | r:4 E6:4 C6:4 | r:12 | r:12 | r:12 | r:4 E6:4 D6:4 |
                       r:12 | r:12 | r:12 | r:12 | r:8 C6:4 | r:12 | r:12 | r:12`,
                harp: '0:2 1 2 3 2 1',
                pad: 'hold',
                bass: 'R:8 5:4',
                drums: {
                    kick: repeat('x...........', 16, '|'),
                    shaker: repeat('..o.x.o.x.o.', 16, '|')
                }
            }
        },
        intro: ['intro'],
        loop: ['A', 'A2', 'B', 'C', 'A3']
    };

    SoundKit.register('mine-blocks', { songs: { waltz } });
})();
