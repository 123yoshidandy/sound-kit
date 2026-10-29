/**
 * 曲の一覧：スタジアムの大声援（ゲーム音楽・変ロ長調で、元気に行進する）
 * ベースが1・3拍で踏み、ブラスが裏拍で和音を吹いて、マーチングの足取りにする。手拍子は2・4拍
 * 16分で動くのはマーチングの小太鼓だけ。A は8分で軽く、A' から16分の連打で盛り上げ、ブラスのファンファーレが主題の伸ばしに答える
 * B は変ホ長調の和音から開いて弦が伸ばし、休憩の C はピアノと小太鼓を抜いて、手拍子の上で弦が歌う。最後の B' は F で頭の Bb へ戻る
 */
(function () {
    const { repeat } = SoundKit;

    // A の主題（前半7小節は同じ）。大きく跳ねる応援歌
    const THEME_HEAD = `F5:4 Bb5:4 D6:4 Bb5:4 | C6:6 A5:2 F5:8 | G5:4 Bb5:4 D6:4 G5:4 | Bb5:8 G5:4 Eb5:4 |
                        F5:2 F5:2 Bb5:4 D6:4 Bb5:4 | C6:6 Bb5:2 A5:8 | G5:4 Bb5:4 A5:4 C6:4`;
    const THEME = `${THEME_HEAD} | Bb5:8 r:4 F5:4`;
    const CHORDS_A = 'Bb | F/A | Gm | Eb | Bb | F | Eb:8 F:8 | Bb';

    // A' のファンファーレ：主題が伸ばしている所に、ブラスが答える
    const FANFARE_A = `r:16 | r:10 F4:2 A4:2 C5:2 | r:16 | r:10 Eb5:2 F5:2 G5:2 |
                       r:16 | r:10 F5:2 G5:2 A5:2 | r:16 | r:8 D5:2 F5:2 Bb5:4`;
    // 最後の A のベル：伸ばしの終わりに、きらりと
    const BELL_A = 'r:16 | r:12 F6:4 | r:16 | r:12 G6:4 | r:16 | r:12 C6:4 | r:16 | r:12 D6:4';

    // B：変ホ長調の和音から開き、F で次へ
    const CHORDS_B = 'Eb | F | Dm | Gm | Cm | F | Eb:8 F:8 | F';
    const SONG_B = `Eb5:4 G5:4 Bb5:8 | C6:6 A5:2 F5:8 | F5:4 A5:4 D6:8 | D6:6 Bb5:2 G5:8 |
                    Eb5:4 G5:4 C6:8 | C6:6 A5:2 F5:4 A5:4 | Bb5:4 G5:4 A5:4 C6:4 | C6:8 A5:4 F5:4`;

    // 休憩：手拍子の上で、弦がひとりで歌う。F で最後の A へ
    const CHORDS_C = 'Gm | Eb | Bb | F | Gm | Eb | Cm | F';
    const SOLO_C = `Bb5:8 G5:8 | G5:8 Bb5:8 | D6:8 F5:8 | C6:12 A5:4 |
                    Bb5:8 D6:8 | G5:8 Bb5:8 | C6:8 G5:8 | A5:8 C6:8`;

    // ベースは1・3拍で踏み、ブラスは裏拍で吹く
    const BASS = 'R:4 r:4 5:4 r:4';
    const STABS = '..x-..x-..x-..x-';
    const KICK = repeat('x.......x.......', 8, '|');
    const CLAP = repeat('....x.......x...', 8, '|');
    // マーチングの小太鼓：A は8分、A' からは16分の連打
    const SNARE8 = repeat('x.x.x.x.x.x.x.x.', 8, '|');
    const SNARE16 = repeat('x.xxx.x.x.xxx.x.', 7, '|') + '|x.xxx.xxx.xxxxxx';
    const DRUMS_A = { kick: KICK, clap: CLAP, snare: SNARE8 };
    const DRUMS_A2 = { kick: KICK, clap: CLAP, snare: SNARE16, crash: 'x...............' };

    // スポーツの応援：マーチングのブラス・小太鼓・手拍子
    const stadium = {
        title: 'スタジアムの大声援',
        tags: ['明るい', '軽快'],
        genre: 'ゲーム音楽',
        melody: ['lead'],
        bpm: 132,
        gain: 0.112,
        reverb: { seconds: 1.8, tone: 0.5 },
        delay: { time: 0.75, feedback: 0.2, tone: 2400, reverb: 0.2 },
        humanize: { time: 0.004, velocity: 0.08 },
        parts: {
            lead: { instrument: 'piano', volume: 0.5, pan: -0.08, decay: 0.7, brightness: 0.9, reverb: 0.2, delay: 0.08 },
            // 休憩の C で歌う弦
            solo: { instrument: 'strings', volume: 1.1, pan: 0.15, attack: 0.12, release: 0.4, brightness: 0.85, vibrato: 10, reverb: 0.35 },
            // ファンファーレ：主題の伸ばしに答えるブラス
            fanfare: { instrument: 'brass', volume: 0.7, pan: 0.3, brightness: 4, release: 0.1, reverb: 0.25 },
            bell: { instrument: 'bell', volume: 0.3, pan: 0.35, reverb: 0.4, delay: 0.25 },
            // 裏拍で吹くブラスの和音
            stabs: { instrument: 'brass', mode: 'chords', center: 'F4', voices: 3, gate: 0.6, volume: 0.7, pan: 0.2, brightness: 3.5, release: 0.08, reverb: 0.2 },
            strings: { instrument: 'strings', mode: 'chords', center: 'D4', voices: 3, volume: 0.5, pan: -0.2, attack: 0.25, release: 0.5, brightness: 0.8, reverb: 0.35 },
            bass: { instrument: 'pluck', mode: 'bass', octave: 2, brightness: 0.45, volume: 0.75 },
            drums: { instrument: 'drums', kit: 'soft', mode: 'drums', volume: 0.7, cutoff: 8000, levels: { kick: 0.6, clap: 0.5, snare: 0.35, crash: 0.4, tomHigh: 0.45, tomMid: 0.45 } }
        },
        sections: {
            // イントロ：小太鼓と手拍子から、ブラスとベースが入る。F で主題へ
            intro: {
                label: 'イントロ',
                chords: 'Bb | Eb | Bb | F',
                stabs: `................|................|${STABS}|${STABS}`,
                bass: { pattern: `r:16 | r:16 | ${BASS} | ${BASS}` },
                drums: {
                    snare: repeat('x.x.x.x.x.x.x.x.', 3, '|') + '|x.xxx.xxx.xxxxxx',
                    clap: repeat('....x.......x...', 4, '|'),
                    kick: '................|................|x.......x.......|x.......x.......'
                }
            },
            A: {
                chords: CHORDS_A,
                lead: THEME,
                stabs: STABS,
                bass: BASS,
                drums: DRUMS_A
            },
            // A'：小太鼓が16分で連打し、ファンファーレが答える
            A2: {
                label: "A'",
                chords: CHORDS_A,
                lead: THEME,
                fanfare: FANFARE_A,
                stabs: STABS,
                bass: BASS,
                drums: DRUMS_A2
            },
            // B：変ホ長調の和音から開き、弦が伸ばす
            B: {
                chords: CHORDS_B,
                lead: SONG_B,
                stabs: STABS,
                strings: 'hold',
                bass: BASS,
                drums: { kick: KICK, clap: CLAP, snare: SNARE16 }
            },
            // 休憩：ピアノと小太鼓を抜き、手拍子の上で弦が歌う。ブラスは小節の頭だけ
            C: {
                chords: CHORDS_C,
                solo: SOLO_C,
                stabs: 'x-..............',
                bass: 'R:8 5:8',
                drums: { kick: repeat('x...............', 8, '|'), clap: CLAP, tomHigh: repeat('................', 7, '|') + '|x.x.x.x.........', tomMid: repeat('................', 7, '|') + '|........x.x.x.x.' }
            },
            // A：ベルがきらりと答える
            A3: {
                label: 'A',
                chords: CHORDS_A,
                lead: THEME,
                bell: BELL_A,
                stabs: STABS,
                bass: BASS,
                drums: DRUMS_A2
            },
            // 最後の B'：ファンファーレの代わりにベルと弦。F で頭の Bb へ戻る
            B2: {
                label: "B'",
                chords: CHORDS_B,
                lead: SONG_B,
                bell: 'r:16 | r:12 C6:4 | r:16 | r:12 D6:4 | r:16 | r:12 C6:4 | r:16 | r:16',
                stabs: STABS,
                strings: 'hold',
                bass: BASS,
                drums: { kick: KICK, clap: CLAP, snare: SNARE16 }
            }
        },
        intro: ['intro'],
        loop: ['A', 'A2', 'B', 'C', 'A3', 'B2']
    };

    SoundKit.register('catalog', { songs: { stadium } });
})();
