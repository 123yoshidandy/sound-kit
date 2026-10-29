/**
 * 曲の一覧：入り江のスティールパン（カリプソ・ハ長調で、陽気に弾む）
 * スティールパンが「タン・タン・タ」の3＋3＋2で和音を弾き、ベースが跳ねる。主題も同じ3＋3＋2で始まる
 * A' からカウベルとコンガのつもりのタムが加わる。B はイ短調から巡り、シェイカーが16分で刻む
 * 休憩の C はピアノを抜いて、ギターが歌う。最後の A はスティールパンが主題に重なり、B' の G7 で頭の C へ戻る
 */
(function () {
    const { repeat } = SoundKit;

    // A の主題：3＋3＋2で弾む。4小節目と8小節目の後半は空ける
    const THEME = `G5:3 E5:3 C5:2 r:2 E5:2 G5:4 | A5:3 C6:3 A5:2 r:2 F5:2 A5:4 | B5:3 D6:3 B5:2 r:2 G5:2 F5:4 | E5:8 r:4 G5:2 A5:2 |
                   C6:3 G5:3 E5:2 r:2 G5:2 C6:4 | A5:3 F5:3 C5:2 r:2 F5:2 A5:4 | G5:3 B5:3 D6:2 r:2 B5:2 G5:2 F5:2 | E5:8 r:8`;
    const CHORDS_A = 'C | F | G7 | C | C | F | G7 | C';

    // B：イ短調から巡り、G7 で次へ
    const CHORDS_B = 'Am | Dm | G7 | C | F | D7 | G | G7';
    const SONG_B = `C6:6 A5:2 E5:4 A5:4 | D6:6 A5:2 F5:4 A5:4 | B5:6 G5:2 D5:4 F5:4 | E5:3 G5:3 C6:6 r:4 |
                    A5:6 C6:2 F5:4 A5:4 | F#5:6 A5:2 D6:4 C6:4 | B5:6 A5:2 G5:4 D5:4 | F5:3 G5:3 B5:2 r:2 D6:2 B5:4`;

    // 休憩：ギターが歌う。G7 で A へ
    const CHORDS_C = 'F | C | Dm | G7 | Em | Am | Dm | G7';
    const SOLO_C = 'A5:8 C6:8 | G5:12 E5:4 | F5:8 A5:8 | G5:12 B5:4 | G5:8 E5:8 | A5:8 C6:8 | A5:8 F5:8 | G5:8 D5:8';

    // スティールパンは3＋3＋2を2回、ベースは跳ねる
    const PAN = 'x..x..x.x..x..x.';
    const BASS = 'R:3 R+:3 5:2 r:2 5:2 R:4';
    // カウベルのつもり：すぐ消えるベル
    const COWBELL = 'r:4 G6:1 r:3 r:2 G6:1 r:1 G6:1 r:3';
    const KICK = repeat('x.......x.......', 8, '|');
    const RIM = repeat('...x..x....x..x.', 8, '|');
    const HAT = repeat('x.x.x.x.x.x.x.x.', 8, '|');
    const CONGA_HIGH = repeat('......x.......x.', 8, '|');
    const CONGA_MID = repeat('...........x....', 8, '|');
    const DRUMS_A = { kick: KICK, rim: RIM, hat: HAT };
    // A' からは、ハイハットの代わりにコンガ
    const DRUMS_A2 = { kick: KICK, rim: RIM, tomHigh: CONGA_HIGH, tomMid: CONGA_MID };
    const DRUMS_B = { kick: KICK, rim: RIM, shaker: repeat('x.xxx.xxx.xxx.xx', 8, '|'), tomHigh: CONGA_HIGH, tomMid: CONGA_MID };

    // カリプソ：スティールパンと跳ねるベース、カウベルとコンガ
    const calypso = {
        title: '入り江のスティールパン',
        tags: ['明るい', '軽快'],
        genre: 'ラテン',
        melody: ['lead'],
        bpm: 112,
        swing: 0.05,
        swingUnit: 1,
        gain: 0.1,
        reverb: { seconds: 1.6, tone: 0.5 },
        delay: { time: 0.75, feedback: 0.22, tone: 2400, reverb: 0.2 },
        humanize: { time: 0.005, velocity: 0.1 },
        parts: {
            lead: { instrument: 'piano', volume: 0.55, pan: -0.08, decay: 0.75, brightness: 0.9, reverb: 0.2, delay: 0.08 },
            // 最後の A で主題に重ねるスティールパン
            panLead: { instrument: 'steelpan', volume: 0.35, pan: 0.2, reverb: 0.25, delay: 0.1 },
            // 休憩の C で歌うギター
            solo: { instrument: 'guitar', volume: 1.4, pan: 0.15, brightness: 0.7, reverb: 0.3, delay: 0.15 },
            // スティールパンの和音
            pan: { instrument: 'steelpan', mode: 'chords', center: 'E4', voices: 3, volume: 0.22, pan: 0.25, reverb: 0.25, delay: 0.1 },
            cowbell: { instrument: 'bell', volume: 0.65, decay: 0.15, ratio: 2.4, pan: 0.35, reverb: 0.15 },
            bass: { instrument: 'pluck', mode: 'bass', octave: 2, brightness: 0.5, volume: 0.9 },
            drums: { instrument: 'drums', kit: 'soft', mode: 'drums', volume: 0.8, cutoff: 7500, levels: { kick: 0.6, rim: 0.4, hat: 0.3, shaker: 0.35, tomHigh: 0.4, tomMid: 0.4, crash: 0.35 } }
        },
        sections: {
            // イントロ：スティールパンから、ベースとドラムが入る。G7 で主題へ
            intro: {
                label: 'イントロ',
                chords: 'C | F | C | G7',
                pan: PAN,
                bass: { pattern: `r:16 | ${BASS} | ${BASS} | ${BASS}` },
                drums: {
                    kick: '................|' + repeat('x.......x.......', 3, '|'),
                    rim: '................|................|...x..x....x..x.|...x..x....x.xxx'
                }
            },
            A: {
                chords: CHORDS_A,
                lead: THEME,
                pan: PAN,
                bass: BASS,
                drums: DRUMS_A
            },
            // A'：カウベルとコンガが加わる
            A2: {
                label: "A'",
                chords: CHORDS_A,
                lead: THEME,
                pan: PAN,
                cowbell: COWBELL,
                bass: BASS,
                drums: DRUMS_A2
            },
            // B：イ短調から巡り、シェイカーが16分で刻む
            B: {
                chords: CHORDS_B,
                lead: SONG_B,
                pan: PAN,
                cowbell: COWBELL,
                bass: BASS,
                drums: { ...DRUMS_B, crash: 'x...............' }
            },
            // 休憩：ピアノとカウベルを抜き、ギターが歌う。スティールパンは小節の頭だけ
            C: {
                chords: CHORDS_C,
                solo: SOLO_C,
                pan: 'x.......x.......',
                bass: 'R:8 5:8',
                drums: { kick: KICK, tomHigh: CONGA_HIGH }
            },
            // A：スティールパンが主題に重なる
            A3: {
                label: 'A',
                chords: CHORDS_A,
                lead: THEME,
                panLead: THEME,
                pan: PAN,
                cowbell: COWBELL,
                bass: BASS,
                drums: { ...DRUMS_A2, crash: 'x...............' }
            },
            // 最後の B'：G7 で頭の C へ戻る
            B2: {
                label: "B'",
                chords: CHORDS_B,
                lead: SONG_B,
                pan: PAN,
                cowbell: COWBELL,
                bass: BASS,
                drums: DRUMS_B
            }
        },
        intro: ['intro'],
        loop: ['A', 'A2', 'B', 'C', 'A3', 'B2']
    };

    SoundKit.register('catalog', { songs: { calypso } });
})();
