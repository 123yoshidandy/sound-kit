/**
 * 曲の一覧：星の海（宇宙・ホ長調のリディアンで、ゆっくり浮かぶ）
 * リディアンの A#（F#/E の和音）で浮遊感を出す。ベルの分散和音と、パッド・合唱で包む
 * B はホ長調の外の C・D へ移って、不思議な色にする。休憩の C は主旋律を抜き、ビブラフォンが長い音で歌う
 */
(function () {
    const { repeat } = SoundKit;

    // A の主題（前半6小節は A' でも同じ）。長い音で、ゆっくり
    const THEME_HEAD = `B4:4 E5:4 G#5:8 | A#5:6 G#5:2 F#5:8 | B5:4 G#5:4 D#6:8 | C#6:6 A#5:2 F#5:8 |
                        E5:4 G#5:4 B5:8 | A#5:6 C#6:2 F#5:8`;
    const THEME = `${THEME_HEAD} | C#6:4 B5:4 E5:8 | F#5:12 r:4`;
    // A' の終わり：B で止めて、B の C へ
    const THEME_TURN = `${THEME_HEAD} | E6:6 C#6:2 A5:8 | B5:12 r:4`;

    // 主旋律が E を鳴らす小節と、A の小節は add9 にする（長7度が、主旋律と半音でぶつかる）
    const CHORDS_A = 'Eadd9 | F#/E | Emaj7 | F#/E | C#m7 | F# | Aadd9 | B7sus4';
    const CHORDS_A2 = 'Eadd9 | F#/E | Emaj7 | F#/E | C#m7 | F# | Aadd9 | Bsus4:8 B:8';

    // ベルの分散和音（8分）
    const BELLS = '0:2 1 2 3 2 1 2 1';
    const BELLS_SLOW = '0:4 2 1 3';

    // 星の海：ベルの分散和音と、パッドと合唱
    const space = {
        title: '星の海',
        tags: ['神秘的', '落ち着いた'],
        genre: 'アンビエント',
        melody: ['lead'],
        bpm: 80,
        gain: 0.08,
        reverb: { seconds: 4, tone: 0.4 },
        delay: { time: 0.75, feedback: 0.4, tone: 2000, reverb: 0.4 },
        humanize: { time: 0.008, velocity: 0.08 },
        parts: {
            lead: { instrument: 'piano', volume: 0.75, pan: -0.1, decay: 1.4, release: 0.6, brightness: 0.75, reverb: 0.35, delay: 0.25 },
            bells: { instrument: 'bell', mode: 'arp', from: 'B4', volume: 0.35, pan: 0.3, decay: 1.5, reverb: 0.4, delay: 0.3, autopan: { rate: 0.15, depth: 0.3 } },
            vibes: { instrument: 'vibes', volume: 0.6, pan: -0.2, tremolo: 3, reverb: 0.45, delay: 0.3 },
            pad: { instrument: 'pad', mode: 'chords', center: 'E4', voices: 4, volume: 0.28, cutoff: 900, attack: 1.5, release: 2.5, reverb: 0.5, chorus: { depth: 0.003, rate: 0.3, mix: 0.5 } },
            choir: { instrument: 'choir', mode: 'chords', center: 'E4', voices: 3, volume: 0.25, pan: 0.15, attack: 1.2, release: 1.5, reverb: 0.6 },
            bass: { instrument: 'synthBass', mode: 'bass', octave: 2, wave: 'triangle', cutoff: 220, envelope: 0.3, decay: 2, sustain: 0.8, release: 0.8, volume: 0.4, gate: 0.97 },
            drums: { instrument: 'drums', kit: 'soft', mode: 'drums', volume: 0.7, cutoff: 5000, levels: { kick: 0.5, shaker: 0.45 } }
        },
        sections: {
            // イントロ：パッドとベルだけで始める
            intro: {
                label: 'イントロ',
                chords: 'Emaj7 | F#/E | Emaj7 | B7sus4',
                pad: 'hold',
                bells: BELLS_SLOW,
                bass: { pattern: 'r:16 | r:16 | R:16 | R:16' }
            },
            A: {
                chords: CHORDS_A,
                lead: THEME,
                bells: BELLS_SLOW,
                pad: 'hold',
                bass: 'R:16'
            },
            // A'：ベルを8分にし、ごく薄いシェイカーを足す
            A2: {
                label: "A'",
                chords: CHORDS_A2,
                lead: THEME_TURN,
                bells: BELLS,
                pad: 'hold',
                bass: 'R:16',
                drums: { shaker: repeat('o.......o.......', 8, '|') }
            },
            // B：ホ長調の外の C・D へ移る。合唱を敷き、キックを1拍目に置く。B7 で戻る
            B: {
                chords: 'Cmaj7 | D/C | Cmaj7 | D/C | Am7 | Bm7 | Cmaj7 | B7sus4:8 B7:8',
                lead: `E5:4 G5:4 B5:8 | F#5:6 A5:2 D6:8 | G5:4 B5:4 E6:8 | D6:6 A5:2 F#5:8 |
                       C6:6 A5:2 E5:8 | D5:4 F#5:4 B5:8 | G5:6 B5:2 E6:8 | E6:8 D#6:8`,
                bells: BELLS,
                pad: 'hold',
                choir: 'hold',
                bass: 'R:12 5:4',
                drums: {
                    kick: repeat('x...............', 8, '|'),
                    shaker: repeat('o...o...o...o...', 8, '|')
                }
            },
            // 休憩：主旋律を抜き、ビブラフォンが長い音で歌う。合唱だけを敷く
            C: {
                chords: 'Emaj7 | C#m7 | Aadd9 | B7sus4 | Emaj7 | C#m7 | Aadd9 | B7sus4',
                vibes: 'G#5:8 B5:8 | E5:16 | C#6:8 A5:8 | F#5:16 | B5:8 G#5:8 | E6:16 | C#6:8 E6:8 | B5:16',
                bells: BELLS_SLOW,
                choir: 'hold',
                bass: 'R:16'
            }
        },
        intro: ['intro'],
        loop: ['A', 'A2', 'B', 'C']
    };

    SoundKit.register('catalog', { songs: { space } });
})();
