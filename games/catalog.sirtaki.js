/**
 * 曲の一覧：エーゲ海のシルタキ（ギリシャのシルタキ・ニ長調の2拍子で、だんだん速くなる踊り）
 * 2拍子なので stepsPerBar: 8。テンポは変えず、区間ごとに音を細かくして、ゆっくりから速くなる気分を出す
 * A は2分と4分で静かに主題を置き、A' は同じ主題を8分で刻む。B は G から開いて8分で駆け、最後の A は手拍子とタンバリンが加わる
 * B' でブズーキのつもりのギターが16分で駆け上がって答え、A7 から頭のゆっくりした A へ戻る（ゆっくりした A が休憩の代わり）
 */
(function () {
    // 和音は A も B も8小節を2回
    const CHORDS_A_HALF = 'D | D | A7 | A7 | G | D | A7 | D';
    const CHORDS_A = `${CHORDS_A_HALF} | ${CHORDS_A_HALF}`;

    // A：ゆっくり。2分と4分で主題を置く
    const SLOW_HALF = 'A5:4 F#5:4 | D6:8 | G5:4 E5:4 | C#6:8 | B5:4 G5:4 | A5:8 | E5:4 G5:4';
    const SLOW = `${SLOW_HALF} | F#5:8 | ${SLOW_HALF} | D6:8`;
    // A のギターの合いの手：主題が伸ばす小節の後半で答える
    const SLOW_FILL_HALF = 'r:8 | r:4 F#5:2 E5:2 | r:8 | r:4 E5:2 G5:2 | r:8 | r:4 D5:2 E5:2 | r:8 | r:4 A4:2 C#5:2';
    const SLOW_FILL = `${SLOW_FILL_HALF} | ${SLOW_FILL_HALF}`;

    // A' と最後の A：同じ主題を8分で刻む
    const QUICK_HALF = 'A5:2 F#5:2 A5:2 D6:2 | D6:4 A5:4 | G5:2 E5:2 G5:2 A5:2 | C#6:4 A5:4 | B5:2 G5:2 B5:2 D6:2 | A5:4 F#5:4 | E5:2 G5:2 A5:2 C#6:2';
    const QUICK = `${QUICK_HALF} | D6:4 r:4 | ${QUICK_HALF} | D6:6 r:2`;

    // B：G から開いて8分で駆ける。B' は A7 で頭の D へ
    const CHORDS_B_HALF = 'G | G | D | D | A7 | A7 | D';
    const CHORDS_B = `${CHORDS_B_HALF} | D | ${CHORDS_B_HALF} | D`;
    const CHORDS_B2 = `${CHORDS_B_HALF} | D | ${CHORDS_B_HALF} | A7`;
    const SONG_B_HALF = 'B5:2 D6:2 B5:4 | G5:2 A5:2 B5:4 | A5:2 F#5:2 A5:4 | D6:2 C#6:2 D6:4 | E5:2 A5:2 C#6:4 | G5:2 F#5:2 E5:4 | F#5:2 A5:2 D6:4';
    const SONG_B = `${SONG_B_HALF} | D6:8 | ${SONG_B_HALF} | D6:8`;
    const SONG_B2 = `${SONG_B_HALF} | D6:8 | ${SONG_B_HALF} | C#6:4 E5:4`;
    // B' のブズーキ：主題が伸ばす所で、16分で駆け上がる（16分で動くのはこれだけ）
    const RUN_HALF = 'r:4 G4:1 A4:1 B4:1 D5:1 | r:8 | r:4 D5:1 E5:1 F#5:1 A5:1 | r:8 | r:4 A4:1 C#5:1 E5:1 G5:1 | r:8 | r:4 D5:1 E5:1 F#5:1 A5:1';
    const RUN = `${RUN_HALF} | r:8 | ${RUN_HALF} | r:4 E5:1 G5:1 A5:1 C#6:1`;

    // ベースと、ギターの裏打ち：区間ごとに細かくする
    const BASS_SLOW = 'R:8';
    const BASS = 'R:4 5:4';
    const STRUM_SLOW = 'x...x...';
    const STRUM = '..x...x.';
    const KICK = 'x...x...';
    const CLAP = '..x...x.';
    const TAMB = 'x.x.x.x.';

    // シルタキ：ブズーキ風のギターと、だんだん細かくなる刻み
    const sirtaki = {
        title: 'エーゲ海のシルタキ',
        tags: ['明るい'],
        genre: 'ワールド',
        melody: ['lead'],
        bpm: 112,
        stepsPerBar: 8,
        gain: 0.1,
        reverb: { seconds: 1.6, tone: 0.5 },
        delay: { time: 0.75, feedback: 0.18, tone: 2400, reverb: 0.2 },
        humanize: { time: 0.005, velocity: 0.1 },
        parts: {
            lead: { instrument: 'piano', volume: 0.52, pan: -0.08, decay: 0.8, brightness: 0.9, reverb: 0.22, delay: 0.08 },
            // ブズーキのつもり：明るいギターで主題に答える
            bouzouki: { instrument: 'guitar', volume: 0.75, pan: 0.25, brightness: 0.85, reverb: 0.25, delay: 0.12 },
            // ギターの刻み
            strum: { instrument: 'guitar', mode: 'chords', center: 'D4', voices: 3, strum: 0.012, gate: 0.4, brightness: 0.6, volume: 0.8, pan: -0.25, reverb: 0.2 },
            bass: { instrument: 'pluck', mode: 'bass', octave: 2, brightness: 0.4, volume: 0.85 },
            drums: { instrument: 'drums', kit: 'soft', mode: 'drums', volume: 0.7, cutoff: 7500, levels: { kick: 0.55, clap: 0.4, shaker: 0.35, crash: 0.3 } }
        },
        sections: {
            // イントロ：ギターの刻みとベースで、ゆっくり。A7 で主題へ
            intro: {
                label: 'イントロ',
                chords: 'D | G | A7 | A7',
                strum: STRUM_SLOW,
                bouzouki: 'r:8 | r:8 | r:8 | r:4 A4:2 C#5:2',
                bass: BASS_SLOW
            },
            // A：ゆっくり。ギターが合いの手を入れる
            A: {
                chords: CHORDS_A,
                lead: SLOW,
                bouzouki: SLOW_FILL,
                strum: STRUM_SLOW,
                bass: BASS_SLOW
            },
            // A'：同じ主題を8分で。ベースは表と裏に
            A2: {
                label: "A'",
                chords: CHORDS_A,
                lead: QUICK,
                strum: STRUM,
                bass: BASS,
                drums: { kick: KICK }
            },
            // B：G から開いて駆ける。手拍子が入る
            B: {
                chords: CHORDS_B,
                lead: SONG_B,
                strum: STRUM,
                bass: BASS,
                drums: { kick: KICK, clap: CLAP, crash: 'x.......' }
            },
            // 最後の A：手拍子とタンバリンがそろう
            A3: {
                label: 'A',
                chords: CHORDS_A,
                lead: QUICK,
                strum: STRUM,
                bass: BASS,
                drums: { kick: KICK, clap: CLAP, shaker: TAMB }
            },
            // B'：ブズーキが16分で駆け上がって答え、A7 で頭のゆっくりした A へ
            B2: {
                label: "B'",
                chords: CHORDS_B2,
                lead: SONG_B2,
                bouzouki: RUN,
                strum: STRUM,
                bass: BASS,
                drums: { kick: KICK, clap: CLAP, shaker: TAMB, crash: 'x.......' }
            }
        },
        intro: ['intro'],
        loop: ['A', 'A2', 'B', 'A3', 'B2']
    };

    SoundKit.register('catalog', { songs: { sirtaki } });
})();
