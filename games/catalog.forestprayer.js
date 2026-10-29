/**
 * 曲の一覧：森の奥の祈り（アンビエント・ニ長調で、ゆっくり、静かに）
 * パッドが和音を薄く敷き、カリンバが4分でぽつりぽつりと分散和音をつまびく。その上で、ピアノが長い音で祈るように歌う
 * 高い笛が、鳥の声のように短くさえずる。A' から合唱が「ああ」と和音を伸ばし、B はロ短調から巡ってカリンバが8分に動く
 * 休憩の C はピアノを抜き、笛がひとりで歌う。最後は A7sus4 で頭の D へ戻る。ドラムは入れない
 */
(function () {
    // A の主題（8小節）。A で止めて、次へ
    const THEME = `F#5:6 A5:2 D6:8 | B5:8 A5:4 G5:4 | F#5:8 B5:4 D6:4 | C#6:8 A5:4 E5:4 |
                   D6:6 C#6:2 A5:8 | B5:8 D6:8 | G5:6 F#5:2 E5:8 | A5:12 r:4`;
    const CHORDS_A = 'D | Gadd9 | Bm | A | D | Gadd9 | Em | A';

    // 鳥の声：高い笛で、短くさえずる（16分で動くのはこれだけ）
    const BIRDS = `r:12 F#6:1 D6:1 F#6:2 | r:16 | r:16 | r:10 E6:1 C#6:1 E6:4 |
                   r:16 | r:12 D6:1 B5:1 D6:2 | r:16 | r:16`;

    // B：ロ短調から巡り、A で休憩へ
    const CHORDS_B = 'Bm | G | D | A | Bm | G | Em | A';
    const SONG_B = `D6:8 B5:8 | B5:6 A5:2 G5:8 | A5:8 F#5:8 | E5:12 r:4 |
                    F#5:4 B5:4 D6:8 | D6:6 B5:2 G5:8 | B5:8 G5:4 E5:4 | C#6:8 A5:4 E5:4`;

    // 休憩：笛がひとりで歌う。A7sus4 で頭の D へ戻る
    const CHORDS_C = 'G | D | Em | Bm | G | D | Em | A7sus4';
    const FLUTE_C = `B5:8 D6:8 | A5:16 | G5:8 B5:8 | F#5:16 |
                     D6:8 B5:8 | A5:8 F#5:8 | G5:8 E5:8 | D5:8 E5:8`;

    // カリンバは4分で（B は8分で）。ベースは小節に1つ
    const KALIMBA = '0:4 1 2 1';
    const KALIMBA_B = '0:2 1 2 3 2 1 2 1';
    const BASS = 'R:16';

    // 森の祈り：パッドと合唱、カリンバ、鳥の声の笛
    const forestprayer = {
        title: '森の奥の祈り',
        tags: ['落ち着いた', '神秘的'],
        genre: 'アンビエント',
        melody: ['lead'],
        bpm: 66,
        gain: 0.105,
        reverb: { seconds: 3.5, tone: 0.45 },
        delay: { time: 0.75, feedback: 0.32, tone: 2000, reverb: 0.35 },
        humanize: { time: 0.01, velocity: 0.1 },
        parts: {
            lead: { instrument: 'piano', volume: 0.63, pan: -0.08, decay: 0.9, brightness: 0.75, reverb: 0.35, delay: 0.15 },
            // 休憩の C で歌う笛
            flute: { instrument: 'flute', volume: 0.45, pan: 0.15, breath: 0.06, vibrato: 10, reverb: 0.4, delay: 0.2 },
            // 鳥の声のつもり：息の音のない、澄んだ高い笛
            birds: { instrument: 'flute', volume: 0.35, pan: 0.45, breath: 0, vibrato: 20, release: 0.05, reverb: 0.45, delay: 0.3 },
            kalimba: { instrument: 'kalimba', mode: 'arp', from: 'D4', volume: 0.3, pan: -0.3, reverb: 0.35, delay: 0.2 },
            pad: { instrument: 'pad', mode: 'chords', center: 'C4', voices: 3, volume: 0.36, cutoff: 900, attack: 1.2, release: 1.8, reverb: 0.5 },
            choir: { instrument: 'choir', mode: 'chords', center: 'D4', voices: 3, volume: 0.38, pan: 0.1, attack: 0.8, release: 1.2, reverb: 0.55 },
            // 柔らかい三角波のベース
            bass: { instrument: 'synthBass', mode: 'bass', octave: 2, wave: 'triangle', cutoff: 260, envelope: 0.4, decay: 0.8, sustain: 0.6, release: 0.5, volume: 0.41, gate: 0.95 }
        },
        sections: {
            // イントロ：パッドとカリンバから、鳥が鳴く。A で主題へ
            intro: {
                label: 'イントロ',
                chords: 'D | Gadd9 | Em | A',
                pad: 'hold',
                kalimba: KALIMBA,
                birds: 'r:16 | r:12 F#6:1 D6:1 F#6:2 | r:16 | r:10 E6:1 C#6:1 E6:4',
                bass: { pattern: 'r:16 | r:16 | R:16 | R:16' }
            },
            A: {
                chords: CHORDS_A,
                lead: THEME,
                pad: 'hold',
                kalimba: KALIMBA,
                birds: BIRDS,
                bass: BASS
            },
            // A'：合唱が和音を伸ばす
            A2: {
                label: "A'",
                chords: CHORDS_A,
                lead: THEME,
                pad: 'hold',
                choir: 'hold',
                kalimba: KALIMBA,
                birds: BIRDS,
                bass: BASS
            },
            // B：ロ短調から巡り、カリンバが8分に動く。鳥は休む
            B: {
                chords: CHORDS_B,
                lead: SONG_B,
                pad: 'hold',
                choir: 'hold',
                kalimba: KALIMBA_B,
                bass: 'R:8 5:8'
            },
            // 休憩：ピアノと合唱を抜き、笛がひとりで歌う。鳥がまた鳴き、A7sus4 で頭の D へ戻る
            C: {
                chords: CHORDS_C,
                flute: FLUTE_C,
                pad: 'hold',
                kalimba: KALIMBA,
                birds: BIRDS,
                bass: BASS
            }
        },
        intro: ['intro'],
        loop: ['A', 'A2', 'B', 'C']
    };

    SoundKit.register('catalog', { songs: { forestprayer } });
})();
