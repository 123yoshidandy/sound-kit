/**
 * 曲の一覧：雅の調べ（雅楽風・ニの律の音階で、ゆっくり）
 * 笙（オルガン）が sus2・sus4 の澄んだ和音を、息を継ぐように長く伸ばす。篳篥のつもりのピアノが、低い D のドローンの上で節を歌う
 * A' は箏（柔らかいギター）が、小節の後半に短く分散和音を添える。B はホ短調の方へ移り、鞨鼓（タム）が細かく打ち込む
 * 休憩の C はピアノを抜き、龍笛（フルート）が滑らせながらひとりで歌う。太鼓（低いタム）と鉦鼓（リム）だけが残る
 */
(function () {
    const { repeat } = SoundKit;

    // A の主題。律の音階（D E G A B）だけで書き、Dsus2 に戻る
    const THEME = `A5:6 B5:2 A5:4 E5:4 | D6:8 B5:4 A5:4 | G5:4 A5:2 G5:2 E5:8 | D5:4 E5:4 A5:8 |
                   B5:6 A5:2 G5:4 E5:4 | A5:8 D6:4 B5:4 | A5:6 G5:2 E5:4 D5:4 | E5:4 D5:12`;
    const CHORDS_A = 'Dsus2 | Gsus2 | Asus4 | Dsus2 | Em7 | Gsus2 | Asus4 | Dsus2';

    // B：ホ短調の方へ移り、Asus4 で休憩へ
    const CHORDS_B = 'Em7 | Cadd9 | Gsus2 | Dsus2 | Em7 | Cadd9 | Asus4 | Asus4';
    const SONG_B = `G5:8 B5:4 D6:4 | E5:4 G5:4 D6:8 | B5:6 A5:2 G5:8 | A5:12 r:4 |
                    E5:4 G5:4 B5:8 | C6:6 D6:2 G5:8 | A5:8 E5:8 | D5:8 E5:8`;

    // 休憩：龍笛がひとりで、滑らせながら歌う。Asus4 で頭の Dsus2 へ戻る
    const CHORDS_C = 'Dsus2 | Gsus2 | Dsus2 | Asus4 | Dsus2 | Gsus2 | Em7 | Asus4';
    const RYUTEKI_C = `E5~A5:8 B5:4 A5:4 | D6:8 B5:8 | A5:8 E5:8 | D5:12 E5:4 |
                       A5:8 B5:4 D6:4 | D6:8 A5:8 | G5:8 E5:8 | E5:8 A5:4 E5:4`;

    // 箏：小節の後半に、短く分散和音を添える
    const KOTO = 'r:8 0:2 1:2 2:4';
    const DRONE = 'D3:16';
    // 太鼓は2小節に1つ、鉦鼓は3拍目。鞨鼓は小節の終わりで細かく打ち込む
    const TAIKO = repeat('x...............|................', 4, '|');
    const SHOKO = repeat('........x.......', 8, '|');
    const KAKKO = repeat('............x.xx', 8, '|');

    // 雅楽風：笙の和音と篳篥、龍笛
    const gagaku = {
        title: '雅の調べ',
        tags: ['神秘的', '落ち着いた'],
        genre: 'ワールド',
        melody: ['lead'],
        bpm: 66,
        gain: 0.15,
        reverb: { seconds: 3.2, tone: 0.4 },
        delay: { time: 0.75, feedback: 0.3, tone: 1800, reverb: 0.3 },
        humanize: { time: 0.008, velocity: 0.1 },
        parts: {
            lead: { instrument: 'piano', volume: 0.53, pan: -0.08, decay: 0.9, brightness: 0.7, reverb: 0.32, delay: 0.1 },
            // 龍笛のつもり：息の音を多めにしたフルート
            ryuteki: { instrument: 'flute', volume: 0.37, pan: 0.22, breath: 0.08, vibrato: 6, attack: 0.08, release: 0.3, reverb: 0.45, delay: 0.15 },
            // 笙のつもり：オルガンの澄んだ和音を、ゆっくり伸ばす
            sho: { instrument: 'organ', mode: 'chords', center: 'D4', voices: 3, volume: 0.38, pan: 0.12, vibrato: 2, release: 0.6, cutoff: 2400, reverb: 0.5 },
            // 箏のつもり：柔らかいギターの短い分散和音
            koto: { instrument: 'guitar', mode: 'arp', from: 'D4', brightness: 0.45, volume: 0.4, pan: -0.28, reverb: 0.35, delay: 0.15 },
            drone: { instrument: 'pad', volume: 0.3, cutoff: 600, attack: 1.5, release: 2, reverb: 0.45 },
            drums: { instrument: 'drums', kit: 'soft', mode: 'drums', volume: 0.67, cutoff: 5000, levels: { tomLow: 0.7, rim: 0.3, tom: 0.35 } }
        },
        sections: {
            // イントロ：ドローンと笙から。龍笛が遠くで呼び、Asus4 で主題へ
            intro: {
                label: 'イントロ',
                chords: 'Dsus2 | Dsus2 | Gsus2 | Asus4',
                sho: 'hold',
                ryuteki: 'r:16 | r:16 | A5:8 B5:8 | A5:16',
                drone: DRONE,
                drums: { tomLow: 'x...............|................|x...............|................' }
            },
            A: {
                chords: CHORDS_A,
                lead: THEME,
                sho: 'hold',
                drone: DRONE,
                drums: { tomLow: TAIKO, rim: SHOKO }
            },
            // A'：箏が分散和音を添える
            A2: {
                label: "A'",
                chords: CHORDS_A,
                lead: THEME,
                sho: 'hold',
                koto: KOTO,
                drone: DRONE,
                drums: { tomLow: TAIKO, rim: SHOKO }
            },
            // B：ホ短調の方へ。鞨鼓が細かく打ち込む。Asus4 で休憩へ
            B: {
                chords: CHORDS_B,
                lead: SONG_B,
                sho: 'hold',
                koto: KOTO,
                drone: 'D3:16 | C3:16 | D3:16 | D3:16 | E3:16 | C3:16 | A2:16 | A2:16',
                drums: { tomLow: TAIKO, rim: SHOKO, tom: KAKKO }
            },
            // 休憩：ピアノと箏を抜き、龍笛がひとりで歌う。Asus4 で頭の Dsus2 へ戻る
            C: {
                chords: CHORDS_C,
                ryuteki: RYUTEKI_C,
                sho: 'hold',
                drone: DRONE,
                drums: { tomLow: TAIKO, rim: SHOKO }
            }
        },
        intro: ['intro'],
        loop: ['A', 'A2', 'B', 'C']
    };

    SoundKit.register('catalog', { songs: { gagaku } });
})();
