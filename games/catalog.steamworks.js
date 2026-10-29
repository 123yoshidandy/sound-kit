/**
 * 曲の一覧：スチームパンクの工場（蒸気の工場・ニ短調で、歯車のように規則正しく）
 * シロフォンが8分で同じ形を刻み続け、金属的なハイハットが16分を混ぜて回る。ベースはオクターブを行き来するピストン
 * A' はオルガンが蒸気のように和音を敷き、ブラスが「プシュッ」と吹き込む。B は変ロ長調の方へ、金づち（リム）が鳴る
 * 休憩の C は主旋律を抜き、ブラスがひとりで歌う。刻みは4分にゆるめる
 */
(function () {
    const { repeat } = SoundKit;

    // A の主題（前半7小節は最後の A でも同じ）。短い音で、歯車がかみ合うように
    const THEME_HEAD = `D5:2 F5:2 A5:2 D6:2 C6:2 A5:2 F5:4 | E5:4 F5:4 A5:8 | D6:2 C6:2 Bb5:4 F5:8 | E5:4 A5:4 C#6:8 |
                        D6:4 A5:2 F5:2 D5:8 | G5:4 Bb5:4 D6:8 | F5:4 Bb5:4 A5:4 E5:4`;
    const THEME = `${THEME_HEAD} | D5:12 r:4`;
    // ループの終わり：A で止めて、頭の Dm へ戻る
    const THEME_LAST = `${THEME_HEAD} | C#5:4 E5:4 A5:4 E5:4`;
    const CHORDS_A = 'Dm | Dm | Bb | A | Dm | Gm | Bb:8 A:8 | Dm';
    const CHORDS_LAST = 'Dm | Dm | Bb | A | Dm | Gm | Bb:8 A:8 | A';

    // ブラスの「プシュッ」：主題が伸ばしている2・4・6小節目の後半に吹き込む
    const PUFFS = `................|........x-.x-...|................|........x-.x-...|
                   ................|........x-.x-...|................|................`.replace(/\s/g, '');

    // B（B' でも同じ）。変ロ長調の方へ開き、A で戻る
    const CHORDS_B = 'Bb | F | Gm | Dm | Bb | F | Gm | A';
    const SONG_B = `F5:4 Bb5:4 D6:8 | C6:6 A5:2 F5:8 | G5:4 Bb5:4 D6:4 Bb5:4 | A5:8 F5:8 |
                    D6:6 C6:2 Bb5:8 | A5:4 C6:4 F5:8 | G5:4 D5:4 Bb5:4 G5:4 | C#6:8 A5:4 E5:4`;

    // 休憩のブラス：ひとりで歌う
    const HORN_C = `D5:8 G5:8 | F5:12 A5:4 | Bb5:8 F5:8 | E5:16 |
                    G5:8 Bb5:8 | A5:8 F5:8 | D5:8 F5:8 | E5:8 C#5:8`;

    // 歯車の刻み（8分）と、オクターブを行き来するピストンのベース
    const GEARS = '0:2 2 1 2 0 2 1 2';
    const PISTON = 'R:2 R+ R R+ R R+ R R+';
    const KICK = repeat('x.......x.......', 8, '|');
    const SNARE = repeat('....x.......x...', 8, '|');
    const HAT = repeat('x.oox.o.x.oox.o.', 8, '|');
    const HISS = repeat('................', 7, '|') + '|..............x.';
    const DRUMS = { kick: KICK, snare: SNARE, hat: HAT };
    const DRUMS_FILL = { ...DRUMS, openHat: HISS, snare: repeat('....x.......x...', 7, '|') + '|....x...x.x.xxxx' };
    const HAMMER = repeat('x..x..x.........', 8, '|');

    // 工場：歯車の刻みと、蒸気のオルガン
    const steamworks = {
        title: 'スチームパンクの工場',
        tags: ['緊張感', '軽快'],
        genre: 'ゲーム音楽',
        melody: ['lead'],
        bpm: 120,
        gain: 0.09,
        reverb: { seconds: 1.8, tone: 0.45 },
        delay: { time: 0.75, feedback: 0.2, tone: 2200, reverb: 0.2 },
        humanize: { time: 0.003, velocity: 0.06 },
        parts: {
            lead: { instrument: 'piano', volume: 0.57, pan: -0.08, decay: 0.7, brightness: 0.85, reverb: 0.16, delay: 0.08 },
            // 休憩で歌うブラス
            horn: { instrument: 'brass', volume: 0.87, pan: 0.15, brightness: 3.5, attack: 0.04, release: 0.15, vibrato: 8, reverb: 0.3, delay: 0.15 },
            puffs: { instrument: 'brass', mode: 'chords', center: 'F4', voices: 3, volume: 0.5, pan: -0.25, brightness: 4, release: 0.06, reverb: 0.2 },
            // 歯車：硬いシロフォンで、同じ形を刻む
            gears: { instrument: 'xylophone', mode: 'arp', from: 'A3', volume: 0.4, pan: 0.3, reverb: 0.15 },
            // 蒸気のオルガン：和音を伸ばして敷く
            organ: { instrument: 'organ', mode: 'chords', center: 'F4', voices: 3, volume: 0.38, pan: -0.15, vibrato: 4, release: 0.2, reverb: 0.3 },
            bass: { instrument: 'synthBass', mode: 'bass', octave: 2, cutoff: 380, envelope: 1.5, decay: 0.25, sustain: 0.4, release: 0.05, volume: 0.55, gate: 0.6 },
            drums: { instrument: 'drums', kit: 'acoustic', mode: 'drums', volume: 0.73, cutoff: 8000, levels: { kick: 0.6, snare: 0.4, hat: 0.3, openHat: 0.35, rim: 0.4, crash: 0.3 } }
        },
        sections: {
            // イントロ：歯車とハイハットが回り出し、ピストンが動く。ブラスの合図で主題へ
            intro: {
                label: 'イントロ',
                chords: 'Dm | Dm | Bb | A',
                gears: GEARS,
                puffs: '................|................|................|x-.x-...x-.x-x--',
                bass: { pattern: `r:16 | r:16 | ${PISTON} | ${PISTON}` },
                drums: { hat: repeat('x.oox.o.x.oox.o.', 4, '|'), kick: '................|................|x.......x.......|x.......x.......' }
            },
            A: {
                chords: CHORDS_A,
                lead: THEME,
                gears: GEARS,
                bass: PISTON,
                drums: DRUMS
            },
            // A'：オルガンが蒸気のように和音を敷き、ブラスが吹き込む
            A2: {
                label: "A'",
                chords: CHORDS_A,
                lead: THEME,
                organ: 'hold',
                puffs: PUFFS,
                gears: GEARS,
                bass: PISTON,
                drums: DRUMS_FILL
            },
            // B：変ロ長調の方へ。金づち（リム）が鳴る。A で B' へ
            B: {
                chords: CHORDS_B,
                lead: SONG_B,
                gears: GEARS,
                bass: PISTON,
                drums: { ...DRUMS, rim: HAMMER }
            },
            // B'：オルガンを敷き、ブラスが伸ばしのたびに吹き込む。シンバルで盛り上げる。A で休憩へ
            B2: {
                label: "B'",
                chords: CHORDS_B,
                lead: SONG_B,
                organ: 'hold',
                puffs: repeat('........x-.x-...', 7, '|') + '|x-.x-...x-.x-x--',
                gears: GEARS,
                bass: PISTON,
                drums: { ...DRUMS_FILL, rim: HAMMER, crash: 'x...............|' + repeat('................', 7, '|') }
            },
            // 休憩：主旋律を抜き、ブラスがひとりで歌う。刻みは4分に、ドラムはキックとハイハットだけ。A で頭の Dm へ戻る
            C: {
                chords: 'Gm | Dm | Bb | A | Gm | Dm | Bb | A',
                horn: HORN_C,
                gears: '0:4 2 1 2',
                organ: 'hold',
                bass: 'R:4 R+:4 R:4 R+:4',
                drums: { kick: KICK, hat: repeat('x.o.x.o.x.o.x.o.', 8, '|') }
            },
            // 最後の A'：オルガンとブラスを重ね、A で頭の Dm へ戻る
            A3: {
                label: "A'",
                chords: CHORDS_LAST,
                lead: THEME_LAST,
                organ: 'hold',
                puffs: PUFFS,
                gears: GEARS,
                bass: PISTON,
                drums: DRUMS_FILL
            }
        },
        intro: ['intro'],
        loop: ['A', 'A2', 'B', 'B2', 'C', 'A3']
    };

    SoundKit.register('catalog', { songs: { steamworks } });
})();
