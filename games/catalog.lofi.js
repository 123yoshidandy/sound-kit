/**
 * 曲の一覧：雨音のノート（ローファイ・ヒップホップ。はねたビートで、ゆったり）
 * エレピの 9th の和音（Dm9 G9 Cmaj9）を伸ばし、ドラムの高い音を削って、ほこりっぽく丸い音にする
 * A' はビブラフォンが答え、B は IV の Fmaj7 から。休憩の C は主旋律を抜いて、ビブラフォンが歌う
 */
(function () {
    const { repeat } = SoundKit;

    // A の主題。拍の頭を休んで、遅れて入る
    const THEME = `r:4 A5:2 C6:2 E6:4 D6:4 | B5:6 A5:2 F5:8 | r:4 G5:2 B5:2 D6:4 B5:4 | C6:6 A5:2 E5:8 |
                   r:4 A5:2 C6:2 D6:4 A5:4 | D6:6 B5:2 A5:8 | G5:4 B5:4 E6:8 | E6:6 D6:2 C6:4 G5:4`;
    const CHORDS_A = 'Dm9 | G9 | Cmaj9 | Am7 | Dm9 | G9 | Cmaj9 | Am7';

    // A' のビブラフォン：主題が伸ばしている所に答える
    const COUNTER = 'r:16 | r:8 D6:4 B5:4 | r:16 | r:8 G5:4 E5:4 | r:16 | r:8 F5:4 A5:4 | r:16 | r:8 C6:4 A5:4';

    const KEYS = 'x-------x-------';
    const BASS = 'R:6 R:2 r:4 5:4';
    // はねたビート：キックは少し遅れて、スネアは2拍目と4拍目
    const BEAT = {
        kick: repeat('x.......x.x.....', 8, '|'),
        snare: repeat('....x.......x...', 8, '|'),
        hat: repeat('x.x.x.x.x.x.x.x.', 8, '|')
    };

    // ローファイ：エレピの 9th と、丸いドラム
    const lofi = {
        title: '雨音のノート',
        tags: ['おしゃれ', '落ち着いた'],
        genre: 'エレクトロ',
        melody: ['lead'],
        bpm: 80,
        swing: 0.18,
        swingUnit: 2,
        gain: 0.095,
        reverb: { seconds: 1.8, tone: 0.35 },
        delay: { time: 0.75, feedback: 0.3, tone: 1800, reverb: 0.25 },
        humanize: { time: 0.012, velocity: 0.12 },
        parts: {
            lead: { instrument: 'piano', volume: 0.75, pan: -0.1, decay: 0.9, brightness: 0.6, reverb: 0.25, delay: 0.15 },
            vibes: { instrument: 'vibes', volume: 0.55, pan: 0.3, tremolo: 3, reverb: 0.35, delay: 0.25 },
            keys: { instrument: 'epiano', mode: 'chords', center: 'E4', voices: 4, volume: 0.32, pan: 0.15, warmth: 0.7, release: 0.4, chorus: { depth: 0.003, rate: 0.4, mix: 0.5 }, reverb: 0.25 },
            bass: { instrument: 'synthBass', mode: 'bass', octave: 2, wave: 'triangle', cutoff: 260, envelope: 0.5, decay: 0.8, sustain: 0.6, release: 0.2, volume: 0.5, gate: 0.85 },
            // ドラム：高い音を削って、丸くする
            drums: { instrument: 'drums', kit: 'soft', mode: 'drums', volume: 0.63, cutoff: 3500, levels: { kick: 0.85, snare: 0.55, hat: 0.4, rim: 0.5 } }
        },
        sections: {
            // イントロ：エレピだけで始め、3小節目からビートが入る
            intro: {
                label: 'イントロ',
                chords: 'Dm9 | G9 | Cmaj9 | Am7',
                keys: KEYS,
                bass: { pattern: `r:16 | r:16 | ${BASS} | ${BASS}` },
                drums: {
                    kick: '................|................|x.......x.x.....|x.......x.x.....',
                    snare: '................|................|....x.......x...|....x.......x.x.',
                    hat: '................|................|' + repeat('x.x.x.x.x.x.x.x.', 2, '|')
                }
            },
            A: {
                chords: CHORDS_A,
                lead: THEME,
                keys: KEYS,
                bass: BASS,
                drums: BEAT
            },
            // A'：ビブラフォンが答える
            A2: {
                label: "A'",
                chords: CHORDS_A,
                lead: THEME,
                vibes: COUNTER,
                keys: KEYS,
                bass: BASS,
                drums: BEAT
            },
            // B：IV の Fmaj7 から。E7 で戻る
            B: {
                chords: 'Fmaj7 | Em7 | Dm9 | G9 | Fmaj7 | Em7 | Dm7 | E7',
                lead: `A5:6 G5:2 E5:8 | G5:6 E5:2 B4:8 | F5:4 A5:4 C6:8 | B5:6 A5:2 F5:8 |
                       C6:6 G5:2 A5:8 | B5:6 G5:2 E5:8 | A5:4 F5:4 D5:8 | G#5:8 B5:4 D6:4`,
                keys: KEYS,
                bass: BASS,
                drums: { ...BEAT, rim: repeat('..........x.....', 8, '|') }
            },
            // 休憩：主旋律とスネアを抜き、ビブラフォンが歌う。G9 で頭へ戻る
            C: {
                chords: 'Dm9 | G9 | Cmaj9 | Am7 | Fmaj7 | Em7 | Dm9 | G9',
                vibes: 'A5:8 C6:8 | B5:12 r:4 | G5:8 E5:8 | A5:12 r:4 | A5:8 C6:8 | G5:12 r:4 | F5:8 A5:8 | B5:8 D6:8',
                keys: KEYS,
                bass: 'R:16',
                drums: { kick: repeat('x.......x.......', 8, '|'), hat: repeat('x...x...x...x...', 8, '|') }
            }
        },
        intro: ['intro'],
        loop: ['A', 'A2', 'B', 'C']
    };

    SoundKit.register('catalog', { songs: { lofi } });
})();
