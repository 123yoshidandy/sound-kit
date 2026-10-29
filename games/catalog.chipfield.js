/**
 * 曲の一覧：ドット絵の大地をゆく（8bit・イ長調で、軽快に歩く）
 * 矩形波2つ・三角波・ノイズのドラムだけで書く。主題は8分と4分で弾むように歩き、三角波のベースが4分で根音・3度・5度を踏む
 * A' は duty 0.5 の対旋律が主題の伸ばしに短く答える。B はニ長調の方から巡り、対旋律が下で和音の音を伸ばす
 * B の2回目は分散和音が8分に増える。休憩の C は主旋律を抜き、矩形波がゆっくり歌う。最後は E7 で頭の A へ戻る
 */
(function () {
    const { repeat } = SoundKit;

    // A の主題（前半7小節は A' でも同じ）
    const THEME_HEAD = `E5:4 A5:2 B5:2 C#6:4 A5:4 | D6:6 C#6:2 A5:4 F#5:4 |
                        E5:2 A5:2 C#6:2 E6:2 E6:4 C#6:4 | B5:8 G#5:4 E5:4 |
                        F#5:4 A5:2 C#6:2 E6:4 C#6:4 | D6:6 A5:2 F#5:8 | D6:4 B5:4 B5:2 G#5:2 E5:4`;
    const THEME = `${THEME_HEAD} | A5:12 r:4`;
    // A' の終わり：E7 で止めて次へ
    const THEME_TURN = `${THEME_HEAD} | B5:4 G#5:4 E5:4 D5:4`;
    const CHORDS_HEAD = 'A | D | A | E | F#m | D | Bm7:8 E:8';
    const CHORDS_A = `${CHORDS_HEAD} | A`;
    const CHORDS_A2 = `${CHORDS_HEAD} | E7`;

    // A' の対旋律：主題の伸ばしに短く答える
    const COUNTER_A = `r:12 C#5:2 E5:2 | F#5:8 r:8 | r:16 | r:8 E5:4 G#5:4 |
                       r:12 C#5:2 E5:2 | r:8 A5:2 F#5:2 D5:4 | r:16 | r:16`;

    // B：ニ長調の方から巡り、E で次へ
    const CHORDS_B = 'D | E | C#m | F#m | Bm | E | A/C#:8 D:8 | E';
    const SONG_B = `F#5:4 A5:4 D6:6 C#6:2 | B5:8 E5:4 G#5:4 | G#5:4 C#6:4 E6:8 | C#6:6 A5:2 F#5:8 |
                    D5:4 F#5:4 B5:6 A5:2 | G#5:6 B5:2 E6:8 | C#6:4 A5:4 D6:4 F#5:4 | E6:4 B5:4 G#5:4 B5:4`;
    // B の対旋律：下で和音の音を伸ばす
    const COUNTER_B = 'A4:16 | G#4:16 | G#4:16 | A4:16 | B4:16 | B4:16 | A4:8 A4:8 | G#4:16';

    // 休憩：矩形波がゆっくり歌う。E7 で最後の A' へ
    const CHORDS_C = 'F#m | D | A | E | F#m | D | Bm7 | E7';
    const SOLO_C = `C#5:8 F#5:8 | F#5:8 A5:8 | E5:8 C#5:8 | B4:16 |
                    A5:8 F#5:8 | D5:8 F#5:8 | D5:8 B4:8 | D5:8 G#5:8`;

    // 分散和音は4分（B の2回目は8分）。三角波のベースは4分で歩く
    const ARP = '0:4 1 2 1';
    const ARP_EIGHTH = '0:2 1 2 1 0 1 2 1';
    const BASS = 'R:4 3:4 5:4 3:4';
    const BASS_B = 'R:4 5:4 R+:4 5:4';
    const KICK = repeat('x.......x.......', 8, '|');
    const SNARE = repeat('....x.......x...', 8, '|');
    const HAT = repeat('x.x.x.x.x.x.x.x.', 8, '|');
    const DRUMS = { kick: KICK, snare: SNARE, hat: HAT };
    const DRUMS_FILL = { kick: KICK, hat: HAT, snare: repeat('....x.......x...', 7, '|') + '|....x...x.x.x.x.' };

    // フィールド：矩形波と三角波で、軽快に歩く
    const chipfield = {
        title: 'ドット絵の大地をゆく',
        tags: ['軽快', '明るい'],
        genre: 'チップチューン',
        melody: ['lead'],
        bpm: 120,
        gain: 0.12,
        reverb: { seconds: 1.4, tone: 0.4 },
        delay: { time: 0.75, feedback: 0.2, tone: 2200 },
        parts: {
            lead: { instrument: 'chip', wave: 'pulse', duty: 0.25, level: 0.2, vibrato: 10, sustain: 0.6, decay: 0.3, gate: 0.85, pan: -0.1, delay: 0.12, reverb: 0.1 },
            counter: { instrument: 'chip', wave: 'pulse', duty: 0.5, level: 0.08, vibrato: 8, sustain: 0.7, pan: 0.3, delay: 0.1, reverb: 0.1 },
            // 休憩の C で歌う矩形波
            solo: { instrument: 'chip', wave: 'pulse', duty: 0.5, level: 0.1, vibrato: 10, sustain: 0.7, pan: 0.15, delay: 0.15, reverb: 0.15 },
            arp: { instrument: 'chip', wave: 'pulse', duty: 0.25, level: 0.25, decay: 0.12, sustain: 0.2, mode: 'arp', from: 'A3', pan: 0.25, delay: 0.1 },
            bass: { instrument: 'chip', wave: 'triangle', level: 0.12, sustain: 0.85, mode: 'bass', octave: 2, gate: 0.75 },
            drums: { instrument: 'drums', kit: 'chip', mode: 'drums', volume: 0.6, levels: { kick: 0.9, snare: 0.65, hat: 0.5 } }
        },
        sections: {
            // イントロ：ベースが歩き出し、分散和音とドラムが入る。E で主題へ
            intro: {
                label: 'イントロ',
                chords: 'A | D | Bm7 | E',
                arp: ARP,
                bass: BASS,
                drums: { hat: repeat('x.x.x.x.x.x.x.x.', 4, '|'), kick: '................|................|x.......x.......|x.......x.......', snare: '................|................|................|....x...x.x.x.x.' }
            },
            A: {
                chords: CHORDS_A,
                lead: THEME,
                arp: ARP,
                bass: BASS,
                drums: DRUMS
            },
            // A'：対旋律が短く答え、E7 で B へ
            A2: {
                label: "A'",
                chords: CHORDS_A2,
                lead: THEME_TURN,
                counter: COUNTER_A,
                arp: ARP,
                bass: BASS,
                drums: DRUMS_FILL
            },
            // B：ニ長調の方から巡る。対旋律が下で伸ばす
            B: {
                chords: CHORDS_B,
                lead: SONG_B,
                counter: COUNTER_B,
                arp: ARP,
                bass: BASS_B,
                drums: DRUMS
            },
            // B の2回目：分散和音が8分に増える
            B2: {
                label: "B'",
                chords: CHORDS_B,
                lead: SONG_B,
                counter: COUNTER_B,
                arp: ARP_EIGHTH,
                bass: BASS_B,
                drums: DRUMS_FILL
            },
            // 休憩：主旋律を抜き、矩形波がゆっくり歌う。ドラムはハイハットだけ
            C: {
                chords: CHORDS_C,
                solo: SOLO_C,
                arp: '0:8 1',
                bass: 'R:8 5:8',
                drums: { hat: repeat('x...x...x...x...', 8, '|') }
            },
            // 最後の A'：対旋律と8分の分散和音で、E7 で頭の A へ戻る
            A3: {
                label: "A'",
                chords: CHORDS_A2,
                lead: THEME_TURN,
                counter: COUNTER_A,
                arp: ARP_EIGHTH,
                bass: BASS,
                drums: DRUMS_FILL
            }
        },
        intro: ['intro'],
        loop: ['A', 'A2', 'B', 'B2', 'C', 'A3']
    };

    SoundKit.register('catalog', { songs: { chipfield } });
})();
