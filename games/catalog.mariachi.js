/**
 * 曲の一覧：太陽の広場（マリアッチ・ト長調の3拍子で、陽気に）
 * 3拍子なので、1小節は12ステップ。ギタロン（低いはじく弦）が1拍目、ビウエラ（明るいギター）が2拍目と3拍目を刻む
 * トランペット（ブラス）は3度の重音で吹く。A' は主題が伸ばす所に答え、B はバイオリン（弦楽器）を敷く。休憩の C はバイオリンが歌う
 */
(function () {
    const { repeat } = SoundKit;

    // A の主題（16小節）
    const THEME = `D5:4 G5:4 B5:4 | D6:8 B5:4 | C6:4 B5:4 A5:4 | F#5:12 |
                   A5:4 F#5:4 A5:4 | C6:8 A5:4 | B5:4 A5:4 G5:4 | D5:12 |
                   D5:4 G5:4 B5:4 | D6:8 F5:4 | E5:4 G5:4 C6:4 | C6:8 G5:4 |
                   B5:4 G5:4 D5:4 | C6:4 A5:4 F#5:4 | G5:12 | A5:4 F#5:4 D5:4`;
    const CHORDS_A = `G | G | D7 | D7 | D7 | D7 | G | G |
                      G | G7 | C | C | G/D | D7 | G | D7`;

    // A' のトランペット：主題が伸ばしている小節（4・8・12・16小節目）の2拍目から、3度で答える
    const TRUMPETS_A = `r:12 | r:12 | r:12 | r:4 [A4,C5]:4 [F#4,A4]:4 |
                        r:12 | r:12 | r:12 | r:4 [G4,B4]:4 [B4,D5]:4 |
                        r:12 | r:12 | r:12 | r:4 [G4,C5]:4 [E4,G4]:4 |
                        r:12 | r:12 | r:12 | r:4 [F#4,A4]:4 [A4,C5]:4`;

    // ビウエラ：2拍目と3拍目。ギタロン：1拍目に根音と5度を交互に
    const VIHUELA = '....x-..x-..';
    const GUITARRON = 'R:4 r:8 | 5:4 r:8';

    // マリアッチ：トランペットとバイオリンとギター
    const mariachi = {
        title: '太陽の広場',
        tags: ['明るい', '軽快'],
        genre: 'ラテン',
        melody: ['lead'],
        bpm: 168,
        stepsPerBar: 12,
        gain: 0.107,
        reverb: { seconds: 1.6, tone: 0.5 },
        delay: { time: 0.75, feedback: 0.15, tone: 2400 },
        humanize: { time: 0.005, velocity: 0.1 },
        parts: {
            lead: { instrument: 'piano', volume: 0.52, pan: -0.08, decay: 0.7, brightness: 0.85, reverb: 0.18, delay: 0.06 },
            trumpets: { instrument: 'brass', volume: 0.64, pan: -0.25, brightness: 4.5, release: 0.08, vibrato: 10, reverb: 0.25 },
            violin: { instrument: 'strings', volume: 0.95, pan: 0.3, attack: 0.06, release: 0.3, brightness: 1, vibrato: 14, reverb: 0.3 },
            violins: { instrument: 'strings', mode: 'chords', center: 'D4', voices: 3, volume: 0.44, pan: 0.25, attack: 0.25, release: 0.4, brightness: 0.8, vibrato: 12, reverb: 0.35 },
            vihuela: { instrument: 'guitar', mode: 'chords', center: 'G4', voices: 3, strum: 0.008, brightness: 0.9, gate: 0.4, volume: 0.69, pan: 0.2, reverb: 0.15 },
            guitarron: { instrument: 'pluck', mode: 'bass', octave: 2, brightness: 0.35, sustain: 0.994, release: 0.08, volume: 0.9, gate: 0.6 }
        },
        sections: {
            // イントロ：トランペットのファンファーレ（3度の重音）から、D7 で主題へ
            intro: {
                label: 'イントロ',
                chords: 'G | C | D7 | D7',
                trumpets: '[B4,D5]:2 [B4,D5]:2 [D5,G5]:4 [B4,D5]:4 | [C5,E5]:4 [E5,G5]:4 [C5,E5]:4 | [C5,F#5]:4 [A4,C5]:4 [F#4,A4]:4 | [A4,D5]:12',
                vihuela: VIHUELA,
                guitarron: GUITARRON
            },
            A: {
                chords: CHORDS_A,
                lead: THEME,
                vihuela: VIHUELA,
                guitarron: GUITARRON
            },
            // A'：トランペットが答える
            A2: {
                label: "A'",
                chords: CHORDS_A,
                lead: THEME,
                trumpets: TRUMPETS_A,
                vihuela: VIHUELA,
                guitarron: GUITARRON
            },
            // B：C から上がり、ホ短調を通って D7 で休憩へ。バイオリンを敷く
            B: {
                chords: `C | C | G | G | D7 | D7 | G | G |
                         Em | Em | Am | Am | D7 | D7 | G | D7`,
                lead: `E5:4 G5:4 C6:4 | G5:8 E5:4 | D5:4 G5:4 B5:4 | D6:12 |
                       C6:4 A5:4 F#5:4 | A5:8 C6:4 | B5:8 G5:4 | D5:12 |
                       E5:4 G5:4 B5:4 | B5:8 G5:4 | C6:4 A5:4 E5:4 | A5:12 |
                       F#5:4 A5:4 C6:4 | D6:8 C6:4 | B5:8 G5:4 | A5:12`,
                violins: 'hold',
                vihuela: VIHUELA,
                guitarron: GUITARRON
            },
            // 休憩：ピアノを抜き、バイオリンが歌う。D7 で頭の G へ戻る
            C: {
                chords: 'G | Em | C | D7 | G | Em | Am7 | D7',
                violin: 'B5:8 G5:4 | G5:8 E5:4 | E5:4 G5:4 C6:4 | A5:12 | D6:8 B5:4 | B5:4 G5:4 E5:4 | C6:8 A5:4 | F#5:4 A5:4 C6:4',
                vihuela: VIHUELA,
                guitarron: 'R:4 r:8'
            },
            // 最後の A'：トランペットとバイオリンを重ねて、D7 で頭の G へ戻る
            A3: {
                label: "A'",
                chords: CHORDS_A,
                lead: THEME,
                trumpets: TRUMPETS_A,
                violins: 'hold',
                vihuela: VIHUELA,
                guitarron: GUITARRON
            }
        },
        intro: ['intro'],
        loop: ['A', 'A2', 'B', 'C', 'A3']
    };

    SoundKit.register('catalog', { songs: { mariachi } });
})();
