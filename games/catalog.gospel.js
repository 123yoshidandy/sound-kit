/**
 * 曲の一覧：日曜日の大合唱（ゴスペル・オルガンとピアノで大きく歌う）
 */
(function () {
    const { repeat } = SoundKit;

    // A の主題（前半6小節は A' でも同じ）。大きく跳んで、伸ばす
    const THEME_HEAD = `Eb5:4 Ab5:4 C6:8 | Db6:6 C6:2 Ab5:8 | C6:4 Bb5:2 Ab5:2 F5:4 Eb5:4 | G5:8 Bb5:4 Db6:4 |
                        Eb5:4 Ab5:4 C6:8 | F5:6 Ab5:2 Db6:8`;
    const THEME = `${THEME_HEAD} | C6:6 Bb5:2 G5:4 Bb5:4 | Ab5:12 r:4`;
    // ループの終わり：Eb7 へ上がって、頭の Ab へ戻る
    const THEME_LAST = `${THEME_HEAD} | C6:6 Bb5:2 G5:4 Bb5:4 | Ab5:8 Bb5:4 G5:4`;

    // オルガンの合いの手（休憩と、最後の A で）
    const LICKS_C = `r:8 Eb5:2 F5:2 Ab5:4 | r:16 | r:8 F5:2 Ab5:2 Db6:4 | r:16 |
                     r:8 Eb5:2 F5:2 Ab5:4 | r:16 | r:8 F5:2 Ab5:2 Db6:4 | r:8 Db6:2 Bb5:2 G5:4`;
    const LICKS_A = `r:8 Eb5:2 F5:2 Ab5:4 | r:16 | r:16 | r:16 |
                     r:8 Eb5:2 F5:2 Ab5:4 | r:8 F5:2 Ab5:2 Bb5:4 | r:16 | r:16`;

    // ピアノの和音の刻み（跳ねる8分）と、ベース
    const COMP = 'x---x-x-x---x-x-';
    const BASS = 'R:6 R:2 5:4 R+:2 5:2';

    const DRUMS = {
        kick: repeat('x.....x.x.......', 8, '|'),
        clap: repeat('....x.......x...', 8, '|'),
        hat: repeat('x.x.x.x.x.x.x.x.', 8, '|')
    };
    const DRUMS_FILL = {
        kick: repeat('x.....x.x.......', 8, '|'),
        clap: repeat('....x.......x...', 7, '|') + '|....x.......x.x.',
        hat: repeat('x.x.x.x.x.x.x.x.', 7, '|') + '|x.x.x.x.........',
        tom: repeat('................', 7, '|') + '|............x.x.'
    };

    // ゴスペル：オルガンの伸ばしとピアノの和音、2・4拍の手拍子
    const gospel = {
        title: '日曜日の大合唱',
        tags: ['明るい', '落ち着いた'],
        genre: 'ファンク・ソウル',
        melody: ['lead'],
        bpm: 84,
        swing: 0.16,
        swingUnit: 2,
        gain: 0.08,
        reverb: { seconds: 2.2, tone: 0.45 },
        delay: { time: 0.75, feedback: 0.18, tone: 2200 },
        humanize: { time: 0.006, velocity: 0.1 },
        parts: {
            lead: { instrument: 'piano', volume: 0.8, pan: -0.08, decay: 0.9, brightness: 0.85, reverb: 0.25, delay: 0.08 },
            licks: { instrument: 'organ', volume: 0.8, pan: 0.3, reverb: 0.25, delay: 0.1 },
            comp: { instrument: 'piano', mode: 'chords', center: 'Eb4', voices: 4, volume: 0.22, pan: 0.15, decay: 0.6, brightness: 0.7, reverb: 0.2 },
            organ: { instrument: 'organ', mode: 'chords', center: 'Ab3', voices: 3, volume: 0.55, cutoff: 2200, pan: -0.15, autopan: { rate: 0.8, depth: 0.25 }, reverb: 0.35 },
            bass: { instrument: 'synthBass', mode: 'bass', octave: 2, volume: 0.85, cutoff: 360, decay: 0.3, sustain: 0.45, release: 0.08, gate: 0.85 },
            drums: { instrument: 'drums', kit: 'soft', mode: 'drums', volume: 0.6, cutoff: 7000, levels: { kick: 0.75, clap: 0.55, hat: 0.3, tom: 0.5 } }
        },
        sections: {
            // イントロ：オルガンとピアノだけで、Eb7 へ
            intro: {
                label: 'イントロ',
                chords: 'Ab | Db/Ab | Ab | Eb7',
                organ: 'hold',
                comp: COMP,
                bass: { pattern: `r:16 | r:16 | ${BASS} | ${BASS}` }
            },
            A: {
                chords: 'Ab | Db/Ab | Ab | Eb7 | Ab | Db | Ab/Eb:8 Eb7:8 | Ab',
                lead: THEME,
                organ: 'hold',
                comp: COMP,
                bass: BASS,
                drums: DRUMS
            },
            // B：IV の Db から、Dbm6 へ曇らせ、F7 → Bbm7 → Eb7 と回す
            B: {
                chords: 'Db | Dbm6 | Ab/Eb | F7 | Bbm7 | Eb7 | Ab:8 F7:8 | Bbm7:8 Eb7:8',
                lead: `F5:4 Ab5:4 Db6:8 | Bb5:6 Ab5:2 E5:8 | Eb5:4 Ab5:4 C6:8 | A5:6 C6:2 Eb5:8 |
                       Db6:6 C6:2 Bb5:8 | G5:6 Bb5:2 Db6:8 | C6:4 Ab5:4 A5:4 C6:4 | Bb5:4 F5:4 G5:4 Eb5:4`,
                organ: 'hold',
                comp: COMP,
                bass: BASS,
                drums: DRUMS_FILL
            },
            // 休憩：ピアノの主旋律と手拍子を抜き、オルガンが短く答える
            C: {
                chords: 'Ab | Fm7 | Db | Eb7 | Ab | Fm7 | Db | Eb7',
                licks: LICKS_C,
                organ: 'hold',
                comp: 'x-------x-------',
                bass: 'R:8 5:8',
                drums: { kick: repeat('x.......x.......', 8, '|'), hat: repeat('x...x...x...x...', 8, '|') }
            },
            // A に、オルガンの合いの手を足す。Eb7 で終えて、頭の Ab へ戻る
            A2: {
                label: "A'",
                chords: 'Ab | Db/Ab | Ab | Eb7 | Ab | Db | Ab/Eb:8 Eb7:8 | Ab:8 Eb7:8',
                lead: THEME_LAST,
                licks: LICKS_A,
                organ: 'hold',
                comp: COMP,
                bass: BASS,
                drums: DRUMS_FILL
            }
        },
        intro: ['intro'],
        loop: ['A', 'B', 'C', 'A2']
    };

    SoundKit.register('catalog', { songs: { gospel } });
})();
