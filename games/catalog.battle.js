/**
 * 曲の一覧：剣の交わる刻（ゲームの戦闘曲・緊張感があって速め）
 * サビは弦楽器で厚くし、ブラスが小節の頭で和音を吹く。休憩とループの終わりのサビに合唱を敷く
 */
(function () {
    const { repeat } = SoundKit;

    // A の主題（前半4小節は A' でも同じ）。和声的短音階の D# で張りつめさせる
    const THEME_HEAD = `E5:6 B4:2 E5:2 G5:2 B5:4 | C6:6 B5:2 G5:4 E5:4 | F#5:6 A5:2 D6:8 | B5:6 A5:2 F#5:4 D#5:4`;
    const THEME = `${THEME_HEAD} |
                   E5:6 B4:2 E5:2 G5:2 B5:4 | C6:6 B5:2 G5:4 C6:4 | A5:6 E5:2 C6:4 B5:2 A5:2 | B5:6 F#5:2 D#5:8`;
    // A' の後半：Am → D → G と明るい方へ回って、B7 でサビへ
    const THEME_TURN = `${THEME_HEAD} |
                        A5:6 C6:2 E5:8 | F#5:6 A5:2 D6:8 | B5:6 A5:2 G5:4 D5:4 | F#5:6 A5:2 B5:8`;
    // サビ：長めの高い音で押し上げる
    const CHORUS_HEAD = `E5:2 G5:2 C6:8 B5:2 G5:2 | A5:4 D6:8 C6:2 A5:2 | B5:6 A5:2 F#5:4 D5:4 | E5:8 G5:4 B5:4 |
                         C6:6 B5:2 G5:4 E5:4 | D6:6 C6:2 A5:4 F#5:4 | E5:4 F#5:4 D#5:8`;
    const CHORUS = `${CHORUS_HEAD} | E5:12 r:4`;
    const CHORUS_LAST = `${CHORUS_HEAD} | B5:6 A5:2 F#5:4 D#5:4`;

    const CHORDS_A = 'Em | C | D | B7 | Em | C | Am | B7';
    const CHORDS_A2 = 'Em | C | D | B7 | Am | D | G | B7';
    const CHORDS_B = 'C | D | Bm7 | Em | C | D | B7sus4:8 B7:8 | Em';
    const CHORDS_B2 = 'C | D | Bm7 | Em | C | D | B7sus4:8 B7:8 | B7';

    // シロフォンの合いの手（2回目の A で、主題の伸ばしている所に足す）
    const COUNTER = 'r:16 | r:16 | r:8 A5:2 F#5:2 A5:4 | r:16 | r:16 | r:16 | r:16 | r:8 B5:2 A5:2 F#5:4';

    // 16分で動くのは、はじく弦の分散和音だけ
    const ARP = '0:1 1 2 1 3 1 2 1 0 1 2 1 3 1 2 1';
    const ARP_SLOW = '0:2 1 2 3 2 1 2 1';
    const BASS = 'R:2 R:2 R+:2 R:2 R:2 R:2 R+:2 5:2';

    // ブラスの合いの手：小節の頭で吹く。B7 の小節は3つ吹いて次の区間へ渡す
    const BRASS_BAR = 'x-----..........';
    const BRASS_TURN = 'x--.x--.x-------';
    const BRASS_TO_B = repeat('................', 7, '|') + '|' + BRASS_TURN;

    // 区間の頭だけで鳴らすシンバル
    const CRASH = 'x...............|' + repeat('................', 7, '|');

    const KICK = 'x.....x.x.......';
    const SNARE = '....x.......x...';
    const HAT = 'x.o.x.o.x.o.x.o.';
    const DRUMS = { kick: repeat(KICK, 8, '|'), snare: repeat(SNARE, 8, '|'), hat: repeat(HAT, 8, '|') };
    // 最後の小節にタムを入れて、次の区間へつなぐ
    const DRUMS_FILL = {
        kick: repeat(KICK, 7, '|') + '|x.....x.........',
        snare: repeat(SNARE, 7, '|') + '|....x...........',
        tom: repeat('................', 7, '|') + '|........x.x.x.x.',
        hat: repeat(HAT, 7, '|') + '|x.o.x.o.........'
    };
    // サビ：キックを増やし、裏でオープンハイハット
    const DRUMS_CHORUS = {
        kick: repeat('x.....x.x.....x.', 8, '|'),
        snare: repeat(SNARE, 8, '|'),
        hat: repeat('x.o.x.o.x.o.x...', 8, '|'),
        openHat: repeat('..............x.', 8, '|')
    };

    // 戦闘：はじく弦の16分の分散和音と、8分で刻むベース
    const battle = {
        title: '剣の交わる刻',
        tags: ['緊張感'],
        genre: 'ゲーム音楽',
        melody: ['lead'],
        bpm: 140,
        gain: 0.073,
        reverb: { seconds: 1.6, tone: 0.45 },
        delay: { time: 0.75, feedback: 0.2, tone: 2200 },
        humanize: { time: 0.003, velocity: 0.07 },
        parts: {
            lead: { instrument: 'piano', volume: 0.7, pan: -0.08, decay: 0.7, brightness: 0.85, reverb: 0.18, delay: 0.1 },
            counter: { instrument: 'xylophone', volume: 0.5, pan: 0.3, reverb: 0.3, delay: 0.12 },
            arp: { instrument: 'pluck', mode: 'arp', from: 'C4', brightness: 0.55, sustain: 0.993, release: 0.05, volume: 0.7, pan: 0.28, reverb: 0.2 },
            pad: { instrument: 'pad', mode: 'chords', center: 'B3', voices: 3, volume: 0.36, cutoff: 1000, reverb: 0.4 },
            // 弦楽器：サビで和音を伸ばして厚くする
            strings: { instrument: 'strings', mode: 'chords', center: 'E4', voices: 4, volume: 0.25, pan: -0.25, attack: 0.12, release: 0.3, reverb: 0.35 },
            // ブラス：小節の頭の短い和音
            brass: { instrument: 'brass', mode: 'chords', center: 'B4', voices: 3, volume: 0.35, pan: 0.18, reverb: 0.25 },
            // 合唱：休憩とループの終わりのサビに薄く敷く
            choir: { instrument: 'choir', mode: 'chords', center: 'E4', voices: 3, volume: 0.22, pan: 0.1, attack: 0.5, reverb: 0.45 },
            bass: { instrument: 'synthBass', mode: 'bass', octave: 2, volume: 0.9, cutoff: 400, decay: 0.18, sustain: 0.35, release: 0.04, gate: 0.8 },
            drums: { instrument: 'drums', kit: 'acoustic', mode: 'drums', volume: 0.6, cutoff: 7500, levels: { kick: 0.85, snare: 0.55, hat: 0.5, openHat: 0.4, tom: 0.55, crash: 0.45 } }
        },
        sections: {
            // イントロ：ベースとタムで迫り、B7 で主題へ
            intro: {
                label: 'イントロ',
                chords: 'Em | C | D | B7',
                arp: { pattern: `r:16 | r:16 | ${ARP} | ${ARP}` },
                brass: '................|................|................|........x-x-x-x-',
                bass: BASS,
                drums: {
                    tom: 'x.....x.x.......|x.....x.x.......|x.....x.x.......|........x.x.x.x.',
                    hat: '................|................|' + HAT + '|' + HAT,
                    kick: '................|................|' + KICK + '|x.....x.........'
                }
            },
            A: {
                chords: CHORDS_A,
                lead: THEME,
                arp: ARP,
                bass: BASS,
                drums: { ...DRUMS, crash: CRASH }
            },
            A2: {
                label: "A'",
                chords: CHORDS_A2,
                lead: THEME_TURN,
                arp: ARP,
                brass: BRASS_TO_B,
                bass: BASS,
                drums: DRUMS_FILL
            },
            // サビ：弦を敷いて厚くし、ブラスが小節の頭で吹く
            B: {
                chords: CHORDS_B,
                lead: CHORUS,
                arp: ARP,
                strings: 'hold',
                brass: BRASS_BAR,
                bass: BASS,
                drums: { ...DRUMS_CHORUS, crash: CRASH }
            },
            // 休憩：Am と Em を行き来して、息をひそめる。ドラムは4分のキックだけ、分散和音は8分に。合唱を薄く重ねる
            C: {
                chords: 'Am | Em | Am | Em | C | D | B7sus4 | B7',
                lead: `r:16 | r:4 B5:4 G5:8 | r:16 | r:4 G5:4 E5:8 |
                       r:16 | r:4 A5:4 F#5:8 | r:16 | r:4 A5:4 F#5:4 D#5:4`,
                arp: ARP_SLOW,
                pad: 'hold',
                choir: 'hold',
                bass: 'R:4 r:4 R:4 r:4',
                drums: {
                    kick: repeat('x...x...x...x...', 7, '|') + '|x...x...x.x.x.x.',
                    hat: repeat('..o...o...o...o.', 8, '|')
                }
            },
            // A に、シロフォンの合いの手と、ブラスを足す
            A3: {
                label: 'A',
                chords: CHORDS_A,
                lead: THEME,
                counter: COUNTER,
                arp: ARP,
                brass: BRASS_BAR + '|' + repeat('................', 3, '|') + '|' + BRASS_BAR + '|' + repeat('................', 2, '|') + '|' + BRASS_TURN,
                bass: BASS,
                drums: { ...DRUMS_FILL, crash: CRASH }
            },
            // ループの終わりのサビ：弦に合唱を重ねて、いちばん厚く。B7 で終えて、頭の Em へ戻る
            B2: {
                label: "B'",
                chords: CHORDS_B2,
                lead: CHORUS_LAST,
                counter: 'r:16 | r:16 | r:16 | r:8 B5:4 G5:4 | r:16 | r:16 | r:16 | r:16',
                arp: ARP,
                strings: 'hold',
                choir: { pattern: 'hold', center: 'G4' },
                brass: repeat(BRASS_BAR, 7, '|') + '|' + BRASS_TURN,
                bass: BASS,
                drums: {
                    crash: CRASH,
                    kick: repeat('x.....x.x.....x.', 7, '|') + '|x.....x.........',
                    snare: repeat(SNARE, 7, '|') + '|....x.......x.xx',
                    hat: repeat('x.o.x.o.x.o.x...', 7, '|') + '|x.o.x.o.x.o.....',
                    openHat: repeat('..............x.', 8, '|')
                }
            }
        },
        intro: ['intro'],
        loop: ['A', 'A2', 'B', 'C', 'A3', 'B2']
    };

    SoundKit.register('catalog', { songs: { battle } });
})();
