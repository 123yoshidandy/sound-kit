/**
 * 曲の一覧：シャンデリア・エレクトロスイング（エレクトロ・ニ短調で、跳ねる8分と4つ打ち）
 * 8分を跳ねさせ、キックは4つ打ち、クラップが2・4拍。ギターが2・4拍で短く和音を刻み、シンセベースが4分で歩く
 * 主題の区切りでブラスが「パッ・パッ」と短い和音で合いの手を入れる。B は変ロ長調へ明るく開き、パッドが和音を敷く
 * 休憩の C はピアノとクラップを抜き、シンセのリードが歌う。最後の B' は A7 で頭の Dm へ戻る
 */
(function () {
    const { repeat } = SoundKit;

    // A の主題：拍の裏を休んで跳ねる。4小節目と8小節目の後半を空けて、ブラスに渡す
    const THEME = `A5:2 r:2 A5:2 F5:2 D5:4 r:2 E5:2 | D5:2 G5:2 r:2 Bb5:2 r:2 A5:2 G5:4 | E5:2 A5:2 r:2 C#6:2 r:2 G5:2 E5:4 | F5:8 r:4 D5:2 E5:2 |
                   G5:2 Bb5:2 r:2 D6:2 r:2 C6:2 Bb5:4 | A5:2 F5:2 r:2 D5:2 r:2 F5:2 A5:4 | G#5:2 B5:2 r:2 D6:2 C#6:2 A5:2 G5:2 E5:2 | D5:8 r:8`;
    const CHORDS_A = 'Dm | Gm | A7 | Dm | Gm | Dm | E7:8 A7:8 | Dm';
    // ブラスの合いの手：主題の空いた所で短く
    const STAB = '[F4,A4,D5]:2';
    const BRASS_A = `r:16 | r:16 | r:16 | r:8 ${STAB} r:6 | r:16 | r:16 | r:16 | r:8 ${STAB} r:2 ${STAB} r:2`;

    // B：変ロ長調へ明るく開き、A7 で次へ
    const CHORDS_B = 'Bb | C7 | F | Dm | Gm | A7 | Dm:8 Bb:8 | A7';
    const SONG_B = `D6:6 C6:2 Bb5:4 F5:4 | E5:6 G5:2 Bb5:4 G5:4 | A5:6 G5:2 F5:4 C6:4 | A5:8 r:4 F5:2 G5:2 |
                    Bb5:6 A5:2 G5:4 D6:4 | C#6:6 B5:2 A5:4 E5:4 | F5:4 A5:4 D6:4 Bb5:4 | A5:8 r:4 E5:2 G5:2`;
    const BRASS_B = `r:16 | r:16 | r:16 | r:8 [F4,A4,C5]:2 r:6 | r:16 | r:16 | r:16 | r:8 [E4,G4,C#5]:2 r:6`;
    // B' のブラス：伸ばしの所でも短く答える
    const BRASS_B2 = `r:16 | r:8 [E4,G4,Bb4]:2 r:6 | r:16 | r:8 [F4,A4,C5]:2 r:6 | r:16 | r:8 [E4,G4,C#5]:2 r:6 | r:16 | r:8 [E4,G4,C#5]:2 r:2 [E4,G4,C#5]:2 r:2`;

    // 休憩：シンセのリードが歌う。A7 で A へ
    const CHORDS_C = 'Dm | Gm | C7 | F | Bb | Gm | E7 | A7';
    const SOLO_C = 'A5:8 F5:8 | G5:8 Bb5:8 | E5:8 G5:8 | A5:12 C6:4 | D6:8 Bb5:8 | G5:8 D5:8 | G#5:8 B5:8 | A5:8 G5:8';

    // ギターは2・4拍で短く刻み、ベースは4分で歩く
    const GUITAR = '....x.......x..o';
    const BASS = 'R:4 3:4 5:4 3:4';
    const KICK = repeat('x...x...x...x...', 8, '|');
    const CLAP = repeat('....x.......x...', 8, '|');
    const HAT = repeat('..x...x...x...x.', 8, '|');
    const OPEN_HAT = repeat('..............x.', 8, '|');
    const DRUMS_A = { kick: KICK, clap: CLAP, hat: HAT };
    const DRUMS_FULL = { kick: KICK, clap: CLAP, hat: HAT, openHat: OPEN_HAT };

    // エレクトロスイング：4つ打ちとギター、ブラスの合いの手、歩くシンセベース
    const electroswing = {
        title: 'シャンデリア・エレクトロスイング',
        tags: ['おしゃれ', '軽快'],
        genre: 'エレクトロ',
        melody: ['lead'],
        bpm: 124,
        swing: 0.16,
        swingUnit: 2,
        gain: 0.095,
        reverb: { seconds: 1.5, tone: 0.5 },
        delay: { time: 0.75, feedback: 0.22, tone: 2400, reverb: 0.2 },
        humanize: { time: 0.004, velocity: 0.08 },
        parts: {
            lead: { instrument: 'piano', volume: 0.5, pan: -0.08, decay: 0.7, brightness: 0.95, reverb: 0.18, delay: 0.08 },
            // 休憩の C で歌うシンセのリード
            solo: { instrument: 'softLead', volume: 0.6, pan: 0.15, cutoff: 2000, vibrato: 10, reverb: 0.3, delay: 0.15 },
            // ブラスの合いの手：短い和音
            brass: { instrument: 'brass', volume: 0.7, pan: 0.3, brightness: 3.5, release: 0.06, gate: 0.6, reverb: 0.2 },
            // 2・4拍で短く刻むギター
            guitar: { instrument: 'guitar', mode: 'chords', center: 'D4', voices: 3, strum: 0.01, gate: 0.3, brightness: 0.6, volume: 0.95, pan: -0.25, reverb: 0.15 },
            pad: { instrument: 'pad', mode: 'chords', center: 'E4', voices: 3, volume: 0.45, pan: 0.2, cutoff: 1200, reverb: 0.4 },
            bass: { instrument: 'synthBass', mode: 'bass', octave: 2, cutoff: 500, decay: 0.3, sustain: 0.5, gate: 0.8, volume: 0.65 },
            drums: { instrument: 'drums', kit: 'soft', mode: 'drums', volume: 0.8, cutoff: 8000, levels: { kick: 0.65, clap: 0.45, hat: 0.35, openHat: 0.3, crash: 0.35 } }
        },
        sections: {
            // イントロ：キックとハイハット、ベースとギターから。最後にブラスが鳴って主題へ
            intro: {
                label: 'イントロ',
                chords: 'Dm | Gm | Dm | A7',
                guitar: GUITAR,
                bass: { pattern: `r:16 | ${BASS} | ${BASS} | ${BASS}` },
                brass: `r:16 | r:16 | r:16 | r:8 [E4,G4,C#5]:2 r:2 [E4,G4,C#5]:2 r:2`,
                drums: {
                    kick: repeat('x...x...x...x...', 4, '|'),
                    hat: repeat('..x...x...x...x.', 4, '|'),
                    clap: '................|................|....x.......x...|....x.......x...'
                }
            },
            A: {
                chords: CHORDS_A,
                lead: THEME,
                guitar: GUITAR,
                bass: BASS,
                drums: DRUMS_A
            },
            // A'：ブラスの合いの手と、オープンハイハット
            A2: {
                label: "A'",
                chords: CHORDS_A,
                lead: THEME,
                brass: BRASS_A,
                guitar: GUITAR,
                bass: BASS,
                drums: DRUMS_FULL
            },
            // B：変ロ長調へ開き、パッドが和音を敷く
            B: {
                chords: CHORDS_B,
                lead: SONG_B,
                brass: BRASS_B,
                pad: 'hold',
                guitar: GUITAR,
                bass: BASS,
                drums: { ...DRUMS_FULL, crash: 'x...............' }
            },
            // 休憩：ピアノとクラップを抜き、シンセのリードが歌う。ベースは2分に
            C: {
                chords: CHORDS_C,
                solo: SOLO_C,
                pad: 'hold',
                guitar: '....x.......x...',
                bass: 'R:8 5:8',
                drums: { kick: KICK, hat: HAT }
            },
            // A：ブラスと、全部のドラム
            A3: {
                label: 'A',
                chords: CHORDS_A,
                lead: THEME,
                brass: BRASS_A,
                guitar: GUITAR,
                bass: BASS,
                drums: { ...DRUMS_FULL, crash: 'x...............' }
            },
            // 最後の B'：ブラスがよく答える。A7 で頭の Dm へ戻る
            B2: {
                label: "B'",
                chords: CHORDS_B,
                lead: SONG_B,
                brass: BRASS_B2,
                pad: 'hold',
                guitar: GUITAR,
                bass: BASS,
                drums: DRUMS_FULL
            }
        },
        intro: ['intro'],
        loop: ['A', 'A2', 'B', 'C', 'A3', 'B2']
    };

    SoundKit.register('catalog', { songs: { electroswing } });
})();
