/**
 * 曲の一覧：丑三つ時の古井戸（和風の怪談・ニの都節音階で、ゆっくり、ひんやりと）
 * 低いドローンの上で、ピアノが「レ・ミ♭・ソ・ラ・シ♭」の都節で、ぽつりぽつりと歌う。一小節まるごと黙る間（ま）を多くとる
 * 黙った小節に、拍子木（リム）の「カン」と大太鼓（低いタム）の強い一打を不意に置く。鈴は小さく3つ振る
 * A' は琴のつもりのギターがつまびき、B は合唱の「ああ」が和音を伸ばす。休憩の C はピアノを抜き、尺八のつもりの息の多い笛が歌う
 * どの区間も Eb から Dsus4 へ半音で下りて終わり、頭の Dsus4 へ戻る
 */
(function () {
    const { repeat } = SoundKit;

    // A の主題（6小節）。2小節目はまるごと黙る
    const THEME = `A4:4 r:2 D5:2 Eb5:1 D5:7 | r:16 | G5:4 Bb5:6 A5:2 G5:4 | A5:12 r:4 |
                   D6:4 Bb5:4 A5:2 G5:6 | Eb5:8 r:4 D5:4`;
    const CHORDS_A = 'Dsus4 | Dsus4 | Eb | Dsus4 | Gm | Eb';

    // A' の琴：主題が黙っている所で、低くつまびく
    const KOTO_A = `r:16 | D4:2 A4:2 D5:4 r:8 | r:16 | r:8 G4:2 A4:2 D5:4 |
                    r:16 | r:8 Eb4:2 G4:2 Bb4:4`;

    // B：Gm へ沈み、合唱が伸ばす。Dsus4 で休憩へ
    const CHORDS_B = 'Gm | Gm | Eb | Eb | Cm | Dsus4';
    const SONG_B = `G5:2 Bb5:2 D6:12 | r:8 Bb5:4 A5:4 | G5:12 r:4 | Bb5:2 A5:2 G5:4 Eb5:8 |
                    G5:8 Eb5:8 | D5:12 r:4`;

    // 休憩：尺八のつもりの笛がひとりで歌う。Eb から頭の Dsus4 へ
    const CHORDS_C = 'Dsus4 | Eb | Dsus4 | Eb | Gm | Eb';
    const FLUTE_C = 'A5:12 r:4 | G5:8 Bb5:8 | A5:16 | r:8 Eb5:8 | D5:8 G5:8 | Bb5:8 G5:8';

    // ドローン：和音の根音を低く伸ばす（Eb の小節では Eb に下りる）
    const DRONE = 'R:16';
    // 鈴：小さく3つ振る（16分で動くのは鈴だけ）
    const SUZU = 'r:16 | r:12 D6:1 D6:1 D6:1 r:1 | r:16 | r:16 | r:16 | r:12 D6:1 D6:1 D6:1 r:1';
    const EMPTY = '................';
    // 太鼓は小節の頭で低く。黙った2小節目の終わりに、拍子木と大太鼓の不意の一打
    const DRUMS_A = {
        tomLow: `x...............|${EMPTY}|x...............|${EMPTY}|x.......x.......|${EMPTY}`,
        kick: `${EMPTY}|...........X....|${EMPTY}|${EMPTY}|${EMPTY}|${EMPTY}`,
        rim: `${EMPTY}|..........x.x...|${EMPTY}|${EMPTY}|${EMPTY}|${EMPTY}`
    };
    const DRUMS_B = {
        tomLow: repeat('x.......x.......', 6, '|'),
        kick: `${EMPTY}|${EMPTY}|${EMPTY}|...........X....|${EMPTY}|${EMPTY}`,
        rim: `${EMPTY}|${EMPTY}|${EMPTY}|..........x.x...|${EMPTY}|..x.x.x.x.x.x...`
    };

    // 和風の怪談：ドローンと都節のピアノ、太鼓・鈴・笛
    const kaidan = {
        title: '丑三つ時の古井戸',
        tags: ['緊張感', '神秘的'],
        genre: 'ワールド',
        melody: ['lead'],
        bpm: 60,
        gain: 0.17,
        reverb: { seconds: 3.5, tone: 0.4 },
        delay: { time: 0.75, feedback: 0.32, tone: 1800, reverb: 0.35 },
        humanize: { time: 0.01, velocity: 0.12 },
        parts: {
            lead: { instrument: 'piano', volume: 0.5, pan: -0.08, decay: 0.9, brightness: 0.75, reverb: 0.35, delay: 0.15 },
            // 休憩の C で歌う、尺八のつもりの笛：息の音を多く
            flute: { instrument: 'flute', volume: 0.32, pan: 0.2, breath: 0.25, vibrato: 18, reverb: 0.45, delay: 0.2 },
            // 琴のつもり：明るめのギターを1音ずつ
            koto: { instrument: 'guitar', volume: 0.6, pan: 0.3, brightness: 0.7, reverb: 0.35, delay: 0.15 },
            // 鈴：すぐ消えるベル
            suzu: { instrument: 'bell', volume: 0.45, decay: 0.2, ratio: 3.5, pan: -0.35, reverb: 0.45, delay: 0.2 },
            choir: { instrument: 'choir', mode: 'chords', center: 'D4', voices: 3, volume: 0.34, pan: 0.1, attack: 0.8, release: 1.2, reverb: 0.55 },
            drone: { instrument: 'pad', mode: 'bass', octave: 3, volume: 0.5, cutoff: 600, attack: 1.5, release: 2, reverb: 0.45 },
            drums: { instrument: 'drums', kit: 'soft', mode: 'drums', volume: 0.64, cutoff: 6000, levels: { tomLow: 0.7, kick: 0.6, rim: 0.5 } }
        },
        sections: {
            // イントロ：ドローンと太鼓から、鈴が鳴り、Eb から主題の Dsus4 へ
            intro: {
                label: 'イントロ',
                chords: 'Dsus4 | Dsus4 | Eb | Eb',
                drone: DRONE,
                suzu: 'r:16 | r:12 D6:1 D6:1 D6:1 r:1 | r:16 | r:16',
                koto: 'r:16 | r:16 | Eb4:2 G4:2 Bb4:4 r:8 | r:8 Bb4:2 G4:2 Eb4:4',
                drums: { tomLow: 'x...............|x...............|x.......x.......|x...x...x...x...' }
            },
            A: {
                chords: CHORDS_A,
                lead: THEME,
                drone: DRONE,
                suzu: SUZU,
                drums: DRUMS_A
            },
            // A'：琴が主題の黙った所でつまびく
            A2: {
                label: "A'",
                chords: CHORDS_A,
                lead: THEME,
                koto: KOTO_A,
                drone: DRONE,
                suzu: SUZU,
                drums: DRUMS_A
            },
            // B：Gm へ沈み、合唱が伸ばす。太鼓が2拍ずつ打ち、拍子木が速まって休憩へ
            B: {
                chords: CHORDS_B,
                lead: SONG_B,
                choir: 'hold',
                drone: DRONE,
                drums: DRUMS_B
            },
            // 休憩：ピアノと太鼓を抜き、笛がひとりで歌う。Eb から頭の Dsus4 へ戻る
            C: {
                chords: CHORDS_C,
                flute: FLUTE_C,
                choir: 'hold',
                drone: DRONE,
                suzu: SUZU
            }
        },
        intro: ['intro'],
        loop: ['A', 'A2', 'B', 'C']
    };

    SoundKit.register('catalog', { songs: { kaidan } });
})();
