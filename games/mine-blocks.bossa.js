/**
 * mine-blocks の BGM の候補：午後のカフェテラス（ボサノバ）
 */
(function () {
    const { repeat } = SoundKit;

    // ギターの刻み（2小節で1組）。. で弦を軽く止めて、はねる感じを出す
    const GUITAR = 'x-.o-.x-..o-....|x-.o-.x-..o-.o-.';
    // ボサノバのクロススティック（2小節で1組のクラーベ）
    const CLAVE = 'x.....x.....x...|....x.....x.....';
    const KICK = 'x.......x.....x.';
    const SHAKER = 'x.o.x.o.x.o.x.o.';

    // ボサノバ：ナイロン弦のギターとフルートで、おしゃれに落ち着いて
    const bossa = {
        title: '午後のカフェテラス',
        description: 'ギターとフルート・おしゃれで落ち着いた',
        melody: ['lead'],
        bpm: 126,
        gain: 0.075,
        reverb: { seconds: 2.4, tone: 0.45 },
        delay: { time: 0.75, feedback: 0.28, tone: 2400, reverb: 0.25 },
        humanize: { time: 0.006, velocity: 0.1 },
        parts: {
            lead: { instrument: 'flute', volume: 0.76, pan: -0.12, reverb: 0.28, delay: 0.18 },
            vibes: { instrument: 'vibes', volume: 0.45, pan: 0.3, reverb: 0.35, delay: 0.15 },
            guitar: { instrument: 'pluck', mode: 'chords', center: 'F4', voices: 3, brightness: 0.3, sustain: 0.995, release: 0.15, volume: 0.64, pan: 0.2, reverb: 0.25 },
            pad: { instrument: 'pad', mode: 'chords', center: 'A3', voices: 3, volume: 0.36, cutoff: 900, reverb: 0.45 },
            bass: { instrument: 'pluck', mode: 'bass', octave: 2, brightness: 0.3, sustain: 0.995, release: 0.1, volume: 0.7, gate: 0.9 },
            drums: { instrument: 'drums', kit: 'soft', mode: 'drums', volume: 0.8, cutoff: 6000, levels: { kick: 0.6, rim: 0.5, shaker: 0.55 } }
        },
        sections: {
            intro: {
                label: 'イントロ',
                chords: 'Gm9 | C9 | Gm9 | C7sus4:8 C9:8',
                guitar: GUITAR,
                bass: { pattern: 'r:16 | r:16 | R:6 R:2 5:6 5:2 | R:6 R:2 5:6 5:2' },
                drums: { shaker: '................|................|' + repeat('o.o.o.o.o.o.o.o.', 2, '|') }
            },
            A: {
                chords: 'Fmaj7 | Am7 | Gm9 | C9 | Fmaj7 | D7b9 | Gm9 | C7sus4:8 C9:8',
                lead: `r:2 C5:2 A5:6 G5:2 A5:4 | G5:6 E5:2 C5:8 | r:2 D5:2 F5:2 A5:6 G5:4 | E5:4 G5:2 E5:2 D5:8 |
                       r:2 C5:2 A5:6 G5:2 C6:4 | C6:6 A5:2 F#5:8 | r:2 G5:2 Bb5:2 D6:6 C6:2 Bb5:2 | A5:6 G5:2 E5:6 r:2`,
                guitar: GUITAR,
                bass: 'R:6 R:2 5:6 5:2',
                drums: {
                    kick: repeat('x...............', 8, '|'),
                    rim: repeat('................', 4, '|') + '|' + repeat(CLAVE, 2, '|'),
                    shaker: repeat(SHAKER, 8, '|')
                }
            },
            A2: {
                label: "A'",
                chords: 'Fmaj7 | Am7 | Gm9 | C9 | Am7 | D7b9 | Gm7:8 C9:8 | Fmaj7',
                lead: `r:2 C5:2 A5:6 G5:2 A5:4 | G5:6 E5:2 C5:8 | r:2 D5:2 F5:2 A5:6 G5:4 | E5:4 G5:2 E5:2 D5:8 |
                       r:2 E5:2 C6:6 B5:2 A5:4 | A5:6 F#5:2 C6:4 A5:4 | Bb5:4 A5:2 G5:2 E5:4 G5:2 Bb5:2 | A5:12 r:4`,
                guitar: GUITAR,
                bass: 'R:6 R:2 5:6 5:2',
                drums: {
                    kick: repeat(KICK, 8, '|'),
                    rim: repeat(CLAVE, 3, '|') + '|....x.....x.....|x.....x.....x.x.',
                    shaker: repeat(SHAKER, 8, '|')
                }
            },
            // サビ：IV と、ボサノバらしい IVm6 に寄り道して、高めの長い音で歌う
            B: {
                chords: 'Bbmaj7 | Bbm6 | Am7 | D7b9 | Gm9 | C9 | Am7:8 D7b9:8 | Gm7:8 C9:8',
                lead: `D6:6 C6:2 A5:8 | Db6:6 C6:2 Bb5:8 | r:2 E5:2 G5:2 C6:6 B5:2 A5:2 | F#5:6 A5:2 C6:8 |
                       Bb5:6 A5:2 F5:8 | E5:6 G5:2 D6:8 | C6:6 B5:2 A5:6 F#5:2 | G5:6 F5:2 E5:4 r:2 C5:2`,
                guitar: GUITAR,
                pad: 'hold',
                bass: 'R:6 R:2 5:6 5:2',
                drums: {
                    kick: repeat(KICK, 8, '|'),
                    rim: repeat('....x.......x...', 8, '|'),
                    shaker: repeat(SHAKER, 8, '|')
                }
            },
            // 休憩：フルートとドラムを抜き、ビブラフォンが短く歌う
            C: {
                chords: 'Bbmaj7 | Am7 | Gm9 | Fmaj7 | Ebmaj7 | Dm9 | Gm9 | C7sus4:8 C9:8',
                vibes: `r:4 F5:2 A5:2 D6:8 | r:4 E5:2 G5:2 C6:8 | r:4 D5:2 F5:2 A5:8 | r:4 C5:2 E5:2 A5:8 |
                        r:4 D5:2 G5:2 Bb5:8 | r:4 C5:2 F5:2 A5:8 | r:4 Bb4:2 D5:2 F5:8 | r:8 E5:4 G5:4`,
                guitar: 'x-----x---o-----',
                pad: 'hold',
                bass: 'R:12 5:4',
                drums: { shaker: repeat('o...o...o...o...', 7, '|') + '|o.o.o.o.o.o.o.o.' }
            },
            // A に、ビブラフォンの短い合いの手を足す
            A3: {
                label: 'A',
                chords: 'Fmaj7 | Am7 | Gm9 | C9 | Fmaj7 | D7b9 | Gm9 | C7sus4:8 C9:8',
                lead: `r:2 C5:2 A5:6 G5:2 A5:4 | G5:6 E5:2 C5:8 | r:2 D5:2 F5:2 A5:6 G5:4 | E5:4 G5:2 E5:2 D5:8 |
                       r:2 C5:2 A5:6 G5:2 C6:4 | C6:6 A5:2 F#5:8 | r:2 G5:2 Bb5:2 D6:6 C6:2 Bb5:2 | A5:6 G5:2 E5:6 r:2`,
                vibes: 'r:16 | r:10 E6:2 C6:4 | r:16 | r:10 Bb5:2 G5:4 | r:16 | r:10 C6:2 A5:4 | r:16 | r:10 G5:2 Bb5:4',
                guitar: GUITAR,
                bass: 'R:6 R:2 5:6 5:2',
                drums: {
                    kick: repeat(KICK, 8, '|'),
                    rim: repeat(CLAVE, 4, '|'),
                    shaker: repeat(SHAKER, 8, '|')
                }
            },
            // ループの終わり：V（C9）で終えて、頭の Fmaj7 へ戻る
            A4: {
                label: "A'",
                chords: 'Fmaj7 | Am7 | Gm9 | C9 | Am7 | D7b9 | Gm9 | C7sus4:8 C9:8',
                lead: `r:2 C5:2 A5:6 G5:2 A5:4 | G5:6 E5:2 C5:8 | r:2 D5:2 F5:2 A5:6 G5:4 | E5:4 G5:2 E5:2 D5:8 |
                       r:2 E5:2 C6:6 B5:2 A5:4 | A5:6 F#5:2 C6:4 A5:4 | Bb5:6 A5:2 G5:4 D5:4 | C5:6 D5:2 E5:4 G5:2 Bb5:2`,
                vibes: 'r:16 | r:10 E6:2 C6:4 | r:16 | r:10 Bb5:2 G5:4 | r:16 | r:16 | r:16 | r:16',
                guitar: GUITAR,
                bass: 'R:6 R:2 5:6 5:2',
                drums: {
                    kick: repeat(KICK, 8, '|'),
                    rim: repeat(CLAVE, 4, '|'),
                    shaker: repeat(SHAKER, 7, '|') + '|x.o.x.o.x.oox.oo'
                }
            }
        },
        intro: ['intro'],
        loop: ['A', 'A2', 'B', 'C', 'A3', 'A4']
    };

    SoundKit.register('mine-blocks', { songs: { bossa } });
})();
