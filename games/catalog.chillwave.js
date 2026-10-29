/**
 * 曲の一覧：夏の終わりのカセット（チルウェイヴ・ト長調で、落ち着いて、おしゃれに）
 * ぼんやりしたパッドを低く敷き、エレピがまばらに和音を置く。ゆっくりした4つ打ちに、裏拍のシェイカー
 * ピアノの主題は深いリバーブとエコーで、遠くで鳴っているように。16分で動くパートは置かない
 * A' から手拍子、B はホ短調の方へ巡ってハイハットを開く。休憩の C はピアノとキックを抜き、フルートがひとりで歌う
 * 最後の A' は柔らかいシンセが主題に重なる。どの区間も D で終わり、頭の Gmaj7 へ戻る
 */
(function () {
    const { repeat } = SoundKit;

    // A の主題：音を少なく、ゆったりと
    const THEME = `D5:4 F#5:4 B5:6 A5:2 | A5:6 F#5:2 D5:8 | E5:4 G5:4 B5:8 | A5:8 F#5:4 E5:4 |
                   D5:4 A5:4 B5:4 D6:4 | D6:6 B5:2 F#5:8 | E5:4 A5:4 C6:6 B5:2 | A5:12 r:4`;
    const CHORDS_A = 'Gmaj7 | Bm7 | Cmaj7 | D | Gmaj7 | Bm7 | Am7 | D';

    // B：ホ短調の方へ巡り、D で次へ
    const CHORDS_B = 'Em7 | Cmaj7 | Gmaj7 | D/F# | Em7 | Cmaj7 | Am7 | D';
    const SONG_B = `G5:4 B5:4 D6:8 | G5:6 A5:2 E5:8 | D5:4 F#5:4 A5:4 B5:4 | A5:8 F#5:8 |
                    B5:4 E5:4 G5:4 B5:4 | D6:6 B5:2 G5:8 | C6:4 A5:4 E5:4 G5:4 | F#5:8 A5:8`;

    // 休憩：フルートがひとりで歌う。D で最後の A' へ
    const CHORDS_C = 'Cmaj7 | Bm7 | Am7 | D | Cmaj7 | Bm7 | Am7 | D7sus4:8 D:8';
    const SOLO_C = `E5:8 G5:8 | F#5:16 | E5:8 A5:8 | F#5:12 A5:4 |
                    G5:8 E5:8 | D5:8 F#5:8 | C6:8 A5:8 | G5:8 F#5:8`;

    // エレピはまばらに和音を置く
    const KEYS = 'x-------..x-----';
    const BASS = 'R:12 5:4';
    // ゆっくりした4つ打ちと、裏拍のシェイカー
    const KICK = repeat('x...x...x...x...', 8, '|');
    const SHAKER = repeat('..x...x...x...x.', 8, '|');
    const CLAP = repeat('....x.......x...', 8, '|');
    const DRUMS_A = { kick: KICK, shaker: SHAKER };
    const DRUMS_A2 = { kick: KICK, shaker: SHAKER, clap: CLAP };
    const DRUMS_B = { kick: KICK, shaker: SHAKER, clap: CLAP, openHat: repeat('..x...x...x...x.', 8, '|') };

    // チルウェイヴ：ぼんやりしたパッド、エレピ、ゆっくりした4つ打ち、遠い主題
    const chillwave = {
        title: '夏の終わりのカセット',
        tags: ['落ち着いた', 'おしゃれ'],
        genre: 'エレクトロ',
        melody: ['lead'],
        bpm: 96,
        gain: 0.105,
        reverb: { seconds: 3.2, tone: 0.4 },
        delay: { time: 0.75, feedback: 0.35, tone: 1800, reverb: 0.35 },
        humanize: { time: 0.004, velocity: 0.06 },
        parts: {
            lead: { instrument: 'piano', volume: 0.55, pan: -0.08, decay: 1, brightness: 0.75, reverb: 0.45, delay: 0.3 },
            // 休憩の C で歌うフルート
            solo: { instrument: 'flute', volume: 0.45, pan: 0.15, reverb: 0.5, delay: 0.3 },
            // 最後の A' で主題に重なる柔らかいシンセ
            unison: { instrument: 'softLead', volume: 0.35, pan: 0.2, cutoff: 1500, vibrato: 6, attack: 0.05, release: 0.4, reverb: 0.5, delay: 0.35 },
            keys: { instrument: 'epiano', mode: 'chords', center: 'D4', voices: 4, volume: 0.4, pan: 0.2, reverb: 0.4, delay: 0.2 },
            pad: { instrument: 'pad', mode: 'chords', center: 'B3', voices: 3, volume: 0.35, cutoff: 900, attack: 1.2, release: 1.5, pan: -0.2, reverb: 0.5 },
            bass: { instrument: 'synthBass', mode: 'bass', octave: 2, cutoff: 250, decay: 1.5, sustain: 0.8, release: 0.4, volume: 0.3 },
            drums: { instrument: 'drums', kit: 'soft', mode: 'drums', volume: 0.7, cutoff: 7000, levels: { kick: 0.6, clap: 0.35, shaker: 0.4, openHat: 0.3 } }
        },
        sections: {
            // イントロ：パッドとエレピ、ベースから、キックが入る。D で主題へ
            intro: {
                label: 'イントロ',
                chords: 'Gmaj7 | Em7 | Cmaj7 | D',
                pad: 'hold',
                keys: KEYS,
                bass: BASS,
                drums: {
                    shaker: repeat('..x...x...x...x.', 4, '|'),
                    kick: '................|................|' + repeat('x...x...x...x...', 2, '|')
                }
            },
            A: {
                chords: CHORDS_A,
                lead: THEME,
                pad: 'hold',
                keys: KEYS,
                bass: BASS,
                drums: DRUMS_A
            },
            // A'：手拍子が入る
            A2: {
                label: "A'",
                chords: CHORDS_A,
                lead: THEME,
                pad: 'hold',
                keys: KEYS,
                bass: BASS,
                drums: DRUMS_A2
            },
            // B：ホ短調の方へ巡り、ハイハットを開く
            B: {
                chords: CHORDS_B,
                lead: SONG_B,
                pad: 'hold',
                keys: KEYS,
                bass: BASS,
                drums: DRUMS_B
            },
            // 休憩：ピアノとキックを抜き、フルートが歌う。エレピは小節の頭だけ
            C: {
                chords: CHORDS_C,
                solo: SOLO_C,
                pad: 'hold',
                keys: 'x---------------',
                bass: 'R:16',
                drums: { shaker: SHAKER }
            },
            // 最後の A'：柔らかいシンセが主題に重なる。D で頭の Gmaj7 へ戻る
            A3: {
                label: "A'",
                chords: CHORDS_A,
                lead: THEME,
                unison: THEME,
                pad: 'hold',
                keys: KEYS,
                bass: BASS,
                drums: DRUMS_A2
            }
        },
        intro: ['intro'],
        loop: ['A', 'A2', 'B', 'C', 'A3']
    };

    SoundKit.register('catalog', { songs: { chillwave } });
})();
