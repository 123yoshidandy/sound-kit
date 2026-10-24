/**
 * 曲の一覧：西部劇の決闘（荒野の決闘・イ短調で、張りつめて）
 * ギターが馬の駆けるような「パカラッ」の刻みを続け、遠くで鐘が鳴る。口笛のつもりのフルートが、乾いた荒野に響く
 * A' は口笛が主題の伸ばしに答え、B はニ短調の方へ。トランペット（ブラス）が低く吹き込む
 * 休憩の C はピアノを抜き、口笛がひとりで歌う。鐘と心臓の鼓動（キック）だけが残る
 */
(function () {
    const { repeat } = SoundKit;

    // A の主題（前半7小節は最後の A でも同じ）
    const THEME_HEAD = `A5:4 E5:4 A5:2 B5:2 C6:4 | B5:4 A5:4 E5:8 | D6:6 B5:2 G5:8 | A5:4 C6:4 E5:8 |
                        F5:4 A5:4 C6:8 | B5:6 D6:2 G5:8 | G#5:4 B5:4 D6:4 B5:4`;
    const THEME = `${THEME_HEAD} | A5:12 r:4`;
    // ループの終わり：E7 で止めて、頭の Am へ戻る
    const THEME_LAST = `${THEME_HEAD} | E5:4 G#5:4 B5:4 G#5:4`;
    const CHORDS_A = 'Am | Am | G | Am | F | G | E7 | Am';
    const CHORDS_LAST = 'Am | Am | G | Am | F | G | E7 | E7';

    // A' の口笛：主題が伸ばしている所に答える
    const WHISTLE_A = 'r:16 | r:8 C6:4 A5:4 | r:8 B5:4 D6:4 | r:8 E5:4 A5:4 | r:8 F5:4 A5:4 | r:8 D6:4 B5:4 | r:16 | r:16';
    // 最後の A' のトランペット：低く伸ばして支える
    const BRASS_LOW = 'A4:16 | A4:16 | B4:16 | C5:16 | C5:16 | B4:16 | B4:16 | B4:16';

    // B：ニ短調の方へ。トランペットが低く吹き込む。E7 で休憩へ
    const CHORDS_B = 'Dm | Am | Dm | E7 | F | C | Dm:8 E7:8 | E7';
    const SONG_B = `D6:6 A5:2 F5:8 | E5:4 A5:4 C6:8 | D6:4 C6:4 A5:8 | B5:6 G#5:2 E5:8 |
                    C6:6 A5:2 F5:8 | E5:4 G5:4 C6:8 | F5:4 A5:4 G#5:4 B5:4 | E5:12 r:4`;
    const BRASS_B = 'r:8 D5:8 | r:8 C5:8 | r:8 F5:8 | r:8 D5:8 | r:8 A4:8 | r:8 G4:8 | r:16 | B4:16';

    // 休憩の口笛：ひとりで歌う
    const WHISTLE_C = `E5:8 A5:8 | B5:12 G5:4 | A5:8 C6:8 | B5:16 |
                       C6:8 E5:8 | D6:8 B5:8 | A5:8 F5:8 | G#5:8 B5:8`;
    // 遠くの鐘：2小節に1つ。和音に合わせて A と B を鳴らし分ける
    const TOLL_A = 'A4:16 | r:16 | B4:16 | r:16 | A4:16 | r:16 | B4:16 | r:16';
    const TOLL_C = repeat('A4:16 | r:16', 4, '|');

    // 馬の駆けるような刻みと、ベース
    const GALLOP = 'x..xx...x..xx...';
    const BASS = 'R:4 r:4 5:4 r:4';
    const KICK = repeat('x.......x.......', 8, '|');
    const RIM = repeat('x.....x...x.....', 8, '|');
    const DRUMS = { kick: KICK, rim: RIM };
    const DRUMS_FILL = { ...DRUMS, tomLow: repeat('................', 7, '|') + '|........x..x..x.' };

    // 決闘：駆けるギターと口笛、遠くの鐘
    const duel = {
        title: '西部劇の決闘',
        tags: ['緊張感'],
        genre: 'ゲーム音楽',
        melody: ['lead'],
        bpm: 92,
        gain: 0.115,
        reverb: { seconds: 2.4, tone: 0.45 },
        delay: { time: 0.75, feedback: 0.3, tone: 2000, reverb: 0.25 },
        humanize: { time: 0.006, velocity: 0.1 },
        parts: {
            lead: { instrument: 'piano', volume: 0.57, pan: -0.08, decay: 0.8, brightness: 0.8, reverb: 0.22, delay: 0.1 },
            // 口笛のつもり：息の音を消したフルート
            whistle: { instrument: 'flute', volume: 0.42, pan: 0.2, breath: 0, vibrato: 10, attack: 0.06, release: 0.25, reverb: 0.4, delay: 0.3 },
            // トランペット：ブラスを少し暗めに
            trumpet: { instrument: 'brass', volume: 0.57, pan: 0.3, brightness: 3.5, attack: 0.05, release: 0.2, vibrato: 10, reverb: 0.35 },
            // 遠くの鐘：低く長く、リバーブを深く
            toll: { instrument: 'bell', volume: 0.3, pan: -0.4, decay: 4, ratio: 2.7, reverb: 0.6, delay: 0.2 },
            guitar: { instrument: 'guitar', mode: 'chords', center: 'E4', voices: 3, strum: 0.008, brightness: 0.7, gate: 0.4, volume: 0.55, pan: 0.3, reverb: 0.2 },
            bass: { instrument: 'pluck', mode: 'bass', octave: 2, brightness: 0.3, sustain: 0.994, release: 0.08, volume: 0.9, gate: 0.6 },
            drums: { instrument: 'drums', kit: 'soft', mode: 'drums', volume: 0.55, cutoff: 6000, levels: { kick: 0.6, rim: 0.4, tomLow: 0.55 } }
        },
        sections: {
            // イントロ：遠くの鐘と口笛の呼び声から、ギターが駆け出す。E7 で主題へ
            intro: {
                label: 'イントロ',
                chords: 'Am | Am | F | E7',
                whistle: 'E5:2 A5:14 | r:16 | C6:4 B5:4 A5:8 | G#5:16',
                toll: 'A4:16 | r:16 | A4:16 | r:16',
                guitar: '................|................|' + GALLOP + '|' + GALLOP,
                bass: { pattern: `r:16 | r:16 | ${BASS} | ${BASS}` },
                drums: { kick: repeat('x.......x.......', 4, '|') }
            },
            A: {
                chords: CHORDS_A,
                lead: THEME,
                guitar: GALLOP,
                bass: BASS,
                drums: DRUMS
            },
            // A'：口笛が答え、鐘が遠くで鳴る
            A2: {
                label: "A'",
                chords: CHORDS_A,
                lead: THEME,
                whistle: WHISTLE_A,
                toll: TOLL_A,
                guitar: GALLOP,
                bass: BASS,
                drums: DRUMS_FILL
            },
            // B：ニ短調の方へ。トランペットが低く吹き込む。E7 で休憩へ
            B: {
                chords: CHORDS_B,
                lead: SONG_B,
                trumpet: BRASS_B,
                guitar: GALLOP,
                bass: BASS,
                drums: DRUMS_FILL
            },
            // 休憩：ピアノと刻みを抜き、口笛がひとりで歌う。鐘と鼓動だけが残る。E7 で頭の Am へ戻る
            C: {
                chords: 'Am | G | F | E7 | Am | G | F | E7',
                whistle: WHISTLE_C,
                toll: TOLL_C,
                guitar: 'x---------------',
                bass: 'R:16',
                drums: { kick: KICK }
            },
            // 最後の A'：トランペットが低く支え、口笛が答える。E7 で頭の Am へ戻る
            A3: {
                label: "A'",
                chords: CHORDS_LAST,
                lead: THEME_LAST,
                whistle: WHISTLE_A,
                trumpet: BRASS_LOW,
                guitar: GALLOP,
                bass: BASS,
                drums: DRUMS_FILL
            }
        },
        intro: ['intro'],
        loop: ['A', 'A2', 'B', 'C', 'A3']
    };

    SoundKit.register('catalog', { songs: { duel } });
})();
