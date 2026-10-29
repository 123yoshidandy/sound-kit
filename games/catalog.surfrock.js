/**
 * 曲の一覧：波乗りサマービーチ（サーフロック・イ長調で、軽快に）
 * リバーブを深くかけたギターが、同じ音を16分で細かく弾き返して（トレモロ）、主題の伸ばしに合いの手を入れる
 * オルガンは裏で短く刻み、生ドラム風のキットが8ビートで走る。B はニ長調の和音から開き、ギターのかき鳴らしとオルガンの伸ばしで厚くする
 * 休憩の C はピアノを抜き、ギターが長い音でひとりで歌う。ドラムはキックとリムだけ
 */
(function () {
    const { repeat } = SoundKit;
    // トレモロ：1つの音を16分で4回弾く（1拍）
    const trem = (...notes) => notes.map(n => `${n}:1 ${n} ${n} ${n}`).join(' ');

    // A の主題（前半7小節は最後の A でも同じ）
    const THEME_HEAD = `E5:2 A5:2 C#6:6 B5:2 A5:4 | F#5:6 E5:2 C#5:8 | D5:2 F#5:2 A5:6 B5:2 A5:4 | G#5:6 F#5:2 E5:8 |
                        C#5:2 E5:2 A5:6 C#6:2 B5:4 | A5:6 F#5:2 C#5:8 | D5:2 F#5:2 A5:4 B5:4 G#5:4`;
    const THEME = `${THEME_HEAD} | A5:12 r:4`;
    const CHORDS_A = 'A | F#m | D | E | A | F#m | D:8 E:8 | A';

    // ギターのトレモロの合いの手：主題が伸ばしている所で、低めに答える
    const TREM_A = `r:16 | r:8 ${trem('F#4', 'A4')} | r:16 | r:8 ${trem('G#4', 'B4')} |
                    r:16 | r:8 ${trem('A4', 'F#4')} | r:16 | r:8 ${trem('C#5', 'E5')}`;

    // B：ニ長調の和音から開く。E で次へ
    const CHORDS_B = 'D | E | C#m | F#m | D | E | Bm7 | E';
    const SONG_HEAD = `F#5:2 A5:2 D6:8 C#6:2 B5:2 | B5:6 G#5:2 E5:8 | E5:2 G#5:2 C#6:8 B5:2 G#5:2 | A5:6 F#5:2 C#5:8 |
                       F#5:2 A5:2 D6:6 C#6:2 A5:4 | B5:6 A5:2 G#5:8 | F#5:4 A5:4 B5:4 D6:4`;
    const SONG_B = `${SONG_HEAD} | B5:6 G#5:2 E5:8`;
    // ループの終わり：E で止めて、頭の A へ戻る
    const SONG_LAST = `${SONG_HEAD} | B5:6 G#5:2 E5:4 r:4`;

    // 休憩：ギターが長い音で歌う。E で最後の A へ
    const CHORDS_C = 'F#m | D | A | E | F#m | D | Bm7 | E';
    const GUITAR_C = `A5:8 F#5:8 | A5:6 F#5:2 D5:8 | E5:8 C#5:8 | G#5:8 B5:8 |
                      C#6:8 A5:8 | F#5:8 A5:8 | D6:8 B5:8 | G#5:8 E5:8`;

    const ORGAN = '..x-..x-..x-..x-';
    const STRUM = 'x.o.x.o.x.o.x.o.';
    const BASS = 'R:2 R:2 R:2 5:2 R:2 R:2 5:2 R+:2';

    const KICK = 'x.......x.x.....';
    const SNARE = '....x.......x...';
    const HAT = 'x.x.x.x.x.x.x.x.';
    const DRUMS = { kick: repeat(KICK, 8, '|'), snare: repeat(SNARE, 8, '|'), hat: repeat(HAT, 8, '|') };
    // 最後の小節でタムを転がして、次の区間へ
    const DRUMS_FILL = {
        kick: repeat(KICK, 7, '|') + '|x.......x.......',
        snare: repeat(SNARE, 7, '|') + '|....x...........',
        tom: repeat('................', 7, '|') + '|........x.x.x.x.',
        hat: repeat(HAT, 7, '|') + '|x.x.x.x.........'
    };
    // B：シンバルで開き、ハイハットを開いて広げる
    const DRUMS_B = {
        crash: 'x...............|' + repeat('................', 7, '|'),
        kick: repeat('x.......x.x...x.', 8, '|'),
        snare: repeat(SNARE, 7, '|') + '|....x.......x.xx',
        hat: repeat('x.x.x.x.x.x.x...', 8, '|'),
        openHat: repeat('..............x.', 8, '|')
    };

    // サーフロック：深いリバーブのギターのトレモロと、オルガンの刻み
    const surfrock = {
        title: '波乗りサマービーチ',
        tags: ['軽快', '明るい'],
        genre: 'ロック・ポップ',
        melody: ['lead'],
        bpm: 140,
        gain: 0.1,
        reverb: { seconds: 2.4, tone: 0.5 },
        delay: { time: 0.75, feedback: 0.25, tone: 2400, reverb: 0.25 },
        humanize: { time: 0.004, velocity: 0.08 },
        parts: {
            lead: { instrument: 'piano', volume: 0.6, pan: -0.08, decay: 0.7, brightness: 0.85, reverb: 0.2, delay: 0.1 },
            // トレモロのギター：リバーブを深く
            trem: { instrument: 'guitar', volume: 0.45, pan: 0.3, brightness: 0.7, release: 0.08, reverb: 0.35, delay: 0.15 },
            // 休憩の C で歌うギター
            solo: { instrument: 'guitar', volume: 1.2, pan: 0.2, brightness: 0.65, sustain: 0.997, release: 0.3, reverb: 0.35, delay: 0.2 },
            rhythm: { instrument: 'guitar', mode: 'chords', center: 'E4', voices: 3, strum: 0.006, brightness: 0.5, gate: 0.9, volume: 0.44, pan: -0.3, reverb: 0.2 },
            organ: { instrument: 'organ', mode: 'chords', center: 'D4', voices: 3, vibrato: 5, volume: 0.7, cutoff: 2600, pan: 0.25, gate: 0.7, reverb: 0.22 },
            // 伸ばすオルガン：B と休憩で
            hold: { instrument: 'organ', mode: 'chords', center: 'D4', voices: 3, vibrato: 5, volume: 0.42, cutoff: 2200, pan: 0.2, reverb: 0.3 },
            bass: { instrument: 'synthBass', mode: 'bass', octave: 2, cutoff: 420, decay: 0.2, sustain: 0.4, release: 0.04, volume: 0.45, gate: 0.75 },
            drums: { instrument: 'drums', kit: 'acoustic', mode: 'drums', volume: 0.5, cutoff: 7500, levels: { kick: 0.85, snare: 0.6, hat: 0.4, openHat: 0.35, tom: 0.5, rim: 0.5, crash: 0.3 } }
        },
        sections: {
            // イントロ：ギターのトレモロから、オルガンとドラムが入り、E で主題へ
            intro: {
                label: 'イントロ',
                chords: 'A | F#m | D | E',
                trem: `${trem('E5', 'C#5', 'A4', 'C#5')} | ${trem('F#5', 'C#5', 'A4', 'C#5')} | ${trem('F#5', 'D5', 'A4', 'D5')} | ${trem('G#5', 'E5', 'B4', 'G#4')}`,
                organ: `................|................|${ORGAN}|${ORGAN}`,
                bass: { pattern: `r:16 | r:16 | ${BASS} | ${BASS}` },
                drums: {
                    hat: '................|................|' + HAT + '|x.x.x.x.........',
                    kick: '................|................|' + KICK + '|x.......x.......',
                    snare: '................|................|' + SNARE + '|....x...........',
                    tom: '................|................|................|........x.x.x.x.'
                }
            },
            A: {
                chords: CHORDS_A,
                lead: THEME,
                organ: ORGAN,
                bass: BASS,
                drums: DRUMS
            },
            // A'：ギターがトレモロで答える
            A2: {
                label: "A'",
                chords: CHORDS_A,
                lead: THEME,
                trem: TREM_A,
                organ: ORGAN,
                bass: BASS,
                drums: DRUMS_FILL
            },
            // B：かき鳴らしとオルガンの伸ばしで厚くする。E で休憩へ
            B: {
                chords: CHORDS_B,
                lead: SONG_B,
                rhythm: STRUM,
                hold: 'hold',
                bass: BASS,
                drums: DRUMS_B
            },
            // 休憩：ピアノを抜き、ギターが長い音で歌う。ドラムはキックとリムだけ
            C: {
                chords: CHORDS_C,
                solo: GUITAR_C,
                hold: 'hold',
                bass: 'R:6 R:2 5:4 R:4',
                drums: {
                    kick: repeat('x.......x.......', 8, '|'),
                    rim: repeat('....x.......x...', 7, '|') + '|....x.......x.x.',
                    hat: repeat('x...x...x...x...', 8, '|')
                }
            },
            // A：トレモロの合いの手と、オルガンの刻み
            A3: {
                label: 'A',
                chords: CHORDS_A,
                lead: THEME,
                trem: TREM_A,
                organ: ORGAN,
                bass: BASS,
                drums: DRUMS_FILL
            },
            // ループの終わりの B：E で止めて、頭の A へ戻る
            B2: {
                label: "B'",
                chords: CHORDS_B,
                lead: SONG_LAST,
                trem: `r:16 | r:8 ${trem('G#4', 'B4')} | r:16 | r:8 ${trem('A4', 'F#4')} | r:16 | r:16 | r:16 | r:8 ${trem('B4', 'C#5')}`,
                rhythm: STRUM,
                hold: 'hold',
                bass: BASS,
                drums: DRUMS_B
            }
        },
        intro: ['intro'],
        loop: ['A', 'A2', 'B', 'C', 'A3', 'B2']
    };

    SoundKit.register('catalog', { songs: { surfrock } });
})();
