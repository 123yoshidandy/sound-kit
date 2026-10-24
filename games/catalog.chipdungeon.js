/**
 * 曲の一覧：ドット絵の地下迷宮（8bit のダンジョン・ニ短調で、そろそろと進む）
 * ファミコンと同じ音（矩形波2つ・三角波・ノイズのドラム）だけで書く。細い矩形波の16分の分散和音が、暗い通路で鳴り続ける
 * 属和音は A（C# で張りつめさせる）。A' は duty 0.5 の対旋律が低く支え、B はヘ長調の方へ少し光が差す
 * 休憩の C は主旋律を抜き、エコーの長い対旋律が、しずくの落ちるように歌う
 */
(function () {
    const { repeat } = SoundKit;

    // A の主題（前半7小節は最後の A でも同じ）
    const THEME_HEAD = `D5:2 F5:2 A5:4 G5:2 F5:2 E5:4 | F5:6 E5:2 D5:8 | D6:4 C6:2 Bb5:2 F5:8 | E5:4 A5:4 C#6:8 |
                        D6:2 C6:2 A5:4 F5:4 A5:4 | G5:6 A5:2 Bb5:8 | F5:4 D5:4 E5:4 C#5:4`;
    const THEME = `${THEME_HEAD} | D5:12 r:4`;
    // ループの終わり：A で止めて、頭の Dm へ戻る
    const THEME_LAST = `${THEME_HEAD} | E5:4 A5:4 C#6:4 E6:4`;
    const CHORDS_A = 'Dm | Dm | Bb | A | Dm | Gm | Bb:8 A:8 | Dm';
    const CHORDS_LAST = 'Dm | Dm | Bb | A | Dm | Gm | Bb:8 A:8 | A';

    // A' の対旋律：和音の音を低く伸ばす
    const COUNTER_A = 'F4:16 | A4:16 | F4:16 | E4:16 | F4:16 | G4:16 | F4:8 E4:8 | F4:16';

    // 16分で動くのは分散和音だけ
    const ARP = '0:1 1 2 1 3 1 2 1 0 1 2 1 3 1 2 1';
    const BASS = 'R:2 r:2 R:2 r:2 R:2 r:2 5:2 R+:2';
    const KICK = repeat('x.......x.......', 8, '|');
    const SNARE = repeat('........x.......', 8, '|');
    const HAT = repeat('..o...o...o...o.', 8, '|');
    const DRUMS = { kick: KICK, snare: SNARE, hat: HAT };
    const DRUMS_FILL = { kick: KICK, hat: HAT, snare: repeat('........x.......', 7, '|') + '|........x...x.xx' };

    // 8bit のダンジョン：細い矩形波の分散和音
    const chipdungeon = {
        title: 'ドット絵の地下迷宮',
        tags: ['神秘的', '緊張感'],
        genre: 'チップチューン',
        melody: ['lead'],
        bpm: 100,
        gain: 0.143,
        reverb: { seconds: 1.8, tone: 0.4 },
        delay: { time: 0.75, feedback: 0.3, tone: 2000, reverb: 0.2 },
        parts: {
            lead: { instrument: 'chip', wave: 'pulse', duty: 0.25, level: 0.2, vibrato: 12, sustain: 0.6, decay: 0.3, gate: 0.9, pan: -0.1, delay: 0.15, reverb: 0.1 },
            counter: { instrument: 'chip', wave: 'pulse', duty: 0.5, level: 0.08, vibrato: 8, sustain: 0.7, pan: 0.3, delay: 0.25, reverb: 0.15 },
            arp: { instrument: 'chip', wave: 'pulse', duty: 0.125, level: 0.05, decay: 0.1, sustain: 0.15, mode: 'arp', from: 'D4', pan: 0.25, delay: 0.1 },
            bass: { instrument: 'chip', wave: 'triangle', level: 0.12, sustain: 0.85, mode: 'bass', octave: 2, gate: 0.85 },
            drums: { instrument: 'drums', kit: 'chip', mode: 'drums', volume: 0.5, levels: { kick: 0.9, snare: 0.6, hat: 0.6 } }
        },
        sections: {
            // イントロ：分散和音だけで通路に入り、3小節目でベース。A で主題へ
            intro: {
                label: 'イントロ',
                chords: 'Dm | Bb | Gm | A',
                arp: ARP,
                bass: { pattern: `r:16 | r:16 | ${BASS} | ${BASS}` },
                drums: { kick: '................|................|x.......x.......|x.......x...x.xx' }
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
            // B：ヘ長調の方へ少し光が差し、A で休憩へ
            B: {
                chords: 'Bb | C | F | A | Gm | A | Dm:8 Bb:8 | A',
                lead: `F5:4 Bb5:4 D6:8 | E6:6 D6:2 C6:8 | A5:4 C6:4 F6:8 | E6:6 C#6:2 A5:8 |
                       G5:4 Bb5:4 D6:8 | C#6:6 B5:2 A5:8 | F5:4 A5:4 Bb5:4 D6:4 | C#6:12 r:4`,
                arp: ARP,
                bass: BASS,
                drums: DRUMS_FILL
            },
            // 休憩：主旋律を抜き、エコーの長い対旋律が歌う。分散和音は8分、ドラムはキックだけ
            C: {
                chords: 'Dm | C | Bb | A | Dm | C | Bb | A',
                counter: 'A5:16 | G5:8 E5:8 | F5:8 D5:8 | E5:16 | D6:8 A5:8 | C6:8 G5:8 | Bb5:8 F5:8 | C#6:8 A5:8',
                arp: '0:2 1 2 1 3 1 2 1',
                bass: 'R:8 5:8',
                drums: { kick: KICK }
            },
            // 最後の A'：対旋律を足して、A で頭の Dm へ戻る
            A3: {
                label: "A'",
                chords: CHORDS_LAST,
                lead: THEME_LAST,
                counter: COUNTER_A.replace(/F4:16$/, 'E4:16'),
                arp: ARP,
                bass: BASS,
                drums: DRUMS_FILL
            }
        },
        intro: ['intro'],
        loop: ['A', 'A2', 'B', 'C', 'A3']
    };

    SoundKit.register('catalog', { songs: { chipdungeon } });
})();
