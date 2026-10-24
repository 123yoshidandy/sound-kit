/**
 * 曲の一覧：真夜中の推理（謎解き・ニ短調で、そっと歩くように）
 * 時計の「チク・タク」（リムとハイハット）に、ピチカート風のギターと、短く切ったピアノの主題
 * A' はクラリネットが低く支え、B は弦楽器を敷いてヘ長調の方へ少し開く。休憩の C はクラリネットが歌う
 */
(function () {
    const { repeat } = SoundKit;

    // A の主題（前半6小節は A' でも同じ）。短く切って、休みで忍び足にする
    const THEME_HEAD = `D5:2 r:2 F5:2 r:2 A5:4 G#5:2 A5:2 | C6:4 A5:2 F5:2 D5:8 | D5:2 r:2 F5:2 r:2 Bb5:4 A5:2 Bb5:2 | C#6:6 A5:2 E5:8 |
                        D5:2 r:2 G5:2 r:2 Bb5:4 A5:2 G5:2 | A5:6 F5:2 D5:8`;
    // A の終わり：Em7b5 → A7 から Dm に落ち着く
    const THEME = `${THEME_HEAD} | G5:4 E5:4 C#5:4 E5:4 | D5:12 r:4`;
    // A' の終わり：Gm7 → C7 で、B の Bbmaj7 の手前の F へ
    const THEME_TURN = `${THEME_HEAD} | G5:4 Bb5:4 C6:4 E5:4 | F5:12 r:4`;
    // ループの終わり：A7 で止めて、頭の Dm へ戻る
    const THEME_LAST = `${THEME_HEAD} | G5:4 E5:4 C#5:4 E5:4 | A5:8 G5:4 E5:4`;

    const CHORDS_A = 'Dm | Dm/C | Bbmaj7 | A7 | Gm | Dm/F | Em7b5:8 A7:8 | Dm';
    const CHORDS_A2 = 'Dm | Dm/C | Bbmaj7 | A7 | Gm | Dm/F | Gm7:8 C7:8 | F';
    const CHORDS_LAST = 'Dm | Dm/C | Bbmaj7 | A7 | Gm | Dm/F | Em7b5:8 A7:8 | A7';

    // A' のクラリネット：低く伸ばして支える
    const CLARINET_LOW = 'A4:16 | A4:16 | F4:16 | E4:16 | D4:16 | A4:16 | G4:8 E4:8 | F4:16';
    // 最後の A のオルゴール：主題が伸ばしている所に答える
    const MUSIC_BOX = 'r:16 | r:8 A5:2 D6:2 F6:4 | r:16 | r:8 E6:4 C#6:4 | r:16 | r:8 F5:4 A5:4 | r:16 | r:12 A5:2 C#6:2';

    // ピチカート：休みをはさんで、そっと分散和音を置く
    const PIZZ = '0:2 r 1 r 2 r 1 r';
    const BASS = 'R:2 r:2 R:2 r:2 5:2 r:2 R+:2 r:2';

    // 時計：リムが「チク」、ハイハットが「タク」
    const CLOCK = { rim: repeat('x.......x.......', 8, '|'), hat: repeat('....o.......o...', 8, '|') };
    const DRUMS = { ...CLOCK, kick: repeat('x...............', 8, '|') };
    const DRUMS_FILL = { ...CLOCK, kick: repeat('x...............', 7, '|') + '|x.......x.x.x...' };

    // 謎解き：時計の音と、ピチカートの忍び足
    const mystery = {
        title: '真夜中の推理',
        tags: ['神秘的', '緊張感'],
        genre: 'ゲーム音楽',
        melody: ['lead'],
        bpm: 96,
        gain: 0.11,
        reverb: { seconds: 2.2, tone: 0.45 },
        delay: { time: 0.75, feedback: 0.25, tone: 2200, reverb: 0.25 },
        humanize: { time: 0.006, velocity: 0.08 },
        parts: {
            lead: { instrument: 'piano', volume: 0.55, pan: -0.08, decay: 0.7, brightness: 0.8, reverb: 0.22, delay: 0.1 },
            clarinet: { instrument: 'clarinet', volume: 0.4, pan: 0.3, attack: 0.06, release: 0.2, vibrato: 6, reverb: 0.3 },
            // ピチカートのつもり：暗めのギターを短く切る
            pizz: { instrument: 'guitar', mode: 'arp', from: 'A3', brightness: 0.4, gate: 0.3, volume: 0.85, pan: 0.25, reverb: 0.25 },
            musicBox: { instrument: 'musicBox', volume: 0.28, pan: 0.35, reverb: 0.4, delay: 0.25 },
            strings: { instrument: 'strings', mode: 'chords', center: 'D4', voices: 3, volume: 0.35, pan: -0.2, attack: 0.4, release: 0.6, brightness: 0.7, vibrato: 8, reverb: 0.45 },
            bass: { instrument: 'pluck', mode: 'bass', octave: 2, brightness: 0.3, sustain: 0.994, release: 0.08, volume: 1, gate: 0.5 },
            drums: { instrument: 'drums', kit: 'soft', mode: 'drums', volume: 0.6, cutoff: 6000, levels: { kick: 0.6, rim: 0.45, hat: 0.35, shaker: 0.35 } }
        },
        sections: {
            // イントロ：時計とピチカートだけで始め、A7 で主題へ
            intro: {
                label: 'イントロ',
                chords: 'Dm | Bbmaj7 | Gm | A7',
                pizz: PIZZ,
                bass: { pattern: `r:16 | r:16 | ${BASS} | ${BASS}` },
                drums: { rim: repeat('x.......x.......', 4, '|'), hat: repeat('....o.......o...', 4, '|') }
            },
            A: {
                chords: CHORDS_A,
                lead: THEME,
                pizz: PIZZ,
                bass: BASS,
                drums: DRUMS
            },
            // A'：クラリネットが低く支え、F へ向かう
            A2: {
                label: "A'",
                chords: CHORDS_A2,
                lead: THEME_TURN,
                clarinet: CLARINET_LOW,
                pizz: PIZZ,
                bass: BASS,
                drums: DRUMS_FILL
            },
            // B：Bbmaj7 から、少し明るく長い音で。弦楽器を敷き、シェイカーを足す。A7 で戻る
            B: {
                chords: 'Bbmaj7 | C | Am7 | Dm | Gm7 | C | Fmaj7 | A7',
                lead: `F5:6 G5:2 A5:8 | G5:6 E5:2 C5:8 | E5:4 A5:4 C6:8 | A5:6 F5:2 D5:8 |
                       Bb5:6 A5:2 G5:8 | E5:4 G5:4 C6:8 | A5:6 G5:2 E5:4 C5:4 | C#5:4 E5:4 G5:4 A5:4`,
                pizz: '0:2 1 2 1 3 2 1 2',
                strings: 'hold',
                bass: 'R:4 r:4 5:4 r:4',
                drums: { ...DRUMS_FILL, shaker: repeat('o.o.o.o.o.o.o.o.', 8, '|') }
            },
            // 休憩：ピアノを抜き、クラリネットが低く歌う。時計だけが進む
            C: {
                chords: 'Dm | Bb | Gm | A7 | Dm | Bb | Gm | A7sus4:8 A7:8',
                clarinet: `D5:8 F5:4 E5:4 | D5:8 Bb4:8 | G4:8 Bb4:4 D5:4 | C#5:12 r:4 |
                           A4:8 D5:4 F5:4 | F5:8 D5:8 | Bb4:8 G4:4 Bb4:4 | A4:8 C#5:8`,
                pizz: '0:4 1 2 1',
                bass: 'R:8 r:8',
                drums: CLOCK
            },
            // 最後の A：オルゴールが答える。A7 で終えて、頭の Dm へ戻る
            A3: {
                label: 'A',
                chords: CHORDS_LAST,
                lead: THEME_LAST,
                musicBox: MUSIC_BOX,
                pizz: PIZZ,
                bass: BASS,
                drums: DRUMS_FILL
            }
        },
        intro: ['intro'],
        loop: ['A', 'A2', 'B', 'C', 'A3']
    };

    SoundKit.register('catalog', { songs: { mystery } });
})();
