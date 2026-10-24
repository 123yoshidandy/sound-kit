/**
 * 曲の一覧：川船のパレード（ディキシーランド・変ロ長調で、陽気にはねる）
 * バンジョー（明るいギター）の4分の刻みと、チューバの2拍の低音。主題の伸ばしに、クラリネットが絡む
 * B は Eb へ移ってブラスが合いの手を吹き、休憩の C はトロンボーン（低いブラス）が滑らせて歌う
 */
(function () {
    const { repeat } = SoundKit;

    // A の主題。D7・Ebm6 の回り道で、ディキシーらしく
    const THEME = `D5:4 F5:4 Bb5:6 C6:2 | A5:8 F#5:4 D5:4 | G5:4 Bb5:4 D6:8 | Ab5:6 F5:2 D5:8 |
                   Eb5:4 G5:4 Bb5:8 | C6:6 Bb5:2 Gb5:8 | F5:4 Bb5:4 B5:4 D6:4 | C6:4 G5:4 A5:4 F5:4`;
    const CHORDS_A = 'Bb | D7 | Gm | Bb7 | Eb | Ebm6 | Bb/F:8 G7:8 | Cm7:8 F7:8';

    // A' のクラリネット：主題が伸ばしている所（3〜6小節目の後半）に、下から絡む
    const CLARINET_A = `r:16 | r:16 | r:8 Bb4:2 D5:2 G5:4 | r:8 F5:2 Ab5:2 F5:4 |
                        r:8 G4:2 Bb4:2 Eb5:4 | r:8 C5:2 Eb5:2 Bb4:4 | r:16 | r:16`;
    // B のブラス：偶数の小節で合いの手
    const HORNS = repeat('................|x-.x-x--........', 4, '|');

    // バンジョー：4分を短く刻む。チューバ：1拍目と3拍目
    const BANJO = 'x-..x-..x-..x-..';
    const TUBA = 'R:6 r:2 5:6 r:2';
    const KICK = repeat('x.......x.......', 8, '|');
    const SNARE = repeat('....x.......x...', 8, '|');
    const HAT = repeat('x.x.x.x.x.x.x.x.', 8, '|');
    const DRUMS = { kick: KICK, snare: SNARE, hat: HAT };
    const DRUMS_FILL = { kick: KICK, hat: HAT, snare: repeat('....x.......x...', 7, '|') + '|....x...x.x.xxxx' };

    // ディキシーランド：バンジョーとチューバに、ブラスとクラリネット
    const dixie = {
        title: '川船のパレード',
        tags: ['明るい', '軽快'],
        genre: 'ジャズ・ブルース',
        melody: ['lead'],
        bpm: 116,
        swing: 0.15,
        swingUnit: 2,
        gain: 0.09,
        reverb: { seconds: 1.5, tone: 0.5 },
        delay: { time: 0.75, feedback: 0.15, tone: 2400 },
        humanize: { time: 0.006, velocity: 0.1 },
        parts: {
            lead: { instrument: 'piano', volume: 0.6, pan: -0.05, decay: 0.75, brightness: 0.9, reverb: 0.18, delay: 0.06 },
            clarinet: { instrument: 'clarinet', volume: 0.45, pan: 0.3, attack: 0.04, release: 0.15, vibrato: 9, reverb: 0.25 },
            // トロンボーン：低いブラスを、暗めにして滑らせる
            trombone: { instrument: 'brass', volume: 0.85, pan: -0.25, brightness: 2.5, attack: 0.05, release: 0.15, vibrato: 10, reverb: 0.25 },
            horns: { instrument: 'brass', mode: 'chords', center: 'F4', voices: 3, volume: 0.5, pan: -0.2, brightness: 4, release: 0.08, reverb: 0.22 },
            banjo: { instrument: 'guitar', mode: 'chords', center: 'G4', voices: 3, strum: 0.006, brightness: 0.95, gate: 0.35, volume: 0.5, pan: 0.3, reverb: 0.12 },
            tuba: { instrument: 'synthBass', mode: 'bass', octave: 2, wave: 'triangle', cutoff: 280, envelope: 0.6, decay: 0.4, sustain: 0.5, release: 0.08, volume: 0.58, gate: 0.85 },
            drums: { instrument: 'drums', kit: 'soft', mode: 'drums', volume: 0.85, cutoff: 7500, levels: { kick: 0.5, snare: 0.4, hat: 0.4 } }
        },
        sections: {
            // イントロ：ブラスの合図とスネアのロールから、F7 で主題へ
            intro: {
                label: 'イントロ',
                chords: 'Bb | Eb | Bb/F | F7',
                horns: 'x-.x-x--........|x-.x-x--........|x-.x-x--........|x-------x-.x-x--',
                banjo: BANJO,
                tuba: TUBA,
                drums: { kick: repeat('x.......x.......', 4, '|'), snare: '................|................|................|....x...x.x.xxxx' }
            },
            A: {
                chords: CHORDS_A,
                lead: THEME,
                banjo: BANJO,
                tuba: TUBA,
                drums: DRUMS
            },
            // A'：クラリネットが絡む
            A2: {
                label: "A'",
                chords: CHORDS_A,
                lead: THEME,
                clarinet: CLARINET_A,
                banjo: BANJO,
                tuba: TUBA,
                drums: DRUMS_FILL
            },
            // B：Eb へ移り、ブラスが合いの手。F7 で休憩へ
            B: {
                chords: 'Eb | Eb | Bb | Bb | C7 | C7 | F7 | F7',
                lead: `G5:6 F5:2 Eb5:8 | Bb5:4 C6:4 Bb5:8 | D6:6 C6:2 Bb5:8 | F5:4 Bb5:4 D6:8 |
                       E5:4 G5:4 C6:8 | Bb5:6 A5:2 G5:8 | A5:4 C6:4 F5:4 A5:4 | C6:6 A5:2 F5:4 Eb5:4`,
                horns: HORNS,
                banjo: BANJO,
                tuba: TUBA,
                drums: DRUMS_FILL
            },
            // 休憩：主旋律を抜き、トロンボーンが滑らせて歌う。ドラムはキックとハイハットだけ。F7 で頭の Bb へ戻る
            C: {
                chords: 'Bb | G7 | Cm7 | F7 | Bb | G7 | Cm7 | F7',
                trombone: `D4:8 F4:4 Bb4:4 | B3~D4:8 F4:8 | Eb4:8 G4:4 C4:4 | A3~C4:8 Eb4:8 |
                           D4:4 F4:4 Bb4:8 | B4:8 G4:8 | C4:8 Eb4:4 G4:4 | A4~C5:8 A4:8`,
                banjo: BANJO,
                tuba: TUBA,
                drums: { kick: KICK, hat: HAT }
            },
            // 最後の A：クラリネットとブラスを足して、全員で。F7 で頭の Bb へ戻る
            A3: {
                label: 'A',
                chords: CHORDS_A,
                lead: THEME,
                clarinet: CLARINET_A,
                horns: HORNS,
                banjo: BANJO,
                tuba: TUBA,
                drums: DRUMS_FILL
            }
        },
        intro: ['intro'],
        loop: ['A', 'A2', 'B', 'C', 'A3']
    };

    SoundKit.register('catalog', { songs: { dixie } });
})();
