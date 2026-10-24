/**
 * 曲の一覧：ぜんまい仕掛けのラグ（ラグタイム・ハ長調で、ひょうきんに）
 * 左手は「ブン・チャッ」（低い根音と、2拍目・4拍目の和音）、右手は16分の食い込むリズム（短・長・短）
 * A' はバンジョー（明るいギター）が裏で刻み、B はヘ長調の方へ歌う。休憩の C はクラリネットがのんびり歌う
 */
(function () {
    const { repeat } = SoundKit;

    // 右手の主題：短・長・短の食い込みで始める小節が多い
    const THEME = `E5:1 G5:2 C6:1 r:1 C6:2 E5:1 G5:4 E5:4 | E5:1 G5:2 C#6:1 r:1 C#6:2 E5:1 A5:8 |
                   D5:1 F#5:2 A5:1 r:1 A5:2 D5:1 C6:4 A5:4 | B5:4 G5:2 F5:2 D5:8 |
                   E5:1 G5:2 C6:1 r:1 C6:2 E5:1 G5:4 E5:4 | E5:1 G5:2 Bb5:1 r:1 Bb5:2 E5:1 C6:8 |
                   A5:4 C6:4 C6:4 A5:4 | G5:4 E5:4 D5:4 F5:2 G5:2`;
    const CHORDS_A = 'C | A7 | D7 | G7 | C | C7 | F:8 F#dim7:8 | C/G:8 G7:8';

    // 左手：低い根音（1拍目）と5度（3拍目）、2拍目と4拍目に和音
    const STRIDE = '....x-......x-..';
    const BASS = 'R:4 r:4 5:4 r:4';
    // バンジョー：8分の裏で刻む
    const BANJO = '..x-..x-..x-..x-';
    const TAP = { rim: repeat('....x.......x...', 8, '|'), kick: repeat('x.......x.......', 8, '|') };

    // ラグタイム：ピアノの左手と右手
    const ragtime = {
        title: 'ぜんまい仕掛けのラグ',
        tags: ['明るい', '軽快'],
        genre: 'ジャズ・ブルース',
        melody: ['lead'],
        bpm: 96,
        gain: 0.09,
        reverb: { seconds: 1.4, tone: 0.5 },
        delay: { time: 0.75, feedback: 0.15, tone: 2400 },
        humanize: { time: 0.005, velocity: 0.1 },
        parts: {
            lead: { instrument: 'piano', volume: 0.64, pan: -0.05, decay: 0.7, brightness: 0.9, reverb: 0.15, delay: 0.05 },
            clarinet: { instrument: 'clarinet', volume: 0.5, pan: 0.25, attack: 0.05, release: 0.2, vibrato: 7, reverb: 0.25 },
            stride: { instrument: 'piano', mode: 'chords', center: 'E4', voices: 3, volume: 0.45, pan: 0.05, decay: 0.5, brightness: 0.7, gate: 0.5, reverb: 0.12 },
            bass: { instrument: 'piano', mode: 'bass', octave: 2, volume: 0.45, decay: 0.6, brightness: 0.6, gate: 0.8, reverb: 0.1 },
            banjo: { instrument: 'guitar', mode: 'chords', center: 'G4', voices: 3, strum: 0.006, brightness: 0.95, gate: 0.35, volume: 0.6, pan: 0.35, reverb: 0.12 },
            drums: { instrument: 'drums', kit: 'soft', mode: 'drums', volume: 0.55, cutoff: 7000, levels: { kick: 0.45, rim: 0.4 } }
        },
        sections: {
            // イントロ：左手だけで歩き出し、G7 で主題へ
            intro: {
                label: 'イントロ',
                chords: 'C | A7 | D7 | G7',
                stride: STRIDE,
                bass: BASS
            },
            A: {
                chords: CHORDS_A,
                lead: THEME,
                stride: STRIDE,
                bass: BASS
            },
            // A'：バンジョーが裏で刻み、拍子木（リム）を足す
            A2: {
                label: "A'",
                chords: CHORDS_A,
                lead: THEME,
                stride: STRIDE,
                banjo: BANJO,
                bass: BASS,
                drums: TAP
            },
            // B：ヘ長調の方へ、長い音で歌う。G7 で休憩へ
            B: {
                chords: 'F | Dm | Gm7 | C7 | F | D7 | G7 | G7',
                lead: `A5:6 G5:2 F5:8 | D6:6 C6:2 A5:8 | Bb5:4 A5:2 G5:2 D5:8 | E5:4 G5:4 Bb5:8 |
                       C6:6 A5:2 F5:8 | F#5:4 A5:4 C6:8 | B5:6 A5:2 G5:4 F5:4 | D5:4 F5:4 G5:4 B5:4`,
                stride: STRIDE,
                banjo: BANJO,
                bass: BASS,
                drums: TAP
            },
            // 休憩：右手を抜き、クラリネットがのんびり歌う。G7 で頭の C へ戻る
            C: {
                chords: 'C | Am | Dm7 | G7 | C | Am | D7 | G7',
                clarinet: `E5:8 G5:8 | A5:8 E5:8 | F5:8 D5:8 | B4:12 r:4 |
                           C5:8 E5:8 | A5:8 C6:8 | A5:8 F#5:8 | G5:8 F5:8`,
                stride: STRIDE,
                bass: BASS
            },
            // 最後の A：全員で。C/G → G7 で頭の C へ戻る
            A3: {
                label: 'A',
                chords: CHORDS_A,
                lead: THEME,
                stride: STRIDE,
                banjo: BANJO,
                bass: BASS,
                drums: TAP
            }
        },
        intro: ['intro'],
        loop: ['A', 'A2', 'B', 'C', 'A3']
    };

    SoundKit.register('catalog', { songs: { ragtime } });
})();
