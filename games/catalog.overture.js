/**
 * 曲の一覧：夜明けの序曲（タイトル画面・ニ長調で、壮大に明るく）
 * 弦楽器の8分の刻みに、ブラスのファンファーレとティンパニ（低いタム）。主題はピアノが大きく歌う
 * A' はベルが答えて G へ転じ、B は合唱を敷いて高く上がる。休憩の C はフルートと弦楽器だけで、遠くを見渡すように
 */
(function () {
    const { repeat } = SoundKit;

    // A の主題（前半6小節は A' でも同じ）。大きく跳んで、長い音で上がっていく
    const THEME_HEAD = `A4:4 D5:4 F#5:6 E5:2 | E5:4 A5:4 C#6:8 | D6:6 C#6:2 B5:8 | B5:4 G5:4 D5:8 |
                        F#5:4 A5:4 D6:6 C#6:2 | B5:6 A5:2 G5:8`;
    const THEME = `${THEME_HEAD} | G5:4 B5:4 A5:4 C#6:4 | D6:12 r:4`;
    // A' の終わり：D7 へ進んで、B の G へ
    const THEME_TURN = `${THEME_HEAD} | G5:4 B5:4 A5:4 C#6:4 | D6:8 C6:4 A5:4`;
    // ループの終わり：A7 で止めて、頭の D へ戻る
    const THEME_LAST = `${THEME_HEAD} | G5:4 B5:4 A5:4 C#6:4 | A5:8 G5:4 E5:4`;

    const CHORDS_A = 'D | A/C# | Bm | G | D/F# | G | Em7:8 A7:8 | D';
    const CHORDS_A2 = 'D | A/C# | Bm | G | D/F# | G | Em7:8 A7:8 | D:8 D7:8';
    const CHORDS_LAST = 'D | A/C# | Bm | G | D/F# | G | Em7:8 A7:8 | A7';

    // A' のベル：主題が伸ばしている所に、高く答える
    const BELL = 'r:16 | r:8 E6:4 A6:4 | r:16 | r:8 D6:4 G6:4 | r:16 | r:8 D6:4 B5:4 | r:16 | r:16';

    // 弦の刻み：分散和音を8分で止めずに続ける
    const OSTINATO = '0:2 1 2 1 3 1 2 1';
    const BASS = 'R:4 R:2 R:2 5:4 R:4';

    // ブラス：小節の頭で吹く。最後の小節は3つ吹いて次へ渡す
    const BRASS_BAR = 'x-----..........';
    const BRASS_TURN = 'x--.x--.x-------';
    const BRASS_A = repeat(BRASS_BAR, 7, '|') + '|' + BRASS_TURN;

    const CRASH = 'x...............|' + repeat('................', 7, '|');
    const TIMPANI = repeat('x.......x.......', 8, '|');
    const DRUMS = { tomLow: TIMPANI, kick: repeat('x...............', 8, '|') };
    const DRUMS_FILL = {
        tomLow: repeat('x.......x.......', 7, '|') + '|x.......x.x.xxxx',
        kick: repeat('x...............', 8, '|'),
        snare: repeat('................', 7, '|') + '|........o.o.x.x.'
    };

    // タイトル画面：弦の刻みとファンファーレ
    const overture = {
        title: '夜明けの序曲',
        tags: ['明るい'],
        genre: 'ゲーム音楽',
        melody: ['lead'],
        bpm: 112,
        gain: 0.08,
        reverb: { seconds: 2.6, tone: 0.45 },
        delay: { time: 0.75, feedback: 0.2, tone: 2200, reverb: 0.25 },
        humanize: { time: 0.004, velocity: 0.06 },
        parts: {
            lead: { instrument: 'piano', volume: 0.7, pan: -0.08, decay: 0.9, brightness: 0.85, reverb: 0.25, delay: 0.08 },
            bell: { instrument: 'bell', volume: 0.3, pan: 0.35, reverb: 0.4, delay: 0.2 },
            flute: { instrument: 'flute', volume: 0.5, pan: 0.25, vibrato: 10, breath: 0.04, reverb: 0.35, delay: 0.15 },
            // 弦の刻み：立ち上がりを速くして、短く切る
            ostinato: { instrument: 'strings', mode: 'arp', from: 'A3', volume: 0.95, pan: 0.25, attack: 0.03, release: 0.1, gate: 0.75, brightness: 0.85, reverb: 0.3 },
            strings: { instrument: 'strings', mode: 'chords', center: 'D4', voices: 3, volume: 0.35, pan: -0.25, attack: 0.4, release: 0.7, brightness: 0.75, vibrato: 8, reverb: 0.45 },
            brass: { instrument: 'brass', mode: 'chords', center: 'F#4', voices: 3, volume: 0.5, pan: -0.2, brightness: 3.5, release: 0.12, reverb: 0.35 },
            choir: { instrument: 'choir', mode: 'chords', center: 'E4', voices: 3, volume: 0.32, pan: 0.1, attack: 0.35, release: 0.7, reverb: 0.5 },
            bass: { instrument: 'synthBass', mode: 'bass', octave: 2, wave: 'triangle', cutoff: 300, envelope: 0.5, decay: 0.6, sustain: 0.5, release: 0.15, volume: 0.55, gate: 0.85 },
            drums: { instrument: 'drums', kit: 'soft', mode: 'drums', volume: 0.6, cutoff: 7000, levels: { kick: 0.45, tomLow: 0.8, snare: 0.35, crash: 0.4 } }
        },
        sections: {
            // イントロ：ファンファーレとティンパニの連打で幕を開け、A7 で主題へ
            intro: {
                label: 'イントロ',
                chords: 'D | G/D | D | A7sus4:8 A7:8',
                brass: 'x--.x-x-x-------|x--.x-x-x-------|x--.x-x-x-------|x-------x--.x---',
                ostinato: { pattern: `r:16 | r:16 | ${OSTINATO} | ${OSTINATO}` },
                strings: 'hold',
                drums: {
                    crash: 'x...............|................|x...............|................',
                    tomLow: 'x.......x.......|x.......x.......|x...x...x...x...|x.x.x.x.xxxxxxxx'
                }
            },
            A: {
                chords: CHORDS_A,
                lead: THEME,
                ostinato: OSTINATO,
                bass: BASS,
                drums: { ...DRUMS, crash: CRASH }
            },
            // A'：ベルが答え、ブラスが小節の頭で吹く。D7 で B の G へ
            A2: {
                label: "A'",
                chords: CHORDS_A2,
                lead: THEME_TURN,
                bell: BELL,
                ostinato: OSTINATO,
                brass: BRASS_A,
                bass: BASS,
                drums: DRUMS_FILL
            },
            // B：G から高く上がる。合唱と弦楽器を敷き、A7 で休憩へ
            B: {
                chords: 'G | A | F#m7 | Bm | Em7 | A | Bm7:8 E7:8 | A7',
                lead: `D6:6 B5:2 G5:8 | E6:6 C#6:2 A5:8 | C#6:4 A5:4 F#5:4 E5:4 | F#5:4 B5:4 D6:8 |
                       G5:4 B5:4 D6:8 | C#6:6 B5:2 A5:8 | D6:4 B5:4 G#5:4 B5:4 | A5:4 C#6:4 E5:4 G5:4`,
                ostinato: OSTINATO,
                strings: 'hold',
                choir: 'hold',
                brass: repeat(BRASS_BAR, 7, '|') + '|' + BRASS_TURN,
                bass: BASS,
                drums: { ...DRUMS_FILL, crash: CRASH }
            },
            // 休憩：ピアノとドラムを抜き、フルートが遠くへ歌う。刻みは4分にゆるめる
            C: {
                chords: 'D | Bm | G | A | D | Bm | Em7 | A7',
                flute: `F#5:8 A5:8 | B5:8 F#5:8 | G5:4 B5:4 D6:8 | C#6:12 r:4 |
                        A5:8 F#5:8 | D5:8 F#5:4 B5:4 | G5:8 E5:8 | E5:8 G5:4 A5:4`,
                ostinato: '0:4 1 2 1',
                strings: 'hold',
                bass: 'R:16',
                drums: { tomLow: repeat('................', 7, '|') + '|x...x...x.x.xxxx' }
            },
            // 最後の A：ブラスと合唱を足して、A7 で頭の D へ戻る
            A3: {
                label: 'A',
                chords: CHORDS_LAST,
                lead: THEME_LAST,
                ostinato: OSTINATO,
                brass: BRASS_A,
                choir: 'hold',
                bass: BASS,
                drums: { ...DRUMS_FILL, crash: CRASH }
            }
        },
        intro: ['intro'],
        loop: ['A', 'A2', 'B', 'C', 'A3']
    };

    SoundKit.register('catalog', { songs: { overture } });
})();
