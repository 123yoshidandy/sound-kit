/**
 * 曲の一覧：うすあかりの部屋（アンビエント・静かで広がりのある）
 */
(function () {
    const { repeat } = SoundKit;

    // アンビエント：ゆっくり変わるパッドに、長く響くピアノと、まばらなベル・ビブラフォン
    const ambient = {
        title: 'うすあかりの部屋',
        tags: ['落ち着いた'],
        genre: 'アンビエント',
        melody: ['lead'],
        bpm: 70,
        gain: 0.08,
        reverb: { seconds: 4.5, tone: 0.35 },
        delay: { time: 0.75, feedback: 0.42, tone: 1800, reverb: 0.4 },
        humanize: { time: 0.01, velocity: 0.1 },
        parts: {
            lead: { instrument: 'piano', volume: 0.78, pan: -0.1, decay: 1.6, release: 0.8, brightness: 0.7, reverb: 0.35, delay: 0.3 },
            keys: { instrument: 'epiano', mode: 'arp', from: 'D4', volume: 0.75, pan: 0.25, warmth: 0.6, tine: 0.3, release: 0.6, reverb: 0.35, delay: 0.2, autopan: { rate: 0.1, depth: 0.3 } },
            bell: { instrument: 'bell', volume: 0.45, pan: 0.35, decay: 3, reverb: 0.4, delay: 0.3 },
            vibes: { instrument: 'vibes', volume: 0.6, pan: -0.25, tremolo: 3, reverb: 0.4, delay: 0.25 },
            pad: { instrument: 'pad', mode: 'chords', center: 'D4', voices: 4, volume: 0.26, cutoff: 800, attack: 1.6, release: 2.5, reverb: 0.5, chorus: { depth: 0.003, rate: 0.3, mix: 0.5 } },
            bass: { instrument: 'synthBass', mode: 'bass', octave: 2, wave: 'triangle', cutoff: 220, envelope: 0.3, decay: 2, sustain: 0.8, release: 0.8, volume: 0.36, gate: 0.97 },
            drums: { instrument: 'drums', kit: 'soft', mode: 'drums', volume: 0.7, cutoff: 5000, levels: { kick: 0.5, shaker: 0.5 } }
        },
        sections: {
            intro: {
                label: 'イントロ',
                chords: 'Dmaj9 | Gmaj9 | Em9 | A7sus4',
                pad: 'hold',
                bell: 'r:16 | r:8 F#6:8 | r:16 | r:8 E6:8',
                bass: { pattern: 'r:16 | r:16 | R:16 | R:16' }
            },
            A: {
                chords: 'Dmaj9 | Gmaj9 | Bm9 | Gmaj9 | Dmaj9 | Gmaj9 | Em9 | A7sus4',
                lead: `r:2 A4:2 E5:4 F#5:8 | A5:6 F#5:2 D5:8 | r:2 B4:2 C#5:4 F#5:8 | B4:12 r:4 |
                       r:2 A4:2 E5:4 A5:8 | B5:6 A5:2 F#5:8 | E5:6 F#5:2 B5:4 A5:4 | D5:8 r:4 E5:4`,
                pad: 'hold',
                bass: 'R:16'
            },
            // 2回目：エレピの分散和音と、ベルの合いの手、ごく薄いシェイカーを足す。終わりは F#m7 で B へ
            A2: {
                label: "A'",
                chords: 'Dmaj9 | Gmaj9 | Bm9 | Gmaj9 | Dmaj9 | Gmaj9 | Em9 | F#m7',
                lead: `r:2 A4:2 E5:4 F#5:8 | A5:6 F#5:2 D5:8 | r:2 B4:2 C#5:4 F#5:8 | B5:8 A5:4 D5:4 |
                       r:2 F#5:2 A5:4 C#6:8 | B5:6 A5:2 D6:8 | B5:6 A5:2 E5:4 F#5:4 | E5:4 C#5:4 A4:8`,
                bell: 'r:16 | r:8 E6:8 | r:16 | r:8 F#6:8 | r:16 | r:8 A6:8 | r:16 | r:16',
                keys: '0:4 1 2 3',
                pad: 'hold',
                bass: 'R:16',
                drums: { shaker: repeat('o.......o.......', 8, '|') }
            },
            // 少し高い所で歌う。分散和音を8分にして、ほんの少し動きを出す
            B: {
                chords: 'Bm9 | F#m7 | Gmaj9 | Dmaj9 | Bm9 | F#m7 | Em9 | A7sus4',
                lead: `r:2 F#5:2 A5:4 C#6:8 | C#6:6 A5:2 E5:8 | r:2 D5:2 A5:4 B5:8 | A5:6 F#5:2 E5:8 |
                       r:2 B4:2 F#5:4 A5:8 | C#6:6 B5:2 A5:8 | E5:4 F#5:4 B5:8 | A5:8 G5:4 E5:4`,
                bell: 'r:16 | r:12 E6:4 | r:16 | r:12 A6:4 | r:16 | r:12 E6:4 | r:16 | r:16',
                keys: '0:2 1 2 3 4 3 2 1',
                pad: 'hold',
                bass: 'R:12 5:4',
                drums: {
                    kick: repeat('x...............', 8, '|'),
                    shaker: repeat('o...o...o...o...', 8, '|')
                }
            },
            // 休憩：ピアノとドラムを抜き、ビブラフォンがまばらに答える。最後は A7sus4 で頭の Dmaj9 へ
            C: {
                chords: 'Gmaj9 | Dmaj9 | Gmaj9 | Dmaj9 | Em9 | Bm9 | Gmaj9 | A7sus4',
                vibes: `r:4 B5:4 A5:8 | r:4 F#5:4 E5:8 | r:4 D6:4 B5:8 | r:4 A5:4 F#5:8 |
                        r:4 E5:4 B5:8 | r:4 F#5:4 B4:8 | r:4 B5:4 A5:8 | r:8 E5:4 A4:4`,
                keys: '0:8 2',
                pad: 'hold',
                bass: 'R:16'
            }
        },
        intro: ['intro'],
        loop: ['A', 'A2', 'B', 'C']
    };

    SoundKit.register('catalog', { songs: { ambient } });
})();
