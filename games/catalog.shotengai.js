/**
 * 曲の一覧：雨上がりの商店街（少し昔の町並み・ヘ長調で、軽くはねて歩く）
 * アコーディオンが2・4拍で「チャッ」と鳴り、ギターが分散和音でそっと歩く。ブラシのドラムで、水たまりをよけるように軽く
 * A7 や G7 を通る昔ながらの和音の流れ。A' はクラリネットが主題の伸ばしに答え、B は変ロ長調の方へ。アコーディオンが和音を伸ばす
 * 休憩の C はピアノを抜き、クラリネットがひとりで歌う
 */
(function () {
    const { repeat } = SoundKit;

    // A の主題。C7 で終えて、次の F へ
    const THEME = `C5:4 F5:4 A5:6 G5:2 | F5:4 A5:4 C6:8 | Bb5:6 A5:2 G5:4 D5:4 | E5:4 G5:4 C6:8 |
                   A5:6 G5:2 F5:4 C5:4 | E5:4 A5:4 C#6:8 | D6:4 C6:4 B5:4 G5:4 | Bb5:4 A5:4 G5:4 E5:4`;
    const CHORDS_A = 'F | Dm7 | Gm7 | C7 | F | A7 | Dm7:8 G7:8 | Gm7:8 C7:8';

    // A' のクラリネット：主題が伸ばしている所に答える
    const CLARINET_A = 'r:16 | r:8 F5:4 A5:4 | r:16 | r:8 G5:4 E5:4 | r:16 | r:8 A5:4 E5:4 | r:16 | r:16';

    // B：変ロ長調の方へ。C7 で休憩へ
    const CHORDS_B = 'Bb | C7 | Am7 | Dm7 | Gm7 | C7 | F | C7';
    const SONG_B = `D6:6 C6:2 Bb5:8 | C6:4 Bb5:4 G5:8 | A5:6 G5:2 E5:8 | F5:4 A5:4 D6:8 |
                    D6:6 Bb5:2 G5:8 | E5:4 G5:4 C6:8 | A5:4 C6:4 F5:8 | E5:8 G5:4 Bb5:4`;

    // 休憩のクラリネット：ひとりで歌う
    const CLARINET_C = `C5:8 F5:8 | A5:12 F5:4 | Bb5:8 F5:8 | G5:16 |
                        E5:8 A5:8 | C6:8 A5:8 | G5:8 Bb5:8 | G5:8 E5:8`;

    // アコーディオンの「チャッ」（2・4拍）と、ギターの分散和音、歩くベース
    const SQUEEZE = '....x-......x-..';
    const STROLL = '0:2 1 2 1 3 1 2 1';
    const BASS = 'R:4 3:4 5:4 3:4';
    const KICK = repeat('x.......x.......', 8, '|');
    const SNARE = repeat('....x.......x...', 8, '|');
    const SWISH = repeat('x...x...x...x...', 8, '|');
    const DRUMS = { kick: KICK, snare: SNARE, swish: SWISH };
    const DRUMS_FILL = { ...DRUMS, snare: repeat('....x.......x...', 7, '|') + '|....x...x.x.x.x.' };

    // 商店街：アコーディオンとギター、クラリネット
    const shotengai = {
        title: '雨上がりの商店街',
        tags: ['明るい', '落ち着いた'],
        genre: 'ワールド',
        melody: ['lead'],
        bpm: 104,
        swing: 0.08,
        swingUnit: 2,
        gain: 0.1,
        reverb: { seconds: 1.8, tone: 0.45 },
        delay: { time: 0.75, feedback: 0.2, tone: 2200 },
        humanize: { time: 0.006, velocity: 0.1 },
        parts: {
            lead: { instrument: 'piano', volume: 0.57, pan: -0.08, decay: 0.8, brightness: 0.8, reverb: 0.2, delay: 0.08 },
            clarinet: { instrument: 'clarinet', volume: 0.5, pan: 0.3, attack: 0.05, release: 0.15, vibrato: 6, reverb: 0.3, delay: 0.1 },
            squeeze: { instrument: 'accordion', mode: 'chords', center: 'F4', voices: 3, volume: 0.6, pan: -0.25, release: 0.08, reverb: 0.2 },
            stroll: { instrument: 'guitar', mode: 'arp', from: 'A3', brightness: 0.55, gate: 0.5, volume: 0.55, pan: 0.25, reverb: 0.2 },
            bass: { instrument: 'pluck', mode: 'bass', octave: 2, brightness: 0.35, sustain: 0.994, release: 0.08, volume: 0.85, gate: 0.6 },
            drums: { instrument: 'drums', kit: 'brush', mode: 'drums', volume: 1.4, cutoff: 7000, levels: { kick: 0.6, snare: 0.6, swish: 0.6 } }
        },
        sections: {
            // イントロ：ギターが歩き出し、アコーディオンが入る。C7 で主題へ
            intro: {
                label: 'イントロ',
                chords: 'F | Dm7 | Gm7 | C7',
                stroll: STROLL,
                squeeze: '................|................|' + SQUEEZE + '|' + SQUEEZE,
                bass: { pattern: `r:16 | r:16 | ${BASS} | ${BASS}` },
                drums: { swish: repeat('x...x...x...x...', 4, '|') }
            },
            A: {
                chords: CHORDS_A,
                lead: THEME,
                squeeze: SQUEEZE,
                stroll: STROLL,
                bass: BASS,
                drums: DRUMS
            },
            // A'：クラリネットが答える
            A2: {
                label: "A'",
                chords: CHORDS_A,
                lead: THEME,
                clarinet: CLARINET_A,
                squeeze: SQUEEZE,
                stroll: STROLL,
                bass: BASS,
                drums: DRUMS_FILL
            },
            // B：変ロ長調の方へ。アコーディオンが和音を伸ばす。C7 で休憩へ
            B: {
                chords: CHORDS_B,
                lead: SONG_B,
                squeeze: 'x-------x-------',
                stroll: STROLL,
                bass: BASS,
                drums: DRUMS_FILL
            },
            // 休憩：ピアノを抜き、クラリネットがひとりで歌う。ドラムはこするブラシだけ。C7 で頭の F へ戻る
            C: {
                chords: 'F | Dm7 | Bb | C7 | Am7 | Dm7 | Gm7 | C7',
                clarinet: CLARINET_C,
                squeeze: SQUEEZE,
                stroll: '0:4 1 2 1',
                bass: 'R:8 5:8',
                drums: { swish: SWISH }
            },
            // 最後の A'：クラリネットが答え、C7 で頭の F へ戻る
            A3: {
                label: "A'",
                chords: CHORDS_A,
                lead: THEME,
                clarinet: CLARINET_A,
                squeeze: SQUEEZE,
                stroll: STROLL,
                bass: BASS,
                drums: DRUMS_FILL
            }
        },
        intro: ['intro'],
        loop: ['A', 'A2', 'B', 'C', 'A3']
    };

    SoundKit.register('catalog', { songs: { shotengai } });
})();
