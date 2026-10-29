/**
 * 曲の一覧：路地裏のショーロ（ショーロ・ト長調の速い2拍子で、軽やかに）
 * カヴァキーニョ（明るいギター）が弾むように刻み、パンデイロ（シェイカーとタム）が16分で転がる
 * A' は7弦ギターの低音が、小節の後半で次の和音へ駆け下りる。B はホ短調へ。B' はフルートが主題に重なる
 * 休憩の C はピアノを抜き、フルートがひとりで歌う。パンデイロは低い音だけに
 */
(function () {
    const { repeat } = SoundKit;

    // A の主題。D7 で終えて、頭の G（B では Em）へ
    const THEME = `D5:2 G5:2 B5:4 A5:2 G5:2 D6:4 | D6:4 B5:2 G#5:2 E5:4 G#5:4 | C6:4 B5:2 A5:2 E5:4 A5:4 | F#5:4 A5:2 C6:2 D6:4 C6:4 |
                   B5:2 A5:2 G5:2 D5:2 G5:4 B5:4 | A5:4 F#5:2 D#5:2 F#5:4 B5:4 | G5:4 B5:4 C#6:4 G5:4 | F#5:8 A5:4 D5:4`;
    const CHORDS_A = 'G | E7 | Am | D7 | G | B7 | Em:8 A7:8 | D7';

    // 7弦ギターの低音：小節の後半で、次の和音の根音へ駆け下りる
    const BAIXARIA_A = `r:16 | r:8 E3:2 D3:2 B2:2 G#2:2 | r:16 | r:8 D3:2 C3:2 B2:2 A2:2 |
                        r:16 | r:8 B2:2 A2:2 F#2:2 D#2:2 | r:16 | r:8 D3:2 C3:2 B2:2 A2:2`;

    // B：ホ短調へ。B7 で次へ
    const CHORDS_B = 'Em | B7 | Em | E7 | Am | Em | F#7 | B7';
    const SONG_B = `B5:6 A5:2 G5:4 E5:4 | D#5:4 F#5:4 A5:4 B5:4 | G5:6 F#5:2 E5:8 | G#5:4 B5:4 D6:4 B5:4 |
                    C6:6 B5:2 A5:4 E5:4 | G5:4 B5:4 E5:8 | A#5:4 C#6:4 E5:4 F#5:4 | B5:8 A5:4 F#5:4`;
    const BAIXARIA_B = `r:16 | r:8 B2:2 A2:2 F#2:2 D#2:2 | r:16 | r:8 E3:2 D3:2 B2:2 G#2:2 |
                        r:16 | r:8 E3:2 D3:2 B2:2 G2:2 | r:16 | r:8 B2:2 A2:2 F#2:2 D#2:2`;

    // 休憩：フルートがひとりで歌う。D7 で頭の G へ戻る
    const CHORDS_C = 'G | Em | Am | D7 | G | E7 | Am:8 D7:8 | D7';
    const FLUTE_C = `D6:8 B5:8 | G5:8 E5:8 | C6:8 A5:8 | F#5:16 |
                     B5:8 G5:8 | G#5:8 B5:8 | C6:8 A5:8 | A5:8 C6:8`;

    // カヴァキーニョの刻み（8分で弾む）と、2拍子のベース
    const CAVACO = 'x...x.x.x...x.x.';
    const BASS = 'R:8 5:8';
    // パンデイロ：シェイカーで16分に転がし、タムで低く打つ
    const PANDEIRO = { shaker: repeat('x.ox'.repeat(4), 8, '|'), tom: repeat('x......xx.......', 8, '|') };

    // ショーロ：カヴァキーニョとフルート、7弦ギター
    const choro = {
        title: '路地裏のショーロ',
        tags: ['軽快', 'おしゃれ'],
        genre: 'ラテン',
        melody: ['lead'],
        bpm: 100,
        gain: 0.1,
        reverb: { seconds: 1.5, tone: 0.5 },
        delay: { time: 0.75, feedback: 0.15, tone: 2400 },
        humanize: { time: 0.005, velocity: 0.1 },
        parts: {
            lead: { instrument: 'piano', volume: 0.57, pan: -0.08, decay: 0.75, brightness: 0.85, reverb: 0.18, delay: 0.06 },
            flute: { instrument: 'flute', volume: 0.48, pan: 0.25, breath: 0.04, vibrato: 10, reverb: 0.3, delay: 0.12 },
            // 7弦ギターの低音の動き
            seven: { instrument: 'guitar', brightness: 0.5, volume: 0.8, pan: 0.2, reverb: 0.15 },
            // カヴァキーニョのつもり：明るいギターを高めに
            cavaco: { instrument: 'guitar', mode: 'chords', center: 'G4', voices: 3, strum: 0.004, brightness: 0.85, gate: 0.35, volume: 0.55, pan: -0.25, reverb: 0.15 },
            bass: { instrument: 'synthBass', mode: 'bass', octave: 2, wave: 'triangle', cutoff: 300, envelope: 0.6, decay: 0.3, sustain: 0.45, release: 0.06, volume: 0.6, gate: 0.7 },
            drums: { instrument: 'drums', kit: 'soft', mode: 'drums', volume: 0.8, cutoff: 7500, levels: { shaker: 0.35, tom: 0.5 } }
        },
        sections: {
            // イントロ：パンデイロから、カヴァキーニョが入り、7弦ギターが駆け下りる。D7 で主題へ
            intro: {
                label: 'イントロ',
                chords: 'G | E7 | Am | D7',
                cavaco: '................|................|' + CAVACO + '|' + CAVACO,
                seven: 'r:16 | r:16 | r:16 | r:8 D3:2 C3:2 B2:2 A2:2',
                bass: { pattern: 'r:16 | r:16 | R:8 5:8 | R:8 r:8' },
                drums: { shaker: repeat('x.ox'.repeat(4), 4, '|'), tom: repeat('x......xx.......', 4, '|') }
            },
            A: {
                chords: CHORDS_A,
                lead: THEME,
                cavaco: CAVACO,
                bass: BASS,
                drums: PANDEIRO
            },
            // A'：7弦ギターが駆け下りる。ベースは1拍目だけにして、場所を空ける
            A2: {
                label: "A'",
                chords: CHORDS_A,
                lead: THEME,
                seven: BAIXARIA_A,
                cavaco: CAVACO,
                bass: 'R:8 r:8',
                drums: PANDEIRO
            },
            // B：ホ短調へ
            B: {
                chords: CHORDS_B,
                lead: SONG_B,
                cavaco: CAVACO,
                bass: BASS,
                drums: PANDEIRO
            },
            // B'：フルートが主題に重なり、7弦ギターが駆け下りる。B7 で休憩へ
            B2: {
                label: "B'",
                chords: CHORDS_B,
                lead: SONG_B,
                flute: SONG_B,
                seven: BAIXARIA_B,
                cavaco: CAVACO,
                bass: 'R:8 r:8',
                drums: PANDEIRO
            },
            // 休憩：ピアノとシェイカーを抜き、フルートがひとりで歌う。D7 で頭の G へ戻る
            C: {
                chords: CHORDS_C,
                flute: FLUTE_C,
                cavaco: 'x.......x.......',
                bass: BASS,
                drums: { tom: repeat('x.......x.......', 8, '|') }
            },
            // 最後の A'：7弦ギターが駆け下り、D7 で頭の G へ戻る
            A3: {
                label: "A'",
                chords: CHORDS_A,
                lead: THEME,
                seven: BAIXARIA_A,
                cavaco: CAVACO,
                bass: 'R:8 r:8',
                drums: PANDEIRO
            }
        },
        intro: ['intro'],
        loop: ['A', 'A2', 'B', 'B2', 'C', 'A3']
    };

    SoundKit.register('catalog', { songs: { choro } });
})();
