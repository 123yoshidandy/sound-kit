/**
 * 曲の一覧：サーカスの大テント（サーカス・ハ長調で、おどけて速く）
 * 半音下から跳ねる道化の主題に、チューバ（低い三角波）の「ブン」とブラスの「チャッ」。シンバル（クラッシュ）で幕が開く
 * A' はカリオペ（オルガン）が主題に重なって蒸気オルガンのように鳴り、B はヘ長調の方へ、ゆったり回る
 * 休憩の C は、スライドホイッスル（柔らかいシンセを滑らせる）が道化のようにひゅるりと鳴る
 */
(function () {
    const { repeat } = SoundKit;

    // A の主題（前半7小節は最後の A でも同じ）。半音下からの短い装飾で、おどける
    const THEME_HEAD = `E5:2 D#5:1 E5:1 G5:4 C6:4 G5:4 | C#6:2 C6:1 C#6:1 A5:4 E5:4 G5:4 | F5:2 E5:1 F5:1 A5:4 D6:8 | B5:4 A5:2 G5:2 F5:4 D5:4 |
                        E5:2 D#5:1 E5:1 G5:4 C6:4 G5:4 | C#6:2 C6:1 C#6:1 A5:4 E5:4 G5:4 | F#5:2 G5:2 A5:2 C6:2 B5:4 G5:4`;
    const THEME = `${THEME_HEAD} | C6:4 G5:4 C5:8`;
    // ループの終わり：G7 で止めて、頭の C へ戻る
    const THEME_LAST = `${THEME_HEAD} | B5:8 G5:4 F5:4`;
    const CHORDS_A = 'C | A7 | Dm | G7 | C | A7 | D7:8 G7:8 | C';
    const CHORDS_LAST = 'C | A7 | Dm | G7 | C | A7 | D7:8 G7:8 | G7';

    // 休憩のスライドホイッスル：和音の音から和音の音へ、ひゅるりと滑らせる
    const WHISTLE = `G4~G5:8 r:8 | E5~A5:8 r:8 | F5~A5:8 D5:8 | B5~G5:8 r:8 |
                     C5~E5:8 G5:8 | A5~C#6:8 r:8 | D6~A5:8 F5:8 | D5~B5:12 r:4`;

    // ブラスの「チャッ」（8分の裏）と、チューバの「ブン」
    const PAH = '..x...x...x...x.';
    const TUBA = 'R:4 5:4 R:4 5:4';
    const KICK = repeat('x.......x.......', 8, '|');
    const SNARE = repeat('....x.......x...', 8, '|');
    const CRASH = 'x...............|' + repeat('................', 7, '|');
    const DRUMS = { kick: KICK, snare: SNARE };
    const DRUMS_FILL = { kick: KICK, crash: CRASH, snare: repeat('....x.......x...', 7, '|') + '|....x...xxxxxxxx' };

    // サーカス：道化の主題と、カリオペ
    const circus = {
        title: 'サーカスの大テント',
        tags: ['明るい', '軽快'],
        genre: 'ゲーム音楽',
        melody: ['lead'],
        bpm: 138,
        gain: 0.09,
        reverb: { seconds: 1.6, tone: 0.5 },
        delay: { time: 0.75, feedback: 0.15, tone: 2400 },
        humanize: { time: 0.004, velocity: 0.08 },
        parts: {
            lead: { instrument: 'piano', volume: 0.56, pan: -0.08, decay: 0.7, brightness: 0.9, reverb: 0.16, delay: 0.06 },
            // カリオペ：オルガンを主題に重ねる
            calliope: { instrument: 'organ', volume: 0.48, pan: 0.2, vibrato: 10, release: 0.05, reverb: 0.25 },
            // スライドホイッスル：柔らかいシンセを、ビブラートなしで滑らせる
            whistle: { instrument: 'softLead', volume: 0.63, pan: 0.15, cutoff: 2400, attack: 0.03, release: 0.12, vibrato: 0, reverb: 0.3, delay: 0.2 },
            pah: { instrument: 'brass', mode: 'chords', center: 'F4', voices: 3, volume: 1, pan: -0.25, brightness: 3.5, release: 0.05, gate: 0.6, reverb: 0.2 },
            tuba: { instrument: 'synthBass', mode: 'bass', octave: 2, wave: 'triangle', cutoff: 280, envelope: 0.6, decay: 0.3, sustain: 0.45, release: 0.05, volume: 0.65, gate: 0.75 },
            drums: { instrument: 'drums', kit: 'soft', mode: 'drums', volume: 0.75, cutoff: 7500, levels: { kick: 0.55, snare: 0.4, crash: 0.35 } }
        },
        sections: {
            // イントロ：シンバルと小太鼓のロールで幕が開き、G7 で主題へ
            intro: {
                label: 'イントロ',
                chords: 'C | C | G7 | G7',
                pah: '................|................|' + PAH + '|' + PAH,
                tuba: TUBA,
                drums: {
                    crash: 'x...............|................|x...............|................',
                    snare: 'xxxxxxxxxxxxxxxx|xxxxxxxxx.......|................|....x...x.x.xxxx'
                }
            },
            A: {
                chords: CHORDS_A,
                lead: THEME,
                pah: PAH,
                tuba: TUBA,
                drums: DRUMS
            },
            // A'：カリオペが主題に重なる
            A2: {
                label: "A'",
                chords: CHORDS_A,
                lead: THEME,
                calliope: THEME,
                pah: PAH,
                tuba: TUBA,
                drums: DRUMS_FILL
            },
            // B：ヘ長調の方へ、ゆったり回る。G7 で休憩へ
            B: {
                chords: 'F | Bb | F | D7 | Gm | C7 | F:8 D7:8 | G7',
                lead: `A5:6 G5:2 F5:8 | D6:6 C6:2 Bb5:8 | C6:4 A5:4 F5:8 | F#5:4 A5:4 C6:8 |
                       Bb5:6 A5:2 G5:8 | E5:4 G5:4 Bb5:8 | A5:4 C6:4 C6:4 A5:4 | B5:8 G5:4 F5:4`,
                pah: PAH,
                tuba: TUBA,
                drums: DRUMS
            },
            // 休憩：ピアノとブラスを抜き、スライドホイッスルが道化のように鳴る。G7 で頭の C へ戻る
            C: {
                chords: 'C | A7 | Dm | G7 | C | A7 | Dm | G7',
                whistle: WHISTLE,
                tuba: TUBA,
                drums: { kick: KICK }
            },
            // 最後の A'：カリオペを重ね、G7 で頭の C へ戻る
            A3: {
                label: "A'",
                chords: CHORDS_LAST,
                lead: THEME_LAST,
                calliope: THEME_LAST,
                pah: PAH,
                tuba: TUBA,
                drums: DRUMS_FILL
            }
        },
        intro: ['intro'],
        loop: ['A', 'A2', 'B', 'C', 'A3']
    };

    SoundKit.register('catalog', { songs: { circus } });
})();
