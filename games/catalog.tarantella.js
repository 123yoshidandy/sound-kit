/**
 * 曲の一覧：月夜のタランテラ（クラシック・イ短調の8分の6拍子で、速く、息をつかせず回る）
 * 1小節は12ステップ（付点4分音符×2）。ベースが付点4分で踏み、弦のピチカートが「ズン・チャッチャ」の「チャッチャ」を運ぶ
 * タンバリンのつもりのシェイカーが8分で鳴り続け、A' からは弦が和音を薄く伸ばす。B はハ長調の F から開き、E7 でイ短調へ戻る
 * 休憩の C はピアノとタンバリンを抜き、弦がひとりで歌う。最後の A はフルートが主題に重なり、E7 で頭の Am へ戻る
 */
(function () {
    const { repeat } = SoundKit;

    // A の主題（前半15小節は最後の A でも同じ）。「タッ・タ」の付点のはずみで回る
    const THEME_HEAD = `A5:4 C6:2 E6:4 C6:2 | A5:6 E5:6 | G#5:4 B5:2 D6:4 B5:2 | E6:6 D6:6 |
                        C6:4 B5:2 A5:4 C6:2 | D6:4 C6:2 A5:6 | G#5:4 B5:2 E6:4 D6:2 | C6:6 A5:6 |
                        F5:4 A5:2 D6:6 | C6:4 B5:2 A5:6 | B5:4 G#5:2 E5:6 | A5:6 C6:6 |
                        F5:4 A5:2 D6:4 C6:2 | C6:6 A5:6 | B5:4 D6:2 G#5:4 B5:2`;
    const THEME = `${THEME_HEAD} | A5:12`;
    // ループの終わり：E7 で止めて、導音の G# から頭の A へ
    const THEME_LAST = `${THEME_HEAD} | E6:6 B5:4 G#5:2`;
    const CHORDS_HEAD = `Am | Am | E7 | E7 | Am | Dm | E7 | Am |
                         Dm | Am | E7 | Am | Dm | Am | E7`;
    const CHORDS_A = `${CHORDS_HEAD} | Am`;
    const CHORDS_LAST = `${CHORDS_HEAD} | E7`;

    // B：ハ長調の F から開き、E7 でイ短調へ戻る（8小節を2回）
    const CHORDS_B_HALF = 'F | C | G7 | C | F | C | Dm:6 E7:6';
    const CHORDS_B = `${CHORDS_B_HALF} | Am | ${CHORDS_B_HALF} | E7`;
    const SONG_B_HALF = `C6:4 A5:2 F5:6 | E5:4 G5:2 C6:6 | D6:4 B5:2 G5:6 | C6:6 G5:6 |
                         A5:4 F5:2 C6:6 | E6:4 D6:2 C6:6 | D6:4 A5:2 B5:4 G#5:2`;
    const SONG_B = `${SONG_B_HALF} | A5:12 | ${SONG_B_HALF} | E5:6 G#5:4 B5:2`;

    // 休憩：弦がひとりで歌う。E7 で最後の A へ
    const CHORDS_C = 'Dm | Am | Dm | E7 | Dm | Am | F:6 E7:6 | E7';
    const SOLO_C = 'F5:12 | E5:6 C6:6 | A5:6 F5:6 | G#5:12 | A5:6 D6:6 | C6:6 A5:6 | A5:6 G#5:6 | B5:12';

    // ズン・チャッチャ：ベースが付点4分で踏み、ピチカートが残りの8分を運ぶ
    const PIZZ = '..x.x...x.x.';
    const BASS = 'R:6 5:6';
    const KICK = repeat('x.....x.....', 16, '|');
    // タンバリン：8分で鳴り続け、付点4分の頭を強く
    const TAMB = repeat('x.o.o.x.o.o.', 16, '|');
    // B のタンバリン：付点4分の終わりを細かく揺らす（16分で動くのはこれだけ）
    const TAMB_ROLL = repeat('x.o.oox.o.oo', 16, '|');

    // タランテラ：弦のピチカートとタンバリン
    const tarantella = {
        title: '月夜のタランテラ',
        tags: ['軽快', '緊張感'],
        genre: 'クラシック',
        meter: '6/8',
        melody: ['lead'],
        bpm: 152,
        stepsPerBar: 12,
        gain: 0.1,
        reverb: { seconds: 1.8, tone: 0.5 },
        delay: { time: 1.5, feedback: 0.15, tone: 2200 },
        humanize: { time: 0.005, velocity: 0.1 },
        parts: {
            lead: { instrument: 'piano', volume: 0.52, pan: -0.08, decay: 0.75, brightness: 0.9, reverb: 0.2, delay: 0.06 },
            // 最後の A で主題に重ねるフルート
            unison: { instrument: 'flute', volume: 0.35, pan: 0.15, breath: 0.05, vibrato: 10, reverb: 0.25, delay: 0.1 },
            // 休憩の C で歌う弦
            solo: { instrument: 'strings', volume: 1, pan: 0.15, attack: 0.1, release: 0.4, brightness: 0.9, vibrato: 10, reverb: 0.35 },
            // 弦のピチカート：短く切って「チャッチャ」を運ぶ
            pizz: { instrument: 'strings', mode: 'chords', center: 'E4', voices: 3, gate: 0.3, attack: 0.01, release: 0.06, volume: 1.0, pan: 0.2, brightness: 0.9, vibrato: 0, reverb: 0.25 },
            // A' と B で和音を薄く伸ばす弦
            strings: { instrument: 'strings', mode: 'chords', center: 'C4', voices: 3, volume: 0.4, pan: -0.2, attack: 0.3, release: 0.5, brightness: 0.7, reverb: 0.4 },
            bass: { instrument: 'pluck', mode: 'bass', octave: 2, brightness: 0.4, sustain: 0.994, release: 0.08, volume: 1.05, gate: 0.6 },
            drums: { instrument: 'drums', kit: 'soft', mode: 'drums', volume: 0.7, cutoff: 7500, levels: { kick: 0.55, shaker: 0.4, crash: 0.3 } }
        },
        sections: {
            // イントロ：ピチカートとベースから、タンバリンが入る。E7 で主題へ
            intro: {
                label: 'イントロ',
                chords: 'Am | Dm | Am | E7',
                pizz: PIZZ,
                bass: BASS,
                drums: {
                    kick: repeat('x.....x.....', 4, '|'),
                    shaker: '............|............|x.o.o.x.o.o.|x.o.o.x.oooo'
                }
            },
            A: {
                chords: CHORDS_A,
                lead: THEME,
                pizz: PIZZ,
                bass: BASS,
                drums: { kick: KICK, shaker: TAMB }
            },
            // A'：弦が和音を薄く伸ばす
            A2: {
                label: "A'",
                chords: CHORDS_A,
                lead: THEME,
                pizz: PIZZ,
                strings: 'hold',
                bass: BASS,
                drums: { kick: KICK, shaker: TAMB }
            },
            // B：ハ長調の F から開く。タンバリンが細かく揺れ、E7 で休憩へ
            B: {
                chords: CHORDS_B,
                lead: SONG_B,
                pizz: PIZZ,
                strings: 'hold',
                bass: BASS,
                drums: { kick: KICK, shaker: TAMB_ROLL, crash: 'x...........' }
            },
            // 休憩：ピアノとタンバリンを抜き、弦がひとりで歌う。ピチカートは付点4分の頭だけ
            C: {
                chords: CHORDS_C,
                solo: SOLO_C,
                pizz: 'x.....x.....',
                bass: 'R:12',
                drums: { kick: repeat('x...........', 8, '|') }
            },
            // 最後の A：フルートが主題に重なり、E7 で頭の Am へ戻る
            A3: {
                label: 'A',
                chords: CHORDS_LAST,
                lead: THEME_LAST,
                unison: THEME_LAST,
                pizz: PIZZ,
                bass: BASS,
                drums: { kick: KICK, shaker: TAMB, crash: 'x...........' }
            }
        },
        intro: ['intro'],
        loop: ['A', 'A2', 'B', 'C', 'A3']
    };

    SoundKit.register('catalog', { songs: { tarantella } });
})();
