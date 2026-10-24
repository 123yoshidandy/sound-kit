/**
 * 曲の一覧：夕焼けのレトロフューチャー（シンセウェーブ・イ短調で、ゆったり走る）
 * 8分で脈打つシンセベースと、エコーの長いシンセの分散和音。2拍目と4拍目は、スネアとクラップを重ねた大きな音
 * A' はパッドを敷いて分散和音を16分に上げ、B は長調の方へ開いてシンセブラスが吹く。休憩の C はシンセが長く歌う
 * 区間の終わりは、80年代らしく高いタムから低いタムへ下りるフィル
 */
(function () {
    const { repeat } = SoundKit;

    // A の主題（7小節目まで共通）。長い音で、夕焼けを眺めるように
    const THEME = `E5:4 A5:4 C6:6 B5:2 | A5:8 F5:4 C5:4 | E5:4 G5:4 C6:6 D6:2 | B5:8 G5:4 D5:4 |
                   E5:4 A5:4 C6:6 B5:2 | A5:4 F5:4 C6:8 | D6:6 C6:2 A5:8 | A5:8 G#5:8`;
    const CHORDS_A = 'Am | F | C | G | Am | F | Dm7 | Esus4:8 E:8';

    // 分散和音：A は8分、A' と最後の A は16分
    const ARP8 = '0:2 1 2 3 2 1 2 1';
    const ARP16 = '0:1 1 2 3 4 3 2 1 0 1 2 3 4 3 2 1';
    // ベース：8分で脈打つ
    const BASS = 'R:2 R R R R R R R+';
    // シンセブラス：B の小節の頭で
    const STABS = repeat('x-----..x-......', 8, '|');

    const KICK = repeat('x.......x.......', 8, '|');
    const SNARE = repeat('....x.......x...', 8, '|');
    const HAT = repeat('x.x.x.x.x.x.x.x.', 8, '|');
    // 終わりの小節：高いタムから低いタムへ下りる
    const TOMS = {
        tomHigh: repeat('................', 7, '|') + '|........x.x.....',
        tomMid: repeat('................', 7, '|') + '|............x...',
        tomLow: repeat('................', 7, '|') + '|..............x.'
    };
    const DRUMS = { kick: KICK, snare: SNARE, clap: SNARE, hat: HAT, ...TOMS };

    // シンセウェーブ：脈打つベースと、大きなスネア
    const synthwave = {
        title: '夕焼けのレトロフューチャー',
        tags: ['おしゃれ', '神秘的'],
        genre: 'エレクトロ',
        melody: ['lead'],
        bpm: 104,
        gain: 0.095,
        reverb: { seconds: 2.4, tone: 0.45 },
        delay: { time: 0.75, feedback: 0.35, tone: 2000, reverb: 0.3 },
        humanize: { time: 0.002, velocity: 0.04 },
        parts: {
            lead: { instrument: 'piano', volume: 0.68, pan: -0.05, decay: 0.9, brightness: 0.85, reverb: 0.25, delay: 0.15 },
            synth: { instrument: 'softLead', volume: 0.5, pan: 0.15, cutoff: 1800, attack: 0.05, release: 0.4, vibrato: 10, reverb: 0.35, delay: 0.3 },
            arp: { instrument: 'softLead', mode: 'arp', from: 'A3', volume: 0.42, pan: 0.3, cutoff: 1500, attack: 0.005, release: 0.06, gate: 0.5, vibrato: 0, reverb: 0.2, delay: 0.3 },
            stabs: { instrument: 'brass', mode: 'chords', center: 'E4', voices: 3, volume: 0.57, pan: -0.25, brightness: 3, release: 0.1, reverb: 0.3 },
            pad: { instrument: 'pad', mode: 'chords', center: 'E4', voices: 3, volume: 0.28, pan: -0.15, cutoff: 1300, reverb: 0.45, chorus: { depth: 0.003, rate: 0.4, mix: 0.4 } },
            bass: { instrument: 'synthBass', mode: 'bass', octave: 2, cutoff: 380, envelope: 2, decay: 0.18, sustain: 0.35, release: 0.04, volume: 0.6, gate: 0.65 },
            drums: { instrument: 'drums', kit: 'soft', mode: 'drums', volume: 0.75, cutoff: 7500, reverb: 0.3, levels: { kick: 0.7, snare: 0.5, clap: 0.35, hat: 0.3, tomHigh: 0.5, tomMid: 0.55, tomLow: 0.6 } }
        },
        sections: {
            // イントロ：パッドと分散和音で夜明けのように始め、3小節目でベース。E で主題へ
            intro: {
                label: 'イントロ',
                chords: 'Am | F | Dm7 | Esus4:8 E:8',
                pad: 'hold',
                arp: ARP8,
                bass: { pattern: `r:16 | r:16 | ${BASS} | ${BASS}` },
                drums: {
                    kick: '................|................|x.......x.......|x.......x.......',
                    tomHigh: '................|................|................|........x.x.....',
                    tomMid: '................|................|................|............x...',
                    tomLow: '................|................|................|..............x.'
                }
            },
            A: {
                chords: CHORDS_A,
                lead: THEME,
                arp: ARP8,
                bass: BASS,
                drums: DRUMS
            },
            // A'：パッドを敷き、分散和音を16分に
            A2: {
                label: "A'",
                chords: CHORDS_A,
                lead: THEME,
                arp: ARP16,
                pad: 'hold',
                bass: BASS,
                drums: DRUMS
            },
            // B：F から長調の方へ開き、シンセブラスが吹く。E で休憩へ
            B: {
                chords: 'F | G | Em7 | Am | F | G | Am:8 G:8 | E',
                lead: `C6:6 A5:2 F5:8 | D6:6 B5:2 G5:8 | B5:4 G5:4 E5:8 | C6:6 B5:2 A5:8 |
                       F5:4 A5:4 C6:8 | D6:4 B5:4 G5:8 | E5:4 A5:4 B5:4 D6:4 | B5:8 G#5:4 E5:4`,
                arp: ARP8,
                stabs: STABS,
                pad: 'hold',
                bass: BASS,
                drums: { ...DRUMS, crash: 'x...............|' + repeat('................', 7, '|') }
            },
            // 休憩：ピアノとドラムを抜き、シンセが長く歌う。ベースは伸ばし、分散和音は4分に
            C: {
                chords: 'Am | F | C | G | Am | F | Dm7 | E',
                synth: `C6:16 | A5:16 | G5:16 | B5:16 |
                        C6:8 E5:8 | F5:8 A5:8 | F5:8 D5:8 | E5:8 G#5:8`,
                arp: '0:4 1 2 1',
                pad: 'hold',
                bass: 'R:16',
                drums: { hat: repeat('................', 4, '|') + '|' + repeat('x.x.x.x.x.x.x.x.', 4, '|'), ...TOMS }
            },
            // 最後の A：16分の分散和音とパッドで。E で頭の Am へ戻る
            A3: {
                label: "A'",
                chords: CHORDS_A,
                lead: THEME,
                arp: ARP16,
                pad: 'hold',
                stabs: repeat('x-----..........', 8, '|'),
                bass: BASS,
                drums: DRUMS
            }
        },
        intro: ['intro'],
        loop: ['A', 'A2', 'B', 'C', 'A3']
    };

    SoundKit.register('catalog', { songs: { synthwave } });
})();
