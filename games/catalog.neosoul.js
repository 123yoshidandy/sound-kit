/**
 * 曲の一覧：ベルベットの夜風（ネオソウル・変ロ長調で、ゆったり跳ねる）
 * エレピが maj9・m9 の和音を、拍より少し遅らせるように置く。Eb/F（F の 11th）と F/G（G の 11th）の宙に浮いた響きで次へ渡す
 * ドラムは16分で軽く跳ね、ベースは小節の頭を長く伸ばして、ゆったりと歩く。A' はビブラフォンが主題の伸ばしに答える
 * B はハ短調から巡り、パッドが薄く敷く。休憩の C はピアノを抜き、柔らかいシンセのリードがひとりで歌う
 */
(function () {
    const { repeat } = SoundKit;

    // A の主題。Eb/F で終えて、頭の Bbmaj9 へ
    const THEME = `r:2 D5:2 F5:2 A5:6 G5:4 | F5:4 r:2 C5:2 D5:8 | r:2 G5:2 Bb5:2 D6:6 C6:4 | Bb5:6 G5:2 F5:8 |
                   r:2 D5:2 F5:2 A5:6 C6:4 | D6:4 C6:2 Bb5:2 G5:8 | r:2 G5:2 Bb5:2 D6:6 C6:4 | Bb5:4 G5:4 F5:4 C5:4`;
    const CHORDS_A = 'Bbmaj9 | Dm7 | Ebmaj9 | Eb/F | Bbmaj9 | Gm9 | Cm9 | Eb/F';

    // A' のビブラフォン：主題が伸ばしている所に答える
    const VIBES_A = 'r:16 | r:10 A5:2 F5:4 | r:16 | r:10 C6:2 Bb5:4 | r:16 | r:12 F5:4 | r:16 | r:16';

    // B：ハ短調から巡る。F/G から Cm9 へ、Eb/F で休憩へ
    const CHORDS_B = 'Cm9 | F9 | Bbmaj9 | F/G | Cm9 | F9 | Dm7:8 Gm9:8 | Eb/F';
    const SONG_B = `G5:6 Bb5:2 C6:8 | A5:4 C6:4 G5:8 | F5:6 D5:2 C5:8 | D5:4 F5:4 A5:8 |
                    G5:6 Bb5:2 D6:8 | C6:6 A5:2 F5:8 | A5:4 F5:4 D6:4 G5:4 | F5:4 G5:4 Bb5:4 C6:4`;

    // 休憩：柔らかいシンセのリードがひとりで歌う。Eb/F で頭の Bbmaj9 へ戻る
    const CHORDS_C = 'Ebmaj9 | Dm7 | Cm9 | Bbmaj9 | Ebmaj9 | Dm7 | Gm9 | Eb/F';
    const SING_C = `G5:8 Bb5:4 F5:4 | F5:8 A5:8 | G5:6 Bb5:2 D6:8 | C6:8 A5:8 |
                    Bb5:8 G5:8 | A5:6 F5:2 D5:8 | D6:8 A5:8 | G5:8 Bb5:8`;

    // エレピは拍より少し遅らせて置き、ベースは小節の頭を伸ばす
    const COMP = '..x-----..x---..';
    const BASS = 'R:6 R:2 r:2 5:4 r:2';
    const KICK = repeat('x......x..x.....', 8, '|');
    const SNARE = repeat('....x.......x...', 8, '|');
    const HAT = repeat('x.xox.x.x.xox.x.', 8, '|');
    const DRUMS = { kick: KICK, snare: SNARE, hat: HAT };
    const DRUMS_FILL = { ...DRUMS, snare: repeat('....x.......x...', 7, '|') + '|....x.......x.o.' };

    // ネオソウル：エレピの 9th・11th と、ゆったり跳ねるビート
    const neosoul = {
        title: 'ベルベットの夜風',
        tags: ['おしゃれ', '落ち着いた'],
        genre: 'ファンク・ソウル',
        melody: ['lead'],
        bpm: 84,
        swing: 0.12,
        swingUnit: 1,
        gain: 0.1,
        reverb: { seconds: 2, tone: 0.45 },
        delay: { time: 0.75, feedback: 0.25, tone: 2000, reverb: 0.25 },
        humanize: { time: 0.008, velocity: 0.12 },
        parts: {
            lead: { instrument: 'piano', volume: 0.6, pan: -0.08, decay: 0.85, brightness: 0.75, reverb: 0.22, delay: 0.08 },
            // 休憩の C で歌う、柔らかいシンセのリード
            sing: { instrument: 'softLead', volume: 0.55, pan: 0.15, cutoff: 1800, vibrato: 8, attack: 0.04, release: 0.25, reverb: 0.3, delay: 0.2 },
            vibes: { instrument: 'vibes', volume: 0.4, pan: 0.3, reverb: 0.35, delay: 0.25 },
            keys: { instrument: 'epiano', mode: 'chords', center: 'D4', voices: 4, volume: 0.34, pan: 0.2, warmth: 0.7, release: 0.4, chorus: { depth: 0.003, rate: 0.4, mix: 0.45 }, reverb: 0.25 },
            pad: { instrument: 'pad', mode: 'chords', center: 'F4', voices: 3, volume: 0.25, cutoff: 1100, pan: -0.2, reverb: 0.4 },
            bass: { instrument: 'synthBass', mode: 'bass', octave: 2, wave: 'triangle', cutoff: 320, envelope: 0.6, decay: 0.5, sustain: 0.55, release: 0.12, volume: 0.45, gate: 0.85 },
            drums: { instrument: 'drums', kit: 'soft', mode: 'drums', volume: 0.8, cutoff: 7000, levels: { kick: 0.6, snare: 0.45, hat: 0.35 } }
        },
        sections: {
            // イントロ：エレピとハイハットから、ベースとキックが入る。Eb/F で主題へ
            intro: {
                label: 'イントロ',
                chords: 'Bbmaj9 | Gm9 | Ebmaj9 | Eb/F',
                keys: COMP,
                bass: { pattern: `r:16 | r:16 | ${BASS} | ${BASS}` },
                drums: { hat: repeat('x.xox.x.x.xox.x.', 4, '|'), kick: '................|................|x......x..x.....|x......x..x.....' }
            },
            A: {
                chords: CHORDS_A,
                lead: THEME,
                keys: COMP,
                bass: BASS,
                drums: DRUMS
            },
            // A'：ビブラフォンが答える
            A2: {
                label: "A'",
                chords: CHORDS_A,
                lead: THEME,
                vibes: VIBES_A,
                keys: COMP,
                bass: BASS,
                drums: DRUMS_FILL
            },
            // B：ハ短調から巡り、パッドが薄く敷く。Eb/F で休憩へ
            B: {
                chords: CHORDS_B,
                lead: SONG_B,
                keys: COMP,
                pad: 'hold',
                bass: BASS,
                drums: DRUMS_FILL
            },
            // 休憩：ピアノとスネアを抜き、シンセのリードがひとりで歌う。エレピは小節に1つ。Eb/F で頭の Bbmaj9 へ戻る
            C: {
                chords: CHORDS_C,
                sing: SING_C,
                keys: '..x-------------',
                pad: 'hold',
                bass: 'R:12 5:4',
                drums: { kick: repeat('x.........x.....', 8, '|'), hat: HAT }
            }
        },
        intro: ['intro'],
        loop: ['A', 'A2', 'B', 'C']
    };

    SoundKit.register('catalog', { songs: { neosoul } });
})();
