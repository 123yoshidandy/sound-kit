/**
 * 曲の一覧：月明かりの夜想曲（ノクターン・変ホ長調の8分の6拍子で、静かに歌う）
 * 1小節は12ステップ（付点4分音符×2）。左手のような8分の分散和音の上で、ピアノが歌う。ドラムは入れない
 * A → 終わりを変えた A' → 中間部 B（弦楽器を敷く）→ ハ短調の挿話 C → 戻りの A（チェロが低く歌う）
 */
(function () {
    // A の主題（前半7小節は、どの A でも同じ）
    const THEME_HEAD = `G5:6 Bb5:4 G5:2 | C6:8 Ab5:4 | Bb5:4 G5:2 Eb5:6 | D5:6 F5:4 Ab5:2 |
                        G5:6 C6:4 Eb6:2 | Eb6:8 C6:4 | Ab5:6 F5:2 D5:4`;
    const THEME = `${THEME_HEAD} | Eb5:12`;
    // A' の終わり：Bb7 で止めて、中間部へ
    const THEME_TURN = `${THEME_HEAD} | F5:12`;

    const CHORDS_A = 'Eb | Ab/Eb | Eb | Bb7 | Cm | Ab | Fm7:6 Bb7:6 | Eb';
    const CHORDS_TURN = 'Eb | Ab/Eb | Eb | Bb7 | Cm | Ab | Fm7:6 Bb7:6 | Bb7';

    // 戻りの A のチェロ：和音の音を、低く伸ばす
    const CELLO = 'Eb4:12 | Eb4:12 | G4:6 Bb4:6 | Ab4:12 | G4:12 | Ab4:12 | Ab4:6 D4:6 | D4:12';

    // 左手：8分の分散和音
    const LEFT = '0:2 1 2 3 2 1';
    const LEFT_B = '0:2 2 1 3 1 2';

    // 夜想曲：分散和音の上で、ピアノが歌う
    const nocturne = {
        title: '月明かりの夜想曲',
        tags: ['落ち着いた'],
        genre: 'クラシック',
        meter: '6/8',
        melody: ['lead'],
        bpm: 110,
        stepsPerBar: 12,
        gain: 0.064,
        reverb: { seconds: 2.8, tone: 0.45 },
        delay: { time: 1.5, feedback: 0.15, tone: 2000, reverb: 0.3 },
        humanize: { time: 0.012, velocity: 0.12 },
        parts: {
            lead: { instrument: 'piano', volume: 0.75, pan: -0.05, decay: 1.3, release: 0.5, brightness: 0.75, reverb: 0.3, delay: 0.08 },
            left: { instrument: 'piano', mode: 'arp', from: 'Eb3', volume: 0.39, pan: 0.15, decay: 1, release: 0.4, brightness: 0.6, reverb: 0.3 },
            cello: { instrument: 'strings', volume: 1.27, pan: 0.3, attack: 0.2, release: 0.5, brightness: 0.6, vibrato: 7, reverb: 0.4 },
            strings: { instrument: 'strings', mode: 'chords', center: 'Eb4', voices: 3, volume: 0.55, pan: -0.2, attack: 0.5, release: 0.8, brightness: 0.65, reverb: 0.45 },
            bass: { instrument: 'piano', mode: 'bass', octave: 2, volume: 0.42, decay: 1.5, release: 0.5, brightness: 0.5, reverb: 0.3 }
        },
        sections: {
            // イントロ：左手だけで始める
            intro: {
                label: 'イントロ',
                chords: 'Eb | Ab/Eb | Fm7 | Bb7',
                left: LEFT,
                bass: 'R:12'
            },
            A: {
                chords: CHORDS_A,
                lead: THEME,
                left: LEFT,
                bass: 'R:12'
            },
            // A'：終わりを Bb7 で止めて、中間部へ
            A2: {
                label: "A'",
                chords: CHORDS_TURN,
                lead: THEME_TURN,
                left: LEFT_B,
                bass: 'R:12'
            },
            // 中間部：Ab から、変ロ長調の方へ。弦楽器を敷く
            B: {
                chords: 'Ab | Bb | Gm7 | Cm | Fm7 | Bb7 | Ebmaj7 | Bb7',
                lead: `C6:6 Eb6:4 C6:2 | D6:8 Bb5:4 | Bb5:6 D6:4 G5:2 | G5:8 C6:4 |
                       Ab5:6 F5:6 | D6:6 F5:6 | G5:6 Bb5:4 D6:2 | D6:8 F5:4`,
                left: LEFT_B,
                strings: 'hold',
                bass: 'R:12'
            },
            // 挿話：ハ短調へ曇らせ、Fm7 → Bb7 で戻りの A へ
            C: {
                chords: 'Cm | Cm/Bb | Ab | G7 | Cm | Fm7 | Dm7b5:6 G7:6 | Fm7:6 Bb7:6',
                lead: `Eb5:6 G5:4 C6:2 | Bb5:8 G5:4 | Ab5:6 C6:4 Eb6:2 | D6:8 B5:4 |
                       C6:6 Eb6:4 G5:2 | Ab5:8 F5:4 | F5:6 B4:2 D5:4 | C5:6 D5:6`,
                left: LEFT_B,
                strings: 'hold',
                bass: 'R:12'
            },
            // 戻りの A：チェロが低く歌う。Bb7 で頭の Eb へ戻る
            A3: {
                label: 'A',
                chords: CHORDS_TURN,
                lead: THEME_TURN,
                cello: CELLO,
                left: LEFT,
                bass: 'R:12'
            }
        },
        intro: ['intro'],
        loop: ['A', 'A2', 'B', 'C', 'A3']
    };

    SoundKit.register('catalog', { songs: { nocturne } });
})();
