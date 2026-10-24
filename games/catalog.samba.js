/**
 * 曲の一覧：カーニバルの坂道（サンバ・ト長調で、はずむ）
 * カヴァキーニョ（高めのギター）のはねる刻みと、スルド（低いタム。2拍目と4拍目が強い）・タンボリン（リム）・ガンザ（シェイカー）
 * A' はブラスが答え、B は ii-V で流れる。休憩の C は打楽器とフルートだけにする
 */
(function () {
    const { repeat } = SoundKit;

    // A の主題（前半7小節は A' でも同じ）。裏から入って、跳ねる
    const THEME_HEAD = `r:2 D5:2 G5:3 B5:3 D6:6 | D6:3 B5:3 G5:2 E5:8 | r:2 E5:2 A5:3 C6:3 E6:6 | D6:3 C6:3 A5:2 F#5:8 |
                        r:2 D5:2 G5:3 B5:3 D6:6 | E6:3 D6:3 B5:2 G#5:8 | A5:4 C6:4 F#5:4 A5:4`;
    const THEME = `${THEME_HEAD} | G5:12 r:4`;
    // ループの終わり：D7 で止めて、頭の G へ戻る
    const THEME_LAST = `${THEME_HEAD} | D6:8 C6:4 A5:4`;
    const CHORDS_A = 'G | Em7 | Am7 | D7 | G | E7 | Am7:8 D7:8 | G';
    const CHORDS_LAST = 'G | Em7 | Am7 | D7 | G | E7 | Am7:8 D7:8 | D7';

    // A' のブラス：主題が伸ばしている所（偶数の小節の後半）に答える
    const HORNS = repeat('................|..........x-.x--', 4, '|');

    // カヴァキーニョ：16分の裏を混ぜて、はねる
    const CAVACO = 'x.x..x.x.x..x.x.';
    const BASS = 'R:4 5:4 R:4 5:4';
    // スルド（1拍目と3拍目は軽く、2拍目と4拍目を強く）・タンボリン・ガンザ
    const BATUCADA = {
        tomLow: repeat('o...x...o...x...', 8, '|'),
        rim: repeat('x.x..x.x.x..x.x.', 8, '|'),
        shaker: repeat('xoooxoooxoooxooo', 8, '|')
    };
    const BATUCADA_FILL = {
        ...BATUCADA,
        tomMid: repeat('................', 7, '|') + '|........x.x.x.xx'
    };

    // サンバ：カヴァキーニョと打楽器
    const samba = {
        title: 'カーニバルの坂道',
        tags: ['明るい', '軽快'],
        genre: 'ラテン',
        melody: ['lead'],
        bpm: 100,
        swing: 0.06,
        gain: 0.095,
        reverb: { seconds: 1.5, tone: 0.5 },
        delay: { time: 0.75, feedback: 0.2, tone: 2600 },
        humanize: { time: 0.005, velocity: 0.08 },
        parts: {
            lead: { instrument: 'piano', volume: 0.63, pan: -0.08, decay: 0.7, brightness: 0.85, reverb: 0.18, delay: 0.08 },
            flute: { instrument: 'flute', volume: 0.5, pan: 0.3, vibrato: 10, breath: 0.05, reverb: 0.28, delay: 0.12 },
            cavaco: { instrument: 'guitar', mode: 'chords', center: 'B4', voices: 3, strum: 0.004, brightness: 0.75, gate: 0.4, volume: 0.7, pan: 0.25, reverb: 0.15 },
            horns: { instrument: 'brass', mode: 'chords', center: 'F4', voices: 3, volume: 0.6, pan: -0.25, brightness: 4, release: 0.08, reverb: 0.22 },
            bass: { instrument: 'synthBass', mode: 'bass', octave: 2, wave: 'triangle', cutoff: 320, envelope: 0.8, decay: 0.3, sustain: 0.4, release: 0.06, volume: 0.65, gate: 0.75 },
            drums: { instrument: 'drums', kit: 'soft', mode: 'drums', volume: 0.75, cutoff: 8000, levels: { tomLow: 0.8, tomMid: 0.5, rim: 0.45, shaker: 0.35 } }
        },
        sections: {
            // イントロ：打楽器から始め、3小節目でカヴァキーニョとベースが入る
            intro: {
                label: 'イントロ',
                chords: 'G | G | Am7 | D7',
                cavaco: '................|................|' + CAVACO + '|' + CAVACO,
                bass: { pattern: `r:16 | r:16 | ${BASS} | ${BASS}` },
                drums: {
                    tomLow: repeat('o...x...o...x...', 4, '|'),
                    rim: '................|................|' + repeat('x.x..x.x.x..x.x.', 2, '|'),
                    shaker: repeat('xoooxoooxoooxooo', 4, '|'),
                    tomMid: '................|................|................|........x.x.x.xx'
                }
            },
            A: {
                chords: CHORDS_A,
                lead: THEME,
                cavaco: CAVACO,
                bass: BASS,
                drums: BATUCADA
            },
            // A'：ブラスが答える
            A2: {
                label: "A'",
                chords: CHORDS_A,
                lead: THEME,
                horns: HORNS,
                cavaco: CAVACO,
                bass: BASS,
                drums: BATUCADA_FILL
            },
            // B：Cmaj7 から ii-V で流れて、D7 で戻る
            B: {
                chords: 'Cmaj7 | Bm7 | Em7 | A7 | Am7 | D7 | Gmaj7 | D7',
                lead: `E6:6 D6:2 B5:8 | D6:6 B5:2 F#5:8 | G5:3 B5:3 E6:10 | C#6:6 A5:2 E5:8 |
                       C6:6 A5:2 E5:8 | F#5:3 A5:3 D6:10 | B5:6 A5:2 F#5:8 | A5:4 C6:4 D6:8`,
                cavaco: CAVACO,
                bass: BASS,
                drums: BATUCADA_FILL
            },
            // 休憩：主旋律とカヴァキーニョを抜き、打楽器の上でフルートが呼ぶ
            C: {
                chords: 'G | G | Am7 | D7 | G | G | Am7 | D7',
                flute: `r:8 D6:2 B5:2 G5:4 | r:16 | r:8 E6:2 C6:2 A5:4 | r:8 F#5:4 A5:4 |
                        r:8 D6:2 B5:2 G5:4 | r:16 | r:8 C6:2 A5:2 E5:4 | r:8 D6:4 C6:4`,
                bass: 'R:8 5:8',
                drums: BATUCADA_FILL
            },
            // 最後の A'：ブラスとフルートを足して、D7 で頭の G へ戻る
            A3: {
                label: "A'",
                chords: CHORDS_LAST,
                lead: THEME_LAST,
                horns: HORNS,
                cavaco: CAVACO,
                bass: BASS,
                drums: BATUCADA_FILL
            }
        },
        intro: ['intro'],
        loop: ['A', 'A2', 'B', 'C', 'A3']
    };

    SoundKit.register('catalog', { songs: { samba } });
})();
