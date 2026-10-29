/**
 * 曲の一覧：ネオン街のマンボ（ラテン・ハ長調で、明るく弾む）
 * ピアノの伴奏がモントゥーノの繰り返しを8分で刻み、ベースは2拍目の裏と4拍目で跳ねる（トゥンバオ）。クラベスは3-2
 * 主題は拍の裏から食って入り、句の終わりでブラスが「パッ・パッ」と鋭く答える。A' からカウベルが4分で鳴る
 * B はイ短調から巡り、ピアノが1小節歌うとブラスが1小節答える。休憩の C はピアノを抜き、フルートがひとりで歌う
 */
(function () {
    // A の主題（16小節）。拍の裏から食って入り、4小節ごとに後半を空ける
    const THEME = `E5:2 G5:4 C6:4 r:2 G5:4 | A5:6 F5:2 r:4 C6:4 | B5:2 D6:4 B5:4 r:2 G5:4 | C6:8 r:4 E5:2 G5:2 |
                   E6:2 D6:4 C6:4 r:2 G5:4 | A5:6 C6:2 r:4 F5:4 | D6:2 B5:4 G5:4 r:2 F5:4 | E5:8 r:8 |
                   C6:2 A5:4 F5:4 r:2 A5:4 | C6:6 D6:2 r:4 C6:4 | G5:2 E5:4 G5:4 r:2 C6:4 | A5:8 r:4 C6:2 D6:2 |
                   D6:2 C6:4 A5:4 r:2 F5:4 | G5:6 B5:2 r:4 D6:4 | C6:2 G5:4 E5:4 r:2 G5:4 | B5:8 r:4 D6:4`;
    const CHORDS_A = `C | F | G7 | C | C | F | G7 | C |
                      F | F | C | Am | Dm7 | G7 | C | G7`;
    // ブラスの合いの手：4小節ごとの空きに、鋭く2つ
    const hit = chord => `r:8 ${chord}:2 r:2 ${chord}:2 r:2`;
    const BRASS_A = `r:16 | r:16 | r:16 | ${hit('[E4,G4,C5]')} | r:16 | r:16 | r:16 | ${hit('[E4,G4,C5]')} |
                     r:16 | r:16 | r:16 | ${hit('[E4,A4,C5]')} | r:16 | r:16 | r:16 | ${hit('[F4,B4,D5]')}`;

    // B：イ短調から巡る。ピアノが1小節歌い、ブラスが1小節答える（8小節を2回）
    const CHORDS_B_HALF = 'Am | Dm7 | G7 | C | F | Dm7 | G7 | G7';
    const SONG_B_HALF = 'E5:4 A5:4 C6:6 r:2 | D6:8 r:8 | D5:4 G5:4 B5:6 r:2 | C6:8 r:8 | A5:4 C6:4 F5:6 r:2 | A5:8 r:8 | B5:4 D6:4 F5:6 r:2 | G5:8 r:8';
    const BRASS_B_HALF = `r:16 | ${hit('[F4,A4,C5]')} | r:16 | ${hit('[E4,G4,C5]')} | r:16 | ${hit('[F4,A4,C5]')} | r:16 | ${hit('[F4,B4,D5]')}`;

    // 休憩：フルートがひとりで歌う。G7 で最後の A へ
    const CHORDS_C = 'C | Am | Dm7 | G7 | C | Am | Dm7 | G7';
    const FLUTE_C = 'G5:8 E5:8 | A5:8 C6:8 | D6:8 A5:8 | B5:12 r:4 | C6:8 G5:8 | E5:8 A5:8 | F5:8 A5:8 | G5:8 B5:8';

    // モントゥーノ：8分で和音を崩して繰り返す。ベースはトゥンバオで跳ねる
    const MONTUNO = '0:2 2 1 2 r 1 2 0';
    const BASS = 'r:6 5:6 R:4';
    const COWBELL = 'G6:4 G6:2 G6:2 G6:4 G6:4';
    // クラベス（3-2）とコンガ
    const CLAVE = 'x.....x.....x...|....x...x.......';
    const KICK = 'x.......x.......';
    const CONGA_HIGH = '......x.......xx';
    const CONGA_MID = '............x...';
    const DRUMS = { kick: KICK, rim: CLAVE, tomHigh: CONGA_HIGH, tomMid: CONGA_MID };
    // B のギロのつもりのシェイカー（16分で動くのはこれだけ）
    const GUIRO = 'x.xxx.xxx.xxx.xx';

    // マンボ：モントゥーノとトゥンバオ、ブラスの合いの手、カウベル
    const mambo = {
        title: 'ネオン街のマンボ',
        tags: ['明るい', '軽快'],
        genre: 'ラテン',
        melody: ['lead'],
        bpm: 180,
        gain: 0.1,
        reverb: { seconds: 1.4, tone: 0.5 },
        delay: { time: 0.75, feedback: 0.2, tone: 2400, reverb: 0.2 },
        humanize: { time: 0.004, velocity: 0.1 },
        parts: {
            lead: { instrument: 'piano', volume: 0.52, pan: -0.08, decay: 0.7, brightness: 0.95, reverb: 0.18, delay: 0.06 },
            // 休憩の C で歌うフルート
            flute: { instrument: 'flute', volume: 0.45, pan: 0.15, breath: 0.06, vibrato: 10, reverb: 0.3, delay: 0.15 },
            // ブラスの鋭い合いの手
            brass: { instrument: 'brass', volume: 0.7, pan: 0.3, brightness: 4, release: 0.05, gate: 0.5, reverb: 0.2 },
            // ピアノのモントゥーノ
            montuno: { instrument: 'piano', mode: 'arp', from: 'C4', volume: 0.26, pan: -0.25, decay: 0.5, brightness: 0.8, reverb: 0.15 },
            cowbell: { instrument: 'bell', volume: 0.6, decay: 0.15, ratio: 2.4, pan: 0.35, reverb: 0.15 },
            bass: { instrument: 'pluck', mode: 'bass', octave: 2, brightness: 0.5, volume: 0.85 },
            drums: { instrument: 'drums', kit: 'soft', mode: 'drums', volume: 0.7, cutoff: 7500, levels: { kick: 0.55, rim: 0.4, tomHigh: 0.4, tomMid: 0.4, shaker: 0.3, crash: 0.3 } }
        },
        sections: {
            // イントロ：モントゥーノとクラベスから、ベースが入る。最後にブラスが鳴って主題へ
            intro: {
                label: 'イントロ',
                chords: 'C | F | G7 | G7',
                montuno: MONTUNO,
                bass: { pattern: `r:16 | ${BASS} | ${BASS} | ${BASS}` },
                brass: 'r:16 | r:16 | r:16 | [F4,B4,D5]:2 r:4 [F4,B4,D5]:2 r:4 [F4,B4,D5]:2 r:2',
                drums: { rim: CLAVE, tomHigh: '................|................|......x.......xx|......x.......xx' }
            },
            A: {
                chords: CHORDS_A,
                lead: THEME,
                montuno: MONTUNO,
                bass: BASS,
                drums: DRUMS
            },
            // A'：ブラスの合いの手と、カウベル
            A2: {
                label: "A'",
                chords: CHORDS_A,
                lead: THEME,
                brass: BRASS_A,
                montuno: MONTUNO,
                cowbell: COWBELL,
                bass: BASS,
                drums: DRUMS
            },
            // B：ピアノとブラスが1小節ずつ掛け合う。ギロが細かく刻む
            B: {
                chords: `${CHORDS_B_HALF} | ${CHORDS_B_HALF}`,
                lead: `${SONG_B_HALF} | ${SONG_B_HALF}`,
                brass: `${BRASS_B_HALF} | ${BRASS_B_HALF}`,
                montuno: MONTUNO,
                cowbell: COWBELL,
                bass: BASS,
                drums: { ...DRUMS, shaker: GUIRO, crash: 'x...............' }
            },
            // 休憩：ピアノの主題とブラス、カウベルを抜き、フルートがひとりで歌う
            C: {
                chords: CHORDS_C,
                flute: FLUTE_C,
                montuno: MONTUNO,
                bass: BASS,
                drums: { rim: CLAVE, tomHigh: CONGA_HIGH }
            },
            // 最後の A'：全部がそろい、G7 で頭の C へ戻る
            A3: {
                label: "A'",
                chords: CHORDS_A,
                lead: THEME,
                brass: BRASS_A,
                montuno: MONTUNO,
                cowbell: COWBELL,
                bass: BASS,
                drums: { ...DRUMS, crash: 'x...............' }
            }
        },
        intro: ['intro'],
        loop: ['A', 'A2', 'B', 'C', 'A3']
    };

    SoundKit.register('catalog', { songs: { mambo } });
})();
