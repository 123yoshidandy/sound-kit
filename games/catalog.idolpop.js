/**
 * 曲の一覧：きらめきステージ（アイドルポップ・ハ長調からニ長調へ、明るく弾む）
 * シンセが分散和音を転がし、ベルがきらきらと答える。ベースはオクターブを8分で跳ねる
 * A は8分の分散和音と、キック・スネアで軽く。サビの B は4つ打ちになり、分散和音が16分に上がって、パッドを敷く
 * 休憩の C はピアノを抜き、柔らかいシンセがひとりで歌う。B' の終わりを A7 で止めて、最後のサビ B'' は全音上のニ長調で盛り上げる
 * 最後の小節は Dm7 → G7 で、頭のハ長調へ戻る
 */
(function () {
    const { repeat } = SoundKit;

    // A の主題（Aメロ）
    const THEME = `E5:2 G5:2 C6:4 B5:2 C6:2 G5:4 | D5:2 G5:2 B5:4 A5:2 B5:2 D6:4 | C6:6 B5:2 A5:4 E5:4 | G5:8 E5:4 B4:4 |
                   A5:2 C6:2 F5:4 A5:2 C6:2 D6:4 | C6:6 B5:2 G5:8 | F5:4 A5:4 C6:4 D6:4 | B5:8 G5:4 D5:4`;
    const CHORDS_A = 'C | G/B | Am | Em | F | C/E | Dm7 | G';
    // A' のベル：伸ばしの終わりに、きらりと
    const BELL_A = 'r:16 | r:16 | r:16 | r:8 B5:2 E6:2 G6:4 | r:16 | r:16 | r:16 | r:8 G5:2 B5:2 D6:4';

    // B（サビ）：F から開く。前半7小節は B' でも同じ
    const SONG_B_HEAD = `C6:6 A5:2 F5:4 A5:4 | B5:6 D6:2 D6:4 B5:4 | D6:4 B5:4 G5:4 E5:4 | C6:8 A5:4 E5:4 |
                         F5:4 A5:4 D6:6 C6:2 | B5:4 G5:4 D6:8 | C6:4 E5:2 G5:2 C6:8`;
    const SONG_B = `${SONG_B_HEAD} | G5:12 r:4`;
    // B' の終わり：A7 で止めて、ニ長調のサビへ
    const SONG_B_TURN = `${SONG_B_HEAD} | C#6:4 A5:4 E5:4 G5:4`;
    const CHORDS_B_HEAD = 'F | G | Em7 | Am | Dm7 | G | C';
    const CHORDS_B = `${CHORDS_B_HEAD} | G`;
    const CHORDS_B_TURN = `${CHORDS_B_HEAD} | A7`;
    const BELL_B_HEAD = 'r:16 | r:16 | r:16 | r:8 E6:2 C6:2 E6:4 | r:16 | r:16 | r:12 E6:2 G6:2';
    const BELL_B = `${BELL_B_HEAD} | r:8 D6:2 B5:2 G5:2 D6:2`;
    const BELL_B_TURN = `${BELL_B_HEAD} | r:16`;

    // 最後のサビ B''：全音上のニ長調。Dm7 → G7 で頭の C へ
    const CHORDS_B3 = 'G | A | F#m7 | Bm | Em7 | A | D | Dm7:8 G7:8';
    const SONG_B3 = `D6:6 B5:2 G5:4 B5:4 | C#6:6 E6:2 E6:4 C#6:4 | E6:4 C#6:4 A5:4 F#5:4 | D6:8 B5:4 F#5:4 |
                     G5:4 B5:4 E6:6 D6:2 | C#6:4 A5:4 E6:8 | D6:4 F#5:2 A5:2 D6:8 | F5:4 A5:4 B5:4 D6:4`;
    const BELL_B3 = 'r:16 | r:16 | r:16 | r:8 F#6:2 D6:2 F#6:4 | r:16 | r:16 | r:12 F#6:2 D6:2 | r:16';

    // 休憩：柔らかいシンセがひとりで歌う。G で A へ
    const CHORDS_C = 'Am | F | C | G | Am | F | Dm7 | G';
    const SOLO_C = `E5:8 A5:8 | A5:8 C6:8 | G5:8 E5:8 | D5:12 G5:4 |
                    C6:8 A5:8 | A5:8 F5:8 | F5:8 A5:8 | B5:8 D6:8`;

    // 分散和音：A は8分、サビは16分（16分で動くのはこれだけ）
    const ARP8 = '0:2 1 2 3 2 1 2 1';
    const ARP16 = '0:1 1 2 3 2 1 2 3 0 1 2 3 2 1 2 1';
    const BASS_A = 'R:4 R:2 R:2 r:2 R:2 5:4';
    // サビのベースはオクターブを8分で跳ねる
    const BASS_B = 'R:2 R+ R R+ R R+ R R+';

    const KICK_A = repeat('x.......x.x.....', 8, '|');
    const SNARE = repeat('....x.......x...', 8, '|');
    const HAT = repeat('x.x.x.x.x.x.x.x.', 8, '|');
    const FOUR = repeat('x...x...x...x...', 8, '|');
    const OPEN = repeat('..x...x...x...x.', 8, '|');
    // 最後の小節でスネアを8分で打って、次の区間へ
    const FILL = repeat('................', 7, '|') + '|....x...x.x.x.x.';
    const DRUMS_A = { kick: KICK_A, snare: SNARE, hat: HAT };
    const DRUMS_A2 = { kick: KICK_A, snare: FILL, clap: SNARE, hat: HAT };
    const DRUMS_B = { kick: FOUR, clap: SNARE, openHat: OPEN, crash: 'x...............|' + repeat('................', 7, '|') };
    const DRUMS_B2 = { ...DRUMS_B, snare: FILL };

    // アイドルポップ：ベルとシンセの分散和音、4つ打ち、転調するサビ
    const idolpop = {
        title: 'きらめきステージ',
        tags: ['明るい', '軽快'],
        genre: 'ロック・ポップ',
        melody: ['lead'],
        bpm: 148,
        gain: 0.1,
        reverb: { seconds: 1.8, tone: 0.55 },
        delay: { time: 0.75, feedback: 0.25, tone: 2600, reverb: 0.2 },
        humanize: { time: 0.003, velocity: 0.06 },
        parts: {
            lead: { instrument: 'piano', volume: 0.52, pan: -0.08, decay: 0.7, brightness: 0.95, reverb: 0.2, delay: 0.1 },
            // 休憩の C で歌うシンセ
            solo: { instrument: 'softLead', volume: 0.6, pan: 0.15, cutoff: 2200, vibrato: 10, attack: 0.04, release: 0.3, reverb: 0.35, delay: 0.25 },
            // きらきらしたベル
            bell: { instrument: 'bell', volume: 0.25, pan: 0.35, decay: 1.6, reverb: 0.4, delay: 0.3 },
            arp: { instrument: 'softLead', mode: 'arp', from: 'C4', volume: 0.28, pan: -0.25, cutoff: 1900, attack: 0.005, release: 0.06, gate: 0.5, vibrato: 0, reverb: 0.2, delay: 0.25 },
            pad: { instrument: 'pad', mode: 'chords', center: 'E4', voices: 3, volume: 0.35, cutoff: 1300, pan: 0.2, reverb: 0.45 },
            bass: { instrument: 'synthBass', mode: 'bass', octave: 2, cutoff: 450, envelope: 2.5, decay: 0.2, sustain: 0.4, release: 0.04, gate: 0.6, volume: 0.65 },
            drums: { instrument: 'drums', kit: 'soft', mode: 'drums', volume: 0.7, cutoff: 8000, levels: { kick: 0.65, snare: 0.45, clap: 0.45, hat: 0.45, openHat: 0.4, crash: 0.35 } }
        },
        sections: {
            // イントロ：分散和音とベルから、ベースとキックが入る。G で主題へ
            intro: {
                label: 'イントロ',
                chords: 'C | Am | F | G',
                arp: ARP8,
                bell: 'E6:4 r:12 | C6:4 r:12 | A5:4 r:4 C6:2 F6:2 r:4 | D6:4 r:4 G5:2 B5:2 D6:4',
                bass: BASS_A,
                drums: {
                    hat: repeat('x.x.x.x.x.x.x.x.', 4, '|'),
                    kick: '................|................|' + repeat('x.......x.x.....', 2, '|'),
                    snare: '................|................|................|....x...x.x.x.x.'
                }
            },
            A: {
                chords: CHORDS_A,
                lead: THEME,
                arp: ARP8,
                bass: BASS_A,
                drums: DRUMS_A
            },
            // A'：手拍子とパッドが入り、スネアを8分にしてサビへ
            A2: {
                label: "A'",
                chords: CHORDS_A,
                lead: THEME,
                arp: ARP8,
                pad: 'hold',
                bass: BASS_A,
                drums: DRUMS_A2
            },
            // B（サビ）：4つ打ちになり、分散和音が16分に上がる。ベルが答える
            B: {
                chords: CHORDS_B,
                lead: SONG_B,
                bell: BELL_B,
                arp: ARP16,
                pad: 'hold',
                bass: BASS_B,
                drums: DRUMS_B
            },
            // 休憩：ピアノを抜き、シンセが歌う。分散和音は4分にゆるめ、キックを抜く
            C: {
                chords: CHORDS_C,
                solo: SOLO_C,
                arp: '0:4 1 2 1',
                pad: 'hold',
                bass: 'R:8 5:8',
                drums: { hat: repeat('x...x...x...x...', 8, '|'), clap: repeat('................', 4, '|') + '|' + repeat('....x.......x...', 3, '|') + '|....x...x.x.x.x.' }
            },
            // A'：ベルがきらりと答える
            A3: {
                label: "A'",
                chords: CHORDS_A,
                lead: THEME,
                bell: BELL_A,
                arp: ARP8,
                pad: 'hold',
                bass: BASS_A,
                drums: DRUMS_A2
            },
            // B'：A7 で止めて、ニ長調へ
            B2: {
                label: "B'",
                chords: CHORDS_B_TURN,
                lead: SONG_B_TURN,
                bell: BELL_B_TURN,
                arp: ARP16,
                pad: 'hold',
                bass: BASS_B,
                drums: DRUMS_B2
            },
            // 最後のサビ B''：全音上のニ長調。Dm7 → G7 で頭の C へ戻る
            B3: {
                label: "B''",
                chords: CHORDS_B3,
                lead: SONG_B3,
                bell: BELL_B3,
                arp: ARP16,
                pad: 'hold',
                bass: BASS_B,
                drums: DRUMS_B
            }
        },
        intro: ['intro'],
        loop: ['A', 'A2', 'B', 'C', 'A3', 'B2', 'B3']
    };

    SoundKit.register('catalog', { songs: { idolpop } });
})();
