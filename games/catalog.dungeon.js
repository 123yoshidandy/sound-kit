/**
 * 曲の一覧：地下水脈の迷宮（ゲームのダンジョン曲・暗く神秘的）
 * 遠くの合唱と、低い弦の対旋律、こもったホルンで、洞窟の奥行きを出す
 */
(function () {
    const { repeat } = SoundKit;

    // A の主題（前半6小節は A' でも同じ）。ゆっくり、下りてくる線
    const THEME_HEAD = `G5:8 Eb5:4 C5:4 | C6:8 Bb5:4 Ab5:4 | Ab5:8 G5:4 F5:4 | F5:8 D5:4 B4:4 |
                        C5:4 Eb5:4 G5:8 | Ab5:6 G5:2 Eb5:8`;
    const THEME = `${THEME_HEAD} | F5:8 Ab5:4 C6:4 | B5:8 G5:4 F5:4`;
    // A'：Fm に戻して、低い方へ沈んでから頭の Cm へ
    const THEME_END = `${THEME_HEAD} | Ab5:6 G5:2 F5:8 | D5:8 B4:4 D5:4`;

    // ベルのしずく（A' で、主題の伸ばしている所に足す）
    const DROPS = `r:4 C6:4 r:8 | r:4 Eb6:4 r:8 | r:4 C6:4 r:8 | r:4 B5:4 r:8 |
                   r:4 C6:4 r:8 | r:4 Eb6:4 r:8 | r:4 C6:4 r:8 | r:4 B5:4 r:8`;

    // 低い弦の対旋律（A' で、主題の下をゆっくり動く）
    const CELLO = 'Eb4:16 | Eb4:8 C4:8 | C4:16 | B3:8 D4:8 | Eb4:8 G4:8 | Ab4:8 Eb4:8 | F4:8 C4:8 | D4:8 B3:8';

    // カリンバの8分の分散和音（上下に揺れる）
    const ARP = '0:2 2 1 3 0 2 1 3';
    const ARP_SLOW = '0:4 2 1 3';

    // 心音のようなキックと、3拍目のリム
    const DRUMS = {
        kick: repeat('x.........x.....', 8, '|'),
        rim: repeat('........x.......', 8, '|'),
        shaker: repeat('..o...o...o...o.', 8, '|')
    };

    // ダンジョン：カリンバとパッド、遠くで落ちるしずく
    const dungeon = {
        title: '地下水脈の迷宮',
        tags: ['神秘的'],
        genre: 'ゲーム音楽',
        melody: ['lead'],
        bpm: 84,
        gain: 0.069,
        reverb: { seconds: 3.2, tone: 0.35 },
        delay: { time: 0.75, feedback: 0.35, tone: 1800, reverb: 0.3 },
        humanize: { time: 0.006, velocity: 0.08 },
        parts: {
            lead: { instrument: 'piano', volume: 0.95, pan: -0.08, decay: 1, brightness: 0.7, reverb: 0.3, delay: 0.15 },
            bell: { instrument: 'bell', volume: 0.57, pan: 0.35, reverb: 0.45, delay: 0.35 },
            arp: { instrument: 'kalimba', mode: 'arp', from: 'C4', volume: 0.45, pan: 0.25, reverb: 0.3, delay: 0.15 },
            pad: { instrument: 'pad', mode: 'chords', center: 'G3', voices: 3, volume: 0.4, cutoff: 800, attack: 1.2, reverb: 0.5 },
            // 遠くの合唱：イントロと B に薄く敷く
            choir: { instrument: 'choir', mode: 'chords', center: 'Eb4', voices: 3, volume: 0.25, pan: -0.2, attack: 0.8, release: 1, vibrato: 8, reverb: 0.6 },
            // 低い弦の対旋律
            cello: { instrument: 'strings', volume: 0.5, pan: -0.3, attack: 0.4, release: 0.5, brightness: 0.6, reverb: 0.45 },
            // こもったホルン：B の区切りで、弱く和音を伸ばす
            horn: { instrument: 'brass', mode: 'chords', center: 'G3', voices: 3, volume: 0.5, pan: 0.2, brightness: 2.5, attack: 0.12, release: 0.5, reverb: 0.5 },
            bass: { instrument: 'synthBass', mode: 'bass', octave: 2, volume: 0.85, cutoff: 260, decay: 0.8, sustain: 0.5, release: 0.3, gate: 0.95 },
            drums: { instrument: 'drums', kit: 'soft', mode: 'drums', volume: 0.72, cutoff: 6000, levels: { kick: 0.85, rim: 0.4, shaker: 0.3, tom: 0.5, crash: 0.3 } }
        },
        sections: {
            // イントロ：パッドと低いベースだけで始め、遠くの合唱が重なり、後半でカリンバが入る
            intro: {
                label: 'イントロ',
                chords: 'Cm | Ab | Fm | G7',
                pad: 'hold',
                choir: 'hold',
                arp: { pattern: `r:16 | r:16 | ${ARP} | ${ARP}` },
                bass: 'R:16'
            },
            A: {
                chords: 'Cm | Ab | Fm | G7 | Cm | Ab | Dm7b5 | G7',
                lead: THEME,
                arp: ARP,
                bass: 'R:12 5:4',
                // 終わりにタムを入れて、B へ渡す
                drums: { ...DRUMS, tom: repeat('................', 7, '|') + '|..........x.x.x.' }
            },
            // B：Bb の方へ明るく寄り道して、高めの音で歌う。パッドと合唱を足し、区切りでホルンが伸ばす
            B: {
                chords: 'Ab | Bb | Gm | Cm | Ab | Bb | Ebmaj7 | G7',
                lead: `C6:8 Ab5:4 Eb5:4 | D6:8 Bb5:4 F5:4 | Bb5:8 G5:4 D5:4 | Eb5:4 G5:4 C6:8 |
                       C6:8 Bb5:4 Ab5:4 | D6:6 C6:2 Bb5:8 | G5:8 Bb5:4 D6:4 | B5:8 G5:4 F5:4`,
                arp: ARP,
                pad: 'hold',
                choir: 'hold',
                horn: repeat('................', 3, '|') + '|o-----------....|' + repeat('................', 3, '|') + '|o-----------....',
                bass: 'R:12 5:4',
                drums: {
                    crash: 'x...............|' + repeat('................', 7, '|'),
                    kick: repeat('x.........x.....', 8, '|'),
                    rim: repeat('....x.......x...', 7, '|') + '|....x.......x.x.',
                    shaker: repeat('..o...o...o...o.', 8, '|')
                }
            },
            // 休憩：メロディとドラムを抜き、ベルのしずくだけが落ちる。分散和音はゆっくり
            C: {
                chords: 'Cm | Cm | Ab | Ab | Fm | Fm | G7sus4 | G7',
                bell: `r:8 G5:4 Eb6:4 | r:16 | r:8 C6:4 Ab5:4 | r:16 |
                       r:8 F5:4 C6:4 | r:16 | r:8 D6:4 C6:4 | r:8 B5:4 G5:4`,
                arp: ARP_SLOW,
                pad: 'hold',
                bass: 'R:16',
                drums: {
                    kick: repeat('................', 6, '|') + '|x.........x.....|x.........x.....'
                }
            },
            // A に、ベルのしずくと低い弦の対旋律を足す。G7 で終えて、頭の Cm へ戻る
            A2: {
                label: "A'",
                chords: 'Cm | Ab | Fm | G7 | Cm | Ab | Fm | G7',
                lead: THEME_END,
                bell: DROPS,
                cello: CELLO,
                arp: ARP,
                pad: 'hold',
                bass: 'R:12 5:4',
                drums: {
                    kick: repeat('x.........x.....', 8, '|'),
                    rim: repeat('........x.......', 8, '|'),
                    shaker: repeat('..o...o...o...o.', 8, '|'),
                    tom: repeat('................', 7, '|') + '|..........x...x.'
                }
            }
        },
        intro: ['intro'],
        loop: ['A', 'B', 'C', 'A2']
    };

    SoundKit.register('catalog', { songs: { dungeon } });
})();
