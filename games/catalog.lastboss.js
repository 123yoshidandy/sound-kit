/**
 * 曲の一覧：玉座の間の決戦（ゲームのラスボス戦・ハ短調で速く）
 * 弦楽器の8分の刻みを止めずに続け、ブラスが小節の頭で吹く。サビは合唱とティンパニ（低いタム）で押し上げる
 * 属和音は G（和声的短音階の B ナチュラル）にして、張りつめさせる
 */
(function () {
    const { repeat } = SoundKit;

    // A の主題（前半4小節は A' でも同じ）
    const THEME_HEAD = `C5:4 Eb5:4 G5:6 F5:2 | Eb5:4 D5:2 C5:2 G5:8 | Ab5:6 G5:2 F5:4 Eb5:4 | D5:4 G5:4 B5:8`;
    const THEME = `${THEME_HEAD} |
                   C6:6 B5:2 C6:4 G5:4 | Eb6:6 D6:2 C6:4 G5:4 | Ab5:6 G5:2 F5:4 C6:4 | B5:8 D6:4 G5:4`;
    // A' の後半：Fm → Db と沈んで、G7 でサビへ
    const THEME_TURN = `${THEME_HEAD} |
                        F5:4 Ab5:4 C6:8 | Db6:6 C6:2 Ab5:4 F5:4 | D6:6 B5:2 G5:8 | F5:4 D5:4 B4:4 D5:4`;

    // サビ：長い高い音で押し上げる
    const CHORUS = `C6:6 Bb5:2 Ab5:8 | D6:6 C6:2 Bb5:8 | G5:4 Bb5:4 D6:8 | Eb6:8 D6:4 C6:4 |
                    Ab5:6 G5:2 F5:8 | F5:4 Bb5:4 D6:8 | Eb6:6 D6:2 Bb5:4 G5:4 | G5:4 B5:4 D6:8`;

    const CHORDS_A = 'Cm | Cm | Ab | G | Cm | Cm | Fm | G';
    const CHORDS_A2 = 'Cm | Cm | Ab | G | Fm | Db | G | G7';
    const CHORDS_B = 'Ab | Bb | Gm7 | Cm | Fm7 | Bb | Eb | G';

    // 弦の刻み：根音を打ち続け、5度と3度を混ぜる
    const OSTINATO = '0:2 0 2 0 1 0 2 0';
    const BASS = 'R:2 R:2 R:2 R:2 R:2 R:2 5:2 R+:2';

    // ブラス：小節の頭で吹く。G の小節は3つ吹いて次へ渡す
    const BRASS_BAR = 'x-----..........';
    const BRASS_TURN = 'x--.x--.x-------';
    const BRASS_A = repeat(BRASS_BAR, 3, '|') + '|' + BRASS_TURN + '|' + repeat(BRASS_BAR, 3, '|') + '|' + BRASS_TURN;

    const CRASH = 'x...............|' + repeat('................', 7, '|');
    const KICK = 'x.......x.x.....';
    const SNARE = '....x.......x...';
    const HAT = 'x.o.x.o.x.o.x.o.';
    const DRUMS = { kick: repeat(KICK, 8, '|'), snare: repeat(SNARE, 8, '|'), hat: repeat(HAT, 8, '|') };
    const DRUMS_FILL = {
        kick: repeat(KICK, 7, '|') + '|x.......x.......',
        snare: repeat(SNARE, 7, '|') + '|....x.......xxxx',
        hat: repeat(HAT, 7, '|') + '|x.o.x.o.........',
        tomLow: repeat('................', 7, '|') + '|........x.x.....'
    };

    // ラスボス：止まらない弦の刻みと、ブラスと合唱
    const lastboss = {
        title: '玉座の間の決戦',
        tags: ['緊張感'],
        genre: 'ゲーム音楽',
        melody: ['lead'],
        bpm: 150,
        gain: 0.075,
        reverb: { seconds: 2, tone: 0.45 },
        delay: { time: 0.75, feedback: 0.18, tone: 2200 },
        humanize: { time: 0.003, velocity: 0.06 },
        parts: {
            lead: { instrument: 'piano', volume: 0.7, pan: -0.08, decay: 0.7, brightness: 0.85, reverb: 0.2, delay: 0.08 },
            // 弦の刻み：立ち上がりを速くして、短く切る
            ostinato: { instrument: 'strings', mode: 'arp', from: 'C4', volume: 0.98, pan: 0.25, attack: 0.02, release: 0.08, gate: 0.7, brightness: 0.9, reverb: 0.25 },
            brass: { instrument: 'brass', mode: 'chords', center: 'G4', voices: 3, volume: 0.57, pan: -0.2, brightness: 3.5, release: 0.1, reverb: 0.3 },
            choir: { instrument: 'choir', mode: 'chords', center: 'Eb4', voices: 3, volume: 0.35, pan: 0.1, attack: 0.3, release: 0.6, reverb: 0.5 },
            bass: { instrument: 'synthBass', mode: 'bass', octave: 2, volume: 0.9, cutoff: 380, decay: 0.18, sustain: 0.35, release: 0.04, gate: 0.8 },
            drums: { instrument: 'drums', kit: 'acoustic', mode: 'drums', volume: 0.5, cutoff: 7500, levels: { kick: 0.85, snare: 0.55, hat: 0.45, tomLow: 0.8, tomMid: 0.65, crash: 0.4 } }
        },
        sections: {
            // イントロ：ティンパニの連打と弦の刻みで迫り、G で主題へ
            intro: {
                label: 'イントロ',
                chords: 'Cm | Cm | Ab | G',
                ostinato: OSTINATO,
                brass: '................|................|................|' + BRASS_TURN,
                bass: { pattern: `r:16 | r:16 | ${BASS} | ${BASS}` },
                drums: {
                    tomLow: 'x.......x.......|x.......x.......|x...x...x...x...|x.x.x.x.xxxxxxxx'
                }
            },
            A: {
                chords: CHORDS_A,
                lead: THEME,
                ostinato: OSTINATO,
                bass: BASS,
                drums: { ...DRUMS, crash: CRASH }
            },
            // A'：ブラスが小節の頭で吹き、G7 でサビへ
            A2: {
                label: "A'",
                chords: CHORDS_A2,
                lead: THEME_TURN,
                ostinato: OSTINATO,
                brass: BRASS_A,
                bass: BASS,
                drums: DRUMS_FILL
            },
            // サビ：合唱を敷き、ティンパニが小節の頭で打つ
            B: {
                chords: CHORDS_B,
                lead: CHORUS,
                ostinato: OSTINATO,
                choir: 'hold',
                brass: repeat(BRASS_BAR, 7, '|') + '|' + BRASS_TURN,
                bass: BASS,
                drums: {
                    crash: CRASH,
                    kick: repeat('x.......x.x...x.', 8, '|'),
                    snare: repeat(SNARE, 7, '|') + '|....x.......xxxx',
                    hat: repeat(HAT, 8, '|'),
                    tomLow: repeat('x...............', 8, '|')
                }
            },
            // 休憩：主旋律は長い音だけ、ドラムを抜いて刻みと合唱で溜める。最後の小節でティンパニが戻る
            C: {
                chords: 'Cm | Ab | Fm | G | Cm | Ab | Fm | G',
                lead: 'G5:16 | Ab5:16 | F5:8 Ab5:8 | G5:12 r:4 | C6:16 | Eb6:8 C6:8 | Ab5:8 F5:8 | B5:8 D6:8',
                ostinato: '0:4 0 2 0',
                choir: 'hold',
                bass: 'R:16',
                drums: { tomLow: repeat('x...............', 7, '|') + '|x...x...x.x.xxxx' }
            },
            // 最後の A：ブラスを足して、G で頭の Cm へ戻る
            A3: {
                label: 'A',
                chords: CHORDS_A,
                lead: THEME,
                ostinato: OSTINATO,
                brass: BRASS_A,
                bass: BASS,
                drums: { ...DRUMS_FILL, crash: CRASH }
            }
        },
        intro: ['intro'],
        loop: ['A', 'A2', 'B', 'C', 'A3']
    };

    SoundKit.register('catalog', { songs: { lastboss } });
})();
