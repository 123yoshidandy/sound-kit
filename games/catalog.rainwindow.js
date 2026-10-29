/**
 * 曲の一覧：雨の日の窓辺（アンビエント・ト長調で、ゆっくり、静かに）
 * パッドが和音を薄く敷き、オルゴールの高い音が、窓をたたく雨粒のように不規則にぽつりと落ちる。その上で、ピアノが長い音でつぶやくように歌う
 * A' からエレピが小節の頭に和音をそっと置き、B はホ短調の方へ曇る。ドラムは入れない
 * 休憩の C はピアノを抜き、弦がひとりで低く歌う。最後は D7sus4 で頭の Gmaj7 へ戻る
 */
(function () {
    // A の主題（前半7小節は A' でも同じ）。maj7 の和音の上では根音を伸ばさない
    const THEME_HEAD = `D6:6 B5:2 F#5:8 | G5:8 B5:4 E5:4 | E5:6 G5:2 B5:8 | A5:8 F#5:4 D5:4 |
                        B5:6 D6:2 A5:8 | F#5:6 A5:2 D6:8 | G5:6 B5:2 E5:8`;
    const THEME = `${THEME_HEAD} | C6:8 A5:4 F#5:4`;
    const THEME2 = `${THEME_HEAD} | A5:8 C6:4 F#5:4`;
    const CHORDS_A = 'Gmaj7 | Em7 | Cmaj7 | D | Gmaj7 | Bm7 | Cmaj7 | Am7:8 D7:8';

    // 雨粒：オルゴールの高い音が、和音の音で不規則に落ちる
    const DROPS = `r:6 F#6:1 r:5 B5:1 r:3 | r:10 D6:1 r:5 | r:3 E6:1 r:8 G5:1 r:3 | r:12 A5:1 r:3 |
                   r:2 D6:1 r:9 F#6:1 r:3 | r:7 B5:1 r:8 | r:4 E6:1 r:7 B5:1 r:3 | r:9 A5:1 r:6`;
    // B の雨粒：少し間遠に
    const DROPS_B = `r:8 B5:1 r:7 | r:16 | r:5 E6:1 r:10 | r:16 |
                     r:11 C6:1 r:4 | r:16 | r:6 G5:1 r:9 | r:16`;

    // B：ホ短調の方へ曇り、D で休憩へ
    const CHORDS_B = 'Em | Bm | C | G | Am7 | Em7 | Cmaj7 | D7sus4:8 D:8';
    const SONG_B = `G5:6 F#5:2 E5:8 | B5:8 D6:4 F#5:4 | E5:6 G5:2 C6:8 | D6:8 B5:8 |
                    C6:6 B5:2 A5:8 | G5:6 E5:2 B5:8 | E5:4 G5:4 B5:4 D6:4 | C6:8 A5:4 F#5:4`;

    // 休憩：弦がひとりで低く歌う。D7sus4 で頭の Gmaj7 へ戻る
    const CHORDS_C = 'Cmaj7 | Bm7 | Am7 | Gmaj7 | Cmaj7 | Bm7 | Am7 | D7sus4';
    const STRINGS_C = `E5:8 G5:8 | F#5:8 D5:8 | C5:8 E5:8 | B4:8 D5:8 |
                       G5:8 E5:8 | D5:8 F#5:8 | E5:8 C5:8 | D5:8 C5:8`;

    // 雨の窓辺：ピアノとパッド、オルゴールの雨粒
    const rainwindow = {
        title: '雨の日の窓辺',
        tags: ['落ち着いた'],
        genre: 'アンビエント',
        melody: ['lead'],
        bpm: 66,
        gain: 0.13,
        reverb: { seconds: 3.2, tone: 0.45 },
        delay: { time: 0.75, feedback: 0.3, tone: 2000, reverb: 0.35 },
        humanize: { time: 0.01, velocity: 0.12 },
        parts: {
            lead: { instrument: 'piano', volume: 0.6, pan: -0.08, decay: 0.9, brightness: 0.7, reverb: 0.35, delay: 0.12 },
            // 休憩の C で歌う弦
            solo: { instrument: 'strings', volume: 0.9, pan: 0.15, attack: 0.3, release: 0.6, brightness: 0.7, vibrato: 9, reverb: 0.4 },
            // 雨粒のつもり：オルゴールの高い音
            drops: { instrument: 'musicBox', volume: 0.3, pan: 0.35, decay: 0.7, reverb: 0.45, delay: 0.3 },
            keys: { instrument: 'epiano', mode: 'chords', center: 'D4', voices: 3, volume: 0.4, pan: 0.22, warmth: 0.6, release: 0.6, reverb: 0.35 },
            pad: { instrument: 'pad', mode: 'chords', center: 'C4', voices: 3, volume: 0.36, cutoff: 900, attack: 1.2, release: 1.8, pan: -0.15, reverb: 0.5 },
            // 柔らかい三角波のベース
            bass: { instrument: 'synthBass', mode: 'bass', octave: 2, wave: 'triangle', cutoff: 260, envelope: 0.4, decay: 0.8, sustain: 0.6, release: 0.5, volume: 0.3, gate: 0.95 }
        },
        sections: {
            // イントロ：パッドと雨粒から、ベースが入る。D7sus4 で主題へ
            intro: {
                label: 'イントロ',
                chords: 'Gmaj7 | Em7 | Cmaj7 | D7sus4',
                pad: 'hold',
                drops: 'r:6 F#6:1 r:9 | r:10 D6:1 r:5 | r:3 E6:1 r:8 G5:1 r:3 | r:12 A5:1 r:3',
                bass: { pattern: 'r:16 | r:16 | R:16 | R:16' }
            },
            A: {
                chords: CHORDS_A,
                lead: THEME,
                pad: 'hold',
                drops: DROPS,
                bass: 'R:16'
            },
            // A'：エレピが小節の頭に和音をそっと置く
            A2: {
                label: "A'",
                chords: CHORDS_A,
                lead: THEME2,
                pad: 'hold',
                keys: 'x---------------',
                drops: DROPS,
                bass: 'R:16'
            },
            // B：ホ短調の方へ曇る。エレピは2拍ずつ、雨粒は間遠に
            B: {
                chords: CHORDS_B,
                lead: SONG_B,
                pad: 'hold',
                keys: 'x-------x-------',
                drops: DROPS_B,
                bass: 'R:8 5:8'
            },
            // 休憩：ピアノとエレピを抜き、弦がひとりで歌う。雨はまた降り続く
            C: {
                chords: CHORDS_C,
                solo: STRINGS_C,
                pad: 'hold',
                drops: DROPS,
                bass: 'R:16'
            }
        },
        intro: ['intro'],
        loop: ['A', 'A2', 'B', 'C']
    };

    SoundKit.register('catalog', { songs: { rainwindow } });
})();
