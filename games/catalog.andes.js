/**
 * 曲の一覧：コンドルの舞う高原（アンデスのフォルクローレ・イ短調とハ長調を行き来する、ウァイノ風の2拍子）
 * チャランゴのつもりの明るいギターが16分で細かくかき鳴らし、ボンボのつもりの低い太鼓とキックが「ドン・ドドン」と踏む
 * 主題は5音の音階で「長・短・短」のリズムを繰り返す。A' はケーナのつもりの笛が主題に重なり、太鼓が加わる
 * B はハ長調に明るく開き、パッドが高原の空気のように薄く敷く。休憩の C はピアノを抜き、ケーナがひとりで歌う。最後は E で頭の Am へ戻る
 */
(function () {
    const { repeat } = SoundKit;

    // A の主題（前半7小節は A' でも同じ）。5音の音階で「長・短・短」
    const THEME_HEAD = `E5:4 A5:2 B5:2 C6:4 B5:2 A5:2 | A5:6 G5:2 E5:8 |
                        G5:4 E5:2 G5:2 C6:4 B5:2 A5:2 | B5:6 A5:2 G5:8 |
                        E5:4 A5:2 B5:2 C6:4 D6:2 C6:2 | D6:6 C6:2 A5:8 | G5:4 B5:2 A5:2 G5:4 E5:4`;
    const THEME = `${THEME_HEAD} | A5:12 r:4`;
    // A' の終わり：G で止めて、ハ長調の B へ
    const THEME_TURN = `${THEME_HEAD} | G5:4 B5:4 D6:8`;
    // ループの終わり：E で止めて、頭の Am へ
    const THEME_LAST = `${THEME_HEAD} | B5:8 G#5:4 E5:4`;
    const CHORDS_HEAD = 'Am | Am | C | G | Am | Dm | Em';
    const CHORDS_A = `${CHORDS_HEAD} | Am`;
    const CHORDS_A2 = `${CHORDS_HEAD} | G`;
    const CHORDS_LAST = `${CHORDS_HEAD} | E`;

    // B：ハ長調に開き、E で休憩の Am へ
    const CHORDS_B = 'C | G | Am | Em | F | C | Dm | E';
    const SONG_B = `E5:4 G5:2 A5:2 G5:4 E5:4 | D5:4 G5:2 A5:2 B5:8 | C6:4 B5:2 A5:2 E5:8 | G5:6 A5:2 B5:8 |
                    A5:4 C6:2 D6:2 C6:8 | G5:6 E5:2 C5:8 | D5:4 F5:2 A5:2 D6:8 | B5:6 G#5:2 E5:8`;

    // 休憩：ケーナがひとりで歌う。E で最後の A' へ
    const CHORDS_C = 'Am | F | C | G | Am | F | Dm | E';
    const QUENA_C = `E5:8 A5:8 | C6:8 A5:8 | G5:8 E5:8 | D5:8 B4:8 |
                     C5:8 E5:8 | A5:8 F5:8 | F5:8 D5:8 | E5:8 G#5:8`;

    // チャランゴの細かい刻み（16分で動くのはこれだけ）。ベースは太鼓と同じ所で踏む
    const CHARANGO = 'x.xx..x.x.xx..x.';
    const BASS = 'R:4 r:2 R:2 5:4 r:4';
    const KICK = repeat('x.......x.......', 8, '|');
    const BOMBO = repeat('....x.x.....x.x.', 8, '|');
    // チャフチャス（ヤギの爪の鳴り物）のつもりのシェイカー
    const SHAKER = repeat('x.o.x.o.x.o.x.o.', 8, '|');
    const DRUMS = { kick: KICK, shaker: SHAKER };
    const DRUMS_FULL = { ...DRUMS, tomLow: BOMBO };

    // フォルクローレ：チャランゴとケーナ、ボンボ
    const andes = {
        title: 'コンドルの舞う高原',
        tags: ['神秘的', '落ち着いた'],
        genre: 'ワールド',
        melody: ['lead'],
        bpm: 96,
        gain: 0.105,
        reverb: { seconds: 2.4, tone: 0.45 },
        delay: { time: 0.75, feedback: 0.25, tone: 2000, reverb: 0.3 },
        humanize: { time: 0.006, velocity: 0.1 },
        parts: {
            lead: { instrument: 'piano', volume: 0.5, pan: -0.08, decay: 0.85, brightness: 0.8, reverb: 0.25, delay: 0.1 },
            // A' で主題に重ねるケーナ
            unison: { instrument: 'flute', volume: 0.35, pan: 0.15, breath: 0.09, vibrato: 12, reverb: 0.3, delay: 0.15 },
            // 休憩の C で歌うケーナ：息の音を多めに
            quena: { instrument: 'flute', volume: 0.45, pan: 0.15, breath: 0.09, vibrato: 12, reverb: 0.4, delay: 0.25 },
            // チャランゴのつもり：明るいギターを細かくかき鳴らす
            charango: { instrument: 'guitar', mode: 'chords', center: 'E4', voices: 3, strum: 0.008, gate: 0.35, brightness: 0.7, volume: 0.6, pan: -0.25, reverb: 0.2 },
            pad: { instrument: 'pad', mode: 'chords', center: 'C4', voices: 3, volume: 0.35, cutoff: 900, attack: 1, release: 1.5, pan: 0.2, reverb: 0.5 },
            bass: { instrument: 'pluck', mode: 'bass', octave: 2, brightness: 0.4, volume: 0.95 },
            drums: { instrument: 'drums', kit: 'soft', mode: 'drums', volume: 0.8, cutoff: 7000, levels: { kick: 0.55, tomLow: 0.5, shaker: 0.3 } }
        },
        sections: {
            // イントロ：チャランゴとキックから、太鼓とベースが入る。E で主題へ
            intro: {
                label: 'イントロ',
                chords: 'Am | G | F | E',
                charango: CHARANGO,
                bass: { pattern: `r:16 | r:16 | ${BASS} | ${BASS}` },
                drums: {
                    kick: repeat('x.......x.......', 4, '|'),
                    tomLow: '................|................|....x.x.....x.x.|....x.x.....x.x.'
                }
            },
            A: {
                chords: CHORDS_A,
                lead: THEME,
                charango: CHARANGO,
                bass: BASS,
                drums: DRUMS
            },
            // A'：ケーナが主題に重なり、太鼓が加わる。G で B へ
            A2: {
                label: "A'",
                chords: CHORDS_A2,
                lead: THEME_TURN,
                unison: THEME_TURN,
                charango: CHARANGO,
                bass: BASS,
                drums: DRUMS_FULL
            },
            // B：ハ長調に開き、パッドが薄く敷く
            B: {
                chords: CHORDS_B,
                lead: SONG_B,
                charango: CHARANGO,
                pad: 'hold',
                bass: BASS,
                drums: DRUMS_FULL
            },
            // 休憩：ピアノを抜き、ケーナがひとりで歌う。チャランゴは8分にゆるめ、太鼓はキックだけ
            C: {
                chords: CHORDS_C,
                quena: QUENA_C,
                charango: 'x...x.x.x...x.x.',
                pad: 'hold',
                bass: 'R:8 5:8',
                drums: { kick: KICK }
            },
            // 最後の A'：ケーナが重なり、E で頭の Am へ戻る
            A3: {
                label: "A'",
                chords: CHORDS_LAST,
                lead: THEME_LAST,
                unison: THEME_LAST,
                charango: CHARANGO,
                bass: BASS,
                drums: DRUMS_FULL
            }
        },
        intro: ['intro'],
        loop: ['A', 'A2', 'B', 'C', 'A3']
    };

    SoundKit.register('catalog', { songs: { andes } });
})();
