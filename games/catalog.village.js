/**
 * 曲の一覧：風見鶏の村（ゲームの村の曲・のどかであたたかい）
 * ギターの分散和音とかき鳴らし、アコーディオンと弦楽器で、あたたかさを足す
 */
(function () {
    const { repeat } = SoundKit;

    // A の主題（前半4小節は A' でも同じ）
    const THEME_HEAD = `C5:4 F5:4 A5:6 G5:2 | Bb5:6 A5:2 F5:8 | A5:4 C6:4 A5:4 F5:4 | G5:8 E5:4 C5:4`;
    const THEME = `${THEME_HEAD} |
                   C5:4 F5:4 A5:6 G5:2 | Bb5:6 C6:2 D6:8 | D6:6 C6:2 Bb5:4 G5:4 | G5:6 E5:2 C5:8`;
    // A'：Dm・Am と寄り道して、主音の F で落ち着く
    const THEME_HOME = `${THEME_HEAD} |
                        D5:4 F5:4 A5:8 | C6:6 A5:2 E5:8 | D6:4 Bb5:4 G5:4 E5:4 | F5:12 r:4`;

    // フルートの合いの手（2回目の A で、主題の伸ばしている所に足す）
    const COUNTER = 'r:16 | r:8 A5:4 C6:4 | r:16 | r:16 | r:16 | r:8 F5:4 Bb5:4 | r:16 | r:8 E5:4 G5:4';

    // はじく弦の8分の分散和音
    const ARP = '0:2 1 2 1 3 1 2 1';
    // ギターのかき鳴らし（B と2回目の A で、分散和音の代わりに）
    const STRUM = 'x---x-x-x---x-x-';
    // アコーディオン：2分音符で和音を伸ばす
    const ACCORDION = 'x-------x-------';
    const BASS = 'R:4 5:4 R:4 5:4';
    const DRUMS = {
        kick: repeat('x.......x.......', 8, '|'),
        rim: repeat('....x.......x...', 8, '|'),
        shaker: repeat('o.x.o.x.o.x.o.x.', 8, '|')
    };
    // 終わりにタムを入れて、次の区間へつなぐ
    const DRUMS_FILL = { ...DRUMS, tom: repeat('................', 7, '|') + '|..........o.x.x.' };

    // 村：はじく弦とフルート、のんびりした足取り
    const village = {
        title: '風見鶏の村',
        tags: ['落ち着いた', '明るい'],
        genre: 'ゲーム音楽',
        melody: ['lead'],
        bpm: 100,
        gain: 0.091,
        reverb: { seconds: 1.8, tone: 0.45 },
        delay: { time: 0.75, feedback: 0.22, tone: 2200 },
        humanize: { time: 0.006, velocity: 0.08 },
        parts: {
            lead: { instrument: 'piano', volume: 0.7, pan: -0.08, decay: 0.8, brightness: 0.8, reverb: 0.22, delay: 0.1 },
            flute: { instrument: 'flute', volume: 0.45, pan: 0.3, reverb: 0.3, delay: 0.12 },
            guitar: { instrument: 'guitar', mode: 'arp', from: 'C4', brightness: 0.45, sustain: 0.995, release: 0.12, gate: 1.5, volume: 0.65, pan: 0.25, reverb: 0.22 },
            // ギターのかき鳴らし（低い弦から少しずつずらす）
            strum: { instrument: 'guitar', mode: 'chords', center: 'E4', voices: 4, strum: 0.014, brightness: 0.4, gate: 0.9, volume: 0.28, pan: 0.25, reverb: 0.22 },
            accordion: { instrument: 'accordion', mode: 'chords', center: 'F4', voices: 3, volume: 0.34, pan: -0.3, cutoff: 2400, reverb: 0.3 },
            pad: { instrument: 'pad', mode: 'chords', center: 'A3', voices: 3, volume: 0.32, cutoff: 1000, attack: 0.8, reverb: 0.4 },
            // 弦楽器：B でパッドに替えて敷く
            strings: { instrument: 'strings', mode: 'chords', center: 'A3', voices: 4, volume: 0.2, pan: -0.15, attack: 0.4, release: 0.5, brightness: 0.75, reverb: 0.4 },
            bass: { instrument: 'pluck', mode: 'bass', octave: 2, brightness: 0.35, sustain: 0.995, release: 0.12, volume: 1, gate: 0.9 },
            drums: { instrument: 'drums', kit: 'soft', mode: 'drums', volume: 0.6, cutoff: 7000, levels: { kick: 0.7, rim: 0.4, shaker: 0.35, tom: 0.45, crash: 0.25 } }
        },
        sections: {
            intro: {
                label: 'イントロ',
                chords: 'F | Bb | F | C7',
                guitar: ARP,
                bass: { pattern: `r:16 | r:16 | ${BASS} | ${BASS}` },
                drums: { shaker: '................|................|o.x.o.x.o.x.o.x.|o.x.o.x.o.x.o.x.' }
            },
            A: {
                chords: 'F | Bb | F | C | F | Bb | Gm7 | C7',
                lead: THEME,
                guitar: ARP,
                bass: BASS,
                drums: DRUMS
            },
            A2: {
                label: "A'",
                chords: 'F | Bb | F | C | Dm | Am | Bb:8 C7:8 | F',
                lead: THEME_HOME,
                guitar: ARP,
                accordion: ACCORDION,
                bass: BASS,
                drums: DRUMS_FILL
            },
            // B：Bb から始めて Am・Dm の方へ。ギターをかき鳴らし、弦を敷く
            B: {
                chords: 'Bb | C | Am | Dm | Gm7 | C | F/A | C7',
                lead: `D6:6 C6:2 Bb5:4 F5:4 | C6:6 G5:2 E5:8 | E5:4 A5:4 C6:8 | A5:6 F5:2 D5:8 |
                       Bb5:6 A5:2 G5:4 D5:4 | E5:4 G5:4 C6:8 | C6:6 A5:2 F5:8 | G5:6 Bb5:2 E5:8`,
                strum: STRUM,
                strings: 'hold',
                bass: BASS,
                drums: { ...DRUMS, crash: 'x...............|' + repeat('................', 7, '|') }
            },
            // 休憩：ピアノとドラムを抜き、フルートがゆっくり歌う。分散和音は4分に
            C: {
                chords: 'Bb | F | Bb | F | Gm7 | F/A | Bb | C7sus4:8 C7:8',
                flute: `r:4 D6:8 r:4 | r:4 C6:8 r:4 | r:4 F5:4 Bb5:8 | r:4 A5:8 r:4 |
                        r:4 Bb5:8 r:4 | r:4 A5:8 r:4 | r:4 D6:4 C6:4 r:4 | r:4 F5:4 G5:4 E5:4`,
                guitar: '0:4 1 2 1',
                pad: 'hold',
                bass: 'R:8 5:8',
                drums: {
                    shaker: repeat('o...o...o...o...', 8, '|')
                }
            },
            // A に、フルートの合いの手と、アコーディオン・ギターのかき鳴らしを足す。C7 で終えて、頭の F へ戻る
            A3: {
                label: 'A',
                chords: 'F | Bb | F | C | F | Bb | Gm7 | C7',
                lead: THEME,
                flute: COUNTER,
                strum: STRUM,
                accordion: ACCORDION,
                bass: BASS,
                drums: DRUMS_FILL
            }
        },
        intro: ['intro'],
        loop: ['A', 'A2', 'B', 'C', 'A3']
    };

    SoundKit.register('catalog', { songs: { village } });
})();
