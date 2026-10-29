/**
 * 曲の一覧：魔法学校の星の塔（ゲーム音楽・ニ長調の3拍子で、明るく、少し不思議に）
 * チェレスタのつもりのオルゴールが3拍子の分散和音を回し、ニ短調から借りた Gm の和音で、魔法がかかったような陰りを入れる
 * A' はベルが主題の伸ばしに答え、弦が和音を伸ばす。B はロ短調から巡り、合唱と打楽器が加わる
 * 休憩の C はピアノを抜き、弦がひとりで歌い、合唱が静かに支える。最後の B' は A7 で頭の D へ戻る
 */
(function () {
    const { repeat } = SoundKit;

    // A の主題（前半6小節は A' でも同じ）
    const THEME_HEAD = `D5:4 F#5:4 A5:4 | B5:8 A5:2 F#5:2 | G5:4 B5:4 D6:4 | C#6:8 A5:4 |
                        D6:4 A5:4 F#5:4 | G5:8 Bb5:4 | G5:4 E5:4 C#5:4`;
    const THEME = `${THEME_HEAD} | D5:12`;
    // A' の終わり：A7 で止めて、B へ
    const THEME_TURN = `${THEME_HEAD} | A5:4 G5:4 E5:4`;
    const CHORDS_HEAD = 'D | Bm | G | A7 | D | Gm | Em:8 A7:4';
    const CHORDS_A = `${CHORDS_HEAD} | D`;
    const CHORDS_A2 = `${CHORDS_HEAD} | A7`;

    // ベル：主題が伸ばしている所で、星がまたたくように答える
    const BELL_A = 'r:12 | r:12 | r:12 | r:4 E6:4 r:4 | r:12 | r:4 D6:4 r:4 | r:12 | r:8 F#6:4';

    // B：ロ短調から巡り、A7 で次へ
    const CHORDS_B = 'Bm | F#7 | Bm | G | Em | F#7 | Bm | A7';
    const SONG_B = `F#5:4 B5:4 D6:4 | C#6:8 A#5:4 | B5:8 F#5:4 | G5:4 B5:4 D6:4 |
                    B5:8 G5:4 | F#5:4 A#5:4 C#6:4 | D6:8 B5:4 | C#6:4 A5:4 E5:4`;
    const BELL_B = 'r:12 | r:8 F#6:4 | r:12 | r:12 | r:12 | r:8 E6:4 | r:12 | r:12';

    // 休憩：弦がひとりで歌う。A7 で最後の A へ
    const CHORDS_C = 'G | D | Em | Bm | G | D | Em:8 A7:4 | A7';
    const SOLO_C = 'B5:8 D6:4 | A5:12 | G5:8 B5:4 | F#5:12 | G5:8 B5:4 | A5:8 F#5:4 | E5:8 G5:4 | A5:8 G5:4';

    // オルゴールの分散和音（8分で上がって下りる）
    const ARP = '0:2 1 2 3 2 1';
    const BASS = 'R:4 r:4 5:4';
    const DRUMS_B = {
        tomLow: repeat('x...........', 8, '|'),
        shaker: repeat('..x...x...x.', 8, '|')
    };

    // 魔法学校：オルゴールとベル、弦と合唱
    const magicschool = {
        title: '魔法学校の星の塔',
        tags: ['神秘的', '明るい'],
        genre: 'ゲーム音楽',
        melody: ['lead'],
        bpm: 104,
        stepsPerBar: 12,
        gain: 0.093,
        reverb: { seconds: 2.6, tone: 0.5 },
        delay: { time: 0.75, feedback: 0.28, tone: 2200, reverb: 0.3 },
        humanize: { time: 0.005, velocity: 0.08 },
        parts: {
            lead: { instrument: 'piano', volume: 0.67, pan: -0.08, decay: 0.9, brightness: 0.85, reverb: 0.25, delay: 0.1 },
            // 休憩の C で歌う弦
            solo: { instrument: 'strings', volume: 1.27, pan: 0.15, attack: 0.15, release: 0.45, brightness: 0.8, vibrato: 10, reverb: 0.35 },
            bell: { instrument: 'bell', volume: 0.5, pan: 0.35, reverb: 0.45, delay: 0.3 },
            // チェレスタのつもり：オルゴールの分散和音
            celesta: { instrument: 'musicBox', mode: 'arp', from: 'D4', volume: 0.22, pan: 0.25, reverb: 0.3, delay: 0.15 },
            strings: { instrument: 'strings', mode: 'chords', center: 'E4', voices: 3, volume: 0.6, pan: -0.2, attack: 0.3, release: 0.6, brightness: 0.75, reverb: 0.4 },
            choir: { instrument: 'choir', mode: 'chords', center: 'D4', voices: 3, volume: 0.45, pan: 0.1, attack: 0.4, release: 0.8, reverb: 0.45 },
            bass: { instrument: 'pluck', mode: 'bass', octave: 2, brightness: 0.4, volume: 0.45 },
            drums: { instrument: 'drums', kit: 'soft', mode: 'drums', volume: 0.8, cutoff: 6500, levels: { tomLow: 0.45, shaker: 0.3 } }
        },
        sections: {
            // イントロ：オルゴールとベルから。Gm の陰りを見せて、A7 で主題へ
            intro: {
                label: 'イントロ',
                chords: 'D | Bm | Gm | A7',
                celesta: ARP,
                bell: 'r:12 | r:8 F#6:4 | r:12 | r:8 E6:4',
                bass: { pattern: `r:12 | r:12 | ${BASS} | ${BASS}` }
            },
            A: {
                chords: CHORDS_A,
                lead: THEME,
                celesta: ARP,
                bass: BASS
            },
            // A'：ベルが答え、弦が伸ばす。A7 で B へ
            A2: {
                label: "A'",
                chords: CHORDS_A2,
                lead: THEME_TURN,
                bell: BELL_A,
                celesta: ARP,
                strings: 'hold',
                bass: BASS
            },
            // B：ロ短調から巡り、合唱と打楽器が加わる
            B: {
                chords: CHORDS_B,
                lead: SONG_B,
                celesta: ARP,
                choir: 'hold',
                bass: BASS,
                drums: DRUMS_B
            },
            // 休憩：ピアノを抜き、弦がひとりで歌う。オルゴールは1小節に1回
            C: {
                chords: CHORDS_C,
                solo: SOLO_C,
                celesta: '0:4 2 3',
                choir: 'hold',
                bass: 'R:12'
            },
            // A：ベルの答えと、合唱
            A3: {
                label: 'A',
                chords: CHORDS_A,
                lead: THEME,
                bell: BELL_A,
                celesta: ARP,
                choir: 'hold',
                bass: BASS
            },
            // 最後の B'：ベルと弦も加わる。A7 で頭の D へ戻る
            B2: {
                label: "B'",
                chords: CHORDS_B,
                lead: SONG_B,
                bell: BELL_B,
                celesta: ARP,
                strings: 'hold',
                choir: 'hold',
                bass: BASS,
                drums: DRUMS_B
            }
        },
        intro: ['intro'],
        loop: ['A', 'A2', 'B', 'C', 'A3', 'B2']
    };

    SoundKit.register('catalog', { songs: { magicschool } });
})();
