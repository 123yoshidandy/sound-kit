/**
 * 曲の一覧：石畳の小径のミュゼット（フランスのミュゼット・イ短調の3拍子で、ゆったり回る）
 * ベースが1拍目で根音と5度を交互に踏み、アコーディオンが2・3拍目で和音を短く鳴らして「ズン・チャッ・チャッ」にする
 * A' はアコーディオンが主題にユニゾンで重なり、ギターの刻みとブラシが加わる。B はハ長調の F から開き、E7 でイ短調へ戻る
 * 休憩の C はピアノを抜き、アコーディオンがひとりで歌う。最後は E7 で頭の Am へ戻る
 */
(function () {
    const { repeat } = SoundKit;

    // A の主題（16小節）
    const THEME = `E5:8 A5:4 | C6:6 B5:2 A5:4 | F5:4 A5:4 D6:4 | C6:8 A5:4 |
                   B5:8 G#5:4 | D6:6 B5:2 G#5:4 | A5:4 E5:4 A5:4 | C#6:8 A5:4 |
                   D6:8 A5:4 | F5:6 E5:2 D5:4 | E5:4 A5:4 C6:4 | B5:6 A5:2 E5:4 |
                   A5:4 F#5:4 D#5:4 | E5:4 G#5:4 B5:4 | A5:12 | D6:4 B5:4 G#5:4`;
    const CHORDS_A = `Am | Am | Dm | Dm | E7 | E7 | Am | A7 |
                      Dm | Dm | Am | Am | B7 | E7 | Am | E7`;

    // B：ハ長調の F から開き、E7 でイ短調へ戻る
    const CHORDS_B = `F | F | C | C | G7 | G7 | C | E7 |
                      Am | Am | Dm | Dm | Am | B7 | E7 | E7`;
    const SONG_B = `A5:8 C6:4 | D6:6 C6:2 A5:4 | G5:8 E5:4 | C6:12 |
                    B5:8 G5:4 | D6:6 B5:2 F5:4 | E5:4 G5:4 C6:4 | B5:8 G#5:4 |
                    A5:8 E5:4 | C6:6 B5:2 A5:4 | F5:4 A5:4 D6:4 | C6:8 A5:4 |
                    E5:4 A5:4 C6:4 | B5:6 A5:2 F#5:4 | G#5:8 B5:4 | E5:8 r:4`;

    // 休憩：アコーディオンがひとりで歌う。E7 で頭の Am へ戻る
    const CHORDS_C = 'Am | Dm | G7 | C | F | Dm | E7 | E7';
    const SOLO_C = 'A5:12 | F5:8 A5:4 | B5:8 G5:4 | C6:12 | A5:8 C6:4 | D6:8 A5:4 | B5:8 G#5:4 | E5:8 B5:4';

    // ズン・チャッ・チャッ：ベースは1拍目（根音と5度を交互に）、和音は2・3拍目
    const BASS = 'R:4 r:8 | 5:4 r:8';
    const CHUCK = '....x-..x-..';
    const SWISH = repeat('x...........', 16, '|');
    const HAT = repeat('....o...o...', 16, '|');

    // ミュゼット：アコーディオンとギターの3拍子
    const musette = {
        title: '石畳の小径のミュゼット',
        tags: ['おしゃれ', '落ち着いた'],
        genre: 'ワールド',
        melody: ['lead'],
        bpm: 120,
        stepsPerBar: 12,
        gain: 0.131,
        reverb: { seconds: 2, tone: 0.5 },
        delay: { time: 0.75, feedback: 0.22, tone: 2200, reverb: 0.2 },
        humanize: { time: 0.006, velocity: 0.1 },
        parts: {
            lead: { instrument: 'piano', volume: 0.46, pan: -0.08, decay: 0.8, brightness: 0.8, reverb: 0.22, delay: 0.08 },
            // A' で主題に重なるアコーディオン
            unison: { instrument: 'accordion', volume: 0.35, pan: 0.15, cutoff: 2600, reverb: 0.25, delay: 0.1 },
            // 休憩の C で歌うアコーディオン
            solo: { instrument: 'accordion', volume: 1, pan: 0.15, cutoff: 2600, reverb: 0.3, delay: 0.15 },
            // 2・3拍目で短く鳴らすアコーディオンの和音
            comp: { instrument: 'accordion', mode: 'chords', center: 'E4', voices: 3, gate: 0.5, release: 0.05, cutoff: 2400, volume: 0.8, pan: -0.25, reverb: 0.15 },
            // 2・3拍目でかき鳴らすギター
            guitar: { instrument: 'guitar', mode: 'chords', center: 'C4', voices: 3, strum: 0.015, gate: 0.5, volume: 0.57, pan: 0.3, reverb: 0.2 },
            bass: { instrument: 'pluck', mode: 'bass', octave: 2, brightness: 0.4, volume: 0.7 },
            drums: { instrument: 'drums', kit: 'brush', mode: 'drums', volume: 3, cutoff: 8000, levels: { swish: 0.5, hat: 0.45 } }
        },
        sections: {
            // イントロ：アコーディオンの刻みとベースで回り、E7 で主題へ
            intro: {
                label: 'イントロ',
                chords: 'Am | Dm | Am | E7',
                comp: CHUCK,
                bass: BASS
            },
            A: {
                chords: CHORDS_A,
                lead: THEME,
                comp: CHUCK,
                bass: BASS
            },
            // A'：アコーディオンが主題に重なり、ギターとブラシが加わる
            A2: {
                label: "A'",
                chords: CHORDS_A,
                lead: THEME,
                unison: THEME,
                comp: CHUCK,
                guitar: CHUCK,
                bass: BASS,
                drums: { swish: SWISH, hat: HAT }
            },
            // B：F から開く。アコーディオンの刻みを抜いてギターで回し、E7 で休憩へ
            B: {
                chords: CHORDS_B,
                lead: SONG_B,
                guitar: CHUCK,
                bass: BASS,
                drums: { swish: SWISH, hat: HAT }
            },
            // 休憩：ピアノを抜き、アコーディオンがひとりで歌う。ギターの刻みとベースだけで支え、E7 で頭の Am へ戻る
            C: {
                chords: CHORDS_C,
                solo: SOLO_C,
                guitar: CHUCK,
                bass: BASS
            }
        },
        intro: ['intro'],
        loop: ['A', 'A2', 'B', 'C']
    };

    SoundKit.register('catalog', { songs: { musette } });
})();
