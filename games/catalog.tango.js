/**
 * 曲の一覧：黄昏のミロンガ（タンゴ・刻むリズムと哀愁）
 */
(function () {
    const { repeat } = SoundKit;

    // A の主題（前半4小節は A' でも同じ）。付点で引きずり、跳ね上げる
    const THEME_HEAD = `E5:3 A5:1 C6:8 B5:2 A5:2 | B5:3 A5:1 G#5:4 A5:8 | D5:3 F5:1 A5:8 G5:2 F5:2 | E5:8 G#5:4 B5:4`;
    const THEME = `${THEME_HEAD} |
                   D6:6 C6:2 A5:4 F5:4 | E5:6 A5:2 C6:8 | D6:4 B5:4 G#5:4 E5:4 | A5:12 r:4`;
    // A'：Dm から高く上がり、F を経て E7 でサビへ
    const THEME_TURN = `${THEME_HEAD} |
                        F5:6 A5:2 D6:8 | C6:6 B5:2 A5:4 E5:4 | A5:6 C6:2 F5:8 | E5:8 D5:4 B4:4`;
    // ループの終わり：E7 で、頭の Am へ戻る
    const THEME_LAST = `${THEME_HEAD} |
                        D6:6 C6:2 A5:4 F5:4 | E5:6 A5:2 C6:8 | D6:4 B5:4 G#5:4 E5:4 | B5:4 G#5:4 E5:4 D5:4`;

    // クラリネットの合いの手（主題の伸ばしている所に、下から答える）
    const COUNTER_A2 = 'r:16 | r:8 C5:4 E5:4 | r:16 | r:8 D5:4 E5:4 | r:16 | r:16 | r:8 A4:4 C5:4 | r:16';
    const COUNTER_A3 = 'r:16 | r:8 C5:4 E5:4 | r:16 | r:8 D5:4 E5:4 | r:16 | r:8 C5:4 E5:4 | r:16 | r:16';

    // オルガンの刻み：4つの刻み（マルカート）と、3-3-2 のシンコペ
    const MARCATO = 'X...x...X...x...';
    const SYNCOPA = 'x..x..x.x..x..x.';
    const BASS = 'R:3 5:3 R+:2 R:3 5:3 R:2';

    // タンゴ：オルガンの刻みとクラリネット、引きずるベース
    const tango = {
        title: '黄昏のミロンガ',
        tags: ['おしゃれ'],
        genre: 'ラテン',
        melody: ['lead'],
        bpm: 118,
        gain: 0.097,
        reverb: { seconds: 1.6, tone: 0.45 },
        delay: { time: 0.75, feedback: 0.18, tone: 2200 },
        humanize: { time: 0.005, velocity: 0.08 },
        parts: {
            lead: { instrument: 'piano', volume: 0.62, pan: -0.08, decay: 0.8, brightness: 0.8, reverb: 0.2, delay: 0.08 },
            clarinet: { instrument: 'clarinet', volume: 0.52, pan: 0.3, reverb: 0.28, delay: 0.1 },
            organ: { instrument: 'organ', mode: 'chords', center: 'D4', voices: 3, vibrato: 5, volume: 1.25, cutoff: 2400, pan: 0.2, gate: 0.45, reverb: 0.2 },
            pad: { instrument: 'organ', mode: 'chords', center: 'D4', voices: 3, vibrato: 5, volume: 0.3, pan: 0.2, reverb: 0.35 },
            bass: { instrument: 'pluck', mode: 'bass', octave: 2, brightness: 0.4, sustain: 0.994, release: 0.08, volume: 1, gate: 0.7 },
            drums: { instrument: 'drums', kit: 'soft', mode: 'drums', volume: 0.55, cutoff: 6000, levels: { kick: 0.6, rim: 0.4 } }
        },
        sections: {
            // イントロ：オルガンの刻みだけで始め、E7 で強く引きずる
            intro: {
                label: 'イントロ',
                chords: 'Am | Dm | E7 | E7',
                organ: `${MARCATO}|${MARCATO}|${SYNCOPA}|X.x.x.x.X-------`,
                bass: { pattern: `r:16 | r:16 | ${BASS} | R:2 R:2 R:2 R:2 R:8` }
            },
            A: {
                chords: 'Am | Am | Dm | E7 | Dm | Am | Bm7b5:8 E7:8 | Am',
                lead: THEME,
                organ: MARCATO,
                bass: BASS,
                drums: { kick: repeat('x.......x.......', 8, '|') }
            },
            // A'：刻みを 3-3-2 にして、クラリネットが答える
            A2: {
                label: "A'",
                chords: 'Am | Am | Dm | E7 | Dm | Am | F | E7',
                lead: THEME_TURN,
                clarinet: COUNTER_A2,
                organ: SYNCOPA,
                bass: BASS,
                drums: { kick: repeat('x.......x.......', 8, '|'), rim: repeat('...x..x....x..x.', 8, '|') }
            },
            // サビ：F から C 長調の方へ明るく。オルガンを伸ばして厚くし、3-3-2 はベースとリムで
            B: {
                chords: 'F | G7 | C | Am | Dm | G7 | C | E7',
                lead: `C6:6 A5:2 F5:4 A5:4 | B5:6 G5:2 D5:8 | E5:4 G5:4 C6:8 | C6:6 B5:2 A5:4 E5:4 |
                       F5:6 A5:2 D6:8 | D6:6 B5:2 G5:4 F5:4 | E5:6 G5:2 C6:8 | B5:6 G#5:2 E5:8`,
                pad: 'hold',
                bass: BASS,
                drums: { kick: repeat('x.......x.......', 8, '|'), rim: repeat('...x..x....x..x.', 8, '|') }
            },
            // 休憩：ピアノとドラムを抜き、クラリネットが歌う。オルガンは伸ばし、ベースは長く
            C: {
                chords: 'Am | Dm | E7 | Am | F | Dm | E7 | E7',
                clarinet: `A5:8 C6:4 B5:4 | A5:6 F5:2 D5:8 | E5:8 G#5:4 B5:4 | A5:12 r:4 |
                           C6:6 A5:2 F5:8 | F5:6 A5:2 D6:8 | B5:8 G#5:4 E5:4 | E5:12 r:4`,
                pad: 'hold',
                bass: 'R:8 5:8'
            },
            // A に、クラリネットの合いの手を足す。E7 で終えて、頭の Am へ戻る
            A3: {
                label: 'A',
                chords: 'Am | Am | Dm | E7 | Dm | Am | Bm7b5:8 E7:8 | E7',
                lead: THEME_LAST,
                clarinet: COUNTER_A3,
                organ: SYNCOPA,
                bass: BASS,
                drums: { kick: repeat('x.......x.......', 8, '|'), rim: repeat('...x..x....x..x.', 8, '|') }
            }
        },
        intro: ['intro'],
        loop: ['A', 'A2', 'B', 'C', 'A3']
    };

    SoundKit.register('catalog', { songs: { tango } });
})();
