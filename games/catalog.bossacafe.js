/**
 * 曲の一覧：午後のカフェのボサノバ（ボサノバ・ヘ長調で、肩の力を抜いて揺れる）
 * ナイロン弦のつもりのギターが「ボサ」の刻みで和音を鳴らし、ベースが根音と5度を踏む。リムとシェイカーが軽く刻む
 * 主題は拍の頭を休んで、少し遅れて歌い出す。A' からリムが入り、フルートが主題の伸ばしに答える。B は変ロ長調の方へ開き、エレピが和音を置く
 * 休憩の C はピアノを抜き、フルートがひとりで歌う。最後の A' は Gm7・C7 で頭の Fmaj7 へ戻る
 */
(function () {
    const { repeat } = SoundKit;

    // A の主題（前半7小節は A' でも同じ）。拍の頭を休み、長い音は和音の音か 9th にする
    const THEME_HEAD = `r:2 A5:2 G5:2 A5:6 E5:4 | r:2 A5:2 G5:2 A5:2 C6:8 |
                        r:2 B5:2 A5:2 B5:6 F5:4 | r:2 B5:2 A5:2 B5:2 D6:8 |
                        D6:6 C6:2 Bb5:4 A5:4 | G5:6 Bb5:2 E5:8 | C6:4 A5:4 F#5:4 A5:4`;
    const THEME = `${THEME_HEAD} | F5:4 D5:4 E5:4 r:4`;
    // A' の終わり：Cm7・F7 で、B の Bbmaj7 へ
    const THEME_TURN = `${THEME_HEAD} | Eb5:4 G5:4 A5:4 C6:4`;
    // ループの終わり：C7 で止めて、頭の Fmaj7 へ
    const THEME_LAST = `${THEME_HEAD} | F5:4 D5:4 E5:4 G5:4`;
    const CHORDS_HEAD = 'Fmaj7 | Fmaj7 | G7 | G7 | Gm7 | C7 | Am7:8 D7:8';
    const CHORDS_A = `${CHORDS_HEAD} | Gm7:8 C7:8`;
    const CHORDS_A2 = `${CHORDS_HEAD} | Cm7:8 F7:8`;

    // A' のフルート：主題が伸ばしている所に、短く答える
    const REPLY = `r:16 | r:10 E5:2 F5:2 A5:2 | r:16 | r:10 F5:2 G5:2 B5:2 |
                   r:16 | r:10 G5:2 Bb5:2 C6:2 | r:16 | r:16`;

    // B：変ロ長調の方へ開き、Bbm6 で陰らせる。C7 で休憩へ
    const CHORDS_B = 'Bbmaj7 | Bbm6 | Am7 | D7 | Gm7 | C7 | Am7:8 D7:8 | Gm7:8 C7:8';
    const SONG_B = `r:2 D6:2 C6:2 D6:6 A5:4 | r:2 Db6:2 C6:2 Db6:6 G5:4 | C6:6 B5:2 A5:4 E5:4 | F#5:8 r:2 A5:2 C6:2 D6:2 |
                    D6:6 C6:2 Bb5:8 | G5:6 E5:2 C5:8 | E5:4 A5:4 F#5:4 C6:4 | Bb5:4 G5:4 E5:4 G5:4`;

    // 休憩：フルートがひとりで歌う。C7 で最後の A' へ
    const CHORDS_C = 'Dm7 | G7 | Gm7 | C7 | Fmaj7 | Bbmaj7 | Gm7 | C7';
    const FLUTE_C = `F5:8 A5:8 | B5:8 G5:8 | Bb5:8 D6:8 | C6:12 Bb5:4 |
                     A5:8 E5:8 | D5:8 F5:8 | G5:8 Bb5:8 | E5:8 G5:8`;

    // ギターはボサの刻み、ベースは根音と5度（1拍目と3拍目の少し前）
    const GUITAR = 'x..x..x...x..x..';
    const BASS = 'R:6 5:2 R:6 5:2';
    const KICK = repeat('x.....x.x.....x.', 8, '|');
    const RIM = repeat('x..x..x...x..x..', 8, '|');
    // シェイカーは16分で軽く（16分で動くのはこれだけ）
    const SHAKER = repeat('xoooxoooxoooxooo', 8, '|');
    const DRUMS = { kick: KICK, shaker: SHAKER };
    const DRUMS_RIM = { ...DRUMS, rim: RIM };

    // ボサノバ：ナイロン弦のギターとピアノ、フルート
    const bossacafe = {
        title: '午後のカフェのボサノバ',
        tags: ['おしゃれ', '落ち着いた'],
        genre: 'ラテン',
        melody: ['lead'],
        bpm: 112,
        swing: 0.04,
        swingUnit: 1,
        gain: 0.09,
        reverb: { seconds: 1.8, tone: 0.45 },
        delay: { time: 0.75, feedback: 0.22, tone: 2000, reverb: 0.2 },
        humanize: { time: 0.006, velocity: 0.1 },
        parts: {
            lead: { instrument: 'piano', volume: 0.6, pan: -0.08, decay: 0.8, brightness: 0.75, reverb: 0.22, delay: 0.08 },
            // 休憩の C で歌うフルート
            flute: { instrument: 'flute', volume: 0.45, pan: 0.15, breath: 0.06, vibrato: 10, reverb: 0.35, delay: 0.2 },
            // A' で主題に答えるフルート
            reply: { instrument: 'flute', volume: 0.38, pan: 0.3, breath: 0.05, vibrato: 8, reverb: 0.3, delay: 0.2 },
            // ナイロン弦のつもり：暗めのギターで、少しずらしてつま弾く
            guitar: { instrument: 'guitar', mode: 'chords', center: 'D4', voices: 4, strum: 0.012, gate: 0.45, brightness: 0.4, volume: 0.65, pan: -0.25, reverb: 0.18 },
            keys: { instrument: 'epiano', mode: 'chords', center: 'E4', voices: 4, volume: 0.4, pan: 0.22, warmth: 0.7, release: 0.4, reverb: 0.25 },
            // 柔らかい三角波のベース
            bass: { instrument: 'synthBass', mode: 'bass', octave: 2, wave: 'triangle', cutoff: 320, envelope: 0.5, decay: 0.4, sustain: 0.5, release: 0.1, volume: 0.5, gate: 0.85 },
            drums: { instrument: 'drums', kit: 'soft', mode: 'drums', volume: 0.8, cutoff: 7500, levels: { kick: 0.5, rim: 0.45, shaker: 0.3 } }
        },
        sections: {
            // イントロ：ギターとシェイカーから、ベースが入る。C7 で主題へ
            intro: {
                label: 'イントロ',
                chords: 'Fmaj7 | Gm7 | Am7:8 D7:8 | Gm7:8 C7:8',
                guitar: GUITAR,
                bass: { pattern: `r:16 | ${BASS} | ${BASS} | ${BASS}` },
                drums: {
                    shaker: repeat('xoooxoooxoooxooo', 4, '|'),
                    kick: '................|' + repeat('x.....x.x.....x.', 3, '|')
                }
            },
            A: {
                chords: CHORDS_A,
                lead: THEME,
                guitar: GUITAR,
                bass: BASS,
                drums: DRUMS
            },
            // A'：リムが入り、フルートが答える。F7 で B へ
            A2: {
                label: "A'",
                chords: CHORDS_A2,
                lead: THEME_TURN,
                reply: REPLY,
                guitar: GUITAR,
                bass: BASS,
                drums: DRUMS_RIM
            },
            // B：変ロ長調の方へ開き、エレピが2拍ずつ和音を置く
            B: {
                chords: CHORDS_B,
                lead: SONG_B,
                guitar: GUITAR,
                keys: 'x-------x-------',
                bass: BASS,
                drums: DRUMS_RIM
            },
            // 休憩：ピアノとリムを抜き、フルートがひとりで歌う。ギターの刻みは少なく
            C: {
                chords: CHORDS_C,
                flute: FLUTE_C,
                guitar: 'x.....x...x.....',
                bass: 'R:8 5:8',
                drums: { shaker: SHAKER }
            },
            // 最後の A'：フルートが答え、C7 で頭の Fmaj7 へ戻る
            A3: {
                label: "A'",
                chords: CHORDS_A,
                lead: THEME_LAST,
                reply: REPLY,
                guitar: GUITAR,
                bass: BASS,
                drums: DRUMS_RIM
            }
        },
        intro: ['intro'],
        loop: ['A', 'A2', 'B', 'C', 'A3']
    };

    SoundKit.register('catalog', { songs: { bossacafe } });
})();
