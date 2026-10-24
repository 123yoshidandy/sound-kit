/**
 * 曲の一覧：庭園のメヌエット（バロック風のメヌエット。チェンバロ風の伴奏と、動く低音）
 * 3拍子なので、1小節は12ステップ（16分音符12個）
 * 弦楽器で和音を伸ばし（B と最後の A）、トリオ（C）ではチェロのような低い弦が長い音で答える
 */
(function () {
    // A の主題（前半8小節は半終止で D に止まる）
    const PHRASE_1 = `G5:4 B5:2 A5:2 G5:2 D5:2 | E5:4 C6:4 B5:2 A5:2 | B5:4 D6:2 C6:2 B5:2 A5:2 | A5:8 F#5:4 |
                      G5:4 B5:2 A5:2 G5:2 E5:2 | E5:4 G5:2 F#5:2 E5:2 C5:2 | A5:4 C6:2 B5:2 A5:2 G5:2 | A5:4 F#5:4 D5:4`;
    // A' の前半：同じ旋律に、短い飾りの音を足す
    const PHRASE_1_ORNAMENT = `G5:4 B5:2 A5:1 B5:1 G5:2 D5:2 | E5:4 C6:4 B5:1 C6:1 A5:2 | B5:4 D6:2 C6:2 B5:2 A5:2 | A5:6 B5:1 A5:1 F#5:4 |
                               G5:4 B5:2 A5:2 G5:2 E5:2 | E5:4 G5:2 F#5:1 G5:1 E5:2 C5:2 | A5:4 C6:2 B5:2 A5:2 G5:2 | A5:4 F#5:4 D5:4`;
    const PHRASE_2 = `D6:4 B5:2 C6:2 D6:2 G5:2 | C6:4 E5:2 F#5:2 G5:2 E5:2 | B5:4 D6:2 C6:2 B5:2 G5:2 | C6:4 A5:2 B5:2 C6:2 E5:2`;
    // A の終わり：D7 で止めて、頭の G へ戻る
    const END_HALF = `D6:4 B5:4 G5:2 A5:2 | F#5:4 A5:2 C6:2 B5:2 A5:2 | G5:8 B5:2 G5:2 | D5:4 F#5:4 A5:2 F#5:2`;
    // A' の終わり：G で落ち着いてから、B の D へ上がる
    const END_FULL = `D6:4 B5:4 G5:2 A5:2 | F#5:4 A5:2 C6:2 B5:2 A5:2 | G5:8 D5:4 | G5:8 r:2 E5:2`;

    const A_CHORDS = 'G | C | G/B | D | Em | C | Am | D | G | C | G/B | Am | G/D | D7 | G | D7';
    const A2_CHORDS = 'G | C | G/B | D | Em | C | Am | D | G | C | G/B | Am | G/D | D7 | G | G';

    // 対位法的な低音：4分音符で、旋律と反対の向きに動く
    const BASS_HEAD = `G3:8 B2:4 | C3:8 E3:4 | B2:8 G2:4 | D3:4 E3:4 F#3:4 |
                       G3:8 E3:4 | C3:4 D3:4 E3:4 | A2:8 C3:4 | D3:8 D2:4 |
                       G2:4 B2:4 D3:4 | E3:8 C3:4 | B2:8 D3:4 | C3:8 A2:4 |
                       D3:8 B2:4 | D3:4 A2:4 F#2:4`;
    const BASS_A = `${BASS_HEAD} | G2:8 B2:4 | D3:4 E3:4 F#3:4`;
    const BASS_A2 = `${BASS_HEAD} | G2:8 B2:4 | G3:4 F#3:4 E3:4`;

    // フルートの対旋律（最後の A で足す）。主旋律より下で、長めの音で支える
    const COUNTER = `B4:8 D5:4 | E5:8 G5:4 | D5:12 | D5:12 | E5:8 G5:4 | C5:12 | E5:8 C5:4 | D5:8 C5:4 |
                     B4:8 D5:4 | C5:8 E5:4 | D5:12 | E5:8 C5:4 | B4:8 D5:4 | C5:8 A4:4 | B4:12 | C5:8 A4:4`;

    // トリオ（C）のチェロ：和音の音を、1小節ずつ伸ばす
    const CELLO = `G4:12 | E4:12 | F#4:12 | D4:12 | E4:12 | C4:12 | D#4:12 | E4:12 |
                   B3:12 | E4:12 | C4:12 | F#4:12 | D4:12 | E4:12 | C4:12 | C4:12`;

    const minuet = {
        title: '庭園のメヌエット',
        tags: ['落ち着いた'],
        genre: 'クラシック',
        melody: ['lead'],   // 主旋律のパート（試聴ページで楽器を替えられる）
        bpm: 126,
        stepsPerBar: 12,
        gain: 0.051,
        reverb: { seconds: 2.2, tone: 0.5 },
        delay: { time: 0.75, feedback: 0.2, tone: 2400, reverb: 0.3 },
        humanize: { time: 0.005, velocity: 0.07 },
        parts: {
            lead: { instrument: 'piano', volume: 0.85, pan: -0.1, brightness: 0.8, release: 0.2, reverb: 0.25, delay: 0.06 },
            counter: { instrument: 'flute', volume: 0.6, pan: 0.32, breath: 0.03, vibrato: 8, reverb: 0.35 },
            // チェンバロ風：明るくはじく弦で、和音を拍に置く
            hpsi: { instrument: 'pluck', mode: 'chords', center: 'G4', voices: 3, brightness: 0.6, sustain: 0.993, volume: 1.7, pan: 0.2, reverb: 0.25 },
            // チェンバロ風の分散和音
            harp: { instrument: 'pluck', mode: 'arp', from: 'D4', brightness: 0.65, sustain: 0.994, volume: 1.2, pan: 0.25, reverb: 0.25 },
            cello: { instrument: 'strings', volume: 1.4, pan: 0.3, attack: 0.2, release: 0.5, brightness: 0.6, vibrato: 7, reverb: 0.4 },
            strings: { instrument: 'strings', mode: 'chords', center: 'D4', voices: 3, volume: 0.6, pan: -0.2, attack: 0.3, release: 0.5, brightness: 0.75, reverb: 0.4 },
            bass: { instrument: 'pluck', mode: 'bass', brightness: 0.55, sustain: 0.996, release: 0.12, volume: 1.1, pan: -0.05, gate: 0.95, reverb: 0.15 }
        },
        sections: {
            intro: {
                label: 'イントロ',
                chords: 'G | Em | Am | D7',
                harp: '0:2 1 2 1 2 1',
                bass: 'G2:12 | E3:12 | A2:12 | D3:4 E3:4 F#3:4'
            },
            A: {
                chords: A_CHORDS,
                lead: `${PHRASE_1} | ${PHRASE_2} | ${END_HALF}`,
                hpsi: 'x-------o---',
                bass: BASS_A
            },
            // A'：旋律に飾りを足し、伴奏を8分音符の分散和音にする
            A2: {
                label: "A'",
                chords: A2_CHORDS,
                lead: `${PHRASE_1_ORNAMENT} | ${PHRASE_2} | ${END_FULL}`,
                harp: '0:2 1 2 1 2 1',
                bass: BASS_A2
            },
            // B：属調（D）へ移り、ホ短調を通って D7 で止まる
            B: {
                chords: 'D | A7 | D | Bm | G | D/A | A7 | D | Em | B7 | Em | C | G/B | Am | D | D7',
                lead: `F#5:4 A5:4 D6:4 | C#6:4 B5:2 A5:2 G5:2 E5:2 | F#5:4 D6:2 C#6:2 D6:2 A5:2 | B5:8 F#5:4 |
                       G5:4 B5:2 D6:2 B5:2 G5:2 | A5:4 D6:4 F#5:4 | E5:4 G5:2 F#5:2 E5:2 C#5:2 | D5:6 r:2 E5:2 F#5:2 |
                       G5:4 E5:4 B5:4 | A5:8 F#5:2 D#5:2 | B5:4 G5:2 E5:2 G5:2 B5:2 | C6:8 B5:2 A5:2 |
                       B5:4 D6:2 C6:2 B5:2 G5:2 | A5:4 C6:2 B5:2 A5:2 E5:2 | F#5:4 A5:4 D6:4 | C6:4 A5:4 F#5:2 A5:2`,
                hpsi: 'x---o---o---',
                strings: 'hold',
                bass: `D3:8 F#3:4 | A2:8 C#3:4 | D3:4 E3:4 F#3:4 | B2:4 C#3:4 D3:4 |
                       G2:4 A2:4 B2:4 | A2:8 D3:4 | A2:4 C#3:4 E3:4 | D3:8 D2:4 |
                       E2:4 E3:4 D3:4 | B2:8 F#2:4 | E2:4 G2:4 B2:4 | C3:8 A2:4 |
                       B2:8 G2:4 | A2:4 C3:4 E3:4 | D3:4 F#3:4 A3:4 | D3:4 C3:4 B2:4`
            },
            // C：休憩（トリオ。ホ短調）。旋律は長い音だけにし、分散和音は4分音符に。低音も伸ばす
            C: {
                label: 'C',   // トリオ
                chords: 'Em | Am | D | G | C | Am | B7 | Em | Em | C | Am | D | G | C | Am7 | D7',
                lead: `B5:8@0.85 G5:4@0.75 | C6:8@0.85 A5:4@0.75 | A5:8@0.85 F#5:4@0.75 | G5:12@0.85 |
                       E5:8@0.85 G5:4@0.75 | C6:8@0.85 A5:4@0.75 | B5:8@0.85 D#5:4@0.75 | E5:12@0.85 |
                       G5:8@0.85 B5:4@0.75 | C6:8@0.85 G5:4@0.75 | A5:8@0.85 C6:4@0.75 | D6:8@0.85 A5:4@0.75 |
                       B5:8@0.85 G5:4@0.75 | G5:8@0.85 E5:4@0.75 | A5:8@0.85 C6:4@0.75 | A5:4@0.85 F#5:2@0.75 E5:2@0.7 D5:4@0.75`,
                harp: { pattern: '0:4 1 2', from: 'B3' },
                cello: CELLO,
                hpsi: 'o-----------',
                bass: `E3:12 | A2:12 | D3:12 | G2:12 | C3:12 | A2:12 | B2:12 | E2:12 |
                       E3:8 B2:4 | C3:12 | A2:12 | D3:12 | G2:12 | C3:12 | A2:12 | D3:8 F#3:4`
            },
            // 最後の A：フルートの対旋律を足す
            A3: {
                label: 'A',
                chords: A_CHORDS,
                lead: `${PHRASE_1} | ${PHRASE_2} | ${END_HALF}`,
                counter: COUNTER,
                hpsi: 'x-------o---',
                strings: 'hold',
                bass: BASS_A
            }
        },
        intro: ['intro'],
        loop: ['A', 'A2', 'B', 'C', 'A3']
    };

    SoundKit.register('catalog', { songs: { minuet } });
})();
