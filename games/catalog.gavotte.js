/**
 * 曲の一覧：宮廷のガヴォット（クラシック・ト長調の4拍子で、軽やかに、おしゃれに）
 * ガヴォットらしく、句は小節の後半（3拍目）から弱起で始まり、小節の前半で区切る。チェンバロのつもりのギターが明るく短く和音を弾く
 * 通奏低音のベースが4分で歩き、A' から弦が下で対旋律を歌う。A' はニ長調へ移って B のホ短調へ渡す
 * 休憩の C はピアノを抜き、弦がひとりで歌う。最後の A は G から D7 へ進み、弱起で頭の G へ戻る
 */
(function () {
    // A の主題（前半6小節は同じ）。偶数小節の後半が、次の句の弱起になる
    const THEME_HEAD = `G5:4 D5:4 B5:4 A5:2 B5:2 | A5:8 F#5:4 E5:4 | E5:4 G5:4 B5:4 E6:2 D6:2 | C6:4 E5:4 D5:4 F#5:2 A5:2 |
                        B5:4 G5:4 D6:4 B5:2 G5:2 | C6:4 G5:4 A5:4 C#6:4`;
    // 弱起：小節の後半で D から上がって、頭の G へ
    const UPBEAT = 'D5:4 E5:2 F#5:2';
    const THEME = `${THEME_HEAD} | D6:4 A5:4 C6:4 F#5:4 | G5:8 ${UPBEAT}`;
    // A' の終わり：ニ長調で止まり、B へ弱起で入る
    const THEME_TURN = `${THEME_HEAD} | G5:4 B5:4 A5:4 C#6:4 | D6:8 r:4 B5:2 C6:2`;
    const CHORDS_HEAD = 'G | D/F# | Em | C:8 D:8 | G/B | C:8 A7:8';
    const CHORDS_A = `${CHORDS_HEAD} | D:8 D7:8 | G`;
    const CHORDS_A2 = `${CHORDS_HEAD} | Em:8 A7:8 | D`;
    // ループの終わり：G から D7 へ進み、弱起で頭へ戻る
    const CHORDS_LAST = `${CHORDS_HEAD} | D:8 D7:8 | G:8 D7:8`;

    // 弦の対旋律：主題の下で、2分音符で和音の3度や7度をなぞる
    const COUNTER_HEAD = 'B4:8 D5:8 | A4:8 D5:8 | G4:8 B4:8 | G4:8 F#4:8 | D5:8 B4:8 | E4:8 C#5:8';
    const COUNTER = `${COUNTER_HEAD} | F#4:8 C5:8 | B4:16`;
    const COUNTER_TURN = `${COUNTER_HEAD} | G4:8 C#5:8 | F#4:8 A4:8`;
    const COUNTER_LAST = `${COUNTER_HEAD} | F#4:8 C5:8 | B4:8 C5:8`;

    // B：ホ短調で巡り、D7 で休憩の C へ
    const CHORDS_B = 'Em | Bm | C | G | Am | Em | Am:8 B7:8 | Em:8 D7:8';
    const SONG_B = `B5:4 E5:4 G5:4 B5:2 A5:2 | F#5:8 D5:4 E5:2 F#5:2 | G5:4 E5:4 C6:4 B5:2 A5:2 | B5:8 G5:4 A5:2 B5:2 |
                    C6:4 A5:4 E6:4 D6:2 C6:2 | B5:4 G5:4 E5:4 G5:2 A5:2 | C6:4 A5:4 B5:4 F#5:4 | E5:8 F#5:4 A5:4`;

    // 休憩：弦がひとりで歌う。最後の小節の後半で、ピアノが弱起を入れて A へ
    const CHORDS_C = 'C | G/B | Am | Em | C | G/B | Am:8 D:8 | D7';
    const SOLO_C = 'G5:8 E5:8 | D5:8 G5:8 | A5:8 E5:8 | G5:12 B5:4 | C6:8 G5:8 | B5:8 D6:8 | C6:8 A5:8 | A5:8 r:8';
    const LEAD_C = `r:16 | r:16 | r:16 | r:16 | r:16 | r:16 | r:16 | r:8 ${UPBEAT}`;

    // チェンバロのつもりの和音：4分と8分で軽く弾む。ベースは4分で歩く
    const HARPSI = 'x...x.x.x...x.x.';
    const BASS = 'R:4 5:4 R+:4 5:4';

    // ガヴォット：チェンバロ風の和音と通奏低音、弦の対旋律
    const gavotte = {
        title: '宮廷のガヴォット',
        tags: ['軽快', 'おしゃれ'],
        genre: 'クラシック',
        melody: ['lead'],
        bpm: 104,
        gain: 0.11,
        reverb: { seconds: 1.8, tone: 0.55 },
        delay: { time: 0.75, feedback: 0.18, tone: 2400, reverb: 0.2 },
        humanize: { time: 0.004, velocity: 0.08 },
        parts: {
            lead: { instrument: 'piano', volume: 0.5, pan: -0.08, decay: 0.7, brightness: 0.9, reverb: 0.2, delay: 0.06 },
            // 休憩の C で歌う弦
            solo: { instrument: 'strings', volume: 1.1, pan: 0.15, attack: 0.12, release: 0.4, brightness: 0.85, vibrato: 8, reverb: 0.35 },
            // 主題の下で歌う弦の対旋律
            counter: { instrument: 'strings', volume: 0.7, pan: 0.25, attack: 0.1, release: 0.35, brightness: 0.8, vibrato: 7, reverb: 0.3 },
            // B で和音を薄く伸ばす弦
            strings: { instrument: 'strings', mode: 'chords', center: 'E4', voices: 3, volume: 0.45, pan: 0.2, attack: 0.3, release: 0.6, brightness: 0.7, reverb: 0.4 },
            // チェンバロのつもり：明るいギターの和音を、短く、わずかにずらして弾く
            harpsi: { instrument: 'guitar', mode: 'chords', center: 'D4', voices: 3, strum: 0.012, gate: 0.4, brightness: 0.95, release: 0.08, volume: 0.7, pan: -0.25, reverb: 0.2 },
            // 通奏低音
            bass: { instrument: 'pluck', mode: 'bass', octave: 2, brightness: 0.5, volume: 0.75 }
        },
        sections: {
            // イントロ：チェンバロと通奏低音。最後の小節の後半で、ピアノが弱起を入れる
            intro: {
                label: 'イントロ',
                chords: 'G | Em | Am:8 D:8 | D7',
                lead: `r:16 | r:16 | r:16 | r:8 ${UPBEAT}`,
                harpsi: HARPSI,
                bass: { pattern: `r:16 | ${BASS} | ${BASS} | ${BASS}` }
            },
            A: {
                chords: CHORDS_A,
                lead: THEME,
                harpsi: HARPSI,
                bass: BASS
            },
            // A'：弦の対旋律が加わる。ニ長調で止まって B へ
            A2: {
                label: "A'",
                chords: CHORDS_A2,
                lead: THEME_TURN,
                counter: COUNTER_TURN,
                harpsi: HARPSI,
                bass: BASS
            },
            // B：ホ短調。弦が和音を薄く伸ばす
            B: {
                chords: CHORDS_B,
                lead: SONG_B,
                strings: 'hold',
                harpsi: HARPSI,
                bass: BASS
            },
            // 休憩：ピアノを抜き、弦がひとりで歌う。チェンバロとベースは2分に
            C: {
                chords: CHORDS_C,
                solo: SOLO_C,
                lead: LEAD_C,
                harpsi: 'x.......x.......',
                bass: 'R:8 5:8'
            },
            // 最後の A：対旋律がそろい、D7 で頭へ戻る
            A3: {
                label: 'A',
                chords: CHORDS_LAST,
                lead: THEME,
                counter: COUNTER_LAST,
                harpsi: HARPSI,
                bass: BASS
            }
        },
        intro: ['intro'],
        loop: ['A', 'A2', 'B', 'C', 'A3']
    };

    SoundKit.register('catalog', { songs: { gavotte } });
})();
