/**
 * 曲の一覧：青空ドライブ（ポップロック・軽快で明るい）
 * ギターの8分のかき鳴らし、生ドラム風のキット、サビの弦楽器とシンバル、休憩のギターの分散和音
 */
(function () {
    const { repeat } = SoundKit;

    // A の主題（前半4小節は A' でも同じ）
    const THEME_HEAD = `r:2 D5:2 G5:4 B5:6 A5:2 | A5:6 F#5:2 D5:8 |
                        r:2 E5:2 G5:4 B5:6 D6:2 | D6:6 C6:2 G5:8`;
    const THEME = `${THEME_HEAD} |
                   r:2 D5:2 G5:4 B5:6 A5:2 | A5:4 B5:2 A5:2 F#5:8 | E5:6 G5:2 A5:4 C6:4 | A5:6 F#5:2 D5:4 r:4`;
    // A' の後半：Am7 → Bm7 → C と上がって、サビへ向かう
    const THEME_TURN = `${THEME_HEAD} |
                        r:2 C5:2 E5:4 A5:6 G5:2 | F#5:6 A5:2 B5:8 | C6:6 B5:2 G5:4 E5:4 | G5:6 A5:2 F#5:8`;
    // サビ：長めの高い音で歌う
    const CHORUS = `E5:2 G5:2 C6:8 D6:2 C6:2 | A5:6 B5:2 A5:4 F#5:4 | F#5:6 D5:2 B5:8 | G5:6 F#5:2 E5:6 G5:2 |
                    E5:2 G5:2 C6:8 D6:2 C6:2 | D6:6 C6:2 A5:4 F#5:4 | G5:6 A5:2 B5:4 D6:4 | A5:6 G5:2 F#5:4 E5:4`;
    // ループの終わりのサビ：D で終えて、頭の G へ戻る
    const CHORUS_LAST = `E5:2 G5:2 C6:8 D6:2 C6:2 | A5:6 B5:2 A5:4 F#5:4 | F#5:6 D5:2 B5:8 | G5:6 F#5:2 E5:6 G5:2 |
                         E5:2 G5:2 C6:8 D6:2 C6:2 | D6:6 C6:2 A5:4 F#5:4 | G5:6 A5:2 B5:4 D6:4 | C6:4 A5:4 F#5:4 A5:2 C6:2`;

    const CHORDS_A = 'G | D/F# | Em7 | Cadd9 | G | D/F# | Am7 | D';
    const CHORDS_A2 = 'G | D/F# | Em7 | Cadd9 | Am7 | Bm7 | C | D7sus4:8 D:8';
    const CHORDS_B = 'C | D | Bm7 | Em7 | C | D | G/B | D';

    // ビブラフォンの合いの手（2回目の A で、主題の伸ばしている所に足す）
    const COUNTER = 'r:16 | r:8 F#6:4 D6:4 | r:16 | r:8 E6:4 C6:4 | r:16 | r:8 D6:4 A5:4 | r:16 | r:12 A5:2 B5:2';

    // ギターの8分のかき鳴らし（拍の頭を強く）
    const STRUM = 'x.o.x.o.x.o.x.o.';
    // オルガンは裏で短く刻む
    const ORGAN = '..x-..x-..x-..x-';
    const BASS = 'R:2 R:2 R:2 R:2 R:2 R:2 5:2 R:2';

    const KICK = 'x.....x.x.......';
    const SNARE = '....x.......x...';
    const HAT = 'x.o.x.o.x.o.x.o.';
    const DRUMS = { kick: repeat(KICK, 8, '|'), snare: repeat(SNARE, 8, '|'), hat: repeat(HAT, 8, '|') };
    // 最後の小節にタムを入れて、次の区間へつなぐ
    const DRUMS_FILL = {
        kick: repeat(KICK, 7, '|') + '|x.....x.........',
        snare: repeat(SNARE, 7, '|') + '|....x...........',
        tom: repeat('................', 7, '|') + '|........x.x.x.x.',
        hat: repeat(HAT, 7, '|') + '|x.o.x.o.........'
    };
    // サビ：ハイハットを開いて、広げる
    const DRUMS_CHORUS = {
        crash: 'x...............|' + repeat('................', 7, '|'),
        kick: repeat('x.....x.x.....x.', 8, '|'),
        snare: repeat(SNARE, 8, '|'),
        hat: repeat('x.o.x.o.x.o.x...', 8, '|'),
        openHat: repeat('..............x.', 8, '|')
    };

    // ポップロック：はじく弦の刻みとオルガン、はっきりした8ビート
    const poprock = {
        title: '青空ドライブ',
        tags: ['軽快', '明るい'],
        genre: 'ロック・ポップ',
        melody: ['lead'],
        bpm: 128,
        gain: 0.074,
        reverb: { seconds: 1.5, tone: 0.5 },
        delay: { time: 0.75, feedback: 0.22, tone: 2400 },
        humanize: { time: 0.004, velocity: 0.08 },
        parts: {
            lead: { instrument: 'piano', volume: 0.72, pan: -0.08, decay: 0.7, brightness: 0.85, reverb: 0.18, delay: 0.1 },
            counter: { instrument: 'vibes', volume: 0.5, pan: 0.3, reverb: 0.3, delay: 0.15 },
            guitar: { instrument: 'guitar', mode: 'chords', center: 'G3', voices: 3, strum: 0.006, brightness: 0.55, gate: 0.9, volume: 0.6, pan: -0.3, reverb: 0.15 },
            // 休憩の分散和音
            arp: { instrument: 'guitar', mode: 'arp', from: 'G3', brightness: 0.5, volume: 0.6, pan: -0.25, reverb: 0.3, delay: 0.15 },
            strings: { instrument: 'strings', mode: 'chords', center: 'E4', voices: 3, volume: 0.43, pan: 0.15, attack: 0.25, release: 0.5, brightness: 0.8, reverb: 0.4 },
            organ: { instrument: 'organ', mode: 'chords', center: 'D4', voices: 3, vibrato: 4, volume: 0.9, cutoff: 2600, pan: 0.28, gate: 0.7, reverb: 0.22 },
            pad: { instrument: 'organ', mode: 'chords', center: 'D4', voices: 3, vibrato: 4, volume: 0.36, pan: 0.2, reverb: 0.35 },
            bass: { instrument: 'synthBass', mode: 'bass', octave: 2, volume: 0.9, cutoff: 420, decay: 0.2, sustain: 0.4, release: 0.04, gate: 0.85 },
            drums: { instrument: 'drums', kit: 'acoustic', mode: 'drums', volume: 0.6, cutoff: 7500, levels: { kick: 0.85, snare: 0.6, hat: 0.4, openHat: 0.35, tom: 0.5, rim: 0.5, crash: 0.3 } }
        },
        sections: {
            intro: {
                label: 'イントロ',
                chords: 'G | D/F# | Cadd9 | D7sus4:8 D:8',
                guitar: STRUM,
                organ: `................|................|${ORGAN}|${ORGAN}`,
                bass: { pattern: `r:16 | r:16 | ${BASS} | ${BASS}` },
                drums: {
                    hat: repeat(HAT, 4, '|'),
                    kick: '................|................|' + KICK + '|x.....x.........',
                    snare: '................|................|' + SNARE + '|....x...........',
                    tom: '................|................|................|........x.x.x.x.'
                }
            },
            A: {
                chords: CHORDS_A,
                lead: THEME,
                guitar: STRUM,
                organ: ORGAN,
                bass: BASS,
                drums: DRUMS
            },
            A2: {
                label: "A'",
                chords: CHORDS_A2,
                lead: THEME_TURN,
                guitar: STRUM,
                organ: ORGAN,
                bass: BASS,
                drums: DRUMS_FILL
            },
            // サビ：IV から始める。オルガンは伸ばして厚くし、ハイハットを開く
            B: {
                chords: CHORDS_B,
                lead: CHORUS,
                guitar: STRUM,
                pad: 'hold',
                strings: 'hold',
                bass: BASS,
                drums: DRUMS_CHORUS
            },
            // 休憩：ドラムはキックとリムだけ、刻みを4分に。メロディは1小節おきに短く答える
            C: {
                chords: 'Em7 | Cmaj7 | G | D/F# | Em7 | Cmaj7 | Am7 | D7sus4:8 D:8',
                lead: `r:16 | r:4 G5:4 E5:8 | r:16 | r:4 A5:4 F#5:8 |
                       r:16 | r:4 B5:4 G5:8 | r:16 | r:4 G5:4 F#5:4 A5:4`,
                arp: '0:2 1 2 3 2 1 2 1',
                pad: 'hold',
                bass: 'R:6 R:2 5:4 R:4',
                drums: {
                    kick: repeat('x.......x.......', 8, '|'),
                    rim: repeat('....x.......x...', 7, '|') + '|....x.......x.x.',
                    hat: repeat('x...x...x...x...', 8, '|')
                }
            },
            // A に、ビブラフォンの合いの手を足す
            A3: {
                label: 'A',
                chords: CHORDS_A,
                lead: THEME,
                counter: COUNTER,
                guitar: STRUM,
                organ: ORGAN,
                bass: BASS,
                drums: DRUMS_FILL
            },
            // ループの終わりのサビ：合いの手も足す。D で終えて、頭の G へ戻る
            B2: {
                label: "B'",
                chords: CHORDS_B,
                lead: CHORUS_LAST,
                counter: 'r:16 | r:12 D6:4 | r:16 | r:12 B5:4 | r:16 | r:12 D6:4 | r:16 | r:16',
                guitar: STRUM,
                pad: 'hold',
                strings: 'hold',
                bass: BASS,
                drums: {
                    crash: 'x...............|' + repeat('................', 7, '|'),
                    kick: repeat('x.....x.x.....x.', 7, '|') + '|x.....x.........',
                    snare: repeat(SNARE, 7, '|') + '|....x.......x.xx',
                    hat: repeat('x.o.x.o.x.o.x...', 7, '|') + '|x.o.x.o.x.o.....',
                    openHat: repeat('..............x.', 8, '|')
                }
            }
        },
        intro: ['intro'],
        loop: ['A', 'A2', 'B', 'C', 'A3', 'B2']
    };

    SoundKit.register('catalog', { songs: { poprock } });
})();
