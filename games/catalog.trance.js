/**
 * 曲の一覧：銀河を渡る光（トランス・イ短調で、軽快に、少し神秘的に）
 * 4つ打ちのキックと裏拍のオープンハイハットに、柔らかいシンセが分散和音を転がし、パッドを薄く敷く
 * A は分散和音を8分で、A' から16分に上げて走る。B は Fmaj の方から上がっていき、弦を伸ばして盛り上げ、E で次へ渡す
 * 休憩の C はキックとピアノを抜き、シンセがひとりで歌う。最後の小節でスネアを細かくして、A へ戻る
 */
(function () {
    const { repeat } = SoundKit;

    // A の主題：Am → F → C → G を2回
    const THEME = `E5:4 A5:4 C6:6 B5:2 | A5:6 G5:2 F5:4 C5:4 | E5:4 G5:4 C6:4 D6:4 | B5:8 G5:4 D5:4 |
                   E5:4 A5:4 C6:6 D6:2 | C6:6 A5:2 F5:8 | G5:6 E5:2 C6:4 B5:4 | D6:8 B5:4 G5:4`;
    const CHORDS_A = 'Am | F | C | G | Am | F | C | G';

    // B：F から上がっていき、E で次へ
    const CHORDS_B = 'F | G | Em | Am | F | G | Esus4:8 E:8 | E';
    const SONG_B = `A5:8 C6:8 | B5:8 D6:8 | E5:4 G5:4 B5:8 | C6:8 A5:8 |
                    C6:6 D6:2 C6:4 A5:4 | D6:6 B5:2 G5:8 | A5:8 G#5:8 | B5:8 G#5:4 E5:4`;

    // 休憩：シンセがひとりで歌う。E で最後の A へ
    const CHORDS_C = 'Am | F | C | G | Am | F | Dm | E';
    const SYNTH_C = `A5:8 E5:8 | F5:8 A5:8 | G5:8 E5:8 | D5:8 G5:8 |
                     C6:8 A5:8 | A5:8 C6:8 | D6:8 A5:8 | B5:8 G#5:8`;

    // 分散和音：A は8分、A' と B は16分
    const ARP8 = '0:2 1 2 3 2 1 2 1';
    const ARP16 = '0:1 1 2 3 4 3 2 1 0 1 2 3 2 1 2 3';
    // ベースは裏拍で
    const BASS = 'r:2 R:2 r:2 R:2 r:2 R:2 r:2 5:2';

    const KICK = repeat('x...x...x...x...', 8, '|');
    const CLAP = repeat('....x.......x...', 8, '|');
    const OPEN = repeat('..x...x...x...x.', 8, '|');
    const DRUMS = { kick: KICK, clap: CLAP, openHat: OPEN };
    // 最後の小節でスネアを細かくして、次の区間へ
    const DRUMS_FILL = {
        kick: KICK,
        clap: CLAP,
        openHat: OPEN,
        snare: repeat('................', 7, '|') + '|........x.x.xxxx'
    };
    const DRUMS_B = { ...DRUMS_FILL, crash: 'x...............|' + repeat('................', 7, '|') };

    // トランス：4つ打ちと、走る分散和音、薄いパッド
    const trance = {
        title: '銀河を渡る光',
        tags: ['軽快', '神秘的'],
        genre: 'エレクトロ',
        melody: ['lead'],
        bpm: 136,
        gain: 0.1,
        reverb: { seconds: 2.4, tone: 0.5 },
        delay: { time: 0.75, feedback: 0.3, tone: 2400, reverb: 0.25 },
        humanize: { time: 0.002, velocity: 0.04 },
        parts: {
            lead: { instrument: 'piano', volume: 0.6, pan: -0.08, decay: 0.8, brightness: 0.9, reverb: 0.22, delay: 0.15 },
            // 休憩の C で歌うシンセ
            synth: { instrument: 'softLead', volume: 0.63, pan: 0.15, cutoff: 2000, vibrato: 10, attack: 0.05, release: 0.3, reverb: 0.35, delay: 0.3 },
            arp: { instrument: 'softLead', mode: 'arp', from: 'A3', volume: 0.35, pan: 0.25, cutoff: 1700, attack: 0.005, release: 0.06, gate: 0.5, vibrato: 0, reverb: 0.2, delay: 0.25 },
            pad: { instrument: 'pad', mode: 'chords', center: 'E4', voices: 3, volume: 0.25, cutoff: 1200, pan: -0.2, reverb: 0.45 },
            // B で盛り上げる弦
            strings: { instrument: 'strings', mode: 'chords', center: 'E4', voices: 3, volume: 0.6, pan: 0.2, attack: 0.3, release: 0.6, brightness: 0.8, reverb: 0.4 },
            bass: { instrument: 'synthBass', mode: 'bass', octave: 2, cutoff: 420, envelope: 2.5, decay: 0.2, sustain: 0.4, release: 0.04, volume: 0.45, gate: 0.7 },
            drums: { instrument: 'drums', kit: 'soft', mode: 'drums', volume: 0.67, cutoff: 8000, levels: { kick: 0.7, clap: 0.45, openHat: 0.45, snare: 0.4, crash: 0.35 } }
        },
        sections: {
            // イントロ：パッドと分散和音から、キックが入る。G で主題へ
            intro: {
                label: 'イントロ',
                chords: 'Am | F | C | G',
                arp: ARP8,
                pad: 'hold',
                bass: { pattern: `r:16 | r:16 | ${BASS} | ${BASS}` },
                drums: {
                    kick: '................|................|' + repeat('x...x...x...x...', 2, '|'),
                    snare: '................|................|................|........x.x.xxxx'
                }
            },
            A: {
                chords: CHORDS_A,
                lead: THEME,
                arp: ARP8,
                bass: BASS,
                drums: DRUMS
            },
            // A'：分散和音を16分に上げ、パッドを敷く
            A2: {
                label: "A'",
                chords: CHORDS_A,
                lead: THEME,
                arp: ARP16,
                pad: 'hold',
                bass: BASS,
                drums: DRUMS_FILL
            },
            // B：上がっていく。弦を伸ばして盛り上げ、E で休憩へ
            B: {
                chords: CHORDS_B,
                lead: SONG_B,
                arp: ARP16,
                pad: 'hold',
                strings: 'hold',
                bass: BASS,
                drums: DRUMS_B
            },
            // 休憩：キックとピアノを抜き、シンセが歌う。分散和音は4分にゆるめる
            C: {
                chords: CHORDS_C,
                synth: SYNTH_C,
                arp: '0:4 1 2 1',
                pad: 'hold',
                bass: 'R:16',
                drums: {
                    openHat: OPEN,
                    snare: repeat('................', 6, '|') + '|....x.......x...|x...x...x.x.xxxx'
                }
            },
            // A：16分の分散和音とパッド
            A3: {
                label: "A'",
                chords: CHORDS_A,
                lead: THEME,
                arp: ARP16,
                pad: 'hold',
                bass: BASS,
                drums: DRUMS_FILL
            },
            // 最後の B'：E で止めて、頭の Am へ戻る
            B2: {
                label: "B'",
                chords: CHORDS_B,
                lead: SONG_B,
                arp: ARP16,
                pad: 'hold',
                strings: 'hold',
                bass: BASS,
                drums: DRUMS_B
            }
        },
        intro: ['intro'],
        loop: ['A', 'A2', 'B', 'C', 'A3', 'B2']
    };

    SoundKit.register('catalog', { songs: { trance } });
})();
