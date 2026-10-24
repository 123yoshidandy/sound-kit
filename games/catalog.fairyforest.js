/**
 * 曲の一覧：妖精の森（神秘的な森・ト長調で、ゆっくり漂う）
 * ハープのつもりのギターが16分で上がって下りる分散和音に、パッドを薄く敷く。A/G（リディアの響き）で、少し浮いた不思議さを出す
 * A' はベルが光の粒のように答え、B はハ長調の方へ。フルートが低く支え、ビブラフォンが和音を鳴らす
 * 休憩の C はピアノを抜き、フルートがひとりで歌う。分散和音は8分にゆるめる
 */
(function () {
    const { repeat } = SoundKit;

    // A の主題（前半7小節は A' でも同じ）。長い音で、木もれ日のように
    const THEME_HEAD = `B5:6 A5:2 F#5:8 | E5:4 A5:4 C#6:8 | B5:6 G5:2 E5:8 | F#5:4 G5:4 B5:8 |
                        D6:6 B5:2 F#5:8 | E5:4 C#6:4 B5:8 | C6:4 A5:4 E5:4 G5:4`;
    // A の終わり：D で止めて、A' の Gmaj7 へ戻る
    const THEME = `${THEME_HEAD} | F#5:12 A5:4`;
    // A' の終わり：G に落ち着いて、B の Cmaj7 へ
    const THEME_TURN = `${THEME_HEAD.replace(/C6:4 A5:4 E5:4 G5:4$/, 'C6:4 A5:4 A5:4 F#5:4')} | G5:12 r:4`;
    const CHORDS_A = 'Gmaj7 | A/G | Em7 | Cmaj7 | Gmaj7 | A/G | Am7 | D';
    const CHORDS_A2 = 'Gmaj7 | A/G | Em7 | Cmaj7 | Gmaj7 | A/G | Am7:8 D:8 | G';

    // A' のベル：主題が伸ばしている所で、光の粒のように鳴る
    const SPARKLE = 'r:8 D6:4 F#6:4 | r:16 | r:8 D6:4 E6:4 | r:16 | r:8 B5:4 D6:4 | r:8 E6:4 C#6:4 | r:16 | r:16';

    // B：ハ長調の方へ。フルートが低く支える。D で休憩へ
    const CHORDS_B = 'Cmaj7 | D | Bm7 | Em7 | Cmaj7 | D/C | Bm7 | Am7:8 D:8';
    const SONG_B = `E5:4 G5:4 B5:8 | F#5:4 A5:4 D6:8 | D6:6 C#6:2 B5:8 | A5:4 G5:4 E5:8 |
                    E5:4 G5:4 B5:4 D6:4 | A5:8 F#5:8 | D6:6 B5:2 F#5:8 | E5:4 C6:4 A5:4 F#5:4`;
    const FLUTE_B = 'G4:16 | A4:16 | F#4:16 | G4:16 | E4:16 | A4:16 | F#4:16 | E4:8 F#4:8';

    // 休憩のフルート：ひとりで歌う
    const FLUTE_C = `B5:8 A5:8 | G5:16 | F#5:8 D5:8 | E5:16 |
                     G5:8 B5:8 | C#6:8 A5:8 | C6:8 E5:8 | F#5:8 A5:8`;

    // ハープ：16分で上がって下りる分散和音
    const HARP = '0:1 1 2 3 4 3 2 1';
    const BASS = 'R:8 5:8';
    const SHAKER = repeat('o...o...o...o...', 8, '|');

    // 妖精の森：ハープの分散和音と、光の粒
    const fairyforest = {
        title: '妖精の森',
        tags: ['神秘的', '落ち着いた'],
        genre: 'ゲーム音楽',
        melody: ['lead'],
        bpm: 84,
        gain: 0.084,
        reverb: { seconds: 3, tone: 0.45 },
        delay: { time: 0.75, feedback: 0.3, tone: 2000, reverb: 0.3 },
        humanize: { time: 0.006, velocity: 0.08 },
        parts: {
            lead: { instrument: 'piano', volume: 0.69, pan: -0.08, decay: 1.1, brightness: 0.8, reverb: 0.3, delay: 0.15 },
            bell: { instrument: 'bell', volume: 0.38, pan: 0.4, reverb: 0.5, delay: 0.3 },
            flute: { instrument: 'flute', volume: 0.42, pan: 0.2, breath: 0.03, vibrato: 10, attack: 0.1, release: 0.3, reverb: 0.4, delay: 0.2 },
            // ハープのつもり：やわらかいギターを長めに響かせる
            harp: { instrument: 'guitar', mode: 'arp', from: 'G3', brightness: 0.6, sustain: 0.997, release: 0.4, volume: 0.55, pan: 0.25, reverb: 0.35, delay: 0.1 },
            vibes: { instrument: 'vibes', mode: 'chords', center: 'B4', voices: 3, volume: 0.32, pan: -0.3, tremolo: 3.5, reverb: 0.4 },
            pad: { instrument: 'pad', mode: 'chords', center: 'D4', voices: 3, volume: 0.45, pan: -0.2, cutoff: 900, attack: 1.2, release: 1.8, reverb: 0.5 },
            bass: { instrument: 'synthBass', mode: 'bass', octave: 2, wave: 'triangle', cutoff: 240, envelope: 0.3, decay: 1.5, sustain: 0.6, release: 0.6, volume: 0.5, gate: 0.9 },
            drums: { instrument: 'drums', kit: 'soft', mode: 'drums', volume: 0.5, cutoff: 6000, levels: { shaker: 0.3, tomLow: 0.45 } }
        },
        sections: {
            // イントロ：ハープとパッドだけで森に入り、D で主題へ
            intro: {
                label: 'イントロ',
                chords: 'Gmaj7 | A/G | Cmaj7 | D',
                harp: HARP,
                pad: 'hold',
                bell: 'r:16 | r:8 E6:4 C#6:4 | r:16 | r:8 D6:4 F#6:4',
                bass: { pattern: `r:16 | r:16 | ${BASS} | ${BASS}` }
            },
            A: {
                chords: CHORDS_A,
                lead: THEME,
                harp: HARP,
                pad: 'hold',
                bass: BASS
            },
            // A'：ベルが光の粒のように答え、シェイカーが葉ずれのように鳴る。G に落ち着く
            A2: {
                label: "A'",
                chords: CHORDS_A2,
                lead: THEME_TURN,
                bell: SPARKLE,
                harp: HARP,
                pad: 'hold',
                bass: BASS,
                drums: { shaker: SHAKER }
            },
            // B：ハ長調の方へ。フルートが低く支え、ビブラフォンが和音を鳴らす。D で休憩へ
            B: {
                chords: CHORDS_B,
                lead: SONG_B,
                flute: FLUTE_B,
                harp: HARP,
                vibes: 'x-------x-------',
                bass: BASS,
                drums: { shaker: SHAKER, tomLow: repeat('................', 7, '|') + '|x.......x...x...' }
            },
            // 休憩：ピアノを抜き、フルートがひとりで歌う。ハープは8分にゆるめる。D で頭の Gmaj7 へ戻る
            C: {
                chords: 'Gmaj7 | Cmaj7 | Gmaj7 | Cmaj7 | Em7 | A/G | Am7 | D',
                flute: FLUTE_C,
                harp: '0:2 1 2 3 4 3 2 1',
                pad: 'hold',
                bass: 'R:16'
            }
        },
        intro: ['intro'],
        loop: ['A', 'A2', 'B', 'C']
    };

    SoundKit.register('catalog', { songs: { fairyforest } });
})();
