/**
 * 曲の一覧：勝利のひととき（勝ったあとのリザルト画面・ヘ長調で、はずむ）
 * 少しはねるリズムに、ギターの軽いかき鳴らし。主題は跳ね上がって、伸ばした所でブラスが「やったね」と答える
 * B はクラップを足して手拍子のように盛り上げ、休憩の C はマリンバが歌ってひと息つく
 */
(function () {
    const { repeat } = SoundKit;

    // A の主題（前半7小節は A' でも同じ）
    const THEME_HEAD = `C5:2 F5:2 A5:4 C6:6 A5:2 | D6:4 C6:2 Bb5:2 F5:8 | G5:4 Bb5:4 E5:4 G5:4 | A5:12 r:4 |
                        F5:2 A5:2 D6:4 C6:6 A5:2 | Bb5:4 A5:2 G5:2 D5:8 | E5:4 G5:4 Bb5:4 C6:4`;
    const THEME = `${THEME_HEAD} | F5:12 r:4`;
    // ループの終わり：C7 で止めて、頭の F へ戻る
    const THEME_LAST = `${THEME_HEAD} | C6:8 Bb5:4 G5:4`;

    const CHORDS_A = 'F | Bb | Gm7:8 C7:8 | F | Dm7 | Gm7 | C7 | F';
    const CHORDS_LAST = 'F | Bb | Gm7:8 C7:8 | F | Dm7 | Gm7 | C7 | C7';

    // A' のブラス：主題が伸ばしている4小節目と8小節目に答える
    const HORNS = repeat('................|................|................|........x-.x-x--', 2, '|');

    // ギター：8分を軽くかき鳴らす
    const STRUM = 'x-..x-x-..x-x-..';
    const BASS = 'R:4 5:4 R:4 5:4';
    const KICK = repeat('x.......x.......', 8, '|');
    const SNARE = repeat('....x.......x...', 8, '|');
    const HAT = repeat('x.x.x.x.x.x.x.x.', 8, '|');
    const DRUMS = { kick: KICK, snare: SNARE, hat: HAT };
    const DRUMS_FILL = {
        kick: KICK,
        snare: repeat('....x.......x...', 7, '|') + '|....x.......x.xx',
        hat: HAT,
        crash: 'x...............|' + repeat('................', 7, '|')
    };

    // リザルト画面：はねるギターとブラス
    const victory = {
        title: '勝利のひととき',
        tags: ['明るい', '軽快'],
        genre: 'ゲーム音楽',
        melody: ['lead'],
        bpm: 120,
        swing: 0.12,
        swingUnit: 2,
        gain: 0.09,
        reverb: { seconds: 1.6, tone: 0.5 },
        delay: { time: 0.75, feedback: 0.2, tone: 2600 },
        humanize: { time: 0.005, velocity: 0.08 },
        parts: {
            lead: { instrument: 'piano', volume: 0.6, pan: -0.08, decay: 0.75, brightness: 0.85, reverb: 0.18, delay: 0.08 },
            marimba: { instrument: 'marimba', volume: 0.7, pan: 0.2, reverb: 0.25, delay: 0.15 },
            guitar: { instrument: 'guitar', mode: 'chords', center: 'F4', voices: 3, strum: 0.008, brightness: 0.7, gate: 0.5, volume: 0.6, pan: 0.25, reverb: 0.18 },
            horns: { instrument: 'brass', mode: 'chords', center: 'A4', voices: 3, volume: 0.55, pan: -0.25, brightness: 4, release: 0.08, reverb: 0.22 },
            strings: { instrument: 'strings', mode: 'chords', center: 'C4', voices: 3, volume: 0.43, pan: -0.2, attack: 0.3, release: 0.5, brightness: 0.75, reverb: 0.4 },
            bass: { instrument: 'synthBass', mode: 'bass', octave: 2, wave: 'triangle', cutoff: 320, envelope: 0.8, decay: 0.3, sustain: 0.45, release: 0.06, volume: 0.6, gate: 0.75 },
            drums: { instrument: 'drums', kit: 'soft', mode: 'drums', volume: 0.65, cutoff: 7500, levels: { kick: 0.6, snare: 0.4, hat: 0.4, clap: 0.4, crash: 0.35 } }
        },
        sections: {
            // イントロ：ブラスの合図から、ギターとドラムが入る。C7 で主題へ
            intro: {
                label: 'イントロ',
                chords: 'F | Bb | F | C7',
                horns: 'x-.x-x--........|................|x-.x-x--........|........x-.x-x--',
                guitar: '................|' + STRUM + '|' + STRUM + '|' + STRUM,
                bass: { pattern: `r:16 | ${BASS} | ${BASS} | ${BASS}` },
                drums: {
                    kick: '................|' + repeat('x.......x.......', 3, '|'),
                    hat: '................|' + repeat('x.x.x.x.x.x.x.x.', 3, '|'),
                    snare: '................|................|................|....x.......x.xx'
                }
            },
            A: {
                chords: CHORDS_A,
                lead: THEME,
                guitar: STRUM,
                bass: BASS,
                drums: DRUMS
            },
            // A'：ブラスが答える
            A2: {
                label: "A'",
                chords: CHORDS_A,
                lead: THEME,
                horns: HORNS,
                guitar: STRUM,
                bass: BASS,
                drums: DRUMS_FILL
            },
            // B：Bb から上がっていく。弦楽器を敷き、クラップで手拍子。C7 で休憩へ
            B: {
                chords: 'Bb | C | Am7 | Dm | Gm7 | C7 | F | C7',
                lead: `F5:4 Bb5:4 D6:8 | C6:6 G5:2 E5:8 | A5:4 C6:4 E5:8 | F5:6 E5:2 D5:8 |
                       D5:4 G5:4 Bb5:8 | C6:6 Bb5:2 G5:8 | A5:4 C6:4 F5:8 | G5:4 E5:4 C5:4 E5:4`,
                guitar: STRUM,
                strings: 'hold',
                bass: BASS,
                drums: { ...DRUMS_FILL, clap: repeat('....x.......x...', 8, '|') }
            },
            // 休憩：ピアノを抜き、マリンバが歌う。ギターは4分、ドラムはハイハットとキックだけ
            C: {
                chords: 'F | Dm7 | Gm7 | C7 | F | Dm7 | Gm7 | C7',
                marimba: `A5:4 C6:4 A5:8 | F5:8 D5:8 | Bb5:4 D6:4 Bb5:8 | G5:8 E5:8 |
                          A5:4 F5:4 C5:8 | D5:8 F5:8 | G5:4 Bb5:4 D6:8 | Bb5:8 G5:8`,
                guitar: 'x---x---x---x---',
                bass: 'R:8 5:8',
                drums: { kick: KICK, hat: HAT }
            },
            // 最後の A'：ブラスと弦楽器を足して、C7 で頭の F へ戻る
            A3: {
                label: "A'",
                chords: CHORDS_LAST,
                lead: THEME_LAST,
                horns: HORNS,
                strings: 'hold',
                guitar: STRUM,
                bass: BASS,
                drums: DRUMS_FILL
            }
        },
        intro: ['intro'],
        loop: ['A', 'A2', 'B', 'C', 'A3']
    };

    SoundKit.register('catalog', { songs: { victory } });
})();
