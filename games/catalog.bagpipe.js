/**
 * 曲の一覧：ヒースの丘の行進（スコットランド風・イのミクソリディアで、ゆっくり行進する）
 * パッドが A と E のドローンを鳴らし続け、低いオルガンが和音を支える。ドローンと半音でぶつからないよう、和音は A・G・D・Em・Bm だけにする
 * A' はバグパイプのつもりの細いシンセが主旋律に重なり、B はスネアが16分の連打で行進を強める
 * 休憩の C はピアノとスネアを抜き、バグパイプが装飾音（短い G）を付けてひとりで歌う。G から頭の A へ戻る
 */
(function () {
    const { repeat } = SoundKit;

    // A の主題（前半7小節は A' でも同じ）。付点で行進する
    const THEME_HEAD = `E5:6 A5:2 C#6:4 B5:4 | D6:6 B5:2 G5:8 | F#5:6 A5:2 D6:4 A5:4 | C#6:8 B5:4 A5:4 |
                        A5:6 C#6:2 E5:4 A5:4 | B5:6 D6:2 G5:4 B5:4 | E5:4 G5:4 B5:4 G5:4`;
    const THEME = `${THEME_HEAD} | A5:12 r:4`;
    // A' の終わり：G で止めて、B の Bm へ
    const THEME_TURN = `${THEME_HEAD} | B5:4 G5:4 D5:4 G5:4`;
    const CHORDS_HEAD = 'A | G | D | A | A | G | Em';
    const CHORDS_A = `${CHORDS_HEAD} | A`;
    const CHORDS_A2 = `${CHORDS_HEAD} | G`;

    // B：Bm から巡り、A で休憩へ
    const CHORDS_B = 'Bm | G | D | A | Bm | G | Em:8 G:8 | A';
    const SONG_B = `F#5:6 B5:2 D6:8 | D6:6 B5:2 G5:8 | A5:4 D6:4 F#5:8 | E5:6 A5:2 C#6:8 |
                    D6:6 C#6:2 B5:8 | B5:4 G5:4 D6:4 B5:4 | G5:4 E5:4 B5:4 D6:4 | C#6:12 A5:4`;

    // 休憩：バグパイプが装飾音を付けて、ひとりで歌う。G から頭の A へ戻る
    const CHORDS_C = 'A | D | G | A | Em | G | D:8 G:8 | G';
    const PIPES_C = `G5:1 A5:7 E5:8 | F#5:8 A5:8 | B5:8 G5:8 | G5:1 A5:15 |
                     B5:8 G5:8 | G5:8 B5:8 | F#5:8 G5:8 | D6:8 B5:8`;

    // ドローン：A と E を8小節伸ばし続ける
    const DRONE = '[A3,E4]:128';
    const KICK = repeat('x.......x.......', 8, '|');
    // 行進のスネア：A は付点で、B は16分の連打
    const SNARE_MARCH = repeat('x..x..x.x...x...', 7, '|') + '|x..x..x.x.x.x.x.';
    const SNARE_ROLL = repeat('x.xxx.x.x.xxx.x.', 7, '|') + '|x.xxx.xxx.xxxxxx';

    // バグパイプの丘：ドローンと低いオルガン、行進のスネア
    const bagpipe = {
        title: 'ヒースの丘の行進',
        tags: ['落ち着いた', '神秘的'],
        genre: 'ワールド',
        melody: ['lead'],
        bpm: 80,
        gain: 0.14,
        reverb: { seconds: 2.6, tone: 0.45 },
        delay: { time: 0.75, feedback: 0.25, tone: 2000, reverb: 0.3 },
        humanize: { time: 0.005, velocity: 0.08 },
        parts: {
            lead: { instrument: 'piano', volume: 0.49, pan: -0.08, decay: 0.85, brightness: 0.85, reverb: 0.25, delay: 0.08 },
            // 休憩の C で歌うバグパイプ：細く鼻にかかった音のつもりで、ビブラートをかけない
            pipes: { instrument: 'softLead', volume: 0.53, pan: 0.15, cutoff: 3000, vibrato: 0, attack: 0.02, release: 0.1, reverb: 0.35, delay: 0.15 },
            // A' で主旋律に重なるバグパイプ
            chanter: { instrument: 'softLead', volume: 0.35, pan: 0.2, cutoff: 3000, vibrato: 0, attack: 0.02, release: 0.1, reverb: 0.3 },
            drone: { instrument: 'pad', volume: 0.3, cutoff: 1200, attack: 1.5, release: 1.5, pan: -0.15, reverb: 0.4 },
            organ: { instrument: 'organ', mode: 'chords', center: 'A3', voices: 3, vibrato: 4, volume: 0.45, cutoff: 1600, pan: 0.1, reverb: 0.4 },
            drums: { instrument: 'drums', kit: 'soft', mode: 'drums', volume: 0.88, cutoff: 7000, levels: { kick: 0.55, snare: 0.35, tomLow: 0.45 } }
        },
        sections: {
            // イントロ：ドローンとスネアから。G で主題へ
            intro: {
                label: 'イントロ',
                chords: 'A | A | D | G',
                drone: '[A3,E4]:64',
                organ: '................|................|x---------------|x---------------',
                drums: { snare: repeat('x..x..x.x...x...', 3, '|') + '|x.xxx.xxx.xxxxxx', tomLow: repeat('x...............', 4, '|') }
            },
            A: {
                chords: CHORDS_A,
                lead: THEME,
                drone: DRONE,
                drums: { kick: KICK, snare: SNARE_MARCH }
            },
            // A'：バグパイプが主旋律に重なり、オルガンが支える。G で B へ
            A2: {
                label: "A'",
                chords: CHORDS_A2,
                lead: THEME_TURN,
                chanter: THEME_TURN,
                drone: DRONE,
                organ: 'hold',
                drums: { kick: KICK, snare: SNARE_MARCH }
            },
            // B：Bm から巡り、スネアが16分の連打で行進を強める
            B: {
                chords: CHORDS_B,
                lead: SONG_B,
                drone: DRONE,
                organ: 'hold',
                drums: { kick: KICK, snare: SNARE_ROLL }
            },
            // 休憩：ピアノとスネアを抜き、バグパイプがひとりで歌う。大太鼓だけが歩く
            C: {
                chords: CHORDS_C,
                pipes: PIPES_C,
                drone: DRONE,
                organ: 'hold',
                drums: { tomLow: repeat('x.......x.......', 8, '|') }
            }
        },
        intro: ['intro'],
        loop: ['A', 'A2', 'B', 'C']
    };

    SoundKit.register('catalog', { songs: { bagpipe } });
})();
