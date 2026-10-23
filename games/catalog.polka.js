/**
 * 曲の一覧：麦わら帽子のポルカ（ポルカ・2拍子の跳ねる踊り）
 * 2拍子なので stepsPerBar: 8（1小節は16分音符8つ）
 */
(function () {
    const { repeat } = SoundKit;

    // A の主題（16小節）。和音を駆け上がって、短く切る
    const THEME = `D5:2 G5:2 B5:4 | D6:4 B5:4 | C6:2 B5:2 A5:4 | F#5:6 r:2 |
                   D5:2 F#5:2 A5:4 | C6:4 A5:4 | B5:2 A5:2 G5:4 | D5:6 r:2 |
                   D5:2 G5:2 B5:4 | D6:4 B5:4 | C6:4 G5:4 | E5:6 r:2 |
                   D5:2 G5:2 B5:4 | A5:2 B5:2 C6:4 | B5:2 A5:2 G5:4 | G5:6 r:2`;
    const CHORDS_A = 'G | G | D7 | D7 | D7 | D7 | G | G | G | G | C | C | G/D | D7 | G | G';

    // B：Em の方へ曇らせる（16小節。最後の小節だけ変える）
    const B_BODY = `E5:2 G5:2 B5:4 | B5:2 A5:2 G5:4 | D#5:2 F#5:2 A5:4 | G5:6 r:2 |
                    C6:4 A5:4 | F#5:2 A5:2 C6:4 | B5:4 G5:4 | D6:6 r:2 |
                    E5:2 G5:2 C6:4 | B5:4 D6:4 | G5:4 E5:4 | C6:2 B5:2 A5:4 |
                    F#5:4 A5:2 C6:2 | B5:6 r:2`;
    const B_CHORDS = 'Em | Em | B7 | Em | Am | D7 | G | G | C | G | Em | Am | D7 | G';

    // トリオ（中間部）：IV の C へ転調して、なめらかに歌う
    const TRIO = `E5:4 G5:4 | C6:8 | B5:6 A5:2 | G5:8 | D5:4 F5:4 | G5:4 B5:4 | C6:4 G5:4 | E5:8 |
                  E5:4 G5:4 | Bb5:4 G5:4 | A5:8 | C6:4 A5:4 | G5:4 E5:4 | F5:4 D5:4 | C5:8 | r:8`;

    // クラリネットの合いの手（主題の伸ばしている所に）
    const COUNTER_A = `r:8 | r:8 | r:8 | r:4 A5:2 C6:2 | r:8 | r:8 | r:8 | r:4 G5:2 B5:2 |
                       r:8 | r:8 | r:8 | r:4 G5:2 C6:2 | r:8 | r:8 | r:8 | r:4 B5:2 D6:2`;
    const COUNTER_B = `r:8 | r:8 | r:8 | r:4 B4:2 E5:2 | r:8 | r:8 | r:8 | r:4 G5:2 B5:2 |
                       r:8 | r:8 | r:8 | r:8 | r:8 | r:4 D5:2 G5:2 | r:8 | r:8`;

    // ブンチャッ：ベースが表、オルガンが裏
    const BASS = 'R:4 5:4';
    const OOMPAH = '..x...x.';
    const DRUMS = {
        kick: repeat('x...x...', 16, '|'),
        rim: repeat('..x...x.', 16, '|'),
        hat: repeat('..o...o.', 16, '|')
    };
    const DRUMS_FILL = {
        kick: repeat('x...x...', 16, '|'),
        rim: repeat('..x...x.', 15, '|') + '|..x.x.x.',
        hat: repeat('..o...o.', 16, '|')
    };

    // ポルカ：はずむ主題と、オルガンの裏打ち
    const polka = {
        title: '麦わら帽子のポルカ',
        tags: ['明るい', '軽快'],
        genre: 'ワールド',
        melody: ['lead'],
        bpm: 126,
        stepsPerBar: 8,
        gain: 0.095,
        reverb: { seconds: 1.4, tone: 0.5 },
        delay: { time: 0.75, feedback: 0.15, tone: 2400 },
        humanize: { time: 0.004, velocity: 0.08 },
        parts: {
            lead: { instrument: 'piano', volume: 0.55, pan: -0.08, decay: 0.6, brightness: 0.85, reverb: 0.16, delay: 0.06 },
            clarinet: { instrument: 'clarinet', volume: 0.5, pan: 0.3, reverb: 0.25, delay: 0.1 },
            organ: { instrument: 'organ', mode: 'chords', center: 'E4', voices: 3, vibrato: 5, volume: 1.5, pan: 0.22, gate: 0.4, reverb: 0.18 },
            pad: { instrument: 'organ', mode: 'chords', center: 'D4', voices: 3, vibrato: 5, volume: 0.27, pan: 0.2, reverb: 0.35 },
            bass: { instrument: 'pluck', mode: 'bass', octave: 2, brightness: 0.4, sustain: 0.994, release: 0.08, volume: 1, gate: 0.7 },
            drums: { instrument: 'drums', kit: 'soft', mode: 'drums', volume: 0.55, cutoff: 7000, levels: { kick: 0.7, rim: 0.45, hat: 0.35 } }
        },
        sections: {
            intro: {
                label: 'イントロ',
                chords: 'G | G | D7 | D7',
                organ: OOMPAH,
                bass: BASS,
                drums: { kick: 'x...x...|x...x...|x...x...|x...x...', rim: '........|........|..x...x.|..x.x.x.' }
            },
            A: {
                chords: CHORDS_A,
                lead: THEME,
                organ: OOMPAH,
                bass: BASS,
                drums: DRUMS
            },
            // B：G7 で終えて、トリオの C へ
            B: {
                chords: `${B_CHORDS} | G | G7`,
                lead: `${B_BODY} | G5:4 D5:4 | F5:2 G5:2 B5:4`,
                organ: OOMPAH,
                bass: BASS,
                drums: DRUMS_FILL
            },
            // トリオ：C へ転調。オルガンを伸ばし、ドラムはキックだけ
            trio: {
                label: 'トリオ',
                chords: 'C | C | G7 | G7 | G7 | G7 | C | C | C | C7 | F | F | C/G | G7 | C | C',
                lead: TRIO,
                organ: OOMPAH,
                pad: 'hold',
                bass: BASS,
                drums: { kick: repeat('x.......', 16, '|') }
            },
            // 休憩：ピアノとドラムを抜き、クラリネットが歌う。D7 で G へ戻る
            C: {
                chords: 'Am | Em | Am | D7 | C | G | Am7 | D7',
                clarinet: 'C6:4 A5:4 | B5:4 G5:4 | E5:4 A5:4 | F#5:6 r:2 | G5:4 E5:4 | D5:4 B4:4 | C5:4 E5:4 | F#5:4 A5:4',
                organ: 'x---....',
                pad: 'hold',
                bass: BASS
            },
            // A に、クラリネットの合いの手を足す
            A2: {
                label: "A'",
                chords: CHORDS_A,
                lead: THEME,
                clarinet: COUNTER_A,
                organ: OOMPAH,
                bass: BASS,
                drums: DRUMS
            },
            // ループの終わりの B：合いの手を足し、D7 で頭の G へ戻る
            B2: {
                label: "B'",
                chords: `${B_CHORDS} | G | D7`,
                lead: `${B_BODY} | G5:4 D5:4 | F#5:2 A5:2 C6:4`,
                clarinet: COUNTER_B,
                organ: OOMPAH,
                bass: BASS,
                drums: DRUMS_FILL
            }
        },
        intro: ['intro'],
        loop: ['A', 'B', 'trio', 'C', 'A2', 'B2']
    };

    SoundKit.register('catalog', { songs: { polka } });
})();
