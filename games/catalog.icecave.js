/**
 * 曲の一覧：氷の洞窟（凍った洞窟・嬰ヘ短調で、ゆっくり）
 * ビブラフォンがガラスのように澄んだ分散和音をゆっくり鳴らし、パッドを薄く敷く。長いリバーブとエコーで、洞窟の奥行きを出す
 * A' は高いベルがつららのしずくのように短く鳴り、B はニ長調の方へ。弦楽器が和音を伸ばして支える
 * 休憩の C はピアノを抜き、弦楽器がひとりで歌う
 */
(function () {
    const { repeat } = SoundKit;

    // A の主題（前半6小節は A' でも同じ）。長い音で、冷たい空気の中を進む
    const THEME_HEAD = `C#6:6 B5:2 A5:8 | A5:4 F#5:4 E5:8 | D6:6 C#6:2 B5:8 | F#5:4 G#5:4 C#6:8 |
                        A5:6 G#5:2 F#5:8 | A5:4 C#6:4 F#5:8`;
    // A の終わり：C# で止めて、A' の F#m へ戻る
    const THEME = `${THEME_HEAD} | B5:4 D6:4 C#6:4 G#5:4 | G#5:12 r:4`;
    // A' の終わり：F#m に落ち着いて、B の Dmaj7 へ
    const THEME_TURN = `${THEME_HEAD} | B5:4 D6:4 B5:4 G#5:4 | F#5:12 r:4`;
    const CHORDS_A = 'F#m | Dmaj7 | Bm7 | C#sus4:8 C#:8 | F#m | Dmaj7 | Bm7:8 C#sus4:8 | C#';
    const CHORDS_A2 = 'F#m | Dmaj7 | Bm7 | C#sus4:8 C#:8 | F#m | Dmaj7 | Bm7:8 C#7:8 | F#m';

    // A' のベル：主題が伸ばしている所で、つららのしずくのように短く鳴る
    const ICICLES = 'r:8 C#6:2 F#6:2 r:4 | r:16 | r:8 D6:2 F#6:2 r:4 | r:16 | r:8 C#6:2 E6:2 r:4 | r:16 | r:16 | r:8 C#6:2 G#5:2 r:4';

    // B：ニ長調の方へ。弦楽器が支える。C# で休憩へ
    const CHORDS_B = 'Dmaj7 | E | C#m7 | F#m | Dmaj7 | E | Bm7 | C#sus4:8 C#:8';
    const SONG_B = `F#5:4 A5:4 C#6:8 | B5:6 G#5:2 E5:8 | E5:4 G#5:4 B5:8 | C#6:6 B5:2 A5:8 |
                    A5:6 F#5:2 E5:8 | G#5:4 B5:4 D6:8 | D6:6 C#6:2 B5:8 | F#5:8 G#5:8`;

    // 休憩の弦楽器：ひとりで歌う
    const SOLO_C = `A5:16 | F#5:8 A5:8 | C#6:12 B5:4 | A5:16 |
                    F#5:8 B5:8 | G#5:16 | D6:8 B5:8 | F#5:8 G#5:8`;

    // ビブラフォン：ガラスのように、ゆっくり上がって下りる分散和音
    const GLASS = '0:2 1 2 3 4 3 2 1';
    const BASS = 'R:8 5:8';
    const CRACKLE = repeat('o.......o.......', 8, '|');

    // 氷の洞窟：ガラスのビブラフォンと、つららのベル
    const icecave = {
        title: '氷の洞窟',
        tags: ['神秘的'],
        genre: 'アンビエント',
        melody: ['lead'],
        bpm: 72,
        gain: 0.085,
        reverb: { seconds: 4, tone: 0.4 },
        delay: { time: 0.75, feedback: 0.35, tone: 1800, reverb: 0.35 },
        humanize: { time: 0.008, velocity: 0.08 },
        parts: {
            lead: { instrument: 'piano', volume: 0.71, pan: -0.08, decay: 1.2, brightness: 0.75, reverb: 0.35, delay: 0.18 },
            bell: { instrument: 'bell', volume: 0.36, pan: 0.4, decay: 1.6, reverb: 0.5, delay: 0.3 },
            // 休憩で歌う弦楽器
            solo: { instrument: 'strings', volume: 0.9, pan: 0.2, attack: 0.15, release: 0.5, brightness: 0.9, vibrato: 8, reverb: 0.45, delay: 0.15 },
            glass: { instrument: 'vibes', mode: 'arp', from: 'F#3', volume: 0.35, pan: 0.25, tremolo: 3, reverb: 0.4, delay: 0.15 },
            strings: { instrument: 'strings', mode: 'chords', center: 'D4', voices: 3, volume: 0.35, pan: -0.2, attack: 0.5, release: 0.8, brightness: 0.7, vibrato: 6, reverb: 0.5 },
            pad: { instrument: 'pad', mode: 'chords', center: 'A3', voices: 3, volume: 0.45, pan: -0.2, cutoff: 900, attack: 1.2, release: 1.8, reverb: 0.5 },
            bass: { instrument: 'synthBass', mode: 'bass', octave: 2, wave: 'triangle', cutoff: 240, envelope: 0.3, decay: 1.5, sustain: 0.6, release: 0.6, volume: 0.5, gate: 0.9 },
            drums: { instrument: 'drums', kit: 'soft', mode: 'drums', volume: 0.5, cutoff: 6000, levels: { shaker: 0.3, tomLow: 0.45 } }
        },
        sections: {
            // イントロ：ビブラフォンとパッドだけで洞窟に入り、しずくが落ちる。C# で主題へ
            intro: {
                label: 'イントロ',
                chords: 'F#m | Dmaj7 | Bm7 | C#sus4:8 C#:8',
                glass: GLASS,
                pad: 'hold',
                bell: 'r:16 | r:8 C#6:2 F#6:2 r:4 | r:16 | r:8 C#6:2 G#5:2 r:4',
                bass: { pattern: `r:16 | r:16 | ${BASS} | ${BASS}` }
            },
            A: {
                chords: CHORDS_A,
                lead: THEME,
                glass: GLASS,
                pad: 'hold',
                bass: BASS
            },
            // A'：つららのベルが鳴り、氷のきしむ音（シェイカー）。F#m に落ち着く
            A2: {
                label: "A'",
                chords: CHORDS_A2,
                lead: THEME_TURN,
                bell: ICICLES,
                glass: GLASS,
                pad: 'hold',
                bass: BASS,
                drums: { shaker: CRACKLE }
            },
            // B：ニ長調の方へ。弦楽器が和音を伸ばして支える。C# で休憩へ
            B: {
                chords: CHORDS_B,
                lead: SONG_B,
                glass: GLASS,
                strings: 'hold',
                bass: BASS,
                drums: { shaker: CRACKLE, tomLow: repeat('................', 7, '|') + '|x.......x...x...' }
            },
            // 休憩：ピアノを抜き、弦楽器がひとりで歌う。ビブラフォンは4分にゆるめる。C# で頭の F#m へ戻る
            C: {
                chords: 'F#m | Dmaj7 | F#m | Dmaj7 | Bm7 | E | Bm7 | C#sus4:8 C#:8',
                solo: SOLO_C,
                glass: '0:4 2 1 3',
                pad: 'hold',
                bass: 'R:16'
            }
        },
        intro: ['intro'],
        loop: ['A', 'A2', 'B', 'C']
    };

    SoundKit.register('catalog', { songs: { icecave } });
})();
