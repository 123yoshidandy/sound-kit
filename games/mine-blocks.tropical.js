/**
 * mine-blocks の BGM の候補：ココナツ・ステップ（スチールパンの明るいカリプソ）
 * ギターの裏拍の刻みに、カリプソのホーン隊（ブラス）の合いの手と、サビの弦楽器を足す
 * 曲の書き方は docs/composing.md にある。長さは16分音符の数で、'|' は小節の区切り
 */

(function () {
    const { repeat } = SoundKit;

    // A の主題（前半4小節は A' でも同じ）
    const THEME_HEAD = `E5:3 G5:3 C6:2 r:2 G5:2 A5:2 G5:2 | E5:4 r:2 C5:2 E5:3 G5:3 A5:2 |
                        F5:3 A5:3 D6:2 r:2 C6:2 A5:2 F5:2 | G5:6 F5:2 D5:4 r:2 B4:2 |
                        E5:3 G5:3 B5:2 r:2 B5:2 A5:2 G5:2`;
    const THEME = `${THEME_HEAD} | A5:4 r:2 E5:2 G5:3 A5:3 C6:2 |
                   D6:3 C6:3 A5:2 r:2 F5:2 A5:2 C6:2 | B5:6 G5:2 D5:4 r:2 D5:1 E5:1`;
    // A' の終わり：A7 で少し色を変え、主音に落ち着く
    const THEME_END = `${THEME_HEAD} | C#6:4 r:2 A5:2 G5:3 E5:3 C#5:2 |
                       D6:3 C6:1 A5:2 F5:2 B5:3 A5:1 G5:2 F5:2 | E5:8 G5:2 E5:2 C5:4`;

    const CHORDS_A = 'C | Am7 | Dm7 | G7 | Em7 | Am7 | Dm7 | G7';
    const CHORDS_A2 = 'C | Am7 | Dm7 | G7 | Em7 | A7 | Dm7:8 G7:8 | C';

    // 低い長い音で答える対旋律（2回目の A で足す）
    const COUNTER = 'E5:8 G5:8 | C5:8 E5:8 | F5:8 D5:8 | D5:8 B4:8 | G5:8 E5:8 | E5:8 C5:8 | D5:8 F5:8 | F5:8 D5:8';

    // カリプソの跳ねるベース
    const BASS = 'R:4 r:2 R:2 5:4 r:2 5:2';
    const SKANK = repeat('..x-..x-..x-..x-', 8, '|');
    // 区間の頭だけで鳴らすシンバル
    const CRASH = 'x...............|' + repeat('................', 7, '|');

    const DRUMS = {
        kick: repeat('x.......x.....x.', 8, '|'),
        rim: repeat('....x..x....x...', 8, '|'),
        shaker: repeat('oxoxoxoxoxoxoxox', 8, '|')
    };
    // 最後の小節にタムを入れて、次の区間へつなぐ
    const DRUMS_FILL = {
        kick: repeat('x.......x.....x.', 7, '|') + '|x.......x.......',
        rim: repeat('....x..x....x...', 7, '|') + '|....x...........',
        tom: repeat('................', 7, '|') + '|..........x.x.xx',
        shaker: repeat('oxoxoxoxoxoxoxox', 8, '|')
    };

    // スチールパンとマリンバ：南の島のように明るく、軽やかに
    const tropical = {
        title: 'ココナツ・ステップ',
        tags: ['明るい', '軽快'],
        genre: 'ワールド',
        melody: ['lead'],   // 主旋律のパート（試聴ページで楽器を替えられる）
        bpm: 112,
        swing: 0.08,
        gain: 0.068,
        reverb: { seconds: 1.8, tone: 0.5 },
        delay: { time: 0.75, feedback: 0.22, tone: 2800 },
        humanize: { time: 0.006, velocity: 0.08 },
        parts: {
            lead: { instrument: 'steelpan', volume: 0.8, pan: -0.12, reverb: 0.22, delay: 0.1 },
            counter: { instrument: 'vibes', volume: 0.8, pan: 0.3, reverb: 0.3 },
            bell: { instrument: 'kalimba', volume: 0.55, pan: 0.2, reverb: 0.3, delay: 0.18 },
            comp: { instrument: 'marimba', mode: 'arp', from: 'C4', volume: 0.42, pan: 0.22, reverb: 0.18, decay: 0.8, brightness: 0.7 },
            // ギター：裏拍で軽くかき鳴らす
            skank: { instrument: 'guitar', mode: 'chords', center: 'G4', voices: 3, strum: 0.006, volume: 0.65, pan: -0.28, brightness: 0.5, sustain: 0.99, gate: 0.8, reverb: 0.15 },
            pad: { instrument: 'pad', mode: 'chords', center: 'F4', voices: 4, volume: 0.4, cutoff: 1000, reverb: 0.4 },
            // 弦楽器：B でパッドに替えて敷く
            strings: { instrument: 'strings', mode: 'chords', center: 'C4', voices: 4, volume: 0.4, pan: 0.15, attack: 0.3, release: 0.5, brightness: 0.8, reverb: 0.4 },
            // ホーン隊：区間の頭と、G7 の小節の後半で短く吹く
            brass: { instrument: 'brass', mode: 'chords', center: 'G4', voices: 3, volume: 0.52, pan: 0.3, brightness: 4, release: 0.08, reverb: 0.25, delay: 0.08 },
            bass: { instrument: 'pluck', mode: 'bass', octave: 2, brightness: 0.4, sustain: 0.994, release: 0.08, volume: 0.9, gate: 0.85 },
            drums: { instrument: 'drums', kit: 'soft', mode: 'drums', volume: 0.7, levels: { kick: 0.75, rim: 0.55, shaker: 0.65, tom: 0.5, crash: 0.35 } }
        },
        sections: {
            intro: {
                label: 'イントロ',
                chords: 'C | F | Dm7 | G7',
                comp: '0:2 1 2 1 3 1 2 1',
                skank: '................|................|..x-..x-..x-..x-|..x-..x-..x-..x-',
                bass: { pattern: 'r:16 | r:16 | R:4 r:2 R:2 5:4 r:2 5:2 | R:4 r:2 R:2 5:4 r:2 5:2' },
                drums: {
                    shaker: repeat('oxoxoxoxoxoxoxox', 4, '|'),
                    rim: '................|................|....x..x....x...|....x..x....x...',
                    tom: '................|................|................|..........x.x.xx'
                }
            },
            A: {
                chords: CHORDS_A,
                lead: THEME,
                comp: '0:2 1 2 1 3 1 2 1',
                bass: BASS,
                drums: DRUMS
            },
            A2: {
                label: "A'",
                chords: CHORDS_A2,
                lead: THEME_END,
                comp: '0:2 1 2 1 3 1 2 1',
                skank: SKANK,
                bass: BASS,
                drums: DRUMS_FILL
            },
            B: {
                chords: 'Fmaj7 | G | Em7 | Am7 | Dm7 | G | Cmaj7 | C7',
                lead: `A5:6 G5:2 E5:4 C5:4 | D5:6 G5:2 B5:4 D6:4 | E6:6 D6:2 B5:4 G5:4 | A5:12 r:2 G5:2 |
                       F5:6 A5:2 D6:4 C6:4 | B5:6 A5:2 G5:4 D5:4 | E5:6 G5:2 B5:4 G5:4 | Bb5:6 G5:2 E5:4 C5:4`,
                comp: '0:2 2 1 2 3 2 1 2',
                skank: SKANK,
                strings: 'hold',
                brass: 'x-----..........|' + repeat('................', 3, '|') + '|x-----..........|' + repeat('................', 3, '|'),
                bass: BASS,
                drums: {
                    crash: CRASH,
                    kick: repeat('x.......x.......', 8, '|'),
                    rim: repeat('....x.......x...', 8, '|'),
                    shaker: repeat('oxoxoxoxoxoxoxox', 8, '|')
                }
            },
            // 休憩：メロディをまばらにし、カリンバが答える。ドラムはシェイカーだけ
            C: {
                chords: 'Fmaj7 | Em7 | Dm7 | Cmaj7 | Fmaj7 | Em7 | Dm7 | Gsus4:8 G7:8',
                lead: `A5:6 G5:2 E5:8 | r:16 | F5:6 E5:2 D5:8 | r:16 |
                       A5:6 C6:2 E6:8 | r:16 | F5:4 A5:4 D6:8 | D6:8 r:4 B4:2 D5:2`,
                bell: 'r:16 | r:4 B5:2 G5:2 E5:4 r:4 | r:16 | r:4 G5:2 E5:2 D5:4 r:4 | r:16 | r:4 E6:2 B5:2 G5:4 r:4 | r:16 | r:16',
                comp: '0:4 1 2 1',
                pad: 'hold',
                bass: 'R:8 5:8',
                drums: { shaker: repeat('o.o.o.o.o.o.o.o.', 8, '|') }
            },
            // A に、ビブラフォンの対旋律と、ホーン隊の合いの手を足す
            A3: {
                label: 'A',
                chords: CHORDS_A,
                lead: THEME,
                counter: COUNTER,
                comp: '0:2 1 2 1 3 1 2 1',
                brass: repeat('................|................|................|..........x-.x--', 2, '|'),
                bass: BASS,
                drums: { ...DRUMS, crash: CRASH }
            },
            // ループの終わり：G7 で終えて、頭の C へ戻る
            A4: {
                label: "A'",
                chords: CHORDS_A,
                lead: `${THEME_HEAD} | A5:4 r:2 E5:2 G5:3 A5:3 C6:2 |
                       D6:3 C6:3 A5:2 r:2 F5:2 A5:2 C6:2 | B5:4 D6:2 B5:2 G5:4 r:2 C5:1 D5:1`,
                counter: COUNTER,
                comp: '0:2 1 2 1 3 1 2 1',
                skank: SKANK,
                bass: BASS,
                drums: DRUMS_FILL
            }
        },
        intro: ['intro'],
        loop: ['A', 'A2', 'B', 'C', 'A3', 'A4']
    };

    SoundKit.register('mine-blocks', { songs: { tropical } });
})();
