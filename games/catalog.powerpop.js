/**
 * 曲の一覧：ひこうき雲を追いかけて（パワーポップ・ニ長調で、明るく軽快に）
 * ギターが8分で和音をかき鳴らし、ベースも8分で根音を刻む。生ドラムのハイハットは8分で、16分で動くパートは置かない
 * A は語るような主題、A' でクラッシュと手拍子が入り、B のサビは G から開いて、高い音を伸ばして歌う。弦が和音を伸ばして支える
 * 休憩の C はピアノを抜き、ギターがひとりで歌い、刻みは2分にゆるめる。最後の B' はベルが答え、A で頭の D へ戻る
 */
(function () {
    const { repeat } = SoundKit;

    // A の主題（前半7小節は A' でも同じ）。語るように細かく動く
    const THEME_HEAD = `A4:2 D5:2 F#5:2 A5:4 F#5:2 A5:2 B5:2 | A5:6 E5:2 C#5:8 |
                        D5:2 F#5:2 B5:2 D6:4 C#6:2 B5:2 A5:2 | B5:6 G5:2 D5:4 r:4 |
                        A4:2 D5:2 F#5:2 A5:4 F#5:2 A5:2 D6:2 | C#6:6 A5:2 E5:8 |
                        B5:4 G5:2 B5:2 C#6:4 A5:4`;
    const THEME = `${THEME_HEAD} | D6:12 r:4`;
    // A' の終わり：A で止めて、サビの G へ
    const THEME_TURN = `${THEME_HEAD} | C#6:4 A5:4 E5:4 A5:4`;
    const CHORDS_HEAD = 'D | A/C# | Bm | G | D | A | G:8 A:8';
    const CHORDS_A = `${CHORDS_HEAD} | D`;
    const CHORDS_A2 = `${CHORDS_HEAD} | A`;

    // B（サビ）：G から開いて、高い音を伸ばす。A で次へ
    const CHORDS_B = 'G | A | F#m | Bm | G | A | Bm:8 A:8 | A';
    const SONG_B = `B5:4 D6:4 D6:6 B5:2 | C#6:6 A5:2 E5:8 | A5:4 C#6:4 F#5:4 A5:4 | B5:8 F#5:4 D5:4 |
                    G5:4 B5:4 D6:6 B5:2 | C#6:4 E5:4 A5:6 C#6:2 | D6:6 B5:2 C#6:6 A5:2 | A5:8 E5:4 C#5:4`;
    // 最後の B' のベル：伸ばしの終わりに、きらりと
    const BELL_B = 'r:16 | r:12 E6:4 | r:16 | r:12 D6:4 | r:16 | r:12 E6:4 | r:16 | r:8 C#6:4 E6:4';

    // 休憩：ギターがひとりで歌う。A で最後の A へ
    const CHORDS_C = 'Bm | G | D | A | Bm | G | Em7 | A';
    const SOLO_C = `F#5:8 D5:8 | D5:8 B4:8 | A4:8 D5:8 | C#5:12 E5:4 |
                    F#5:8 B5:8 | B5:8 G5:8 | G5:8 E5:8 | E5:8 C#5:8`;

    // ギターは8分でかき鳴らし、ベースは8分で根音を刻む
    const STRUM = 'x-x-x-x-x-x-x-x-';
    const BASS = 'R:2 R R R R R 5 R';
    const KICK = repeat('x.......x.x.....', 8, '|');
    const SNARE = repeat('....x.......x...', 8, '|');
    const HAT = repeat('x.x.x.x.x.x.x.x.', 8, '|');
    const CLAP = repeat('....x.......x...', 8, '|');
    // 最後の小節でタムを下りて、次の区間へ
    const TOM_FILL = repeat('................', 7, '|') + '|........x.x.x.x.';
    const DRUMS_A = { kick: KICK, snare: SNARE, hat: HAT };
    const DRUMS_A2 = { kick: KICK, snare: SNARE, hat: HAT, clap: CLAP, tom: TOM_FILL };
    const DRUMS_B = { kick: KICK, snare: SNARE, openHat: HAT, clap: CLAP, crash: 'x...............|' + repeat('................', 7, '|') };

    // パワーポップ：8分のギターの刻みと手拍子、サビで開ける主題
    const powerpop = {
        title: 'ひこうき雲を追いかけて',
        tags: ['明るい', '軽快'],
        genre: 'ロック・ポップ',
        melody: ['lead'],
        bpm: 140,
        gain: 0.085,
        reverb: { seconds: 1.6, tone: 0.5 },
        delay: { time: 0.75, feedback: 0.2, tone: 2400, reverb: 0.2 },
        humanize: { time: 0.004, velocity: 0.08 },
        parts: {
            lead: { instrument: 'piano', volume: 0.52, pan: -0.08, decay: 0.7, brightness: 0.9, reverb: 0.18, delay: 0.08 },
            // 休憩の C で歌うギター
            solo: { instrument: 'guitar', volume: 1.6, pan: 0.15, brightness: 0.7, reverb: 0.3, delay: 0.2 },
            bell: { instrument: 'bell', volume: 0.25, pan: 0.35, reverb: 0.4, delay: 0.25 },
            // 8分でかき鳴らすギター
            guitar: { instrument: 'guitar', mode: 'chords', center: 'E4', voices: 3, strum: 0.008, gate: 0.5, brightness: 0.6, volume: 0.55, pan: 0.25, reverb: 0.15 },
            // サビで和音を伸ばす弦
            strings: { instrument: 'strings', mode: 'chords', center: 'D4', voices: 3, volume: 0.45, pan: -0.2, attack: 0.25, release: 0.5, brightness: 0.8, reverb: 0.35 },
            bass: { instrument: 'pluck', mode: 'bass', octave: 2, brightness: 0.5, volume: 0.85 },
            drums: { instrument: 'drums', kit: 'acoustic', mode: 'drums', volume: 0.7, cutoff: 8000, levels: { kick: 0.7, snare: 0.55, hat: 0.5, openHat: 0.4, clap: 0.45, crash: 0.4, tom: 0.5 } }
        },
        sections: {
            // イントロ：ギターとベースから、ドラムが入る。A で主題へ
            intro: {
                label: 'イントロ',
                chords: 'D | G | Bm | A',
                guitar: STRUM,
                bass: BASS,
                drums: {
                    hat: repeat('x.x.x.x.x.x.x.x.', 4, '|'),
                    kick: '................|' + repeat('x.......x.x.....', 3, '|'),
                    snare: '................|' + repeat('....x.......x...', 2, '|') + '|....x...x.x.x.x.'
                }
            },
            A: {
                chords: CHORDS_A,
                lead: THEME,
                guitar: STRUM,
                bass: BASS,
                drums: DRUMS_A
            },
            // A'：手拍子が入り、A で止めてサビへ
            A2: {
                label: "A'",
                chords: CHORDS_A2,
                lead: THEME_TURN,
                guitar: STRUM,
                bass: BASS,
                drums: DRUMS_A2
            },
            // B（サビ）：G から開き、弦が伸ばす。ハイハットを開いて広げる
            B: {
                chords: CHORDS_B,
                lead: SONG_B,
                guitar: STRUM,
                strings: 'hold',
                bass: BASS,
                drums: DRUMS_B
            },
            // 休憩：ピアノを抜き、ギターがひとりで歌う。刻みは2分にゆるめ、ドラムはキックと手拍子だけ
            C: {
                chords: CHORDS_C,
                solo: SOLO_C,
                guitar: 'x-------x-------',
                bass: 'R:8 5:8',
                drums: { kick: repeat('x.......x.......', 8, '|'), clap: CLAP, tom: TOM_FILL }
            },
            // A'：手拍子が入り、A で止めてサビへ
            A3: {
                label: "A'",
                chords: CHORDS_A2,
                lead: THEME_TURN,
                guitar: STRUM,
                bass: BASS,
                drums: DRUMS_A2
            },
            // 最後の B'：ベルが答える。A で頭の D へ戻る
            B2: {
                label: "B'",
                chords: CHORDS_B,
                lead: SONG_B,
                bell: BELL_B,
                guitar: STRUM,
                strings: 'hold',
                bass: BASS,
                drums: DRUMS_B
            }
        },
        intro: ['intro'],
        loop: ['A', 'A2', 'B', 'C', 'A3', 'B2']
    };

    SoundKit.register('catalog', { songs: { powerpop } });
})();
