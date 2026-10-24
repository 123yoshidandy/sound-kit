/**
 * 曲の一覧：月影の忍び（忍者・和風で緊張感のある速い曲）
 * 都節（みやこぶし）の音階（D Eb G A Bb）で書く。琴（ギター）の8分の刻みと、太鼓（タム）で駆ける
 * A' は尺八（息の多いフルート）が答え、B は高く張りつめる。休憩の C は太鼓と尺八だけ
 */
(function () {
    const { repeat } = SoundKit;

    // A の主題（前半7小節は A' でも同じ）
    const THEME_HEAD = `D5:2 Eb5:2 G5:4 A5:6 r:2 | Bb5:4 A5:2 G5:2 Eb5:8 | D5:2 Eb5:2 G5:4 A5:4 D6:4 | Bb5:6 A5:2 G5:8 |
                        A5:2 Bb5:2 A5:4 G5:4 D5:4 | Eb5:4 G5:4 Bb5:8 | D6:6 Bb5:2 G5:8`;
    const THEME = `${THEME_HEAD} | A5:12 r:4`;
    const CHORDS_A = 'Dm | Eb | Dm | Gm | Dm | Eb | Gm | Gm/A';

    // A' の尺八：主題が伸ばしている所に答える
    const SHAKU_A = 'r:16 | r:8 G4:4 A4:4 | r:16 | r:8 D5:4 Bb4:4 | r:16 | r:8 G4:4 Bb4:4 | r:16 | r:8 D5:4 A4:4';

    // 琴：8分で刻む
    const KOTO = '0:2 1 2 0 1 2 0 1';
    const BASS = 'R:2 R:2 r:2 R:2 R:2 r:2 R:2 R:2';
    // 太鼓：大太鼓（低いタム）と締め太鼓（中のタム）、拍子木（リム）
    const TAIKO = {
        tomLow: repeat('x.....x...x.....', 8, '|'),
        tomMid: repeat('....x.......x.x.', 8, '|'),
        rim: repeat('x.......x.......', 8, '|')
    };
    const TAIKO_FILL = {
        ...TAIKO,
        tomMid: repeat('....x.......x.x.', 7, '|') + '|....x...x.x.xxxx'
    };

    // 忍者：琴の刻みと太鼓、尺八
    const ninja = {
        title: '月影の忍び',
        tags: ['緊張感', '神秘的'],
        genre: 'ワールド',
        melody: ['lead'],
        bpm: 140,
        gain: 0.075,
        reverb: { seconds: 2.2, tone: 0.45 },
        delay: { time: 0.75, feedback: 0.25, tone: 2400, reverb: 0.25 },
        humanize: { time: 0.004, velocity: 0.08 },
        parts: {
            lead: { instrument: 'piano', volume: 0.72, pan: -0.08, decay: 0.7, brightness: 0.85, reverb: 0.22, delay: 0.1 },
            shaku: { instrument: 'flute', volume: 0.43, pan: 0.3, attack: 0.08, release: 0.25, breath: 0.14, vibrato: 18, reverb: 0.4, delay: 0.12 },
            koto: { instrument: 'guitar', mode: 'arp', from: 'D4', brightness: 0.7, gate: 0.8, volume: 0.6, pan: 0.25, reverb: 0.25 },
            bass: { instrument: 'pluck', mode: 'bass', octave: 2, brightness: 0.3, sustain: 0.994, release: 0.08, volume: 1, gate: 0.6 },
            drums: { instrument: 'drums', kit: 'soft', mode: 'drums', volume: 0.75, cutoff: 6000, levels: { tomLow: 0.8, tomMid: 0.55, rim: 0.4 } }
        },
        sections: {
            // イントロ：太鼓がだんだん細かくなり、琴が入る
            intro: {
                label: 'イントロ',
                chords: 'Dm | Dm | Eb | Gm/A',
                koto: { pattern: `r:16 | r:16 | ${KOTO} | ${KOTO}` },
                drums: {
                    tomLow: 'x.......x.......|x...x...x...x...|x.x.x.x.x.x.x.x.|x.x.x.x.x.x.x.x.',
                    tomMid: '................|................|................|xxxxxxxx........'
                }
            },
            A: {
                chords: CHORDS_A,
                lead: THEME,
                koto: KOTO,
                bass: BASS,
                drums: TAIKO
            },
            // A'：尺八が答える
            A2: {
                label: "A'",
                chords: CHORDS_A,
                lead: THEME,
                shaku: SHAKU_A,
                koto: KOTO,
                bass: BASS,
                drums: TAIKO_FILL
            },
            // B：高く張りつめる
            B: {
                chords: 'Gm | Eb | Dm | Dm | Gm | Eb | Bb | Gm/A',
                lead: `G5:4 Bb5:4 D6:8 | Eb6:6 D6:2 Bb5:8 | A5:4 D6:4 A5:8 | G5:4 A5:4 D5:8 |
                       Bb5:4 D6:4 G6:8 | G6:6 Eb6:2 Bb5:8 | D6:4 Bb5:4 D6:8 | A5:16`,
                koto: KOTO,
                shaku: 'D5:16 | Eb5:16 | D5:16 | A4:16 | D5:16 | Eb5:16 | D5:16 | D5:16',
                bass: BASS,
                drums: { ...TAIKO_FILL, rim: repeat('x...x...x...x...', 8, '|') }
            },
            // 休憩：主旋律と琴を抜き、太鼓の上で尺八が長く吹く
            C: {
                chords: 'Dm | Dm | Dm | Dm | Dm | Dm | Dm | Gm/A',
                shaku: 'D5:16 | G5:8 A5:8 | A4:16 | r:16 | A5:16 | G5:8 A5:8 | D5:16 | r:16',
                bass: 'R:16',
                drums: {
                    tomLow: repeat('x.......x.......', 7, '|') + '|x...x...x.x.xxxx',
                    rim: repeat('....x.......x...', 8, '|')
                }
            },
            // 最後の A：尺八が答えたまま、頭へ戻る
            A3: {
                label: 'A',
                chords: CHORDS_A,
                lead: THEME,
                shaku: SHAKU_A,
                koto: KOTO,
                bass: BASS,
                drums: TAIKO_FILL
            }
        },
        intro: ['intro'],
        loop: ['A', 'A2', 'B', 'C', 'A3']
    };

    SoundKit.register('catalog', { songs: { ninja } });
})();
