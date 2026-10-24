/**
 * 曲の一覧：裏打ちホリデー（スカ・変ホ長調で、速く跳ねる）
 * ギターが8分の裏で「チャッ・チャッ」と刻み、ベースは4分で歩く。ホーン隊（ブラス）が主題の伸ばしに短く吹き込む
 * B はオルガンの裏打ちを足して ii-V で巡る。休憩の C は主旋律とホーンを抜き、ピアニカ（アコーディオン）がエコーの中で歌う
 */
(function () {
    const { repeat } = SoundKit;

    // A の主題。Bb7 で終えて、頭の Eb へ戻る
    const THEME = `G5:4 Bb5:4 G5:2 F5:2 Eb5:4 | C6:6 Bb5:2 G5:8 | Ab5:4 C6:4 Eb5:8 | D5:4 F5:4 Ab5:4 Bb5:4 |
                   G5:4 Bb5:4 G5:2 F5:2 Eb5:4 | Eb5:4 G5:4 C6:8 | C6:6 Bb5:2 Ab5:8 | F5:8 D5:8`;
    const CHORDS_A = 'Eb | Cm | Ab | Bb7 | Eb | Cm | Ab | Bb7';

    // ホーン隊：主題が伸ばしている2・3・6・7小節目の後半に吹き込む
    const HORNS = `................|........x-.x-...|........x-.x-...|................|
                   ................|........x-.x-...|........x-.x-...|................`.replace(/\s/g, '');

    // B の主題（B' でも同じ）。ii-V で巡る
    const SONG_B = `C6:6 Ab5:2 Eb5:8 | D6:6 Bb5:2 F5:8 | Bb5:4 G5:4 D5:4 F5:4 | Eb5:4 G5:4 C6:8 |
                    Ab5:4 C6:4 F5:8 | D6:6 C6:2 Bb5:8 | Bb5:4 G5:4 E5:4 G5:4 | C6:4 Ab5:4 Bb5:4 D6:4`;
    const CHORDS_B = 'Ab | Bb | Gm7 | Cm | Fm7 | Bb7 | Eb:8 C7:8 | Fm7:8 Bb7:8';

    // ギターの裏打ちと、4分で歩くベース
    const SKANK = '..x-..x-..x-..x-';
    const BUBBLE = '...x...x...x...x';
    const BASS = 'R:4 3:4 5:4 R+:4';
    const KICK = repeat('x.......x.......', 8, '|');
    const SNARE = repeat('....x.......x...', 8, '|');
    const HAT = repeat('x.o.x.o.x.o.x.o.', 8, '|');
    const DRUMS = { kick: KICK, snare: SNARE, hat: HAT };
    const DRUMS_FILL = { kick: KICK, hat: HAT, snare: repeat('....x.......x...', 7, '|') + '|....x...x.x.xxxx' };

    // スカ：裏打ちのギターとホーン
    const ska = {
        title: '裏打ちホリデー',
        tags: ['明るい', '軽快'],
        genre: 'ワールド',
        melody: ['lead'],
        bpm: 160,
        gain: 0.09,
        reverb: { seconds: 1.5, tone: 0.5 },
        delay: { time: 0.75, feedback: 0.3, tone: 2000, reverb: 0.2 },
        humanize: { time: 0.004, velocity: 0.08 },
        parts: {
            lead: { instrument: 'piano', volume: 0.59, pan: -0.08, decay: 0.75, brightness: 0.85, reverb: 0.16, delay: 0.08 },
            // ピアニカのつもり：アコーディオンを、エコー多めに
            melodica: { instrument: 'accordion', volume: 0.89, pan: 0.2, attack: 0.03, release: 0.1, reverb: 0.3, delay: 0.4 },
            horns: { instrument: 'brass', mode: 'chords', center: 'G4', voices: 3, volume: 0.63, pan: -0.25, brightness: 4, release: 0.06, reverb: 0.22 },
            skank: { instrument: 'guitar', mode: 'chords', center: 'G4', voices: 3, strum: 0.004, brightness: 0.8, gate: 0.3, volume: 0.63, pan: 0.3, reverb: 0.15 },
            organ: { instrument: 'organ', mode: 'chords', center: 'Eb4', voices: 3, volume: 0.88, pan: -0.15, gate: 0.4, reverb: 0.2 },
            bass: { instrument: 'synthBass', mode: 'bass', octave: 2, wave: 'triangle', cutoff: 320, envelope: 0.8, decay: 0.3, sustain: 0.45, release: 0.05, volume: 0.62, gate: 0.75 },
            drums: { instrument: 'drums', kit: 'soft', mode: 'drums', volume: 0.6, cutoff: 7500, levels: { kick: 0.6, snare: 0.45, hat: 0.35, rim: 0.4 } }
        },
        sections: {
            // イントロ：ホーンの合図と小太鼓から、裏打ちが入る。Bb7 で主題へ
            intro: {
                label: 'イントロ',
                chords: 'Eb | Ab | Eb | Bb7',
                horns: 'x-.x-...........|x-.x-...........|x-.x-...........|x-.x-.x-x-------',
                skank: SKANK,
                bass: BASS,
                drums: { kick: repeat('x.......x.......', 4, '|'), snare: '................|................|................|....x...x.x.xxxx' }
            },
            A: {
                chords: CHORDS_A,
                lead: THEME,
                skank: SKANK,
                bass: BASS,
                drums: DRUMS
            },
            // A'：ホーン隊が吹き込む
            A2: {
                label: "A'",
                chords: CHORDS_A,
                lead: THEME,
                horns: HORNS,
                skank: SKANK,
                bass: BASS,
                drums: DRUMS_FILL
            },
            // B：オルガンの裏打ちを足し、ii-V で巡る。Bb7 で休憩へ
            B: {
                chords: CHORDS_B,
                lead: SONG_B,
                skank: SKANK,
                organ: BUBBLE,
                horns: repeat('................', 7, '|') + '|x-.x-...x-.x-x--',
                bass: BASS,
                drums: DRUMS_FILL
            },
            // B'：ホーン隊が伸ばしのたびに吹き込み、シンバルで盛り上げる。Bb7 で休憩へ
            B2: {
                label: "B'",
                chords: CHORDS_B,
                lead: SONG_B,
                skank: SKANK,
                organ: BUBBLE,
                horns: repeat('........x-.x-...', 7, '|') + '|x-.x-...x-.x-x--',
                bass: BASS,
                drums: { ...DRUMS_FILL, crash: 'x...............|' + repeat('................', 7, '|') }
            },
            // 休憩：主旋律とホーンを抜き、ピアニカがエコーの中で歌う。ドラムはリムとキックだけ。Bb7 で頭の Eb へ戻る
            C: {
                chords: CHORDS_A,
                melodica: 'Bb5:8 G5:8 | G5:8 Eb5:8 | C6:8 Ab5:8 | F5:16 | G5:4 Bb5:4 Eb5:8 | C6:16 | Ab5:8 C6:8 | D6:8 Bb5:8',
                skank: SKANK,
                bass: 'R:8 5:8',
                drums: { kick: KICK, rim: SNARE }
            },
            // 最後の A'：ホーンとオルガンを重ねて、Bb7 で頭の Eb へ戻る
            A3: {
                label: "A'",
                chords: CHORDS_A,
                lead: THEME,
                horns: HORNS,
                organ: BUBBLE,
                skank: SKANK,
                bass: BASS,
                drums: DRUMS_FILL
            }
        },
        intro: ['intro'],
        loop: ['A', 'A2', 'B', 'B2', 'C', 'A3']
    };

    SoundKit.register('catalog', { songs: { ska } });
})();
