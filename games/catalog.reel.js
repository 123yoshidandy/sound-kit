/**
 * 曲の一覧：港町のリール（ケルトのリール・ニ長調の4拍子で、速く踊る）
 * ギターが8分で弾むように刻み、バウロン（タム）が16分で転がる。主題は分散和音で駆け上がって跳ねる
 * A' はフィドル（弦楽器）が低く伸ばして支え、B はロ短調から。B' はティンホイッスル（フルート）が主題に重なる
 * 休憩の C はピアノを抜き、フィドルがひとりで歌う。バウロンは1拍ずつに
 */
(function () {
    const { repeat } = SoundKit;

    // A の主題（前半7小節は最後の A でも同じ）
    const THEME_HEAD = `A5:2 F#5:2 A5:4 D6:4 A5:4 | G5:2 B5:2 D6:4 B5:4 G5:4 | F#5:4 A5:2 D6:2 A5:4 F#5:4 | E5:2 F#5:2 A5:4 C#6:4 A5:4 |
                        A5:2 F#5:2 A5:4 D6:4 F#5:4 | B5:2 A5:2 G5:4 D6:4 B5:4 | G5:4 E5:4 A5:4 C#6:4`;
    const THEME = `${THEME_HEAD} | D6:8 A5:8`;
    // ループの終わり：A7 で止めて、頭の D へ戻る
    const THEME_LAST = `${THEME_HEAD} | C#6:4 A5:4 E5:4 G5:4`;
    const CHORDS_HEAD = 'D | G | D | A | D | G | Em:8 A:8';
    const CHORDS_A = `${CHORDS_HEAD} | D`;
    const CHORDS_LAST = `${CHORDS_HEAD} | A7`;

    // A' のフィドル：和音の音を、低く伸ばして支える
    const FIDDLE_LOW = 'F#4:16 | G4:16 | A4:16 | E4:16 | F#4:16 | G4:16 | G4:8 E4:8 | F#4:16';

    // B：ロ短調から。A で次へ
    const CHORDS_B = 'Bm | G | D | A | Bm | G | Em | A';
    const SONG_B = `F#5:2 B5:2 D6:4 B5:4 F#5:4 | G5:2 B5:2 D6:4 B5:8 | A5:4 F#5:2 A5:2 D6:8 | C#6:4 B5:2 A5:2 E5:8 |
                    D6:2 C#6:2 B5:4 F#5:4 B5:4 | D6:4 B5:2 G5:2 B5:4 D6:4 | E5:2 G5:2 B5:4 G5:4 E5:4 | C#6:4 A5:4 E5:4 A5:4`;

    // 休憩のフィドル：ひとりで、ゆったり歌う。A で頭の D へ
    const CHORDS_C = 'D | G | D | A | Bm | G | Em:8 A:8 | A';
    const FIDDLE_C = `F#5:8 A5:8 | B5:8 G5:8 | A5:4 F#5:4 D5:8 | E5:16 |
                      F#5:8 D5:8 | B4:8 D5:8 | E5:4 G5:4 A5:4 C#6:4 | A5:8 E5:8`;

    // ギターの刻みとベース
    const STRUM = 'x...x-..x...x-..';
    const BASS = 'R:4 5:4 R:4 5:4';
    // バウロン：低い音で拍を打ち、16分で転がす
    const BODHRAN = { tomLow: repeat('x.......x.......', 8, '|'), tom: repeat('..xo..xo..xo..xo', 8, '|') };
    const BODHRAN_CLAP = { ...BODHRAN, clap: repeat('....x.......x...', 8, '|') };

    // リール：フィドルとティンホイッスル、バウロン
    const reel = {
        title: '港町のリール',
        tags: ['明るい', '軽快'],
        genre: 'ワールド',
        melody: ['lead'],
        bpm: 116,
        gain: 0.093,
        reverb: { seconds: 1.6, tone: 0.5 },
        delay: { time: 0.75, feedback: 0.15, tone: 2400 },
        humanize: { time: 0.005, velocity: 0.1 },
        parts: {
            lead: { instrument: 'piano', volume: 0.57, pan: -0.08, decay: 0.75, brightness: 0.85, reverb: 0.18, delay: 0.06 },
            fiddle: { instrument: 'strings', volume: 0.95, pan: 0.3, attack: 0.05, release: 0.25, brightness: 0.95, vibrato: 10, reverb: 0.3 },
            // ティンホイッスルのつもり：息の音の少ないフルート
            whistle: { instrument: 'flute', volume: 0.32, pan: 0.25, breath: 0.03, vibrato: 8, attack: 0.02, release: 0.1, reverb: 0.3, delay: 0.1 },
            guitar: { instrument: 'guitar', mode: 'chords', center: 'D4', voices: 3, strum: 0.006, brightness: 0.7, gate: 0.5, volume: 0.69, pan: -0.28, reverb: 0.18 },
            bass: { instrument: 'synthBass', mode: 'bass', octave: 2, wave: 'triangle', cutoff: 300, envelope: 0.6, decay: 0.3, sustain: 0.45, release: 0.05, volume: 0.6, gate: 0.75 },
            drums: { instrument: 'drums', kit: 'soft', mode: 'drums', volume: 0.8, cutoff: 7000, levels: { tomLow: 0.6, tom: 0.4, clap: 0.35 } }
        },
        sections: {
            // イントロ：バウロンから、ギターが入る。A で主題へ
            intro: {
                label: 'イントロ',
                chords: 'D | G | D | A',
                guitar: '................|................|' + STRUM + '|' + STRUM,
                bass: { pattern: `r:16 | r:16 | ${BASS} | ${BASS}` },
                drums: { tomLow: repeat('x.......x.......', 4, '|'), tom: repeat('..xo..xo..xo..xo', 4, '|') }
            },
            A: {
                chords: CHORDS_A,
                lead: THEME,
                guitar: STRUM,
                bass: BASS,
                drums: BODHRAN
            },
            // A'：フィドルが低く支える
            A2: {
                label: "A'",
                chords: CHORDS_A,
                lead: THEME,
                fiddle: FIDDLE_LOW,
                guitar: STRUM,
                bass: BASS,
                drums: BODHRAN
            },
            // B：ロ短調から。手拍子を足す
            B: {
                chords: CHORDS_B,
                lead: SONG_B,
                guitar: STRUM,
                bass: BASS,
                drums: BODHRAN_CLAP
            },
            // B'：ティンホイッスルが主題に重なる。A で休憩へ
            B2: {
                label: "B'",
                chords: CHORDS_B,
                lead: SONG_B,
                whistle: SONG_B,
                guitar: STRUM,
                bass: BASS,
                drums: BODHRAN_CLAP
            },
            // 休憩：ピアノと手拍子を抜き、フィドルがひとりで歌う。バウロンは1拍ずつ。A で頭の D へ戻る
            C: {
                chords: CHORDS_C,
                fiddle: FIDDLE_C,
                guitar: 'x-------x-------',
                bass: 'R:8 5:8',
                drums: { tomLow: repeat('x.......x.......', 8, '|'), tom: repeat('....x.......x...', 8, '|') }
            },
            // 最後の A'：フィドルとティンホイッスルを重ね、A7 で頭の D へ戻る
            A3: {
                label: "A'",
                chords: CHORDS_LAST,
                lead: THEME_LAST,
                whistle: THEME_LAST,
                fiddle: FIDDLE_LOW.replace(/F#4:16$/, 'E4:16'),
                guitar: STRUM,
                bass: BASS,
                drums: BODHRAN_CLAP
            }
        },
        intro: ['intro'],
        loop: ['A', 'A2', 'B', 'B2', 'C', 'A3']
    };

    SoundKit.register('catalog', { songs: { reel } });
})();
