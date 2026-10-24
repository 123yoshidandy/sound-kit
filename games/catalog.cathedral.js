/**
 * 曲の一覧：黒き大聖堂（ゴシックのパイプオルガン・ト短調で、重々しく）
 * オルガンの和音と低い足鍵盤（ペダル）に、遠くの鐘。主題はピアノが冷たく歌う
 * A' はオルガンがトッカータ風の16分の分散和音で駆け、B は変ロ長調の方へ開いて合唱とティンパニ（低いタム）
 * 休憩の C はピアノを抜き、合唱がひとりで歌う
 */
(function () {
    const { repeat } = SoundKit;

    // A の主題（前半6小節は A' でも同じ）
    const THEME_HEAD = `D5:4 G5:4 Bb5:6 A5:2 | A5:8 F#5:4 D5:4 | G5:4 Bb5:4 D6:8 | C6:4 Bb5:4 G5:8 |
                        Eb5:4 G5:4 C6:8 | D6:6 C6:2 A5:4 F#5:4`;
    // A の終わり：D で止めて、A' の Gm へ
    const THEME = `${THEME_HEAD} | G5:4 D5:4 Eb5:4 G5:4 | F#5:12 r:4`;
    // A' の終わり：Gm に落ち着いて、B の Eb へ
    const THEME_TURN = `${THEME_HEAD} | Eb5:4 G5:4 F#5:4 A5:4 | G5:12 r:4`;

    const CHORDS_A = 'Gm | D/F# | Gm/F | Eb | Cm | D | Gm:8 Cm:8 | D';
    const CHORDS_A2 = 'Gm | D/F# | Gm/F | Eb | Cm | D | Cm:8 D:8 | Gm';

    // トッカータ：16分で上がって下りる
    const TOCCATA = '0:1 1 2 3 4 3 2 1 0 1 2 3 4 3 2 1';
    // 鐘：A の頭と5小節目で、遠くで鳴る
    const BELL = 'G4:16 | r:16 | r:16 | r:16 | G4:16 | r:16 | r:16 | r:16';
    const PEDAL = 'R:8 R:8';
    const TIMPANI = repeat('x...............', 7, '|') + '|x.......x.x.xxxx';

    // ゴシック：オルガンと鐘と合唱
    const cathedral = {
        title: '黒き大聖堂',
        tags: ['神秘的', '緊張感'],
        genre: 'クラシック',
        melody: ['lead'],
        bpm: 90,
        gain: 0.115,
        reverb: { seconds: 4, tone: 0.4 },
        delay: { time: 0.75, feedback: 0.2, tone: 1800, reverb: 0.3 },
        humanize: { time: 0.004, velocity: 0.05 },
        parts: {
            lead: { instrument: 'piano', volume: 0.54, pan: -0.08, decay: 1.1, brightness: 0.75, reverb: 0.35, delay: 0.1 },
            organ: { instrument: 'organ', mode: 'chords', center: 'A3', voices: 4, volume: 0.32, pan: 0.15, vibrato: 3, release: 0.3, reverb: 0.5 },
            toccata: { instrument: 'organ', mode: 'arp', from: 'G3', volume: 0.6, pan: 0.2, vibrato: 2, gate: 0.85, reverb: 0.45 },
            pedal: { instrument: 'organ', mode: 'bass', octave: 2, volume: 0.45, vibrato: 0, release: 0.3, reverb: 0.3 },
            choir: { instrument: 'choir', mode: 'chords', center: 'D4', voices: 3, volume: 0.32, pan: -0.15, attack: 0.4, release: 0.8, reverb: 0.55 },
            // 合唱のひとり歌い（休憩の C）
            voice: { instrument: 'choir', volume: 0.5, pan: -0.05, attack: 0.25, release: 0.6, vibrato: 10, reverb: 0.5 },
            bell: { instrument: 'bell', volume: 0.25, pan: 0.35, decay: 4, reverb: 0.6, delay: 0.2 },
            drums: { instrument: 'drums', kit: 'soft', mode: 'drums', volume: 0.5, cutoff: 6000, levels: { tomLow: 0.8, crash: 0.35 } }
        },
        sections: {
            // イントロ：鐘とオルガンで重く始め、D で主題へ
            intro: {
                label: 'イントロ',
                chords: 'Gm | Eb | Cm | D',
                bell: 'G4:16 | r:16 | G4:16 | r:16',
                organ: 'hold',
                pedal: { pattern: `r:16 | ${PEDAL} | ${PEDAL} | ${PEDAL}` },
                drums: { tomLow: '................|................|................|x.......x.x.xxxx' }
            },
            A: {
                chords: CHORDS_A,
                lead: THEME,
                organ: 'hold',
                pedal: PEDAL,
                bell: BELL
            },
            // A'：オルガンがトッカータで駆け、ティンパニが打つ。Gm に落ち着いて B へ
            A2: {
                label: "A'",
                chords: CHORDS_A2,
                lead: THEME_TURN,
                toccata: TOCCATA,
                pedal: PEDAL,
                drums: { tomLow: TIMPANI }
            },
            // B：Eb から変ロ長調の方へ開き、合唱が加わる。D で休憩へ
            B: {
                chords: 'Eb | F | Dm | Gm | Cm | F | Bb:8 Gm:8 | D',
                lead: `Bb5:6 G5:2 Eb5:8 | C6:6 A5:2 F5:8 | D6:6 A5:2 F5:8 | G5:4 Bb5:4 D6:8 |
                       C6:6 G5:2 Eb5:8 | F5:4 A5:4 C6:8 | D6:4 Bb5:4 Bb5:4 G5:4 | A5:8 F#5:4 D5:4`,
                organ: 'hold',
                choir: 'hold',
                pedal: PEDAL,
                drums: { tomLow: TIMPANI, crash: 'x...............|' + repeat('................', 7, '|') }
            },
            // 休憩：ピアノを抜き、合唱がひとりで歌う。オルガンだけが支え、鐘が鳴る。D で頭の Gm へ戻る
            C: {
                chords: 'Gm | Eb | Cm | D | Gm | Eb | Cm | D',
                voice: `D5:16 | Eb5:8 G5:8 | G5:8 Eb5:8 | F#5:16 |
                        D5:8 G5:8 | Bb5:16 | G5:8 Eb5:8 | F#5:8 A5:8`,
                organ: 'hold',
                pedal: 'R:16',
                bell: BELL
            },
            // 最後の A：トッカータと合唱を重ねて、D で頭の Gm へ戻る
            A3: {
                label: 'A',
                chords: CHORDS_A,
                lead: THEME,
                toccata: TOCCATA,
                choir: 'hold',
                pedal: PEDAL,
                drums: { tomLow: TIMPANI }
            }
        },
        intro: ['intro'],
        loop: ['A', 'A2', 'B', 'C', 'A3']
    };

    SoundKit.register('catalog', { songs: { cathedral } });
})();
