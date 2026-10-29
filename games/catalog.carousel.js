/**
 * 曲の一覧：メリーゴーラウンドの午後（遊園地・ト長調の3拍子で、くるくる回る）
 * 3拍子なので、1小節は12ステップ。チューバ（低い三角波）の「ブン」に、オルガンの「チャッチャ」で回り続ける
 * A' はベルが主題の伸ばしに答え、B はハ長調の方へ。シロフォンがころころと答える
 * 休憩の C はピアノを抜き、カリオペ（オルガン）がひとりで歌う
 */
(function () {
    const { repeat } = SoundKit;

    // A の主題（前半14小節は最後の A でも同じ）
    const THEME_HEAD = `D5:4 G5:4 B5:4 | D6:8 B5:4 | C6:4 A5:4 F#5:4 | A5:12 |
                        D5:4 F#5:4 A5:4 | C6:12 | B5:4 A5:4 G5:4 | D5:12 |
                        D5:4 G5:4 B5:4 | D6:8 F5:4 | E5:4 G5:4 C6:4 | G5:12 |
                        D6:4 B5:4 G5:4 | F#5:4 A5:4 C6:4`;
    const THEME = `${THEME_HEAD} | B5:12 | G5:8 r:4`;
    // ループの終わり：D7 で止めて、頭の G へ戻る
    const THEME_LAST = `${THEME_HEAD} | B5:4 A5:4 G5:4 | F#5:4 A5:4 C6:4`;
    const CHORDS_HEAD = 'G | G | D7 | D7 | D7 | D7 | G | G | G | G7 | C | C | G | D7';
    const CHORDS_A = `${CHORDS_HEAD} | G | G`;
    const CHORDS_LAST = `${CHORDS_HEAD} | G | D7`;

    // A' のベル：主題が伸ばしている2拍目と3拍目に答える
    const BELL_A = `r:12 | r:4 G5:4 B5:4 | r:12 | r:4 F#5:4 D5:4 | r:12 | r:4 A5:4 F#5:4 | r:12 | r:4 G5:4 B5:4 |
                    r:12 | r:4 B5:4 G5:4 | r:12 | r:4 E5:4 C6:4 | r:12 | r:12 | r:4 D6:4 G5:4 | r:12`;

    // B：ハ長調の方へ。D7 で休憩へ
    const CHORDS_B = 'C | C | G | G | Am | D7 | G | G | C | C | G | Em | Am | D7 | G | D7';
    const SONG_B = `E5:4 G5:4 C6:4 | C6:8 G5:4 | B5:4 D6:4 B5:4 | G5:12 | C6:4 A5:4 E5:4 | F#5:4 A5:4 D6:4 | B5:8 A5:4 | G5:12 |
                    E5:4 G5:4 C6:4 | D6:8 C6:4 | B5:4 G5:4 D5:4 | E5:8 G5:4 | C6:4 E5:4 A5:4 | D6:8 C6:4 | B5:12 | A5:4 F#5:4 D5:4`;
    // B のシロフォン：伸ばしている所に、ころころと答える
    const XYLO_B = `r:12 | r:4 G5:4 E5:4 | r:12 | r:4 D5:4 B4:4 | r:12 | r:12 | r:12 | r:4 B5:4 D6:4 |
                    r:12 | r:4 E5:4 G5:4 | r:12 | r:4 B4:4 E5:4 | r:12 | r:4 F#5:4 A5:4 | r:4 D6:4 B5:4 | r:12`;

    // 休憩：カリオペがひとりで歌う。D7 で頭の G へ戻る
    const CHORDS_C = 'G | G | C | C | G | G | D7 | D7 | Em | Em | C | C | G | G | D7 | D7';
    const CALLIOPE_C = `B5:12 | G5:8 D5:4 | E5:12 | G5:8 C6:4 | B5:8 G5:4 | D5:12 | F#5:12 | A5:8 C6:4 |
                        B5:12 | G5:8 E5:4 | E5:4 G5:4 C6:4 | C6:12 | B5:4 G5:4 D5:4 | G5:12 | A5:8 F#5:4 | C6:8 A5:4`;

    // オルガンの「チャッチャ」と、チューバの「ブン」
    const OOMPAH = '....x-..x-..';
    const TUBA = 'R:4 r:8 | 5:4 r:8';
    const KICK = repeat('x...........', 16, '|');
    const HAT = repeat('....x...x...', 16, '|');
    const DRUMS = { kick: KICK, hat: HAT };
    const DRUMS_CRASH = { ...DRUMS, crash: 'x...........|' + repeat('............', 15, '|') };

    // 遊園地：オルガンとベル、シロフォン
    const carousel = {
        title: 'メリーゴーラウンドの午後',
        tags: ['明るい', '軽快'],
        genre: 'ゲーム音楽',
        melody: ['lead'],
        bpm: 168,
        stepsPerBar: 12,
        gain: 0.105,
        reverb: { seconds: 1.6, tone: 0.5 },
        delay: { time: 0.75, feedback: 0.15, tone: 2400 },
        humanize: { time: 0.004, velocity: 0.08 },
        parts: {
            lead: { instrument: 'piano', volume: 0.5, pan: -0.08, decay: 0.75, brightness: 0.85, reverb: 0.18, delay: 0.06 },
            // カリオペ：オルガンを、少し揺らして歌わせる
            calliope: { instrument: 'organ', volume: 0.75, pan: 0.15, vibrato: 10, release: 0.06, reverb: 0.28, delay: 0.1 },
            bell: { instrument: 'bell', volume: 0.34, pan: 0.35, decay: 1.2, reverb: 0.4, delay: 0.2 },
            xylo: { instrument: 'xylophone', volume: 0.46, pan: 0.3, reverb: 0.3, delay: 0.12 },
            organ: { instrument: 'organ', mode: 'chords', center: 'D4', voices: 3, volume: 0.85, pan: -0.2, gate: 0.5, reverb: 0.22 },
            tuba: { instrument: 'synthBass', mode: 'bass', octave: 2, wave: 'triangle', cutoff: 280, envelope: 0.6, decay: 0.3, sustain: 0.45, release: 0.05, volume: 0.65, gate: 0.75 },
            drums: { instrument: 'drums', kit: 'soft', mode: 'drums', volume: 0.8, cutoff: 7500, levels: { kick: 0.55, hat: 0.3, crash: 0.3 } }
        },
        sections: {
            // イントロ：チューバとオルガンが回り出し、ベルが鳴る。D7 で主題へ
            intro: {
                label: 'イントロ',
                chords: 'G | G | D7 | D7',
                organ: OOMPAH,
                bell: 'G5:4 B5:4 D6:4 | r:12 | F#5:4 A5:4 C6:4 | r:12',
                tuba: TUBA,
                drums: { kick: repeat('x...........', 4, '|') }
            },
            A: {
                chords: CHORDS_A,
                lead: THEME,
                organ: OOMPAH,
                tuba: TUBA,
                drums: DRUMS
            },
            // A'：ベルが答え、シンバルで幕を開ける
            A2: {
                label: "A'",
                chords: CHORDS_A,
                lead: THEME,
                bell: BELL_A,
                organ: OOMPAH,
                tuba: TUBA,
                drums: DRUMS_CRASH
            },
            // B：ハ長調の方へ。シロフォンが答える。D7 で休憩へ
            B: {
                chords: CHORDS_B,
                lead: SONG_B,
                xylo: XYLO_B,
                organ: OOMPAH,
                tuba: TUBA,
                drums: DRUMS
            },
            // 休憩：ピアノとハイハットを抜き、カリオペがひとりで歌う。オルガンは2拍目だけ。D7 で頭の G へ戻る
            C: {
                chords: CHORDS_C,
                calliope: CALLIOPE_C,
                organ: '....x-......',
                tuba: TUBA,
                drums: { kick: KICK }
            },
            // 最後の A'：ベルとシロフォンが答え、D7 で頭の G へ戻る
            A3: {
                label: "A'",
                chords: CHORDS_LAST,
                lead: THEME_LAST,
                bell: BELL_A,
                organ: OOMPAH,
                tuba: TUBA,
                drums: DRUMS_CRASH
            }
        },
        intro: ['intro'],
        loop: ['A', 'A2', 'B', 'C', 'A3']
    };

    SoundKit.register('catalog', { songs: { carousel } });
})();
