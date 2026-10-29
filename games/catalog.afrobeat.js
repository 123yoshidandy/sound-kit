/**
 * 曲の一覧：陽ざしの市場グルーヴ（アフロビート・イ短調のドリアで、ゆったり長く揺れる）
 * Am7 と D9 を行き来するだけの長いグルーヴに、ギターが16分の裏で短く刻み、ブラスが合いの手を吹く
 * 打楽器は A のキック・リム・シェイカーから始め、A' でコンガのつもりのタムを足し、B でシェイカーを16分に細かくする
 * 休憩の C はピアノとスネアを抜き、フルートがひとりで歌う。最後の B' はブラスが主旋律に重なり、E7 で頭へ戻る
 */
(function () {
    const { repeat } = SoundKit;

    // A の主題：Am7 と D9 の上で、短く切って跳ねる。D9 から頭の Am7 へ
    const THEME = `r:2 E5:2 G5:2 A5:6 G5:2 E5:2 | F#5:4 E5:2 D5:2 r:4 A4:4 |
                   r:2 C5:2 E5:2 G5:6 A5:2 C6:2 | A5:6 F#5:2 E5:8 |
                   r:2 E5:2 G5:2 A5:4 C6:2 B5:2 A5:2 | C6:6 A5:2 F#5:8 |
                   G5:4 E5:2 G5:2 A5:4 C6:4 | B5:6 A5:2 F#5:4 E5:4`;
    const CHORDS_A = 'Am7 | D9 | Am7 | D9 | Am7 | D9 | Am7 | D9';

    // B：Fmaj7 と G で開き、E7 で次へ
    const CHORDS_B = 'Fmaj7 | G | Am7 | Am7 | Fmaj7 | G | Em7 | E7';
    const SONG_B = `C5:2 F5:2 A5:4 G5:2 E5:2 C5:4 | D5:2 G5:2 B5:4 A5:2 G5:2 D5:4 |
                    E5:2 A5:2 C6:8 B5:2 A5:2 | G5:6 E5:2 A5:8 |
                    C6:6 A5:2 G5:4 E5:4 | D6:6 B5:2 G5:4 A5:4 |
                    B5:4 G5:4 E5:4 D5:4 | E5:4 G#5:4 B5:4 D6:4`;

    // 休憩：フルートが長く歌う。E7 で最後の A へ
    const CHORDS_C = 'Am7 | D9 | Am7 | D9 | Fmaj7 | G | Em7 | E7';
    const FLUTE_C = `E5:8 G5:8 | F#5:8 A5:8 | C6:8 A5:8 | E5:16 |
                     A5:8 C6:8 | B5:8 D6:8 | G5:8 E5:8 | G#5:8 B5:8`;

    // ギターは16分の裏で短く刻み、ブラスは偶数小節の終わりに吹く
    const CHOP = '..x...x...x.x..x';
    const STABS = repeat('................|..........x.x---', 4, '|');
    const BASS = 'R:3 R:1 r:2 5:2 r:2 R+:2 5:2 R:2';

    const KICK = repeat('x......x..x.....', 8, '|');
    const RIM = repeat('....x.......x...', 8, '|');
    const SHAKER8 = repeat('x.o.x.o.x.o.x.o.', 8, '|');
    // コンガのつもりの高いタムと中くらいのタム
    const CONGA_HIGH = repeat('..x..x....x..x..', 8, '|');
    const CONGA_MID = repeat('......x.......x.', 8, '|');
    const DRUMS_A = { kick: KICK, rim: RIM, shaker: SHAKER8 };
    const DRUMS_A2 = { kick: KICK, rim: RIM, shaker: SHAKER8, tomHigh: CONGA_HIGH, tomMid: CONGA_MID };
    // B：スネアとシェイカーの16分で、にぎやかに
    const DRUMS_B = {
        kick: KICK,
        snare: repeat('....x.......x...', 7, '|') + '|....x.......x.xx',
        shaker: repeat('x.oxx.oxx.oxx.ox', 8, '|'),
        tomHigh: CONGA_HIGH,
        tomMid: CONGA_MID,
        openHat: repeat('..............x.', 8, '|')
    };

    // アフロビート：長いグルーヴ、ギターの刻み、ブラスの合いの手
    const afrobeat = {
        title: '陽ざしの市場グルーヴ',
        tags: ['軽快'],
        genre: 'ファンク・ソウル',
        melody: ['lead'],
        bpm: 108,
        swing: 0.08,
        swingUnit: 1,
        gain: 0.1,
        reverb: { seconds: 1.6, tone: 0.5 },
        delay: { time: 0.75, feedback: 0.22, tone: 2200, reverb: 0.2 },
        humanize: { time: 0.006, velocity: 0.12 },
        parts: {
            lead: { instrument: 'piano', volume: 0.55, pan: -0.08, decay: 0.75, brightness: 0.85, reverb: 0.18, delay: 0.08 },
            // 休憩の C で歌うフルート
            flute: { instrument: 'flute', volume: 0.45, pan: 0.2, breath: 0.06, vibrato: 10, reverb: 0.3, delay: 0.2 },
            // 最後の B' で主旋律に重なるブラス
            horns: { instrument: 'brass', volume: 0.35, pan: 0.25, brightness: 3, cutoff: 2600, release: 0.1, reverb: 0.2 },
            chop: { instrument: 'guitar', mode: 'chords', center: 'G4', voices: 2, brightness: 0.6, gate: 0.3, release: 0.05, volume: 0.62, pan: -0.3, reverb: 0.12 },
            stabs: { instrument: 'brass', mode: 'chords', center: 'G4', voices: 3, gate: 0.6, volume: 0.7, pan: 0.25, brightness: 3.5, release: 0.08, reverb: 0.2 },
            organ: { instrument: 'organ', mode: 'chords', center: 'D4', voices: 3, vibrato: 5, volume: 0.45, cutoff: 2200, pan: 0.15, reverb: 0.3 },
            bass: { instrument: 'synthBass', mode: 'bass', octave: 2, cutoff: 380, envelope: 2, decay: 0.25, sustain: 0.45, release: 0.05, volume: 0.45, gate: 0.7 },
            drums: { instrument: 'drums', kit: 'soft', mode: 'drums', volume: 0.8, cutoff: 7500, levels: { kick: 0.6, rim: 0.45, snare: 0.45, shaker: 0.35, tomHigh: 0.4, tomMid: 0.4, openHat: 0.3 } }
        },
        sections: {
            // イントロ：打楽器とベースから、ギターが刻み始める。D9 で主題へ
            intro: {
                label: 'イントロ',
                chords: 'Am7 | D9 | Am7 | D9',
                chop: `................|................|${CHOP}|${CHOP}`,
                bass: { pattern: `r:16 | ${BASS} | ${BASS} | ${BASS}` },
                drums: {
                    shaker: repeat('x.o.x.o.x.o.x.o.', 4, '|'),
                    tomHigh: repeat('..x..x....x..x..', 4, '|'),
                    kick: '................|' + repeat('x......x..x.....', 3, '|'),
                    rim: '................|................|....x.......x...|....x.......x.xx'
                }
            },
            A: {
                chords: CHORDS_A,
                lead: THEME,
                chop: CHOP,
                bass: BASS,
                drums: DRUMS_A
            },
            // A'：ブラスが合いの手を吹き、コンガが入る
            A2: {
                label: "A'",
                chords: CHORDS_A,
                lead: THEME,
                chop: CHOP,
                stabs: STABS,
                bass: BASS,
                drums: DRUMS_A2
            },
            // B：Fmaj7 と G で開く。オルガンを伸ばし、シェイカーを16分に
            B: {
                chords: CHORDS_B,
                lead: SONG_B,
                chop: CHOP,
                organ: 'hold',
                bass: BASS,
                drums: DRUMS_B
            },
            // 休憩：ピアノとスネアを抜き、フルートが歌う。ギターは拍の頭だけ
            C: {
                chords: CHORDS_C,
                flute: FLUTE_C,
                chop: 'x.......x.......',
                organ: 'hold',
                bass: 'R:6 R:2 r:4 5:4',
                drums: { kick: repeat('x.........x.....', 8, '|'), shaker: SHAKER8, tomMid: CONGA_MID }
            },
            // A：ブラスとコンガ
            A3: {
                label: 'A',
                chords: CHORDS_A,
                lead: THEME,
                chop: CHOP,
                stabs: STABS,
                bass: BASS,
                drums: DRUMS_A2
            },
            // 最後の B'：ブラスが主旋律に重なる。E7 で頭の Am7 へ戻る
            B2: {
                label: "B'",
                chords: CHORDS_B,
                lead: SONG_B,
                horns: SONG_B,
                chop: CHOP,
                organ: 'hold',
                bass: BASS,
                drums: DRUMS_B
            }
        },
        intro: ['intro'],
        loop: ['A', 'A2', 'B', 'C', 'A3', 'B2']
    };

    SoundKit.register('catalog', { songs: { afrobeat } });
})();
