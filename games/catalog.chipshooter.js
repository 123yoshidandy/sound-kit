/**
 * 曲の一覧：弾幕の星空（8bit のシューティング・イ短調で、速く飛ぶ）
 * ファミコンと同じ音（矩形波2つ・三角波・ノイズのドラム）だけで書く。三角波のベースがオクターブで跳ねて、機体を前へ押し出す
 * 細い矩形波の16分の分散和音が星のように流れ、主題は高く駆け上がる。A' は duty 0.5 の対旋律が低く支える
 * B はハ長調の方へ開き、B' で対旋律が重なる。休憩の C は主旋律を抜き、エコーの長い矩形波が歌う。C' でドラムが戻り、最後の A へ加速する
 */
(function () {
    const { repeat } = SoundKit;

    // A の主題（前半7小節は最後の A でも同じ）
    const THEME_HEAD = `E5:4 A5:4 C6:4 E6:4 | F6:6 E6:2 C6:8 | D6:4 B5:4 G5:4 D6:4 | B5:8 G#5:4 E5:4 |
                        A5:4 C6:4 E6:6 D6:2 | C6:4 A5:4 F6:8 | F6:4 D6:4 E6:4 B5:4`;
    const THEME = `${THEME_HEAD} | A5:12 r:4`;
    // ループの終わり：E で止めて、頭の Am へ戻る
    const THEME_LAST = `${THEME_HEAD} | G#5:4 B5:4 E6:4 B5:4`;
    const CHORDS_HEAD = 'Am | F | G | E | Am | F | Dm:8 E:8';
    const CHORDS_A = `${CHORDS_HEAD} | Am`;
    const CHORDS_LAST = `${CHORDS_HEAD} | E`;

    // A' の対旋律：和音の音を低く伸ばす
    const COUNTER_A = 'C5:16 | C5:16 | B4:16 | B4:16 | C5:16 | A4:16 | A4:8 G#4:8 | A4:16';

    // B：ハ長調の方へ開き、E で次へ
    const CHORDS_B = 'F | G | Em | Am | F | G | E | E';
    const SONG_B = `A5:4 C6:4 F6:8 | D6:6 B5:2 G5:8 | E6:4 B5:4 G5:4 B5:4 | C6:6 B5:2 A5:8 |
                    F5:4 A5:4 C6:4 F6:4 | E6:6 D6:2 B5:8 | G#5:4 B5:4 E6:8 | D6:4 B5:4 G#5:4 B5:4`;
    const COUNTER_B = 'F5:16 | D5:16 | E5:16 | E5:16 | F5:16 | D5:16 | E5:16 | E5:16';

    // 休憩：主旋律を抜き、エコーの長い矩形波が歌う。E で次へ
    const CHORDS_C = 'Am | G | F | E | Am | G | F | E';
    const SING_C = `E5:8 A5:8 | B5:8 G5:8 | A5:8 C6:8 | B5:16 |
                    C6:8 A5:8 | D6:8 B5:8 | C6:8 A5:8 | G#5:8 B5:8`;

    // 16分で動くのは分散和音だけ。ベースは8分でオクターブを跳ねる
    const ARP = '0:1 1 2 1 3 1 2 1 0 1 2 1 3 1 2 1';
    const BASS = 'R:2 R+:2 R:2 R+:2 R:2 R+:2 5:2 R+:2';
    const KICK = repeat('x...x...x...x...', 8, '|');
    const SNARE = repeat('....x.......x...', 8, '|');
    const HAT = repeat('..x...x...x...x.', 8, '|');
    const DRUMS = { kick: KICK, snare: SNARE, hat: HAT };
    const DRUMS_FILL = { kick: KICK, hat: HAT, snare: repeat('....x.......x...', 7, '|') + '|....x.......x.xx' };

    // 8bit のシューティング：オクターブで跳ねるベースと、駆け上がる主題
    const chipshooter = {
        title: '弾幕の星空',
        tags: ['緊張感', '軽快'],
        genre: 'チップチューン',
        melody: ['lead'],
        bpm: 150,
        gain: 0.12,
        reverb: { seconds: 1.4, tone: 0.4 },
        delay: { time: 0.75, feedback: 0.3, tone: 2000, reverb: 0.2 },
        parts: {
            lead: { instrument: 'chip', wave: 'pulse', duty: 0.25, level: 0.2, vibrato: 12, sustain: 0.6, decay: 0.3, gate: 0.9, pan: -0.1, delay: 0.12, reverb: 0.1 },
            counter: { instrument: 'chip', wave: 'pulse', duty: 0.5, level: 0.08, vibrato: 8, sustain: 0.7, pan: 0.3, delay: 0.2, reverb: 0.15 },
            // 休憩の C で歌う矩形波：エコーを長く
            sing: { instrument: 'chip', wave: 'pulse', duty: 0.5, level: 0.11, vibrato: 10, sustain: 0.7, gate: 0.9, pan: 0.15, delay: 0.3, reverb: 0.15 },
            arp: { instrument: 'chip', wave: 'pulse', duty: 0.125, level: 0.05, decay: 0.1, sustain: 0.15, mode: 'arp', from: 'C4', pan: 0.25, delay: 0.1 },
            bass: { instrument: 'chip', wave: 'triangle', level: 0.12, sustain: 0.85, mode: 'bass', octave: 2, gate: 0.8 },
            drums: { instrument: 'drums', kit: 'chip', mode: 'drums', volume: 0.5, levels: { kick: 0.9, snare: 0.6, hat: 0.6 } }
        },
        sections: {
            // イントロ：分散和音で飛び立ち、3小節目でベースとドラム。E で主題へ
            intro: {
                label: 'イントロ',
                chords: 'Am | F | G | E',
                arp: ARP,
                bass: { pattern: `r:16 | r:16 | ${BASS} | ${BASS}` },
                drums: { kick: '................|................|x...x...x...x...|x...x...x...x...', snare: '................|................|................|....x...x.x.xxxx' }
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
            // B：ハ長調の方へ開く
            B: {
                chords: CHORDS_B,
                lead: SONG_B,
                arp: ARP,
                bass: BASS,
                drums: DRUMS
            },
            // B'：対旋律が重なる。E で休憩へ
            B2: {
                label: "B'",
                chords: CHORDS_B,
                lead: SONG_B,
                counter: COUNTER_B,
                arp: ARP,
                bass: BASS,
                drums: DRUMS_FILL
            },
            // 休憩：主旋律を抜き、エコーの長い矩形波が歌う。分散和音は8分、ベースは2分、ドラムはキックだけ
            C: {
                chords: CHORDS_C,
                sing: SING_C,
                arp: '0:2 1 2 1 3 1 2 1',
                bass: 'R:8 5:8',
                drums: { kick: repeat('x.......x.......', 8, '|') }
            },
            // C'：16分の分散和音とドラムが戻り、最後の A へ加速する
            C2: {
                label: "C'",
                chords: CHORDS_C,
                sing: SING_C,
                arp: ARP,
                bass: BASS,
                drums: DRUMS_FILL
            },
            // 最後の A'：対旋律を足して、E で頭の Am へ戻る
            A3: {
                label: "A'",
                chords: CHORDS_LAST,
                lead: THEME_LAST,
                counter: COUNTER_A.replace(/A4:16$/, 'G#4:16'),
                arp: ARP,
                bass: BASS,
                drums: DRUMS_FILL
            }
        },
        intro: ['intro'],
        loop: ['A', 'A2', 'B', 'B2', 'C', 'C2', 'A3']
    };

    SoundKit.register('catalog', { songs: { chipshooter } });
})();
