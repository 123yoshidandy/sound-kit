/**
 * 曲の一覧：水底の神殿（海の底の神殿・ロ短調で、ゆっくり）
 * ビブラフォンの揺れる分散和音とパッドで水の中を漂い、長いリバーブとエコーで深さを出す
 * A' はベルが泡のように答え、B は長調の方へ光が差して合唱が入る。休憩の C は口笛のようなフルートが低く歌う
 */
(function () {
    const { repeat } = SoundKit;

    // A の主題（前半6小節は A' でも同じ）。長い音で、ゆっくり漂う
    const THEME_HEAD = `F#5:6 E5:2 D5:4 B4:4 | D5:4 F#5:4 B5:8 | A5:6 G5:2 E5:8 | E5:4 A5:4 C#6:8 |
                        D6:6 C#6:2 B5:8 | A5:4 F#5:4 D5:8`;
    // A の終わり：F# で止めて、A' の Bm へ戻る
    const THEME = `${THEME_HEAD} | E5:4 G5:4 F#5:4 B5:4 | A#5:12 r:4`;
    // A' の終わり：Bm に落ち着いて、B の Gmaj7 へ
    const THEME_TURN = `${THEME_HEAD} | E5:4 G5:4 A#5:4 C#6:4 | B5:12 r:4`;

    const CHORDS_A = 'Bm | Gmaj7 | Em7 | F#m7 | Bm | Gmaj7 | Em7:8 F#sus4:8 | F#';
    const CHORDS_A2 = 'Bm | Gmaj7 | Em7 | F#m7 | Bm | Gmaj7 | Em7:8 F#7:8 | Bm';

    // A' のベル：主題が伸ばしている所で、泡のように高く鳴る
    const BUBBLES = 'r:16 | r:8 F#6:4 D6:4 | r:16 | r:8 C#6:4 E6:4 | r:16 | r:8 D6:4 F#6:4 | r:16 | r:8 C#6:4 F#6:4';

    // ビブラフォン：ゆっくり上がって下りる分散和音
    const ARP = '0:2 1 2 3 4 3 2 1';
    const BASS = 'R:8 5:8';
    const DEEP = { kick: repeat('x...............', 8, '|'), shaker: repeat('........o.......', 8, '|') };

    // 水の神殿：揺れるビブラフォンと、深いリバーブ
    const temple = {
        title: '水底の神殿',
        tags: ['神秘的', '落ち着いた'],
        genre: 'ゲーム音楽',
        melody: ['lead'],
        bpm: 76,
        gain: 0.076,
        reverb: { seconds: 3.5, tone: 0.4 },
        delay: { time: 0.75, feedback: 0.35, tone: 1800, reverb: 0.35 },
        humanize: { time: 0.008, velocity: 0.08 },
        parts: {
            lead: { instrument: 'piano', volume: 0.76, pan: -0.08, decay: 1.2, brightness: 0.75, reverb: 0.35, delay: 0.18 },
            bell: { instrument: 'bell', volume: 0.4, pan: 0.4, reverb: 0.5, delay: 0.3 },
            // 口笛のようなフルート：息の音を消して澄ませる
            flute: { instrument: 'flute', volume: 0.5, pan: 0.2, breath: 0, vibrato: 8, attack: 0.15, release: 0.4, reverb: 0.45, delay: 0.25 },
            vibes: { instrument: 'vibes', mode: 'arp', from: 'F#3', volume: 0.44, pan: 0.25, tremolo: 3.5, reverb: 0.4, delay: 0.15 },
            pad: { instrument: 'pad', mode: 'chords', center: 'D4', voices: 3, volume: 0.45, pan: -0.2, cutoff: 900, attack: 1.2, release: 1.8, reverb: 0.5 },
            choir: { instrument: 'choir', mode: 'chords', center: 'E4', voices: 3, volume: 0.3, pan: 0.1, attack: 0.6, release: 1, reverb: 0.55 },
            bass: { instrument: 'synthBass', mode: 'bass', octave: 2, wave: 'triangle', cutoff: 240, envelope: 0.3, decay: 1.5, sustain: 0.6, release: 0.6, volume: 0.5, gate: 0.9 },
            drums: { instrument: 'drums', kit: 'soft', mode: 'drums', volume: 0.5, cutoff: 6000, levels: { kick: 0.45, shaker: 0.35, tomLow: 0.5 } }
        },
        sections: {
            // イントロ：パッドとビブラフォンだけで沈んでいき、F# で主題へ
            intro: {
                label: 'イントロ',
                chords: 'Bm | Gmaj7 | Em7 | F#sus4:8 F#:8',
                vibes: ARP,
                pad: 'hold',
                bass: { pattern: `r:16 | r:16 | ${BASS} | ${BASS}` }
            },
            A: {
                chords: CHORDS_A,
                lead: THEME,
                vibes: ARP,
                pad: 'hold',
                bass: BASS
            },
            // A'：ベルが泡のように答え、底の太鼓が遠くで鳴る。Bm に落ち着く
            A2: {
                label: "A'",
                chords: CHORDS_A2,
                lead: THEME_TURN,
                bell: BUBBLES,
                vibes: ARP,
                pad: 'hold',
                bass: BASS,
                drums: DEEP
            },
            // B：Gmaj7 から長調の方へ光が差す。合唱を足し、F# で休憩へ
            B: {
                chords: 'Gmaj7 | A | F#m7 | Bm | Gmaj7 | A | Em7 | F#sus4:8 F#:8',
                lead: `D6:6 B5:2 F#5:8 | E5:4 A5:4 C#6:8 | C#6:6 A5:2 E5:8 | F#5:4 B5:4 D6:8 |
                       D6:6 B5:2 A5:8 | C#6:4 A5:4 E5:8 | G5:4 B5:4 D6:8 | B5:8 A#5:8`,
                vibes: ARP,
                choir: 'hold',
                bass: BASS,
                drums: { ...DEEP, tomLow: repeat('................', 7, '|') + '|x.......x...x...' }
            },
            // 休憩：ピアノと太鼓を抜き、フルートが低く歌う。ビブラフォンは4分にゆるめる
            C: {
                chords: 'Bm | Gmaj7 | Bm | Gmaj7 | Em7 | Gmaj7 | Em7 | F#sus4:8 F#:8',
                flute: `D5:16 | B4:8 D5:8 | F#5:16 | F#5:8 D5:8 |
                        E5:8 G5:8 | B5:16 | A5:8 G5:8 | C#5:8 A#4:8`,
                vibes: '0:4 2 1 3',
                pad: 'hold',
                bass: 'R:16'
            }
        },
        intro: ['intro'],
        loop: ['A', 'A2', 'B', 'C']
    };

    SoundKit.register('catalog', { songs: { temple } });
})();
