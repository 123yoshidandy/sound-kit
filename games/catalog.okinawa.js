/**
 * 曲の一覧：南の島の三線（沖縄風・ハの琉球音階 C E F G B で、はねて踊る）
 * 主旋律は琉球音階の5つの音だけ。三線（明るいギター）が裏で刻み、太鼓（低いタム）とサンバ（カスタネットのようなリム）ではねる
 * A' は三線が主題の伸ばしに短く答え、B は Em から少し切なく。手拍子を足して踊りへ
 * 休憩の C はピアノを抜いて、三線がひとりで歌う
 */
(function () {
    const { repeat } = SoundKit;

    // A の主題（前半7小節は最後の A でも同じ）。琉球音階 C E F G B だけ
    const THEME_HEAD = `G5:4 E5:2 F5:2 G5:8 | C6:4 B5:2 C6:2 F5:8 | B5:4 G5:4 F5:8 | E5:4 G5:2 E5:2 C5:8 |
                        E5:2 F5:2 G5:4 C6:8 | C6:4 B5:2 G5:2 F5:8 | B5:4 G5:4 F5:4 E5:4`;
    const THEME = `${THEME_HEAD} | C6:12 r:4`;
    // ループの終わり：G7 で止めて、頭の C へ戻る
    const THEME_LAST = `${THEME_HEAD} | G5:4 B5:4 F5:4 G5:4`;
    const CHORDS_A = 'C | F | G7 | C | C | F | G7 | C';
    const CHORDS_LAST = 'C | F | G7 | C | C | F | G7 | G7';

    // A' の三線：主題が伸ばしている所に、短く答える
    const SANSHIN_A = `r:8 C5:2 E5:2 G5:4 | r:8 F4:2 C5:2 F5:4 | r:16 | r:8 G4:2 C5:2 E5:4 |
                       r:8 E5:2 G5:2 E5:4 | r:8 C5:2 F5:2 C5:4 | r:16 | r:4 E5:2 G5:2 E5:4 C5:4`;
    // 休憩の三線：ひとりで歌う
    const SANSHIN_C = `E5:4 G5:4 C6:8 | C6:4 F5:4 C5:8 | B4:4 F5:4 G5:8 | E5:8 C5:8 |
                       E5:2 G5:2 E5:2 G5:2 C6:8 | C6:2 B5:2 G5:4 F5:8 | G5:4 F5:4 B4:8 | G5:4 B5:4 F5:8`;

    // 三線のかき鳴らし（8分の裏）
    const STRUM = '..x-..x-..x-..x-';
    const BASS = 'R:4 5:4 R:4 5:4';
    // 太鼓とサンバ
    const TAIKO = repeat('x.......x.......', 8, '|');
    const SANBA = repeat('x.xx..x.x.xx..x.', 8, '|');
    const DRUMS = { tomLow: TAIKO, rim: SANBA };
    const DRUMS_FILL = { ...DRUMS, tomMid: repeat('................', 7, '|') + '|........x.x.x.x.' };

    // 沖縄：三線と太鼓
    const okinawa = {
        title: '南の島の三線',
        tags: ['明るい', '軽快'],
        genre: 'ワールド',
        melody: ['lead'],
        bpm: 100,
        swing: 0.12,
        swingUnit: 2,
        gain: 0.107,
        reverb: { seconds: 1.6, tone: 0.5 },
        delay: { time: 0.75, feedback: 0.2, tone: 2400 },
        humanize: { time: 0.006, velocity: 0.1 },
        parts: {
            lead: { instrument: 'piano', volume: 0.56, pan: -0.08, decay: 0.8, brightness: 0.85, reverb: 0.2, delay: 0.08 },
            // 三線のつもり：明るいギター
            sanshin: { instrument: 'guitar', brightness: 0.9, volume: 0.99, pan: 0.25, reverb: 0.22, delay: 0.1 },
            strum: { instrument: 'guitar', mode: 'chords', center: 'G4', voices: 3, strum: 0.006, brightness: 0.85, gate: 0.4, volume: 0.6, pan: 0.3, reverb: 0.15 },
            bass: { instrument: 'synthBass', mode: 'bass', octave: 2, wave: 'triangle', cutoff: 300, envelope: 0.6, decay: 0.3, sustain: 0.45, release: 0.06, volume: 0.6, gate: 0.75 },
            drums: { instrument: 'drums', kit: 'soft', mode: 'drums', volume: 0.6, cutoff: 7500, levels: { tomLow: 0.65, tomMid: 0.5, rim: 0.35, clap: 0.35 } }
        },
        sections: {
            // イントロ：三線の歌い出しから、太鼓とサンバが入る。G7 で主題へ
            intro: {
                label: 'イントロ',
                chords: 'C | F | G7 | G7',
                sanshin: 'E5:4 G5:4 C6:8 | C6:4 F5:4 C5:8 | B4:4 F5:4 G5:8 | G5:4 B5:4 F5:8',
                strum: '................|................|' + STRUM + '|' + STRUM,
                bass: { pattern: `r:16 | r:16 | ${BASS} | ${BASS}` },
                drums: { tomLow: '................|................|x.......x.......|x.......x.......', rim: '................|................|' + repeat('x.xx..x.x.xx..x.', 2, '|') }
            },
            A: {
                chords: CHORDS_A,
                lead: THEME,
                strum: STRUM,
                bass: BASS,
                drums: DRUMS
            },
            // A'：三線が短く答える
            A2: {
                label: "A'",
                chords: CHORDS_A,
                lead: THEME,
                sanshin: SANSHIN_A,
                strum: STRUM,
                bass: BASS,
                drums: DRUMS_FILL
            },
            // B：Em から少し切なく。手拍子を足して踊る。G7 で休憩へ
            B: {
                chords: 'Em | F | C | G | Em | F | G | G7',
                lead: `B5:6 G5:2 E5:8 | C6:8 F5:8 | E5:4 G5:4 C6:8 | B5:8 G5:8 |
                       E5:4 G5:4 B5:8 | C6:4 F5:4 C6:8 | G5:4 B5:4 G5:8 | F5:8 B5:8`,
                strum: STRUM,
                bass: BASS,
                drums: { ...DRUMS_FILL, clap: repeat('....x.......x...', 8, '|') }
            },
            // 休憩：ピアノを抜き、三線がひとりで歌う。太鼓だけが残る。G7 で頭の C へ戻る
            C: {
                chords: 'C | F | G7 | C | C | F | G7 | G7',
                sanshin: SANSHIN_C,
                bass: 'R:8 5:8',
                drums: { tomLow: TAIKO }
            },
            // 最後の A'：三線が答え、G7 で頭の C へ戻る
            A3: {
                label: "A'",
                chords: CHORDS_LAST,
                lead: THEME_LAST,
                sanshin: SANSHIN_A.replace('r:4 E5:2 G5:2 E5:4 C5:4', 'r:16'),
                strum: STRUM,
                bass: BASS,
                drums: DRUMS_FILL
            }
        },
        intro: ['intro'],
        loop: ['A', 'A2', 'B', 'C', 'A3']
    };

    SoundKit.register('catalog', { songs: { okinawa } });
})();
