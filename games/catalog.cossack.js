/**
 * 曲の一覧：草原のコサック（コサック風・イ短調で、ゆっくり始まってだんだん速くなる民謡）
 * テンポは変えずに、音の細かさで速くしていく。A は2分音符でゆっくり歌い、A' は4分音符、B と B' は8分音符の踊り
 * アコーディオン（バヤン）の伴奏も、2分 → 4分 → 8分の裏打ちと細かくなり、B ではバラライカ（明るいギター）が16分を混ぜてかき鳴らす
 * B' は手拍子と合唱の掛け声で頂点へ。休憩の C でまたゆっくりに戻り、バイオリンが哀しく歌う
 */
(function () {
    const { repeat } = SoundKit;

    const CHORDS = 'Am | Dm | G | C | F | Dm | E | E';

    // A：2分音符でゆっくり
    const SLOW = 'E5:8 A5:8 | A5:8 F5:8 | G5:8 D5:8 | E5:16 | F5:8 A5:8 | D6:8 A5:8 | G#5:8 B5:8 | E5:16';
    // A'：4分音符で歩き出す
    const WALK = `E5:4 A5:4 C6:4 A5:4 | D6:4 A5:4 F5:8 | D5:4 G5:4 B5:4 D6:4 | C6:8 G5:4 E5:4 |
                  F5:4 A5:4 C6:4 A5:4 | D6:4 C6:4 A5:8 | B5:4 G#5:4 E5:4 G#5:4 | B5:12 r:4`;
    // B：8分音符で踊る（前半7小節は B' でも同じ）
    const DANCE_HEAD = `A5:2 B5:2 C6:2 A5:2 E5:2 A5:2 C6:4 | D6:2 C6:2 A5:2 F5:2 D5:4 F5:4 |
                        G5:2 A5:2 B5:2 G5:2 D5:2 G5:2 B5:4 | C6:2 B5:2 G5:2 E5:2 C5:4 E5:4 |
                        F5:2 G5:2 A5:2 F5:2 C6:4 A5:4 | D6:2 C6:2 A5:2 F5:2 A5:4 D6:4 |
                        B5:2 C6:2 B5:2 G#5:2 E5:4 G#5:4`;
    // B の終わり：Am に着地して、B' へ
    const DANCE = `${DANCE_HEAD} | A5:4 E5:4 A5:4 r:4`;
    // B' の終わり：E で止めて、休憩へ
    const DANCE_TURN = `${DANCE_HEAD} | B5:4 G#5:4 E5:4 r:4`;
    const CHORDS_B = 'Am | Dm | G | C | F | Dm | E | Am';

    // バヤン：2分 → 4分 → 8分の裏打ちと細かくしていく
    const BAYAN_SLOW = 'x-------x-------';
    const BAYAN_WALK = 'x---x---x---x---';
    const BAYAN_DANCE = '..x-..x-..x-..x-';
    // バラライカ：16分を混ぜた「タタタン」でかき鳴らす（16分で動くのはこれだけ）
    const BALALAIKA = 'x.xxx.x.x.xxx.x.';

    const KICK = repeat('x...x...x...x...', 8, '|');
    const OFFBEAT = repeat('..x...x...x...x.', 8, '|');
    // 合唱の掛け声：小節の頭で「ヘイ！」
    const HEY = repeat('................|x-..............', 4, '|');

    // コサック：だんだん速くなる民謡
    const cossack = {
        title: '草原のコサック',
        tags: ['軽快', '緊張感'],
        genre: 'ワールド',
        melody: ['lead'],
        bpm: 132,
        gain: 0.1,
        reverb: { seconds: 1.8, tone: 0.45 },
        delay: { time: 0.75, feedback: 0.15, tone: 2200 },
        humanize: { time: 0.005, velocity: 0.08 },
        parts: {
            lead: { instrument: 'piano', volume: 0.52, pan: -0.08, decay: 0.85, brightness: 0.85, reverb: 0.2, delay: 0.06 },
            violin: { instrument: 'strings', volume: 0.95, pan: 0.3, attack: 0.1, release: 0.4, brightness: 0.9, vibrato: 14, reverb: 0.35 },
            bayan: { instrument: 'accordion', mode: 'chords', center: 'E4', voices: 3, volume: 0.71, pan: -0.2, release: 0.1, reverb: 0.2 },
            balalaika: { instrument: 'guitar', mode: 'chords', center: 'A4', voices: 3, strum: 0.004, brightness: 0.9, gate: 0.5, volume: 0.42, pan: 0.3, reverb: 0.15 },
            choir: { instrument: 'choir', mode: 'chords', center: 'E4', voices: 3, volume: 0.5, pan: 0.1, attack: 0.03, release: 0.15, reverb: 0.3 },
            bass: { instrument: 'synthBass', mode: 'bass', octave: 2, wave: 'triangle', cutoff: 300, envelope: 0.6, decay: 0.3, sustain: 0.45, release: 0.06, volume: 0.6, gate: 0.8 },
            drums: { instrument: 'drums', kit: 'soft', mode: 'drums', volume: 0.6, cutoff: 7500, levels: { kick: 0.55, snare: 0.35, clap: 0.4, shaker: 0.3 } }
        },
        sections: {
            // イントロ：バヤンがゆっくり和音を伸ばし、E で歌へ
            intro: {
                label: 'イントロ',
                chords: 'Am | Dm | Am | E',
                bayan: BAYAN_SLOW,
                bass: 'R:16'
            },
            // A：2分音符でゆっくり歌う
            A: {
                chords: CHORDS,
                lead: SLOW,
                bayan: BAYAN_SLOW,
                bass: 'R:8 5:8'
            },
            // A'：4分音符で歩き出し、キックが拍を刻む
            A2: {
                label: "A'",
                chords: CHORDS,
                lead: WALK,
                bayan: BAYAN_WALK,
                bass: 'R:4 5:4 R:4 5:4',
                drums: { kick: repeat('x.......x.......', 7, '|') + '|x...x...x.x.x.x.' }
            },
            // B：8分音符で踊る。バヤンは裏打ち、バラライカが16分を混ぜてかき鳴らす
            B: {
                chords: CHORDS_B,
                lead: DANCE,
                bayan: BAYAN_DANCE,
                balalaika: BALALAIKA,
                bass: 'R:4 5:4 R:4 5:4',
                drums: { kick: KICK, snare: OFFBEAT }
            },
            // B'：手拍子と合唱の掛け声で頂点へ。E で休憩へ
            B2: {
                label: "B'",
                chords: CHORDS,
                lead: DANCE_TURN,
                bayan: BAYAN_DANCE,
                balalaika: BALALAIKA,
                choir: HEY,
                bass: 'R:4 5:4 R:4 5:4',
                drums: {
                    kick: KICK,
                    snare: OFFBEAT,
                    clap: repeat('....x.......x...', 8, '|'),
                    shaker: repeat('x.x.x.x.x.x.x.x.', 8, '|')
                }
            },
            // 休憩：またゆっくりに戻り、ピアノを抜いてバイオリンが哀しく歌う。E で頭の Am へ戻る
            C: {
                chords: CHORDS,
                violin: 'C6:16 | A5:16 | B5:8 G5:8 | E5:16 | A5:8 C6:8 | F5:16 | G#5:8 B5:8 | E5:16',
                bayan: BAYAN_SLOW,
                bass: 'R:16'
            }
        },
        intro: ['intro'],
        loop: ['A', 'A2', 'B', 'B2', 'C']
    };

    SoundKit.register('catalog', { songs: { cossack } });
})();
