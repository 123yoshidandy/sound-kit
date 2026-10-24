/**
 * 曲の一覧：旅の吟遊詩人（中世の吟遊詩人・ニ短調のドリア旋法で、8分の6拍子）
 * 1小節は12ステップ（付点4分音符×2）。リュート（暗めのギター）の分散和音と、枠太鼓（タム）・タンバリン（シェイカー）
 * A' はフルートが低く伸ばして支え、B はヘ長調の方へ歌い上げて A（長和音）で止まる。休憩の C はフルートが歌う
 * ドリア旋法なので、Dm の調でも G は長和音（B ナチュラル）にする
 */
(function () {
    const { repeat } = SoundKit;

    // A の主題（16小節）。「タ・タン」「ターン」の8分の6拍子のはずみ
    const THEME = `D5:4 E5:2 F5:4 A5:2 | G5:6 E5:6 | F5:4 G5:2 A5:4 D6:2 | C6:6 A5:6 |
                   A5:4 G5:2 F5:4 A5:2 | G5:4 E5:2 C5:6 | D5:4 G5:2 B5:4 D6:2 | C6:6 A5:6 |
                   D6:4 C6:2 A5:4 F5:2 | G5:4 A5:2 G5:4 E5:2 | F5:4 E5:2 D5:4 F5:2 | E5:6 A5:6 |
                   C6:4 A5:2 F5:4 A5:2 | B5:4 G5:2 D5:4 G5:2 | A5:4 E5:2 E5:4 G5:2 | D5:12`;
    const CHORDS_A = `Dm | C | Dm | Am | F | C | G | Am |
                      Dm | C | Dm | Am | F | G | Am:6 C:6 | Dm`;

    // A' のフルート：和音の音を、低く伸ばして支える
    const FLUTE_LOW = `A4:12 | G4:12 | A4:12 | A4:12 | A4:12 | G4:12 | G4:12 | A4:12 |
                       F4:12 | E4:12 | F4:12 | E4:12 | F4:12 | G4:12 | A4:6 G4:6 | F4:12`;

    // リュート：8分の分散和音
    const LUTE = '0:2 1 2 3 2 1';
    const BASS = 'R:6 5:6';
    // 枠太鼓：1拍目を低く、2拍目（4つ目の8分）を高く。タンバリンは8分で
    const DRUM = { tomLow: repeat('x...........', 16, '|'), tomMid: repeat('......o.....', 16, '|'), shaker: repeat('x.o.o.x.o.o.', 16, '|') };

    // 吟遊詩人：リュートとフルートと枠太鼓
    const minstrel = {
        title: '旅の吟遊詩人',
        tags: ['落ち着いた', '神秘的'],
        genre: 'ワールド',
        meter: '6/8',
        melody: ['lead'],
        bpm: 120,
        stepsPerBar: 12,
        gain: 0.085,
        reverb: { seconds: 2.2, tone: 0.45 },
        delay: { time: 1.5, feedback: 0.2, tone: 2000, reverb: 0.25 },
        humanize: { time: 0.008, velocity: 0.1 },
        parts: {
            lead: { instrument: 'piano', volume: 0.66, pan: -0.08, decay: 0.8, brightness: 0.8, reverb: 0.22, delay: 0.08 },
            flute: { instrument: 'flute', volume: 0.44, pan: 0.3, vibrato: 10, breath: 0.06, reverb: 0.3, delay: 0.12 },
            // リュートのつもり：暗めのギターを分散和音で
            lute: { instrument: 'guitar', mode: 'arp', from: 'D3', brightness: 0.45, volume: 0.7, pan: 0.2, reverb: 0.25 },
            bass: { instrument: 'pluck', mode: 'bass', octave: 2, brightness: 0.3, sustain: 0.994, release: 0.1, volume: 0.85, gate: 0.6 },
            drums: { instrument: 'drums', kit: 'soft', mode: 'drums', volume: 0.95, cutoff: 7000, levels: { tomLow: 0.6, tomMid: 0.45, shaker: 0.35 } }
        },
        sections: {
            // イントロ：リュートと枠太鼓だけで、旅の始まり。A で主題へ
            intro: {
                label: 'イントロ',
                chords: 'Dm | C | Dm | A',
                lute: LUTE,
                bass: { pattern: `r:12 | r:12 | ${BASS} | ${BASS}` },
                drums: { tomLow: repeat('x...........', 4, '|'), tomMid: repeat('......o.....', 4, '|') }
            },
            A: {
                chords: CHORDS_A,
                lead: THEME,
                lute: LUTE,
                bass: BASS,
                drums: { tomLow: DRUM.tomLow, tomMid: DRUM.tomMid }
            },
            // A'：フルートが低く伸ばして支え、タンバリンを足す
            A2: {
                label: "A'",
                chords: CHORDS_A,
                lead: THEME,
                flute: FLUTE_LOW,
                lute: LUTE,
                bass: BASS,
                drums: DRUM
            },
            // B：ヘ長調の方へ歌い上げ、A（長和音）で止まって休憩へ
            B: {
                chords: `F | C | Dm | Am | Bb | F | G | A |
                         F | C | Dm | Bb | Gm | C | A | A`,
                lead: `A5:6 C6:6 | G5:4 C6:2 E5:6 | F5:4 A5:2 D6:6 | C6:4 B5:2 A5:6 |
                       Bb5:6 F5:6 | A5:4 G5:2 F5:6 | G5:4 B5:2 D6:6 | C#6:12 |
                       C6:6 A5:6 | G5:6 E5:6 | D5:4 F5:2 A5:6 | D6:6 Bb5:6 |
                       Bb5:4 A5:2 G5:6 | E5:4 G5:2 C6:6 | C#6:6 A5:6 | E5:12`,
                lute: LUTE,
                bass: BASS,
                drums: DRUM
            },
            // 休憩：ピアノと太鼓を抜き、フルートが歌う。リュートはゆっくり。A で頭の Dm へ戻る
            C: {
                chords: 'Dm | C | Dm | Am | F | C | G | A',
                flute: 'A5:12 | G5:6 E5:6 | F5:6 A5:6 | E5:12 | F5:4 G5:2 A5:6 | G5:6 E5:6 | D5:4 G5:2 B5:6 | C#6:6 A5:6',
                lute: '0:6 2',
                bass: 'R:12',
                drums: { shaker: repeat('x.....x.....', 8, '|') }
            }
        },
        intro: ['intro'],
        loop: ['A', 'A2', 'B', 'C']
    };

    SoundKit.register('catalog', { songs: { minstrel } });
})();
