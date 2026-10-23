/**
 * 曲の一覧：ほろ酔いシャッフル（12小節のブルース。オルガンとピアノ）
 */
(function () {
    const { repeat } = SoundKit;

    // 12小節のブルース（I7-IV7-I7-V7 の型。最後の小節を V7 にして頭へ戻る）
    const CHANGES = 'G7 | C7 | G7 | G7 | C7 | C7 | G7 | G7 | D7 | C7 | G7 | D7';
    // ジャズ・ブルースの型：6小節目に経過の減7、後半を ii-V にする
    const JAZZ_CHANGES = 'G7 | C7 | G7 | G7 | C7 | C#dim7 | G7 | E7 | Am7 | D7 | G7:8 E7:8 | Am7:8 D7:8';
    // シャッフルのハイハット（はねた8分）と、2拍目・4拍目のスネア
    const SHUFFLE = 'x.o.x.o.x.o.x.o.';
    const BACKBEAT = '....x.......x...';
    // ベースは「根音・3度・5度・6度」で上がり、「7度・6度・5度・3度」で下りる（2小節で1組）
    const WALK = 'R:4 3 5 6 | 7 6 5 3';

    // 主題（AAB の形：1〜4小節の問いを、IV の上でくり返し、9小節目から答える）
    const HEAD = `r:2 Bb4~B4:2 D5:2 F5:2 G5:6 F5:2 | G5:4 E5:2 C5:2 Bb4:8 | r:4 D5:2 F5:2 G5:2 Bb5~B5:2 G5:4 | D5:8 r:8 |
                  r:2 Bb4:2 C5:2 E5:2 G5:6 E5:2 | Bb5:4 G5:2 E5:2 C5:8 | r:4 D5:2 F5:2 G5:2 Bb5~B5:2 D6:4 | B5:6 A5:2 G5:4 r:4 |`;

    // ブルース：オルガンのシャッフルの上で、ピアノがブルーノートを転がす
    const blues = {
        title: 'ほろ酔いシャッフル',
        tags: ['おしゃれ', '落ち着いた'],
        genre: 'ジャズ・ブルース',
        melody: ['lead'],
        bpm: 100,
        swing: 0.25,
        swingUnit: 2,
        gain: 0.08,
        reverb: { seconds: 2.2, tone: 0.4 },
        delay: { time: 0.75, feedback: 0.22, tone: 2200, reverb: 0.25 },
        humanize: { time: 0.008, velocity: 0.12 },
        parts: {
            lead: { instrument: 'piano', volume: 0.69, pan: -0.12, brightness: 0.8, reverb: 0.22, delay: 0.1 },
            organ: { instrument: 'organ', mode: 'chords', center: 'E4', voices: 3, vibrato: 4, volume: 0.68, cutoff: 2600, pan: 0.2, autopan: { rate: 0.7, depth: 0.25 }, reverb: 0.3 },
            bass: { instrument: 'pluck', mode: 'bass', octave: 2, brightness: 0.35, sustain: 0.995, release: 0.1, volume: 0.72, gate: 0.9 },
            drums: { instrument: 'drums', kit: 'soft', mode: 'drums', volume: 1.2, cutoff: 8000, levels: { kick: 0.55, snare: 0.45, hat: 0.5, openHat: 0.4, rim: 0.5 } }
        },
        sections: {
            intro: {
                label: 'イントロ',
                chords: 'G7 | C7 | G7:8 E7:8 | Am7:8 D7:8',
                organ: '....x---....x---',
                bass: 'R:4 3 5 6 | 7 6 5 3 | G2 B2 E2 G#2 | A2 C3 D3 F#2',
                drums: {
                    hat: '................|................|' + repeat(SHUFFLE, 2, '|'),
                    snare: '................|................|' + BACKBEAT + '|....x.....o.x.o.',
                    kick: '................|................|x.......x.......|x.......x.......'
                }
            },
            A: {
                chords: CHANGES,
                lead: HEAD + `
                       r:2 F5~F#5:2 A5:2 C6:2 D6:8 | C6:4 Bb5:2 G5:2 E5:8 | r:2 Bb4~B4:2 D5:2 G5:2 Bb5~B5:4 G5:4 | F#5:4 A5:4 D5:4 r:4`,
                organ: '....x---....x---',
                bass: WALK,
                drums: {
                    hat: repeat(SHUFFLE, 12, '|'),
                    snare: repeat(BACKBEAT, 12, '|'),
                    kick: repeat('x.......x.......', 12, '|')
                }
            },
            // 2回目：オルガンをシャッフルで刻み、答えの4小節を変える
            A2: {
                label: "A'",
                chords: CHANGES,
                lead: HEAD + `
                       r:2 A5:2 C6:2 D6:2 C6:4 A5:4 | Bb5:6 G5:2 E5:8 | r:2 D5:2 F5:2 G5:2 Bb5~B5:4 D6:4 | C6:4 A5:4 F#5:4 D5:4`,
                organ: 'x-----o-x-----o-',
                bass: WALK,
                drums: {
                    hat: repeat(SHUFFLE, 12, '|'),
                    snare: repeat('....x.......x...|....x.......x...|....x.......x...|....x.....o.x.o.', 3, '|'),
                    openHat: repeat('................|................|................|..............o.', 3, '|'),
                    kick: repeat('x.......x.......', 12, '|')
                }
            },
            // ジャズ・ブルースの和音で、主題とちがう旋律を歌う
            B: {
                chords: JAZZ_CHANGES,
                lead: `D6:4 Bb5~B5:4 G5:2 F5:2 D5:4 | E5:2 G5:2 Bb5:4 A5:2 G5:2 E5:4 | r:4 G5:2 Bb5:2 D6:4 Db6:2 C6:2 | B5:6 G5:2 D5:4 r:4 |
                       r:2 G5:2 Bb5:2 C6:2 E6:4 D6:2 C6:2 | Bb5:4 G5:4 E5:4 C#5:4 | D5:8 r:4 B4:2 D5:2 | E5:4 G#5:4 B5:4 D6:4 |
                       C6:6 B5:2 A5:4 E5:4 | F#5:4 A5:4 C6:4 A5:4 | B5:4 G5:4 G#5:4 B5:4 | C6:4 A5:4 F#5:4 D5:4`,
                organ: 'x-----o-x-----o-',
                bass: `G2:4 B2 D3 E3 | C3 E3 G3 E3 | G2 B2 D3 F3 | G2 B2 D3 Db3 |
                       C3 E3 G3 E3 | C#3 E3 Bb2 Ab2 | G2 B2 D3 F3 | E3 D3 B2 Bb2 |
                       A2 C3 E3 Eb3 | D3 C3 A2 Ab2 | G2 B2 E2 G#2 | A2 C3 D3 F#2`,
                drums: {
                    hat: repeat(SHUFFLE, 12, '|'),
                    snare: repeat(BACKBEAT, 11, '|') + '|....x...o.o.x.o.',
                    kick: repeat('x.....o.x.......', 12, '|')
                }
            },
            // 休憩：ドラムはハイハットとリムだけ、オルガンは伸ばし、ベースは2分音符。ピアノは短く答えるだけ
            C: {
                chords: JAZZ_CHANGES,
                lead: `r:8 D5:4 G5:4 | Bb5:12 r:4 | r:16 | r:8 B4:4 D5:4 | E5:12 r:4 | r:16 |
                       r:8 G5:4 B5:4 | D6:12 r:4 | r:16 | r:8 F#5:4 A5:4 | G5:8 G#5:8 | A5:8 r:8`,
                organ: 'hold',
                bass: repeat('R:8 5:8', 10, '|') + '| R:8 R:8 | R:8 R:8',
                drums: {
                    hat: repeat('x...x...x...x...', 12, '|'),
                    rim: repeat('............o...', 11, '|') + '|....o...o...o.o.'
                }
            }
        },
        intro: ['intro'],
        loop: ['A', 'A2', 'B', 'C']
    };

    SoundKit.register('catalog', { songs: { blues } });
})();
