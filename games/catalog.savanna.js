/**
 * 曲の一覧：サバンナの夕焼け（アフリカ風・ハ長調で、からっと明るく）
 * マリンバが表の8分、カリンバが裏の8分で、かみ合うように刻む。ジャンベ（高いタム）とドゥンドゥン（低いタム）、鐘のリズム（リム）
 * A' はカリンバが加わり、B は主旋律の呼びかけに合唱が答える。休憩の C はカリンバが歌う
 */
(function () {
    const { repeat } = SoundKit;

    // A の主題。I-IV-V-IV を回る
    const THEME = `E5:2 G5:2 A5:2 G5:2 E5:4 C5:4 | C5:2 D5:2 F5:4 A5:8 | B5:4 A5:2 G5:2 D5:8 | F5:4 A5:4 C6:8 |
                   C6:2 A5:2 G5:4 E5:4 G5:4 | A5:2 C6:2 A5:4 F5:8 | G5:4 B5:4 D6:8 | D6:4 B5:4 A5:4 G5:4`;
    const CHORDS_A = 'C | F | G | F | C | F | G | G';

    // マリンバ（表）とカリンバ（裏）：かみ合わせる
    const MARIMBA = '0:2 2 1 3 0 2 1 3';
    const KALIMBA = 'r:2 0:2 r 1 r 2 r 1';
    const BASS = 'R:4 r:2 5:2 R+:4 5:4';

    // 鐘のリズム・ジャンベ・ドゥンドゥン・シェイカー
    const BELL = repeat('x..x..x...x.x...', 8, '|');
    const DJEMBE = repeat('..x...x...x.x.x.', 8, '|');
    const DUNDUN = repeat('x.......x..x....', 8, '|');
    const SHAKER = repeat('x.o.x.o.x.o.x.o.', 8, '|');
    const DRUMS = { rim: BELL, tomHigh: DJEMBE, tomLow: DUNDUN, shaker: SHAKER };
    const DRUMS_FILL = { ...DRUMS, tomHigh: repeat('..x...x...x.x.x.', 7, '|') + '|..x...x.x.xxxxxx' };

    // アフリカ風：かみ合う木と金属の音と、太鼓
    const savanna = {
        title: 'サバンナの夕焼け',
        tags: ['明るい', '軽快'],
        genre: 'ワールド',
        melody: ['lead'],
        bpm: 108,
        gain: 0.072,
        reverb: { seconds: 1.6, tone: 0.5 },
        delay: { time: 0.75, feedback: 0.2, tone: 2400 },
        humanize: { time: 0.006, velocity: 0.1 },
        parts: {
            lead: { instrument: 'piano', volume: 0.74, pan: -0.08, decay: 0.75, brightness: 0.85, reverb: 0.18, delay: 0.08 },
            // 合唱の答え（B）
            response: { instrument: 'choir', volume: 0.55, pan: 0.2, attack: 0.08, release: 0.3, vibrato: 8, reverb: 0.35 },
            marimba: { instrument: 'marimba', mode: 'arp', from: 'C4', volume: 0.44, pan: -0.25, reverb: 0.2 },
            kalimba: { instrument: 'kalimba', mode: 'arp', from: 'E4', volume: 0.48, pan: 0.3, reverb: 0.25, delay: 0.15 },
            // カリンバの歌（休憩の C）
            kalimbaSolo: { instrument: 'kalimba', volume: 0.75, pan: 0.15, reverb: 0.3, delay: 0.2 },
            bass: { instrument: 'synthBass', mode: 'bass', octave: 2, wave: 'triangle', cutoff: 320, envelope: 0.8, decay: 0.3, sustain: 0.45, release: 0.06, volume: 0.6, gate: 0.75 },
            drums: { instrument: 'drums', kit: 'soft', mode: 'drums', volume: 0.92, cutoff: 7500, levels: { rim: 0.4, tomHigh: 0.5, tomLow: 0.65, shaker: 0.3 } }
        },
        sections: {
            // イントロ：鐘とドゥンドゥンから、マリンバが入る。G で主題へ
            intro: {
                label: 'イントロ',
                chords: 'C | F | G | G',
                marimba: { pattern: `r:16 | ${MARIMBA} | ${MARIMBA} | ${MARIMBA}` },
                bass: { pattern: `r:16 | r:16 | ${BASS} | ${BASS}` },
                drums: {
                    rim: repeat('x..x..x...x.x...', 4, '|'),
                    tomLow: repeat('x.......x..x....', 4, '|'),
                    tomHigh: '................|................|................|..x...x.x.xxxxxx'
                }
            },
            A: {
                chords: CHORDS_A,
                lead: THEME,
                marimba: MARIMBA,
                bass: BASS,
                drums: DRUMS
            },
            // A'：カリンバが裏で加わり、かみ合う
            A2: {
                label: "A'",
                chords: CHORDS_A,
                lead: THEME,
                marimba: MARIMBA,
                kalimba: KALIMBA,
                bass: BASS,
                drums: DRUMS_FILL
            },
            // B：主旋律が呼びかけ、合唱が答える。G で休憩へ
            B: {
                chords: 'Am | F | C | G | Am | F | Dm7 | G',
                lead: `A5:2 C6:2 A5:4 r:8 | F5:2 A5:2 C6:4 r:8 | E5:2 G5:2 C6:4 r:8 | D6:2 B5:2 G5:4 r:8 |
                       A5:2 C6:2 E5:4 r:8 | C6:2 A5:2 F5:4 r:8 | D5:2 F5:2 A5:4 r:8 | B5:2 D6:2 G5:4 r:8`,
                response: `r:8 E5:4 A4:4 | r:8 F5:4 C5:4 | r:8 G5:4 E5:4 | r:8 G5:4 D5:4 |
                           r:8 C5:4 E5:4 | r:8 A4:4 C5:4 | r:8 F5:4 D5:4 | r:8 B4:4 D5:4`,
                marimba: MARIMBA,
                kalimba: KALIMBA,
                bass: BASS,
                drums: DRUMS_FILL
            },
            // 休憩：ピアノを抜き、カリンバが歌う。マリンバは4分、太鼓は鐘とシェイカーだけ
            C: {
                chords: 'C | F | G | F | C | F | G | G',
                kalimbaSolo: `E5:4 G5:4 C6:8 | A5:4 F5:4 C5:8 | B4:4 D5:4 G5:8 | A5:8 F5:8 |
                              G5:4 E5:4 C5:8 | F5:4 A5:4 C6:8 | B5:4 G5:4 D5:8 | D5:4 G5:4 B5:8`,
                marimba: '0:4 2 1 3',
                bass: 'R:8 5:8',
                drums: { rim: BELL, shaker: SHAKER }
            },
            // 最後の A'：カリンバと太鼓のフィルで、G から頭の C へ戻る
            A3: {
                label: "A'",
                chords: CHORDS_A,
                lead: THEME,
                marimba: MARIMBA,
                kalimba: KALIMBA,
                bass: BASS,
                drums: DRUMS_FILL
            }
        },
        intro: ['intro'],
        loop: ['A', 'A2', 'B', 'C', 'A3']
    };

    SoundKit.register('catalog', { songs: { savanna } });
})();
