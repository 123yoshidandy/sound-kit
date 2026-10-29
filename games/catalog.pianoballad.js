/**
 * 曲の一覧：灯りを落としたラウンジ（ジャズ・バラード・ヘ長調で、ゆっくり揺れる）
 * ブラシをこする音とウッドベース風の三角波の上で、ピアノが長い音を置くように歌う。エレピは2拍ずつ、和音をそっと置く
 * A' は弦が薄く敷き、終わりを F7 にして、変ロ長調の方へ開く B へ渡す。B はベースが4分で歩き、ライドが入る
 * 休憩の C はピアノを抜き、フルートがひとりで歌う。最後は Gm7・C7 で頭の Fmaj7 へ戻る
 */
(function () {
    const { repeat } = SoundKit;

    // A の主題（前半7小節は A' でも同じ）。長い音は和音の音か 9th にする
    const THEME_HEAD = `A5:6 G5:2 E5:4 C5:4 | F5:8 r:2 D5:2 F5:2 A5:2 | Bb5:6 A5:2 G5:4 D5:4 | E5:8 r:4 G5:2 Bb5:2 |
                        C6:6 A5:2 E5:4 G5:4 | F#5:8 r:2 A5:2 C6:2 D6:2 | Bb5:4 G5:4 E5:4 C5:4`;
    const THEME = `${THEME_HEAD} | A5:12 r:4`;
    // A' の終わり：F7 で止めて、B の Bbmaj7 へ
    const THEME_TURN = `${THEME_HEAD} | A5:4 F5:4 Eb5:4 C5:4`;
    const CHORDS_HEAD = 'Fmaj7 | Dm7 | Gm7 | C7 | Am7 | D7 | Gm7:8 C7:8';
    const CHORDS_A = `${CHORDS_HEAD} | Fmaj7`;
    const CHORDS_A2 = `${CHORDS_HEAD} | F7`;

    // B：変ロ長調の方へ開き、Bbm6 で陰らせる。Gm7・C7 で休憩へ
    const CHORDS_B = 'Bbmaj7 | Bbm6 | Am7 | D7 | Gm7 | C7 | Am7:8 D7:8 | Gm7:8 C7:8';
    const SONG_B = `D6:6 C6:2 A5:8 | Db6:6 Bb5:2 F5:8 | E5:4 G5:4 C6:4 A5:4 | F#5:8 A5:4 C6:4 |
                    Bb5:6 A5:2 G5:8 | E5:4 G5:4 Bb5:4 G5:4 | C6:4 A5:4 F#5:4 A5:4 | G5:4 Bb5:4 E5:4 G5:4`;

    // 休憩：フルートがひとりで歌う。Gm7・C7 で頭の Fmaj7 へ戻る
    const CHORDS_C = 'Dm7 | G7 | Cm7 | F7 | Bbmaj7 | Bbm6 | Am7:8 D7:8 | Gm7:8 C7:8';
    const FLUTE_C = `A5:8 F5:8 | D6:8 B5:8 | G5:8 Eb5:8 | A5:12 C6:4 |
                     D6:8 A5:8 | F5:8 Db6:8 | C6:8 A5:8 | Bb5:8 G5:8`;

    // エレピは2拍ずつそっと置き、ベースは2拍ずつ（B は4分で歩く）
    const COMP = 'x-------x-------';
    const BASS = 'R:8 5:8';
    const WALK = 'R:4 3:4 5:4 3:4';
    const SWISH = repeat('x.......x.......', 8, '|');
    const HAT = repeat('....o.......o...', 8, '|');
    const DRUMS = { swish: SWISH, hat: HAT, kick: repeat('x...............', 8, '|') };
    const DRUMS_B = { ...DRUMS, ride: repeat('x...x.x.x...x.x.', 8, '|'), snare: repeat('................', 7, '|') + '|........o.x.o.x.' };

    // ジャズ・バラード：ブラシとピアノ、エレピの和音
    const pianoballad = {
        title: '灯りを落としたラウンジ',
        tags: ['落ち着いた', 'おしゃれ'],
        genre: 'ジャズ・ブルース',
        melody: ['lead'],
        bpm: 72,
        swing: 0.12,
        swingUnit: 2,
        gain: 0.119,
        reverb: { seconds: 2.4, tone: 0.45 },
        delay: { time: 0.75, feedback: 0.25, tone: 2000, reverb: 0.25 },
        humanize: { time: 0.008, velocity: 0.1 },
        parts: {
            lead: { instrument: 'piano', volume: 0.55, pan: -0.08, decay: 0.9, brightness: 0.75, reverb: 0.25, delay: 0.08 },
            // 休憩の C で歌うフルート
            flute: { instrument: 'flute', volume: 0.4, pan: 0.18, breath: 0.06, vibrato: 10, reverb: 0.35, delay: 0.2 },
            keys: { instrument: 'epiano', mode: 'chords', center: 'E4', voices: 4, volume: 0.42, pan: 0.22, warmth: 0.7, release: 0.4, reverb: 0.25 },
            strings: { instrument: 'strings', mode: 'chords', center: 'C4', voices: 3, volume: 0.42, pan: -0.2, attack: 0.5, release: 0.8, brightness: 0.55, reverb: 0.45 },
            // ウッドベースのつもり：三角波を丸く
            bass: { instrument: 'synthBass', mode: 'bass', octave: 2, wave: 'triangle', cutoff: 300, envelope: 0.6, decay: 0.5, sustain: 0.5, release: 0.1, volume: 0.45, gate: 0.85 },
            drums: { instrument: 'drums', kit: 'brush', mode: 'drums', volume: 1.5, cutoff: 8000, levels: { swish: 0.6, hat: 0.5, kick: 0.4, ride: 0.5, snare: 0.4 } }
        },
        sections: {
            // イントロ：ブラシとエレピから、ベースが入る。C7 で主題へ
            intro: {
                label: 'イントロ',
                chords: 'Fmaj7 | Dm7 | Gm7 | C7',
                keys: COMP,
                bass: { pattern: `r:16 | r:16 | ${BASS} | ${BASS}` },
                drums: { swish: repeat('x.......x.......', 4, '|'), hat: repeat('....o.......o...', 4, '|') }
            },
            A: {
                chords: CHORDS_A,
                lead: THEME,
                keys: COMP,
                bass: BASS,
                drums: DRUMS
            },
            // A'：弦が薄く敷き、F7 で B へ
            A2: {
                label: "A'",
                chords: CHORDS_A2,
                lead: THEME_TURN,
                keys: COMP,
                strings: 'hold',
                bass: BASS,
                drums: DRUMS
            },
            // B：変ロ長調の方へ開く。ベースが歩き、ライドが入る
            B: {
                chords: CHORDS_B,
                lead: SONG_B,
                keys: COMP,
                strings: 'hold',
                bass: WALK,
                drums: DRUMS_B
            },
            // 休憩：ピアノを抜き、フルートがひとりで歌う。エレピは小節に1つ。C7 で頭の Fmaj7 へ戻る
            C: {
                chords: CHORDS_C,
                flute: FLUTE_C,
                keys: 'x---------------',
                bass: 'R:12 5:4',
                drums: { swish: SWISH, hat: HAT }
            }
        },
        intro: ['intro'],
        loop: ['A', 'A2', 'B', 'C']
    };

    SoundKit.register('catalog', { songs: { pianoballad } });
})();
