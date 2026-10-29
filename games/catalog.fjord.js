/**
 * 曲の一覧：フィヨルドの朝霧（北欧の民謡風・ニ短調で、ゆったり）
 * 低い D のドローン（パッド）がずっと鳴り、カンテレ（はじく弦）が静かに分散和音をつまびく。遠くで角笛（暗いブラス）が呼ぶ
 * A' は弦楽器が和音を伸ばして厚くし、B は変ロ長調の方へ開いて、角笛が低く支える。遠くの太鼓（低いタム）がゆっくり打つ
 * 休憩の C はピアノを抜き、ヴァイオリン（弦楽器）がひとりで歌う
 */
(function () {
    const { repeat } = SoundKit;

    // A の主題。Dm で終えて、B の Bb へ
    const THEME = `A5:8 D6:4 C6:4 | G5:8 E5:8 | F5:6 E5:2 D5:8 | E5:4 A5:4 C6:8 |
                   D6:8 Bb5:4 F5:4 | A5:8 C6:4 A5:4 | Bb5:4 G5:4 E5:4 C5:4 | D5:16`;
    const CHORDS_A = 'Dm | C | Dm | Am | Bb | F | Gm:8 C:8 | Dm';

    // B：変ロ長調の方へ開き、Asus4（ドローンの D を含む）で休憩へ
    const CHORDS_B = 'Bb | F | C | Dm | Bb | F | Gm | Asus4';
    const SONG_B = `D6:8 C6:4 Bb5:4 | A5:8 F5:8 | G5:4 E5:4 C6:8 | A5:12 r:4 |
                    Bb5:4 D6:4 F5:8 | C6:8 A5:8 | Bb5:4 G5:4 D5:8 | D5:8 E5:8`;
    // B の角笛：低く伸ばして支える
    const HORN_B = 'D4:16 | C4:16 | E4:16 | F4:16 | D4:16 | C4:16 | D4:16 | E4:16';

    // 休憩：ヴァイオリンがひとりで歌う。Asus4 で頭の Dm へ戻る
    const CHORDS_C = 'Dm | Bb | F | C | Dm | Bb | Gm | Asus4';
    const VIOLIN_C = `A5:8 F5:8 | D5:8 F5:8 | C5:4 F5:4 A5:8 | G5:16 |
                      F5:8 A5:8 | D6:8 Bb5:8 | G5:8 Bb5:8 | A5:8 E5:8`;

    // カンテレの分散和音（8分）。低い D のドローン
    const KANTELE = '0:2 1 2 3 2 1 2 1';
    const DRONE = 'D3:16';
    const DRUM = { tomLow: repeat('x.......x.......', 8, '|') };

    // フィヨルド：ドローンとカンテレ、角笛
    const fjord = {
        title: 'フィヨルドの朝霧',
        tags: ['神秘的', '落ち着いた'],
        genre: 'ワールド',
        melody: ['lead'],
        bpm: 72,
        gain: 0.106,
        reverb: { seconds: 3, tone: 0.4 },
        delay: { time: 0.75, feedback: 0.3, tone: 1800, reverb: 0.3 },
        humanize: { time: 0.008, velocity: 0.1 },
        parts: {
            lead: { instrument: 'piano', volume: 0.63, pan: -0.08, decay: 0.9, brightness: 0.75, reverb: 0.3, delay: 0.12 },
            violin: { instrument: 'strings', volume: 0.95, pan: 0.25, attack: 0.2, release: 0.5, brightness: 0.75, vibrato: 10, reverb: 0.45, delay: 0.1 },
            // 角笛のつもり：ブラスを暗く、ゆっくり吹く
            horn: { instrument: 'brass', volume: 0.6, pan: 0.3, brightness: 1.8, cutoff: 1600, attack: 0.15, release: 0.6, vibrato: 4, reverb: 0.5, delay: 0.15 },
            strings: { instrument: 'strings', mode: 'chords', center: 'D4', voices: 3, volume: 0.42, pan: 0.15, attack: 0.8, release: 1.2, brightness: 0.55, reverb: 0.55 },
            // カンテレのつもり：柔らかいギターの分散和音
            kantele: { instrument: 'guitar', mode: 'arp', from: 'A3', brightness: 0.5, volume: 0.45, pan: -0.25, reverb: 0.35, delay: 0.15 },
            drone: { instrument: 'pad', volume: 0.5, cutoff: 650, attack: 1.5, release: 2, reverb: 0.45 },
            bass: { instrument: 'synthBass', mode: 'bass', octave: 2, wave: 'triangle', cutoff: 260, envelope: 0.4, decay: 0.6, sustain: 0.6, release: 0.3, volume: 0.4, gate: 0.9 },
            drums: { instrument: 'drums', kit: 'soft', mode: 'drums', volume: 0.8, cutoff: 5000, levels: { tomLow: 0.6 } }
        },
        sections: {
            // イントロ：ドローンの上で、遠くの角笛が呼ぶ。カンテレが入り、C で主題へ
            intro: {
                label: 'イントロ',
                chords: 'Dm | Dm | C | C',
                horn: 'A4:4 D5:12 | A4:16 | G4:4 C5:12 | G4:8 E4:8',
                kantele: { pattern: 'r:16 | r:16 | ' + KANTELE + ' | ' + KANTELE },
                drone: DRONE
            },
            A: {
                chords: CHORDS_A,
                lead: THEME,
                kantele: KANTELE,
                drone: DRONE,
                bass: 'R:16'
            },
            // A'：弦が和音を伸ばして厚くし、遠くの太鼓が入る
            A2: {
                label: "A'",
                chords: CHORDS_A,
                lead: THEME,
                strings: 'hold',
                kantele: KANTELE,
                drone: DRONE,
                bass: 'R:8 5:8',
                drums: DRUM
            },
            // B：変ロ長調の方へ開き、角笛が低く支える。Asus4 で休憩へ
            B: {
                chords: CHORDS_B,
                lead: SONG_B,
                horn: HORN_B,
                strings: 'hold',
                kantele: KANTELE,
                drone: DRONE,
                bass: 'R:8 5:8',
                drums: DRUM
            },
            // 休憩：ピアノと太鼓を抜き、ヴァイオリンがひとりで歌う。カンテレは4分に。Asus4 で頭の Dm へ戻る
            C: {
                chords: CHORDS_C,
                violin: VIOLIN_C,
                kantele: '0:4 1 2 1',
                drone: DRONE,
                bass: 'R:16'
            }
        },
        intro: ['intro'],
        loop: ['A', 'A2', 'B', 'C']
    };

    SoundKit.register('catalog', { songs: { fjord } });
})();
