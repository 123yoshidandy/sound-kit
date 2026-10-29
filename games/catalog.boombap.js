/**
 * 曲の一覧：レンガ壁のブーンバップ（ヒップホップのビート・ニ短調で、ゆったり跳ねる）
 * 重いキックとスネアのゆったりしたビートに、レコードから切り出したような短いピアノの和音を、少しこもらせて置く
 * ベースはキックに合わせて跳ね、主旋律のピアノは拍の裏から入って、のんびり歌う。A' はビブラフォンが主題の伸ばしに答える
 * B はト短調の和音から巡ってパッドが敷き、休憩の C はピアノを抜いて、フルートがひとりで歌う。A7 で頭の Dm7 へ戻る
 */
(function () {
    const { repeat } = SoundKit;

    // A の主題：拍の裏から入って、のんびり歌う。A7 で頭の Dm7 へ
    const THEME = `r:2 A5:2 C6:2 D6:6 C6:2 A5:2 | Bb5:4 r:2 G5:2 F5:8 | r:2 F5:2 A5:2 D6:6 C6:2 A5:2 | G5:6 E5:2 C#5:8 |
                   r:2 D5:2 F5:2 A5:6 C6:2 A5:2 | Bb5:6 A5:2 G5:8 | F5:4 A5:4 D6:4 C6:4 | C#6:6 A5:2 E5:4 G5:4`;
    const CHORDS_A = 'Dm7 | Gm7 | Bbmaj7 | A7 | Dm7 | Gm7 | Bbmaj7 | A7';

    // A' のビブラフォン：主題が伸ばしている所に答える
    const VIBES_A = 'r:16 | r:10 A5:2 C6:4 | r:16 | r:10 E5:2 G5:4 | r:16 | r:10 D6:2 Bb5:4 | r:16 | r:16';

    // B：ト短調の和音から巡り、A7 で休憩へ
    const CHORDS_B = 'Gm7 | C7 | Fmaj7 | Bbmaj7 | Em7b5 | A7 | Dm7 | A7';
    const SONG_B = `D6:6 Bb5:2 G5:8 | E5:4 G5:4 Bb5:8 | C6:6 A5:2 E5:8 | D6:6 C6:2 F5:8 |
                    G5:4 Bb5:4 D6:8 | C#6:6 A5:2 E5:8 | F5:4 A5:4 C6:4 A5:4 | E5:4 G5:4 A5:4 C#6:4`;

    // 休憩：フルートがひとりで歌う。A7 で頭の Dm7 へ戻る
    const CHORDS_C = 'Dm7 | Bbmaj7 | Gm7 | A7 | Dm7 | Bbmaj7 | Gm7 | A7';
    const FLUTE_C = `A5:8 F5:8 | D6:8 A5:8 | Bb5:8 D6:8 | C#6:12 A5:4 |
                     C6:8 A5:8 | F5:8 D6:8 | Bb5:8 G5:8 | E5:8 G5:8`;

    // 切り出したピアノの和音は短く。ベースはキックに合わせて跳ねる
    const CHOP = 'x-.....x-.x.....';
    const BASS = 'R:8 r:2 R:3 5:3';
    const KICK = repeat('x.........x..x..', 8, '|');
    const SNARE = repeat('....x.......x...', 8, '|');
    const HAT = repeat('x.x.x.xox.x.x.xo', 8, '|');
    const DRUMS = { kick: KICK, snare: SNARE, hat: HAT };
    const DRUMS_FILL = { ...DRUMS, snare: repeat('....x.......x...', 7, '|') + '|....x.......x..o', openHat: repeat('..............x.', 8, '|') };

    // ブーンバップ：重いビートと、短いピアノの和音
    const boombap = {
        title: 'レンガ壁のブーンバップ',
        tags: ['おしゃれ', '落ち着いた'],
        genre: 'ファンク・ソウル',
        melody: ['lead'],
        bpm: 88,
        swing: 0.14,
        swingUnit: 1,
        gain: 0.1,
        reverb: { seconds: 1.6, tone: 0.4 },
        delay: { time: 0.75, feedback: 0.25, tone: 1800, reverb: 0.2 },
        humanize: { time: 0.008, velocity: 0.12 },
        parts: {
            lead: { instrument: 'piano', volume: 0.55, pan: -0.08, decay: 0.8, brightness: 0.8, reverb: 0.2, delay: 0.08 },
            // 休憩の C で歌うフルート
            flute: { instrument: 'flute', volume: 0.5, pan: 0.18, breath: 0.07, vibrato: 10, reverb: 0.3, delay: 0.2 },
            vibes: { instrument: 'vibes', volume: 0.4, pan: 0.3, reverb: 0.35, delay: 0.25 },
            // レコードから切り出したようなピアノの和音：短く、少しこもらせる
            chop: { instrument: 'piano', mode: 'chords', center: 'E4', voices: 3, volume: 0.3, gate: 0.5, release: 0.08, brightness: 0.6, cutoff: 2200, pan: 0.2, reverb: 0.15 },
            pad: { instrument: 'pad', mode: 'chords', center: 'F4', voices: 3, volume: 0.25, cutoff: 1100, pan: -0.2, reverb: 0.4 },
            bass: { instrument: 'synthBass', mode: 'bass', octave: 2, wave: 'triangle', cutoff: 320, envelope: 0.8, decay: 0.45, sustain: 0.5, release: 0.08, volume: 0.5, gate: 0.85 },
            drums: { instrument: 'drums', kit: 'acoustic', mode: 'drums', volume: 0.7, cutoff: 7000, levels: { kick: 0.75, snare: 0.5, hat: 0.3, openHat: 0.25 } }
        },
        sections: {
            // イントロ：切り出した和音から、ビートとベースが入る。A7 で主題へ
            intro: {
                label: 'イントロ',
                chords: 'Dm7 | Gm7 | Bbmaj7 | A7',
                chop: CHOP,
                bass: { pattern: `r:16 | r:16 | ${BASS} | ${BASS}` },
                drums: { hat: repeat('x.x.x.xox.x.x.xo', 4, '|'), kick: '................|................|x.........x..x..|x.........x..x..', snare: '................|................|....x.......x...|....x.......x..o' }
            },
            A: {
                chords: CHORDS_A,
                lead: THEME,
                chop: CHOP,
                bass: BASS,
                drums: DRUMS
            },
            // A'：ビブラフォンが答え、オープンハイハットが入る
            A2: {
                label: "A'",
                chords: CHORDS_A,
                lead: THEME,
                vibes: VIBES_A,
                chop: CHOP,
                bass: BASS,
                drums: DRUMS_FILL
            },
            // B：ト短調の和音から巡り、パッドが薄く敷く
            B: {
                chords: CHORDS_B,
                lead: SONG_B,
                chop: CHOP,
                pad: 'hold',
                bass: BASS,
                drums: DRUMS_FILL
            },
            // 休憩：ピアノとスネアを抜き、フルートがひとりで歌う。和音は小節に1つ。A7 で頭の Dm7 へ戻る
            C: {
                chords: CHORDS_C,
                flute: FLUTE_C,
                chop: 'x-..............',
                pad: 'hold',
                bass: 'R:10 5:6',
                drums: { kick: repeat('x.........x.....', 8, '|'), hat: HAT }
            }
        },
        intro: ['intro'],
        loop: ['A', 'A2', 'B', 'C']
    };

    SoundKit.register('catalog', { songs: { boombap } });
})();
