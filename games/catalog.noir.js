/**
 * 曲の一覧：雨の夜の探偵事務所（ノワール・ジャズ・ハ短調で、ゆっくり跳ねる）
 * ブラシのドラムとウォーキングベースの上を、ピアノが低く歩く。窓をたたく雨（短いベル）が、ぽつりぽつりと落ちる
 * A' はミュートしたトランペット（暗いブラス）が、主題の伸ばしに短く答える。B は変イ長調の方へ巡り、弦が薄く敷く
 * 休憩の C はピアノを抜き、ミュートのトランペットがひとりで歌う。ブラシをこすって、雨音だけが残る
 */
(function () {
    const { repeat } = SoundKit;

    // A の主題。G7 で終えて、頭の Cm7 へ戻る
    const THEME = `G5:6 Eb5:2 G5:4 Bb5:4 | Ab5:8 r:2 F5:2 Ab5:2 C6:2 | Bb5:6 G5:2 Eb5:8 | D5:4 Eb5:4 G5:8 |
                   C6:6 Bb5:2 Eb5:8 | D6:6 B5:2 G5:4 F5:4 | Eb5:4 G5:4 Gb5:4 Eb5:4 | F5:4 D5:4 B4:8`;
    const CHORDS_A = 'Cm7 | Fm7 | Cm7 | Cm7 | Abmaj7 | G7 | Cm7:8 Ab7:8 | G7';

    // A' のミュート・トランペット：主題が伸ばしている所に、短く答える
    const MUTE_A = `r:16 | r:16 | r:10 G4:2 Bb4:2 C5:2 | r:10 Eb5:2 D5:2 C5:2 |
                    r:10 C5:2 Ab4:2 C5:2 | r:16 | r:16 | r:10 D5:2 F5:2 G5:2`;

    // 窓をたたく雨：短いベルを、ぽつりぽつりと
    const RAIN_A = 'Eb6:2 r:14 | r:6 C6:2 r:8 | r:16 | r:10 G5:2 r:4 | Eb6:2 r:14 | r:6 D6:2 r:8 | r:16 | r:10 B5:2 r:4';
    const RAIN_C = repeat('Eb6:2 r:14 | r:6 C6:2 r:8 | r:16 | r:10 B5:2 r:4', 2, '|');

    // B：変イ長調の方へ巡り、G7 で休憩へ
    const CHORDS_B = 'Abmaj7 | Dbmaj7 | Fm7 | Bb7 | Ebmaj7 | Abmaj7 | Dm7b5 | G7';
    const SONG_B = `C6:6 Bb5:2 Eb5:8 | Ab5:6 F5:2 Eb5:8 | Ab5:4 C6:4 F5:8 | D5:6 F5:2 Ab5:8 |
                    G5:6 Bb5:2 F5:8 | Eb5:4 C5:4 Eb5:4 Bb5:4 | Ab5:6 F5:2 D5:8 | B4:4 D5:4 F5:4 G5:4`;

    // 休憩：ミュートのトランペットがひとりで歌う。G7 で頭の Cm7 へ戻る
    const CHORDS_C = 'Cm7 | Fm7 | Cm7 | G7 | Cm7 | Fm7 | Abmaj7:8 G7:8 | G7';
    const MUTE_C = `G5:8 Eb5:8 | F5:8 Ab5:4 C5:4 | Eb5:16 | D5:8 B4:8 |
                    C5:4 Eb5:4 G5:8 | Ab5:12 F5:4 | Eb5:8 D5:8 | B4:8 D5:4 F5:4`;

    // エレピは2拍目と4拍目の裏に軽く。ベースは4分で歩く
    const COMP = '....x-.....x-...';
    const BASS = 'R:4 3:4 5:4 3:4';
    const RIDE = repeat('x...x.x.x...x.x.', 8, '|');
    const BRUSH = { ride: RIDE, hat: repeat('....o.......o...', 8, '|'), kick: repeat('x...............', 8, '|') };
    const BRUSH_FILL = { ...BRUSH, snare: repeat('................', 7, '|') + '|........o.x.o.x.' };

    // ノワール・ジャズ：ブラシとミュートのトランペット、雨のベル
    const noir = {
        title: '雨の夜の探偵事務所',
        tags: ['緊張感', 'おしゃれ'],
        genre: 'ジャズ・ブルース',
        melody: ['lead'],
        bpm: 88,
        swing: 0.15,
        swingUnit: 2,
        gain: 0.119,
        reverb: { seconds: 2.2, tone: 0.4 },
        delay: { time: 0.75, feedback: 0.25, tone: 2000, reverb: 0.25 },
        humanize: { time: 0.007, velocity: 0.1 },
        parts: {
            lead: { instrument: 'piano', volume: 0.58, pan: -0.08, decay: 0.85, brightness: 0.75, reverb: 0.22, delay: 0.08 },
            // ミュートしたトランペットのつもり：ブラスを暗く、こもらせる
            mute: { instrument: 'brass', volume: 0.8, pan: 0.28, brightness: 1.5, cutoff: 1800, attack: 0.04, release: 0.2, vibrato: 8, reverb: 0.35, delay: 0.15 },
            // 窓をたたく雨：短く消えるベル
            rain: { instrument: 'bell', volume: 0.44, pan: 0.4, decay: 0.5, reverb: 0.5, delay: 0.3 },
            strings: { instrument: 'strings', mode: 'chords', center: 'C4', voices: 3, volume: 0.42, pan: -0.2, attack: 0.5, release: 0.8, brightness: 0.55, reverb: 0.5 },
            keys: { instrument: 'epiano', mode: 'chords', center: 'Eb4', voices: 4, volume: 0.4, pan: 0.22, reverb: 0.22 },
            bass: { instrument: 'synthBass', mode: 'bass', octave: 2, wave: 'triangle', cutoff: 300, envelope: 0.6, decay: 0.4, sustain: 0.5, release: 0.08, volume: 0.44, gate: 0.85 },
            drums: { instrument: 'drums', kit: 'brush', mode: 'drums', volume: 1.5, cutoff: 8000, levels: { ride: 0.55, hat: 0.5, kick: 0.45, swish: 0.6, snare: 0.4 } }
        },
        sections: {
            // イントロ：雨のベルとベース、ブラシから。エレピが入って、G7 で主題へ
            intro: {
                label: 'イントロ',
                chords: 'Cm7 | Fm7 | Cm7 | G7',
                rain: 'Eb6:2 r:14 | r:6 C6:2 r:8 | r:16 | r:10 B5:2 r:4',
                keys: '................|................|' + COMP + '|' + COMP,
                bass: BASS,
                drums: { ride: repeat('x...x.x.x...x.x.', 4, '|'), hat: repeat('....o.......o...', 4, '|') }
            },
            A: {
                chords: CHORDS_A,
                lead: THEME,
                keys: COMP,
                bass: BASS,
                drums: BRUSH
            },
            // A'：ミュートのトランペットが答え、雨が落ちる
            A2: {
                label: "A'",
                chords: CHORDS_A,
                lead: THEME,
                mute: MUTE_A,
                rain: RAIN_A,
                keys: COMP,
                bass: BASS,
                drums: BRUSH_FILL
            },
            // B：変イ長調の方へ巡る。弦が薄く敷く
            B: {
                chords: CHORDS_B,
                lead: SONG_B,
                strings: 'hold',
                keys: COMP,
                bass: BASS,
                drums: BRUSH_FILL
            },
            // 休憩：ピアノを抜き、ミュートのトランペットがひとりで歌う。ブラシをこすり、雨が落ちる
            C: {
                chords: CHORDS_C,
                mute: MUTE_C,
                rain: RAIN_C,
                keys: '....x-..........',
                bass: 'R:8 5:8',
                drums: { swish: repeat('x.......x.......', 8, '|'), hat: repeat('....o.......o...', 8, '|') }
            },
            // 最後の A'：弦が薄く敷き、トランペットが答える。G7 で頭の Cm7 へ戻る
            A3: {
                label: "A'",
                chords: CHORDS_A,
                lead: THEME,
                mute: MUTE_A,
                strings: 'hold',
                keys: COMP,
                bass: BASS,
                drums: BRUSH_FILL
            }
        },
        intro: ['intro'],
        loop: ['A', 'A2', 'B', 'C', 'A3']
    };

    SoundKit.register('catalog', { songs: { noir } });
})();
