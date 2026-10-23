/**
 * 曲の一覧：凱旋の大通り（マーチ・2拍子の行進曲）
 * 2拍子なので stepsPerBar: 8（1小節は16分音符8つ）
 */
(function () {
    const { repeat } = SoundKit;

    // A の主題（16小節。最後の小節だけ A' で変える）。付点で弾む
    const THEME_BODY = `F5:3 D5:1 F5:4 | Bb5:4 D6:4 | C6:3 A5:1 F5:4 | D6:6 r:2 |
                        Bb5:3 G5:1 Eb5:4 | D5:3 F5:1 Bb5:4 | C6:4 Bb5:4 | A5:6 r:2 |
                        F5:3 D5:1 F5:4 | Bb5:4 D6:4 | C6:3 A5:1 F5:4 | D6:6 r:2 |
                        Eb5:3 G5:1 Bb5:4 | D6:3 C6:1 Bb5:4 | C6:3 A5:1 F5:4`;
    const THEME = `${THEME_BODY} | Bb5:6 r:2`;
    // ループの終わり：F7 へ上がって、頭の Bb へ戻る
    const THEME_LAST = `${THEME_BODY} | Bb5:4 C6:2 A5:2`;
    const CHORDS_A = 'Bb | Bb | F7 | Bb | Eb | Bb | C7 | F7 | Bb | Bb | F7 | Bb | Eb | Bb/F | F7 | Bb';
    const CHORDS_A_LAST = 'Bb | Bb | F7 | Bb | Eb | Bb | C7 | F7 | Bb | Bb | F7 | Bb | Eb | Bb/F | F7 | Bb:4 F7:4';

    // トリオ（中間部）：IV の Eb へ転調して、なめらかに歌う
    const TRIO_BODY = `Bb4:4 Eb5:4 | G5:8 | F5:6 G5:2 | Ab5:8 | F5:4 D5:4 | Ab5:4 F5:4 | G5:8 | Eb5:6 r:2 |
                       Bb4:4 Eb5:4 | G5:4 Db6:4 | C6:8 | Ab5:4 Eb5:4 | G5:4 Bb5:4 | Ab5:4 F5:4 | Eb5:8`;
    const TRIO_CHORDS = 'Eb | Eb | Bb7 | Bb7 | Bb7 | Bb7 | Eb | Eb | Eb | Eb7 | Ab | Ab | Eb/Bb | Bb7 | Eb';
    // 2回目のトリオで、フルートが高く飾る
    const TRIO_COUNTER = `r:8 | r:4 Bb5:2 Eb6:2 | r:8 | r:4 D6:2 F6:2 | r:8 | r:8 | r:4 Bb5:2 Eb6:2 | r:8 |
                          r:8 | r:8 | r:4 Eb6:2 Ab5:2 | r:8 | r:8 | r:8 | r:4 G5:2 Bb5:2 | r:8`;

    // A' のフルートの合いの手（主題の伸ばしている所に）
    const COUNTER_A = `r:8 | r:8 | r:8 | r:4 F5:2 Bb5:2 | r:8 | r:8 | r:8 | r:4 C6:2 Eb6:2 |
                       r:8 | r:8 | r:8 | r:4 F5:2 Bb5:2 | r:8 | r:8 | r:8 | r:8`;

    // ブンチャッ：ベースが表、木管の和音が裏
    const BASS = 'R:4 5:4';
    const WINDS = '..x...x.';
    const CRASH = 'x.......|' + repeat('........', 7, '|');
    const DRUMS = {
        kick: repeat('x.......', 16, '|'),
        snare: repeat('..x...x.', 15, '|') + '|x.x.xxx.',
        openHat: CRASH + '|' + CRASH
    };

    // マーチ：付点で弾む主題と、ブンチャッの伴奏、小太鼓
    const march = {
        title: '凱旋の大通り',
        tags: ['明るい', '軽快'],
        genre: 'クラシック',
        melody: ['lead'],
        bpm: 112,
        stepsPerBar: 8,
        gain: 0.09,
        reverb: { seconds: 1.8, tone: 0.45 },
        delay: { time: 0.75, feedback: 0.15, tone: 2200 },
        humanize: { time: 0.004, velocity: 0.07 },
        parts: {
            lead: { instrument: 'piano', volume: 0.62, pan: -0.08, decay: 0.7, brightness: 0.85, reverb: 0.2, delay: 0.06 },
            flute: { instrument: 'flute', volume: 0.45, pan: 0.3, reverb: 0.3, delay: 0.1 },
            winds: { instrument: 'clarinet', mode: 'chords', center: 'F4', voices: 3, volume: 1.03, pan: 0.22, gate: 0.5, reverb: 0.2 },
            pad: { instrument: 'pad', mode: 'chords', center: 'Bb3', voices: 3, volume: 0.32, cutoff: 1000, reverb: 0.4 },
            bass: { instrument: 'synthBass', mode: 'bass', octave: 2, volume: 0.85, cutoff: 320, decay: 0.25, sustain: 0.4, release: 0.06, gate: 0.6 },
            drums: { instrument: 'drums', kit: 'soft', mode: 'drums', volume: 0.6, cutoff: 7000, levels: { kick: 0.75, snare: 0.5, openHat: 0.4, rim: 0.4, hat: 0.35 } }
        },
        sections: {
            // イントロ：小太鼓の連打で始め、F7 で主題へ
            intro: {
                label: 'イントロ',
                chords: 'Bb | Bb | F7 | F7',
                winds: '........|........|' + WINDS + '|' + WINDS,
                bass: { pattern: `r:8 | r:8 | ${BASS} | ${BASS}` },
                drums: {
                    snare: 'x.x.x.x.|x.x.x.x.|x.xxx.x.|xxxxx.x.',
                    kick: 'x.......|x.......|x.......|x.......'
                }
            },
            A: {
                chords: CHORDS_A,
                lead: THEME,
                winds: WINDS,
                bass: BASS,
                drums: DRUMS
            },
            // B：Gm へ曇らせて、Bb7 でトリオへ
            B: {
                chords: 'Gm | Gm | D7 | Gm | Cm | Gm | C7 | F7 | Bb | Bb | Eb | C7 | Bb/F | Gm | F7 | Bb7',
                lead: `D5:4 G5:4 | Bb5:3 A5:1 G5:4 | F#5:3 A5:1 C6:4 | Bb5:6 r:2 |
                       Eb5:4 G5:4 | D6:3 C6:1 Bb5:4 | Bb5:3 G5:1 E5:4 | A5:6 r:2 |
                       F5:4 Bb5:4 | D6:4 Bb5:4 | Eb5:3 G5:1 Bb5:4 | Bb5:3 G5:1 E5:4 |
                       D6:3 Bb5:1 F5:4 | G5:3 Bb5:1 D6:4 | C6:3 A5:1 F5:4 | Ab5:4 F5:2 D5:2`,
                winds: WINDS,
                bass: BASS,
                drums: DRUMS
            },
            // トリオ：小太鼓を抜き、パッドで包む
            trio: {
                label: 'トリオ',
                chords: `${TRIO_CHORDS} | Eb`,
                lead: `${TRIO_BODY} | r:8`,
                winds: WINDS,
                pad: 'hold',
                bass: BASS,
                drums: {
                    kick: repeat('x.......', 16, '|'),
                    hat: repeat('..x...x.', 16, '|')
                }
            },
            // 休憩：ピアノを抜き、フルートが短く呼ぶ。ドラムはリムだけ
            C: {
                chords: 'Ab | Eb | Fm7 | Bb7 | Ab | Eb | Fm7 | Bb7',
                flute: 'r:4 C6:4 | r:4 Bb5:4 | r:4 Ab5:4 | r:4 F5:4 | r:4 C6:4 | r:4 G5:4 | r:4 C6:4 | r:4 D6:4',
                winds: 'x---....',
                pad: 'hold',
                bass: BASS,
                drums: {
                    rim: repeat('..x...x.', 7, '|') + '|x.x.xxx.'
                }
            },
            // 2回目のトリオ：フルートの飾りと、小太鼓・シンバルで堂々と。F7 で Bb へ戻る
            trio2: {
                label: "トリオ'",
                chords: `${TRIO_CHORDS} | F7`,
                lead: `${TRIO_BODY} | A5:4 C6:4`,
                flute: TRIO_COUNTER,
                winds: WINDS,
                pad: 'hold',
                bass: BASS,
                drums: {
                    kick: repeat('x.......', 16, '|'),
                    snare: repeat('..x...x.', 15, '|') + '|x.x.xxx.',
                    openHat: repeat('x.......|........|........|........', 4, '|')
                }
            },
            // A に、フルートの合いの手を足す。F7 で終えて、頭の Bb へ戻る
            A2: {
                label: "A'",
                chords: CHORDS_A_LAST,
                lead: THEME_LAST,
                flute: COUNTER_A,
                winds: WINDS,
                bass: BASS,
                drums: DRUMS
            }
        },
        intro: ['intro'],
        loop: ['A', 'B', 'trio', 'C', 'trio2', 'A2']
    };

    SoundKit.register('catalog', { songs: { march } });
})();
