/**
 * 曲の一覧：枯れ葉のワルツ（ジャズワルツ・変ロ長調の3拍子で、軽く揺れる）
 * 3拍子なので、1小節は12ステップ（16分音符12個）。ブラシのライドと、エレピの2拍目・3拍目の刻み
 * A' はクラリネットが低く支え、B は Ebmaj7 から ii-V で巡る。休憩の C はビブラフォンが歌い、ブラシをこする
 */
(function () {
    const { repeat } = SoundKit;

    // A の主題（16小節）。maj7 の和音では根音を避けて、3度・5度・7度・9度に置く
    const THEME_HEAD = `D5:4 F5:4 A5:4 | Bb5:8 G5:4 | G5:4 Bb5:4 C6:4 | A5:12 |
                        F5:4 A5:4 C6:4 | B5:8 G5:4 | Eb5:4 G5:4 Bb5:4 | A5:8 F5:4 |
                        D6:8 C6:4 | Ab5:8 F5:4 | G5:4 Bb5:4 D6:4 | Gb5:12 |
                        F5:4 A5:4 D6:4 | B5:8 F5:4 | Eb5:4 G5:4 Bb5:4`;
    const THEME = `${THEME_HEAD} | A5:8 C6:4`;
    // A' の終わり：F で伸ばして、B の Ebmaj7 へ（9th）
    const THEME_TURN = `${THEME_HEAD} | F5:12`;
    const CHORDS_A = `Bbmaj7 | Gm7 | Cm7 | F7 | Dm7 | G7 | Cm7 | F7 |
                      Bbmaj7 | Bb7 | Ebmaj7 | Ebm | Dm7 | G7 | Cm7 | F7`;

    // A' のクラリネット：和音の3度か7度を、低く伸ばす
    const CLARINET = `A4:12 | F4:12 | G4:12 | A4:12 | F4:12 | F4:12 | G4:12 | A4:12 |
                      A4:12 | Ab4:12 | G4:12 | Gb4:12 | F4:12 | F4:12 | G4:12 | A4:12`;

    // エレピ：2拍目と3拍目を軽く。2小節目は1拍目と3拍目
    const COMP = '....x-..x-..|x-......x-..';
    const BASS = 'R:4 5:4 3:4';
    const RIDE = repeat('x...x..xx...', 16, '|');
    const BRUSH = { ride: RIDE, hat: repeat('....o...o...', 16, '|'), kick: repeat('x...........', 16, '|') };

    // ジャズワルツ：ブラシとエレピ
    const jazzwaltz = {
        title: '枯れ葉のワルツ',
        tags: ['おしゃれ', '落ち着いた'],
        genre: 'ジャズ・ブルース',
        melody: ['lead'],
        bpm: 138,
        stepsPerBar: 12,
        swing: 0.12,
        swingUnit: 2,
        gain: 0.09,
        reverb: { seconds: 1.8, tone: 0.45 },
        delay: { time: 0.75, feedback: 0.2, tone: 2200, reverb: 0.2 },
        humanize: { time: 0.007, velocity: 0.1 },
        parts: {
            lead: { instrument: 'piano', volume: 0.66, pan: -0.08, decay: 0.8, brightness: 0.8, reverb: 0.2, delay: 0.08 },
            clarinet: { instrument: 'clarinet', volume: 0.45, pan: 0.3, attack: 0.08, release: 0.25, vibrato: 6, reverb: 0.3 },
            vibes: { instrument: 'vibes', volume: 0.6, pan: 0.2, tremolo: 4, reverb: 0.3, delay: 0.15 },
            keys: { instrument: 'epiano', mode: 'chords', center: 'D4', voices: 4, volume: 0.4, pan: 0.25, reverb: 0.2 },
            bass: { instrument: 'synthBass', mode: 'bass', octave: 2, wave: 'triangle', cutoff: 300, envelope: 0.6, decay: 0.4, sustain: 0.5, release: 0.08, volume: 0.5, gate: 0.85 },
            drums: { instrument: 'drums', kit: 'brush', mode: 'drums', volume: 1.4, cutoff: 8000, levels: { ride: 0.6, hat: 0.5, kick: 0.45, swish: 0.6, snare: 0.4 } }
        },
        sections: {
            // イントロ：ベースとブラシから、エレピが入る。F7 で主題へ
            intro: {
                label: 'イントロ',
                chords: 'Bbmaj7 | Gm7 | Cm7 | F7',
                keys: '............|............|' + COMP,
                bass: BASS,
                drums: { ride: repeat('x...x..xx...', 4, '|'), hat: repeat('....o...o...', 4, '|') }
            },
            A: {
                chords: CHORDS_A,
                lead: THEME,
                keys: COMP,
                bass: BASS,
                drums: BRUSH
            },
            // A'：クラリネットが低く支え、F で伸ばして B へ
            A2: {
                label: "A'",
                chords: CHORDS_A,
                lead: THEME_TURN,
                clarinet: CLARINET,
                keys: COMP,
                bass: BASS,
                drums: { ...BRUSH, snare: repeat('............', 15, '|') + '|....o...x.x.' }
            },
            // B：Ebmaj7 から ii-V で巡り、F7 で休憩へ
            B: {
                chords: `Ebmaj7 | Ab7 | Bbmaj7 | Gm7 | Cm7 | F7 | Dm7 | G7 |
                         Cm7 | F7 | Dm7 | G7 | Cm7 | F7 | Bbmaj7 | F7`,
                lead: `G5:4 Bb5:8 | C6:8 Gb5:4 | F5:12 | D5:4 G5:4 Bb5:4 | C6:8 Bb5:4 | A5:4 F5:4 Eb5:4 | D5:4 F5:4 A5:4 | B5:12 |
                       C6:4 Bb5:4 G5:4 | A5:8 F5:4 | A5:4 F5:4 D5:4 | G5:4 B5:4 D6:4 | C6:8 G5:4 | A5:4 C6:4 Eb5:4 | D5:12 | C5:4 F5:4 A5:4`,
                keys: COMP,
                bass: BASS,
                drums: { ...BRUSH, kick: repeat('x.......x...', 16, '|') }
            },
            // 休憩：ピアノを抜き、ビブラフォンが歌う。ライドの代わりにブラシをこする。F7 で頭の Bbmaj7 へ戻る
            C: {
                chords: CHORDS_A,
                vibes: `F5:12 | D5:12 | Eb5:4 G5:4 C6:4 | A5:12 | A5:12 | G5:4 B5:4 D6:4 | Eb5:12 | C5:4 F5:4 A5:4 |
                        D5:4 F5:4 A5:4 | Ab5:12 | G5:12 | Gb5:12 | F5:12 | F5:4 G5:4 B5:4 | G5:12 | A5:4 C6:4 Eb5:4`,
                keys: '....x-......',
                bass: 'R:8 5:4',
                drums: { swish: repeat('x.......x...', 16, '|'), hat: repeat('....o...o...', 16, '|') }
            }
        },
        intro: ['intro'],
        loop: ['A', 'A2', 'B', 'C']
    };

    SoundKit.register('catalog', { songs: { jazzwaltz } });
})();
