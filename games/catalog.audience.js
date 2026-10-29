/**
 * 曲の一覧：王城の謁見の間（ゲーム音楽・変ロ長調の行進で、堂々と明るく）
 * ピアノの主題は付点のファンファーレの形で和音の音を上る。ブラスが2・4拍で「チャッ」と和音を打ち、主題が伸ばす所でラッパのように答える
 * ティンパニのつもりのタムが1・3拍で根を打ち、小太鼓が行進を刻む。B はト短調の方から巡り、弦が和音を伸ばす
 * 休憩の C はピアノと小太鼓を抜き、弦が気高く歌う。最後の A' はファンファーレが増え、F で頭の Bb へ戻る
 */
(function () {
    const { repeat } = SoundKit;
    const REST = '................';

    // A の主題（前半4小節は A' でも同じ）。付点のファンファーレの形
    const THEME_HEAD = `F5:3 F5:1 Bb5:4 D6:6 C6:2 | Bb5:4 G5:2 Bb5:2 Eb5:8 | D5:3 D5:1 F5:4 Bb5:6 A5:2 | C6:8 A5:4 F5:4`;
    const THEME = `${THEME_HEAD} |
                   G5:3 G5:1 Bb5:4 D6:6 C6:2 | Bb5:6 G5:2 Eb5:8 | C5:4 Eb5:4 F5:4 A5:4 | Bb5:12 r:4`;
    // A' の後半：C7 から F へ上って、次へ渡す
    const THEME_TURN = `${THEME_HEAD} |
                        G5:3 G5:1 Bb5:4 D6:6 C6:2 | Bb5:4 G5:4 Eb5:4 G5:4 | E5:4 G5:4 C6:6 Bb5:2 | A5:8 C6:4 F5:4`;
    const CHORDS_A = 'Bb | Eb | Bb | F | Gm | Eb | Cm7:8 F7:8 | Bb';
    const CHORDS_A2 = 'Bb | Eb | Bb | F | Gm | Eb | C7 | F';

    // ラッパのファンファーレ：主題が伸ばす所で答える
    const FANFARE_A = `r:16 | r:16 | r:16 | r:8 C5:3 C5:1 F5:4 | r:16 | r:16 | r:16 | r:4 F4:3 F4:1 Bb4:4 D5:4`;
    const FANFARE_A2 = `r:16 | r:8 Bb4:3 Bb4:1 Eb5:4 | r:16 | r:8 C5:3 C5:1 F5:4 | r:16 | r:8 G4:3 G4:1 Bb4:4 | r:16 | r:8 C5:3 C5:1 F5:4`;

    // B：ト短調の方から巡り、F で休憩へ
    const CHORDS_B = 'Gm | Dm | Eb | Bb | Cm | F | Bb/D:8 Eb:8 | F';
    const SONG_B = `D6:6 C6:2 Bb5:8 | A5:6 F5:2 D5:8 | Eb5:4 G5:4 Bb5:6 C6:2 | D6:8 Bb5:8 |
                    C6:6 Bb5:2 G5:4 Eb5:4 | F5:4 A5:4 C6:8 | Bb5:4 F5:4 G5:4 Bb5:4 | C6:6 Bb5:2 A5:4 F5:4`;
    const FANFARE_B = `r:16 | r:16 | r:16 | r:8 F4:3 F4:1 Bb4:4 | r:16 | r:8 C5:3 C5:1 F5:4 | r:16 | r:16`;

    // 休憩：弦が気高く歌う。F7 で最後の A' へ
    const CHORDS_C = 'Gm | Eb | Bb/D | F | Gm | Eb | Cm7 | F7';
    const SOLO_C = `D5:8 G5:8 | G5:8 Bb5:8 | F5:16 | A5:8 C6:8 |
                    Bb5:8 G5:8 | G5:8 Eb5:8 | Eb5:8 G5:8 | A5:8 F5:4 Eb5:4`;

    // 行進：ベースは1・3拍、ブラスの和音は2・4拍
    const BASS = 'R:4 r:4 5:4 r:4';
    const CHAH = '....x-......x-..';
    const TIMP = 'x.......x.......';
    const SNARE = '....x.......x.x.';
    const DRUMS_A = { tomLow: repeat(TIMP, 7, '|') + '|x.......x.x.x.x.', snare: repeat(SNARE, 8, '|') };
    const DRUMS_B = {
        tomLow: repeat(TIMP, 7, '|') + '|x.x.x.x.xxxxxxxx',
        tomMid: repeat('......x.......x.', 8, '|'),
        snare: repeat(SNARE, 8, '|'),
        crash: 'x...............|' + repeat(REST, 7, '|')
    };

    // 謁見の間：ピアノの主題、ブラスと弦、ティンパニと小太鼓
    const audience = {
        title: '王城の謁見の間',
        tags: ['明るい'],
        genre: 'ゲーム音楽',
        melody: ['lead'],
        bpm: 108,
        gain: 0.11,
        reverb: { seconds: 2.6, tone: 0.5 },
        delay: { time: 0.75, feedback: 0.2, tone: 2200, reverb: 0.25 },
        humanize: { time: 0.004, velocity: 0.07 },
        parts: {
            lead: { instrument: 'piano', volume: 0.52, pan: -0.08, decay: 0.85, brightness: 0.85, reverb: 0.25, delay: 0.08 },
            // ラッパのつもりのブラス：主題が伸ばす所で答える
            fanfare: { instrument: 'brass', volume: 0.7, pan: 0.3, brightness: 3, release: 0.15, vibrato: 4, reverb: 0.35 },
            // 2・4拍で「チャッ」と打つブラスの和音
            chah: { instrument: 'brass', mode: 'chords', center: 'D4', voices: 3, volume: 0.78, pan: -0.25, brightness: 2.5, release: 0.08, reverb: 0.25 },
            strings: { instrument: 'strings', mode: 'chords', center: 'F4', voices: 3, volume: 0.4, pan: 0.2, attack: 0.35, release: 0.7, brightness: 0.8, reverb: 0.4 },
            // 休憩の C で歌う弦
            solo: { instrument: 'strings', volume: 1.0, pan: 0.15, attack: 0.25, release: 0.6, brightness: 0.75, vibrato: 10, reverb: 0.4 },
            bass: { instrument: 'pluck', mode: 'bass', octave: 2, brightness: 0.45, volume: 0.85 },
            // ティンパニのつもりのタムと、行進の小太鼓
            drums: { instrument: 'drums', kit: 'soft', mode: 'drums', volume: 0.65, cutoff: 7000, levels: { tomLow: 0.7, tomMid: 0.5, snare: 0.45, crash: 0.3 } }
        },
        sections: {
            // イントロ：ファンファーレとティンパニの連打で始め、F で主題へ
            intro: {
                label: 'イントロ',
                chords: 'Bb | Eb | Bb/F | F',
                fanfare: 'F4:3 F4:1 Bb4:4 D5:8 | Eb5:6 Bb4:2 G4:8 | F4:3 F4:1 Bb4:4 D5:8 | C5:4 F5:4 A4:4 C5:4',
                chah: CHAH,
                strings: 'hold',
                bass: BASS,
                drums: { tomLow: `${TIMP}|${TIMP}|${TIMP}|x...x...x.x.x.x.`, snare: repeat(SNARE, 4, '|') }
            },
            A: {
                chords: CHORDS_A,
                lead: THEME,
                fanfare: FANFARE_A,
                chah: CHAH,
                bass: BASS,
                drums: DRUMS_A
            },
            // A'：ファンファーレが増え、F で B へ
            A2: {
                label: "A'",
                chords: CHORDS_A2,
                lead: THEME_TURN,
                fanfare: FANFARE_A2,
                chah: CHAH,
                bass: BASS,
                drums: DRUMS_A
            },
            // B：ト短調の方から巡り、弦が和音を伸ばす。タムが裏でも打つ
            B: {
                chords: CHORDS_B,
                lead: SONG_B,
                fanfare: FANFARE_B,
                chah: CHAH,
                strings: 'hold',
                bass: BASS,
                drums: DRUMS_B
            },
            // 休憩：ピアノと小太鼓を抜き、弦が歌う。ブラスは2拍目だけ、タムは小節の頭
            C: {
                chords: CHORDS_C,
                solo: SOLO_C,
                chah: '....x-..........',
                strings: 'hold',
                bass: 'R:4 r:12',
                drums: { tomLow: repeat('x...............', 7, '|') + '|x...x...x.x.x.x.' }
            },
            // 最後の A'：ファンファーレと弦、ティンパニがそろい、F で頭の Bb へ戻る
            A3: {
                label: "A'",
                chords: CHORDS_A2,
                lead: THEME_TURN,
                fanfare: FANFARE_A2,
                chah: CHAH,
                strings: 'hold',
                bass: BASS,
                drums: DRUMS_B
            }
        },
        intro: ['intro'],
        loop: ['A', 'A2', 'B', 'C', 'A3']
    };

    SoundKit.register('catalog', { songs: { audience } });
})();
