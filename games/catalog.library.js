/**
 * 曲の一覧：図書館の昼下がり（弦楽四重奏とピアノ・ヘ長調で、静かに）
 * チェロ・ヴィオラ・第2ヴァイオリンが、和音を1小節ずつ長く伸ばし、ピアノの主旋律を下から支える
 * A' は第1ヴァイオリンが、主題の伸ばしに短く答える。B はニ短調から巡り、第1ヴァイオリンが中ほどで長く伸ばして4声になる
 * 休憩の C はピアノを抜き、第1ヴァイオリンがひとりで歌う。下の3声は和音を静かに支える
 */
(function () {
    // A の主題。C7 から頭の F へ
    const THEME = `C5:4 F5:4 A5:6 G5:2 | G5:8 E5:4 C5:4 | D5:4 F5:4 A5:4 D6:4 | C6:6 B5:2 A5:8 |
                   Bb5:4 A5:2 Bb5:2 D6:8 | C6:6 A5:2 F5:8 | G5:4 Bb5:4 C6:4 E5:4 | F5:12 r:4`;
    const CHORDS_A = 'F | C/E | Dm | Am | Bb | F/A | Gm:8 C7:8 | F';
    // A の下の3声：1小節ずつ伸ばす
    const CELLO_A = 'F2:16 | E2:16 | D2:16 | A2:16 | Bb2:16 | A2:16 | G2:8 C3:8 | F2:16';
    const VIOLA_A = 'A3:16 | G3:16 | A3:16 | C4:16 | D4:16 | C4:16 | D4:8 E4:8 | C4:16';
    const VIOLIN2_A = 'F4:16 | C4:16 | F4:16 | E4:16 | F4:16 | F4:16 | G4:8 Bb4:8 | A4:16';
    // A' の第1ヴァイオリン：主題が伸ばしている所に答える
    const VIOLIN1_A = 'r:16 | r:16 | r:16 | r:8 E5:4 C5:4 | r:16 | r:8 A4:4 C5:4 | r:16 | r:4 A4:4 C5:4 F5:4';

    // B：ニ短調から巡り、C7 で休憩へ。第1ヴァイオリンが中ほどで伸ばし、4声になる
    const CHORDS_B = 'Dm | Am | Bb | F | Gm | Dm | Bb:8 C:8 | C7';
    const SONG_B = `A5:6 F5:2 D5:8 | E5:6 A5:2 C6:8 | D6:6 C6:2 Bb5:8 | A5:4 F5:4 C5:8 |
                    Bb5:6 A5:2 G5:8 | F5:4 A5:4 D6:8 | D6:4 Bb5:4 C6:4 G5:4 | E5:4 G5:4 Bb5:4 G5:4`;
    const CELLO_B = 'D2:16 | A2:16 | Bb2:16 | F2:16 | G2:16 | D2:16 | Bb2:8 C3:8 | C2:16';
    const VIOLA_B = 'A3:16 | A3:16 | Bb3:16 | A3:16 | Bb3:16 | A3:16 | Bb3:8 C4:8 | C4:16';
    const VIOLIN2_B = 'F4:16 | E4:16 | D4:16 | F4:16 | D4:16 | F4:16 | F4:8 E4:8 | E4:8 G4:8';
    const VIOLIN1_B = 'D5:16 | C5:16 | D5:16 | C5:16 | D5:16 | D5:16 | D5:8 E5:8 | E5:16';

    // 休憩：第1ヴァイオリンがひとりで歌う。C7 で頭の F へ戻る
    const CHORDS_C = 'F | Dm | Bb | C | F | Dm | Gm | C7';
    const SOLO_C = `A5:8 C6:8 | D6:8 A5:8 | Bb5:8 F5:8 | G5:12 E5:4 |
                    F5:8 A5:8 | D6:6 C6:2 A5:8 | Bb5:8 G5:8 | E5:8 G5:4 Bb5:4`;
    const CELLO_C = 'F2:16 | D2:16 | Bb2:16 | C3:16 | F2:16 | D2:16 | G2:16 | C3:16';
    const VIOLA_C = 'A3:16 | A3:16 | Bb3:16 | G3:16 | A3:16 | A3:16 | Bb3:16 | Bb3:16';
    const VIOLIN2_C = 'C4:16 | D4:16 | D4:16 | C4:16 | C4:16 | D4:16 | D4:16 | E4:16';

    // 弦楽四重奏とピアノ：図書館の静かな午後
    const library = {
        title: '図書館の昼下がり',
        tags: ['落ち着いた'],
        genre: 'クラシック',
        melody: ['lead'],
        bpm: 76,
        gain: 0.13,
        reverb: { seconds: 2.4, tone: 0.45 },
        delay: { time: 0.75, feedback: 0.2, tone: 2000, reverb: 0.2 },
        humanize: { time: 0.006, velocity: 0.08 },
        parts: {
            lead: { instrument: 'piano', volume: 0.5, pan: -0.1, decay: 0.9, brightness: 0.75, reverb: 0.25, delay: 0.06 },
            // 休憩の C で歌う第1ヴァイオリン
            solo: { instrument: 'strings', volume: 0.9, pan: 0.2, attack: 0.15, release: 0.45, brightness: 0.8, vibrato: 10, reverb: 0.35 },
            // 第1ヴァイオリン：答えと、B の中ほどの伸ばし
            violin1: { instrument: 'strings', volume: 0.63, pan: 0.3, attack: 0.18, release: 0.45, brightness: 0.75, vibrato: 9, reverb: 0.35 },
            violin2: { instrument: 'strings', volume: 0.6, pan: 0.15, attack: 0.3, release: 0.6, brightness: 0.65, vibrato: 7, reverb: 0.35 },
            viola: { instrument: 'strings', volume: 0.63, pan: -0.15, attack: 0.3, release: 0.6, brightness: 0.6, vibrato: 7, reverb: 0.35 },
            cello: { instrument: 'strings', volume: 0.75, pan: -0.3, attack: 0.25, release: 0.6, brightness: 0.6, vibrato: 6, reverb: 0.3 }
        },
        sections: {
            // イントロ：弦だけで。第1ヴァイオリンが呼び、C7 で主題へ
            intro: {
                label: 'イントロ',
                chords: 'F | Dm | Bb | C7',
                violin1: 'r:16 | r:16 | F5:8 D5:8 | E5:8 G5:8',
                violin2: 'C4:16 | D4:16 | D4:16 | E4:16',
                viola: 'A3:16 | A3:16 | Bb3:16 | Bb3:16',
                cello: 'F2:16 | D2:16 | Bb2:16 | C3:16'
            },
            A: {
                chords: CHORDS_A,
                lead: THEME,
                violin2: VIOLIN2_A,
                viola: VIOLA_A,
                cello: CELLO_A
            },
            // A'：第1ヴァイオリンが答える
            A2: {
                label: "A'",
                chords: CHORDS_A,
                lead: THEME,
                violin1: VIOLIN1_A,
                violin2: VIOLIN2_A,
                viola: VIOLA_A,
                cello: CELLO_A
            },
            // B：ニ短調から巡り、4声になる。C7 で休憩へ
            B: {
                chords: CHORDS_B,
                lead: SONG_B,
                violin1: VIOLIN1_B,
                violin2: VIOLIN2_B,
                viola: VIOLA_B,
                cello: CELLO_B
            },
            // 休憩：ピアノを抜き、第1ヴァイオリンがひとりで歌う。C7 で頭の F へ戻る
            C: {
                chords: CHORDS_C,
                solo: SOLO_C,
                violin2: VIOLIN2_C,
                viola: VIOLA_C,
                cello: CELLO_C
            }
        },
        intro: ['intro'],
        loop: ['A', 'A2', 'B', 'C']
    };

    SoundKit.register('catalog', { songs: { library } });
})();
