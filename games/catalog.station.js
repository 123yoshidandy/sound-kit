/**
 * 曲の一覧：軌道ステーション（エレクトロ・ホ短調で、機械のように冷たく）
 * 柔らかいシンセの分散和音が8分で規則正しく刻み、パッドが和音を薄く敷く。標識灯（ベル）が2小節ごとに光る
 * A' は標識灯とリムを足し、B はハ長調の方へ。ハイハットが16分で細かく動き出す
 * 休憩の C はピアノを抜き、シンセのリードがひとりで漂う。刻みは4分にゆるめる
 */
(function () {
    const { repeat } = SoundKit;

    // A の主題。B で終えて、頭の Em へ戻る
    const THEME = `B5:8 G5:4 E5:4 | E5:8 G5:4 B5:4 | C6:8 A5:4 E5:4 | D6:8 F#5:8 |
                   B5:4 E5:4 G5:8 | D6:8 B5:4 G5:4 | A5:8 F#5:4 D5:4 | E5:8 D#5:4 F#5:4`;
    const CHORDS_A = 'Em | Cmaj7 | Am7 | Bm7 | Em | Cmaj7 | D | Bsus4:8 B:8';

    // B：ハ長調の方へ。B で休憩へ
    const CHORDS_B = 'Cmaj7 | D | Em | Em | Am7 | Bm7 | Cmaj7 | Bsus4:8 B:8';
    const SONG_B = `G5:8 E5:8 | F#5:8 A5:8 | B5:16 | G5:4 A5:4 B5:8 |
                    C6:8 E5:8 | D6:8 A5:8 | G5:4 E5:4 B5:8 | F#5:8 D#5:8`;

    // 休憩：シンセのリードがひとりで漂う。B で頭の Em へ戻る
    const CHORDS_C = 'Em | Cmaj7 | Am7 | Bm7 | Em | Cmaj7 | Am7 | Bsus4:8 B:8';
    const SYNTH_C = `B5:16 | G5:8 E5:8 | A5:8 C6:8 | B5:8 F#5:8 |
                     G5:8 B5:8 | E5:16 | C6:8 A5:8 | E5:8 D#5:8`;

    // 標識灯：2小節ごとに、高い E を1つ
    const BEACON = 'E6:2 r:14 | r:16';
    // シンセの刻み（8分）と、4分で脈打つベース
    const PULSE = '0:2 1 2 0 1 2 0 1';
    const BASS = 'R:4 R:4 R:4 R:4';
    const KICK = repeat('x.......x.......', 8, '|');
    const HAT8 = repeat('..x...x...x...x.', 8, '|');
    const DRUMS = { kick: KICK, hat: HAT8 };
    const DRUMS_RIM = { kick: KICK, hat: HAT8, rim: repeat('....x.......x...', 8, '|') };
    const DRUMS_16 = { kick: KICK, hat: repeat('xoxoxoxoxoxoxoxo', 8, '|'), rim: repeat('....x.......x...', 8, '|') };

    // 宇宙ステーション：冷たいシンセの刻みとパッド
    const station = {
        title: '軌道ステーション',
        tags: ['神秘的', '緊張感'],
        genre: 'エレクトロ',
        melody: ['lead'],
        bpm: 108,
        gain: 0.1,
        reverb: { seconds: 2.6, tone: 0.4 },
        delay: { time: 0.75, feedback: 0.35, tone: 1800, reverb: 0.3 },
        humanize: { time: 0.002, velocity: 0.04 },
        parts: {
            lead: { instrument: 'piano', volume: 0.65, pan: -0.08, decay: 0.85, brightness: 0.75, reverb: 0.25, delay: 0.12 },
            synth: { instrument: 'softLead', volume: 0.56, pan: 0.2, cutoff: 1800, attack: 0.08, release: 0.5, vibrato: 6, reverb: 0.4, delay: 0.3 },
            beacon: { instrument: 'bell', volume: 0.38, pan: 0.4, decay: 1.5, reverb: 0.5, delay: 0.35 },
            pulse: { instrument: 'softLead', mode: 'arp', from: 'B3', volume: 0.42, pan: 0.3, cutoff: 1400, attack: 0.005, release: 0.05, gate: 0.45, vibrato: 0, reverb: 0.2, delay: 0.25 },
            pad: { instrument: 'pad', mode: 'chords', center: 'E4', voices: 4, volume: 0.23, cutoff: 900, attack: 1.2, release: 2, reverb: 0.5, chorus: { depth: 0.003, rate: 0.3, mix: 0.5 } },
            bass: { instrument: 'synthBass', mode: 'bass', octave: 2, cutoff: 360, envelope: 0.7, decay: 0.25, sustain: 0.4, release: 0.05, volume: 0.55, gate: 0.6 },
            drums: { instrument: 'drums', kit: 'soft', mode: 'drums', volume: 0.8, cutoff: 7000, levels: { kick: 0.6, hat: 0.3, rim: 0.35 } }
        },
        sections: {
            // イントロ：パッドと標識灯から、シンセの刻みが入る。B で主題へ
            intro: {
                label: 'イントロ',
                chords: 'Em | Em | Cmaj7 | Bsus4:8 B:8',
                pad: 'hold',
                beacon: BEACON,
                pulse: { pattern: 'r:16 | r:16 | ' + PULSE + ' | ' + PULSE },
                bass: { pattern: 'r:16 | r:16 | r:16 | ' + BASS }
            },
            A: {
                chords: CHORDS_A,
                lead: THEME,
                pulse: PULSE,
                pad: 'hold',
                bass: BASS,
                drums: DRUMS
            },
            // A'：標識灯とリムを足す
            A2: {
                label: "A'",
                chords: CHORDS_A,
                lead: THEME,
                beacon: BEACON,
                pulse: PULSE,
                pad: 'hold',
                bass: BASS,
                drums: DRUMS_RIM
            },
            // B：ハ長調の方へ。ハイハットが16分で動き出す。B で休憩へ
            B: {
                chords: CHORDS_B,
                lead: SONG_B,
                pulse: PULSE,
                pad: 'hold',
                bass: BASS,
                drums: DRUMS_16
            },
            // 休憩：ピアノとリムを抜き、シンセのリードが漂う。刻みは4分に。B で頭の Em へ戻る
            C: {
                chords: CHORDS_C,
                synth: SYNTH_C,
                beacon: BEACON,
                pulse: '0:4 1 2 1',
                pad: 'hold',
                bass: 'R:8 R:8',
                drums: { kick: KICK }
            },
            // 最後の A'：標識灯と16分のハイハットで締め、B で頭の Em へ戻る
            A3: {
                label: "A'",
                chords: CHORDS_A,
                lead: THEME,
                beacon: BEACON,
                pulse: PULSE,
                pad: 'hold',
                bass: BASS,
                drums: DRUMS_16
            }
        },
        intro: ['intro'],
        loop: ['A', 'A2', 'B', 'C', 'A3']
    };

    SoundKit.register('catalog', { songs: { station } });
})();
