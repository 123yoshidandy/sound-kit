/**
 * 曲の一覧：おもちゃの兵隊さん（童謡風の行進・ホ長調で、ちょこちょこ歩く）
 * 歌いやすい4分音符の主題に、マリンバの裏打ちと、チューバ（低い三角波）の「ブン・ブン」。小太鼓はおもちゃのように軽く
 * A' は鉄琴（ベル）が答え、B はイ長調の方へ寄って木魚（リム）を足す。休憩の C はシロフォンが歌い、最後の A はリコーダー（フルート）が重なる
 */
(function () {
    const { repeat } = SoundKit;

    // A の主題（前半7小節は、どの A でも同じ）
    const THEME_HEAD = `E5:4 G#5:4 B5:4 G#5:4 | A5:4 C#6:4 A5:8 | B5:4 A5:4 F#5:4 D#5:4 | E5:4 G#5:4 B5:8 |
                        B5:4 G#5:4 E5:4 G#5:4 | C#6:8 A5:8 | G#5:4 E5:4 F#5:4 A5:4`;
    const THEME = `${THEME_HEAD} | E5:12 r:4`;
    // ループの終わり：B7 で止めて、頭の E へ戻る
    const THEME_LAST = `${THEME_HEAD} | F#5:4 A5:4 B5:4 D#5:4`;
    const CHORDS_A = 'E | A | B7 | E | E | A | E/B:8 B7:8 | E';
    const CHORDS_LAST = 'E | A | B7 | E | E | A | E/B:8 B7:8 | B7';

    // A' の鉄琴：主題が伸ばしている所に答える
    const GLOCK = 'r:16 | r:8 E6:4 C#6:4 | r:16 | r:8 E6:4 B5:4 | r:16 | r:8 E6:4 C#6:4 | r:16 | r:4 B5:4 G#5:4 E5:4';

    // マリンバの裏打ちと、チューバの「ブン・ブン」
    const OFFBEAT = '..x...x...x...x.';
    const TUBA = 'R:4 r:4 5:4 r:4';
    const KICK = repeat('x.......x.......', 8, '|');
    const SNARE = repeat('....x..x....x...', 8, '|');
    const DRUMS = { kick: KICK, snare: SNARE };
    const DRUMS_FILL = { kick: KICK, snare: repeat('....x..x....x...', 7, '|') + '|....x...x.x.xxx.' };

    // 童謡の行進：おもちゃの兵隊
    const toymarch = {
        title: 'おもちゃの兵隊さん',
        tags: ['明るい', '軽快'],
        genre: 'ゲーム音楽',
        melody: ['lead'],
        bpm: 112,
        gain: 0.09,
        reverb: { seconds: 1.4, tone: 0.5 },
        delay: { time: 0.75, feedback: 0.15, tone: 2400 },
        humanize: { time: 0.004, velocity: 0.07 },
        parts: {
            lead: { instrument: 'piano', volume: 0.66, pan: -0.08, decay: 0.75, brightness: 0.85, reverb: 0.16, delay: 0.06 },
            // リコーダーのつもり：息の音を少し多めにしたフルート
            recorder: { instrument: 'flute', volume: 0.4, pan: 0.2, vibrato: 4, breath: 0.08, reverb: 0.22 },
            glock: { instrument: 'bell', volume: 0.35, pan: 0.3, decay: 1.4, reverb: 0.3, delay: 0.15 },
            xylophone: { instrument: 'xylophone', volume: 0.65, pan: 0.15, reverb: 0.25, delay: 0.15 },
            marimba: { instrument: 'marimba', mode: 'chords', center: 'G#4', voices: 3, volume: 0.34, pan: 0.25, reverb: 0.18 },
            tuba: { instrument: 'synthBass', mode: 'bass', octave: 2, wave: 'triangle', cutoff: 280, envelope: 0.6, decay: 0.3, sustain: 0.45, release: 0.06, volume: 0.65, gate: 0.8 },
            drums: { instrument: 'drums', kit: 'soft', mode: 'drums', volume: 0.87, cutoff: 7500, levels: { kick: 0.5, snare: 0.35, rim: 0.4 } }
        },
        sections: {
            // イントロ：小太鼓の行進から、マリンバとチューバが入る。B7 で主題へ
            intro: {
                label: 'イントロ',
                chords: 'E | A | E | B7',
                marimba: '................|' + repeat(OFFBEAT, 3, '|'),
                tuba: { pattern: `r:16 | ${TUBA} | ${TUBA} | ${TUBA}` },
                drums: { snare: repeat('x..x....x..x....', 3, '|') + '|x..x....x.x.xxx.' }
            },
            A: {
                chords: CHORDS_A,
                lead: THEME,
                marimba: OFFBEAT,
                tuba: TUBA,
                drums: DRUMS
            },
            // A'：鉄琴が答える
            A2: {
                label: "A'",
                chords: CHORDS_A,
                lead: THEME,
                glock: GLOCK,
                marimba: OFFBEAT,
                tuba: TUBA,
                drums: DRUMS_FILL
            },
            // B：イ長調の方へ寄り、木魚を足す。B7 で休憩へ
            B: {
                chords: 'A | E | F#m | B7 | A | E | F#m7:8 B7:8 | B7',
                lead: `C#6:6 B5:2 A5:8 | B5:6 A5:2 G#5:8 | A5:4 C#6:4 F#5:8 | B5:4 A5:4 F#5:8 |
                       E5:4 A5:4 C#6:8 | B5:4 G#5:4 E5:8 | A5:4 F#5:4 D#5:4 F#5:4 | B5:8 A5:8`,
                marimba: OFFBEAT,
                tuba: TUBA,
                drums: { ...DRUMS_FILL, rim: repeat('x...x...x...x...', 8, '|') }
            },
            // 休憩：ピアノを抜き、シロフォンが歌う。小太鼓はお休み。B7 で頭の E へ戻る
            C: {
                chords: 'E | A | B7 | E | E | A | B7 | B7',
                xylophone: `G#5:8 B5:8 | C#6:8 A5:8 | B5:4 A5:4 F#5:8 | G#5:16 |
                            E5:8 G#5:8 | A5:4 C#6:4 A5:8 | F#5:8 D#5:8 | F#5:4 A5:4 B5:8`,
                marimba: OFFBEAT,
                tuba: 'R:8 5:8',
                drums: { kick: KICK }
            },
            // 最後の A：リコーダーが主題に重なり、鉄琴が答える。B7 で頭の E へ戻る
            A3: {
                label: 'A',
                chords: CHORDS_LAST,
                lead: THEME_LAST,
                recorder: THEME_LAST,
                glock: GLOCK.replace('r:4 B5:4 G#5:4 E5:4', 'r:16'),
                marimba: OFFBEAT,
                tuba: TUBA,
                drums: DRUMS_FILL
            }
        },
        intro: ['intro'],
        loop: ['A', 'A2', 'B', 'C', 'A3']
    };

    SoundKit.register('catalog', { songs: { toymarch } });
})();
