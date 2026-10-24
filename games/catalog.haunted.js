/**
 * 曲の一覧：おばけ屋敷のワルツ（ニ短調の3拍子で、ちょっと不気味に、ちょっと愉快に）
 * 3拍子なので、1小節は12ステップ（16分音符12個）
 * オルガンの「ズン・チャッ・チャッ」に、テルミン（滑らせる softLead）とシロフォン（骸骨の踊り）
 * B はテルミンが歌い、C はシロフォンが踊る。最後の A' はシロフォンが答える
 */
(function () {
    const { repeat } = SoundKit;

    // A の主題（16小節）
    const THEME = `A4:4 D5:4 F5:4 | A5:8 G#5:2 A5:2 | G5:4 E5:4 C#5:4 | E5:8 r:4 |
                   A4:4 C#5:4 E5:4 | G5:8 E5:4 | F5:4 E5:4 D5:4 | A4:8 r:4 |
                   A4:4 D5:4 F5:4 | A5:4 C6:4 F#5:4 | G5:8 Bb5:4 | D6:8 r:4 |
                   F5:4 A5:4 D6:4 | C#6:4 E5:4 G5:4 | F5:8 E5:4 | E5:4 C#5:4 A4:4`;
    const CHORDS_A = 'Dm | Dm | A7 | A7 | A7 | A7 | Dm | Dm | Dm | D7 | Gm | Gm | Dm/A | A7 | Dm | A7';

    // 最後の A' のシロフォン：主題が休む所に答える
    const XYLO_A = `r:12 | r:8 D6:2 A5:2 | r:12 | r:8 C#6:2 E6:2 | r:12 | r:12 | r:12 | r:8 F5:2 A5:2 |
                    r:12 | r:12 | r:12 | r:8 Bb5:2 D6:2 | r:12 | r:12 | r:12 | r:12`;

    // ズン（ベース）・チャッ・チャッ（オルガン）
    const PAH = '....x-..x-..';
    const BASS = 'R:4 r:8';
    const knock = (bars) => ({ rim: repeat('....x.......', bars, '|'), kick: repeat('x...........', bars, '|') });

    // おばけ屋敷：オルガンのワルツと、テルミンとシロフォン
    const haunted = {
        title: 'おばけ屋敷のワルツ',
        tags: ['神秘的', '軽快'],
        genre: 'ゲーム音楽',
        melody: ['lead'],
        bpm: 132,
        stepsPerBar: 12,
        gain: 0.1,
        reverb: { seconds: 2.6, tone: 0.45 },
        delay: { time: 0.75, feedback: 0.3, tone: 2200, reverb: 0.3 },
        humanize: { time: 0.006, velocity: 0.08 },
        parts: {
            lead: { instrument: 'piano', volume: 0.54, pan: -0.08, decay: 0.7, brightness: 0.8, reverb: 0.25, delay: 0.1 },
            // テルミン：ゆっくり立ち上がり、深く揺らして、滑らせる
            theremin: { instrument: 'softLead', volume: 0.75, pan: 0.2, attack: 0.15, release: 0.4, vibrato: 30, reverb: 0.45, delay: 0.2 },
            xylo: { instrument: 'xylophone', volume: 0.6, pan: 0.3, reverb: 0.3, delay: 0.12 },
            organ: { instrument: 'organ', mode: 'chords', center: 'F4', voices: 3, vibrato: 6, volume: 1.13, gate: 0.5, pan: -0.2, reverb: 0.3 },
            bass: { instrument: 'pluck', mode: 'bass', octave: 2, brightness: 0.3, sustain: 0.994, release: 0.1, volume: 1, gate: 0.6 },
            drums: { instrument: 'drums', kit: 'soft', mode: 'drums', volume: 0.7, cutoff: 6000, levels: { kick: 0.6, rim: 0.4 } }
        },
        sections: {
            // イントロ：テルミンが滑り降りて、オルガンが入る
            intro: {
                label: 'イントロ',
                chords: 'Dm | Dm | Gm | A7',
                theremin: 'A5~D5:12 | r:12 | D5~Bb5:12 | A5~C#5:12',
                organ: '............|' + repeat(PAH, 3, '|'),
                bass: { pattern: `r:12 | ${BASS} | ${BASS} | ${BASS}` }
            },
            A: {
                chords: CHORDS_A,
                lead: THEME,
                organ: PAH,
                bass: BASS,
                drums: knock(16)
            },
            // B：主旋律を休ませ、テルミンが滑りながら歌う
            B: {
                chords: 'Bb | Bb | A7 | A7 | Gm | Gm | A7 | A7',
                theremin: 'F5~D6:12 | D6:8 C6:4 | C#6:12 | A5~E5:12 | D5~Bb5:12 | A5:8 G5:4 | E5~G5:12 | C#5~A5:12',
                organ: PAH,
                bass: BASS,
                drums: knock(8)
            },
            // 休憩：骸骨の踊り。シロフォンが跳ね、オルガンは伸ばす
            C: {
                chords: 'Dm | A7 | Dm | A7 | Dm | A7 | Dm | A7',
                xylo: repeat('D5:2 F5:2 A5:2 r:2 A5:4 | E5:2 G5:2 C#6:2 r:2 A5:4', 4, '|'),
                organ: 'x-----------',
                bass: BASS,
                drums: { rim: repeat('x.x.....x...', 8, '|') }
            },
            // 最後の A'：シロフォンが答える
            A2: {
                label: "A'",
                chords: CHORDS_A,
                lead: THEME,
                xylo: XYLO_A,
                organ: PAH,
                bass: BASS,
                drums: knock(16)
            }
        },
        intro: ['intro'],
        loop: ['A', 'B', 'C', 'A2']
    };

    SoundKit.register('catalog', { songs: { haunted } });
})();
