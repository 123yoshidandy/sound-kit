/**
 * 曲の一覧：古城の小フーガ（バロックのフーガ・ニ短調で、張りつめて）
 * 2小節の主題を、ピアノ・オルガン（イ短調の応答）・チェロの順に、声部を替えて入れていく。ドラムは使わない
 * A' はチェロが低い保続音で支えてから入り、B はヘ長調・変ロ長調・ト短調へと主題を移して巡る
 * 休憩の C はピアノを抜き、ヴァイオリンが主題を倍の長さに伸ばして歌う。最後の A は弦が応答と主題に重なり、A7 で頭へ戻る
 */
(function () {
    // 主題（ニ短調）：Dm → A7。2小節目は8分で駆け下りて、また上がる
    const SUBJECT = 'D5:4 A5:4 F5:2 E5:2 D5:2 F5:2 | E5:2 C#5:2 A4:2 C#5:2 E5:2 F5:2 G5:2 E5:2';
    // 応答（イ短調）：Am → E7
    const ANSWER = 'A4:4 E5:4 C5:2 B4:2 A4:2 C5:2 | B4:2 G#4:2 E4:2 G#4:2 B4:2 C5:2 D5:2 B4:2';
    // チェロの主題：2オクターブ下
    const SUBJECT_LOW = 'D3:4 A3:4 F3:2 E3:2 D3:2 F3:2 | E3:2 C#3:2 A2:2 C#3:2 E3:2 F3:2 G3:2 E3:2';

    // 提示部：ピアノの主題 → オルガンの応答 → チェロの主題 → 終止
    const CHORDS_A = 'Dm | A7 | Am | E7 | Dm | A7 | Gm:8 A7:8 | Dm:8 A7:8';
    const LEAD_HEAD = `${SUBJECT} |
                       E5:2 A5:2 C6:4 B5:2 A5:2 G#5:2 A5:2 | B5:4 E5:4 D6:2 C6:2 B5:4 |
                       F5:2 A5:2 D6:4 C6:2 Bb5:2 A5:2 G5:2 | A5:4 E5:4 G5:2 F5:2 E5:4 |
                       Bb5:4 G5:4 E5:4 C#6:4`;
    const LEAD_A = `${LEAD_HEAD} | D6:4 A5:4 E5:2 F5:2 G5:2 E5:2`;
    const ALTO_HEAD = `r:16 | r:16 | ${ANSWER} |
                       A4:4 F4:4 D5:4 A4:4 | C#5:4 B4:2 A4:2 G4:4 E4:4 |
                       D5:4 Bb4:4 C#5:4 A4:4`;
    const ALTO_A = `${ALTO_HEAD} | A4:4 F4:4 E4:4 C#4:4`;
    const CELLO_TAIL = `${SUBJECT_LOW} | G2:4 Bb2:4 A2:4 G2:4`;
    const CELLO_A = `r:16 | r:16 | r:16 | r:16 | ${CELLO_TAIL} | D3:4 F3:4 A2:8`;
    // A' と最後の A：チェロが保続音で支えてから、主題に入る
    const CELLO_PEDAL = `D3:16 | A2:16 | A2:16 | E2:16 | ${CELLO_TAIL} | D3:4 F3:4 A2:8`;

    // A'：C7 で終えて、ヘ長調の B へ
    const CHORDS_A2 = 'Dm | A7 | Am | E7 | Dm | A7 | Gm:8 A7:8 | Dm:8 C7:8';
    const LEAD_A2 = `${LEAD_HEAD} | D6:4 A5:4 G5:2 E5:2 C5:2 E5:2`;
    const ALTO_A2 = `${ALTO_HEAD} | A4:4 F4:4 E4:4 G4:4`;
    const CELLO_A2 = `D3:16 | A2:16 | A2:16 | E2:16 | ${CELLO_TAIL} | D3:4 F3:4 C3:8`;

    // B：ヘ長調（ピアノ）→ 変ロ長調（オルガン）→ ト短調（ピアノ）と主題を移し、A7 で休憩へ
    const CHORDS_B = 'F | C7 | Bb | F7 | Gm | D7 | Gm:8 Dm:8 | A7';
    const LEAD_B = `F5:4 C6:4 A5:2 G5:2 F5:2 A5:2 | G5:2 E5:2 C5:2 E5:2 G5:2 A5:2 Bb5:2 G5:2 |
                    D6:4 Bb5:4 F5:4 Bb5:4 | C6:2 Bb5:2 A5:2 G5:2 F5:4 A5:4 |
                    G5:4 D6:4 Bb5:2 A5:2 G5:2 Bb5:2 | A5:2 F#5:2 D5:2 F#5:2 A5:2 Bb5:2 C6:2 A5:2 |
                    Bb5:4 G5:4 F5:4 D5:4 | C#5:4 E5:4 G5:4 E5:4`;
    const ALTO_B = `A4:4 F4:4 C5:4 A4:4 | Bb4:4 G4:4 E4:4 G4:4 |
                    Bb4:4 F5:4 D5:2 C5:2 Bb4:2 D5:2 | C5:2 A4:2 F4:2 A4:2 C5:2 D5:2 Eb5:2 C5:2 |
                    D5:4 Bb4:4 G4:4 D5:4 | C5:4 A4:4 F#4:4 A4:4 |
                    D5:4 Bb4:4 A4:4 F4:4 | A4:8 G4:8`;
    const CELLO_B = 'F2:8 A2:8 | C3:8 Bb2:8 | Bb2:8 D3:8 | F2:8 Eb3:8 | G2:8 Bb2:8 | D3:8 C3:8 | G2:8 D3:8 | A2:16';

    // 休憩：ヴァイオリンが主題を倍の長さで歌い、オルガンとチェロは長く伸ばす。A7 で最後の A へ
    const CHORDS_C = 'Dm | Dm | A7 | A7 | Gm | Dm | Bb:8 Gm:8 | A7';
    const VIOLIN_C = `D5:8 A5:8 | F5:4 E5:4 D5:4 F5:4 | E5:4 C#5:4 A4:4 C#5:4 | E5:4 G5:4 A5:4 G5:4 |
                      D6:8 Bb5:8 | A5:8 F5:8 | F5:4 D5:4 G5:4 Bb5:4 | A5:8 E5:8`;
    const ALTO_C = 'F4:16 | A4:16 | G4:16 | E4:8 C#4:8 | G4:16 | F4:8 A4:8 | D4:16 | C#4:8 E4:8';
    const CELLO_C = 'D3:16 | D3:8 F3:8 | A2:16 | A2:16 | G2:16 | D3:16 | Bb2:8 G2:8 | A2:16';

    // 最後の A：弦が、応答に同じ高さで、チェロの主題に1オクターブ上で重なる
    const DOUBLE_A3 = `r:16 | r:16 | ${ANSWER} |
                       D4:4 A4:4 F4:2 E4:2 D4:2 F4:2 | E4:2 C#4:2 A3:2 C#4:2 E4:2 F4:2 G4:2 E4:2 | r:16 | r:16`;

    // バロックのフーガ：ピアノ・オルガン・チェロの3声
    const fugue = {
        title: '古城の小フーガ',
        tags: ['緊張感', '落ち着いた'],
        genre: 'クラシック',
        melody: ['lead'],
        bpm: 96,
        gain: 0.092,
        reverb: { seconds: 2.6, tone: 0.45 },
        delay: { time: 0.75, feedback: 0.15, tone: 2000, reverb: 0.2 },
        humanize: { time: 0.005, velocity: 0.08 },
        parts: {
            lead: { instrument: 'piano', volume: 0.53, pan: -0.1, decay: 0.8, brightness: 0.8, reverb: 0.22, delay: 0.05 },
            // 中の声部：揺れのないオルガン
            alto: { instrument: 'organ', volume: 0.75, pan: 0.2, vibrato: 0, cutoff: 2400, reverb: 0.3 },
            cello: { instrument: 'strings', volume: 0.95, pan: -0.3, attack: 0.08, release: 0.3, brightness: 0.6, vibrato: 5, reverb: 0.3 },
            // 休憩の C で歌うヴァイオリン
            violin: { instrument: 'strings', volume: 1.13, pan: 0.15, attack: 0.15, release: 0.45, brightness: 0.8, vibrato: 9, reverb: 0.35 },
            // 最後の A で、応答と主題に重なる弦
            double: { instrument: 'strings', volume: 0.55, pan: 0.3, attack: 0.08, release: 0.3, brightness: 0.7, vibrato: 6, reverb: 0.3 }
        },
        sections: {
            // イントロ：チェロが主題を予告し、オルガンが伸ばす。A7 で提示部へ
            intro: {
                label: 'イントロ',
                chords: 'Dm | A7 | Gm:8 A7:8 | A7',
                cello: `${SUBJECT_LOW} | G2:4 Bb2:4 A2:4 G2:4 | A2:16`,
                alto: 'D4:16 | C#4:16 | D4:8 C#4:8 | E4:8 C#4:8'
            },
            A: {
                chords: CHORDS_A,
                lead: LEAD_A,
                alto: ALTO_A,
                cello: CELLO_A
            },
            // A'：チェロが保続音で支える。C7 でヘ長調へ
            A2: {
                label: "A'",
                chords: CHORDS_A2,
                lead: LEAD_A2,
                alto: ALTO_A2,
                cello: CELLO_A2
            },
            // B：主題を移して巡る。A7 で休憩へ
            B: {
                chords: CHORDS_B,
                lead: LEAD_B,
                alto: ALTO_B,
                cello: CELLO_B
            },
            // 休憩：ピアノを抜き、ヴァイオリンが主題を伸ばして歌う
            C: {
                chords: CHORDS_C,
                violin: VIOLIN_C,
                alto: ALTO_C,
                cello: CELLO_C
            },
            // 最後の A：弦が重なる。A7 で頭の Dm へ戻る
            A3: {
                label: 'A',
                chords: CHORDS_A,
                lead: LEAD_A,
                alto: ALTO_A,
                cello: CELLO_PEDAL,
                double: DOUBLE_A3
            }
        },
        intro: ['intro'],
        loop: ['A', 'A2', 'B', 'C', 'A3']
    };

    SoundKit.register('catalog', { songs: { fugue } });
})();
