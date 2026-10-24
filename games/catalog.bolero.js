/**
 * 曲の一覧：高まるボレロ（ボレロ風・ハ長調の3拍子で、同じリズムのまま少しずつ厚く）
 * 3拍子なので、1小節は12ステップ。小太鼓の同じリズム（2小節で一回り）を、最初から最後までずっと続ける
 * A はピアノとピチカートだけ、A' でクラリネット、B で弦楽器とフルート、B' でブラスと合唱とティンパニを足して頂点へ
 * 休憩の C で一気に小太鼓とフルートだけに戻り、ループの頭の静けさへつなぐ
 */
(function () {
    const { repeat } = SoundKit;

    // A の主題。長くうねる一続きの歌
    const THEME = `C6:8 B5:2 C6:2 | B5:4 G5:4 E5:4 | A5:6 G5:2 A5:2 C6:2 | C6:8 A5:4 |
                   D6:4 C6:4 A5:4 | B5:6 A5:2 G5:4 | E5:4 G5:4 A5:4 | G5:6 F5:2 D5:4`;
    const CHORDS_A = 'C | Em | Am | F | Dm7 | G | C:8 Am:4 | G7';

    // B の主題（前半6小節は B' でも同じ）。イ短調の方へ
    const SONG_B_HEAD = `E5:8 A5:4 | C6:6 B5:2 A5:4 | D6:8 A5:4 | F5:6 E5:2 D5:4 | A5:4 C6:4 A5:4 | G5:8 E5:4`;
    // B の終わり：E7 で止めて、B' の Am へ
    const SONG_B = `${SONG_B_HEAD} | A5:4 B5:4 G#5:4 | B5:8 G#5:4`;
    // B' の終わり：G7 で止めて、休憩の C へ
    const SONG_B2 = `${SONG_B_HEAD} | F5:4 A5:4 C6:4 | B5:8 D6:4`;

    // A' のクラリネット：和音の音を、低く伸ばす
    const CLARINET = 'E4:12 | E4:12 | E4:12 | F4:12 | F4:12 | D4:12 | E4:12 | F4:12';
    // B のフルート：主題の上で、長く伸ばして飾る（主題が伸ばす所に答える）
    const FLUTE_B = 'r:12 | r:8 E6:4 | r:12 | r:8 A5:4 | r:12 | r:8 C6:4 | r:12 | r:8 D6:4';

    // 小太鼓：2小節で一回りする、同じリズム
    const SNARE = repeat('x..xxx.x.x.x|x..xxx.xxxxx', 4, '|');
    // ピチカート：3つの拍で和音を短く
    const PIZZ = 'x...x...x...';
    const BASS = 'R:4 r:4 5:4';

    // ボレロ：同じリズムで、少しずつ厚く
    const bolero = {
        title: '高まるボレロ',
        tags: ['落ち着いた', '緊張感'],
        genre: 'クラシック',
        melody: ['lead'],
        bpm: 72,
        stepsPerBar: 12,
        gain: 0.122,
        reverb: { seconds: 2.4, tone: 0.45 },
        delay: { time: 0.75, feedback: 0.15, tone: 2000, reverb: 0.25 },
        humanize: { time: 0.004, velocity: 0.06 },
        parts: {
            lead: { instrument: 'piano', volume: 0.54, pan: -0.08, decay: 1, brightness: 0.8, reverb: 0.25, delay: 0.06 },
            clarinet: { instrument: 'clarinet', volume: 0.45, pan: 0.3, attack: 0.08, release: 0.25, vibrato: 6, reverb: 0.3 },
            flute: { instrument: 'flute', volume: 0.36, pan: 0.25, vibrato: 10, breath: 0.04, reverb: 0.35, delay: 0.15 },
            // ピチカートのつもり：暗めのギターを短く切る
            pizz: { instrument: 'guitar', mode: 'chords', center: 'G3', voices: 3, brightness: 0.4, gate: 0.3, volume: 0.6, pan: 0.2, reverb: 0.25 },
            strings: { instrument: 'strings', mode: 'chords', center: 'D4', voices: 3, volume: 0.35, pan: -0.2, attack: 0.4, release: 0.6, brightness: 0.7, vibrato: 8, reverb: 0.45 },
            brass: { instrument: 'brass', mode: 'chords', center: 'F4', voices: 3, volume: 0.45, pan: -0.25, brightness: 3, release: 0.15, reverb: 0.35 },
            choir: { instrument: 'choir', mode: 'chords', center: 'E4', voices: 3, volume: 0.3, pan: 0.1, attack: 0.4, release: 0.7, reverb: 0.5 },
            bass: { instrument: 'pluck', mode: 'bass', octave: 2, brightness: 0.3, sustain: 0.994, release: 0.08, volume: 0.85, gate: 0.5 },
            drums: { instrument: 'drums', kit: 'soft', mode: 'drums', volume: 0.85, cutoff: 6500, levels: { snare: 0.9, tomLow: 0.7, crash: 0.35 } }
        },
        sections: {
            // イントロ：小太鼓だけで始め、3小節目からピチカート。G7 で主題へ
            intro: {
                label: 'イントロ',
                chords: 'C | C | Dm7 | G7',
                pizz: '............|............|' + PIZZ + '|' + PIZZ,
                drums: { snare: repeat('x..xxx.x.x.x|x..xxx.xxxxx', 2, '|') }
            },
            // A：ピアノとピチカートと小太鼓だけ
            A: {
                chords: CHORDS_A,
                lead: THEME,
                pizz: PIZZ,
                bass: BASS,
                drums: { snare: SNARE }
            },
            // A'：クラリネットが低く支える
            A2: {
                label: "A'",
                chords: CHORDS_A,
                lead: THEME,
                clarinet: CLARINET,
                pizz: PIZZ,
                bass: BASS,
                drums: { snare: SNARE }
            },
            // B：イ短調の方へ。弦楽器を敷き、フルートが飾る。E7 で B' へ
            B: {
                chords: 'Am | Am | Dm | Dm | F | C | E7sus4:8 E7:4 | E7',
                lead: SONG_B,
                flute: FLUTE_B,
                strings: 'hold',
                pizz: PIZZ,
                bass: BASS,
                drums: { snare: SNARE }
            },
            // B'：ブラスと合唱とティンパニを足して頂点へ。G7 で休憩へ
            B2: {
                label: "B'",
                chords: 'Am | Am | Dm | Dm | F | C | Dm7 | G7',
                lead: SONG_B2,
                flute: FLUTE_B,
                strings: 'hold',
                brass: repeat('x-------....', 7, '|') + '|x---x---x---',
                choir: 'hold',
                pizz: PIZZ,
                bass: BASS,
                drums: {
                    snare: SNARE,
                    tomLow: repeat('x...........', 7, '|') + '|x...x...x.x.',
                    crash: 'x...........|' + repeat('............', 7, '|')
                }
            },
            // 休憩：一気に静まり、小太鼓とピチカートの上でフルートだけが歌う。G7 で頭の C へ戻る
            C: {
                chords: CHORDS_A,
                flute: 'E5:12 | G5:12 | C6:8 A5:4 | A5:12 | F5:12 | B5:12 | G5:8 A5:4 | F5:8 D5:4',
                pizz: PIZZ,
                bass: 'R:12',
                drums: { snare: SNARE }
            }
        },
        intro: ['intro'],
        loop: ['A', 'A2', 'B', 'B2', 'C']
    };

    SoundKit.register('catalog', { songs: { bolero } });
})();
