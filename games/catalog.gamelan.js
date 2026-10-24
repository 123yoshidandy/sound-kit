/**
 * 曲の一覧：月夜の影絵芝居（ガムラン風・ホの五音音階 E G A B D で、きらきらと重なる）
 * 和音も五音音階に収まるもの（Em7・G6・Dsus2・Asus4）だけにして、どの音が重なっても濁らないようにする
 * 主題のまわりを、カリンバ（ボナン）が8分で、シロフォン（サロンの細かい刻み）が16分で飾る。区間の頭でゴング（低いベル）
 * A' はベルが主題を重ねて鳴らし、B は主題の音を長く伸ばして飾りを細かくする。休憩の C はビブラフォンとゴングだけ
 */
(function () {
    const { repeat } = SoundKit;

    // A の主題（前半7小節は最後の A でも同じ）
    const THEME_HEAD = `E5:4 G5:4 B5:8 | D6:4 B5:4 G5:4 E5:4 | A5:8 E5:4 D5:4 | E5:12 r:4 |
                        G5:4 B5:4 D6:8 | D6:4 A5:4 E5:8 | D5:4 E5:4 A5:8`;
    const THEME = `${THEME_HEAD} | B5:8 G5:4 E5:4`;
    // ループの終わり：Dsus2 で止めて、頭の Em7 へ戻る
    const THEME_LAST = `${THEME_HEAD} | A5:8 E5:4 D5:4`;
    const CHORDS_A = 'Em7 | G6 | Dsus2 | Em7 | G6 | Asus4 | Dsus2 | Em7';
    const CHORDS_LAST = 'Em7 | G6 | Dsus2 | Em7 | G6 | Asus4 | Dsus2 | Dsus2';

    // ボナン（8分）とサロンの刻み（16分）
    const BONANG = '0:2 2 1 3 0 2 1 3';
    const IMBAL = '0:1 2 1 3 2 4 3 2 0 2 1 3 2 4 3 2';
    // ゴング：4小節ごとに
    const GONG = 'E3:16 | r:16 | r:16 | r:16';
    // クンダン（太鼓）：高いタムと低いタム
    const KENDANG = { tomHigh: repeat('x..x....x.x..x..', 8, '|'), tomLow: repeat('x.......x.......', 8, '|') };

    // ガムラン：重なる金属の音
    const gamelan = {
        title: '月夜の影絵芝居',
        tags: ['神秘的', '落ち着いた'],
        genre: 'ワールド',
        melody: ['lead'],
        bpm: 92,
        gain: 0.08,
        reverb: { seconds: 2.8, tone: 0.45 },
        delay: { time: 0.75, feedback: 0.25, tone: 2200, reverb: 0.3 },
        humanize: { time: 0.005, velocity: 0.08 },
        parts: {
            lead: { instrument: 'piano', volume: 0.78, pan: -0.08, decay: 1, brightness: 0.8, reverb: 0.28, delay: 0.1 },
            // サロン：主題をベルで重ねる
            saron: { instrument: 'bell', volume: 0.35, pan: 0.2, decay: 1.6, ratio: 3, reverb: 0.35 },
            bonang: { instrument: 'kalimba', mode: 'arp', from: 'E4', volume: 0.35, pan: -0.3, reverb: 0.3 },
            imbal: { instrument: 'xylophone', mode: 'arp', from: 'B3', volume: 0.35, pan: 0.35, reverb: 0.3, delay: 0.1 },
            vibes: { instrument: 'vibes', volume: 0.85, pan: 0.1, tremolo: 5, reverb: 0.45, delay: 0.2 },
            // ゴング：低いベルを長く響かせる
            gong: { instrument: 'bell', volume: 0.5, pan: 0, decay: 6, ratio: 1.41, index: 1.6, reverb: 0.5 },
            bass: { instrument: 'synthBass', mode: 'bass', octave: 2, wave: 'triangle', cutoff: 240, envelope: 0.3, decay: 1.2, sustain: 0.6, release: 0.5, volume: 0.4, gate: 0.9 },
            drums: { instrument: 'drums', kit: 'soft', mode: 'drums', volume: 0.98, cutoff: 7000, levels: { tomHigh: 0.45, tomLow: 0.55 } }
        },
        sections: {
            // イントロ：ゴングとボナンから始め、Dsus2 で主題へ
            intro: {
                label: 'イントロ',
                chords: 'Em7 | G6 | Asus4 | Dsus2',
                gong: GONG,
                bonang: BONANG,
                drums: { tomLow: repeat('x.......x.......', 4, '|'), tomHigh: '................|................|x..x....x.x..x..|x..x....x.x.xxxx' }
            },
            A: {
                chords: CHORDS_A,
                lead: THEME,
                bonang: BONANG,
                gong: GONG,
                bass: 'R:16',
                drums: KENDANG
            },
            // A'：ベルが主題を重ね、シロフォンが16分で飾る
            A2: {
                label: "A'",
                chords: CHORDS_A,
                lead: THEME,
                saron: THEME,
                bonang: BONANG,
                imbal: IMBAL,
                gong: GONG,
                bass: 'R:16',
                drums: KENDANG
            },
            // B：主題の音を長く伸ばし、飾りを細かくする。ゴングは2小節ごと。Asus4 で休憩へ
            B: {
                chords: 'G6 | G6 | Dsus2 | Dsus2 | Em7 | Em7 | Asus4 | Asus4',
                lead: 'D6:16 | B5:8 G5:8 | A5:16 | E5:8 D5:8 | G5:16 | B5:8 E5:8 | A5:16 | D5:8 E5:8',
                bonang: BONANG,
                imbal: IMBAL,
                gong: 'E3:16 | r:16',
                bass: 'R:16',
                drums: { ...KENDANG, tomHigh: repeat('x..x..x.x.x..x.x', 8, '|') }
            },
            // 休憩：ピアノと飾りを抜き、ビブラフォンとゴングだけ。Dsus2 で頭の Em7 へ戻る
            C: {
                chords: 'Em7 | G6 | Dsus2 | Em7 | G6 | Asus4 | Dsus2 | Dsus2',
                vibes: 'E5:8 G5:8 | B5:8 D5:8 | A5:8 E5:8 | B4:16 | D5:8 G5:8 | A5:8 E5:8 | D5:8 A4:8 | E5:16',
                gong: GONG,
                bass: 'R:16',
                drums: { tomLow: repeat('x...............', 8, '|') }
            },
            // 最後の A'：ベルとシロフォンを重ねて、Dsus2 で頭の Em7 へ戻る
            A3: {
                label: "A'",
                chords: CHORDS_LAST,
                lead: THEME_LAST,
                saron: THEME_LAST,
                bonang: BONANG,
                imbal: IMBAL,
                gong: GONG,
                bass: 'R:16',
                drums: KENDANG
            }
        },
        intro: ['intro'],
        loop: ['A', 'A2', 'B', 'C', 'A3']
    };

    SoundKit.register('catalog', { songs: { gamelan } });
})();
