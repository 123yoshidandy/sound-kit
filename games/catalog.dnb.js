/**
 * 曲の一覧：夜空のブレイクビーツ（軽めのドラムンベース・ヘ短調で、速く軽やかに）
 * 速いブレイクビーツ（キックが1拍目と3拍目の裏、スネアが2拍目と4拍目）の上で、主旋律は長い音で半分の速さに感じるように歌う
 * 低く伸ばすサブベースとパッドで、柔らかい「リキッド」風に。A' はパッドとベルを足し、B は変ニ長調の方へ開いて後半でハイハットを16分にする
 * 休憩の C はドラムを抜き、ビブラフォンとエレピだけで漂う
 */
(function () {
    const { repeat } = SoundKit;

    // A の主題（16小節）。長い音で、ゆっくり
    const THEME = `C6:8 Ab5:8 | G5:4 Ab5:4 Eb5:8 | F5:16 | Ab5:8 C6:8 | Db6:8 C6:4 Bb5:4 | F5:16 | G5:8 F5:8 | E5:8 G5:8 |
                   C6:8 Eb5:4 F5:4 | Ab5:16 | Ab5:4 C6:4 F5:8 | Eb5:16 | Db6:8 Bb5:8 | Ab5:8 F5:8 | F5:4 G5:4 Bb5:8 | E5:4 G5:4 Bb5:8`;
    const CHORDS_HALF = 'Fm7 | Fm7 | Dbmaj7 | Dbmaj7 | Bbm7 | Bbm7 | C7sus4 | C7';
    const CHORDS_A = `${CHORDS_HALF} | ${CHORDS_HALF}`;

    // A' のベル：主題が伸ばしている小節に答える
    const BELL = `r:16 | r:16 | r:8 C6:4 Ab5:4 | r:16 | r:16 | r:8 Ab5:4 Db6:4 | r:16 | r:16 |
                  r:16 | r:8 C6:4 F5:4 | r:16 | r:8 Ab5:4 F5:4 | r:16 | r:16 | r:16 | r:16`;

    // B の和音（8小節を2回）と主題（8小節。区間の後半で繰り返す）
    const CHORDS_B_HALF = 'Dbmaj7 | Eb | Cm7 | Fm7 | Bbm7 | Eb | Abmaj7 | Gm7b5:8 C7:8';
    const SONG_B = 'Ab5:8 F5:8 | G5:8 Bb5:8 | C6:8 Bb5:8 | Ab5:16 | F5:8 Db6:8 | Bb5:8 G5:8 | C6:16 | Bb5:8 G5:8';

    // エレピ：短い和音を、ブレイクビーツの合間に
    const STABS = '......x-......x-';
    const BASS = 'R:10 5:6';
    // ブレイクビーツ
    const KICK = repeat('x.........x.....', 16, '|');
    const SNARE = repeat('....x..o....x...', 16, '|');
    const HAT8 = repeat('x.x.x.x.x.x.x.x.', 16, '|');
    const HAT16 = repeat('x.x.x.x.x.x.x.x.', 8, '|') + '|' + repeat('xoxoxoxoxoxoxoxo', 8, '|');
    const BREAK = { kick: KICK, snare: SNARE, hat: HAT8 };

    // ドラムンベース：速いブレイクビーツと、長く歌う主旋律
    const dnb = {
        title: '夜空のブレイクビーツ',
        tags: ['おしゃれ', '軽快'],
        genre: 'エレクトロ',
        melody: ['lead'],
        bpm: 170,
        gain: 0.085,
        reverb: { seconds: 2.4, tone: 0.45 },
        delay: { time: 0.75, feedback: 0.3, tone: 2000, reverb: 0.3 },
        humanize: { time: 0.002, velocity: 0.05 },
        parts: {
            lead: { instrument: 'piano', volume: 0.68, pan: -0.05, decay: 1.1, brightness: 0.8, reverb: 0.3, delay: 0.15 },
            bell: { instrument: 'bell', volume: 0.25, pan: 0.35, decay: 1.6, reverb: 0.4, delay: 0.25 },
            vibes: { instrument: 'vibes', volume: 0.6, pan: 0.15, tremolo: 4, reverb: 0.45, delay: 0.25 },
            keys: { instrument: 'epiano', mode: 'chords', center: 'Eb4', voices: 4, volume: 0.5, pan: 0.25, reverb: 0.3, delay: 0.2 },
            pad: { instrument: 'pad', mode: 'chords', center: 'Ab3', voices: 3, volume: 0.45, pan: -0.15, cutoff: 1100, attack: 1, release: 1.5, reverb: 0.5 },
            bass: { instrument: 'synthBass', mode: 'bass', octave: 2, wave: 'triangle', cutoff: 220, envelope: 0.3, decay: 1, sustain: 0.7, release: 0.15, volume: 0.45, gate: 0.9 },
            drums: { instrument: 'drums', kit: 'soft', mode: 'drums', volume: 0.85, cutoff: 8000, levels: { kick: 0.65, snare: 0.45, hat: 0.3, shaker: 0.3 } }
        },
        sections: {
            // イントロ：パッドとエレピで始め、3小節目からブレイクビーツ。C7 で主題へ
            intro: {
                label: 'イントロ',
                chords: 'Fm7 | Dbmaj7 | Bbm7 | C7',
                pad: 'hold',
                keys: STABS,
                bass: { pattern: `r:16 | r:16 | ${BASS} | ${BASS}` },
                drums: {
                    kick: '................|................|x.........x.....|x.........x.....',
                    snare: '................|................|....x..o....x...|....x..o..x.xxxx',
                    hat: '................|................|' + repeat('x.x.x.x.x.x.x.x.', 2, '|')
                }
            },
            A: {
                chords: CHORDS_A,
                lead: THEME,
                keys: STABS,
                bass: BASS,
                drums: BREAK
            },
            // A'：パッドを敷き、ベルが答える
            A2: {
                label: "A'",
                chords: CHORDS_A,
                lead: THEME,
                bell: BELL,
                pad: 'hold',
                keys: STABS,
                bass: BASS,
                drums: BREAK
            },
            // B：変ニ長調の方へ開く。後半はハイハットを16分にして走る。C7 で休憩へ
            B: {
                chords: `${CHORDS_B_HALF} | ${CHORDS_B_HALF}`,
                lead: SONG_B,
                pad: 'hold',
                keys: STABS,
                bass: BASS,
                drums: { kick: KICK, snare: SNARE, hat: HAT16 }
            },
            // 休憩：ドラムを抜き、ビブラフォンとエレピだけで漂う。C7 で頭の Fm7 へ戻る
            C: {
                chords: 'Fm7 | Dbmaj7 | Bbm7 | C7sus4:8 C7:8 | Fm7 | Dbmaj7 | Bbm7 | C7',
                vibes: 'C6:16 | Ab5:16 | F5:8 Db6:8 | G5:8 E5:8 | Eb5:8 G5:8 | F5:8 C6:8 | Db6:8 Bb5:8 | Bb5:8 G5:8',
                keys: 'x---------------',
                pad: 'hold',
                bass: 'R:16',
                drums: { shaker: repeat('................', 4, '|') + '|' + repeat('x.o.x.o.x.o.x.o.', 4, '|') }
            }
        },
        intro: ['intro'],
        loop: ['A', 'A2', 'B', 'C']
    };

    SoundKit.register('catalog', { songs: { dnb } });
})();
