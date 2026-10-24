/**
 * 曲の一覧：海賊船の出航（海の男の歌・ニ短調の8分の6拍子で、甲板を踏み鳴らす）
 * 1小節は12ステップ（付点4分音符×2）。アコーディオンの「ブン・チャッチャ」に、足踏み（キック）と手拍子
 * A' はフィドル（弦楽器）が低く支え、B はヘ長調の方へ開いて、後半で船乗りたちの合唱が主題に重なる
 * 休憩の C はフィドルがひとりで、波に揺られるように歌う
 */
(function () {
    const { repeat } = SoundKit;

    // A の主題（前半15小節は最後の A でも同じ）
    const THEME_HEAD = `A4:2 D5:4 E5:2 F5:4 | A5:4 G5:2 F5:6 | E5:4 G5:2 C6:6 | G5:4 E5:2 C5:6 |
                        D5:4 F5:2 A5:4 D6:2 | D6:6 A5:6 | C#6:4 B5:2 A5:4 E5:2 | A5:12 |
                        D6:4 C6:2 A5:4 F5:2 | D5:4 F5:2 A5:6 | C6:4 A5:2 F5:6 | E5:4 G5:2 C6:6 |
                        D6:4 A5:2 F5:4 A5:2 | D6:6 Bb5:6 | A5:4 G5:2 E5:4 C#5:2`;
    const THEME = `${THEME_HEAD} | D5:12`;
    // ループの終わり：A で止めて、頭の Dm へ戻る
    const THEME_LAST = `${THEME_HEAD} | A5:6 E5:6`;
    const CHORDS_HEAD = `Dm | Dm | C | C | Dm | Dm | A | A |
                         Dm | Dm | F | C | Dm | Bb | A`;
    const CHORDS_A = `${CHORDS_HEAD} | Dm`;
    const CHORDS_LAST = `${CHORDS_HEAD} | A`;

    // A' のフィドル：和音の音を、低く伸ばして支える
    const FIDDLE_LOW = `F4:12 | F4:12 | E4:12 | E4:12 | F4:12 | F4:12 | E4:12 | E4:12 |
                        F4:12 | A4:12 | A4:12 | G4:12 | F4:12 | F4:12 | E4:12 | F4:12`;

    // B（8小節を2回）。後半で合唱が1オクターブ下で重なる
    const CHORDS_B_HALF = 'F | C | Dm | A | Bb | F | Gm:6 A:6 | A';
    const SONG_B = `C6:4 A5:2 F5:6 | E5:4 G5:2 C6:6 | D6:4 C6:2 A5:6 | C#6:6 A5:6 |
                    D6:4 C6:2 Bb5:6 | A5:4 G5:2 F5:6 | G5:4 Bb5:2 A5:4 C#6:2 | A5:12`;
    const CREW = `C5:4 A4:2 F4:6 | E4:4 G4:2 C5:6 | D5:4 C5:2 A4:6 | C#5:6 A4:6 |
                  D5:4 C5:2 Bb4:6 | A4:4 G4:2 F4:6 | G4:4 Bb4:2 A4:4 C#5:2 | A4:12`;

    // アコーディオン：「ブン・チャッチャ」の「チャッチャ」。ベースが「ブン」
    const SQUEEZE = '..x-x-..x-x-';
    const BASS = 'R:6 5:6';
    // 足踏み・手拍子・タンバリン
    const STOMP = repeat('x.....x.....', 16, '|');
    const CLAP = repeat('....x.....x.', 16, '|');
    const TAMB = repeat('x.x.x.x.x.x.', 16, '|');

    // 海の男の歌：アコーディオンと足踏み
    const shanty = {
        title: '海賊船の出航',
        tags: ['明るい', '軽快'],
        genre: 'ワールド',
        meter: '6/8',
        melody: ['lead'],
        bpm: 132,
        stepsPerBar: 12,
        gain: 0.09,
        reverb: { seconds: 1.8, tone: 0.45 },
        delay: { time: 1.5, feedback: 0.15, tone: 2200 },
        humanize: { time: 0.006, velocity: 0.1 },
        parts: {
            lead: { instrument: 'piano', volume: 0.56, pan: -0.08, decay: 0.8, brightness: 0.85, reverb: 0.2, delay: 0.06 },
            fiddle: { instrument: 'strings', volume: 1.05, pan: 0.3, attack: 0.06, release: 0.3, brightness: 1, vibrato: 12, reverb: 0.3 },
            crew: { instrument: 'choir', volume: 0.55, pan: 0.1, attack: 0.06, release: 0.25, vibrato: 8, reverb: 0.35 },
            squeeze: { instrument: 'accordion', mode: 'chords', center: 'E4', voices: 3, volume: 0.76, pan: -0.25, release: 0.06, reverb: 0.2 },
            bass: { instrument: 'pluck', mode: 'bass', octave: 2, brightness: 0.35, sustain: 0.994, release: 0.08, volume: 0.85, gate: 0.6 },
            drums: { instrument: 'drums', kit: 'soft', mode: 'drums', volume: 0.6, cutoff: 7500, levels: { kick: 0.6, clap: 0.4, shaker: 0.3 } }
        },
        sections: {
            // イントロ：足踏みと手拍子から、アコーディオンが入る。A で主題へ
            intro: {
                label: 'イントロ',
                chords: 'Dm | Dm | C | A',
                squeeze: '............|' + repeat(SQUEEZE, 3, '|'),
                bass: { pattern: `r:12 | ${BASS} | ${BASS} | ${BASS}` },
                drums: { kick: repeat('x.....x.....', 4, '|'), clap: repeat('....x.....x.', 4, '|') }
            },
            A: {
                chords: CHORDS_A,
                lead: THEME,
                squeeze: SQUEEZE,
                bass: BASS,
                drums: { kick: STOMP, clap: CLAP }
            },
            // A'：フィドルが低く支え、タンバリンを足す
            A2: {
                label: "A'",
                chords: CHORDS_A,
                lead: THEME,
                fiddle: FIDDLE_LOW,
                squeeze: SQUEEZE,
                bass: BASS,
                drums: { kick: STOMP, clap: CLAP, shaker: TAMB }
            },
            // B：ヘ長調の方へ開く。後半は船乗りたちの合唱が重なる。A で休憩へ
            B: {
                chords: `${CHORDS_B_HALF} | ${CHORDS_B_HALF}`,
                lead: SONG_B,
                crew: `${repeat('r:12', 8, '|')} | ${CREW}`,
                squeeze: SQUEEZE,
                bass: BASS,
                drums: { kick: STOMP, clap: CLAP, shaker: TAMB }
            },
            // 休憩：ピアノと手拍子を抜き、フィドルがひとりで歌う。足踏みだけが残る。A で頭の Dm へ戻る
            C: {
                chords: 'Dm | C | Dm | A | Dm | C | Dm | A',
                fiddle: 'F5:12 | E5:6 G5:6 | A5:6 D5:6 | C#5:12 | D5:6 F5:6 | G5:6 E5:6 | F5:6 A5:6 | E5:12',
                squeeze: 'x-----......',
                bass: 'R:12',
                drums: { kick: repeat('x...........', 8, '|') }
            },
            // 最後の A'：フィドルと合唱を重ねて、A で頭の Dm へ戻る
            A3: {
                label: "A'",
                chords: CHORDS_LAST,
                lead: THEME_LAST,
                fiddle: FIDDLE_LOW.replace(/F4:12$/, 'E4:12'),
                squeeze: SQUEEZE,
                bass: BASS,
                drums: { kick: STOMP, clap: CLAP, shaker: TAMB }
            }
        },
        intro: ['intro'],
        loop: ['A', 'A2', 'B', 'C', 'A3']
    };

    SoundKit.register('catalog', { songs: { shanty } });
})();
