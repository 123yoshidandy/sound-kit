/**
 * 曲の一覧：ピクセルの魔王（チップチューンのボス戦・イ短調で速く）
 * ファミコンと同じ音（矩形波2つ・三角波・ノイズのドラム）だけで書く。属和音は E（G# で張りつめさせる）
 * A' は duty 0.5 の対旋律で厚くし、休憩の C は細い矩形波がゆっくり歌う
 */
(function () {
    const { repeat } = SoundKit;

    // A の主題（前半4小節は A' でも同じ）
    const THEME_HEAD = `A5:2 E5:2 A5:2 C6:2 B5:2 A5:2 E5:4 | C6:6 A5:2 F5:8 | G5:2 D5:2 G5:2 B5:2 D6:4 B5:4 | G#5:6 E5:2 B4:8`;
    const THEME = `${THEME_HEAD} |
                   A5:2 E5:2 A5:2 C6:2 E6:4 D6:2 C6:2 | C6:6 A5:2 F5:4 A5:4 | D6:4 F5:4 A5:4 D6:4 | B5:8 G#5:4 E5:4`;

    // サビ：長調の F・G から押し上げる
    const CHORUS = `C6:6 B5:2 A5:8 | B5:6 A5:2 G5:8 | G5:4 B5:4 E6:8 | E6:6 D6:2 C6:8 |
                    A5:4 C6:4 F6:8 | D6:6 B5:2 G5:8 | G#5:4 B5:4 E6:8 | D6:4 B5:4 G#5:4 E5:4`;

    const CHORDS_A = 'Am | F | G | E | Am | F | Dm | E';
    const CHORDS_B = 'F | G | Em | Am | F | G | E | E';

    // A' の対旋律：和音の音を伸ばす
    const COUNTER = 'C5:16 | A4:16 | B4:16 | G#4:16 | C5:16 | A4:16 | A4:16 | G#4:16';
    // 16分で動くのは分散和音だけ
    const ARP = '0:1 1 2 1 3 1 2 1 0 1 2 1 3 1 2 1';
    const BASS = 'R:2 R+:2 R:2 R+:2 R:2 R+:2 5:2 R+:2';

    const KICK = 'x.......x.x.....';
    const SNARE = '....x.......x...';
    const HAT = 'x.o.x.o.x.o.x.o.';
    const DRUMS = { kick: repeat(KICK, 8, '|'), snare: repeat(SNARE, 8, '|'), hat: repeat(HAT, 8, '|') };
    const DRUMS_FILL = {
        kick: repeat(KICK, 8, '|'),
        snare: repeat(SNARE, 7, '|') + '|....x...x.x.xxxx',
        hat: repeat(HAT, 7, '|') + '|x.o.x.o.........'
    };

    // チップのボス戦：速い分散和音と、オクターブで跳ねる三角波のベース
    const chipboss = {
        title: 'ピクセルの魔王',
        tags: ['緊張感'],
        genre: 'チップチューン',
        melody: ['lead', 'leadB'],
        bpm: 160,
        gain: 0.12,
        reverb: { seconds: 1.2, tone: 0.4 },
        delay: { time: 0.75, feedback: 0.2, tone: 2200 },
        parts: {
            lead: { instrument: 'chip', wave: 'pulse', duty: 0.25, level: 0.2, vibrato: 12, sustain: 0.6, decay: 0.3, gate: 0.9, pan: -0.1, delay: 0.12, reverb: 0.08 },
            leadB: { instrument: 'chip', wave: 'pulse', duty: 0.125, level: 0.24, vibrato: 16, sustain: 0.7, decay: 0.4, gate: 0.95, pan: -0.1, delay: 0.18, reverb: 0.1 },
            counter: { instrument: 'chip', wave: 'pulse', duty: 0.5, level: 0.07, sustain: 0.7, pan: 0.3, reverb: 0.1 },
            arp: { instrument: 'chip', wave: 'pulse', duty: 0.125, level: 0.06, decay: 0.12, sustain: 0.2, mode: 'arp', from: 'A4', pan: 0.25, delay: 0.1 },
            bass: { instrument: 'chip', wave: 'triangle', level: 0.12, sustain: 0.85, mode: 'bass', octave: 2, gate: 0.85 },
            drums: { instrument: 'drums', kit: 'chip', mode: 'drums', volume: 0.54, levels: { hat: 0.8 } }
        },
        sections: {
            // イントロ：分散和音とベースで迫り、E で主題へ
            intro: {
                label: 'イントロ',
                chords: 'Am | F | Dm | E',
                arp: ARP,
                bass: BASS,
                drums: {
                    hat: repeat(HAT, 4, '|'),
                    kick: '................|................|' + KICK + '|x...x...x...x...',
                    snare: '................|................|................|....x...x.x.xxxx'
                }
            },
            A: {
                chords: CHORDS_A,
                lead: THEME,
                arp: ARP,
                bass: BASS,
                drums: DRUMS
            },
            // A'：対旋律を足す
            A2: {
                label: "A'",
                chords: CHORDS_A,
                lead: THEME,
                counter: COUNTER,
                arp: ARP,
                bass: BASS,
                drums: DRUMS_FILL
            },
            // サビ：細い矩形波に持ち替えて、長い音で押し上げる
            B: {
                chords: CHORDS_B,
                leadB: CHORUS,
                arp: ARP,
                bass: BASS,
                drums: DRUMS_FILL
            },
            // 休憩：分散和音をゆっくりにし、細い矩形波が長い音で歌う。ドラムはハイハットだけ
            C: {
                chords: 'Am | Am | F | F | Dm | Dm | E | E',
                leadB: 'E5:16 | C5:8 E5:8 | F5:16 | A5:16 | F5:16 | D5:8 F5:8 | E5:16 | G#5:16',
                arp: { pattern: '0:2 1 2 3', from: 'A4' },
                bass: 'R:8 R:8',
                drums: {
                    hat: repeat('x...x...x...x...', 8, '|'),
                    snare: repeat('................', 7, '|') + '|....x...x.x.xxxx'
                }
            }
        },
        intro: ['intro'],
        loop: ['A', 'A2', 'B', 'C']
    };

    SoundKit.register('catalog', { songs: { chipboss } });
})();
