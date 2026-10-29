/**
 * 曲の一覧：風わたる大草原（モンゴルの草原・イ短調の五音音階で、ゆったり）
 * 低い A と E のドローンが地平線のように続き、トプショール（ギター）が馬の歩みの「タッタカ」で刻む。蹄の音（リム）が遠くで響く
 * A' は馬頭琴（弦楽器）が、主題の伸ばしに滑らせながら低く答える。B はハ長調の方へ開き、馬頭琴が和音の音を長く伸ばして支える
 * 休憩の C はピアノを抜き、馬頭琴が深いビブラートで滑らせながら、ひとりで歌う
 */
(function () {
    const { repeat } = SoundKit;

    // A の主題。五音音階（A C D E G）を中心に、Esus4 から Am へ
    const THEME = `E5:6 A5:2 C6:4 A5:4 | D6:8 B5:4 G5:4 | A5:4 G5:2 E5:2 A5:8 | G5:6 E5:2 D5:4 E5:4 |
                   E5:4 G5:4 C6:8 | D6:6 B5:2 G5:4 A5:4 | B5:4 A5:4 E5:8 | A5:12 r:4`;
    const CHORDS_A = 'Am | G | Am | Em | C | G | Esus4 | Am';

    // A' の馬頭琴：主題が伸ばしている所に、滑らせながら低く答える
    const MORIN_A = 'r:16 | r:16 | r:8 E4~G4:4 E4:4 | r:16 | r:8 G4:4 E4:4 | r:16 | r:8 A4~B4:4 G4:4 | r:4 E4~A4:12';

    // B：ハ長調の方へ開き、Esus4 で休憩へ。馬頭琴が和音の音を長く伸ばす
    const CHORDS_B = 'C | G | Am | Em | C | G | Dsus2 | Esus4';
    const SONG_B = `G5:4 C6:4 D6:8 | B5:6 A5:2 G5:8 | A5:4 C6:4 E5:8 | G5:8 E5:4 D5:4 |
                    E5:6 G5:2 C6:8 | D6:8 B5:4 G5:4 | A5:6 G5:2 E5:4 D5:4 | B5:8 A5:4 E5:4`;
    const MORIN_B = 'E4:16 | D4:16 | C4:16 | B3:16 | C4:16 | D4:16 | A3:16 | B3:16';

    // 休憩：馬頭琴がひとりで歌う。Esus4 で頭の Am へ戻る
    const CHORDS_C = 'Am | C | G | Am | Am | C | G | Esus4';
    const MORIN_C = `E5~A5:8 C6:4 A5:4 | G5:8 E5:8 | D5~G5:8 A5:4 G5:4 | E5:4 A5:12 |
                     A5~C6:8 D6:4 C6:4 | G5:8 E5:8 | D6:8 B5:4 G5:4 | A5:8 E5:8`;

    // 馬の歩み：3・3・2 で弾む刻みと、蹄の音
    const GAIT = 'x..x..x.x..x..x.';
    const HOOVES = { rim: repeat(GAIT, 8, '|'), tomLow: repeat('x.......x.......', 8, '|') };
    const DRONE = '[A2,E3]:16';
    const BASS = 'R:8 5:8';

    // モンゴルの草原：馬頭琴とドローン、馬の歩み
    const steppe = {
        title: '風わたる大草原',
        tags: ['落ち着いた', '神秘的'],
        genre: 'ワールド',
        melody: ['lead'],
        bpm: 80,
        gain: 0.12,
        reverb: { seconds: 2.8, tone: 0.45 },
        delay: { time: 0.75, feedback: 0.3, tone: 2000, reverb: 0.3 },
        humanize: { time: 0.007, velocity: 0.1 },
        parts: {
            lead: { instrument: 'piano', volume: 0.55, pan: -0.08, decay: 0.85, brightness: 0.75, reverb: 0.28, delay: 0.1 },
            // 馬頭琴のつもり：弦楽器に深いビブラート。C ではひとりで歌う
            morin: { instrument: 'strings', volume: 0.9, pan: 0.22, attack: 0.12, release: 0.4, brightness: 0.8, vibrato: 16, reverb: 0.4, delay: 0.12 },
            // 馬頭琴の低い答えと伸ばし（A'・B）
            morinLow: { instrument: 'strings', volume: 0.6, pan: 0.28, attack: 0.15, release: 0.45, brightness: 0.7, vibrato: 14, reverb: 0.4, delay: 0.1 },
            // トプショールのつもり：ギターを馬の歩みで刻む
            lute: { instrument: 'guitar', mode: 'chords', center: 'D4', voices: 3, strum: 0.006, brightness: 0.55, gate: 0.4, volume: 0.5, pan: -0.25, reverb: 0.2 },
            drone: { instrument: 'pad', volume: 0.28, cutoff: 600, attack: 1.5, release: 2, reverb: 0.4 },
            bass: { instrument: 'synthBass', mode: 'bass', octave: 2, wave: 'triangle', cutoff: 280, envelope: 0.4, decay: 0.5, sustain: 0.55, release: 0.2, volume: 0.45, gate: 0.85 },
            drums: { instrument: 'drums', kit: 'soft', mode: 'drums', volume: 0.8, cutoff: 6000, levels: { rim: 0.3, tomLow: 0.5 } }
        },
        sections: {
            // イントロ：ドローンと蹄の音から、馬頭琴が遠くで呼ぶ。Esus4 で主題へ
            intro: {
                label: 'イントロ',
                chords: 'Am | Am | G | Esus4',
                morin: 'r:16 | E4~A4:8 C5:4 A4:4 | G4:8 B4:4 D5:4 | B4:8 E4:8',
                drone: DRONE,
                drums: { rim: repeat(GAIT, 4, '|') }
            },
            A: {
                chords: CHORDS_A,
                lead: THEME,
                lute: GAIT,
                drone: DRONE,
                bass: BASS,
                drums: { rim: repeat(GAIT, 8, '|') }
            },
            // A'：馬頭琴が低く答え、低い太鼓が足並みをそろえる
            A2: {
                label: "A'",
                chords: CHORDS_A,
                lead: THEME,
                morinLow: MORIN_A,
                lute: GAIT,
                drone: DRONE,
                bass: BASS,
                drums: HOOVES
            },
            // B：ハ長調の方へ開き、馬頭琴が長く伸ばして支える。Esus4 で休憩へ
            B: {
                chords: CHORDS_B,
                lead: SONG_B,
                morinLow: MORIN_B,
                lute: GAIT,
                drone: DRONE,
                bass: BASS,
                drums: HOOVES
            },
            // 休憩：ピアノと蹄を抜き、馬頭琴がひとりで歌う。刻みは小節の頭だけ。Esus4 で頭の Am へ戻る
            C: {
                chords: CHORDS_C,
                morin: MORIN_C,
                lute: 'x-------x-------',
                drone: DRONE,
                bass: 'R:16',
                drums: { tomLow: repeat('x...............', 8, '|') }
            }
        },
        intro: ['intro'],
        loop: ['A', 'A2', 'B', 'C']
    };

    SoundKit.register('catalog', { songs: { steppe } });
})();
