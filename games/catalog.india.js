/**
 * 曲の一覧：蓮池のラーガ（インド風・ニ音のドローンの上で、ミクソリディア旋法）
 * タンプーラ（低いギター）が D と A をずっと繰り返し、シタール（明るいギター）が裏で弦をかき鳴らす。タブラは高いタムと低いタム
 * 和音はほぼ D の上で動かす（C/D・G/D）。A' はサーランギ（弦楽器を滑らせる）が答え、B は A7 で少し張りつめる
 * 休憩の C はサーランギが長く滑らせて歌う。ループの終わりは C/D から D へ（ミクソリディアの♭VII → I）
 */
(function () {
    const { repeat } = SoundKit;

    // A の主題（前半7小節は最後の A でも同じ）。短い装飾音を前に付けて、シタールらしく
    const THEME_HEAD = `A4:4 D5:2 E5:2 F#5:8 | E5:1 F#5:1 G5:2 F#5:4 E5:4 D5:4 | E5:4 G5:4 C6:8 | B5:2 A5:2 F#5:4 A5:8 |
                        B5:4 D6:4 B5:2 A5:2 G5:4 | A5:6 F#5:2 D5:8 | C6:4 B5:2 A5:2 G5:4 E5:4`;
    const THEME = `${THEME_HEAD} | D5:12 r:4`;
    // ループの終わり：C/D で止めて、頭の D へ戻る
    const THEME_LAST = `${THEME_HEAD} | E5:8 G5:4 E5:4`;
    const CHORDS_A = 'D | D | C/D | D | G/D | D | C/D | D';
    const CHORDS_LAST = 'D | D | C/D | D | G/D | D | C/D | C/D';

    // A' のサーランギ：主題が伸ばしている所で、下から滑り込む
    const SARANGI_A = `r:8 E4~F#4:8 | r:16 | r:8 D4~E4:8 | r:8 E4~F#4:8 |
                       r:16 | r:8 F#4~A4:8 | r:16 | r:4 E4~F#4:8 r:4`;
    // 休憩のサーランギ：長く滑らせて歌う
    const SARANGI_C = 'D5~F#5:16 | E5:8 D5:8 | E5~G5:16 | F#5:8 D5:8 | G5~B5:16 | A5:8 F#5:8 | E5~G5:16 | E5:8 C5:8';

    // タンプーラ：和音に関わらず、A と D を繰り返す
    const TANPURA = 'A2:4 D3:4 D3:4 D2:4';
    // シタールの弦（チカリ）：裏でかき鳴らす
    const CHIKARI = '..x...x...x.x...';
    // タブラ：高いタム（ナ）と低いタム（ゲ）
    const TABLA = {
        tomHigh: repeat('x..x..x...x..x..', 8, '|'),
        tomLow: repeat('x.......x.....x.', 8, '|'),
        rim: repeat('....x.......x...', 8, '|')
    };

    // インド風：ドローンとタブラ
    const india = {
        title: '蓮池のラーガ',
        tags: ['神秘的', '落ち着いた'],
        genre: 'ワールド',
        melody: ['lead'],
        bpm: 92,
        gain: 0.112,
        reverb: { seconds: 2.4, tone: 0.45 },
        delay: { time: 0.75, feedback: 0.25, tone: 2200, reverb: 0.25 },
        humanize: { time: 0.008, velocity: 0.1 },
        parts: {
            lead: { instrument: 'piano', volume: 0.52, pan: -0.08, decay: 0.9, brightness: 0.85, reverb: 0.25, delay: 0.1 },
            // サーランギ：立ち上がりを速くし、ビブラートを深く
            sarangi: { instrument: 'strings', volume: 0.9, pan: 0.3, attack: 0.05, release: 0.4, brightness: 0.9, vibrato: 18, reverb: 0.35, delay: 0.2 },
            tanpura: { instrument: 'guitar', brightness: 0.7, sustain: 0.998, release: 0.6, volume: 0.78, pan: -0.2, reverb: 0.4 },
            sitar: { instrument: 'guitar', mode: 'chords', center: 'D4', voices: 3, strum: 0.015, brightness: 0.95, gate: 0.4, volume: 0.56, pan: 0.25, reverb: 0.3, delay: 0.15 },
            drums: { instrument: 'drums', kit: 'soft', mode: 'drums', volume: 0.6, cutoff: 7000, levels: { tomHigh: 0.5, tomLow: 0.6, rim: 0.3, shaker: 0.3 } }
        },
        sections: {
            // イントロ：タンプーラだけで始め、3小節目でシタールとタブラが入る
            intro: {
                label: 'イントロ',
                chords: 'D | D | C/D | C/D',
                tanpura: TANPURA,
                sitar: '................|................|' + CHIKARI + '|' + CHIKARI,
                drums: {
                    tomHigh: '................|................|' + repeat('x..x..x...x..x..', 2, '|'),
                    tomLow: '................|................|' + repeat('x.......x.....x.', 2, '|')
                }
            },
            A: {
                chords: CHORDS_A,
                lead: THEME,
                tanpura: TANPURA,
                sitar: CHIKARI,
                drums: TABLA
            },
            // A'：サーランギが下から滑り込んで答える
            A2: {
                label: "A'",
                chords: CHORDS_A,
                lead: THEME,
                sarangi: SARANGI_A,
                tanpura: TANPURA,
                sitar: CHIKARI,
                drums: TABLA
            },
            // B：G へ上がり、A7 で少し張りつめて休憩へ。シェイカーを足す
            B: {
                chords: 'G | G | D | D | C | C | A7sus4 | A7',
                lead: `D6:6 B5:2 G5:8 | B5:2 C6:2 B5:2 A5:2 G5:8 | F#5:4 A5:4 D6:8 | C6:2 B5:2 A5:4 F#5:8 |
                       E5:4 G5:4 C6:8 | D6:2 C6:2 B5:2 A5:2 G5:8 | D6:4 A5:4 E5:8 | C#6:8 A5:4 G5:4`,
                // A7 の小節だけ、タンプーラを A と E にする
                tanpura: repeat(TANPURA, 7, '|') + '|A2:4 E3:4 E3:4 A2:4',
                sitar: CHIKARI,
                drums: { ...TABLA, shaker: repeat('x.o.x.o.x.o.x.o.', 8, '|') }
            },
            // 休憩：ピアノとシタールを抜き、サーランギが長く滑らせて歌う。タブラは高いタムだけ
            C: {
                chords: 'D | D | C/D | D | G/D | D | C/D | C/D',
                sarangi: SARANGI_C,
                tanpura: TANPURA,
                drums: { tomHigh: repeat('x.....x.........', 8, '|') }
            },
            // 最後の A：全員で。C/D で頭の D へ戻る
            A3: {
                label: "A'",
                chords: CHORDS_LAST,
                lead: THEME_LAST,
                sarangi: SARANGI_A,
                tanpura: TANPURA,
                sitar: CHIKARI,
                drums: { ...TABLA, shaker: repeat('x.o.x.o.x.o.x.o.', 8, '|') }
            }
        },
        intro: ['intro'],
        loop: ['A', 'A2', 'B', 'C', 'A3']
    };

    SoundKit.register('catalog', { songs: { india } });
})();
