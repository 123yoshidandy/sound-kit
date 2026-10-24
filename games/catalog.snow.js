/**
 * 曲の一覧：雪の降る夜（冬の夜・変ロ長調の3拍子で、静かに）
 * 3拍子なので、1小節は12ステップ（16分音符12個）
 * 12小節目で Ebm（短調の IV）を借りて、冬の寂しさを出す。B はト短調へ寄って鈴を鳴らし、休憩の C はオルゴールだけで歌う
 */
(function () {
    const { repeat } = SoundKit;

    // A の主題（16小節）
    const THEME = `D5:4 F5:4 Bb5:4 | C6:8 Bb5:4 | G5:4 Bb5:4 Eb6:4 | D6:12 |
                   D6:4 C6:4 Bb5:4 | Eb6:8 C6:4 | C6:4 A5:4 F5:4 | A5:12 |
                   D5:4 F5:4 Bb5:4 | D6:8 C6:4 | Bb5:4 G5:4 Eb5:4 | Gb5:8 Eb5:4 |
                   F5:4 Bb5:4 D6:4 | D6:8 Bb5:4 | C6:4 Eb6:4 G5:4 | A5:8 C6:4`;
    const CHORDS_A = 'Bb | Bb | Eb | Bb | Gm | Cm7 | F | F | Bb | Bb/D | Eb | Ebm | Bb/F | Gm7 | Cm7 | F7';

    // 最後の A' のクラリネット：低く伸ばして支える
    const CLARINET = `F4:12 | F4:12 | G4:12 | F4:12 | G4:12 | G4:12 | A4:12 | A4:12 |
                      F4:12 | F4:12 | G4:12 | Gb4:12 | F4:12 | F4:12 | G4:12 | A4:12`;

    const ARP = '0:2 1 2 1 2 1';
    const SLEIGH = repeat('x.o.x.o.x.o.', 16, '|');

    // 雪の夜：ギターの分散和音と弦楽器に、オルゴールと鈴
    const snow = {
        title: '雪の降る夜',
        tags: ['落ち着いた', '神秘的'],
        genre: 'ゲーム音楽',
        melody: ['lead'],
        bpm: 100,
        stepsPerBar: 12,
        gain: 0.084,
        reverb: { seconds: 3, tone: 0.4 },
        delay: { time: 0.75, feedback: 0.3, tone: 2200, reverb: 0.3 },
        humanize: { time: 0.007, velocity: 0.08 },
        parts: {
            lead: { instrument: 'piano', volume: 0.68, pan: -0.1, decay: 1.1, brightness: 0.75, reverb: 0.3, delay: 0.15 },
            clarinet: { instrument: 'clarinet', volume: 0.47, pan: 0.3, attack: 0.08, release: 0.3, vibrato: 6, reverb: 0.35 },
            musicBox: { instrument: 'musicBox', volume: 0.6, pan: 0.2, reverb: 0.45, delay: 0.25 },
            guitar: { instrument: 'guitar', mode: 'arp', from: 'F3', brightness: 0.4, volume: 0.6, pan: 0.25, reverb: 0.3 },
            strings: { instrument: 'strings', mode: 'chords', center: 'D4', voices: 3, volume: 0.35, pan: -0.2, attack: 0.5, release: 0.8, brightness: 0.7, reverb: 0.5 },
            bass: { instrument: 'synthBass', mode: 'bass', octave: 2, wave: 'triangle', cutoff: 240, envelope: 0.4, decay: 1.2, sustain: 0.6, release: 0.5, volume: 0.45, gate: 0.9 },
            drums: { instrument: 'drums', kit: 'soft', mode: 'drums', volume: 0.6, cutoff: 7000, levels: { kick: 0.5, shaker: 0.4 } }
        },
        sections: {
            // イントロ：オルゴールとギターだけで始める
            intro: {
                label: 'イントロ',
                chords: 'Bb | Eb | Cm7 | F7',
                guitar: ARP,
                musicBox: 'D6:12 | Bb5:8 G5:4 | Eb6:8 C6:4 | A5:8 F5:4'
            },
            A: {
                chords: CHORDS_A,
                lead: THEME,
                guitar: ARP,
                bass: 'R:4 r:8'
            },
            // B：ト短調へ寄り、弦楽器と鈴を足す。F7 で休憩へ
            B: {
                chords: 'Gm | Gm/F | Eb | D | Gm | Cm | D7 | D7 | Eb | F | Dm | Gm | Cm | F | Bb | F7',
                lead: `G5:4 Bb5:4 D6:4 | D6:8 Bb5:4 | Bb5:4 G5:4 Eb5:4 | F#5:12 |
                       G5:4 Bb5:4 D6:4 | Eb6:8 D6:4 | C6:4 A5:4 F#5:4 | D5:12 |
                       Eb5:4 G5:4 Bb5:4 | C6:8 A5:4 | A5:4 F5:4 D5:4 | Bb5:12 |
                       G5:4 C6:4 Eb6:4 | C6:8 A5:4 | Bb5:4 D6:4 F5:4 | A5:8 C6:4`,
                guitar: ARP,
                strings: 'hold',
                bass: 'R:4 r:8',
                drums: { kick: repeat('x...........', 16, '|'), shaker: SLEIGH }
            },
            // 休憩：主旋律を抜き、オルゴールが歌う。弦楽器だけを敷く
            C: {
                chords: 'Bb | Gm | Eb | F | Bb | Gm | Cm7 | F7',
                musicBox: 'D6:12 | Bb5:12 | G5:8 Bb5:4 | A5:12 | F5:4 Bb5:4 D6:4 | D6:8 Bb5:4 | C6:8 Eb6:4 | A5:8 C6:4',
                guitar: '0:4 1 2',
                strings: 'hold',
                bass: 'R:12'
            },
            // 最後の A'：クラリネットが低く支え、鈴を足す。F7 で頭の Bb へ戻る
            A2: {
                label: "A'",
                chords: CHORDS_A,
                lead: THEME,
                clarinet: CLARINET,
                guitar: ARP,
                bass: 'R:4 r:8',
                drums: { shaker: SLEIGH }
            }
        },
        intro: ['intro'],
        loop: ['A', 'B', 'C', 'A2']
    };

    SoundKit.register('catalog', { songs: { snow } });
})();
