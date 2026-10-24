/**
 * 曲の一覧：湾岸ハイウェイ（シティポップ・7th と 9th の都会的な和音）
 * 2・4拍目のギターのカッティング、サビのブラスの合いの手、2回目のサビの弦楽器を足す
 */
(function () {
    const { repeat } = SoundKit;

    // A の主題（前半4小節は A' でも同じ）
    const THEME_HEAD = `r:2 F5:2 A5:2 C6:6 A5:2 F5:2 | E5:6 G5:2 C#6:8 | r:2 D5:2 F5:2 A5:6 C6:2 A5:2 | G5:6 Eb5:2 A5:4 C6:4`;
    const THEME = `${THEME_HEAD} |
                   D6:6 C6:2 A5:4 F5:4 | G5:6 E5:2 C#5:8 | D5:4 F5:4 A5:4 C6:4 | A5:12 r:4`;
    // A'：Gm9 → C9 → Fmaj9 と回り、D7 でサビの Gm9 へ
    const THEME_TURN = `${THEME_HEAD} |
                        r:2 D5:2 F5:2 A5:6 G5:2 F5:2 | E5:6 G5:2 Bb5:8 | A5:6 G5:2 E5:8 | F5:4 A5:4 C6:4 A5:4`;
    // サビ：長めの音で 9th を響かせる
    const CHORUS_HEAD = `D6:6 A5:2 F5:8 | G5:6 Bb5:2 D6:8 | C6:6 B5:2 G5:8 | A5:6 F5:2 E5:8 |
                         G5:6 A5:2 D6:4 C6:4 | G5:4 E5:4 Bb5:8 | A5:6 C6:2 G5:8`;
    const CHORUS = `${CHORUS_HEAD} | E5:4 G5:4 C#6:8`;
    // ループの終わり：F7 で、頭の Bbmaj9 へ戻る
    const CHORUS_LAST = `${CHORUS_HEAD} | G5:4 Eb5:4 A5:4 C6:4`;
    const CHORDS_B = 'Gm9 | C9 | Am7 | Dm9 | Gm9 | C9 | Fmaj9';

    // サビの2回目で、ビブラフォンが答える
    const COUNTER = `r:8 A5:4 D6:4 | r:8 E5:4 G5:4 | r:8 E5:4 C6:4 | r:8 A5:4 C6:4 |
                     r:16 | r:8 E5:4 G5:4 | r:8 C6:4 A5:4 | r:16`;

    // エレピの和音（裏で引っかける）と、はねるベース
    const KEYS = 'x-----x---x-----';
    const BASS = 'R:3 R+:1 r:2 5:2 R:3 7:1 r:2 R:2';
    const CHANK = '....x.......x...';
    // サビのブラス：2小節ごとの終わりに
    const HORNS = repeat('................|..........x-.x--', 4, '|');

    const DRUMS = {
        kick: repeat('x.....x...x.....', 8, '|'),
        snare: repeat('....x.......x...', 8, '|'),
        hat: repeat('xoxoxoxoxoxoxoxo', 8, '|')
    };
    const DRUMS_FILL = {
        kick: repeat('x.....x...x.....', 8, '|'),
        snare: repeat('....x.......x...', 7, '|') + '|....x.......x.xx',
        hat: repeat('xoxoxoxoxoxoxoxo', 7, '|') + '|xoxoxoxoxoxo....'
    };

    // シティポップ：エレピの 9th の和音と、16分のハイハット
    const citypop = {
        title: '湾岸ハイウェイ',
        tags: ['おしゃれ', '落ち着いた'],
        genre: 'ロック・ポップ',
        melody: ['lead'],
        bpm: 104,
        gain: 0.094,
        reverb: { seconds: 1.8, tone: 0.5 },
        delay: { time: 0.75, feedback: 0.25, tone: 2400, reverb: 0.2 },
        humanize: { time: 0.004, velocity: 0.08 },
        parts: {
            lead: { instrument: 'piano', volume: 0.68, pan: -0.08, decay: 0.8, brightness: 0.85, reverb: 0.22, delay: 0.12 },
            counter: { instrument: 'vibes', volume: 0.45, pan: 0.3, reverb: 0.3, delay: 0.2 },
            keys: { instrument: 'epiano', mode: 'chords', center: 'E4', voices: 4, volume: 0.26, pan: 0.2, chorus: { depth: 0.002, rate: 0.5, mix: 0.4 }, reverb: 0.2, delay: 0.1 },
            pad: { instrument: 'pad', mode: 'chords', center: 'A3', voices: 3, volume: 0.3, cutoff: 1100, reverb: 0.45 },
            guitar: { instrument: 'guitar', mode: 'chords', center: 'A4', voices: 3, strum: 0.004, volume: 0.5, pan: -0.32, brightness: 0.6, gate: 0.25, reverb: 0.15 },
            horns: { instrument: 'brass', mode: 'chords', center: 'F4', voices: 3, volume: 0.45, pan: 0.3, brightness: 3.5, release: 0.08, reverb: 0.25, delay: 0.06 },
            strings: { instrument: 'strings', mode: 'chords', center: 'A3', voices: 3, volume: 0.36, pan: -0.15, attack: 0.3, release: 0.6, brightness: 0.8, reverb: 0.45 },
            bass: { instrument: 'synthBass', mode: 'bass', octave: 2, volume: 0.85, cutoff: 420, decay: 0.2, sustain: 0.35, release: 0.05, gate: 0.8 },
            drums: { instrument: 'drums', kit: 'soft', mode: 'drums', volume: 0.6, cutoff: 8000, levels: { kick: 0.75, snare: 0.5, hat: 0.3 } }
        },
        sections: {
            intro: {
                label: 'イントロ',
                chords: 'Bbmaj9 | A7 | Dm9 | Cm7:8 F7:8',
                keys: KEYS,
                pad: 'hold',
                bass: { pattern: `r:16 | r:16 | ${BASS} | ${BASS}` },
                drums: {
                    hat: '................|................|xoxoxoxoxoxoxoxo|xoxoxoxoxoxo....',
                    snare: '................|................|................|............x.xx'
                }
            },
            A: {
                chords: 'Bbmaj9 | A7 | Dm9 | Cm7:8 F7:8 | Bbmaj9 | A7 | Dm7 | Dm9',
                lead: THEME,
                keys: KEYS,
                bass: BASS,
                drums: DRUMS
            },
            A2: {
                label: "A'",
                chords: 'Bbmaj9 | A7 | Dm9 | Cm7:8 F7:8 | Gm9 | C9 | Fmaj9 | Dm7:8 D7:8',
                lead: THEME_TURN,
                keys: KEYS,
                guitar: CHANK,
                bass: BASS,
                drums: DRUMS_FILL
            },
            // サビ：ii の Gm9 から。パッドを敷く
            B: {
                chords: `${CHORDS_B} | A7`,
                lead: CHORUS,
                keys: KEYS,
                guitar: CHANK,
                horns: HORNS,
                pad: 'hold',
                bass: BASS,
                drums: DRUMS
            },
            // 休憩：ピアノとキックを抜き、ビブラフォンがゆっくり歌う。D7 でサビへ
            C: {
                chords: 'Bbmaj9 | A7 | Dm9 | Cm7:8 F7:8 | Bbmaj9 | A7 | Dm9 | Am7:8 D7:8',
                counter: `r:4 C6:4 A5:8 | r:4 G5:4 E5:8 | r:4 D6:4 A5:8 | r:4 G5:4 A5:8 |
                          r:4 D6:4 A5:8 | r:4 C#6:4 G5:8 | r:4 C6:4 A5:8 | r:4 E5:4 F#5:8`,
                keys: 'x-------x-------',
                pad: 'hold',
                bass: 'R:6 5:2 R:8',
                drums: { hat: repeat('x.o.x.o.x.o.x.o.', 8, '|'), snare: repeat('................', 7, '|') + '|............x.xx' }
            },
            // サビの2回目：ビブラフォンが答える。F7 で終えて、頭の Bbmaj9 へ戻る
            B2: {
                label: "B'",
                chords: `${CHORDS_B} | Cm7:8 F7:8`,
                lead: CHORUS_LAST,
                counter: COUNTER,
                keys: KEYS,
                guitar: CHANK,
                strings: 'hold',
                bass: BASS,
                drums: DRUMS_FILL
            }
        },
        intro: ['intro'],
        loop: ['A', 'A2', 'B', 'C', 'B2']
    };

    SoundKit.register('catalog', { songs: { citypop } });
})();
