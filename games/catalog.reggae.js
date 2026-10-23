/**
 * 曲の一覧：ひだまりの港（レゲエ。裏拍の刻みとワンドロップで、のどかに）
 * 曲の書き方は docs/composing.md にある。長さは16分音符の数で、'|' は小節の区切り
 */
(function () {
    const { repeat } = SoundKit;

    // A の主題（前半4小節は A' でも同じ）。小節の頭を休んで、ゆったり歌う
    const THEME_HEAD = `r:4 B5:2 D6:2 B5:4 G5:2 A5:2 | B5:6 G5:2 E5:8 |
                        r:4 E5:2 G5:2 C6:4 B5:2 A5:2 | A5:8 r:4 F#5:2 G5:2`;
    const THEME = `${THEME_HEAD} |
                   r:4 B5:2 D6:2 B5:4 G5:2 A5:2 | B5:6 A5:2 G5:4 E5:4 |
                   r:4 E5:2 G5:2 C6:4 B5:2 A5:2 | A5:6 F#5:2 D5:4 r:4`;
    // A' の終わり：主音に落ち着き、サビへ上がる
    const THEME_END = `${THEME_HEAD} |
                       r:4 D6:2 B5:2 D6:4 G5:2 A5:2 | B5:6 A5:2 G5:4 B5:4 |
                       A5:4 C6:2 B5:2 A5:4 F#5:4 | G5:8 r:4 D5:2 E5:2`;

    const CHORDS_A = 'G | Em7 | C | D | G | Em7 | Am7 | D7';
    const CHORDS_A2 = 'G | Em7 | C | D | G | Em7 | Am7:8 D7:8 | G';

    // ビブラフォンの合いの手（2回目の A で、主題の伸ばしている所に足す）
    const COUNTER = 'r:16 | r:10 G5:2 B5:4 | r:16 | r:8 D6:2 A5:2 r:4 | r:16 | r:10 E6:2 B5:4 | r:16 | r:12 A5:2 C6:2';

    // ゆったりした低音：3拍目を空けて、ワンドロップと合わせる
    const BASS = 'R:6 R:2 r:2 5-:2 3:3 r:1';
    // はじく弦のスカンク（2拍目と4拍目を短く）と、オルガンの裏拍の刻み
    const SKANK = '....x-......x-..';
    const BUBBLE = '..o...o...o...o.';

    // ワンドロップ：1拍目にキックを置かず、3拍目にキックとリム
    const ONE_DROP = {
        kick: repeat('........x.......', 8, '|'),
        rim: repeat('........x.......', 8, '|'),
        hat: repeat('x.o.x.o.x.o.x.o.', 8, '|')
    };
    // 最後の小節にタムを入れて、次の区間へつなぐ
    const ONE_DROP_FILL = {
        kick: repeat('........x.......', 8, '|'),
        rim: repeat('........x.......', 7, '|') + '|........x.......',
        hat: repeat('x.o.x.o.x.o.x.o.', 7, '|') + '|x.o.x.o.x.......',
        openHat: repeat('..............x.', 7, '|') + '|................',
        tom: repeat('................', 7, '|') + '|..........x.x.x.'
    };

    // ピアノとはじく弦：日なたの港のように、のどかで明るく
    const reggae = {
        title: 'ひだまりの港',
        tags: ['明るい', '落ち着いた'],
        genre: 'ワールド',
        melody: ['lead'],
        bpm: 78,
        swing: 0.08,
        gain: 0.12,
        reverb: { seconds: 2, tone: 0.45 },
        delay: { time: 0.75, feedback: 0.3, tone: 2200, reverb: 0.2 },
        humanize: { time: 0.006, velocity: 0.08 },
        parts: {
            lead: { instrument: 'piano', volume: 0.48, pan: -0.1, decay: 0.9, brightness: 0.8, reverb: 0.25, delay: 0.14 },
            counter: { instrument: 'vibes', volume: 0.45, pan: 0.3, reverb: 0.35, delay: 0.2 },
            skank: { instrument: 'pluck', mode: 'chords', center: 'F4', voices: 3, volume: 0.67, pan: 0.25, brightness: 0.5, sustain: 0.99, release: 0.05, gate: 0.6, reverb: 0.2, delay: 0.1 },
            organ: { instrument: 'organ', mode: 'chords', center: 'D4', voices: 3, volume: 1.4, pan: -0.25, gate: 0.6, reverb: 0.2 },
            pad: { instrument: 'pad', mode: 'chords', center: 'A3', voices: 3, volume: 0.26, cutoff: 900, reverb: 0.45 },
            bass: { instrument: 'synthBass', mode: 'bass', octave: 2, volume: 0.41, wave: 'triangle', cutoff: 280, envelope: 1, decay: 0.8, sustain: 0.7, release: 0.12, gate: 0.9 },
            drums: { instrument: 'drums', kit: 'soft', mode: 'drums', volume: 0.57, cutoff: 7000, levels: { kick: 0.8, rim: 0.55, hat: 0.4, openHat: 0.35, tom: 0.45, shaker: 0.5 } }
        },
        sections: {
            intro: {
                label: 'イントロ',
                chords: 'G | C | G | D7',
                skank: SKANK,
                bass: { pattern: `r:16 | r:16 | ${BASS} | ${BASS}` },
                drums: {
                    hat: '................|................|x.o.x.o.x.o.x.o.|x.o.x.o.x.......',
                    kick: '................|................|........x.......|........x.......',
                    rim: '................|................|........x.......|........x.......',
                    tom: '................|................|................|..........x.x.x.'
                }
            },
            A: {
                chords: CHORDS_A,
                lead: THEME,
                skank: SKANK,
                bass: BASS,
                drums: ONE_DROP
            },
            // オルガンの裏拍を足す
            A2: {
                label: "A'",
                chords: CHORDS_A2,
                lead: THEME_END,
                skank: SKANK,
                organ: BUBBLE,
                bass: BASS,
                drums: ONE_DROP_FILL
            },
            // サビ：IV から始めて、高めの長い音で歌う。パッドを敷き、シェイカーを足す
            B: {
                chords: 'Cmaj7 | D | Bm7 | Em7 | Am7 | Bm7 | C | D7',
                lead: `E5:4 G5:4 B5:6 A5:2 | F#5:6 A5:2 D6:8 | D6:6 B5:2 F#5:8 | G5:6 E5:2 B5:8 |
                       C6:6 B5:2 A5:4 E5:4 | F#5:6 A5:2 D6:4 B5:4 | E5:4 G5:4 C6:6 B5:2 | A5:6 F#5:2 C6:4 A5:4`,
                skank: SKANK,
                organ: BUBBLE,
                pad: 'hold',
                bass: BASS,
                drums: {
                    kick: repeat('........x.......', 8, '|'),
                    rim: repeat('........x.......', 8, '|'),
                    hat: repeat('x.o.x.o.x.o.x.o.', 8, '|'),
                    shaker: repeat('.o.o.o.o.o.o.o.o', 8, '|')
                }
            },
            // 休憩：ドラムとオルガンを抜き、メロディはまばらに。エコーで広げる
            C: {
                chords: 'C | G | C | D7',
                lead: 'r:8 E5:2 G5:2 C6:4 | B5:12 r:4 | r:8 E5:2 G5:2 C6:4 | A5:8 F#5:4 r:4',
                skank: SKANK,
                pad: 'hold',
                bass: 'R:6 r:2 r:4 5-:4',
                drums: {
                    rim: '........x.......|........x.......|........x.......|........x...x.x.'
                }
            },
            // A に、ビブラフォンの合いの手とオルガンを足す。D7 で終えて、頭の G へ戻る
            A3: {
                label: 'A',
                chords: CHORDS_A,
                lead: THEME,
                counter: COUNTER,
                skank: SKANK,
                organ: BUBBLE,
                bass: BASS,
                drums: ONE_DROP_FILL
            }
        },
        intro: ['intro'],
        loop: ['A', 'A2', 'B', 'C', 'A3']
    };

    SoundKit.register('catalog', { songs: { reggae } });
})();
