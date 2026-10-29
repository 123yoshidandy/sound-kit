/**
 * 曲の一覧：ヤシの木陰のクンビア（コロンビアのクンビア・イ短調で、のんびり2拍子に揺れる）
 * ベースが1・3拍で踏み、アコーディオンが裏拍で和音を短く鳴らす。ギロのつもりのシェイカーが「チャ・チャカ」と16分で刻む
 * カウベルは短いベルの1音で表し、A' からコンガのつもりのタムと加わる。B はアコーディオンが主題の伸ばしに答え、タムが増えてにぎやかになる
 * 休憩の C はピアノを抜き、アコーディオンがひとりで歌う。最後の A' は E7 で頭の Am へ戻る
 */
(function () {
    const { repeat } = SoundKit;

    // A の主題（前半7小節は最後の A' でも同じ）。拍の裏を休んで、はずませる
    const THEME_HEAD = `E5:2 A5:2 r:2 C6:2 r:2 B5:2 A5:4 | F5:6 E5:2 D5:4 A5:4 |
                        B5:2 D6:2 r:2 B5:2 r:2 A5:2 G5:4 | E5:8 G5:4 C6:4 |
                        A5:2 C6:2 r:2 A5:2 r:2 G5:2 F5:4 | D5:6 F5:2 A5:8 | G#5:4 B5:4 D6:4 B5:4`;
    const THEME = `${THEME_HEAD} | A5:8 r:4 E5:4`;
    // ループの終わり：E7 で止めて、頭の Am へ戻る
    const THEME_LAST = `${THEME_HEAD} | B5:4 G#5:4 E5:4 G#5:4`;
    const CHORDS_HEAD = 'Am | Dm | G | C | F | Dm | E7';
    const CHORDS_A = `${CHORDS_HEAD} | Am`;
    const CHORDS_LAST = `${CHORDS_HEAD} | E7`;

    // B：F から開き、E7 で休憩へ
    const CHORDS_B = 'F | G | Em | Am | Dm | G | C | E7';
    const SONG_B = `C6:6 A5:2 F5:8 | D6:6 B5:2 G5:8 | B5:4 G5:4 E5:8 | A5:2 C6:2 r:2 A5:2 r:2 E5:2 A5:4 |
                    F5:6 A5:2 D6:8 | B5:6 D6:2 G5:8 | E5:4 G5:4 C6:4 G5:4 | G#5:4 B5:4 D6:4 B5:4`;
    // B のアコーディオン：主題が伸ばしている所に答える
    const REPLY_B = `r:10 A4:2 C5:2 F5:2 | r:10 B4:2 D5:2 G5:2 | r:10 G4:2 B4:2 E5:2 | r:16 |
                     r:10 F5:2 A5:2 D6:2 | r:10 B4:2 D5:2 G5:2 | r:16 | r:16`;

    // 休憩：アコーディオンがひとりで歌う。E7 で最後の A' へ
    const CHORDS_C = 'Am | F | C | G | Am | F | Dm | E7';
    const SOLO_C = `E5:8 A5:8 | A5:8 C6:8 | G5:8 E5:8 | D5:12 B4:4 |
                    C5:8 E5:8 | F5:8 A5:8 | A5:8 F5:8 | G#5:8 B5:8`;

    // ベースは1・3拍、アコーディオンは裏拍で短く。カウベルは短いベルの1音
    const BASS = 'R:4 r:4 5:4 r:2 5:2';
    const OFFBEAT = '..x...x...x...x.';
    const COWBELL = 'r:4 E6:1 r:3 r:4 E6:1 r:1 E6:1 r:1';
    const KICK = repeat('x.......x.......', 8, '|');
    const RIM = repeat('....x.......x...', 8, '|');
    // ギロのつもり：「チャ・チャカ」と16分で刻む
    const GUIRO = repeat('x.xxx.xxx.xxx.xx', 8, '|');
    const CONGA_HIGH = repeat('......x.......x.', 8, '|');
    const CONGA_MID = repeat('...........x....', 8, '|');
    const DRUMS_A = { kick: KICK, rim: RIM, shaker: GUIRO };
    const DRUMS_A2 = { ...DRUMS_A, tomHigh: CONGA_HIGH };
    const DRUMS_B = { ...DRUMS_A, tomHigh: CONGA_HIGH, tomMid: CONGA_MID, rim: repeat('....x.......x...', 7, '|') + '|....x.......x.xx' };

    // クンビア：アコーディオン・ギロ・カウベル・ベース
    const cumbia = {
        title: 'ヤシの木陰のクンビア',
        tags: ['軽快', '明るい'],
        genre: 'ラテン',
        melody: ['lead'],
        bpm: 100,
        swing: 0.05,
        swingUnit: 1,
        gain: 0.138,
        reverb: { seconds: 1.6, tone: 0.5 },
        delay: { time: 0.75, feedback: 0.22, tone: 2200, reverb: 0.2 },
        humanize: { time: 0.005, velocity: 0.1 },
        parts: {
            lead: { instrument: 'piano', volume: 0.46, pan: -0.08, decay: 0.75, brightness: 0.85, reverb: 0.2, delay: 0.08 },
            // 休憩の C で歌うアコーディオン
            solo: { instrument: 'accordion', volume: 1, pan: 0.15, cutoff: 2600, reverb: 0.3, delay: 0.15 },
            // B で主題の伸ばしに答えるアコーディオン
            reply: { instrument: 'accordion', volume: 0.75, pan: 0.3, cutoff: 2600, reverb: 0.25, delay: 0.15 },
            // 裏拍で短く鳴らすアコーディオンの和音
            comp: { instrument: 'accordion', mode: 'chords', center: 'E4', voices: 3, gate: 0.5, release: 0.05, cutoff: 2400, volume: 0.78, pan: -0.25, reverb: 0.15 },
            // カウベルのつもり：すぐ消えるベル
            cowbell: { instrument: 'bell', volume: 0.47, decay: 0.15, ratio: 2.4, pan: 0.35, reverb: 0.15 },
            bass: { instrument: 'pluck', mode: 'bass', octave: 2, brightness: 0.45, volume: 0.71 },
            drums: { instrument: 'drums', kit: 'soft', mode: 'drums', volume: 0.7, cutoff: 7500, levels: { kick: 0.6, rim: 0.45, shaker: 0.4, tomHigh: 0.4, tomMid: 0.4 } }
        },
        sections: {
            // イントロ：ギロとベースから、アコーディオンの裏拍が入る。E7 で主題へ
            intro: {
                label: 'イントロ',
                chords: 'Am | Dm | Am | E7',
                comp: `................|................|${OFFBEAT}|${OFFBEAT}`,
                bass: { pattern: `r:16 | ${BASS} | ${BASS} | ${BASS}` },
                drums: {
                    shaker: repeat('x.xxx.xxx.xxx.xx', 4, '|'),
                    kick: '................|' + repeat('x.......x.......', 3, '|'),
                    rim: '................|................|....x.......x...|....x.......x.xx'
                }
            },
            A: {
                chords: CHORDS_A,
                lead: THEME,
                comp: OFFBEAT,
                bass: BASS,
                drums: DRUMS_A
            },
            // A'：カウベルとコンガが加わる
            A2: {
                label: "A'",
                chords: CHORDS_A,
                lead: THEME,
                comp: OFFBEAT,
                cowbell: COWBELL,
                bass: BASS,
                drums: DRUMS_A2
            },
            // B：F から開き、アコーディオンが答える
            B: {
                chords: CHORDS_B,
                lead: SONG_B,
                reply: REPLY_B,
                comp: OFFBEAT,
                cowbell: COWBELL,
                bass: BASS,
                drums: DRUMS_B
            },
            // 休憩：ピアノとカウベルを抜き、アコーディオンがひとりで歌う。裏拍は半分に
            C: {
                chords: CHORDS_C,
                solo: SOLO_C,
                comp: '..x.......x.....',
                bass: 'R:8 5:8',
                drums: { kick: KICK, shaker: GUIRO }
            },
            // 最後の A'：カウベルとコンガ。E7 で頭の Am へ戻る
            A3: {
                label: "A'",
                chords: CHORDS_LAST,
                lead: THEME_LAST,
                comp: OFFBEAT,
                cowbell: COWBELL,
                bass: BASS,
                drums: DRUMS_B
            }
        },
        intro: ['intro'],
        loop: ['A', 'A2', 'B', 'C', 'A3']
    };

    SoundKit.register('catalog', { songs: { cumbia } });
})();
