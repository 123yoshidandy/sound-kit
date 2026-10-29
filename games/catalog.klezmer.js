/**
 * 曲の一覧：屋根裏のクレズマー（クレズマー・イのフレイギッシュ音階の2拍子で、軽く跳ねて、どこか妖しく）
 * 2拍子なので stepsPerBar: 8。音階はニ短調の第5音から始まる A・Bb・C#・D・E・F・G。増2度（Bb→C#）の響きで異国の色を出す
 * ベースが表で踏み、アコーディオンが裏拍で「チャッ」と鳴らす。A' からはクラリネットのつもりのフルートが、主題の伸ばしに合いの手を入れる
 * B はニ短調からヘ長調の方へ巡り、弦が薄く伸ばす。休憩の C はピアノを抜き、弦がフィドルのように歌う。最後は Gm から頭の A へ戻る
 */
(function () {
    // A の主題（前半15小節は最後の A でも同じ）。長い音は和音の音にして、Bb や F は拍の裏で通る
    const THEME_HEAD = `A5:4 G5:2 F5:2 | E5:6 r:2 | D5:4 F5:2 A5:2 | D6:6 r:2 | Bb5:4 A5:2 G5:2 | F5:4 E5:2 D5:2 | E5:2 F5:2 C#5:4 | A5:6 r:2 |
                        F5:2 A5:2 D6:4 | C6:2 Bb5:2 A5:4 | G5:2 F5:2 E5:4 | C#6:6 r:2 | D6:2 C6:2 Bb5:4 | A5:2 G5:2 F5:4 | E5:4 G5:2 F5:2`;
    const THEME = `${THEME_HEAD} | E5:6 r:2`;
    // ループの終わり：Gm で止めて、頭の A へ
    const THEME_LAST = `${THEME_HEAD} | G5:2 F5:2 D5:4`;
    const CHORDS_HEAD = `A | A | Dm | Dm | Gm | Dm | A | A |
                         Dm | Dm | A | A | Gm | Dm | A`;
    const CHORDS_A = `${CHORDS_HEAD} | A`;
    const CHORDS_LAST = `${CHORDS_HEAD} | Gm`;
    // クラリネットのつもりのフルート：主題が伸ばす小節の後半で答える
    const FILL = `r:8 | r:4 G5:2 A5:2 | r:8 | r:4 A5:2 Bb5:2 | r:8 | r:8 | r:8 | r:4 C#6:2 Bb5:2 |
                  r:8 | r:8 | r:8 | r:4 E6:2 D6:2 | r:8 | r:8 | r:8 | r:4 E5:2 F5:2`;
    const FILL_LAST = FILL.replace(/r:4 E5:2 F5:2$/, 'r:4 Bb5:2 A5:2');

    // B：ニ短調からヘ長調の方へ巡り、A へ戻る
    const CHORDS_B = `Dm | Dm | Gm | Gm | C7 | C7 | F | F |
                      Bb | Bb | Gm | Gm | A | A | A7 | A`;
    const SONG_B = `D5:4 F5:4 | A5:8 | G5:4 Bb5:4 | D6:8 | C6:4 Bb5:4 | G5:4 E5:4 | F5:4 A5:4 | C6:8 |
                    D6:4 C6:2 Bb5:2 | F5:8 | G5:4 Bb5:2 A5:2 | G5:8 | C#6:4 A5:4 | G5:2 F5:2 E5:4 | A5:2 Bb5:2 G5:4 | E5:6 r:2`;

    // 休憩：弦がフィドルのように歌う（16小節）
    const CHORDS_C = `Dm | Gm | A | A | Dm | Gm | A | A |
                      Dm | Gm | C7 | F | Bb | Gm | A | A`;
    const SOLO_C = `F5:8 | G5:4 Bb5:4 | A5:8 | C#6:4 E5:4 | D5:4 F5:4 | D6:8 | E6:4 C#6:4 | A5:8 |
                    A5:8 | Bb5:4 D6:4 | C6:4 G5:4 | A5:8 | D6:4 F5:4 | G5:4 Bb5:4 | C#6:8 | A5:4 E5:4`;

    // ベースは表、アコーディオンは裏拍
    const BASS = 'R:4 5:4';
    const CHUCK = '..x...x.';
    const KICK = 'x...x...';
    const RIM = '..x...x.';

    // クレズマー：フレイギッシュ音階と、アコーディオンの裏拍、フルートの合いの手
    const klezmer = {
        title: '屋根裏のクレズマー',
        tags: ['軽快', '神秘的'],
        genre: 'ワールド',
        melody: ['lead'],
        bpm: 116,
        stepsPerBar: 8,
        gain: 0.1,
        reverb: { seconds: 1.8, tone: 0.5 },
        delay: { time: 0.75, feedback: 0.2, tone: 2200, reverb: 0.2 },
        humanize: { time: 0.005, velocity: 0.1 },
        parts: {
            lead: { instrument: 'piano', volume: 0.52, pan: -0.08, decay: 0.75, brightness: 0.85, reverb: 0.22, delay: 0.08 },
            // クラリネットのつもりのフルート：合いの手
            fill: { instrument: 'flute', volume: 0.4, pan: 0.2, breath: 0.06, vibrato: 14, reverb: 0.3, delay: 0.15 },
            // 休憩の C でフィドルのように歌う弦
            solo: { instrument: 'strings', volume: 1, pan: 0.15, attack: 0.06, release: 0.3, brightness: 1, vibrato: 14, reverb: 0.35 },
            // B で薄く伸ばす弦
            strings: { instrument: 'strings', mode: 'chords', center: 'C4', voices: 3, volume: 0.4, pan: -0.2, attack: 0.3, release: 0.5, brightness: 0.65, reverb: 0.4 },
            // 裏拍で「チャッ」と鳴らすアコーディオン
            chuck: { instrument: 'accordion', mode: 'chords', center: 'E4', voices: 3, gate: 0.5, release: 0.05, cutoff: 2400, volume: 1.4, pan: -0.25, reverb: 0.15 },
            bass: { instrument: 'pluck', mode: 'bass', octave: 2, brightness: 0.4, volume: 0.85 },
            drums: { instrument: 'drums', kit: 'soft', mode: 'drums', volume: 0.7, cutoff: 7500, levels: { kick: 0.55, rim: 0.4, shaker: 0.3 } }
        },
        sections: {
            // イントロ：アコーディオンとベースで回り、フルートが答えて、Gm から主題の A へ
            intro: {
                label: 'イントロ',
                chords: 'A | Dm | A | Gm',
                chuck: CHUCK,
                bass: BASS,
                fill: 'r:8 | r:8 | r:8 | r:4 G5:2 Bb5:2',
                drums: { kick: KICK }
            },
            A: {
                chords: CHORDS_A,
                lead: THEME,
                chuck: CHUCK,
                bass: BASS,
                drums: { kick: KICK }
            },
            // A'：フルートが合いの手を入れ、リムが裏拍に加わる
            A2: {
                label: "A'",
                chords: CHORDS_A,
                lead: THEME,
                fill: FILL,
                chuck: CHUCK,
                bass: BASS,
                drums: { kick: KICK, rim: RIM }
            },
            // B：ニ短調からヘ長調の方へ巡り、弦が薄く伸ばす
            B: {
                chords: CHORDS_B,
                lead: SONG_B,
                strings: 'hold',
                chuck: CHUCK,
                bass: BASS,
                drums: { kick: KICK, rim: RIM }
            },
            // 休憩：ピアノとリムを抜き、弦が歌う。ベースは小節の頭だけ
            C: {
                chords: CHORDS_C,
                solo: SOLO_C,
                chuck: CHUCK,
                bass: 'R:8',
                drums: { kick: 'x.......' }
            },
            // 最後の A'：合いの手とタンバリンがそろい、Gm から頭の A へ戻る
            A3: {
                label: "A'",
                chords: CHORDS_LAST,
                lead: THEME_LAST,
                fill: FILL_LAST,
                chuck: CHUCK,
                bass: BASS,
                drums: { kick: KICK, rim: RIM, shaker: 'x.x.x.x.' }
            }
        },
        intro: ['intro'],
        loop: ['A', 'A2', 'B', 'C', 'A3']
    };

    SoundKit.register('catalog', { songs: { klezmer } });
})();
