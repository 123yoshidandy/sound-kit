/**
 * 曲の一覧：雲海をゆく飛行船（ゲーム音楽・ヘ長調の3拍子で、広々と明るく）
 * ピアノの主題は付点2分で大きく伸ばし、空を見渡すように上がる。弦のピチカートが2・3拍で「ズン・チャッ・チャッ」と運ぶ
 * B はニ短調から巡って弦が和音を伸ばし、ティンパニのつもりのタムが小節の頭を打つ。ホルンのつもりのブラスが伸ばしに答える
 * 休憩の C はピアノを抜き、フルートが風のように歌う。最後の A' はホルンとティンパニがそろい、C7 で頭の F へ戻る
 */
(function () {
    const bars = (...list) => list.join('|');
    const REST = '............';

    // A の主題：付点2分で伸ばし、上がっていく。最後の小節で次へ駆け上がる
    const THEME = `C5:4 F5:4 A5:4 | C6:12 | D6:6 C6:2 Bb5:4 | A5:12 |
                   F5:4 A5:4 D6:4 | D6:6 C6:2 Bb5:4 | C6:6 Bb5:2 G5:4 | G5:12 |
                   C5:4 F5:4 A5:4 | C6:6 D6:2 C6:4 | D6:8 Bb5:4 | F5:6 G5:2 Bb5:4 |
                   A5:8 C6:4 | Bb5:6 G5:2 E5:4 | F5:12 | r:4 E5:4 G5:4`;
    const CHORDS_A = 'F | F | Bb | F | Dm | Gm | C | C7 | F | F | Bb | Bb | F/C | C7 | F | C7';
    // ホルンのつもり：主題の伸ばしに答える
    const HORN_A = `r:12 | r:4 A4:4 C5:4 | r:12 | r:4 F4:4 A4:4 | r:12 | r:12 | r:12 | r:4 E4:4 Bb4:4 |
                    r:12 | r:12 | r:12 | r:12 | r:12 | r:12 | r:4 A4:4 C5:4 | G4:4 Bb4:4 E5:4`;

    // B：ニ短調から巡り、C7 で休憩へ
    const CHORDS_B = 'Dm | Bb | C | F | Dm | Bb | Gm | A7 | Bb | C | Am | Dm | Gm | C | F | C7';
    const SONG_B = `A5:4 D6:4 C6:4 | D6:8 Bb5:4 | C6:4 G5:4 E5:4 | F5:8 A5:4 |
                    F5:4 A5:4 D6:4 | D6:6 C6:2 Bb5:4 | Bb5:4 G5:4 D5:4 | E5:4 A5:4 C#6:4 |
                    D6:12 | C6:6 Bb5:2 G5:4 | E5:4 A5:4 C6:4 | D6:8 A5:4 |
                    Bb5:6 C6:2 D6:4 | C6:8 G5:4 | A5:12 | G5:8 E5:4`;
    const HORN_B = `r:12 | r:12 | r:12 | r:12 | r:12 | r:12 | r:12 | r:4 C#5:4 E5:4 |
                    r:12 | r:12 | r:12 | r:12 | r:12 | r:12 | r:4 F4:4 A4:4 | r:4 Bb4:4 C5:4`;

    // 休憩：フルートが風のように歌う。C7 で最後の A' へ
    const CHORDS_C = 'Bb | F | Gm | Dm | Bb | F | Gm | C | Dm | Am | Bb | F | Gm | Dm | Gm | C7';
    const SOLO_C = `D5:8 F5:4 | A5:12 | Bb5:8 G5:4 | A5:12 | F5:8 D5:4 | C5:12 | D5:8 Bb4:4 | C5:12 |
                    F5:8 A5:4 | E5:12 | F5:8 D5:4 | C5:12 | Bb4:8 D5:4 | F5:12 | G5:8 Bb5:4 | G5:8 Bb5:4`;

    // ピチカートは2・3拍、ベースは小節の頭
    const PIZZ = '....x...x...';
    const BASS = 'R:4 r:8';
    const BASS_B = 'R:4 r:4 5:4';
    // ティンパニのつもり：8小節ごとの頭と、区間の終わりの連打
    const TIMP_A = bars('x...........', ...Array(6).fill(REST), '........x.x.', 'x...........', ...Array(6).fill(REST), '....x.x.x.x.');
    const TIMP_B = bars(...Array(7).fill('x...........'), 'x.......x.x.', ...Array(7).fill('x...........'), 'x...x.x.x.x.');
    const TIMP_MID_B = bars(...Array(7).fill(REST), '..........x.', ...Array(7).fill(REST), '..........x.');

    // 飛行船：ピアノの主題、弦とホルン、ティンパニ
    const airship = {
        title: '雲海をゆく飛行船',
        tags: ['明るい'],
        genre: 'ゲーム音楽',
        melody: ['lead'],
        bpm: 120,
        stepsPerBar: 12,
        gain: 0.12,
        reverb: { seconds: 2.4, tone: 0.5 },
        delay: { time: 0.75, feedback: 0.22, tone: 2200, reverb: 0.25 },
        humanize: { time: 0.005, velocity: 0.08 },
        parts: {
            lead: { instrument: 'piano', volume: 0.5, pan: -0.08, decay: 0.9, brightness: 0.85, reverb: 0.25, delay: 0.08 },
            // 休憩の C で歌うフルート
            solo: { instrument: 'flute', volume: 0.45, pan: 0.15, vibrato: 12, reverb: 0.35, delay: 0.15 },
            // ホルンのつもり：やわらかく立ち上がるブラス
            horn: { instrument: 'brass', volume: 0.7, pan: 0.3, brightness: 2.2, attack: 0.07, release: 0.25, vibrato: 5, reverb: 0.35 },
            strings: { instrument: 'strings', mode: 'chords', center: 'E4', voices: 3, volume: 0.4, pan: -0.2, attack: 0.35, release: 0.7, brightness: 0.75, reverb: 0.4 },
            // ピチカート：弦を短く切って、2・3拍で運ぶ
            pizz: { instrument: 'strings', mode: 'chords', center: 'F4', voices: 3, gate: 0.3, attack: 0.01, release: 0.06, volume: 0.8, pan: 0.2, brightness: 0.9, vibrato: 0, reverb: 0.25 },
            bass: { instrument: 'pluck', mode: 'bass', octave: 2, brightness: 0.45, volume: 0.8 },
            // ティンパニのつもりのタム
            drums: { instrument: 'drums', kit: 'soft', mode: 'drums', volume: 0.65, cutoff: 6000, levels: { tomLow: 0.6, tomMid: 0.5, crash: 0.35 } }
        },
        sections: {
            // イントロ：弦の伸ばしとピチカート、ティンパニの連打で C7 から主題へ
            intro: {
                label: 'イントロ',
                chords: 'F | Bb | Gm | C7',
                strings: 'hold',
                pizz: bars(REST, PIZZ, PIZZ, PIZZ),
                bass: { pattern: `${BASS} | ${BASS} | ${BASS} | ${BASS}` },
                drums: { tomLow: bars('x...........', REST, REST, 'x...x.x.x.x.') }
            },
            A: {
                chords: CHORDS_A,
                lead: THEME,
                pizz: PIZZ,
                bass: BASS,
                drums: { tomLow: TIMP_A }
            },
            // B：ニ短調から巡り、弦が伸ばし、ティンパニが小節の頭を打つ
            B: {
                chords: CHORDS_B,
                lead: SONG_B,
                horn: HORN_B,
                strings: 'hold',
                pizz: PIZZ,
                bass: BASS_B,
                drums: { tomLow: TIMP_B, tomMid: TIMP_MID_B }
            },
            // 休憩：ピアノとティンパニを抜き、フルートが歌う。ピチカートは2拍目だけ
            C: {
                chords: CHORDS_C,
                solo: SOLO_C,
                strings: 'hold',
                pizz: '....x.......',
                bass: 'R:12'
            },
            // 最後の A'：ホルンとティンパニ、弦がそろう。C7 で頭の F へ戻る
            A2: {
                label: "A'",
                chords: CHORDS_A,
                lead: THEME,
                horn: HORN_A,
                strings: 'hold',
                pizz: PIZZ,
                bass: BASS_B,
                drums: { tomLow: TIMP_B, tomMid: TIMP_MID_B, crash: 'x...........' }
            }
        },
        intro: ['intro'],
        loop: ['A', 'B', 'C', 'A2']
    };

    SoundKit.register('catalog', { songs: { airship } });
})();
