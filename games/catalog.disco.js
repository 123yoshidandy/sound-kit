/**
 * 曲の一覧：ミラーボール・ナイト（ディスコ・4つ打ちとオクターブのベース）
 */
(function () {
    const { repeat } = SoundKit;

    // A の主題（前半4小節は A' でも同じ）。裏から入って、はずむ
    const THEME_HEAD = `r:2 D5:2 G5:4 Bb5:4 A5:2 G5:2 | Bb5:6 G5:2 E5:4 r:4 |
                        r:2 D5:2 G5:4 Bb5:4 C6:2 D6:2 | D6:6 C6:2 Bb5:4 r:4`;
    const THEME = `${THEME_HEAD} |
                   r:2 F5:2 G5:4 Bb5:4 A5:2 G5:2 | E5:6 G5:2 Bb5:4 r:4 | G5:4 Bb5:4 D6:8 | C6:6 A5:2 F#5:4 D5:4`;
    // A'：Cm7 → F → Bb と回って、サビの Ebmaj7 へ
    const THEME_TURN = `${THEME_HEAD} |
                        r:2 Eb5:2 G5:4 Bb5:4 G5:2 Eb5:2 | F5:6 A5:2 C6:4 r:4 | D6:6 C6:2 Bb5:4 F5:4 | Bb5:12 r:4`;
    // サビ：長めの音で歌う。D7 で終えて、Gm7 へ戻る
    const CHORUS = `Bb5:6 C6:2 G5:8 | A5:6 C6:2 F5:8 | F5:4 A5:4 C6:8 | Bb5:6 A5:2 G5:8 |
                    G5:4 Bb5:4 C6:8 | C6:6 A5:2 F5:4 A5:4 | D6:6 C6:2 Bb5:8 | A5:6 C6:2 F#5:8`;
    const CHORDS_B = 'Ebmaj7 | F | Dm7 | Gm7 | Cm7 | F | Bb | D7';

    // サビの2回目で、ビブラフォンが答える
    const COUNTER = `r:8 Eb6:4 Bb5:4 | r:8 A5:4 C6:4 | r:8 F5:4 A5:4 | r:8 D6:4 Bb5:4 |
                     r:8 Eb6:4 G5:4 | r:12 C6:4 | r:8 F5:4 D6:4 | r:8 C6:4 A5:4`;

    // オクターブで跳ねるベースと、エレピの裏の刻み
    const BASS = 'R:2 R+:2 R:2 R+:2 R:2 R+:2 R:2 R+:2';
    const KEYS = '..x-..x-..x-..x-';

    const KICK = 'x...x...x...x...';
    const CLAP = '....x.......x...';
    const OPEN = '..x...x...x...x.';
    const DRUMS = { kick: repeat(KICK, 8, '|'), clap: repeat(CLAP, 8, '|'), openHat: repeat(OPEN, 8, '|') };
    const DRUMS_FILL = {
        kick: repeat(KICK, 8, '|'),
        clap: repeat(CLAP, 7, '|') + '|....x.......x.xx',
        openHat: repeat(OPEN, 8, '|')
    };
    // サビ：16分のシェイカーを足す（16分で動くのはこれだけ）
    const DRUMS_CHORUS = {
        kick: repeat(KICK, 8, '|'),
        clap: repeat(CLAP, 7, '|') + '|....x.......x.xx',
        openHat: repeat(OPEN, 8, '|'),
        shaker: repeat('o.ox'.repeat(4), 8, '|')
    };

    // ディスコ：4つ打ちと、オクターブで跳ねるベース
    const disco = {
        title: 'ミラーボール・ナイト',
        tags: ['おしゃれ', '軽快'],
        genre: 'エレクトロ',
        melody: ['lead'],
        bpm: 118,
        gain: 0.09,
        reverb: { seconds: 1.8, tone: 0.5 },
        delay: { time: 0.75, feedback: 0.25, tone: 2400 },
        humanize: { time: 0.003, velocity: 0.07 },
        parts: {
            lead: { instrument: 'piano', volume: 0.62, pan: -0.08, decay: 0.7, brightness: 0.85, reverb: 0.2, delay: 0.12 },
            counter: { instrument: 'vibes', volume: 0.45, pan: 0.3, reverb: 0.3, delay: 0.2 },
            keys: { instrument: 'epiano', mode: 'chords', center: 'D4', voices: 3, volume: 0.5, pan: 0.2, decay: 0.35, release: 0.05, gate: 0.7, reverb: 0.15, chorus: { depth: 0.002, rate: 0.6, mix: 0.35 } },
            strings: { instrument: 'pad', mode: 'chords', center: 'Bb3', voices: 3, volume: 0.32, cutoff: 1400, reverb: 0.4 },
            bass: { instrument: 'synthBass', mode: 'bass', octave: 2, volume: 0.85, cutoff: 420, decay: 0.15, sustain: 0.3, release: 0.04, gate: 0.7 },
            drums: { instrument: 'drums', kit: 'soft', mode: 'drums', volume: 0.6, cutoff: 9000, levels: { kick: 0.75, clap: 0.55, openHat: 0.4, shaker: 0.35 } }
        },
        sections: {
            // イントロ：4つ打ちとベースから入り、D7 で主題へ
            intro: {
                label: 'イントロ',
                chords: 'Gm7 | C7 | Gm7 | D7',
                bass: BASS,
                keys: '................|................|' + KEYS + '|' + KEYS,
                drums: {
                    kick: repeat(KICK, 4, '|'),
                    openHat: repeat(OPEN, 4, '|'),
                    clap: '................|................|' + CLAP + '|....x.......x.xx'
                }
            },
            A: {
                chords: 'Gm7 | C7 | Gm7 | C7 | Gm7 | C7 | Ebmaj7 | D7',
                lead: THEME,
                keys: KEYS,
                bass: BASS,
                drums: DRUMS
            },
            A2: {
                label: "A'",
                chords: 'Gm7 | C7 | Gm7 | C7 | Cm7 | F | Bb | Bb',
                lead: THEME_TURN,
                keys: KEYS,
                bass: BASS,
                drums: DRUMS_FILL
            },
            // サビ：IV の Ebmaj7 から。パッドを敷き、シェイカーを足す
            B: {
                chords: CHORDS_B,
                lead: CHORUS,
                keys: KEYS,
                strings: 'hold',
                bass: BASS,
                drums: DRUMS_CHORUS
            },
            // 休憩：キックとピアノを抜き、パッドとエレピとベースだけ。最後の小節で4つ打ちが戻る
            C: {
                chords: 'Gm7 | C7 | Gm7 | C7 | Ebmaj7 | Ebmaj7 | D7sus4 | D7',
                keys: 'x-----x---x-----',
                strings: 'hold',
                bass: BASS,
                drums: {
                    openHat: repeat(OPEN, 8, '|'),
                    kick: repeat('................', 7, '|') + '|' + KICK,
                    clap: repeat('................', 7, '|') + '|....x.......x.xx'
                }
            },
            // サビの2回目：ビブラフォンが答える。D7 で終えて、頭の Gm7 へ戻る
            B2: {
                label: "B'",
                chords: CHORDS_B,
                lead: CHORUS,
                counter: COUNTER,
                keys: KEYS,
                strings: 'hold',
                bass: BASS,
                drums: DRUMS_CHORUS
            }
        },
        intro: ['intro'],
        loop: ['A', 'A2', 'B', 'C', 'B2']
    };

    SoundKit.register('catalog', { songs: { disco } });
})();
