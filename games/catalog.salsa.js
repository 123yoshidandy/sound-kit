/**
 * 曲の一覧：カジェ・ルンバ（サルサ・イ短調で軽快に）
 * 4分音符=184 で、1小節を2拍子に感じる。クラーベは 2-3（1小節目が2つ、2小節目が3つ）
 * 曲の書き方は docs/composing.md にある。長さは16分音符の数で、'|' は小節の区切り
 */
(function () {
    const { repeat } = SoundKit;

    // A の和音：5度ずつ下がる短調の循環（Am → Dm → G7 → C → F → Bm7b5 → E7 → Am）
    const CHORDS_A = 'Am | Am | Dm | Dm | G7 | G7 | Cmaj7 | Cmaj7 | Fmaj7 | Fmaj7 | Bm7b5 | Bm7b5 | E7 | E7 | Am | E7';
    // A' は終わりの4小節を変えて、主和音に落ち着く
    const CHORDS_A2 = 'Am | Am | Dm | Dm | G7 | G7 | Cmaj7 | Cmaj7 | Fmaj7 | Fmaj7 | Bm7b5 | Bm7b5 | Dm7 | E7 | Am | Am';

    // 主題：裏拍から入って、小節の頭を伸ばす（前半12小節は A' でも同じ）
    const THEME_HEAD = `r:2 E5:4 A5:4 C6:6 | B5:4 A5:2 E5:10 | r:2 F5:4 A5:4 D6:6 | C6:4 A5:2 F5:10 |
                        r:2 D5:4 G5:4 B5:6 | A5:4 G5:2 F5:10 | r:2 E5:4 G5:4 C6:6 | B5:4 G5:2 E5:10 |
                        r:2 F5:4 A5:4 C6:6 | A5:4 C6:2 E5:10 | r:2 D6:4 C6:2 B5:2 A5:6 | F5:4 E5:2 D5:10`;
    const THEME = `${THEME_HEAD} | r:2 E5:4 G#5:4 B5:6 | D6:4 B5:2 G#5:10 | r:2 C6:4 B5:4 A5:6 | G#5:6 E5:2 B4:4 D5:4`;
    const THEME_END = `${THEME_HEAD} | r:2 F5:4 A5:4 C6:6 | D6:4 B5:2 G#5:10 | A5:12 r:4 | r:12 E5:2 F5:2`;

    // フルートの合いの手：主題が伸ばしている所（各2小節の後半）に短く答える
    const FLUTE_FILLS = `r:16 | r:6 C6:2 B5:2 A5:2 E5:4 | r:16 | r:6 D6:2 C6:2 A5:2 F5:4 |
                         r:16 | r:6 B5:2 A5:2 G5:2 D5:4 | r:16 | r:6 C6:2 B5:2 G5:2 E5:4 |
                         r:16 | r:6 C6:2 A5:2 F5:2 C6:4 | r:16 | r:6 A5:2 F5:2 D5:2 F5:4`;

    // モントゥーノ：エレピの分散和音を、裏拍に寄せて2小節で1周させる
    const MONTUNO = '0:2 2 1 3 r 2 r 4 | r 3 2 r 1 3 r 2';
    // 休憩の区間では音を減らす
    const MONTUNO_SPARSE = '0:2 r 1 r r 2 r 4 | r 3 r r 1 r r 2';

    // トゥンバオ：1拍目を抜き、2拍目の裏と4拍目で弾く
    const TUMBAO = 'r:6 R:6 5:4';

    // 打楽器：クラーベ（rim）2-3、コンガ（tom）は4拍目と裏で開いた音、バスドラは3の側の「ボンボ」だけ弱く
    const CLAVE = '....x...x.......|x.....x.....x...';
    const CONGA = '......o.....x.x.|......o.....x.x.';
    const BOMBO = '................|......o.........';
    const DRUMS = {
        rim: repeat(CLAVE, 8, '|'),
        tom: repeat(CONGA, 8, '|'),
        kick: repeat(BOMBO, 8, '|')
    };
    // 区間の最後の小節で、コンガを連打して次へつなぐ
    const DRUMS_FILL = {
        rim: repeat(CLAVE, 8, '|'),
        tom: repeat(CONGA, 7, '|') + '|......o...x.x.xx',
        kick: repeat(BOMBO, 8, '|')
    };

    // カウベル（短いベル）：拍の頭で鳴らし、1拍目と3拍目を強く。マンボ（B）では裏も足す
    const COWBELL = repeat('A5:1@1 r:3 E5:1@0.6 r:3 A5:1@0.9 r:3 E5:1@0.6 r:3', 16, '|');
    const COWBELL_MAMBO = repeat('A5:1@1 r:1 E5:1@0.5 r:1 E5:1@0.6 r:1 E5:1@0.5 r:1 A5:1@0.9 r:1 E5:1@0.5 r:1 E5:1@0.6 r:1 A5:1@0.6 r:1', 16, '|');

    // 速いサルサを、うるさくならないように：伴奏はエレピ1つ、打楽器は軽く
    const salsa = {
        title: 'カジェ・ルンバ',
        tags: ['軽快', '明るい'],
        genre: 'ラテン',
        melody: ['lead'],
        bpm: 184,
        gain: 0.0615,
        reverb: { seconds: 1.6, tone: 0.5 },
        delay: { time: 0.75, feedback: 0.2, tone: 2600 },
        humanize: { time: 0.005, velocity: 0.08 },
        parts: {
            lead: { instrument: 'piano', volume: 0.8, pan: -0.1, reverb: 0.18, delay: 0.08, decay: 0.8, brightness: 0.85 },
            flute: { instrument: 'flute', volume: 0.6, vibrato: 10, breath: 0.05, pan: -0.32, reverb: 0.28, delay: 0.12 },
            montuno: { instrument: 'epiano', mode: 'arp', from: 'A3', volume: 0.95, pan: 0.25, reverb: 0.15, decay: 0.5, release: 0.08 },
            bass: { instrument: 'pluck', mode: 'bass', octave: 2, brightness: 0.35, sustain: 0.995, release: 0.1, volume: 0.9, gate: 0.85 },
            bell: { instrument: 'bell', decay: 0.12, ratio: 1.48, index: 1.6, volume: 0.9, pan: 0.32, reverb: 0.1 },
            drums: { instrument: 'drums', kit: 'soft', mode: 'drums', volume: 1.2, levels: { rim: 0.6, tom: 0.6, kick: 0.6 } }
        },
        sections: {
            // イントロ：モントゥーノとクラーベから始め、3小節目でベースが入る
            intro: {
                label: 'イントロ',
                chords: 'Am | Dm | Am | E7',
                montuno: MONTUNO,
                bass: { pattern: 'r:16 | r:16 | r:6 R:6 5:4 | r:6 R:6 5:4' },
                drums: {
                    rim: repeat(CLAVE, 2, '|'),
                    tom: '................|................|......o.....x.x.|......o...x.x.xx'
                }
            },
            A: {
                chords: CHORDS_A,
                lead: THEME,
                montuno: MONTUNO,
                bass: TUMBAO,
                bell: COWBELL,
                drums: DRUMS_FILL
            },
            // A'：フルートが合いの手で答える
            A2: {
                label: "A'",
                chords: CHORDS_A2,
                lead: THEME_END,
                flute: `${FLUTE_FILLS} | r:16 | r:16 | r:16 | r:16`,
                montuno: MONTUNO,
                bass: TUMBAO,
                bell: COWBELL,
                drums: DRUMS_FILL
            },
            // B（マンボ）：短調の VI → V → i で流れを変え、カウベルを細かくする。主題は長い音で歌う
            B: {
                chords: 'Fmaj7 | E7 | Am7 | Am7 | Fmaj7 | E7 | Am7 | A7 | Dm7 | Dm7 | Am7 | Am7 | Bm7b5 | E7 | Am | E7',
                lead: `C6:8 A5:4 E5:4 | D6:8 B5:4 G#5:4 | A5:12 r:4 | r:16 |
                       F5:8 A5:4 C6:4 | B5:8 G#5:4 E5:4 | A5:4 C6:8 r:4 | C#6:8 r:4 A5:4 |
                       D6:8 C6:4 A5:4 | F5:12 r:4 | E5:4 A5:4 C6:8 | r:16 |
                       A5:8 F5:4 D5:4 | G#5:8 B5:4 D6:4 | C6:8 B5:4 A5:4 | G#5:8 r:8`,
                flute: `r:16 | r:16 | r:12 E6:2 D6:2 | C6:2 B5:2 A5:2 E5:2 G5:4 A5:4 |
                        r:16 | r:16 | r:16 | r:16 |
                        r:16 | r:12 A5:2 C6:2 | r:16 | B5:2 A5:2 G5:2 E5:2 C6:4 A5:4 |
                        r:16 | r:16 | r:16 | r:8 E5:2 G#5:2 B5:4`,
                montuno: MONTUNO,
                bass: TUMBAO,
                bell: COWBELL_MAMBO,
                drums: {
                    rim: repeat(CLAVE, 8, '|'),
                    tom: repeat(CONGA, 7, '|') + '|......o...x.x.xx',
                    kick: repeat('......o.........|......o.........', 8, '|')
                }
            },
            // C（休憩）：ドリア調の Am7 ⇄ D7 を繰り返す。カウベルとバスドラを抜き、主題はまばらに
            C: {
                chords: 'Am7 | D7 | Am7 | D7 | Am7 | D7 | Am7 | D7 | Fmaj7 | E7 | Fmaj7 | E7 | Dm7 | E7 | Am7 | E7',
                lead: `r:16 | r:8 F#5:4 A5:4 | G5:8 E5:8 | r:16 |
                       r:16 | r:8 C6:4 A5:4 | G5:4 A5:4 E5:8 | r:16 |
                       A5:8 C6:8 | B5:16 | A5:8 F5:8 | G#5:16 |
                       F5:8 A5:8 | G#5:8 B5:8 | C6:8 A5:8 | G#5:8 r:4 E5:4`,
                flute: `r:16 | r:16 | r:16 | r:4 A5:2 C6:2 D6:4 A5:4 |
                        r:16 | r:16 | r:16 | r:4 F#5:2 A5:2 C6:4 A5:4 |
                        r:16 | r:16 | r:16 | r:16 | r:16 | r:16 | r:16 | r:16`,
                montuno: MONTUNO_SPARSE,
                bass: 'r:6 R:10',
                drums: {
                    rim: repeat(CLAVE, 8, '|'),
                    tom: repeat('............o.o.|............o.o.', 7, '|') + '|......o...x.x.xx'
                }
            },
            // A をもう一度：フルートの合いの手を足す。最後の E7 から頭の Am へ戻る
            A3: {
                label: 'A',
                chords: CHORDS_A,
                lead: THEME,
                flute: `${FLUTE_FILLS} | r:16 | r:16 | r:16 | r:16`,
                montuno: MONTUNO,
                bass: TUMBAO,
                bell: COWBELL,
                drums: DRUMS_FILL
            }
        },
        intro: ['intro'],
        loop: ['A', 'A2', 'B', 'C', 'A3']
    };

    SoundKit.register('catalog', { songs: { salsa } });
})();
