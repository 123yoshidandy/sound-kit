/**
 * 曲の一覧：火花散る鉄の要塞（ロック・ホ短調で、速く押し迫るボス戦）
 * ギターが根音を8分で刻み続け、ベースが4分で支え、生ドラムが2・4拍を強く打つ。属和音は B7 にして張りつめさせる
 * A' からオルガンが和音を伸ばして厚くし、B のサビはクラッシュで開く。休憩の C はピアノと刻みを抜き、ギターがひとりで歌う
 * 最後の D は「決め」：ギターとドラムが 3・3・2 の拍でそろって打ち、B7 で頭の Em へ戻る
 */
(function () {
    const { repeat } = SoundKit;

    // A の主題（8小節）。B7 で次へ
    const THEME = `E5:4 G5:4 B5:6 A5:2 | G5:4 F#5:2 E5:2 B5:8 | C6:6 B5:2 G5:4 E5:4 | F#5:4 A5:4 D6:8 |
                   B5:4 E5:4 G5:6 F#5:2 | E5:4 G5:4 B5:8 | C6:4 B5:4 A5:4 G5:4 | B5:8 D#5:4 F#5:4`;
    const CHORDS_A = 'Em | Em | C | D | Em | Em | C | B7';

    // B：サビ。C から開き、B7 で次へ
    const CHORDS_B = 'C | D | G | Em | C | D | B7 | B7';
    const CHORUS = `E5:4 G5:4 C6:8 | D6:6 C6:2 A5:8 | B5:4 D6:4 G5:8 | B5:6 A5:2 G5:8 |
                    E5:4 G5:4 C6:8 | A5:4 D6:4 F#5:8 | B5:8 A5:4 F#5:4 | D#5:8 F#5:4 B5:4`;

    // 休憩：ギターがひとりで歌う。B7 で次の A へ
    const CHORDS_C = 'Am | Em | C | B7 | Am | Em | C | B7';
    const GUITAR_C = `A5:8 C6:8 | B5:8 G5:8 | E5:8 G5:8 | F#5:12 D#5:4 |
                      C6:8 A5:8 | G5:8 B5:8 | C6:8 E5:8 | D#5:8 F#5:8`;

    // D：決め。主題は長く伸ばし、ギターとドラムが 3・3・2 でそろって打つ
    const CHORDS_D = 'C | D | Em | Em | C | D | B7 | B7';
    const SONG_D = 'G5:16 | A5:16 | B5:8 G5:8 | E5:16 | C6:16 | D6:8 A5:8 | B5:16 | D#5:4 F#5:4 A5:4 B5:4';
    const KIME = 'R:3 R:3 R:2 R:3 R:3 R:2';

    // ギターは根音を8分で刻み、最後の8分だけ5度へ。ベースは4分
    const CHUG = 'R:2 R:2 R:2 R:2 R:2 R:2 5:2 R:2';
    const BASS = 'R:4 R:4 R:4 R:4';
    const KICK = repeat('x.......x.x.....', 8, '|');
    const CRASH = 'x...............|' + repeat('................', 7, '|');
    // 8小節目の後半で、スネアとタムを連打して次へ
    const DRUMS_A = {
        kick: KICK,
        snare: repeat('....X.......X...', 7, '|') + '|....X...xxxxXxXx',
        hat: repeat('x.o.x.o.x.o.x.o.', 7, '|') + '|x.o.x.o.........'
    };
    const DRUMS_B = { ...DRUMS_A, crash: CRASH, openHat: repeat('..............x.', 8, '|') };
    const DRUMS_KIME = {
        kick: repeat('x..x..x.x..x..x.', 8, '|'),
        snare: repeat('x..x..x.x..x..x.', 7, '|') + '|x..x..x.xxxxXXXX',
        crash: 'x...............|................|x...............|................|x...............|................|x...............|................'
    };

    // ロックのボス戦：ギターの刻み、オルガン、生ドラム
    const rockboss = {
        title: '火花散る鉄の要塞',
        tags: ['緊張感'],
        genre: 'ロック・ポップ',
        melody: ['lead'],
        bpm: 150,
        gain: 0.094,
        reverb: { seconds: 1.6, tone: 0.45 },
        delay: { time: 0.75, feedback: 0.18, tone: 2200, reverb: 0.15 },
        humanize: { time: 0.003, velocity: 0.06 },
        parts: {
            lead: { instrument: 'piano', volume: 0.56, pan: -0.08, decay: 0.7, brightness: 0.9, reverb: 0.18, delay: 0.08 },
            // 休憩の C で歌うギター
            solo: { instrument: 'guitar', volume: 1.5, pan: 0.15, brightness: 0.75, reverb: 0.3, delay: 0.2 },
            // ギターの刻み：根音を8分で短く
            chug: { instrument: 'guitar', mode: 'bass', octave: 3, gate: 0.45, brightness: 0.7, volume: 0.8, pan: 0.3, reverb: 0.1 },
            organ: { instrument: 'organ', mode: 'chords', center: 'E4', voices: 3, volume: 0.45, pan: -0.25, reverb: 0.25 },
            bass: { instrument: 'synthBass', mode: 'bass', octave: 2, volume: 0.7, cutoff: 420, decay: 0.18, sustain: 0.4, release: 0.04, gate: 0.85 },
            drums: { instrument: 'drums', kit: 'acoustic', mode: 'drums', volume: 0.53, cutoff: 8000, levels: { kick: 0.85, snare: 0.55, hat: 0.4, openHat: 0.35, crash: 0.4, tomHigh: 0.6, tomLow: 0.7 } }
        },
        sections: {
            // イントロ：ギターの刻みから、ドラムとベースが入り、B7 で主題へ
            intro: {
                label: 'イントロ',
                chords: 'Em | Em | C | B7',
                chug: CHUG,
                bass: { pattern: `r:16 | r:16 | ${BASS} | ${BASS}` },
                drums: {
                    hat: repeat('x.o.x.o.x.o.x.o.', 3, '|') + '|................',
                    kick: '................|................|x.......x.x.....|x.......x.......',
                    tomHigh: '................|................|................|x.x.x.x.........',
                    tomLow: '................|................|................|........x.x.x.x.'
                }
            },
            A: {
                chords: CHORDS_A,
                lead: THEME,
                chug: CHUG,
                bass: BASS,
                drums: { ...DRUMS_A, crash: CRASH }
            },
            // A'：オルガンが和音を伸ばして厚くする
            A2: {
                label: "A'",
                chords: CHORDS_A,
                lead: THEME,
                chug: CHUG,
                organ: 'hold',
                bass: BASS,
                drums: DRUMS_A
            },
            // B：サビ。クラッシュで開き、裏でオープンハイハット
            B: {
                chords: CHORDS_B,
                lead: CHORUS,
                chug: CHUG,
                organ: 'hold',
                bass: BASS,
                drums: DRUMS_B
            },
            // 休憩：ピアノと刻みを抜き、ギターがひとりで歌う。ドラムは半分の速さに
            C: {
                chords: CHORDS_C,
                solo: GUITAR_C,
                organ: 'hold',
                bass: 'R:8 R:8',
                drums: {
                    kick: repeat('x...............', 8, '|'),
                    snare: repeat('........x.......', 7, '|') + '|........x.x.xxxx',
                    hat: repeat('x...x...x...x...', 8, '|')
                }
            },
            // A：刻みとオルガン、クラッシュがそろう
            A3: {
                label: 'A',
                chords: CHORDS_A,
                lead: THEME,
                chug: CHUG,
                organ: 'hold',
                bass: BASS,
                drums: { ...DRUMS_A, crash: CRASH }
            },
            // B'：サビをもう一度
            B2: {
                label: "B'",
                chords: CHORDS_B,
                lead: CHORUS,
                chug: CHUG,
                organ: 'hold',
                bass: BASS,
                drums: DRUMS_B
            },
            // 決め：ギター・ベース・ドラムが 3・3・2 でそろって打つ。B7 で頭の Em へ戻る
            D: {
                chords: CHORDS_D,
                lead: SONG_D,
                chug: KIME,
                organ: 'hold',
                bass: KIME,
                drums: DRUMS_KIME
            }
        },
        intro: ['intro'],
        loop: ['A', 'A2', 'B', 'C', 'A3', 'B2', 'D']
    };

    SoundKit.register('catalog', { songs: { rockboss } });
})();
