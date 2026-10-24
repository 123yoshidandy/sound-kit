/**
 * 曲の一覧：放課後のチャイム（学校の日常・ハ長調で、明るいポップ）
 * イントロは学校のチャイム（キーン・コーン・カーン・コーン）をベルで鳴らしてから始まる
 * ギターのかき鳴らしと8分のベース。A' はベル（鉄琴）が答え、B はサビらしく弦楽器とクラップを足す
 * 休憩の C はドラムを軽くして、ベルがチャイムの節で歌う
 */
(function () {
    const { repeat } = SoundKit;

    // A の主題（C → G/B → Am → Em/G と下りていく伴奏の上で）
    const THEME = `E5:2 G5:2 C6:4 B5:2 C6:2 G5:4 | B5:6 A5:2 G5:8 | C6:4 A5:2 E5:2 A5:8 | G5:6 F#5:2 E5:8 |
                   A5:4 C6:4 F5:4 A5:4 | G5:6 E5:2 C5:8 | D5:2 F5:2 A5:4 C6:4 A5:4 | B5:8 G5:4 D5:4`;
    const CHORDS_A = 'C | G/B | Am | Em/G | F | C/E | Dm7 | G';

    // チャイム：キーン・コーン・カーン・コーン
    const CHIME = 'E5:4 C5:4 D5:4 G4:4 | G4:4 D5:4 E5:4 C5:4';
    // A' のベル：主題が伸ばしている所に答える
    const BELL_A = 'r:16 | r:8 D6:4 B5:4 | r:16 | r:8 B5:4 G5:4 | r:16 | r:8 G5:4 E5:4 | r:16 | r:8 D6:4 B5:4';

    const STRUM = 'x-..x-x-..x-x-x-';
    const BASS = 'R:2 R R R R R 5 R';
    const KICK = repeat('x.......x.x.....', 8, '|');
    const SNARE = repeat('....x.......x...', 8, '|');
    const HAT = repeat('x.x.x.x.x.x.x.x.', 8, '|');
    const DRUMS = { kick: KICK, snare: SNARE, hat: HAT };
    const DRUMS_FILL = {
        kick: KICK,
        snare: repeat('....x.......x...', 7, '|') + '|....x.......x.xx',
        hat: HAT,
        crash: 'x...............|' + repeat('................', 7, '|')
    };

    // 学校の日常：ギターとベルの明るいポップ
    const school = {
        title: '放課後のチャイム',
        tags: ['明るい', '軽快'],
        genre: 'ロック・ポップ',
        melody: ['lead'],
        bpm: 128,
        gain: 0.09,
        reverb: { seconds: 1.5, tone: 0.5 },
        delay: { time: 0.75, feedback: 0.2, tone: 2600 },
        humanize: { time: 0.004, velocity: 0.07 },
        parts: {
            lead: { instrument: 'piano', volume: 0.6, pan: -0.08, decay: 0.75, brightness: 0.85, reverb: 0.18, delay: 0.08 },
            bell: { instrument: 'bell', volume: 0.43, pan: 0.3, decay: 1.6, reverb: 0.35, delay: 0.2 },
            guitar: { instrument: 'guitar', mode: 'chords', center: 'G4', voices: 3, strum: 0.008, brightness: 0.7, gate: 0.5, volume: 0.55, pan: 0.25, reverb: 0.15 },
            strings: { instrument: 'strings', mode: 'chords', center: 'D4', voices: 3, volume: 0.43, pan: -0.2, attack: 0.3, release: 0.5, brightness: 0.75, reverb: 0.4 },
            keys: { instrument: 'epiano', mode: 'chords', center: 'E4', voices: 3, volume: 0.45, pan: -0.15, reverb: 0.25 },
            bass: { instrument: 'synthBass', mode: 'bass', octave: 2, wave: 'triangle', cutoff: 320, envelope: 0.8, decay: 0.25, sustain: 0.45, release: 0.05, volume: 0.6, gate: 0.7 },
            drums: { instrument: 'drums', kit: 'soft', mode: 'drums', volume: 0.65, cutoff: 7500, levels: { kick: 0.6, snare: 0.45, hat: 0.35, clap: 0.35, rim: 0.4, crash: 0.35 } }
        },
        sections: {
            // イントロ：チャイムを鳴らしてから、ギターとドラムが入る。G で主題へ
            intro: {
                label: 'イントロ',
                chords: 'C | C | Dm7 | G',
                bell: `${CHIME} | r:16 | r:16`,
                guitar: '................|................|' + STRUM + '|' + STRUM,
                bass: { pattern: `r:16 | r:16 | ${BASS} | ${BASS}` },
                drums: {
                    kick: '................|................|x.......x.x.....|x.......x.x.....',
                    snare: '................|................|....x.......x...|....x...x.x.xxxx'
                }
            },
            A: {
                chords: CHORDS_A,
                lead: THEME,
                guitar: STRUM,
                bass: BASS,
                drums: DRUMS
            },
            // A'：ベルが答える
            A2: {
                label: "A'",
                chords: CHORDS_A,
                lead: THEME,
                bell: BELL_A,
                guitar: STRUM,
                bass: BASS,
                drums: DRUMS_FILL
            },
            // B（サビ）：F から上がる。弦楽器とクラップを足し、G7 で休憩へ
            B: {
                chords: 'F | G | Em7 | Am | Dm7 | G | C:8 A7:8 | Dm7:8 G7:8',
                lead: `C6:6 A5:2 F5:4 A5:4 | B5:6 G5:2 D5:4 G5:4 | G5:4 B5:4 D6:8 | C6:6 B5:2 A5:8 |
                       F5:4 A5:4 C6:8 | D6:6 C6:2 B5:8 | C6:4 G5:4 A5:4 C#6:4 | D6:4 A5:4 B5:4 G5:4`,
                guitar: STRUM,
                strings: 'hold',
                bass: BASS,
                drums: { ...DRUMS_FILL, clap: SNARE }
            },
            // 休憩：ピアノとギターを抜き、ベルがチャイムの節で歌う。エレピが和音を伸ばし、ドラムはリムとハイハットだけ
            C: {
                chords: 'C | C | Am | G | F | C/E | Dm7 | G',
                bell: `${CHIME} | C5:8 E5:8 | D5:8 B4:8 | A5:4 F5:4 C5:8 | G5:8 E5:8 | F5:4 A5:4 D5:8 | D5:8 B4:8`,
                keys: 'x-------x-------',
                bass: 'R:8 5:8',
                drums: { rim: SNARE, hat: HAT }
            },
            // 最後の A'：ベルと弦楽器を足して、G で頭の C へ戻る
            A3: {
                label: "A'",
                chords: CHORDS_A,
                lead: THEME,
                bell: BELL_A,
                strings: 'hold',
                guitar: STRUM,
                bass: BASS,
                drums: DRUMS_FILL
            }
        },
        intro: ['intro'],
        loop: ['A', 'A2', 'B', 'C', 'A3']
    };

    SoundKit.register('catalog', { songs: { school } });
})();
