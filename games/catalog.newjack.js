/**
 * 曲の一覧：ネオン街のステップ（ニュージャックスウィング・イ短調で、おしゃれに跳ねる）
 * ハイハットが16分で跳ね（16分で動くのはこれだけ）、スネアと手拍子を重ねて2・4拍を鋭く打つ
 * シンセブラスが拍の裏で短い和音を「チャッ」と切り、シンセベースが跳ねる音型で歌う
 * A' からパッドを敷き、B はニ短調の方へ巡る。休憩の C はピアノを抜き、柔らかいシンセがひとりで歌う
 * 最後の A' はベルが主題に答え、E7 で頭の Am7 へ戻る
 */
(function () {
    const { repeat } = SoundKit;

    // A の主題：拍の頭を休んで、跳ねるように
    const THEME = `r:2 E5:2 G5:2 A5:4 C6:2 A5:4 | F#5:4 r:2 E5:2 D5:4 A5:4 |
                   r:2 A5:2 C6:2 A5:4 G5:2 E5:4 | G#5:6 B5:2 D6:4 B5:4 |
                   r:2 E5:2 G5:2 A5:4 B5:2 C6:4 | A5:6 F#5:2 E5:4 D5:4 |
                   C6:4 A5:4 B5:4 D6:4 | B5:8 G#5:4 E5:4`;
    const CHORDS_A = 'Am7 | D9 | Fmaj7 | E7 | Am7 | D9 | Fmaj7:8 G:8 | E7';
    // 最後の A' のベル：主題が伸ばしている所に答える
    const BELL_A = `r:16 | r:12 C6:2 A5:2 | r:16 | r:12 E6:4 |
                    r:16 | r:12 C6:2 D6:2 | r:16 | r:8 E6:2 D6:2 B5:4`;

    // B：ニ短調の方へ巡り、E7 で次へ
    const CHORDS_B = 'Dm7 | G7 | Cmaj7 | Am7 | Dm7 | G7 | Bm7b5:8 E7:8 | E7';
    const SONG_B = `F5:2 A5:2 C6:4 r:2 A5:2 F5:4 | B5:6 A5:2 G5:4 D5:4 | E5:2 G5:2 B5:4 r:2 C6:2 G5:4 | A5:12 r:4 |
                    F5:2 A5:2 D6:4 r:2 C6:2 A5:4 | B5:6 D6:2 F5:8 | D5:4 F5:4 G#5:4 B5:4 | D6:8 B5:4 G#5:4`;

    // 休憩：柔らかいシンセがひとりで歌う。E7 で最後の A' へ
    const CHORDS_C = 'Am7 | D9 | Am7 | D9 | Fmaj7 | G | E7sus4:8 E7:8 | E7';
    const SOLO_C = `E5:8 G5:8 | F#5:12 A5:4 | C6:8 G5:8 | A5:8 F#5:8 |
                    A5:8 C6:8 | B5:8 D6:8 | A5:8 G#5:8 | B5:12 r:4`;

    // シンセブラスの短い和音：拍の裏で切る
    const STAB = '..x..x....x..x..';
    // 跳ねるベース：根音を食って、5度・7度で上る
    const BASS = 'R:3 R:3 R:2 r:2 5:2 7 R+';
    const KICK = repeat('x.....x.x.......', 8, '|');
    const SNARE = repeat('....x.......x...', 8, '|');
    // 16分で跳ねるハイハット
    const HAT = repeat('xoxoxoxoxoxoxoxo', 8, '|');
    const DRUMS = { kick: KICK, snare: SNARE, clap: SNARE, hat: HAT };
    const DRUMS_B = { ...DRUMS, openHat: repeat('..............x.', 8, '|'), crash: 'x...............|' + repeat('................', 7, '|') };

    // ニュージャックスウィング：跳ねる16分のハイハット、鋭いスネア、シンセの短い和音
    const newjack = {
        title: 'ネオン街のステップ',
        tags: ['おしゃれ', '軽快'],
        genre: 'ファンク・ソウル',
        melody: ['lead'],
        bpm: 104,
        swing: 0.15,
        swingUnit: 1,
        gain: 0.1,
        reverb: { seconds: 1.5, tone: 0.5 },
        delay: { time: 0.75, feedback: 0.22, tone: 2400, reverb: 0.2 },
        humanize: { time: 0.003, velocity: 0.08 },
        parts: {
            lead: { instrument: 'piano', volume: 0.52, pan: -0.08, decay: 0.7, brightness: 0.9, reverb: 0.18, delay: 0.1 },
            // 休憩の C で歌うシンセ
            solo: { instrument: 'softLead', volume: 0.6, pan: 0.15, cutoff: 2000, vibrato: 10, attack: 0.04, release: 0.3, reverb: 0.3, delay: 0.25 },
            bell: { instrument: 'bell', volume: 0.25, pan: 0.35, decay: 1.4, reverb: 0.35, delay: 0.25 },
            // シンセブラスの短い和音
            stab: { instrument: 'brass', mode: 'chords', center: 'E4', voices: 3, gate: 0.4, volume: 0.95, pan: 0.25, brightness: 4, attack: 0.01, release: 0.06, vibrato: 0, reverb: 0.2 },
            pad: { instrument: 'pad', mode: 'chords', center: 'E4', voices: 3, volume: 0.35, cutoff: 1200, pan: -0.2, reverb: 0.45 },
            bass: { instrument: 'synthBass', mode: 'bass', octave: 2, cutoff: 400, envelope: 3, decay: 0.25, sustain: 0.4, release: 0.05, gate: 0.7, volume: 0.65 },
            drums: { instrument: 'drums', kit: 'soft', mode: 'drums', volume: 0.6, cutoff: 8500, levels: { kick: 0.7, snare: 0.5, clap: 0.4, hat: 0.4, openHat: 0.35, crash: 0.35 } }
        },
        sections: {
            // イントロ：ハイハットとシンセブラスから、ベースとキックが入る。E7 で主題へ
            intro: {
                label: 'イントロ',
                chords: 'Am7 | D9 | Fmaj7 | E7',
                stab: STAB,
                bass: BASS,
                drums: {
                    hat: repeat('xoxoxoxoxoxoxoxo', 4, '|'),
                    kick: '................|' + repeat('x.....x.x.......', 3, '|'),
                    snare: '................|' + repeat('....x.......x...', 2, '|') + '|....x.......x.x.'
                }
            },
            A: {
                chords: CHORDS_A,
                lead: THEME,
                stab: STAB,
                bass: BASS,
                drums: DRUMS
            },
            // A'：パッドを敷く
            A2: {
                label: "A'",
                chords: CHORDS_A,
                lead: THEME,
                stab: STAB,
                pad: 'hold',
                bass: BASS,
                drums: DRUMS
            },
            // B：ニ短調の方へ巡る。小節の終わりでハイハットを開く
            B: {
                chords: CHORDS_B,
                lead: SONG_B,
                stab: STAB,
                pad: 'hold',
                bass: BASS,
                drums: DRUMS_B
            },
            // 休憩：ピアノを抜き、シンセが歌う。和音は小節の頭だけ、スネアを抜く
            C: {
                chords: CHORDS_C,
                solo: SOLO_C,
                stab: 'x...............',
                pad: 'hold',
                bass: 'R:6 R:2 r:4 5:4',
                drums: { kick: repeat('x.........x.....', 8, '|'), hat: HAT, clap: repeat('................', 7, '|') + '|....x.......x.x.' }
            },
            // 最後の A'：ベルが答える。E7 で頭の Am7 へ戻る
            A3: {
                label: "A'",
                chords: CHORDS_A,
                lead: THEME,
                bell: BELL_A,
                stab: STAB,
                pad: 'hold',
                bass: BASS,
                drums: DRUMS
            }
        },
        intro: ['intro'],
        loop: ['A', 'A2', 'B', 'C', 'A3']
    };

    SoundKit.register('catalog', { songs: { newjack } });
})();
