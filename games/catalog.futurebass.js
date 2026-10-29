/**
 * 曲の一覧：パステル色の空（フューチャーベース・ヘ長調で、明るく、ゆったり跳ねる）
 * ドラムはハーフタイムで、キックが1拍、スネアと手拍子が3拍を打つ。16分で動くパートは置かない
 * パッドの和音を8分で強く・弱くと刻み、揺れるように鳴らす。高いシンセが、主題の伸ばしに短く答える
 * A はパッドを2分で軽く、A' から8分の刻みに。B は Bbmaj7 から開いて高く歌う
 * 休憩の C はピアノとスネアを抜き、柔らかいシンセがひとりで歌う。どの区間も C で終わり、頭の Dm7 へ戻る
 */
(function () {
    const { repeat } = SoundKit;

    // A の主題（Dm7 → Bbadd9 → F → C を2回）
    const THEME = `A5:4 F5:2 A5:2 C6:4 A5:4 | D6:6 C6:2 Bb5:4 F5:4 | A5:4 C6:4 F5:4 G5:2 A5:2 | G5:8 E5:4 C5:4 |
                   A5:4 F5:2 A5:2 D6:4 C6:4 | Bb5:6 A5:2 F5:8 | G5:4 Bb5:4 D6:4 F5:4 | E5:8 G5:4 C6:4`;
    const CHORDS_A = 'Dm7 | Bbadd9 | F | C | Dm7 | Bbadd9 | Gm7 | C';
    // 高いシンセの合いの手：主題が伸ばしている所に答える
    const ANSWER_A = 'r:16 | r:16 | r:16 | r:8 E6:2 D6:2 C6:4 | r:16 | r:8 D6:2 F6:2 D6:4 | r:16 | r:16';

    // B：Bbmaj7 から開いて、高く歌う。C で次へ
    const CHORDS_B = 'Bbmaj7 | C | Am7 | Dm7 | Gm7 | Am7 | Bbmaj7 | C';
    const SONG_B = `D6:8 C6:4 Bb5:4 | C6:6 G5:2 E5:8 | E5:4 A5:4 C6:6 B5:2 | A5:12 r:4 |
                    Bb5:4 D6:4 F5:4 G5:4 | C6:6 A5:2 E5:8 | F5:4 Bb5:4 D6:4 C6:4 | C6:8 G5:4 E5:4`;
    const ANSWER_B = 'r:16 | r:8 G5:2 C6:2 E6:4 | r:16 | r:8 C6:2 D6:2 F6:4 | r:16 | r:8 A5:2 C6:2 E6:4 | r:16 | r:16';

    // 休憩：柔らかいシンセがひとりで歌う。C で A へ
    const CHORDS_C = 'Bbmaj7 | Bbmaj7 | F/A | F/A | Gm7 | Gm7 | Csus4 | C';
    const SOLO_C = `D5:8 F5:8 | A5:16 | C6:8 A5:8 | F5:16 |
                    G5:8 Bb5:8 | D6:12 C6:4 | F5:8 G5:8 | E5:16`;

    // パッドの刻み：8分で強く・弱くと揺らす
    const PULSE = 'X-o-x-o-X-o-x-o-';
    const HALF = 'X-------x-------';
    // ハーフタイムのドラム
    const KICK = repeat('x.........x.....', 8, '|');
    const SNARE = repeat('........x.......', 8, '|');
    const HAT = repeat('x.x.x.x.x.x.x.x.', 8, '|');
    const FILL = repeat('................', 7, '|') + '|........x.x.x.x.';
    const DRUMS_A = { kick: KICK, snare: SNARE, hat: HAT };
    const DRUMS_A2 = { kick: KICK, snare: SNARE, clap: FILL, hat: HAT };
    const DRUMS_B = { kick: KICK, snare: SNARE, clap: SNARE, hat: HAT, openHat: repeat('......x.......x.', 8, '|'), crash: 'x...............|' + repeat('................', 7, '|') };

    // フューチャーベース：揺れるパッドの和音、ハーフタイムのドラム、高いシンセの合いの手
    const futurebass = {
        title: 'パステル色の空',
        tags: ['明るい'],
        genre: 'エレクトロ',
        melody: ['lead'],
        bpm: 140,
        gain: 0.1,
        reverb: { seconds: 2.2, tone: 0.55 },
        delay: { time: 0.75, feedback: 0.3, tone: 2600, reverb: 0.25 },
        humanize: { time: 0.002, velocity: 0.04 },
        parts: {
            lead: { instrument: 'piano', volume: 0.52, pan: -0.08, decay: 0.8, brightness: 0.9, reverb: 0.22, delay: 0.12 },
            // 休憩の C で歌うシンセ
            solo: { instrument: 'softLead', volume: 0.6, pan: 0.1, cutoff: 2200, vibrato: 10, attack: 0.05, release: 0.35, reverb: 0.4, delay: 0.3 },
            // 高いシンセの合いの手
            answer: { instrument: 'softLead', volume: 0.5, pan: 0.3, cutoff: 3000, vibrato: 0, attack: 0.005, release: 0.08, gate: 0.7, reverb: 0.35, delay: 0.35 },
            // 揺れるパッドの和音
            pad: { instrument: 'pad', mode: 'chords', center: 'D4', voices: 4, volume: 0.35, cutoff: 2000, attack: 0.01, release: 0.15, pan: -0.15, reverb: 0.35 },
            bass: { instrument: 'synthBass', mode: 'bass', octave: 2, cutoff: 260, decay: 1.2, sustain: 0.8, release: 0.3, volume: 0.3 },
            drums: { instrument: 'drums', kit: 'soft', mode: 'drums', volume: 0.7, cutoff: 8000, levels: { kick: 0.75, snare: 0.5, clap: 0.45, hat: 0.4, openHat: 0.35, crash: 0.35 } }
        },
        sections: {
            // イントロ：パッドとベース、合いの手から、ドラムが入る。C で主題へ
            intro: {
                label: 'イントロ',
                chords: 'Dm7 | Bbadd9 | F | C',
                pad: HALF,
                answer: 'r:16 | r:8 D6:2 F6:2 D6:4 | r:16 | r:8 E6:2 D6:2 C6:4',
                bass: 'R:16',
                drums: {
                    hat: '................|................|' + repeat('x.x.x.x.x.x.x.x.', 2, '|'),
                    kick: '................|................|x.........x.....|x.........x.....',
                    snare: '................|................|........x.......|........x.x.x.x.'
                }
            },
            // A：パッドは2分で軽く
            A: {
                chords: CHORDS_A,
                lead: THEME,
                pad: HALF,
                bass: 'R:16',
                drums: DRUMS_A
            },
            // A'：パッドを8分で揺らし、合いの手が答える
            A2: {
                label: "A'",
                chords: CHORDS_A,
                lead: THEME,
                answer: ANSWER_A,
                pad: PULSE,
                bass: 'R:16',
                drums: DRUMS_A2
            },
            // B：Bbmaj7 から開いて高く歌う。手拍子を重ねる
            B: {
                chords: CHORDS_B,
                lead: SONG_B,
                answer: ANSWER_B,
                pad: PULSE,
                bass: 'R:8 R:8',
                drums: DRUMS_B
            },
            // 休憩：ピアノとスネアを抜き、シンセが歌う。パッドは2分にゆるめる
            C: {
                chords: CHORDS_C,
                solo: SOLO_C,
                pad: HALF,
                bass: 'R:16',
                drums: { kick: KICK, hat: repeat('x...x...x...x...', 8, '|'), snare: FILL }
            },
            // A'：合いの手と揺れるパッド
            A3: {
                label: "A'",
                chords: CHORDS_A,
                lead: THEME,
                answer: ANSWER_A,
                pad: PULSE,
                bass: 'R:16',
                drums: DRUMS_A2
            },
            // 最後の B'：C で頭の Dm7 へ戻る
            B2: {
                label: "B'",
                chords: CHORDS_B,
                lead: SONG_B,
                answer: ANSWER_B,
                pad: PULSE,
                bass: 'R:8 R:8',
                drums: DRUMS_B
            }
        },
        intro: ['intro'],
        loop: ['A', 'A2', 'B', 'C', 'A3', 'B2']
    };

    SoundKit.register('catalog', { songs: { futurebass } });
})();
