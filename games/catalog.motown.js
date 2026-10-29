/**
 * 曲の一覧：日曜の街角ソウル（モータウン風のソウル・ハ長調で、明るく弾む）
 * タンバリンのつもりのシェイカーが4拍を刻み、スネアが2・4拍を打つ。ベースは跳ねる音型で歌い、ギターが2・4拍を短く切る
 * 主題は拍の裏を休んで弾ませる。ホーンは主題が伸ばしている所で「パッパッ」と答える。A' からオルガンが和音を伸ばす
 * B はヘ長調の方から巡り、タンバリンが8分に増える。休憩の C はピアノを抜き、弦がひとりで歌う。最後の A' は G7 で頭の C へ戻る
 */
(function () {
    const { repeat } = SoundKit;

    // A の主題（前半7小節は A' でも同じ）。拍の裏を休んで弾ませる
    const THEME_HEAD = `E5:2 G5:2 r:2 C6:2 r:2 A5:2 G5:4 | E5:6 D5:2 C5:8 |
                        F5:2 A5:2 r:2 C6:2 r:2 D6:2 C6:4 | B5:6 A5:2 G5:8 |
                        G5:2 C6:2 r:2 D6:2 r:2 C6:2 G5:4 | A5:6 C6:2 E5:8 | F5:4 A5:4 B5:4 D6:4`;
    const THEME = `${THEME_HEAD} | C6:12 r:4`;
    // A' の終わり：C7 で止めて、B の F へ
    const THEME_TURN = `${THEME_HEAD} | C6:4 G5:4 E5:4 Bb5:4`;
    // ループの終わり：G7 で止めて、頭の C へ
    const THEME_LAST = `${THEME_HEAD} | B5:4 D6:4 B5:4 G5:4`;
    const CHORDS_HEAD = 'C | Am | F | G | C | Am | Dm7:8 G7:8';
    const CHORDS_A = `${CHORDS_HEAD} | C`;
    const CHORDS_A2 = `${CHORDS_HEAD} | C7`;
    const CHORDS_LAST = `${CHORDS_HEAD} | G7`;

    // ホーンの合いの手：主題が伸ばしている2・4・6・8小節目の後半で答える
    const HORNS = '................|..........x.x...|................|..........x.x...|' +
                  '................|..........x.x...|................|....x.x.........';

    // B：ヘ長調の方から巡り、G で休憩へ
    const CHORDS_B = 'F | G | Em7 | Am7 | Dm7 | Em7 | F:8 G:8 | Gsus4:8 G:8';
    const SONG_B = `A5:6 G5:2 F5:4 A5:4 | B5:6 A5:2 G5:4 D5:4 | G5:6 E5:2 B5:8 | C6:6 B5:2 A5:8 |
                    F5:4 A5:4 C6:4 A5:4 | G5:4 B5:4 D6:8 | C6:4 A5:4 B5:4 D6:4 | C6:8 B5:8`;

    // 休憩：弦がひとりで歌う。G7 で最後の A' へ
    const CHORDS_C = 'Am | F | C | G | Am | F | Dm7 | G7';
    const STRINGS_C = `C6:8 A5:8 | A5:8 F5:8 | E5:8 G5:8 | B5:12 D6:4 |
                       C6:8 E5:8 | F5:8 C6:8 | D6:8 A5:8 | G5:8 F5:8`;

    // 歌うベース：跳ねる音型で、根音・3度・5度を行き来する
    const BASS = 'R:3 R:1 3:2 5:2 R+:3 5:1 3:2 R:2';
    const CHOP = '....x.......x...';
    const KICK = repeat('x.......x.x.....', 8, '|');
    const SNARE = repeat('....x.......x...', 8, '|');
    // タンバリンのつもり：A は4拍、B は8分で
    const TAMB = repeat('x...x...x...x...', 8, '|');
    const TAMB_B = repeat('x.o.x.o.x.o.x.o.', 8, '|');
    const DRUMS = { kick: KICK, snare: SNARE, shaker: TAMB };
    const DRUMS_B = { kick: KICK, snare: repeat('....x.......x...', 7, '|') + '|....x.......x.xx', shaker: TAMB_B };

    // モータウン：タンバリンとホーン、歌うベース
    const motown = {
        title: '日曜の街角ソウル',
        tags: ['明るい', '軽快'],
        genre: 'ファンク・ソウル',
        melody: ['lead'],
        bpm: 116,
        swing: 0.05,
        swingUnit: 1,
        gain: 0.12,
        reverb: { seconds: 1.6, tone: 0.5 },
        delay: { time: 0.75, feedback: 0.2, tone: 2200, reverb: 0.2 },
        humanize: { time: 0.005, velocity: 0.1 },
        parts: {
            lead: { instrument: 'piano', volume: 0.5, pan: -0.08, decay: 0.7, brightness: 0.85, reverb: 0.2, delay: 0.08 },
            // 休憩の C で歌う弦
            solo: { instrument: 'strings', volume: 1.1, pan: 0.15, attack: 0.12, release: 0.4, brightness: 0.85, vibrato: 10, reverb: 0.35 },
            // ホーンの合いの手：短く「パッ」と
            horns: { instrument: 'brass', mode: 'chords', center: 'F4', voices: 3, gate: 0.6, volume: 0.7, pan: 0.3, brightness: 3.5, release: 0.08, reverb: 0.2 },
            organ: { instrument: 'organ', mode: 'chords', center: 'E4', voices: 3, volume: 0.42, pan: -0.2, reverb: 0.25 },
            // ギターは2・4拍を短く切る
            guitar: { instrument: 'guitar', mode: 'chords', center: 'G4', voices: 3, strum: 0.006, gate: 0.2, brightness: 0.6, volume: 0.8, pan: 0.25, reverb: 0.15 },
            bass: { instrument: 'pluck', mode: 'bass', octave: 2, brightness: 0.45, volume: 0.65 },
            drums: { instrument: 'drums', kit: 'soft', mode: 'drums', volume: 0.8, cutoff: 7500, levels: { kick: 0.6, snare: 0.45, shaker: 0.45 } }
        },
        sections: {
            // イントロ：タンバリンとスネアから、ベースとギターが入る。ホーンが答えて G で主題へ
            intro: {
                label: 'イントロ',
                chords: 'C | Am | F | G',
                guitar: CHOP,
                horns: '................|................|................|....x.x.x.......',
                bass: { pattern: `r:16 | ${BASS} | ${BASS} | ${BASS}` },
                drums: {
                    shaker: repeat('x...x...x...x...', 4, '|'),
                    snare: repeat('....x.......x...', 4, '|'),
                    kick: '................|' + repeat('x.......x.x.....', 3, '|')
                }
            },
            A: {
                chords: CHORDS_A,
                lead: THEME,
                horns: HORNS,
                guitar: CHOP,
                bass: BASS,
                drums: DRUMS
            },
            // A'：オルガンが和音を伸ばし、C7 で B へ
            A2: {
                label: "A'",
                chords: CHORDS_A2,
                lead: THEME_TURN,
                horns: HORNS,
                organ: 'hold',
                guitar: CHOP,
                bass: BASS,
                drums: DRUMS
            },
            // B：ヘ長調の方から巡り、タンバリンが8分に増える
            B: {
                chords: CHORDS_B,
                lead: SONG_B,
                organ: 'hold',
                guitar: CHOP,
                bass: BASS,
                drums: DRUMS_B
            },
            // 休憩：ピアノとホーンを抜き、弦がひとりで歌う。ドラムはキックとタンバリンだけ
            C: {
                chords: CHORDS_C,
                solo: STRINGS_C,
                guitar: CHOP,
                bass: 'R:6 5:2 R:8',
                drums: { kick: KICK, shaker: TAMB }
            },
            // 最後の A'：オルガンとホーン。G7 で頭の C へ戻る
            A3: {
                label: "A'",
                chords: CHORDS_LAST,
                lead: THEME_LAST,
                horns: HORNS,
                organ: 'hold',
                guitar: CHOP,
                bass: BASS,
                drums: DRUMS_B
            }
        },
        intro: ['intro'],
        loop: ['A', 'A2', 'B', 'C', 'A3']
    };

    SoundKit.register('catalog', { songs: { motown } });
})();
