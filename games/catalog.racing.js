/**
 * 曲の一覧：疾走サーキット（レースゲーム・ホ短調で、速く）
 * 4つ打ちのキックとクラップ、裏拍のオープンハイハットに、シンセの分散和音とうねるベース
 * A は分散和音を8分で走らせ、A' と B で16分に上げて加速する。休憩の C はシンセが長く歌い、キックを半分にする
 */
(function () {
    const { repeat } = SoundKit;

    // A の主題。シンコペーションで前へ転がる
    const THEME_HEAD = `E5:3 G5:3 B5:4 A5:2 G5:2 B5:2 | C6:6 B5:2 G5:8 | D6:3 B5:3 G5:2 D5:8 | F#5:4 A5:4 D6:8 |
                        E5:3 G5:3 B5:4 A5:2 G5:2 B5:2 | C6:4 E5:4 G5:8 | A5:4 C6:4 B5:4 F#5:4`;
    const THEME = `${THEME_HEAD} | E5:12 r:4`;
    // ループの終わり：B7 で止めて、頭の Em へ戻る
    const THEME_LAST = `${THEME_HEAD} | B5:8 A5:4 F#5:4`;

    const CHORDS_A = 'Em | C | G | D | Em | C | Am7:8 B7:8 | Em';
    const CHORDS_LAST = 'Em | C | G | D | Em | C | Am7:8 B7:8 | B7';

    // A' のシンセブラス：主題が伸ばしている所で、短く答える
    const STABS = repeat('................|..........x-.x--', 4, '|');

    // 分散和音：A は8分、A' と B は16分で加速する
    const ARP8 = '0:2 1 2 3 2 1 2 1';
    const ARP16 = '0:1 1 2 3 2 1 2 3 0 1 2 3 2 1 2 1';
    const BASS = 'R:4 R:2 R:2 R:4 5:2 R+:2';

    const KICK = repeat('x...x...x...x...', 8, '|');
    const CLAP = repeat('....x.......x...', 8, '|');
    const OPEN = repeat('..x...x...x...x.', 8, '|');
    const DRUMS = { kick: KICK, clap: CLAP, openHat: OPEN };
    const DRUMS_FILL = {
        kick: KICK,
        clap: repeat('....x.......x...', 7, '|') + '|....x.......x.xx',
        openHat: OPEN,
        crash: 'x...............|' + repeat('................', 7, '|')
    };

    // レース：4つ打ちと、走るシンセ
    const racing = {
        title: '疾走サーキット',
        tags: ['軽快', '緊張感'],
        genre: 'エレクトロ',
        melody: ['lead'],
        bpm: 136,
        gain: 0.08,
        reverb: { seconds: 1.6, tone: 0.5 },
        delay: { time: 0.75, feedback: 0.25, tone: 2400, reverb: 0.2 },
        humanize: { time: 0.002, velocity: 0.04 },
        parts: {
            lead: { instrument: 'piano', volume: 0.62, pan: -0.08, decay: 0.7, brightness: 0.9, reverb: 0.18, delay: 0.12 },
            // 歌うシンセ：休憩の C で主旋律の代わりに
            synth: { instrument: 'softLead', volume: 0.55, pan: 0.2, cutoff: 2000, vibrato: 10, reverb: 0.3, delay: 0.25 },
            arp: { instrument: 'softLead', mode: 'arp', from: 'B3', volume: 0.45, pan: 0.3, cutoff: 1600, attack: 0.005, release: 0.05, gate: 0.5, vibrato: 0, reverb: 0.15, delay: 0.2 },
            stabs: { instrument: 'brass', mode: 'chords', center: 'G4', voices: 3, volume: 0.63, pan: -0.25, brightness: 4, release: 0.06, reverb: 0.2 },
            pad: { instrument: 'pad', mode: 'chords', center: 'E4', voices: 3, volume: 0.45, pan: -0.15, cutoff: 1200, reverb: 0.4 },
            bass: { instrument: 'synthBass', mode: 'bass', octave: 2, cutoff: 420, envelope: 2.5, decay: 0.2, sustain: 0.4, release: 0.04, volume: 0.6, gate: 0.7 },
            drums: { instrument: 'drums', kit: 'soft', mode: 'drums', volume: 0.65, cutoff: 8000, levels: { kick: 0.75, clap: 0.45, openHat: 0.5, crash: 0.35 } }
        },
        sections: {
            // イントロ：分散和音とキックで走り出し、3小節目でベース、B7 で主題へ
            intro: {
                label: 'イントロ',
                chords: 'Em | C | Am7 | B7',
                arp: ARP8,
                bass: { pattern: `r:16 | r:16 | ${BASS} | ${BASS}` },
                drums: {
                    kick: repeat('x...x...x...x...', 4, '|'),
                    openHat: '................|................|' + repeat('..x...x...x...x.', 2, '|'),
                    clap: '................|................|................|....x.......xxxx'
                }
            },
            A: {
                chords: CHORDS_A,
                lead: THEME,
                arp: ARP8,
                bass: BASS,
                drums: DRUMS
            },
            // A'：分散和音を16分に上げ、シンセブラスが答える
            A2: {
                label: "A'",
                chords: CHORDS_A,
                lead: THEME,
                arp: ARP16,
                stabs: STABS,
                bass: BASS,
                drums: DRUMS_FILL
            },
            // B：C から長調の方へ開く。パッドを敷き、B7 で休憩へ
            B: {
                chords: 'C | D | Bm7 | Em | Am7 | D | G | B7',
                lead: `E5:4 G5:4 C6:8 | D6:6 C6:2 A5:8 | B5:4 D6:4 F#5:8 | G5:6 F#5:2 E5:8 |
                       E5:4 A5:4 C6:8 | D6:6 A5:2 F#5:8 | G5:4 B5:4 D6:8 | B5:4 A5:4 F#5:4 D#5:4`,
                arp: ARP16,
                pad: 'hold',
                bass: BASS,
                drums: DRUMS_FILL
            },
            // 休憩：主旋律を抜いて、シンセが長く歌う。キックを半分、分散和音を4分にゆるめる
            C: {
                chords: 'Em | C | Am7 | B7 | Em | C | Am7 | B7',
                synth: `B5:16 | G5:16 | A5:8 C6:8 | B5:12 r:4 |
                        E5:8 G5:8 | C6:8 G5:8 | A5:8 E5:8 | F#5:8 D#5:8`,
                arp: '0:4 1 2 1',
                pad: 'hold',
                bass: 'R:8 R:8',
                drums: {
                    kick: repeat('x.......x.......', 8, '|'),
                    openHat: OPEN,
                    clap: repeat('................', 7, '|') + '|....x...x.x.xxxx'
                }
            },
            // 最後の A：16分の分散和音とシンセブラスで、B7 から頭の Em へ戻る
            A3: {
                label: "A'",
                chords: CHORDS_LAST,
                lead: THEME_LAST,
                arp: ARP16,
                stabs: STABS,
                bass: BASS,
                drums: DRUMS_FILL
            }
        },
        intro: ['intro'],
        loop: ['A', 'A2', 'B', 'C', 'A3']
    };

    SoundKit.register('catalog', { songs: { racing } });
})();
