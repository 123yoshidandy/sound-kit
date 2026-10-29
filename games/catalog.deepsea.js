/**
 * 曲の一覧：深海の探査艇（アンビエント・ニ短調で、ゆっくり、神秘的に）
 * 低いパッドとベースが和音を長く敷き、ソナーのつもりのベルが2小節ごとに D を1音だけ鳴らして、エコーで返ってくる
 * B から、遠くで泡のつもりのオルゴールが3音ほど小さく上る。ピアノの主題は音を少なく、間を置いて歌う
 * 休憩の C はピアノを抜き、シンセのリードが音を滑らせて、クジラの歌のように鳴く。最後の A' は合唱が加わり、A で頭の Dm へ戻る
 */
(function () {
    // A の主題：音を少なく、間を置いて
    const THEME = `D5:4 A5:12 | r:4 F5:4 D6:8 | D6:6 C6:2 Bb5:8 | A5:16 |
                   r:4 D5:4 F5:4 C6:4 | C6:6 G5:2 E5:8 | D5:8 E5:8 | C#5:8 E5:8`;
    const CHORDS_A = 'Dm | Bbmaj7 | Gm | Dm | Bbmaj7 | C | Asus4 | A';

    // B：Gm から巡り、A で次へ
    const CHORDS_B = 'Gm | Dm | Bbmaj7 | F | Gm | Am | Bbmaj7 | A';
    const SONG_B = `G5:4 Bb5:4 D6:8 | C6:4 A5:4 F5:8 | r:4 D5:4 F5:8 | C6:12 A5:4 |
                    Bb5:8 G5:8 | E5:4 A5:4 C6:8 | D6:8 F5:8 | E5:16`;

    // 休憩：シンセのリードが音を滑らせて歌う。A で最後の A' へ
    const CHORDS_C = 'Dm | Dm | Bbmaj7 | Bbmaj7 | Gm | Gm | Asus4 | A';
    const SOLO_C = 'A5:8 A5~D5:8 | F5:16 | D5:8 F5~C6:8 | r:16 | D6:8 D6~G5:8 | Bb5:16 | A5:8 E5:8 | E5:16';

    // ソナーのつもり：2小節ごとに D を1音
    const SONAR = 'D6:2 r:14 | r:16';
    // 泡のつもり：遠くで3音ほど小さく上る
    const BUBBLES_A = `r:10 A5:1 D6:1 F6:1 r:3 | r:16 | r:6 G5:1 Bb5:1 D6:1 r:7 | r:12 D6:1 F6:1 A6:1 r:1 |
                       r:16 | r:8 E6:1 G6:1 r:6 | r:16 | r:4 E6:1 A6:1 r:10`;
    const BUBBLES_B = `r:10 G5:1 Bb5:1 D6:1 r:3 | r:16 | r:6 F5:1 Bb5:1 D6:1 r:7 | r:12 A5:1 C6:1 F6:1 r:1 |
                       r:16 | r:8 E6:1 A6:1 r:6 | r:16 | r:4 E6:1 A6:1 r:10`;
    const BUBBLES_C = `r:10 A5:1 D6:1 F6:1 r:3 | r:16 | r:6 F5:1 Bb5:1 D6:1 r:7 | r:16 |
                       r:12 D6:1 G6:1 r:2 | r:16 | r:8 D6:1 A6:1 r:6 | r:4 E6:1 A6:1 r:10`;

    // 深海：低いパッドとベース、ソナーと泡
    const deepsea = {
        title: '深海の探査艇',
        tags: ['神秘的', '落ち着いた'],
        genre: 'アンビエント',
        melody: ['lead'],
        bpm: 72,
        gain: 0.125,
        reverb: { seconds: 4, tone: 0.4 },
        delay: { time: 0.75, feedback: 0.35, tone: 1800, reverb: 0.4 },
        humanize: { time: 0.006, velocity: 0.08 },
        parts: {
            lead: { instrument: 'piano', volume: 0.65, pan: -0.08, decay: 1.1, brightness: 0.75, reverb: 0.4, delay: 0.2 },
            // 休憩の C で歌うシンセのリード
            solo: { instrument: 'softLead', volume: 0.6, pan: 0.15, cutoff: 1500, attack: 0.15, release: 0.5, vibrato: 8, reverb: 0.5, delay: 0.25 },
            // ソナーのつもり：澄んだベルに、長いエコー
            sonar: { instrument: 'bell', volume: 0.3, ratio: 1, index: 0.3, decay: 3, pan: 0.3, reverb: 0.5, delay: 0.5 },
            // 泡のつもり：遠くで鳴るオルゴール
            bubbles: { instrument: 'musicBox', volume: 0.25, decay: 0.4, pan: 0.4, reverb: 0.6, delay: 0.35 },
            pad: { instrument: 'pad', mode: 'chords', center: 'A3', voices: 3, volume: 0.35, cutoff: 900, attack: 1.5, release: 2, pan: -0.15, reverb: 0.5 },
            choir: { instrument: 'choir', mode: 'chords', center: 'D4', voices: 3, volume: 0.4, attack: 1, release: 1.5, pan: 0.15, reverb: 0.6 },
            bass: { instrument: 'synthBass', mode: 'bass', octave: 2, cutoff: 250, decay: 1.5, sustain: 0.8, release: 0.6, volume: 0.3 }
        },
        sections: {
            // イントロ：パッドとベース、ソナーだけ。A で主題へ
            intro: {
                label: 'イントロ',
                chords: 'Dm | Bbmaj7 | Asus4 | A',
                pad: 'hold',
                sonar: SONAR,
                bass: { pattern: 'r:16 | R:16 | R:16 | R:16' }
            },
            A: {
                chords: CHORDS_A,
                lead: THEME,
                pad: 'hold',
                sonar: SONAR,
                bass: 'R:16'
            },
            // B：Gm から巡り、遠くで泡が上る
            B: {
                chords: CHORDS_B,
                lead: SONG_B,
                pad: 'hold',
                sonar: SONAR,
                bubbles: BUBBLES_B,
                bass: 'R:16'
            },
            // 休憩：ピアノとベースを抜き、シンセのリードが滑らせて歌う
            C: {
                chords: CHORDS_C,
                solo: SOLO_C,
                pad: 'hold',
                sonar: SONAR,
                bubbles: BUBBLES_C
            },
            // 最後の A'：合唱と泡が加わる。A で頭の Dm へ戻る
            A2: {
                label: "A'",
                chords: CHORDS_A,
                lead: THEME,
                pad: 'hold',
                choir: 'hold',
                sonar: SONAR,
                bubbles: BUBBLES_A,
                bass: 'R:16'
            }
        },
        intro: ['intro'],
        loop: ['A', 'B', 'C', 'A2']
    };

    SoundKit.register('catalog', { songs: { deepsea } });
})();
