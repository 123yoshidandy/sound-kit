/**
 * 曲の一覧：旅の終わりに（エンディング・イ長調で、温かくゆっくり）
 * スタッフロールのための、ピアノのバラード。左手のような8分の分散和音の上で、ピアノが振り返るように歌う
 * A' はチェロ（低い弦楽器）が支え、B は D から高く上がって弦楽器を敷く。休憩の C はフルートが歌う
 */
(function () {
    // A の主題（前半7小節は A' でも同じ）
    const THEME_HEAD = `E5:4 A5:4 C#6:6 B5:2 | B5:8 G#5:4 E5:4 | A5:6 G#5:2 F#5:4 E5:4 | F#5:8 E5:4 D5:4 |
                        C#5:4 E5:4 A5:6 B5:2 | D6:8 A5:4 F#5:4 | D6:4 B5:4 G#5:4 B5:4`;
    const THEME = `${THEME_HEAD} | A5:12 r:4`;
    // A' の終わり：A7 へ進んで、B の D へ
    const THEME_TURN = `${THEME_HEAD} | A5:8 G5:8`;
    const CHORDS_A = 'A | E/G# | F#m7 | D | A/C# | D | Bm7:8 E:8 | A';
    const CHORDS_A2 = 'A | E/G# | F#m7 | D | A/C# | D | Bm7:8 E:8 | A:8 A7:8';

    // A' のチェロ：和音の音を、低く伸ばす
    const CELLO = 'C#4:16 | B3:16 | A3:16 | A3:16 | A3:16 | A3:16 | B3:16 | C#4:16';

    // 左手：8分の分散和音
    const LEFT = '0:2 1 2 3 2 1 2 1';

    // エンディング：分散和音の上で、ピアノが歌う
    const ending = {
        title: '旅の終わりに',
        tags: ['落ち着いた'],
        genre: 'ゲーム音楽',
        melody: ['lead'],
        bpm: 76,
        gain: 0.085,
        reverb: { seconds: 2.8, tone: 0.45 },
        delay: { time: 0.75, feedback: 0.2, tone: 2000, reverb: 0.3 },
        humanize: { time: 0.01, velocity: 0.1 },
        parts: {
            lead: { instrument: 'piano', volume: 0.72, pan: -0.05, decay: 1.3, release: 0.4, brightness: 0.75, reverb: 0.3, delay: 0.08 },
            left: { instrument: 'piano', mode: 'arp', from: 'E3', volume: 0.34, pan: 0.15, decay: 1, release: 0.4, brightness: 0.6, reverb: 0.3 },
            cello: { instrument: 'strings', volume: 1.1, pan: 0.3, attack: 0.25, release: 0.6, brightness: 0.6, vibrato: 7, reverb: 0.4 },
            flute: { instrument: 'flute', volume: 0.55, pan: 0.25, vibrato: 10, breath: 0.04, reverb: 0.4, delay: 0.15 },
            strings: { instrument: 'strings', mode: 'chords', center: 'E4', voices: 3, volume: 0.35, pan: -0.2, attack: 0.6, release: 0.9, brightness: 0.65, vibrato: 8, reverb: 0.5 },
            bass: { instrument: 'piano', mode: 'bass', octave: 2, volume: 0.42, decay: 1.5, release: 0.5, brightness: 0.5, reverb: 0.3 }
        },
        sections: {
            // イントロ：左手だけで始め、E で主題へ
            intro: {
                label: 'イントロ',
                chords: 'A | F#m7 | D | Esus4:8 E:8',
                left: LEFT,
                bass: 'R:16'
            },
            A: {
                chords: CHORDS_A,
                lead: THEME,
                left: LEFT,
                bass: 'R:16'
            },
            // A'：チェロが低く支え、A7 で B へ
            A2: {
                label: "A'",
                chords: CHORDS_A2,
                lead: THEME_TURN,
                cello: CELLO,
                left: LEFT,
                bass: 'R:16'
            },
            // B：D から高く上がり、弦楽器を敷く。E で休憩へ
            B: {
                chords: 'D | E | C#m7 | F#m | Bm7 | E | A/C#:8 D:8 | Esus4:8 E:8',
                lead: `F#5:6 A5:2 D6:8 | B5:6 G#5:2 E5:8 | E5:4 G#5:4 B5:8 | A5:6 G#5:2 F#5:8 |
                       D6:6 C#6:2 B5:8 | G#5:4 B5:4 B5:8 | C#6:4 A5:4 A5:4 F#5:4 | A5:8 G#5:8`,
                left: LEFT,
                strings: 'hold',
                bass: 'R:16'
            },
            // 休憩：ピアノの主旋律を抜き、フルートが歌う。弦楽器を敷いたまま。E で頭の A へ戻る
            C: {
                chords: 'A | F#m | D | E | A | F#m | Bm7 | E',
                flute: 'E5:8 A5:8 | A5:8 F#5:8 | F#5:8 A5:8 | G#5:16 | C#6:8 A5:8 | C#6:8 A5:8 | B5:8 D6:8 | B5:8 G#5:8',
                left: '0:4 1 2 1',
                strings: 'hold',
                bass: 'R:16'
            }
        },
        intro: ['intro'],
        loop: ['A', 'A2', 'B', 'C']
    };

    SoundKit.register('catalog', { songs: { ending } });
})();
