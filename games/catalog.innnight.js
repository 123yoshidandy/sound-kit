/**
 * 曲の一覧：宿屋の灯りと夜更け（ゲーム音楽・ヘ長調の3拍子で、ゆっくり、あたたかく）
 * ピアノの主題は4分の上りと付点のため息で、旅の疲れをほどくように歌う。ギターが8分で和音を柔らかくつま弾く
 * A' から、暖炉のぬくもりのようなパッドが和音を敷く。B は変ロ長調の方へ広がり、ベースが3拍目に5度を足す。ドラムは入れない
 * 休憩の C はピアノを抜き、弦が低くゆっくり歌う。最後の A' はフルートが主題にそっと重なり、C7 で頭の F へ戻る
 */
(function () {
    // A の主題（前半4小節は A' でも同じ）
    const THEME_HEAD = `C5:4 F5:4 A5:4 | C6:8 A5:4 | D6:6 C6:2 Bb5:4 | A5:12`;
    const THEME = `${THEME_HEAD} | F5:4 A5:4 D6:4 | Bb5:6 A5:2 G5:4 | G5:4 E5:4 Bb5:4 | F5:8 r:4`;
    // A' の後半：F/C から C7 へ、次へ渡す
    const THEME_TURN = `${THEME_HEAD} | F5:4 A5:4 D6:4 | C6:6 Bb5:2 A5:4 | A5:6 G5:2 F5:4 | E5:4 G5:4 Bb5:4`;
    const CHORDS_A = 'F | Am | Bb | F | Dm | Gm7 | C7 | F';
    const CHORDS_A2 = 'F | Am | Bb | F | Dm | Gm7 | F/C | C7';

    // B：変ロ長調の方へ広がり、C7 で休憩へ
    const CHORDS_B = 'Bb | C | Am | Dm | Gm7 | C | F/A | C7';
    const SONG_B = `F5:4 Bb5:4 D6:4 | C6:8 G5:4 | E5:4 A5:4 C6:4 | D6:8 A5:4 |
                    Bb5:4 D6:4 F5:4 | E5:8 G5:4 | A5:6 C6:2 F5:4 | G5:4 Bb5:4 C6:4`;

    // 休憩：弦が低くゆっくり歌う。C7 で最後の A' へ
    const CHORDS_C = 'Dm | Bb | F | C | Dm | Bb | Gm7 | C7';
    const SOLO_C = `A4:6 D5:6 | D5:6 F5:6 | C5:12 | E5:6 G5:6 |
                    F5:6 A5:6 | F5:6 D5:6 | D5:6 Bb4:6 | C5:6 E5:6`;

    // ギターは8分のつま弾き。休憩では4分にゆるめる
    const ARP = '0:2 1 2 3 2 1';

    // 宿屋の夜：ピアノの主題、ギターのつま弾き、暖炉のようなパッド
    const innnight = {
        title: '宿屋の灯りと夜更け',
        tags: ['落ち着いた'],
        genre: 'ゲーム音楽',
        melody: ['lead'],
        bpm: 80,
        stepsPerBar: 12,
        gain: 0.12,
        reverb: { seconds: 2.8, tone: 0.45 },
        delay: { time: 0.75, feedback: 0.25, tone: 2000, reverb: 0.3 },
        humanize: { time: 0.01, velocity: 0.1 },
        parts: {
            lead: { instrument: 'piano', volume: 0.55, pan: -0.08, decay: 0.9, brightness: 0.7, reverb: 0.32, delay: 0.1 },
            // 休憩の C で歌う弦
            solo: { instrument: 'strings', volume: 1.0, pan: 0.15, attack: 0.3, release: 0.6, brightness: 0.7, vibrato: 9, reverb: 0.4 },
            // 最後の A' で主題にそっと重なるフルート
            unison: { instrument: 'flute', volume: 0.28, pan: 0.2, vibrato: 10, breath: 0.03, reverb: 0.35, delay: 0.12 },
            guitar: { instrument: 'guitar', mode: 'arp', from: 'F3', volume: 0.45, pan: 0.25, brightness: 0.45, reverb: 0.25 },
            // 暖炉のぬくもりのつもり：低めのパッド
            pad: { instrument: 'pad', mode: 'chords', center: 'C4', voices: 3, volume: 0.35, cutoff: 850, attack: 1.2, release: 1.8, pan: -0.15, reverb: 0.5 },
            // 柔らかい三角波のベース
            bass: { instrument: 'synthBass', mode: 'bass', octave: 2, wave: 'triangle', cutoff: 260, envelope: 0.4, decay: 0.8, sustain: 0.6, release: 0.5, volume: 0.3, gate: 0.95 }
        },
        sections: {
            // イントロ：パッドとギターから、C7 で主題へ
            intro: {
                label: 'イントロ',
                chords: 'F | Bb | Gm7 | C7',
                guitar: ARP,
                pad: 'hold',
                bass: 'R:12'
            },
            A: {
                chords: CHORDS_A,
                lead: THEME,
                guitar: ARP,
                bass: 'R:12'
            },
            // A'：パッドが和音を敷き、C7 で B へ
            A2: {
                label: "A'",
                chords: CHORDS_A2,
                lead: THEME_TURN,
                guitar: ARP,
                pad: 'hold',
                bass: 'R:12'
            },
            // B：変ロ長調の方へ広がる。ベースが3拍目に5度を足す
            B: {
                chords: CHORDS_B,
                lead: SONG_B,
                guitar: ARP,
                pad: 'hold',
                bass: 'R:8 5:4'
            },
            // 休憩：ピアノを抜き、弦が低く歌う。ギターは4分
            C: {
                chords: CHORDS_C,
                solo: SOLO_C,
                guitar: '0:4 1 2',
                pad: 'hold',
                bass: 'R:12'
            },
            // 最後の A'：フルートが主題に重なり、C7 で頭の F へ戻る
            A3: {
                label: "A'",
                chords: CHORDS_A2,
                lead: THEME_TURN,
                unison: THEME_TURN,
                guitar: ARP,
                pad: 'hold',
                bass: 'R:8 5:4'
            }
        },
        intro: ['intro'],
        loop: ['A', 'A2', 'B', 'C', 'A3']
    };

    SoundKit.register('catalog', { songs: { innnight } });
})();
