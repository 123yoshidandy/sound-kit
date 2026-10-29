/**
 * 曲の一覧：雪原のそりあそび（ゲーム音楽・ト長調で、はずむ2拍子）
 * ベースが1・3拍、弦が短く2・4拍を弾いて、そりが跳ねるような2拍子にする。鈴のつもりのシェイカーが16分で鳴り続ける
 * A' はベルが主題の伸ばしに答え、B はハ長調の和音から開いて、弦が長く伸ばす
 * 休憩の C はピアノと鈴を抜き、弦がひとりで歌う。最後の B' は D7 で頭の G へ戻る
 */
(function () {
    const { repeat } = SoundKit;

    // A の主題（前半7小節は A' でも同じ）。短く切って跳ねる
    const THEME_HEAD = `D5:2 G5:2 B5:4 r:2 B5:2 D6:4 | B5:2 G5:2 E5:4 r:2 E5:2 G5:4 |
                        C5:2 E5:2 A5:4 r:2 A5:2 C6:4 | B5:4 A5:4 F#5:8 |
                        D5:2 G5:2 B5:4 r:2 B5:2 D6:4 | D6:4 B5:2 G5:2 E5:8 | C6:4 A5:4 F#5:4 A5:4`;
    const THEME = `${THEME_HEAD} | G5:4 D5:4 G5:4 r:4`;
    // A' の終わり：D7 で止めて、B へ
    const THEME_TURN = `${THEME_HEAD} | A5:4 F#5:4 D5:4 r:4`;
    const CHORDS_HEAD = 'G | Em | Am | D7 | G | Em | Am:8 D7:8';
    const CHORDS_A = `${CHORDS_HEAD} | G`;
    const CHORDS_A2 = `${CHORDS_HEAD} | D7`;

    // ベル：主題が伸ばしている所に答える
    const BELL_HEAD = 'r:16 | r:16 | r:16 | r:8 D6:4 C6:4 | r:16 | r:8 B5:4 G5:4 | r:16';
    const BELL_A2 = `${BELL_HEAD} | r:12 C6:4`;
    const BELL_A3 = `${BELL_HEAD} | r:12 D6:4`;

    // B：ハ長調の和音から開き、D7 で次へ
    const CHORDS_B = 'C | G | Am | Em | C | G | A7 | D7';
    const SONG_B = `E5:4 G5:4 C6:6 B5:2 | B5:6 A5:2 G5:8 | A5:4 C6:4 E5:4 A5:4 | G5:6 F#5:2 E5:8 |
                    C6:4 B5:4 A5:4 G5:4 | B5:4 D6:4 B5:4 G5:4 | C#6:4 A5:4 E5:4 G5:4 | F#5:4 A5:4 D6:4 C6:4`;

    // 休憩：弦がひとりで歌う。D7 で最後の A へ
    const CHORDS_C = 'Em | C | G | D | Em | C | Am | D7';
    const SOLO_C = `G5:8 B5:8 | C6:8 G5:8 | B5:8 D6:8 | A5:12 F#5:4 |
                    E5:8 G5:8 | E5:8 C6:8 | A5:8 E5:8 | F#5:8 A5:8`;

    // はずむ2拍子：ベースは1・3拍、弦は2・4拍で短く
    const BASS = 'R:4 r:4 5:4 r:4';
    const PIZZ = '....x-......x-..';
    // 鈴（シェイカー）は16分で鳴り続ける
    const BELLS = repeat('x.ox'.repeat(4), 8, '|');
    const KICK = repeat('x.......x.......', 8, '|');
    const RIM = repeat('....x.......x...', 8, '|');
    const DRUMS = { kick: KICK, rim: RIM, shaker: BELLS };
    const DRUMS_FILL = { ...DRUMS, tomHigh: repeat('................', 7, '|') + '|........x.x.x...' };

    // そり遊び：鈴とベル、ピアノと弦
    const sleigh = {
        title: '雪原のそりあそび',
        tags: ['明るい', '軽快'],
        genre: 'ゲーム音楽',
        melody: ['lead'],
        bpm: 138,
        gain: 0.106,
        reverb: { seconds: 2, tone: 0.5 },
        delay: { time: 0.75, feedback: 0.22, tone: 2400, reverb: 0.2 },
        humanize: { time: 0.004, velocity: 0.08 },
        parts: {
            lead: { instrument: 'piano', volume: 0.5, pan: -0.08, decay: 0.7, brightness: 0.9, reverb: 0.2, delay: 0.08 },
            // 休憩の C で歌う弦
            solo: { instrument: 'strings', volume: 1.13, pan: 0.15, attack: 0.12, release: 0.4, brightness: 0.85, vibrato: 10, reverb: 0.35 },
            bell: { instrument: 'bell', volume: 0.28, pan: 0.35, reverb: 0.4, delay: 0.25 },
            // ピチカートのつもり：立ち上がりの速い弦を短く
            pizz: { instrument: 'strings', mode: 'chords', center: 'D4', voices: 3, attack: 0.01, release: 0.12, gate: 0.4, brightness: 0.9, volume: 0.85, pan: 0.2, reverb: 0.2 },
            strings: { instrument: 'strings', mode: 'chords', center: 'E4', voices: 3, volume: 0.6, pan: -0.2, attack: 0.25, release: 0.5, brightness: 0.8, reverb: 0.35 },
            bass: { instrument: 'pluck', mode: 'bass', octave: 2, brightness: 0.45, volume: 0.64 },
            drums: { instrument: 'drums', kit: 'soft', mode: 'drums', volume: 0.8, cutoff: 8000, levels: { kick: 0.5, rim: 0.4, shaker: 0.35, tomHigh: 0.4 } }
        },
        sections: {
            // イントロ：鈴とベルから、2拍子の伴奏が入る。D7 で主題へ
            intro: {
                label: 'イントロ',
                chords: 'G | Em | C | D7',
                bell: 'r:8 D6:4 B5:4 | r:8 B5:4 G5:4 | r:8 E6:4 C6:4 | r:8 C6:4 A5:4',
                pizz: `................|................|${PIZZ}|${PIZZ}`,
                bass: { pattern: `r:16 | r:16 | ${BASS} | ${BASS}` },
                drums: { shaker: repeat('x.ox'.repeat(4), 4, '|'), tomHigh: '................|................|................|........x.x.x...' }
            },
            A: {
                chords: CHORDS_A,
                lead: THEME,
                pizz: PIZZ,
                bass: BASS,
                drums: DRUMS
            },
            // A'：ベルが答える。D7 で B へ
            A2: {
                label: "A'",
                chords: CHORDS_A2,
                lead: THEME_TURN,
                bell: BELL_A2,
                pizz: PIZZ,
                bass: BASS,
                drums: DRUMS_FILL
            },
            // B：ハ長調の和音から開き、弦が長く伸ばす
            B: {
                chords: CHORDS_B,
                lead: SONG_B,
                pizz: PIZZ,
                strings: 'hold',
                bass: BASS,
                drums: DRUMS_FILL
            },
            // 休憩：ピアノと鈴を抜き、弦がひとりで歌う。ベースは小節の頭だけ
            C: {
                chords: CHORDS_C,
                solo: SOLO_C,
                pizz: PIZZ,
                bass: 'R:8 5:8',
                drums: { kick: KICK, rim: repeat('................', 7, '|') + '|....x...x.x.x.x.' }
            },
            // A：ベルが答える
            A3: {
                label: 'A',
                chords: CHORDS_A,
                lead: THEME,
                bell: BELL_A3,
                pizz: PIZZ,
                bass: BASS,
                drums: DRUMS
            },
            // 最後の B'：ベルと弦。D7 で頭の G へ戻る
            B2: {
                label: "B'",
                chords: CHORDS_B,
                lead: SONG_B,
                bell: 'r:16 | r:8 D6:4 B5:4 | r:16 | r:8 B5:4 G5:4 | r:16 | r:16 | r:16 | r:16',
                pizz: PIZZ,
                strings: 'hold',
                bass: BASS,
                drums: DRUMS_FILL
            }
        },
        intro: ['intro'],
        loop: ['A', 'A2', 'B', 'C', 'A3', 'B2']
    };

    SoundKit.register('catalog', { songs: { sleigh } });
})();
