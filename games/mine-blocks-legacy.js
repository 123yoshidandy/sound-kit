/**
 * 今の mine-blocks の BGM と効果音（mine-blocks の js/sound.js を、sound-kit の形にそのまま移したもの）
 * 試聴ページで、新しい音と聞き比べるために使う。ゲームには配らない
 */

(function () {
    const { repeat } = SoundKit;

    // 旧 sound.js の音量：全体 0.8 × BGM 0.14、効果音 0.5
    const BGM_VOLUME = 0.14;
    const EFFECTS_VOLUME = 0.5;

    const legacy = {
        title: '今の BGM',
        description: 'チップチューン・8小節',
        bpm: 144,
        gain: BGM_VOLUME,
        parts: {
            melody: { instrument: 'chip', wave: 'square', envelope: 'decay', level: 0.22, gate: 0.9 },
            bass: { instrument: 'chip', wave: 'triangle', envelope: 'decay', level: 0.5, gate: 0.9 },
            drums: { instrument: 'drums', kit: 'legacy', mode: 'drums' }
        },
        sections: {
            A: {
                bars: 8,
                melody: `E5:2 G5:2 C6:3 B5:1 C6:2 G5:2 E5:4 | A5:2 C6:2 E6:3 D6:1 C6:2 A5:2 E5:4 |
                         F5:2 A5:2 C6:2 A5:2 D6:4 C6:2 A5:2 | B5:2 D6:2 G5:2 B5:2 D6:4 r:4 |
                         E6:2 D6:2 C6:2 G5:2 A5:2 G5:2 E5:4 | C6:2 B5:2 A5:2 E5:2 A5:2 B5:2 C6:4 |
                         A5:2 C6:2 F6:2 E6:2 D6:2 C6:2 A5:2 C6:2 | D6:2 B5:2 G5:2 B5:2 D6:4 G6:4`,
                bass: ['C3', 'A2', 'F2', 'G2', 'C3', 'A2', 'F2', 'G2']
                    .map(root => repeat(`${root}:2 ${root.replace(/\d/, d => Number(d) + 1)}:2`, 4, ' '))
                    .join(' | '),
                drums: {
                    kick: 'X.......X.......',
                    snare: '....X.......X...',
                    hat: 'X.X.X.X.X.X.X.X.'
                }
            }
        },
        loop: ['A']
    };

    const SQUARE = { instrument: 'chip', wave: 'square', envelope: 'decay', level: 1 };
    const TRIANGLE = { instrument: 'chip', wave: 'triangle', envelope: 'decay', level: 1 };

    // 旧 playTone・playNotes の音量 × 効果音の音量 0.5。長さの単位は 0.01 秒
    const layer = (instrument, notes, volume, extra = {}) => ({ instrument, notes, unit: 0.01, volume: volume * EFFECTS_VOLUME, ...extra });

    const effects = {
        select: [layer(SQUARE, '880hz:5', 0.2)],
        place: [layer(SQUARE, '523hz~784hz:7', 0.25), layer(TRIANGLE, '196hz~98hz:9', 0.4)],
        invalid: [layer(SQUARE, '196hz:7 r:1 147hz:10', 0.18)],
        remove: [layer(SQUARE, '784hz~440hz:7', 0.2)],
        clear: [layer(SQUARE, 'C5:8 E5 G5 C6:35', 0.25), layer(TRIANGLE, 'C4:16 G4:40', 0.35)],
        bonus: [layer(SQUARE, 'G5:6 C6 E6:18', 0.22)],
        surrender: [layer(TRIANGLE, 'G4:12 E4 C4:25', 0.4)],
        lose: [layer(SQUARE, 'E5:10 C5 A4:25', 0.2)],
        tick: [layer(SQUARE, '1200hz:2.5', 0.12)],
        timeUp: [layer(SQUARE, 'C5:11 G4 E4 C4:35', 0.22)],
        count: [layer(SQUARE, '660hz:9', 0.22)],
        go: [layer(SQUARE, '1320hz:22', 0.22)],
        victory: [layer(SQUARE, 'C5:9 E5 G5 C6 G5 C6 E6:50', 0.25), layer(TRIANGLE, 'C3:21 G3 C4:60', 0.35)]
    };

    SoundKit.register('mine-blocks-legacy', { songs: { legacy }, effects });
})();
