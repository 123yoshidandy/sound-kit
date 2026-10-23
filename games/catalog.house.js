/**
 * 曲の一覧：ミッドナイト・フロア（ディープハウス・軽めでおしゃれ）
 */
(function () {
    const { repeat } = SoundKit;

    // 4つ打ちのキックと、2・4拍のクラップ、裏拍のオープンハイハット
    const KICK = 'x...x...x...x...';
    const CLAP = '....x.......x...';
    const OPEN = '..x...x...x...x.';
    const SHAKER = 'o.ox' + 'o.ox' + 'o.ox' + 'o.ox';
    // エレピの刻み（1拍目と、2拍目の裏・3拍目の裏の手前ではねる）
    const STAB = 'x-----x--x------';
    const BASS = 'R:2 r:1 R:1 r:2 R:2 r:2 5:2 r:2 R+:2';

    // ディープハウス：エレピの 9th の和音と、シンセベース、軽い4つ打ち
    const house = {
        title: 'ミッドナイト・フロア',
        description: 'エレピとシンセベース・軽やかでおしゃれ',
        genre: 'エレクトロ',
        melody: ['lead'],
        bpm: 122,
        gain: 0.079,
        reverb: { seconds: 2.2, tone: 0.45 },
        delay: { time: 0.75, feedback: 0.3, tone: 2400, reverb: 0.25 },
        humanize: { time: 0.003, velocity: 0.06 },
        parts: {
            lead: { instrument: 'piano', volume: 0.64, pan: -0.1, decay: 0.8, brightness: 0.8, reverb: 0.22, delay: 0.18 },
            keys: { instrument: 'epiano', mode: 'chords', center: 'E4', voices: 4, volume: 0.32, pan: 0.15, chorus: { depth: 0.002, rate: 0.5, mix: 0.4 }, autopan: { rate: 0.25, depth: 0.2 }, reverb: 0.25, delay: 0.12 },
            pad: { instrument: 'pad', mode: 'chords', center: 'C4', voices: 4, volume: 0.32, cutoff: 1100, attack: 1, reverb: 0.45 },
            vibes: { instrument: 'vibes', volume: 0.55, pan: 0.25, reverb: 0.35, delay: 0.2 },
            bell: { instrument: 'bell', volume: 0.42, pan: 0.3, reverb: 0.35, delay: 0.2 },
            bass: { instrument: 'synthBass', mode: 'bass', octave: 2, cutoff: 360, envelope: 2.5, volume: 0.75, gate: 0.85 },
            drums: { instrument: 'drums', kit: 'soft', mode: 'drums', volume: 0.62, cutoff: 9000, levels: { kick: 0.75, clap: 0.6, openHat: 0.45, shaker: 0.4 } }
        },
        sections: {
            intro: {
                label: 'イントロ',
                chords: 'Am9 | Dm9 | G9 | E7sus4:8 E7:8',
                keys: STAB,
                bass: { pattern: 'r:16 | r:16 | ' + BASS + ' | ' + BASS },
                drums: {
                    openHat: repeat(OPEN, 4, '|'),
                    kick: '................|................|' + KICK + '|' + KICK,
                    clap: '................|................|................|....x.......x.xx'
                }
            },
            A: {
                chords: 'Am9 | Dm9 | G9 | Cmaj9 | Fmaj9 | Dm9 | Em7 | Am9',
                lead: `r:2 E5:2 G5:3 A5:3 G5:2 E5:4 | r:2 F5:2 A5:3 C6:3 A5:2 E5:4 | r:2 D5:2 F5:3 A5:3 B5:2 G5:4 | E5:6 D5:2 r:8 |
                       r:2 C5:2 E5:3 G5:3 A5:2 C6:4 | C6:3 A5:3 F5:2 E5:8 | r:2 G5:2 B5:3 D6:3 B5:2 G5:4 | A5:6 G5:2 E5:4 r:4`,
                keys: STAB,
                bass: BASS,
                drums: { kick: repeat(KICK, 8, '|'), clap: repeat(CLAP, 8, '|'), openHat: repeat(OPEN, 8, '|') }
            },
            // 2回目：後半の旋律を変え、E7 で B へ向かう
            A2: {
                label: "A'",
                chords: 'Am9 | Dm9 | G9 | Cmaj9 | Fmaj9 | Dm9 | Em7 | E7',
                lead: `r:2 E5:2 G5:3 A5:3 G5:2 E5:4 | r:2 F5:2 A5:3 C6:3 A5:2 E5:4 | r:2 D5:2 F5:3 A5:3 B5:2 G5:4 | E5:6 D5:2 r:8 |
                       r:2 C5:2 E5:3 G5:3 A5:2 C6:4 | D6:3 C6:3 A5:2 D5:8 | r:2 E5:2 G5:3 B5:3 D6:2 B5:4 | G#5:6 E5:2 D5:4 B4:4`,
                keys: STAB,
                bass: BASS,
                drums: {
                    kick: repeat(KICK, 8, '|'),
                    clap: repeat(CLAP, 7, '|') + '|....x.......x.xx',
                    openHat: repeat(OPEN, 8, '|')
                }
            },
            // サビ：IV から始めて、高めの長い音で歌う。パッドを足す
            B: {
                chords: 'Fmaj9 | G9 | Em7 | Am9 | Fmaj9 | G9 | Em7 | E7sus4:8 E7:8',
                lead: `C6:6 A5:2 G5:4 A5:4 | D6:6 B5:2 A5:4 G5:4 | B5:6 G5:2 E5:4 D5:4 | E5:8 r:4 G5:2 A5:2 |
                       C6:6 A5:2 G5:4 A5:4 | D6:6 B5:2 A5:4 F5:4 | G5:6 E5:2 B5:8 | A5:6 B5:2 G#5:4 E5:4`,
                keys: STAB,
                pad: 'hold',
                bass: BASS,
                drums: { kick: repeat(KICK, 8, '|'), clap: repeat(CLAP, 8, '|'), openHat: repeat(OPEN, 8, '|') }
            },
            // 休憩：キックとクラップとピアノを抜き、ビブラフォンが短く歌う。最後の小節でキックが戻る
            C: {
                chords: 'Dm9 | Em7 | Fmaj9 | Em7 | Dm9 | Em7 | Fmaj9 | G9',
                vibes: `r:4 A5:4 E5:8 | r:4 B5:4 G5:8 | r:4 C6:4 G5:8 | r:4 B5:4 E5:8 |
                        r:4 A5:4 D5:8 | r:4 G5:4 B5:8 | r:4 G5:4 C6:8 | r:4 B5:4 D6:8`,
                keys: 'x-------x-------',
                pad: 'hold',
                bass: 'R:12 5:4',
                drums: {
                    openHat: repeat(OPEN, 8, '|'),
                    kick: repeat('................', 7, '|') + '|' + KICK,
                    clap: repeat('................', 7, '|') + '|....x.......x.xx'
                }
            },
            // A に、ベルの短い合いの手を足す
            A3: {
                label: 'A',
                chords: 'Am9 | Dm9 | G9 | Cmaj9 | Fmaj9 | Dm9 | Em7 | Am9',
                lead: `r:2 E5:2 G5:3 A5:3 G5:2 E5:4 | r:2 F5:2 A5:3 C6:3 A5:2 E5:4 | r:2 D5:2 F5:3 A5:3 B5:2 G5:4 | E5:6 D5:2 r:8 |
                       r:2 C5:2 E5:3 G5:3 A5:2 C6:4 | C6:3 A5:3 F5:2 E5:8 | r:2 G5:2 B5:3 D6:3 B5:2 G5:4 | A5:6 G5:2 E5:4 r:4`,
                bell: 'r:12 E6:4 | r:12 D6:4 | r:12 D6:4 | r:8 E6:4 G5:4 | r:12 E6:4 | r:12 A5:4 | r:12 B5:4 | r:16',
                keys: STAB,
                bass: BASS,
                drums: { kick: repeat(KICK, 8, '|'), clap: repeat(CLAP, 8, '|'), openHat: repeat(OPEN, 8, '|') }
            },
            // サビの2回目：シェイカーで細かさを足す。E7 で終えて、頭の Am9 へ戻る
            B2: {
                label: "B'",
                chords: 'Fmaj9 | G9 | Em7 | Am9 | Fmaj9 | G9 | Em7 | E7sus4:8 E7:8',
                lead: `C6:6 A5:2 G5:4 A5:4 | D6:6 B5:2 A5:4 G5:4 | B5:6 G5:2 E5:4 D5:4 | E5:8 r:4 G5:2 A5:2 |
                       C6:6 A5:2 G5:4 A5:4 | D6:6 B5:2 A5:4 F5:4 | G5:6 E5:2 B5:8 | A5:6 B5:2 G#5:4 E5:4`,
                keys: STAB,
                pad: 'hold',
                bass: BASS,
                drums: {
                    kick: repeat(KICK, 8, '|'),
                    clap: repeat(CLAP, 7, '|') + '|....x.......x.xx',
                    openHat: repeat(OPEN, 8, '|'),
                    shaker: repeat(SHAKER, 8, '|')
                }
            }
        },
        intro: ['intro'],
        loop: ['A', 'A2', 'B', 'C', 'A3', 'B2']
    };

    SoundKit.register('catalog', { songs: { house } });
})();
