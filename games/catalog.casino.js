/**
 * 曲の一覧：真夜中のカジノ・ビッグバンド（ジャズ・ブルース・ヘ長調の12小節ブルースで、軽快にスウィングする）
 * ピアノがブルースの主題を短く切って歌い、空いた所にブラスのセクションが「パッパラ」と合いの手を入れる
 * エレピはチャールストンのリズムで和音を置き、A' からベースが4分で歩いて、ライドが「チーン・チキ」と刻む
 * B はイ長調の7th から五度ずつ下りる橋渡しで、ブラスが裏で和音を吹く。休憩の C はピアノを抜き、フルートがひとりで歌う
 * どの区間も Gm7・C7 の回しで終え、頭の F7 へ戻る
 */
(function () {
    const { repeat } = SoundKit;

    // A の主題（12小節のブルース）。4小節目と8小節目を空けて、ブラスに渡す
    const THEME = `C5:2 D5:2 F5:4 A5:6 r:2 | Ab5:6 F5:2 D5:8 | C5:2 D5:2 F5:4 A5:4 C6:4 | C6:8 r:8 |
                   D5:2 F5:2 Ab5:4 Bb5:6 r:2 | Ab5:4 F5:4 D5:8 | C5:2 D5:2 F5:4 A5:4 F5:4 | F#5:8 r:8 |
                   G5:2 Bb5:2 D6:4 Bb5:4 G5:4 | E5:4 G5:4 Bb5:4 G5:4 | A5:4 F5:4 F#5:4 A5:4 | G5:4 Bb5:4 G5:4 E5:4`;
    const CHORDS_A = 'F7 | Bb7 | F7 | F7 | Bb7 | Bb7 | F7 | D7 | Gm7 | C7 | F7:8 D7:8 | Gm7:8 C7:8';

    // ブラスの合いの手：主題が空けた4・8小節目に答える
    const SHOUT_A = `r:16 | r:16 | r:16 | r:8 Eb5:2 D5:2 C5:4 |
                     r:16 | r:16 | r:16 | r:8 A4:2 C5:2 D5:4 |
                     r:16 | r:16 | r:16 | r:16`;

    // B：イ長調の7th から五度ずつ下りる橋渡し。C7 で休憩の F7 へ
    const CHORDS_B = 'A7 | A7 | D7 | D7 | G7 | G7 | C7 | C7';
    const SONG_B = `E5:4 G5:4 C#6:8 | A5:8 r:8 | F#5:4 A5:4 D6:8 | C6:8 r:8 |
                    B5:4 D6:4 G5:8 | F5:8 r:8 | E5:4 G5:4 Bb5:8 | G5:4 E5:4 C5:8`;
    const SHOUT_B = 'r:16 | r:8 C#5:2 E5:2 G5:4 | r:16 | r:8 F#5:2 A5:2 C6:4 | r:16 | r:8 B4:2 D5:2 F5:4 | r:16 | r:16';

    // 休憩：フルートがひとりで歌う。Gm7・C7 で最後の A へ
    const FLUTE_C = `A5:8 C6:8 | D6:8 Ab5:8 | A5:12 F5:4 | C6:16 |
                     D6:8 F5:8 | Ab5:8 F5:8 | A5:8 C6:8 | A5:8 F#5:8 |
                     G5:8 Bb5:8 | E5:8 G5:8 | A5:8 F#5:8 | G5:8 E5:8`;

    // エレピはチャールストン（1拍目と2拍目の裏）。ブラスの和音は2・4拍の裏で短く
    const COMP = 'x--...x-........';
    const STABS = '......x-......x-';
    const TWO_BEAT = 'R:8 5:8';
    const WALK = 'R:4 3:4 5:4 6:4';
    const SWISH = repeat('x.......x.......', 12, '|');
    const HAT = repeat('....x.......x...', 12, '|');
    const RIDE = repeat('x...x.x.x...x.x.', 12, '|');
    const KICK = repeat('x...............', 12, '|');
    // 12小節目の後半で、スネアがはずんで頭へ戻す
    const SNARE_FILL = repeat('................', 11, '|') + '|........o.x.o.x.';
    const DRUMS_A = { swish: SWISH, hat: HAT, kick: KICK };
    const DRUMS_SWING = { ride: RIDE, hat: HAT, kick: KICK, snare: SNARE_FILL };

    // カジノのビッグバンド：ピアノの主題と、ブラスのセクションの合いの手
    const casino = {
        title: '真夜中のカジノ・ビッグバンド',
        tags: ['おしゃれ', '軽快'],
        genre: 'ジャズ・ブルース',
        melody: ['lead'],
        bpm: 144,
        swing: 0.12,
        swingUnit: 2,
        gain: 0.12,
        reverb: { seconds: 1.8, tone: 0.5 },
        delay: { time: 0.75, feedback: 0.2, tone: 2200, reverb: 0.2 },
        humanize: { time: 0.005, velocity: 0.1 },
        parts: {
            lead: { instrument: 'piano', volume: 0.5, pan: -0.08, decay: 0.7, brightness: 0.85, reverb: 0.2, delay: 0.08 },
            // 休憩の C で歌うフルート
            flute: { instrument: 'flute', volume: 0.45, pan: 0.15, breath: 0.06, vibrato: 10, reverb: 0.3, delay: 0.15 },
            // ブラスのセクションの合いの手
            shout: { instrument: 'brass', volume: 0.7, pan: 0.3, brightness: 4, release: 0.1, reverb: 0.25 },
            // 裏拍で短く吹くブラスの和音
            stabs: { instrument: 'brass', mode: 'chords', center: 'F4', voices: 3, gate: 0.6, volume: 0.8, pan: 0.2, brightness: 3.5, release: 0.08, reverb: 0.2 },
            keys: { instrument: 'epiano', mode: 'chords', center: 'E4', voices: 3, volume: 0.38, pan: -0.22, warmth: 0.7, release: 0.2, reverb: 0.2 },
            // ウッドベースのつもり：三角波を丸く
            bass: { instrument: 'synthBass', mode: 'bass', octave: 2, wave: 'triangle', cutoff: 320, envelope: 0.6, decay: 0.4, sustain: 0.5, release: 0.08, volume: 0.46, gate: 0.85 },
            drums: { instrument: 'drums', kit: 'brush', mode: 'drums', volume: 2.1, cutoff: 8000, levels: { swish: 0.6, hat: 0.5, kick: 0.4, ride: 0.5, snare: 0.4 } }
        },
        sections: {
            // イントロ：ブラシとエレピから、ベースが歩き、ブラスが裏で吹いて C7 で主題へ
            intro: {
                label: 'イントロ',
                chords: 'Gm7 | C7 | Gm7 | C7',
                keys: COMP,
                stabs: '................|................|................|' + STABS,
                bass: { pattern: `r:16 | r:16 | ${WALK} | ${WALK}` },
                drums: { swish: repeat('x.......x.......', 4, '|'), hat: repeat('....x.......x...', 4, '|') }
            },
            A: {
                chords: CHORDS_A,
                lead: THEME,
                keys: COMP,
                bass: TWO_BEAT,
                drums: DRUMS_A
            },
            // A'：ブラスが合いの手を入れ、ベースが歩き、ライドが刻む
            A2: {
                label: "A'",
                chords: CHORDS_A,
                lead: THEME,
                shout: SHOUT_A,
                keys: COMP,
                bass: WALK,
                drums: DRUMS_SWING
            },
            // B：五度ずつ下りる橋渡し。ブラスが裏で吹き、空いた所に答える
            B: {
                chords: CHORDS_B,
                lead: SONG_B,
                shout: SHOUT_B,
                stabs: STABS,
                keys: COMP,
                bass: WALK,
                drums: { ride: repeat('x...x.x.x...x.x.', 8, '|'), hat: repeat('....x.......x...', 8, '|'), kick: repeat('x...............', 8, '|'), snare: repeat('................', 7, '|') + '|....o.x.o.x.xxxx' }
            },
            // 休憩：ピアノとブラスを抜き、フルートがひとりで歌う。エレピは2拍ずつ、ベースも2拍
            C: {
                chords: CHORDS_A,
                flute: FLUTE_C,
                keys: 'x-------x-------',
                bass: TWO_BEAT,
                drums: { swish: SWISH, hat: HAT }
            },
            // 最後の A：合いの手と裏拍のブラスがそろう。Gm7・C7 で頭の F7 へ戻る
            A3: {
                label: 'A',
                chords: CHORDS_A,
                lead: THEME,
                shout: SHOUT_A,
                stabs: STABS,
                keys: COMP,
                bass: WALK,
                drums: DRUMS_SWING
            }
        },
        intro: ['intro'],
        loop: ['A', 'A2', 'B', 'C', 'A3']
    };

    SoundKit.register('catalog', { songs: { casino } });
})();
