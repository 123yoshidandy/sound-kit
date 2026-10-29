/**
 * 曲の一覧：宝の地図をたどって（ゲーム音楽・ト長調で、弾むように冒険へ出る）
 * ピアノの主題は、拍の裏を休んで跳ねる。マリンバが8分の分散和音で足取りを刻み、ベースが1・3拍で踏む
 * A' から弦のピチカートが裏拍で弾み、ブラスが主題の伸ばしに「パパパーン」と答える。B は C の和音から開き、シェイカーが16分で急かす
 * 休憩の C はピアノを抜いて、弦がひとりで歌う。最後の B' はベルがきらりと答え、D で頭の G へ戻る
 */
(function () {
    const { repeat } = SoundKit;

    // A の主題（前半7小節は同じ）。4小節目と8小節目の後半を空けて、ブラスに渡す
    const THEME_HEAD = `D5:2 G5:2 r:2 B5:2 D6:4 B5:4 | C6:6 B5:2 A5:4 G5:4 | G5:2 B5:2 r:2 E5:2 G5:4 B5:4 | A5:8 r:8 |
                        B5:2 D6:2 r:2 B5:2 G5:4 D5:4 | E5:2 G5:2 r:2 C6:2 A5:4 G5:4 | A5:4 C6:4 F#5:4 A5:4`;
    const THEME = `${THEME_HEAD} | G5:8 r:8`;
    const CHORDS_A = 'G | C | Em | D | G | C | Am7:8 D7:8 | G';

    // ブラスの合いの手：4小節目と8小節目の空いた所に答える
    const FANFARE_A = `r:16 | r:16 | r:16 | r:8 D5:2 F#5:2 A5:4 |
                       r:16 | r:16 | r:16 | r:8 B4:2 D5:2 G5:4`;

    // B：C の和音から開き、D で次へ
    const CHORDS_B = 'C | D | Bm | Em | Am | D | C:8 D:8 | D';
    const SONG_B = `E5:4 G5:4 C6:8 | D6:6 C6:2 A5:8 | B5:4 D6:4 F#5:8 | G5:6 F#5:2 E5:8 |
                    C6:4 A5:4 E5:4 A5:4 | F#5:4 A5:4 D6:8 | C6:4 G5:4 A5:4 F#5:4 | A5:8 F#5:4 E5:4`;
    // B' のベル：伸ばしの終わりに、きらりと
    const BELL_B = 'r:12 E6:4 | r:16 | r:12 D6:4 | r:16 | r:12 E6:4 | r:16 | r:16 | r:16';

    // 休憩：弦がひとりで歌う。D で最後の A へ
    const CHORDS_C = 'Em | C | G | D | Em | C | Am | D';
    const SOLO_C = `B5:8 G5:8 | E5:8 G5:8 | D6:8 B5:8 | A5:12 F#5:4 |
                    G5:8 B5:8 | C6:8 E5:8 | C6:8 A5:8 | A5:8 F#5:8`;

    // マリンバは8分で上がって下りる。ベースは1・3拍、ピチカートは裏拍
    const ARP = '0:2 1 2 3 2 1 2 1';
    const BASS = 'R:4 r:4 5:4 r:2 3:2';
    const PIZZ = '..x...x...x...x.';
    const KICK = repeat('x.......x.x.....', 8, '|');
    const SNARE = repeat('....x.......x...', 8, '|');
    const HAT = repeat('x.x.x.x.x.x.x.x.', 8, '|');
    // 8小節目の後半で、タムが下りて次へ渡す
    const TOM_HIGH = repeat('................', 7, '|') + '|........x.x.....';
    const TOM_MID = repeat('................', 7, '|') + '|............x.x.';
    const DRUMS_A = { kick: KICK, snare: SNARE, hat: HAT };
    const DRUMS_B = { kick: KICK, snare: SNARE, hat: HAT, shaker: repeat('x.xxx.xxx.xxx.xx', 8, '|'), tomHigh: TOM_HIGH, tomMid: TOM_MID, crash: 'x...............' };

    // 宝探し：マリンバとピチカート、ブラスの合いの手
    const treasure = {
        title: '宝の地図をたどって',
        tags: ['明るい', '軽快'],
        genre: 'ゲーム音楽',
        melody: ['lead'],
        bpm: 128,
        gain: 0.107,
        reverb: { seconds: 1.8, tone: 0.5 },
        delay: { time: 0.75, feedback: 0.22, tone: 2400, reverb: 0.2 },
        humanize: { time: 0.004, velocity: 0.08 },
        parts: {
            lead: { instrument: 'piano', volume: 0.5, pan: -0.08, decay: 0.7, brightness: 0.9, reverb: 0.2, delay: 0.08 },
            // 休憩の C で歌う弦
            solo: { instrument: 'strings', volume: 1.1, pan: 0.15, attack: 0.12, release: 0.4, brightness: 0.85, vibrato: 10, reverb: 0.35 },
            // ファンファーレ：主題の空いた所に答えるブラス
            fanfare: { instrument: 'brass', volume: 0.7, pan: 0.3, brightness: 4, release: 0.1, reverb: 0.25 },
            bell: { instrument: 'bell', volume: 0.45, pan: 0.35, reverb: 0.4, delay: 0.25 },
            marimba: { instrument: 'marimba', mode: 'arp', from: 'G3', volume: 0.21, pan: 0.25, reverb: 0.2, delay: 0.1 },
            // ピチカート：弦を短く切って、裏拍で弾ませる
            pizz: { instrument: 'strings', mode: 'chords', center: 'D4', voices: 3, gate: 0.3, attack: 0.01, release: 0.06, volume: 0.8, pan: -0.25, brightness: 0.9, vibrato: 0, reverb: 0.2 },
            bass: { instrument: 'pluck', mode: 'bass', octave: 2, brightness: 0.45, volume: 0.7 },
            drums: { instrument: 'drums', kit: 'soft', mode: 'drums', volume: 0.67, cutoff: 8000, levels: { kick: 0.6, snare: 0.45, hat: 0.35, shaker: 0.35, tomHigh: 0.45, tomMid: 0.45, crash: 0.4 } }
        },
        sections: {
            // イントロ：マリンバとハイハットから、ベースとピチカートが入る。D で主題へ
            intro: {
                label: 'イントロ',
                chords: 'G | C | Am7 | D',
                marimba: ARP,
                pizz: `................|................|${PIZZ}|${PIZZ}`,
                bass: { pattern: `r:16 | r:16 | ${BASS} | ${BASS}` },
                drums: {
                    hat: repeat('x.x.x.x.x.x.x.x.', 4, '|'),
                    kick: '................|................|x.......x.x.....|x.......x.......',
                    tomHigh: '................|................|................|........x.x.....',
                    tomMid: '................|................|................|............x.x.'
                }
            },
            A: {
                chords: CHORDS_A,
                lead: THEME,
                marimba: ARP,
                bass: BASS,
                drums: DRUMS_A
            },
            // A'：ピチカートが裏拍で弾み、ブラスが答える
            A2: {
                label: "A'",
                chords: CHORDS_A,
                lead: THEME,
                fanfare: FANFARE_A,
                marimba: ARP,
                pizz: PIZZ,
                bass: BASS,
                drums: { ...DRUMS_A, tomHigh: TOM_HIGH, tomMid: TOM_MID }
            },
            // B：C の和音から開き、シェイカーが16分で急かす
            B: {
                chords: CHORDS_B,
                lead: SONG_B,
                marimba: ARP,
                pizz: PIZZ,
                bass: BASS,
                drums: DRUMS_B
            },
            // 休憩：ピアノとドラムを減らし、弦がひとりで歌う。マリンバは4分に
            C: {
                chords: CHORDS_C,
                solo: SOLO_C,
                marimba: '0:4 1 2 1',
                bass: 'R:8 5:8',
                drums: { kick: repeat('x.......x.......', 8, '|'), hat: repeat('....x.......x...', 8, '|'), tomHigh: TOM_HIGH, tomMid: TOM_MID }
            },
            // A：ファンファーレとピチカートがそろう
            A3: {
                label: 'A',
                chords: CHORDS_A,
                lead: THEME,
                fanfare: FANFARE_A,
                marimba: ARP,
                pizz: PIZZ,
                bass: BASS,
                drums: { ...DRUMS_A, crash: 'x...............', tomHigh: TOM_HIGH, tomMid: TOM_MID }
            },
            // 最後の B'：ベルがきらりと答える。D で頭の G へ戻る
            B2: {
                label: "B'",
                chords: CHORDS_B,
                lead: SONG_B,
                bell: BELL_B,
                marimba: ARP,
                pizz: PIZZ,
                bass: BASS,
                drums: DRUMS_B
            }
        },
        intro: ['intro'],
        loop: ['A', 'A2', 'B', 'C', 'A3', 'B2']
    };

    SoundKit.register('catalog', { songs: { treasure } });
})();
