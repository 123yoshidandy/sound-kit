/**
 * 曲の一覧：砂ぼこりの一本道（カントリー・軽快なバンジョー風）
 * フィドルは弦楽器、バンジョーのロールは明るいギター。A' からはアコースティックギターの裏拍のかき鳴らしを足す
 */
(function () {
    const { repeat } = SoundKit;

    // A の主題（前半4小節は A' でも同じ）
    const THEME_HEAD = `E5:2 F#5:2 A5:4 C#6:6 B5:2 | A5:6 F#5:2 D5:8 | E5:4 A5:4 C#6:4 A5:4 | B5:8 G#5:4 E5:4`;
    const THEME = `${THEME_HEAD} |
                   E5:2 F#5:2 A5:4 C#6:6 B5:2 | D6:6 B5:2 A5:8 | G#5:4 B5:4 D6:4 B5:4 | A5:12 r:4`;
    // A'：F#m へ寄り道して、E7 でサビへ
    const THEME_TURN = `${THEME_HEAD} |
                        C#6:6 A5:2 F#5:8 | F#5:4 A5:4 D6:8 | B5:6 G#5:2 E5:8 | D5:4 E5:4 G#5:4 B5:4`;
    // ループの終わり：E7 へ上がって、頭の A へ戻る
    const THEME_LAST = `${THEME_HEAD} |
                        E5:2 F#5:2 A5:4 C#6:6 B5:2 | D6:6 B5:2 A5:8 | G#5:4 B5:4 D6:4 B5:4 | A5:8 B5:4 G#5:4`;

    // フィドルの合いの手（最後の A で、主題の伸ばしている所に足す）
    const COUNTER = 'r:16 | r:8 F#5:4 A5:4 | r:16 | r:16 | r:16 | r:8 F#5:4 D6:4 | r:16 | r:16';

    // 明るいギターで、バンジョーのロールの代わりにする（16分で動くのはこれだけ）
    const ROLL = '0:1 1 2 0 1 2 0 1 2 1 2 0 1 2 1 2';
    const ROLL_SLOW = '0:2 1 2 1 0 1 2 1';
    // 根音と5度を行き来する
    const BASS = 'R:4 5:4 R+:4 5:4';
    // アコースティックギター：8分の裏でかき鳴らす
    const STRUM = '..x-..x-..x-..x-';

    const DRUMS = {
        kick: repeat('x.......x.......', 8, '|'),
        snare: repeat('....x.......x...', 8, '|'),
        hat: repeat('x.o.x.o.x.o.x.o.', 8, '|')
    };
    const DRUMS_FILL = {
        kick: repeat('x.......x.......', 8, '|'),
        snare: repeat('....x.......x...', 7, '|') + '|....x.......x.xx',
        hat: repeat('x.o.x.o.x.o.x.o.', 7, '|') + '|x.o.x.o.x.o.....'
    };

    // カントリー：バンジョー風のロールと、軽快な2ビート
    const country = {
        title: '砂ぼこりの一本道',
        tags: ['明るい', '軽快'],
        genre: 'ロック・ポップ',
        melody: ['lead'],
        bpm: 116,
        gain: 0.11,
        reverb: { seconds: 1.4, tone: 0.5 },
        delay: { time: 0.75, feedback: 0.18, tone: 2400 },
        humanize: { time: 0.004, velocity: 0.1 },
        parts: {
            lead: { instrument: 'piano', volume: 0.5, pan: -0.08, decay: 0.7, brightness: 0.85, reverb: 0.18, delay: 0.08 },
            fiddle: { instrument: 'strings', volume: 0.7, pan: 0.3, attack: 0.05, release: 0.2, brightness: 0.95, vibrato: 10, reverb: 0.28, delay: 0.1 },
            banjo: { instrument: 'guitar', mode: 'arp', from: 'C#4', brightness: 0.75, volume: 0.35, pan: 0.28, reverb: 0.18 },
            guitar: { instrument: 'guitar', mode: 'chords', center: 'E4', voices: 3, strum: 0.006, brightness: 0.5, gate: 0.6, volume: 0.45, pan: -0.3, reverb: 0.15 },
            pad: { instrument: 'pad', mode: 'chords', center: 'A3', voices: 3, volume: 0.25, cutoff: 1000, reverb: 0.4 },
            bass: { instrument: 'pluck', mode: 'bass', octave: 2, brightness: 0.4, sustain: 0.994, release: 0.08, volume: 0.9, gate: 0.7 },
            drums: { instrument: 'drums', kit: 'soft', mode: 'drums', volume: 0.55, cutoff: 7000, levels: { kick: 0.7, snare: 0.4, hat: 0.35 } }
        },
        sections: {
            // イントロ：ロールだけで始め、E7 で主題へ
            intro: {
                label: 'イントロ',
                chords: 'A | D | A | E7',
                banjo: ROLL,
                bass: { pattern: `r:16 | r:16 | ${BASS} | ${BASS}` },
                drums: { hat: '................|................|x.o.x.o.x.o.x.o.|x.o.x.o.x.o.x.o.' }
            },
            A: {
                chords: 'A | D | A | E7 | A | D | E7 | A',
                lead: THEME,
                banjo: ROLL,
                bass: BASS,
                drums: DRUMS
            },
            A2: {
                label: "A'",
                chords: 'A | D | A | E7 | F#m | D | E7 | E7',
                lead: THEME_TURN,
                banjo: ROLL,
                guitar: STRUM,
                bass: BASS,
                drums: DRUMS_FILL
            },
            // サビ：IV の D から、長めの音で歌う。パッドを足す
            B: {
                chords: 'D | A | D | E7 | D | A | Bm7:8 E7:8 | A',
                lead: `F#5:4 A5:4 D6:8 | C#6:6 B5:2 A5:8 | F#5:4 A5:4 B5:4 A5:4 | B5:6 G#5:2 E5:8 |
                       D6:6 C#6:2 A5:4 F#5:4 | E5:4 A5:4 C#6:8 | B5:4 D6:4 B5:4 G#5:4 | A5:12 r:4`,
                banjo: ROLL,
                guitar: STRUM,
                pad: 'hold',
                bass: BASS,
                drums: DRUMS
            },
            // 休憩：ピアノを抜き、フィドルが長く歌う。ロールは8分、ドラムはハイハットだけ
            C: {
                chords: 'F#m | D | A | E7 | F#m | D | Bm7 | E7',
                fiddle: `C#6:8 A5:8 | A5:8 F#5:8 | E5:8 C#6:8 | B5:12 r:4 |
                         A5:8 C#6:8 | D6:8 A5:8 | B5:8 F#5:8 | G#5:8 B5:8`,
                banjo: ROLL_SLOW,
                pad: 'hold',
                bass: 'R:8 5:8',
                drums: { hat: repeat('x...x...x...x...', 8, '|') }
            },
            // A に、合いの手を足す。E7 で終えて、頭の A へ戻る
            A3: {
                label: 'A',
                chords: 'A | D | A | E7 | A | D | E7 | A:8 E7:8',
                lead: THEME_LAST,
                fiddle: COUNTER,
                banjo: ROLL,
                guitar: STRUM,
                bass: BASS,
                drums: DRUMS_FILL
            }
        },
        intro: ['intro'],
        loop: ['A', 'A2', 'B', 'C', 'A3']
    };

    SoundKit.register('catalog', { songs: { country } });
})();
