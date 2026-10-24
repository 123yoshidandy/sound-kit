/**
 * 曲の一覧：ねむりの小舟（子守歌・ヘ長調の8分の6拍子で、ゆりかごのように揺れる）
 * 1小節は12ステップ（付点4分音符×2）。ギターの8分の分散和音でゆっくり揺らし、ドラムは入れない
 * A' はオルゴールが、主題の伸ばしている所に高く答える。B はニ短調の方へ寄って弦楽器を敷く
 * 休憩の C はピアノを抜き、オルゴールだけがそっと歌う
 */
(function () {
    // A の主題（前半7小節は、どの A でも同じ）。「タン・タ ターン」の揺れ
    const THEME_HEAD = `C5:4 F5:2 A5:6 | Bb5:4 A5:2 F5:6 | A5:4 C6:2 A5:4 F5:2 | G5:6 E5:6 |
                        C5:4 F5:2 A5:6 | D6:4 C6:2 Bb5:6 | Bb5:4 G5:2 E5:4 G5:2`;
    const THEME = `${THEME_HEAD} | F5:12`;
    // ループの終わり：C7 で止めて、頭の F へ戻る
    const THEME_LAST = `${THEME_HEAD} | G5:6 C5:6`;
    const CHORDS_A = 'F | Bb/F | F | C7 | F | Bb | Gm7:6 C7:6 | F';
    const CHORDS_LAST = 'F | Bb/F | F | C7 | F | Bb | Gm7:6 C7:6 | C7';

    // A' のオルゴール：主題が伸ばしている所に、高く答える
    const MUSIC_BOX_A = 'r:8 F6:4 | r:8 D6:4 | r:12 | r:8 C6:2 E6:2 | r:8 F6:4 | r:8 F6:4 | r:12 | r:6 A5:2 C6:2 F6:2';
    // ループの終わりの C7 の小節は、C7 の音で答える
    const MUSIC_BOX_LAST = MUSIC_BOX_A.replace('r:6 A5:2 C6:2 F6:2', 'r:6 G5:2 Bb5:2 C6:2');

    // ギター：8分の分散和音で、ゆっくり揺らす
    const ARP = '0:2 1 2 3 2 1';

    // 子守歌：ギターの揺れとオルゴール
    const lullaby = {
        title: 'ねむりの小舟',
        tags: ['落ち着いた'],
        genre: 'クラシック',
        meter: '6/8',
        melody: ['lead'],
        bpm: 84,
        stepsPerBar: 12,
        gain: 0.09,
        reverb: { seconds: 2.8, tone: 0.4 },
        delay: { time: 1.5, feedback: 0.2, tone: 2000, reverb: 0.3 },
        humanize: { time: 0.01, velocity: 0.1 },
        parts: {
            lead: { instrument: 'piano', volume: 0.7, pan: -0.05, decay: 1.2, release: 0.4, brightness: 0.7, reverb: 0.3, delay: 0.08 },
            musicBox: { instrument: 'musicBox', volume: 0.45, pan: 0.3, reverb: 0.45, delay: 0.25 },
            guitar: { instrument: 'guitar', mode: 'arp', from: 'F3', brightness: 0.4, volume: 0.6, pan: 0.2, reverb: 0.3 },
            strings: { instrument: 'strings', mode: 'chords', center: 'D4', voices: 3, volume: 0.32, pan: -0.2, attack: 0.6, release: 0.9, brightness: 0.65, vibrato: 7, reverb: 0.5 },
            bass: { instrument: 'synthBass', mode: 'bass', octave: 2, wave: 'triangle', cutoff: 240, envelope: 0.3, decay: 1.2, sustain: 0.6, release: 0.5, volume: 0.45, gate: 0.9 }
        },
        sections: {
            // イントロ：オルゴールとギターだけで始め、C7 で主題へ
            intro: {
                label: 'イントロ',
                chords: 'F | Bb | Gm7 | C7',
                musicBox: 'A5:6 C6:6 | D6:6 F6:6 | Bb5:6 G5:6 | E5:6 G5:6',
                guitar: ARP
            },
            A: {
                chords: CHORDS_A,
                lead: THEME,
                guitar: ARP,
                bass: 'R:12'
            },
            // A'：オルゴールが高く答える
            A2: {
                label: "A'",
                chords: CHORDS_A,
                lead: THEME,
                musicBox: MUSIC_BOX_A,
                guitar: ARP,
                bass: 'R:12'
            },
            // B：ニ短調の方へ寄り、弦楽器を敷く。C7 で休憩へ
            B: {
                chords: 'Dm | Am | Bb | F | Gm | Dm | Bb:6 C:6 | C7',
                lead: `A5:6 F5:6 | E5:4 A5:2 C6:6 | D6:6 Bb5:6 | A5:4 F5:2 C5:6 |
                       G5:4 Bb5:2 D6:6 | D6:4 C6:2 A5:6 | F5:4 D5:2 E5:4 G5:2 | Bb5:6 G5:6`,
                guitar: ARP,
                strings: 'hold',
                bass: 'R:12'
            },
            // 休憩：ピアノを抜き、オルゴールだけがそっと歌う。ギターは付点4分にゆるめる
            C: {
                chords: 'F | Bb | F | C7 | F | Bb | Gm7:6 C7:6 | F',
                musicBox: 'A5:6 C6:6 | D6:6 Bb5:6 | C6:4 A5:2 F5:6 | G5:6 E5:6 | A5:4 C6:2 F6:6 | D6:6 F5:6 | G5:6 E5:6 | F5:12',
                guitar: '0:6 2',
                strings: 'hold',
                bass: 'R:12'
            },
            // 最後の A'：オルゴールが答えて、C7 で頭の F へ戻る
            A3: {
                label: "A'",
                chords: CHORDS_LAST,
                lead: THEME_LAST,
                musicBox: MUSIC_BOX_LAST,
                guitar: ARP,
                bass: 'R:12'
            }
        },
        intro: ['intro'],
        loop: ['A', 'A2', 'B', 'C', 'A3']
    };

    SoundKit.register('catalog', { songs: { lullaby } });
})();
