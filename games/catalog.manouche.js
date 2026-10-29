/**
 * 曲の一覧：キャラバンのマヌーシュ・スウィング（ジャズ・イ短調のスウィングで、ジプシージャズらしく）
 * ギターが「ラ・ポンプ」で4拍を刻み、2・4拍を強く短く切る。ベースは1・3拍で根音と5度を踏む。ドラムは入れない
 * ピアノの主題は分散和音で上がって小節の後半を空け、A' からはバイオリンのつもりの弦がその空きに合いの手を入れる
 * B は Dm6 から開き、後半は弦が下で長く支える。休憩の C はピアノを抜き、弦がひとりで歌う。最後は E7 で頭の Am6 へ戻る
 */
(function () {
    const { repeat } = SoundKit;

    // A の主題（16小節）。分散和音で上がり、偶数小節の後半を空ける
    const THEME = `E5:2 A5:2 C6:2 E6:6 r:4 | D6:2 C6:2 A5:4 r:8 | D5:2 F5:2 A5:2 D6:6 r:4 | B5:2 A5:2 F5:4 r:8 |
                   E5:2 G#5:2 B5:2 D6:6 r:4 | D6:2 B5:2 G#5:4 r:8 | A5:4 C6:4 E6:4 C6:4 | A5:8 r:8 |
                   A5:2 D6:2 F5:2 A5:6 r:4 | B5:2 A5:2 F5:4 r:8 | C6:2 E6:2 A5:2 C6:6 r:4 | B5:2 A5:2 E5:4 r:8 |
                   G#5:2 B5:2 E5:2 G#5:6 r:4 | E6:2 D6:2 B5:4 r:8 | C6:4 A5:4 E5:4 A5:4 | G#5:8 B5:4 r:4`;
    const CHORDS_A = `Am6 | Am6 | Dm6 | Dm6 | E7 | E7 | Am6 | Am6 |
                      Dm6 | Dm6 | Am6 | Am6 | E7 | E7 | Am6 | E7`;
    // 弦の合いの手：主題が空けた所で答える
    const FILL = `r:16 | r:8 E5:2 F#5:2 A5:4 | r:16 | r:8 D5:2 F5:2 B5:4 | r:16 | r:8 B4:2 D5:2 G#5:4 | r:16 | r:8 C6:2 B5:2 A5:4 |
                  r:16 | r:8 A4:2 B4:2 D5:4 | r:16 | r:8 C5:2 E5:2 F#5:4 | r:16 | r:8 G#4:2 B4:2 D5:4 | r:16 | r:12 D5:2 E5:2`;

    // B：Dm6 から開き、F7 から E7 へ下りる（8小節を2回）
    const CHORDS_B_HALF = 'Dm6 | Dm6 | Am6 | Am6 | F7 | E7 | Am6 | E7';
    const SONG_B_HALF = 'F5:6 A5:2 D6:8 | B5:8 A5:8 | E5:6 A5:2 C6:8 | B5:8 A5:4 r:4 | A5:6 C6:2 Eb6:8 | D6:8 B5:4 G#5:4 | C6:6 B5:2 A5:8 | G#5:8 r:8';
    // B の後半：弦が下で長く支える
    const LOW_B = 'D5:16 | D5:16 | C5:16 | C5:16 | Eb5:16 | D5:16 | C5:16 | B4:16';

    // 休憩：弦がひとりで歌う。E7 で頭の Am6 へ
    const CHORDS_C = 'Am6 | Dm6 | G7 | Cmaj7 | F7 | E7 | Am6 | E7';
    const SOLO_C = 'E5:16 | F5:8 A5:8 | B5:8 G5:8 | E5:12 G5:4 | A5:8 Eb5:8 | D5:8 G#5:8 | A5:8 C6:8 | B5:16';

    // ラ・ポンプ：4拍を刻み、2・4拍を強く。ベースは1・3拍
    const POMPE = 'o...x...o...x...';
    const BASS = 'R:4 r:4 5:4 r:4';

    // ジプシージャズ：ラ・ポンプのギターと、バイオリンのつもりの弦
    const manouche = {
        title: 'キャラバンのマヌーシュ・スウィング',
        tags: ['おしゃれ'],
        genre: 'ジャズ・ブルース',
        melody: ['lead'],
        bpm: 180,
        swing: 0.12,
        swingUnit: 2,
        gain: 0.1,
        reverb: { seconds: 1.6, tone: 0.5 },
        delay: { time: 0.75, feedback: 0.18, tone: 2200, reverb: 0.2 },
        humanize: { time: 0.006, velocity: 0.1 },
        parts: {
            lead: { instrument: 'piano', volume: 0.52, pan: -0.08, decay: 0.7, brightness: 0.9, reverb: 0.2, delay: 0.06 },
            // バイオリンのつもり：合いの手と、B の後半の支え
            fill: { instrument: 'strings', volume: 0.7, pan: 0.25, attack: 0.05, release: 0.25, brightness: 1, vibrato: 12, reverb: 0.3, delay: 0.1 },
            // 休憩の C で歌う弦
            solo: { instrument: 'strings', volume: 1, pan: 0.15, attack: 0.08, release: 0.35, brightness: 0.95, vibrato: 12, reverb: 0.35 },
            // ラ・ポンプのギター：短く切って刻む
            pompe: { instrument: 'guitar', mode: 'chords', center: 'D4', voices: 3, strum: 0.008, gate: 0.25, brightness: 0.6, release: 0.05, volume: 1.3, pan: -0.25, reverb: 0.15 },
            bass: { instrument: 'pluck', mode: 'bass', octave: 2, brightness: 0.4, volume: 1.1 }
        },
        sections: {
            // イントロ：ラ・ポンプとベースで回り、E7 で主題へ
            intro: {
                label: 'イントロ',
                chords: 'Am6 | Dm6 | Am6 | E7',
                pompe: POMPE,
                bass: BASS
            },
            A: {
                chords: CHORDS_A,
                lead: THEME,
                pompe: POMPE,
                bass: BASS
            },
            // A'：弦が主題の空きに合いの手を入れる
            A2: {
                label: "A'",
                chords: CHORDS_A,
                lead: THEME,
                fill: FILL,
                pompe: POMPE,
                bass: BASS
            },
            // B：Dm6 から開く。後半は弦が下で長く支える
            B: {
                chords: `${CHORDS_B_HALF} | ${CHORDS_B_HALF}`,
                lead: `${SONG_B_HALF} | ${SONG_B_HALF}`,
                fill: `${repeat('r:16', 8, '|')} | ${LOW_B}`,
                pompe: POMPE,
                bass: BASS
            },
            // 休憩：ピアノを抜き、弦がひとりで歌う。ギターは2・4拍だけ
            C: {
                chords: CHORDS_C,
                solo: SOLO_C,
                pompe: '....x.......x...',
                bass: BASS
            },
            // 最後の A'：合いの手がそろい、E7 で頭の Am6 へ戻る
            A3: {
                label: "A'",
                chords: CHORDS_A,
                lead: THEME,
                fill: FILL,
                pompe: POMPE,
                bass: BASS
            }
        },
        intro: ['intro'],
        loop: ['A', 'A2', 'B', 'C', 'A3']
    };

    SoundKit.register('catalog', { songs: { manouche } });
})();
