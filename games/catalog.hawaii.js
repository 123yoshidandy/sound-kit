/**
 * 曲の一覧：波間のフラ（ハワイアン・ヘ長調で、のんびり）
 * ウクレレ（高めのギター）の軽いかき鳴らしと、フラのシェイカー。A の和音は F → D7 → G7 → C7 の回り道
 * A' はスチールギター（弦楽器を滑らせる）が答え、休憩の C はスチールギターが歌う
 */
(function () {
    const { repeat } = SoundKit;

    // A の主題（前半7小節は A' でも同じ）
    const THEME_HEAD = `C5:2 F5:2 A5:4 C6:8 | C6:4 A5:4 F#5:8 | B5:4 G5:4 D5:4 F5:4 | E5:8 G5:4 Bb5:4 |
                        A5:4 F5:4 C6:8 | D6:4 C6:4 A5:8 | B5:4 G5:4 Bb5:4 G5:4`;
    const THEME = `${THEME_HEAD} | F5:12 r:4`;
    const CHORDS_A = 'F | D7 | G7 | C7 | F | D7 | G7:8 C7:8 | F';

    // A' のスチールギター：主題が伸ばしている所で、下から滑り込む（和音の音か 9th に着く）
    const STEEL_A = `r:8 G4~A4:8 | r:8 E5~F#5:8 | r:8 A4~B4:8 | r:8 D5~E5:8 |
                     r:8 G4~A4:8 | r:8 B4~C5:8 | r:8 D5~E5:8 | r:4 G4~A4:12`;
    // 休憩のスチールギター：長く滑らせて歌う
    const STEEL_C = 'A4~C5:16 | C5~D5:8 A4:8 | Bb4~D5:16 | G4~Bb4:16 | A4~C5:16 | F#4~A4:16 | Bb4:8 G4:8 | G4~Bb4:16';

    // ウクレレ：8分を軽くかき鳴らす
    const UKE = 'x-..x-x-..x-x-..';
    const BASS = 'R:4 5:4 R:4 5:4';
    // フラ：シェイカーを8分で、リムを2拍目と4拍目に
    const HULA = {
        shaker: repeat('x.o.x.o.x.o.x.o.', 8, '|'),
        rim: repeat('....x.......x...', 8, '|'),
        kick: repeat('x.......x.......', 8, '|')
    };

    // ハワイアン：ウクレレとスチールギター
    const hawaii = {
        title: '波間のフラ',
        tags: ['明るい', '落ち着いた'],
        genre: 'ワールド',
        melody: ['lead'],
        bpm: 96,
        swing: 0.1,
        swingUnit: 2,
        gain: 0.093,
        reverb: { seconds: 1.8, tone: 0.5 },
        delay: { time: 0.75, feedback: 0.25, tone: 2400, reverb: 0.2 },
        humanize: { time: 0.006, velocity: 0.08 },
        parts: {
            lead: { instrument: 'piano', volume: 0.68, pan: -0.08, decay: 0.8, brightness: 0.8, reverb: 0.22, delay: 0.1 },
            // スチールギター：立ち上がりを速くし、ビブラートを深く
            steel: { instrument: 'strings', volume: 0.75, pan: 0.3, attack: 0.04, release: 0.4, brightness: 1, vibrato: 16, reverb: 0.35, delay: 0.2 },
            uke: { instrument: 'guitar', mode: 'chords', center: 'G4', voices: 3, strum: 0.012, brightness: 0.65, gate: 0.6, volume: 0.6, pan: -0.25, reverb: 0.2 },
            bass: { instrument: 'synthBass', mode: 'bass', octave: 2, wave: 'triangle', cutoff: 300, envelope: 0.6, decay: 0.5, sustain: 0.5, release: 0.1, volume: 0.5, gate: 0.8 },
            drums: { instrument: 'drums', kit: 'soft', mode: 'drums', volume: 0.7, cutoff: 7000, levels: { kick: 0.55, rim: 0.4, shaker: 0.5 } }
        },
        sections: {
            // イントロ：スチールギターが滑り込み、ウクレレが入る
            intro: {
                label: 'イントロ',
                chords: 'F | D7 | Gm7 | C7',
                steel: 'C5~F5:16 | E5~F#5:16 | D5~F5:16 | E5:8 G4~Bb4:8',
                uke: UKE,
                bass: { pattern: `r:16 | r:16 | ${BASS} | ${BASS}` },
                drums: { shaker: repeat('x.o.x.o.x.o.x.o.', 4, '|') }
            },
            A: {
                chords: CHORDS_A,
                lead: THEME,
                uke: UKE,
                bass: BASS,
                drums: HULA
            },
            // A'：スチールギターが答える
            A2: {
                label: "A'",
                chords: CHORDS_A,
                lead: THEME,
                steel: STEEL_A,
                uke: UKE,
                bass: BASS,
                drums: HULA
            },
            // B：IV の Bb から、長い音で。C7 で休憩へ
            B: {
                chords: 'Bb | Bb | F | F | G7 | G7 | C7 | C7',
                lead: `D6:8 Bb5:8 | F5:4 G5:4 Bb5:8 | A5:8 F5:8 | C5:4 F5:4 A5:8 |
                       B5:8 G5:8 | D5:4 F5:4 B5:8 | Bb5:8 G5:8 | E5:4 G5:4 C6:8`,
                uke: UKE,
                bass: BASS,
                drums: { ...HULA, rim: repeat('....x.......x.x.', 8, '|') }
            },
            // 休憩：主旋律を抜き、スチールギターが歌う。ウクレレは4分に。C7 で頭の F へ戻る
            C: {
                chords: 'F | D7 | Gm7 | C7 | F | D7 | Gm7 | C7',
                steel: STEEL_C,
                uke: 'x---x---x---x---',
                bass: 'R:8 5:8',
                drums: { shaker: repeat('x...x...x...x...', 8, '|') }
            }
        },
        intro: ['intro'],
        loop: ['A', 'A2', 'B', 'C']
    };

    SoundKit.register('catalog', { songs: { hawaii } });
})();
