/**
 * 曲の一覧：溶岩の流れる火山洞（ゲーム音楽・ニ短調で、じりじりと張りつめる）
 * 低い弦が8分で根音を刻み続け、ブラスが低い和音を不穏に伸ばす。ティンパニのつもりのタムが重く連打する
 * 属和音は A（和声的短音階の C#）。A' は Eb（ナポリの和音）へ沈んで、A7 から戻る
 * 休憩の C はピアノとドラムを抜き、弦がひとりで低く歌う。パッドが熱気のように和音を敷く。最後は A7 で頭の Dm へ戻る
 */
(function () {
    const { repeat } = SoundKit;
    const REST = '................';

    // A の主題（前半4小節は A' でも同じ）
    const THEME_HEAD = `D5:4 F5:4 A5:6 G5:2 | F5:4 E5:2 D5:2 A5:8 | Bb5:6 A5:2 G5:4 F5:4 | E5:4 A5:4 C#6:8`;
    const THEME = `${THEME_HEAD} |
                   D6:6 C#6:2 D6:4 A5:4 | G5:4 Bb5:4 D6:6 C6:2 | Bb5:4 F5:4 E5:4 C#5:4 | D5:12 r:4`;
    // A' の後半：Eb へ沈んで、A7 で次へ
    const THEME_TURN = `${THEME_HEAD} |
                        G5:4 Bb5:4 D6:8 | G5:4 Bb5:4 G5:4 Eb5:4 | C#6:6 B5:2 A5:4 E5:4 | G5:4 E5:4 C#5:4 A4:4`;
    const CHORDS_A = 'Dm | Dm | Bb | A | Dm | Gm | Bb:8 A:8 | Dm';
    const CHORDS_A2 = 'Dm | Dm | Bb | A | Gm | Eb | A | A7';

    // B：ト短調の方から巡り、A で休憩へ
    const CHORDS_B = 'Gm | Dm | Bb | F | Gm | Dm | Eb | A';
    const SONG_B = `D6:8 Bb5:4 G5:4 | A5:8 F5:4 D5:4 | F5:4 Bb5:4 D6:8 | C6:6 A5:2 F5:8 |
                    G5:4 Bb5:4 D6:6 C6:2 | A5:8 D6:4 F5:4 | G5:6 Bb5:2 Eb5:8 | C#6:8 A5:4 E5:4`;

    // 休憩：弦がひとりで低く歌う。A7 で A へ戻る
    const CHORDS_C = 'Dm | Bb | Gm | A | Dm | Bb | Eb | A7';
    const SOLO_C = `A4:8 D5:8 | F5:16 | D5:8 G5:8 | E5:16 |
                    F5:8 A5:8 | D5:16 | G5:8 Bb5:8 | C#5:8 E5:4 G5:4`;

    // 低い弦の刻みとベース
    const OSTINATO = '0:2 0 1 0 2 0 1 0';
    const BASS = 'R:4 R:4 R:4 5:2 R:2';

    // ブラス：低い和音を伸ばす。A は2小節に1回、2回目の A は毎小節
    const BRASS_A = repeat(`x-----..........|${REST}`, 4, '|');
    const BRASS_A3 = repeat('x-----......x---', 8, '|');
    const BRASS_B = repeat('x-------x-------', 7, '|') + '|x--.x--.x-------';

    // ティンパニのつもりのタム：重く連打し、区間の終わりで16分に転がす
    const TIMP = 'x.....x.x.......';
    const TIMP_FILL = 'x.....x.x.x.xxxx';
    const TOMS_A = { tomLow: repeat(TIMP, 7, '|') + '|' + TIMP_FILL, crash: 'x...............|' + repeat(REST, 7, '|') };
    const TOMS_B = {
        tomLow: repeat('x...x...x...x...', 7, '|') + '|x.x.x.x.xxxxxxxx',
        tomMid: repeat('..x.......x.....', 8, '|'),
        crash: 'x...............|' + repeat(REST, 7, '|')
    };

    // 火山：低い弦の刻み、不穏なブラス、重いタム
    const volcano = {
        title: '溶岩の流れる火山洞',
        tags: ['緊張感'],
        genre: 'ゲーム音楽',
        melody: ['lead'],
        bpm: 126,
        gain: 0.1,
        reverb: { seconds: 2.2, tone: 0.4 },
        delay: { time: 0.75, feedback: 0.2, tone: 2000 },
        humanize: { time: 0.004, velocity: 0.07 },
        parts: {
            lead: { instrument: 'piano', volume: 0.55, pan: -0.08, decay: 0.75, brightness: 0.85, reverb: 0.22, delay: 0.08 },
            // 休憩の C で歌う弦
            solo: { instrument: 'strings', volume: 1.0, pan: 0.15, attack: 0.25, release: 0.5, brightness: 0.7, vibrato: 10, reverb: 0.35 },
            // 低い弦の刻み：立ち上がりを速くして、短く切る
            ostinato: { instrument: 'strings', mode: 'arp', from: 'D3', volume: 0.8, pan: 0.25, attack: 0.02, release: 0.08, gate: 0.6, brightness: 0.8, vibrato: 0, reverb: 0.2 },
            // 不穏なブラス：低い和音を伸ばす
            brass: { instrument: 'brass', mode: 'chords', center: 'A3', voices: 3, volume: 0.75, pan: -0.2, brightness: 2.5, attack: 0.06, release: 0.2, reverb: 0.3 },
            pad: { instrument: 'pad', mode: 'chords', center: 'C4', voices: 3, volume: 0.35, cutoff: 1000, attack: 1, release: 1.5, pan: -0.1, reverb: 0.45 },
            bass: { instrument: 'synthBass', mode: 'bass', octave: 2, volume: 0.8, cutoff: 360, decay: 0.18, sustain: 0.35, release: 0.05, gate: 0.8 },
            // ティンパニのつもりのタム
            drums: { instrument: 'drums', kit: 'soft', mode: 'drums', volume: 0.65, cutoff: 6000, levels: { tomLow: 0.7, tomMid: 0.5, crash: 0.3 } }
        },
        sections: {
            // イントロ：弦の刻みとタムの連打から、ブラスが A を吹いて主題へ
            intro: {
                label: 'イントロ',
                chords: 'Dm | Dm | Bb | A',
                ostinato: OSTINATO,
                pad: 'hold',
                brass: `${REST}|${REST}|${REST}|x--.x--.x-------`,
                bass: { pattern: `R:16 | R:16 | ${BASS} | ${BASS}` },
                drums: { tomLow: `x.......x.......|x.......x.......|x...x...x...x...|x.x.x.x.xxxxxxxx` }
            },
            A: {
                chords: CHORDS_A,
                lead: THEME,
                ostinato: OSTINATO,
                brass: BRASS_A,
                bass: BASS,
                drums: TOMS_A
            },
            // A'：Eb へ沈み、A7 で B へ
            A2: {
                label: "A'",
                chords: CHORDS_A2,
                lead: THEME_TURN,
                ostinato: OSTINATO,
                brass: BRASS_A,
                bass: BASS,
                drums: TOMS_A
            },
            // B：ブラスが2拍ずつ吹き、タムが4分で押す
            B: {
                chords: CHORDS_B,
                lead: SONG_B,
                ostinato: OSTINATO,
                brass: BRASS_B,
                bass: BASS,
                drums: TOMS_B
            },
            // 休憩：ピアノとドラムを抜き、弦が低く歌う。刻みは4分、パッドが熱気のように敷く
            C: {
                chords: CHORDS_C,
                solo: SOLO_C,
                ostinato: '0:4 0 1 0',
                pad: 'hold',
                bass: 'R:16',
                drums: { tomLow: repeat('x...............', 7, '|') + '|x...x...x.x.xxxx' }
            },
            // 2回目の A：ブラスが毎小節吹く
            A3: {
                label: 'A',
                chords: CHORDS_A,
                lead: THEME,
                ostinato: OSTINATO,
                brass: BRASS_A3,
                bass: BASS,
                drums: TOMS_B
            },
            // 最後の A'：ブラスとパッドを重ね、A7 で頭の Dm へ戻る
            A4: {
                label: "A'",
                chords: CHORDS_A2,
                lead: THEME_TURN,
                ostinato: OSTINATO,
                brass: BRASS_A3,
                pad: 'hold',
                bass: BASS,
                drums: TOMS_B
            }
        },
        intro: ['intro'],
        loop: ['A', 'A2', 'B', 'C', 'A3', 'A4']
    };

    SoundKit.register('catalog', { songs: { volcano } });
})();
