/**
 * 曲の一覧：地下のビバップ・クラブ（ジャズ・ヘ長調の速いスウィングで、AABA の32小節を回す）
 * 和音が2拍ずつ変わる循環の進行の上で、ピアノが休符をはさんで跳ねる主題を弾き、ブラスがサックスのつもりで重なる
 * ベースは4分で歩き、ブラシのキットのライドが「チーン・チキ」と刻む。ギターは4つ切りで和音を刻む
 * サビの B は A7 から属七を巡り、ブラスが短く合いの手を入れる。休憩の C は12小節のブルースで、ピアノを抜いてギターが歌う
 */
(function () {
    const { repeat } = SoundKit;

    // A の主題（8小節）。2拍ごとに変わる和音の上で、休符をはさんで跳ねる
    const THEME = `C6:4 A5:4 r:4 F#5:2 A5:2 | Bb5:4 D6:4 r:4 E5:4 | F5:6 G5:2 A5:4 C6:4 | D6:6 r:2 E5:2 G5:2 Bb5:4 |
                   A5:4 C6:4 r:2 Eb6:2 C6:4 | D6:6 Bb5:2 Db6:6 r:2 | C6:6 A5:2 F#5:4 A5:4 | G5:6 r:2 E5:2 G5:2 Bb5:4`;
    const CHORDS_A = 'F6:8 D7:8 | Gm7:8 C7:8 | F6:8 D7:8 | Gm7:8 C7:8 | F6:8 F7:8 | Bb:8 Bbm6:8 | Am7:8 D7:8 | Gm7:8 C7:8';

    // サビの B：A7 から属七を巡り、C7 で A へ戻る
    const CHORDS_B = 'A7 | A7 | D7 | D7 | G7 | G7 | C7 | C7';
    const SONG_B = `E5:4 G5:2 A5:2 C#6:8 | r:4 B5:2 A5:2 G5:4 E5:4 | F#5:4 A5:4 C6:8 | r:4 A5:2 F#5:2 E5:4 D5:4 |
                    D6:4 B5:4 G5:8 | r:4 F5:2 G5:2 A5:4 B5:4 | Bb5:4 G5:2 E5:2 C5:8 | r:4 D5:2 E5:2 G5:4 Bb5:4`;
    // サビのブラスの合いの手：主題が休む小節の頭で、短く
    const STAB_B = 'r:16 | [G4,C#5,E5]:2 r:14 | r:16 | [F#4,A4,C5]:2 r:14 | r:16 | [F4,B4,D5]:2 r:14 | r:16 | [E4,G4,Bb4]:2 r:14';

    // 休憩：12小節のブルース。ギターが歌い、C7 でサビへ
    const CHORDS_C = 'F7 | Bb7 | F7 | F7 | Bb7 | Bb7 | F7 | D7 | Gm7 | C7 | F7:8 D7:8 | Gm7:8 C7:8';
    const SOLO_C = `A5:8 C6:8 | D6:8 Ab5:8 | F5:8 A5:8 | C6:12 r:4 | D6:8 F5:8 | Ab5:12 r:4 |
                    A5:8 C6:8 | F#5:8 A5:8 | Bb5:8 D6:8 | E5:8 G5:8 | A5:8 F#5:8 | G5:8 E5:8`;

    // ギターは4つ切り、ベースは4分で歩く
    const COMP = 'x...x...x...x...';
    const WALK_A = 'R:4 3:4 R:4 5:4';
    const WALK = 'R:4 3:4 5:4 6:4';
    const RIDE = repeat('x...x.x.x...x.x.', 8, '|');
    const HAT = repeat('....x.......x...', 8, '|');
    const DRUMS = { ride: RIDE, hat: HAT };
    const DRUMS_FULL = { ...DRUMS, kick: repeat('x...............', 8, '|'), snare: repeat('..........o.....', 8, '|') };

    // ビバップ：ピアノとブラスのユニゾン、歩くベースとライド
    const bebop = {
        title: '地下のビバップ・クラブ',
        tags: ['おしゃれ', '軽快'],
        genre: 'ジャズ・ブルース',
        melody: ['lead'],
        bpm: 168,
        swing: 0.15,
        swingUnit: 2,
        gain: 0.1,
        reverb: { seconds: 1.6, tone: 0.5 },
        delay: { time: 0.75, feedback: 0.18, tone: 2200, reverb: 0.2 },
        humanize: { time: 0.006, velocity: 0.1 },
        parts: {
            lead: { instrument: 'piano', volume: 0.52, pan: -0.08, decay: 0.7, brightness: 0.9, reverb: 0.18, delay: 0.06 },
            // サックスのつもり：主題に重ねるブラス
            sax: { instrument: 'brass', volume: 0.6, pan: 0.15, brightness: 3, release: 0.08, reverb: 0.2, delay: 0.08 },
            // サビの合いの手：ブラスの短い和音
            stab: { instrument: 'brass', volume: 0.7, pan: 0.3, brightness: 3.5, release: 0.06, gate: 0.6, reverb: 0.2 },
            // 休憩の C で歌うギター
            solo: { instrument: 'guitar', volume: 1.6, pan: 0.15, brightness: 0.6, reverb: 0.3, delay: 0.12 },
            // 4つ切りのギター
            comp: { instrument: 'guitar', mode: 'chords', center: 'D4', voices: 3, strum: 0.01, gate: 0.3, brightness: 0.5, volume: 0.75, pan: -0.25, reverb: 0.15 },
            bass: { instrument: 'pluck', mode: 'bass', octave: 2, brightness: 0.4, volume: 0.85 },
            drums: { instrument: 'drums', kit: 'brush', mode: 'drums', volume: 2, cutoff: 8000, levels: { ride: 0.5, hat: 0.5, kick: 0.4, snare: 0.4, swish: 0.6 } }
        },
        sections: {
            // イントロ：ベースとライドで回り、最後にブラスが鳴って主題へ
            intro: {
                label: 'イントロ',
                chords: 'F6:8 D7:8 | Gm7:8 C7:8 | F6:8 D7:8 | Gm7:8 C7:8',
                comp: '................|................|' + repeat(COMP, 2, '|'),
                bass: WALK_A,
                stab: 'r:16 | r:16 | r:16 | r:8 [E4,G4,Bb4]:2 r:2 [E4,G4,Bb4]:2 r:2',
                drums: { ride: repeat('x...x.x.x...x.x.', 4, '|'), hat: repeat('....x.......x...', 4, '|') }
            },
            A: {
                chords: CHORDS_A,
                lead: THEME,
                comp: COMP,
                bass: WALK_A,
                drums: DRUMS
            },
            // A'：ブラスが主題に重なる
            A2: {
                label: "A'",
                chords: CHORDS_A,
                lead: THEME,
                sax: THEME,
                comp: COMP,
                bass: WALK_A,
                drums: DRUMS_FULL
            },
            // サビ：属七を巡り、ブラスが合いの手を入れる
            B: {
                chords: CHORDS_B,
                lead: SONG_B,
                stab: STAB_B,
                comp: COMP,
                bass: WALK,
                drums: DRUMS_FULL
            },
            // A：ブラスが重なり、休憩へ
            A3: {
                label: 'A',
                chords: CHORDS_A,
                lead: THEME,
                sax: THEME,
                comp: COMP,
                bass: WALK_A,
                drums: DRUMS_FULL
            },
            // 休憩：12小節のブルース。ピアノとブラスを抜き、ギターが歌う。ブラシをこする
            C: {
                chords: CHORDS_C,
                solo: SOLO_C,
                comp: 'x.......x.......',
                bass: WALK_A,
                drums: { swish: repeat('x.......x.......', 12, '|'), hat: repeat('....x.......x...', 12, '|') }
            },
            // 最後のサビ：ブラスが主題に重なり、合いの手も入る
            B2: {
                label: "B'",
                chords: CHORDS_B,
                lead: SONG_B,
                sax: SONG_B,
                stab: STAB_B,
                comp: COMP,
                bass: WALK,
                drums: DRUMS_FULL
            },
            // 最後の A：ブラスが重なり、Gm7・C7 で頭の F へ戻る
            A4: {
                label: 'A',
                chords: CHORDS_A,
                lead: THEME,
                sax: THEME,
                comp: COMP,
                bass: WALK_A,
                drums: DRUMS_FULL
            }
        },
        intro: ['intro'],
        loop: ['A', 'A2', 'B', 'A3', 'C', 'B2', 'A4']
    };

    SoundKit.register('catalog', { songs: { bebop } });
})();
