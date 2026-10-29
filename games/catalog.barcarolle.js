/**
 * 曲の一覧：ゴンドラの舟歌（クラシック・ヘ長調の8分の6拍子で、ゆったり揺れる）
 * 1小節は12ステップ（付点4分音符×2）。ハープのつもりのギターが8分で上り下りする分散和音を弾き、水面のように揺らす
 * ドラムは入れない。A' から弦が和音を伸ばし、B はニ短調へ陰って、A7 から Dm へ落ち着く
 * 休憩の C はピアノを抜き、弦がひとりで歌う。最後の A は弦が低く対旋律を添え、B' の C7 で頭の F へ戻る
 */
(function () {
    // A の主題（前半7小節は A' でも同じ）。「ター・タ」の舟歌のはずみで、長い音を置く
    const THEME_HEAD = `A5:4 G5:2 C6:6 | D6:4 C6:2 A5:6 | Bb5:4 A5:2 G5:4 D5:2 | E5:6 G5:4 Bb5:2 |
                        A5:6 C6:6 | D6:4 C6:2 Bb5:6 | G5:4 Bb5:2 E5:4 G5:2`;
    const THEME = `${THEME_HEAD} | F5:12`;
    // A' の終わり：A7 で止めて、ニ短調の B へ
    const THEME_TURN = `${THEME_HEAD} | F5:6 E5:6`;
    const CHORDS_HEAD = 'F | Dm | Gm | C7 | F | Bb | Gm:6 C7:6';
    const CHORDS_A = `${CHORDS_HEAD} | F`;
    const CHORDS_A2 = `${CHORDS_HEAD} | F:6 A7:6`;

    // B：ニ短調へ陰り、C7 で次の F へ
    const CHORDS_B = 'Dm | Am | Bb | F | Gm | Dm | Gm:6 A7:6 | Dm:6 C7:6';
    const SONG_B = `F5:4 A5:2 D6:6 | C6:4 E5:2 A5:6 | F5:4 Bb5:2 D6:6 | C6:6 A5:6 |
                    Bb5:4 D6:2 G5:6 | A5:4 F5:2 D5:6 | G5:4 Bb5:2 A5:4 C#6:2 | D6:6 C6:4 Bb5:2`;

    // 休憩：弦がひとりで歌う。C7 で最後の A へ
    const CHORDS_C = 'Bb | F | Gm | Dm | Bb | F | Gm | C7';
    const SOLO_C = 'D5:12 | C5:6 A5:6 | Bb5:12 | A5:6 F5:6 | D6:12 | C6:6 A5:6 | G5:6 Bb5:6 | E5:6 G5:6';

    // 最後の A：弦が低く対旋律を添える
    const COUNTER = 'F4:12 | F4:12 | D4:12 | E4:12 | F4:12 | D4:12 | D4:6 E4:6 | F4:12';

    // ハープのつもりの分散和音：8分で上って下りる。ベースは付点4分で根音と5度
    const HARP = '0:2 1 2 3 2 1';
    const BASS = 'R:6 5:6';

    // 舟歌：ハープ風の分散和音と弦、ドラムなし
    const barcarolle = {
        title: 'ゴンドラの舟歌',
        tags: ['落ち着いた'],
        genre: 'クラシック',
        meter: '6/8',
        melody: ['lead'],
        bpm: 84,
        stepsPerBar: 12,
        gain: 0.12,
        reverb: { seconds: 2.6, tone: 0.45 },
        delay: { time: 1.5, feedback: 0.2, tone: 2000, reverb: 0.3 },
        humanize: { time: 0.008, velocity: 0.1 },
        parts: {
            lead: { instrument: 'piano', volume: 0.52, pan: -0.08, decay: 0.9, brightness: 0.75, reverb: 0.28, delay: 0.1 },
            // 休憩の C で歌う弦
            solo: { instrument: 'strings', volume: 1, pan: 0.15, attack: 0.15, release: 0.5, brightness: 0.8, vibrato: 9, reverb: 0.4 },
            // 最後の A で低く添える弦
            counter: { instrument: 'strings', volume: 0.7, pan: 0.25, attack: 0.2, release: 0.5, brightness: 0.7, vibrato: 7, reverb: 0.4 },
            // A' と B で和音を伸ばす弦
            strings: { instrument: 'strings', mode: 'chords', center: 'C4', voices: 3, volume: 0.4, pan: -0.2, attack: 0.5, release: 0.8, brightness: 0.6, reverb: 0.45 },
            // ハープのつもり：明るいギターで分散和音
            harp: { instrument: 'guitar', mode: 'arp', from: 'F3', brightness: 0.8, volume: 0.45, pan: 0.25, reverb: 0.35, delay: 0.1 },
            bass: { instrument: 'pluck', mode: 'bass', octave: 2, brightness: 0.35, volume: 0.8 }
        },
        sections: {
            // イントロ：ハープとベースで揺れ、C7 で主題へ
            intro: {
                label: 'イントロ',
                chords: 'F | Bb | Gm | C7',
                harp: HARP,
                bass: BASS
            },
            A: {
                chords: CHORDS_A,
                lead: THEME,
                harp: HARP,
                bass: BASS
            },
            // A'：弦が和音を伸ばす。A7 で B へ
            A2: {
                label: "A'",
                chords: CHORDS_A2,
                lead: THEME_TURN,
                harp: HARP,
                strings: 'hold',
                bass: BASS
            },
            // B：ニ短調へ陰る
            B: {
                chords: CHORDS_B,
                lead: SONG_B,
                harp: HARP,
                strings: 'hold',
                bass: BASS
            },
            // 休憩：ピアノを抜き、弦がひとりで歌う。ハープは4分と8分にゆるめる
            C: {
                chords: CHORDS_C,
                solo: SOLO_C,
                harp: '0:4 2:2 1:4 2:2',
                bass: 'R:12'
            },
            // 最後の A：弦が低く対旋律を添える
            A3: {
                label: 'A',
                chords: CHORDS_A,
                lead: THEME,
                counter: COUNTER,
                harp: HARP,
                bass: BASS
            },
            // B'：弦が和音を伸ばし、C7 で頭の F へ戻る
            B2: {
                label: "B'",
                chords: CHORDS_B,
                lead: SONG_B,
                harp: HARP,
                strings: 'hold',
                bass: BASS
            }
        },
        intro: ['intro'],
        loop: ['A', 'A2', 'B', 'C', 'A3', 'B2']
    };

    SoundKit.register('catalog', { songs: { barcarolle } });
})();
