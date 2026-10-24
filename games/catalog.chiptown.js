/**
 * 曲の一覧：ドット絵の町（8bit の町・ト長調で、のんびり歩く）
 * ファミコンと同じ音（矩形波2つ・三角波・ノイズのドラム）だけで書く。少しはねるリズムで、町の中を散歩するように
 * A' は duty 0.5 の対旋律が低く支え、B はハ長調の方へ寄り道する。休憩の C は対旋律の矩形波がゆっくり歌う
 */
(function () {
    const { repeat } = SoundKit;

    // A の主題（前半7小節は最後の A でも同じ）
    const THEME_HEAD = `D5:4 G5:4 B5:6 A5:2 | G5:4 E5:4 B5:8 | E6:4 C6:4 G5:8 | F#5:4 A5:4 D6:6 C6:2 |
                        B5:4 D6:4 B5:4 G5:4 | E6:6 D6:2 B5:8 | C6:4 A5:4 F#5:4 A5:4`;
    const THEME = `${THEME_HEAD} | G5:12 r:4`;
    // ループの終わり：D で止めて、頭の G へ戻る
    const THEME_LAST = `${THEME_HEAD} | A5:8 F#5:4 D5:4`;
    const CHORDS_A = 'G | Em | C | D | G | Em | Am:8 D:8 | G';
    const CHORDS_LAST = 'G | Em | C | D | G | Em | Am:8 D:8 | D';

    // A' の対旋律：和音の音を低く伸ばす
    const COUNTER_A = 'B4:16 | B4:16 | C5:16 | A4:16 | B4:16 | B4:16 | C5:8 A4:8 | B4:16';

    // 分散和音（8分）と、三角波のベース
    const ARP = '0:2 1 2 3 2 1 2 1';
    const BASS = 'R:4 5:4 R+:4 5:4';
    const KICK = repeat('x.......x.......', 8, '|');
    const SNARE = repeat('....x.......x...', 8, '|');
    const HAT = repeat('x.o.x.o.x.o.x.o.', 8, '|');
    const DRUMS = { kick: KICK, snare: SNARE, hat: HAT };
    const DRUMS_FILL = { kick: KICK, hat: HAT, snare: repeat('....x.......x...', 7, '|') + '|....x.......x.xx' };

    // 8bit の町：矩形波と三角波で、のんびり
    const chiptown = {
        title: 'ドット絵の町',
        tags: ['明るい', '落ち着いた'],
        genre: 'チップチューン',
        melody: ['lead'],
        bpm: 116,
        swing: 0.08,
        swingUnit: 2,
        gain: 0.135,
        reverb: { seconds: 1.2, tone: 0.4 },
        delay: { time: 0.75, feedback: 0.2, tone: 2200 },
        parts: {
            lead: { instrument: 'chip', wave: 'pulse', duty: 0.25, level: 0.2, vibrato: 10, sustain: 0.6, decay: 0.3, gate: 0.9, pan: -0.1, delay: 0.12, reverb: 0.08 },
            counter: { instrument: 'chip', wave: 'pulse', duty: 0.5, level: 0.08, vibrato: 8, sustain: 0.7, pan: 0.3, delay: 0.1, reverb: 0.1 },
            arp: { instrument: 'chip', wave: 'pulse', duty: 0.125, level: 0.06, decay: 0.12, sustain: 0.2, mode: 'arp', from: 'D4', pan: 0.25, delay: 0.1 },
            bass: { instrument: 'chip', wave: 'triangle', level: 0.12, sustain: 0.85, mode: 'bass', octave: 2, gate: 0.8 },
            drums: { instrument: 'drums', kit: 'chip', mode: 'drums', volume: 0.5, levels: { kick: 0.9, snare: 0.7, hat: 0.7 } }
        },
        sections: {
            // イントロ：分散和音とベースで歩き出し、D で主題へ
            intro: {
                label: 'イントロ',
                chords: 'G | C | Am | D',
                arp: ARP,
                bass: { pattern: `r:16 | r:16 | ${BASS} | ${BASS}` },
                drums: { hat: repeat('x.o.x.o.x.o.x.o.', 4, '|'), snare: '................|................|................|....x.......x.xx' }
            },
            A: {
                chords: CHORDS_A,
                lead: THEME,
                arp: ARP,
                bass: BASS,
                drums: DRUMS
            },
            // A'：対旋律が低く支える
            A2: {
                label: "A'",
                chords: CHORDS_A,
                lead: THEME,
                counter: COUNTER_A,
                arp: ARP,
                bass: BASS,
                drums: DRUMS_FILL
            },
            // B：ハ長調の方へ寄り道して、D7 で休憩へ
            B: {
                chords: 'C | D | Bm7 | Em | Am7 | D | G:8 E7:8 | Am7:8 D7:8',
                lead: `E6:6 D6:2 C6:8 | D6:6 C6:2 A5:8 | B5:4 D6:4 A5:8 | G5:6 F#5:2 E5:8 |
                       E5:4 A5:4 C6:8 | D6:6 A5:2 F#5:8 | G5:4 B5:4 G#5:4 B5:4 | C6:4 A5:4 F#5:4 D6:4`,
                arp: ARP,
                bass: BASS,
                drums: DRUMS_FILL
            },
            // 休憩：主旋律を抜き、対旋律の矩形波がゆっくり歌う。分散和音は4分、ドラムはハイハットだけ
            C: {
                chords: 'G | C | G | D | Em | C | Am | D',
                counter: 'B5:16 | C6:8 G5:8 | D6:8 B5:8 | A5:16 | B5:8 G5:8 | E5:8 G5:8 | A5:8 C6:8 | F#5:8 A5:8',
                arp: '0:4 1 2 1',
                bass: 'R:8 5:8',
                drums: { hat: HAT }
            },
            // 最後の A'：対旋律を足して、D で頭の G へ戻る
            A3: {
                label: "A'",
                chords: CHORDS_LAST,
                lead: THEME_LAST,
                counter: COUNTER_A.replace(/B4:16$/, 'A4:16'),
                arp: ARP,
                bass: BASS,
                drums: DRUMS_FILL
            }
        },
        intro: ['intro'],
        loop: ['A', 'A2', 'B', 'C', 'A3']
    };

    SoundKit.register('catalog', { songs: { chiptown } });
})();
