/**
 * 曲の一覧：朝焼けの湖（アンビエント・ニ長調で、ゆっくり、落ち着いて、少し神秘的に）
 * 弦が和音を長く伸ばし、低いベースが根音を支える。ドラムは置かない
 * 水面のきらめきのつもりで、高いベルが小節の後ろで3音ほど小さく下りる（16分で動くのはこれだけ）
 * ピアノの主題は音を少なく、間を置いて歌う。B からパッドを敷き、休憩の C はピアノを抜いてフルートがひとりで歌う
 * 最後の A' は合唱が加わる。どの区間も A で終わり、頭の D へ戻る
 */
(function () {
    // A の主題：音を少なく、間を置いて
    const THEME = `F#5:4 A5:4 D6:8 | C#6:6 B5:2 F#5:8 | B5:4 A5:4 D5:8 | C#5:4 E5:4 A5:8 |
                   A5:4 F#5:4 D6:8 | B5:6 A5:2 G5:8 | G5:4 B5:4 E5:8 | D5:8 C#5:8`;
    const CHORDS_A = 'D | Bm7 | Gadd9 | A | D/F# | Gadd9 | Em7 | Asus4:8 A:8';
    // 水面のきらめき：小節の後ろで、高いベルが3音ほど下りる
    const SPARKLE_A = `r:12 A6:1 F#6:1 D6:2 | r:16 | r:8 D6:1 A6:1 r:6 | r:16 |
                       r:12 F#6:1 A6:1 D6:2 | r:16 | r:4 B6:1 G6:1 E6:2 r:8 | r:16`;

    // B：Bm7 から巡り、A で次へ
    const CHORDS_B = 'Bm7 | Gadd9 | D | A | Bm7 | Gadd9 | Em7 | A';
    const SONG_B = `D6:8 B5:4 F#5:4 | A5:12 B5:4 | F#5:4 D5:4 A5:8 | C#6:8 A5:8 |
                    B5:4 D6:4 F#5:8 | G5:4 B5:4 D6:8 | B5:8 G5:4 D6:4 | C#6:12 E5:4`;
    const SPARKLE_B = `r:8 F#6:1 D6:1 B5:2 r:4 | r:16 | r:12 A6:1 F#6:1 D6:2 | r:16 |
                       r:8 B6:1 F#6:1 D6:2 r:4 | r:16 | r:12 G6:1 E6:1 B5:2 | r:8 E6:1 C#6:1 A5:2 r:4`;

    // 休憩：フルートがひとりで歌う。A で最後の A' へ
    const CHORDS_C = 'Gadd9 | Gadd9 | D/F# | D/F# | Em7 | Em7 | Asus4 | A';
    const SOLO_C = `B5:8 D6:8 | A5:16 | F#5:8 A5:8 | D6:16 |
                    B5:8 G5:8 | E5:16 | D5:8 E5:8 | C#5:16`;
    const SPARKLE_C = `r:8 D6:1 B5:1 G5:2 r:4 | r:16 | r:12 A6:1 F#6:1 D6:2 | r:16 |
                       r:8 G6:1 E6:1 B5:2 r:4 | r:16 | r:12 E6:1 D6:1 A5:2 | r:16`;

    // 朝焼けの湖：弦の伸ばしと、水面のきらめきのベル
    const dawnlake = {
        title: '朝焼けの湖',
        tags: ['落ち着いた', '神秘的'],
        genre: 'アンビエント',
        melody: ['lead'],
        bpm: 70,
        gain: 0.12,
        reverb: { seconds: 4, tone: 0.45 },
        delay: { time: 0.75, feedback: 0.35, tone: 2000, reverb: 0.4 },
        humanize: { time: 0.006, velocity: 0.08 },
        parts: {
            lead: { instrument: 'piano', volume: 0.6, pan: -0.08, decay: 1.2, brightness: 0.75, reverb: 0.45, delay: 0.2 },
            // 休憩の C で歌うフルート
            solo: { instrument: 'flute', volume: 0.45, pan: 0.15, reverb: 0.5, delay: 0.3 },
            // 水面のきらめきのつもりの、高いベル
            sparkle: { instrument: 'bell', volume: 0.22, decay: 1.5, index: 0.8, pan: 0.35, reverb: 0.55, delay: 0.4 },
            strings: { instrument: 'strings', mode: 'chords', center: 'D4', voices: 3, volume: 0.4, attack: 1, release: 1.5, brightness: 0.7, pan: 0.2, reverb: 0.5 },
            pad: { instrument: 'pad', mode: 'chords', center: 'A3', voices: 3, volume: 0.35, cutoff: 900, attack: 1.5, release: 2, pan: -0.2, reverb: 0.5 },
            choir: { instrument: 'choir', mode: 'chords', center: 'F#4', voices: 3, volume: 0.4, attack: 1, release: 1.5, pan: -0.1, reverb: 0.6 },
            bass: { instrument: 'synthBass', mode: 'bass', octave: 2, cutoff: 250, decay: 1.5, sustain: 0.8, release: 0.6, volume: 0.3 }
        },
        sections: {
            // イントロ：弦とベース、きらめきだけ。A で主題へ
            intro: {
                label: 'イントロ',
                chords: 'D | Gadd9 | Em7 | A',
                strings: 'hold',
                sparkle: 'r:12 A6:1 F#6:1 D6:2 | r:16 | r:4 B6:1 G6:1 E6:2 r:8 | r:8 E6:1 C#6:1 A5:2 r:4',
                bass: 'R:16'
            },
            A: {
                chords: CHORDS_A,
                lead: THEME,
                strings: 'hold',
                sparkle: SPARKLE_A,
                bass: 'R:16'
            },
            // B：Bm7 から巡り、パッドを敷く
            B: {
                chords: CHORDS_B,
                lead: SONG_B,
                strings: 'hold',
                pad: 'hold',
                sparkle: SPARKLE_B,
                bass: 'R:16'
            },
            // 休憩：ピアノを抜き、フルートが歌う
            C: {
                chords: CHORDS_C,
                solo: SOLO_C,
                strings: 'hold',
                pad: 'hold',
                sparkle: SPARKLE_C,
                bass: 'R:16'
            },
            // 最後の A'：合唱が加わる。A で頭の D へ戻る
            A2: {
                label: "A'",
                chords: CHORDS_A,
                lead: THEME,
                strings: 'hold',
                choir: 'hold',
                sparkle: SPARKLE_A,
                bass: 'R:16'
            }
        },
        intro: ['intro'],
        loop: ['A', 'B', 'C', 'A2']
    };

    SoundKit.register('catalog', { songs: { dawnlake } });
})();
