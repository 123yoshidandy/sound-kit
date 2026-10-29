/**
 * 曲の一覧：ドットの積み木あそび（8bit のパズル・ハ長調で、ぽんぽんはずむ）
 * ファミコンと同じ音（矩形波2つ・三角波・ノイズのドラム）だけで書く。主題は短く切って休みをはさみ、積み木を置くように跳ねる
 * 16分で動くパートは置かず、8分の分散和音とオクターブで跳ねるベースだけにして、考えごとの邪魔をしない
 * A' と B' は duty 0.5 の対旋律が低く支え、B でスネアが入る。休憩の C は主旋律を抜き、エコーの長い矩形波が歌う
 */
(function () {
    const { repeat } = SoundKit;

    // A の主題（前半7小節は最後の A でも同じ）。短く切って、休みをはさむ
    const THEME_HEAD = `E5:2 r:2 G5:2 r:2 C6:4 G5:4 | A5:2 r:2 C6:2 r:2 E6:4 C6:4 |
                        F5:2 r:2 A5:2 r:2 C6:4 A5:2 G5:2 | B5:6 A5:2 G5:4 D5:4 |
                        E5:2 r:2 G5:2 r:2 C6:4 E6:4 | E6:2 D6:2 C6:2 B5:2 A5:4 E5:4 | F5:4 A5:4 G5:4 B5:4`;
    const THEME = `${THEME_HEAD} | C6:8 r:4 G5:4`;
    // ループの終わり：G で止めて、頭の C へ戻る
    const THEME_LAST = `${THEME_HEAD} | B5:4 G5:4 D5:4 G5:4`;
    const CHORDS_HEAD = 'C | Am | F | G | C | Am | Dm:8 G:8';
    const CHORDS_A = `${CHORDS_HEAD} | C`;
    const CHORDS_LAST = `${CHORDS_HEAD} | G`;

    // A' の対旋律：和音の音を低く伸ばす
    const COUNTER_A = 'C5:16 | C5:16 | A4:16 | B4:16 | C5:16 | C5:16 | A4:8 B4:8 | C5:16';
    const COUNTER_LAST = 'C5:16 | C5:16 | A4:16 | B4:16 | C5:16 | C5:16 | A4:8 B4:8 | B4:16';

    // B：F から開き、G で次へ
    const CHORDS_B = 'F | G | Em | Am | F | G | Dm7 | G';
    const SONG_B = `A5:4 C6:4 F6:8 | D6:6 B5:2 G5:8 | G5:4 B5:4 E6:4 B5:4 | C6:6 B5:2 A5:8 |
                    F5:2 r:2 A5:2 r:2 C6:4 A5:4 | G5:2 r:2 B5:2 r:2 D6:4 B5:4 | A5:4 F5:4 D5:4 F5:4 | G5:4 B5:4 D6:4 B5:4`;
    const COUNTER_B = 'C5:16 | B4:16 | B4:16 | C5:16 | C5:16 | D5:16 | D5:16 | D5:16';

    // 休憩：主旋律を抜き、エコーの長い矩形波が歌う。G で最後の A へ
    const CHORDS_C = 'Am | F | C | G | Am | F | Dm | G';
    const SING_C = `E5:8 A5:8 | A5:8 C6:8 | G5:8 E6:8 | D6:12 B5:4 |
                    C6:8 E6:8 | C6:8 A5:8 | F5:8 A5:8 | B5:8 D6:8`;

    // 分散和音は8分、ベースは8分でオクターブを跳ねる
    const ARP = '0:2 1 2 1 3 1 2 1';
    const BASS = 'R:2 R+:2 5:2 R+:2 R:2 R+:2 5:2 R+:2';
    const KICK = repeat('x.......x.......', 8, '|');
    const HAT = repeat('..x...x...x...x.', 8, '|');
    const DRUMS_A = { kick: KICK, hat: HAT };
    const DRUMS_B = { kick: KICK, hat: HAT, snare: repeat('....x.......x...', 7, '|') + '|....x.......x.xx' };

    // 8bit のパズル：跳ねる主題と、8分の分散和音
    const chippuzzle = {
        title: 'ドットの積み木あそび',
        tags: ['明るい', '軽快'],
        genre: 'チップチューン',
        melody: ['lead'],
        bpm: 128,
        gain: 0.143,
        reverb: { seconds: 1.4, tone: 0.4 },
        delay: { time: 0.75, feedback: 0.3, tone: 2000, reverb: 0.2 },
        parts: {
            lead: { instrument: 'chip', wave: 'pulse', duty: 0.25, level: 0.2, vibrato: 10, decay: 0.25, sustain: 0.5, gate: 0.8, pan: -0.1, delay: 0.12, reverb: 0.1 },
            counter: { instrument: 'chip', wave: 'pulse', duty: 0.5, level: 0.06, vibrato: 8, sustain: 0.7, pan: 0.3, delay: 0.2, reverb: 0.15 },
            // 休憩の C で歌う矩形波：エコーを長く
            sing: { instrument: 'chip', wave: 'pulse', duty: 0.5, level: 0.095, vibrato: 10, sustain: 0.7, gate: 0.9, pan: 0.15, delay: 0.3, reverb: 0.15 },
            arp: { instrument: 'chip', wave: 'pulse', duty: 0.25, level: 0.05, decay: 0.12, sustain: 0.2, mode: 'arp', from: 'C4', pan: 0.25, delay: 0.1 },
            bass: { instrument: 'chip', wave: 'triangle', level: 0.12, sustain: 0.85, mode: 'bass', octave: 2, gate: 0.7 },
            drums: { instrument: 'drums', kit: 'chip', mode: 'drums', volume: 0.5, levels: { kick: 0.9, snare: 0.6, hat: 0.6 } }
        },
        sections: {
            // イントロ：分散和音から、3小節目でベースとドラム。G で主題へ
            intro: {
                label: 'イントロ',
                chords: 'C | Am | F | G',
                arp: ARP,
                bass: { pattern: `r:16 | r:16 | ${BASS} | ${BASS}` },
                drums: { kick: '................|................|x.......x.......|x.......x.......', snare: '................|................|................|....x.......x.xx' }
            },
            A: {
                chords: CHORDS_A,
                lead: THEME,
                arp: ARP,
                bass: BASS,
                drums: DRUMS_A
            },
            // A'：対旋律が低く支える
            A2: {
                label: "A'",
                chords: CHORDS_A,
                lead: THEME,
                counter: COUNTER_A,
                arp: ARP,
                bass: BASS,
                drums: DRUMS_A
            },
            // B：F から開き、スネアが入る
            B: {
                chords: CHORDS_B,
                lead: SONG_B,
                arp: ARP,
                bass: BASS,
                drums: DRUMS_B
            },
            // B'：対旋律が重なる。G で休憩へ
            B2: {
                label: "B'",
                chords: CHORDS_B,
                lead: SONG_B,
                counter: COUNTER_B,
                arp: ARP,
                bass: BASS,
                drums: DRUMS_B
            },
            // 休憩：主旋律を抜き、エコーの長い矩形波が歌う。分散和音は4分、ベースは2分、ドラムはキックだけ
            C: {
                chords: CHORDS_C,
                sing: SING_C,
                arp: '0:4 1 2 1',
                bass: 'R:8 5:8',
                drums: { kick: KICK }
            },
            // 最後の A'：対旋律を足して、G で頭の C へ戻る
            A3: {
                label: "A'",
                chords: CHORDS_LAST,
                lead: THEME_LAST,
                counter: COUNTER_LAST,
                arp: ARP,
                bass: BASS,
                drums: DRUMS_B
            }
        },
        intro: ['intro'],
        loop: ['A', 'A2', 'B', 'B2', 'C', 'A3']
    };

    SoundKit.register('catalog', { songs: { chippuzzle } });
})();
