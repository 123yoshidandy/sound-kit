/**
 * 曲の一覧：赤い砂の情熱（フラメンコ風・イ短調で激しく）
 * アンダルシア終止（Am → G → F → E）を回す。ギターのラスゲアード（かき鳴らし）と、手拍子・カスタネット
 * A' はもう1本のギターが分散和音で絡み、B は Dm へ寄る。休憩の C は主旋律を抜いて、バイオリンが歌う
 */
(function () {
    const { repeat } = SoundKit;

    // A の主題
    const THEME = `E5:2 A5:2 C6:4 B5:2 A5:2 E5:4 | D6:4 B5:2 G5:2 D5:8 | C6:4 A5:2 F5:2 A5:4 C6:4 | B5:6 G#5:2 E5:8 |
                   A5:2 B5:2 C6:4 E6:6 D6:2 | D6:4 B5:4 G5:8 | F5:2 G5:2 A5:4 C6:4 A5:4 | G#5:6 B5:2 E5:8`;
    const CHORDS_A = 'Am | G | F | E | Am | G | F | E';

    // ラスゲアード：16分を混ぜて、かき鳴らす（16分で動くのはこれだけ）
    const RASGUEO = 'x.xx.x.xx.x.x.x.';
    const BASS = 'R:4 r:2 R:2 5:4 r:4';
    // 手拍子（パルマ）とカスタネット
    const PALMAS = {
        clap: repeat('....x..x....x...', 8, '|'),
        rim: repeat('x.x...x.x.x...x.', 8, '|'),
        kick: repeat('x.......x.......', 8, '|')
    };
    const PALMAS_FILL = { ...PALMAS, clap: repeat('....x..x....x...', 7, '|') + '|....x.x.x.x.xxxx' };

    // フラメンコ：ギターのかき鳴らしと手拍子
    const flamenco = {
        title: '赤い砂の情熱',
        tags: ['緊張感', 'おしゃれ'],
        genre: 'ラテン',
        melody: ['lead'],
        bpm: 120,
        gain: 0.095,
        reverb: { seconds: 1.8, tone: 0.45 },
        delay: { time: 0.75, feedback: 0.2, tone: 2400 },
        humanize: { time: 0.005, velocity: 0.1 },
        parts: {
            lead: { instrument: 'piano', volume: 0.56, pan: -0.08, decay: 0.7, brightness: 0.85, reverb: 0.2, delay: 0.08 },
            violin: { instrument: 'strings', volume: 0.75, pan: 0.3, attack: 0.08, release: 0.3, brightness: 0.9, vibrato: 12, reverb: 0.35 },
            guitar: { instrument: 'guitar', mode: 'chords', center: 'D4', voices: 3, strum: 0.015, brightness: 0.6, gate: 0.5, volume: 0.5, pan: 0.25, reverb: 0.2 },
            picking: { instrument: 'guitar', mode: 'arp', from: 'A3', brightness: 0.55, volume: 0.45, pan: -0.3, reverb: 0.25 },
            bass: { instrument: 'pluck', mode: 'bass', octave: 2, brightness: 0.35, sustain: 0.994, release: 0.08, volume: 1, gate: 0.7 },
            drums: { instrument: 'drums', kit: 'soft', mode: 'drums', volume: 0.7, cutoff: 8000, levels: { clap: 0.5, rim: 0.4, kick: 0.6 } }
        },
        sections: {
            // イントロ：ギターと手拍子だけで、E で止める
            intro: {
                label: 'イントロ',
                chords: 'Am | G | F | E',
                guitar: RASGUEO,
                drums: { clap: repeat('....x..x....x...', 3, '|') + '|....x.x.x.x.xxxx' }
            },
            A: {
                chords: CHORDS_A,
                lead: THEME,
                guitar: RASGUEO,
                bass: BASS,
                drums: PALMAS
            },
            // A'：もう1本のギターが分散和音で絡む
            A2: {
                label: "A'",
                chords: CHORDS_A,
                lead: THEME,
                picking: '0:2 1 2 3 2 1 2 1',
                guitar: RASGUEO,
                bass: BASS,
                drums: PALMAS_FILL
            },
            // B：Dm へ寄って、高く。E で戻る
            B: {
                chords: 'Dm | Am | Dm | E | Dm | Am | F | E',
                lead: `F5:4 A5:4 D6:8 | C6:6 B5:2 A5:8 | D6:4 C6:4 A5:8 | G#5:6 B5:2 E6:8 |
                       A5:4 D6:4 F6:8 | E6:6 C6:2 A5:8 | C6:4 A5:4 F5:8 | E5:6 F5:2 G#5:8`,
                guitar: RASGUEO,
                picking: '0:2 1 2 3 2 1 2 1',
                bass: BASS,
                drums: PALMAS_FILL
            },
            // 休憩：主旋律を抜き、バイオリンが歌う。ギターは4分に
            C: {
                chords: CHORDS_A,
                violin: 'A4:16 | B4:16 | C5:16 | B4:16 | A4:16 | G4:16 | A4:16 | G#4:16',
                guitar: 'x---x---x---x---',
                bass: 'R:16',
                drums: { clap: repeat('....x.......x...', 7, '|') + '|....x.x.x.x.xxxx' }
            }
        },
        intro: ['intro'],
        loop: ['A', 'A2', 'B', 'C']
    };

    SoundKit.register('catalog', { songs: { flamenco } });
})();
