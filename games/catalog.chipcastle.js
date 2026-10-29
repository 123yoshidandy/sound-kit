/**
 * 曲の一覧：雲の上の天空城（8bit・ニ長調で、軽やかに空をのぼる）
 * 矩形波2つ・三角波・ノイズのドラムだけで書く。主題は和音の音を跳ねるように上り、分散和音が主題と同じ和音をなぞる
 * 三角波のベースはオクターブを跳ねる。A' は duty 0.5 の対旋律が低く支え、B はト長調の方から巡る
 * B の2回目は分散和音が16分に速まって盛り上がる。休憩の C は主旋律を抜き、対旋律の矩形波がゆっくり歌う。最後は A で頭の D へ戻る
 */
(function () {
    const { repeat } = SoundKit;

    // A の主題（前半7小節は A' でも同じ）。和音の音を跳ねるように上る
    const THEME_HEAD = `F#5:2 A5:2 D6:4 C#6:2 D6:2 A5:4 | E6:6 C#6:2 A5:8 |
                        F#5:2 B5:2 D6:4 C#6:2 B5:2 F#5:4 | C#6:6 A5:2 F#5:8 |
                        G5:2 B5:2 D6:4 E6:2 D6:2 B5:4 | A5:4 F#5:4 A5:4 D6:4 | B5:4 G5:4 C#6:4 E6:4`;
    const THEME = `${THEME_HEAD} | D6:12 r:4`;
    // A' の終わり：A7 で止めて、B の G へ
    const THEME_TURN = `${THEME_HEAD} | C#6:4 E6:4 A5:4 G5:4`;
    // ループの終わり：A で止めて、頭の D へ
    const THEME_LAST = `${THEME_HEAD} | E6:4 C#6:4 A5:4 E5:4`;
    const CHORDS_HEAD = 'D | A/C# | Bm | F#m | G | D/F# | Em7:8 A:8';
    const CHORDS_A = `${CHORDS_HEAD} | D`;
    const CHORDS_A2 = `${CHORDS_HEAD} | A7`;
    const CHORDS_LAST = `${CHORDS_HEAD} | A`;

    // A' の対旋律：和音の音を低く伸ばす
    const COUNTER_A = 'A4:16 | A4:16 | B4:16 | A4:16 | B4:16 | A4:16 | G4:8 A4:8 | A4:16';

    // B：ト長調の方から巡り、A で次へ
    const CHORDS_B = 'G | A | F#m | Bm | Em | A | D/F#:8 G:8 | Em:8 A:8';
    const SONG_B = `D6:6 B5:2 G5:8 | E5:2 A5:2 C#6:4 E6:8 | A5:4 C#6:4 F#5:8 | D6:6 C#6:2 B5:8 |
                    G5:2 B5:2 E6:4 D6:2 B5:2 G5:4 | A5:4 C#6:4 E6:8 | D6:4 A5:4 B5:4 D6:4 | E6:4 B5:4 C#6:4 A5:4`;
    // B の2回目の対旋律
    const COUNTER_B = 'B4:16 | C#5:16 | C#5:16 | D5:16 | B4:16 | C#5:16 | A4:8 B4:8 | B4:8 C#5:8';

    // 休憩：対旋律の矩形波がゆっくり歌う。A で最後の A' へ
    const CHORDS_C = 'Bm | G | D | A | Bm | G | Em | A';
    const SOLO_C = `D6:8 B5:8 | B5:8 D6:8 | A5:8 F#5:8 | E5:16 |
                    F#5:8 B5:8 | D6:8 B5:8 | G5:8 B5:8 | C#6:8 E6:8`;

    // 分散和音は8分（B の2回目だけ16分）。三角波のベースはオクターブを跳ねる
    const ARP = '0:2 1 2 3 2 1 2 1';
    const ARP_FAST = '0:1 1 2 3 4 3 2 1 0 1 2 3 4 3 2 1';
    const BASS = 'R:2 R+:2 5:2 R+:2 R:2 R+:2 5:2 R+:2';
    const KICK = repeat('x.......x.......', 8, '|');
    const SNARE = repeat('....x.......x...', 8, '|');
    const HAT = repeat('x.o.x.o.x.o.x.o.', 8, '|');
    const DRUMS = { kick: KICK, snare: SNARE, hat: HAT };
    const DRUMS_FILL = { kick: KICK, hat: HAT, snare: repeat('....x.......x...', 7, '|') + '|....x.......x.xx' };

    // 天空の城：矩形波と三角波で、軽やかに
    const chipcastle = {
        title: '雲の上の天空城',
        tags: ['明るい', '軽快'],
        genre: 'チップチューン',
        melody: ['lead'],
        bpm: 136,
        gain: 0.11,
        reverb: { seconds: 1.4, tone: 0.4 },
        delay: { time: 0.75, feedback: 0.22, tone: 2200 },
        parts: {
            lead: { instrument: 'chip', wave: 'pulse', duty: 0.25, level: 0.2, vibrato: 10, sustain: 0.6, decay: 0.3, gate: 0.9, pan: -0.1, delay: 0.12, reverb: 0.1 },
            counter: { instrument: 'chip', wave: 'pulse', duty: 0.5, level: 0.08, vibrato: 8, sustain: 0.7, pan: 0.3, delay: 0.1, reverb: 0.1 },
            // 休憩の C で歌う矩形波
            solo: { instrument: 'chip', wave: 'pulse', duty: 0.5, level: 0.1, vibrato: 10, sustain: 0.7, pan: 0.15, delay: 0.15, reverb: 0.15 },
            arp: { instrument: 'chip', wave: 'pulse', duty: 0.25, level: 0.2, decay: 0.12, sustain: 0.2, mode: 'arp', from: 'D4', pan: 0.25, delay: 0.1 },
            bass: { instrument: 'chip', wave: 'triangle', level: 0.12, sustain: 0.85, mode: 'bass', octave: 2, gate: 0.7 },
            drums: { instrument: 'drums', kit: 'chip', mode: 'drums', volume: 0.6, levels: { kick: 0.9, snare: 0.7, hat: 0.6 } }
        },
        sections: {
            // イントロ：分散和音とベースから、ドラムが入る。A で主題へ
            intro: {
                label: 'イントロ',
                chords: 'D | G | Em | A',
                arp: ARP,
                bass: { pattern: `${BASS} | ${BASS} | ${BASS} | ${BASS}` },
                drums: { hat: repeat('x.o.x.o.x.o.x.o.', 4, '|'), snare: '................|................|................|....x.......x.xx' }
            },
            A: {
                chords: CHORDS_A,
                lead: THEME,
                arp: ARP,
                bass: BASS,
                drums: DRUMS
            },
            // A'：対旋律が低く支え、A7 で B へ
            A2: {
                label: "A'",
                chords: CHORDS_A2,
                lead: THEME_TURN,
                counter: COUNTER_A,
                arp: ARP,
                bass: BASS,
                drums: DRUMS_FILL
            },
            // B：ト長調の方から巡る
            B: {
                chords: CHORDS_B,
                lead: SONG_B,
                arp: ARP,
                bass: BASS,
                drums: DRUMS
            },
            // B の2回目：分散和音が16分に速まり、対旋律が加わる
            B2: {
                label: "B'",
                chords: CHORDS_B,
                lead: SONG_B,
                counter: COUNTER_B,
                arp: ARP_FAST,
                bass: BASS,
                drums: DRUMS_FILL
            },
            // 休憩：主旋律を抜き、矩形波がゆっくり歌う。分散和音は4分、ドラムはハイハットだけ
            C: {
                chords: CHORDS_C,
                solo: SOLO_C,
                arp: '0:4 1 2 1',
                bass: 'R:8 5:8',
                drums: { hat: HAT }
            },
            // 最後の A'：対旋律を足して、A で頭の D へ戻る
            A3: {
                label: "A'",
                chords: CHORDS_LAST,
                lead: THEME_LAST,
                counter: COUNTER_A,
                arp: ARP,
                bass: BASS,
                drums: DRUMS_FILL
            }
        },
        intro: ['intro'],
        loop: ['A', 'A2', 'B', 'B2', 'C', 'A3']
    };

    SoundKit.register('catalog', { songs: { chipcastle } });
})();
