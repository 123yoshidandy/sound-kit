/**
 * 曲の一覧：祭り囃子（和風のお祭り・ニ長調の陽音階 D E G A B で、軽快に）
 * 太鼓（低いタムと中くらいのタム）の「ドン・ドコ」に、鉦（リム）が「チキチン」と細かく刻む。三味線のつもりの明るいギターが8分の裏で弾む
 * A' は笛（フルート）が主題の伸ばしに短く答え、B はロ短調から少しせつなく。B' で笛が上から重なる
 * 休憩の C はピアノを抜いて、笛がひとりで歌う。鉦を抜き、太鼓だけが残る
 */
(function () {
    const { repeat } = SoundKit;

    // A の主題（前半7小節は最後の A でも同じ）。陽音階 D E G A B が中心
    const THEME_HEAD = `D5:2 E5:2 A5:4 B5:2 A5:2 A5:4 | B5:4 D6:4 B5:2 A5:2 G5:4 | A5:2 B5:2 A5:2 E5:2 D5:8 | E5:4 A5:4 B5:2 A5:2 E5:4 |
                        B5:4 A5:2 B5:2 D6:8 | D6:4 B5:2 A5:2 G5:4 E5:4 | G5:4 B5:4 A5:4 E5:4`;
    const THEME = `${THEME_HEAD} | D5:12 r:4`;
    // ループの終わり：A で止めて、頭の D へ戻る
    const THEME_LAST = `${THEME_HEAD} | E5:4 A5:4 B5:4 A5:4`;
    const CHORDS_A = 'D | G | D | A | Bm | G | Em:8 A:8 | D';
    const CHORDS_LAST = 'D | G | D | A | Bm | G | Em:8 A:8 | A';

    // A' の笛：主題が伸ばしている所に、短く答える
    const FUE_A = `r:16 | r:16 | r:8 A5:2 B5:2 D6:4 | r:16 | r:8 F#5:4 A5:4 | r:16 | r:16 | r:4 A5:4 B5:4 D6:4`;

    // B の主題（B' でも同じ）。ロ短調から少しせつなく、A で戻る
    const CHORDS_B = 'Bm | G | A | D | Bm | Em | G:8 A:8 | A';
    const SONG_B = `B5:6 A5:2 F#5:8 | G5:4 B5:4 D6:8 | C#6:6 B5:2 A5:8 | F#5:4 A5:4 D6:8 |
                    D6:6 B5:2 A5:4 F#5:4 | G5:4 E5:4 B5:8 | D6:4 B5:4 C#6:4 A5:4 | E5:4 A5:4 B5:4 C#6:4`;
    // B' の笛：主題の伸ばしに、上から重なる
    const FUE_B = `r:8 B5:4 D6:4 | r:8 G5:4 B5:4 | r:8 E5:4 A5:4 | r:8 D6:4 A5:4 |
                   r:8 F#5:4 B5:4 | r:8 G5:4 B5:4 | r:16 | A5:16`;

    // 休憩の笛：ひとりで歌う
    const FUE_C = `A5:8 B5:8 | D6:12 B5:4 | A5:8 E5:8 | E5:16 |
                   F#5:8 D5:8 | G5:8 B5:8 | G5:8 E5:8 | E5:8 A5:8`;

    // 三味線（明るいギター）の裏打ちと、ベース
    const STRUM = '..x-..x-..x-..x-';
    const BASS = 'R:4 5:4 R:4 5:4';
    // 太鼓の「ドン・ドコ」と、鉦の「チキチン」
    const TAIKO_LOW = repeat('x.......x...x.x.', 8, '|');
    const TAIKO_MID = repeat('....x.......x...', 8, '|');
    const KANE = repeat('x.xx..x.x.xx..x.', 8, '|');
    const DRUMS = { tomLow: TAIKO_LOW, tomMid: TAIKO_MID, rim: KANE };
    const DRUMS_FILL = { ...DRUMS, tomMid: repeat('....x.......x...', 7, '|') + '|....x...x.x.xxxx' };

    // 祭り：太鼓と鉦、笛
    const matsuri = {
        title: '祭り囃子',
        tags: ['明るい', '軽快'],
        genre: 'ワールド',
        melody: ['lead'],
        bpm: 132,
        gain: 0.091,
        reverb: { seconds: 1.6, tone: 0.5 },
        delay: { time: 0.75, feedback: 0.2, tone: 2400 },
        humanize: { time: 0.005, velocity: 0.1 },
        parts: {
            lead: { instrument: 'piano', volume: 0.57, pan: -0.08, decay: 0.75, brightness: 0.85, reverb: 0.18, delay: 0.08 },
            // 笛のつもり：息の音を少し多めに
            fue: { instrument: 'flute', volume: 0.5, pan: 0.25, breath: 0.08, vibrato: 10, attack: 0.04, release: 0.12, reverb: 0.3, delay: 0.15 },
            // 三味線のつもり：明るいギターを短く切る
            strum: { instrument: 'guitar', mode: 'chords', center: 'F#4', voices: 3, strum: 0.006, brightness: 0.9, gate: 0.35, volume: 0.6, pan: 0.3, reverb: 0.15 },
            bass: { instrument: 'synthBass', mode: 'bass', octave: 2, wave: 'triangle', cutoff: 300, envelope: 0.6, decay: 0.3, sustain: 0.45, release: 0.06, volume: 0.6, gate: 0.75 },
            drums: { instrument: 'drums', kit: 'soft', mode: 'drums', volume: 0.6, cutoff: 7500, levels: { tomLow: 0.7, tomMid: 0.55, rim: 0.35, clap: 0.35 } }
        },
        sections: {
            // イントロ：太鼓の打ち込みに笛の呼び声。A で主題へ
            intro: {
                label: 'イントロ',
                chords: 'D | G | D | A',
                fue: 'A5:4 B5:4 D6:8 | B5:4 A5:4 G5:8 | A5:4 B5:4 A5:4 E5:4 | E5:16',
                strum: '................|................|' + STRUM + '|' + STRUM,
                bass: { pattern: `r:16 | r:16 | ${BASS} | ${BASS}` },
                drums: {
                    tomLow: 'x.......x.......|x.......x.......|x.......x...x.x.|x.......x...x.x.',
                    tomMid: '................|................|....x.......x...|....x...x.x.xxxx',
                    rim: '................|................|' + repeat('x.xx..x.x.xx..x.', 2, '|')
                }
            },
            A: {
                chords: CHORDS_A,
                lead: THEME,
                strum: STRUM,
                bass: BASS,
                drums: DRUMS
            },
            // A'：笛が短く答える
            A2: {
                label: "A'",
                chords: CHORDS_A,
                lead: THEME,
                fue: FUE_A,
                strum: STRUM,
                bass: BASS,
                drums: DRUMS_FILL
            },
            // B：ロ短調から少しせつなく。手拍子を足す。A で B' へ
            B: {
                chords: CHORDS_B,
                lead: SONG_B,
                strum: STRUM,
                bass: BASS,
                drums: { ...DRUMS, clap: repeat('....x.......x...', 8, '|') }
            },
            // B'：笛が上から重なる。A で休憩へ
            B2: {
                label: "B'",
                chords: CHORDS_B,
                lead: SONG_B,
                fue: FUE_B,
                strum: STRUM,
                bass: BASS,
                drums: { ...DRUMS_FILL, clap: repeat('....x.......x...', 8, '|') }
            },
            // 休憩：ピアノと鉦を抜き、笛がひとりで歌う。太鼓だけが残る。A で頭の D へ戻る
            C: {
                chords: 'D | G | D | A | Bm | G | Em | A',
                fue: FUE_C,
                strum: '..x-......x-....',
                bass: 'R:8 5:8',
                drums: { tomLow: repeat('x.......x.......', 8, '|') }
            },
            // 最後の A'：笛が答え、A で頭の D へ戻る
            A3: {
                label: "A'",
                chords: CHORDS_LAST,
                lead: THEME_LAST,
                fue: FUE_A.replace(/\| r:4 A5:4 B5:4 D6:4$/, '| r:16'),
                strum: STRUM,
                bass: BASS,
                drums: DRUMS_FILL
            }
        },
        intro: ['intro'],
        loop: ['A', 'A2', 'B', 'B2', 'C', 'A3']
    };

    SoundKit.register('catalog', { songs: { matsuri } });
})();
