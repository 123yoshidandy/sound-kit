/**
 * 曲の一覧：ジャングルの奥地へ（探検・ホ短調で、草をかき分けて進む）
 * マリンバが8分で分散和音を転がし、シェイカーとタムの打楽器がにぎやかに打つ。主題は短く切って、物陰をうかがうように進む
 * A' はカリンバが主題の伸ばしに鳥の声のように答え、低いブラスが裏で短く刻む。B はハ長調の方へ開き、低いブラスが吹き返す
 * B' はフルートが主題に重なる。休憩の C はピアノを抜き、フルートがひとりで歌う。打楽器は低いタムとシェイカーだけに
 */
(function () {
    const { repeat } = SoundKit;

    // A の主題（前半7小節は最後の A でも同じ）
    const THEME_HEAD = `B4:2 E5:2 r:2 G5:2 r:2 F#5:2 E5:4 | G5:2 r:2 E5:2 G5:2 r:2 A5:2 B5:4 | A5:4 F#5:2 A5:2 D6:4 A5:4 | F#5:6 D#5:2 B4:8 |
                        B4:2 E5:2 r:2 G5:2 r:2 B5:2 D6:4 | C6:4 B5:2 G5:2 E5:4 G5:4 | A5:4 C6:4 B5:4 A5:4`;
    const THEME = `${THEME_HEAD} | E5:4 B4:4 E5:4 r:4`;
    // ループの終わり：B7 で止めて、頭の Em へ戻る
    const THEME_LAST = `${THEME_HEAD} | F#5:4 D#5:4 B4:4 F#5:4`;
    const CHORDS_HEAD = 'Em | C | D | B7 | Em | C | Am:8 B7:8';
    const CHORDS_A = `${CHORDS_HEAD} | Em`;
    const CHORDS_LAST = `${CHORDS_HEAD} | B7`;

    // A' のカリンバ：主題が伸ばしている所に、鳥の声のように答える
    const KALIMBA_A = 'r:16 | r:16 | r:16 | r:8 B5:2 A5:2 F#5:4 | r:16 | r:16 | r:16 | r:12 B5:2 G5:2';

    // B：ハ長調の方へ開き、B7 で次へ。低いブラスが吹き返す
    const CHORDS_B = 'C | D | Em | Em | C | D | B7 | B7';
    const SONG_B = `E5:6 G5:2 C6:8 | D6:6 A5:2 F#5:8 | G5:4 B5:4 E5:8 | F#5:4 G5:4 B5:8 |
                    E5:6 G5:2 C6:8 | D6:6 A5:2 F#5:4 A5:4 | B5:6 A5:2 F#5:8 | D#5:4 F#5:4 A5:4 B5:4`;
    const BRASS_B = `r:8 C4:2 r:2 E4:4 | r:8 D4:2 r:2 F#4:4 | r:8 E4:2 r:2 B3:4 | r:8 E4:2 G4:2 B4:4 |
                     r:8 C4:2 r:2 E4:4 | r:8 D4:2 r:2 F#4:4 | r:8 D#4:2 r:2 F#4:4 | r:8 B3:2 D#4:2 F#4:4`;

    // 休憩：フルートがひとりで歌う。B7 で最後の A へ
    const CHORDS_C = 'Em | D | C | B7 | Em | D | C | B7';
    const FLUTE_C = `B5:8 G5:8 | A5:8 F#5:8 | G5:4 E5:4 C6:8 | B5:16 |
                     G5:8 B5:8 | D6:8 A5:8 | E5:8 G5:8 | F#5:8 D#5:8`;

    // マリンバの分散和音（8分）と、低いブラスの裏の刻み
    const ARP = '0:2 1 2 1 3 1 2 1';
    const STAB = '..........x.x...';
    const BASS = 'R:4 r:2 R:2 5:4 R:4';
    // 打楽器：シェイカーが16分で転がり、タムが跳ねる
    const JUNGLE = {
        kick: repeat('x.......x.......', 8, '|'),
        tomLow: repeat('x.....x...x.....', 8, '|'),
        tom: repeat('....x.......x.x.', 8, '|'),
        shaker: repeat('x.ox'.repeat(4), 8, '|')
    };
    const JUNGLE_FILL = { ...JUNGLE, tomHigh: repeat('................', 7, '|') + '|........x.x.x...' };

    // ジャングル：マリンバと打楽器、低いブラス
    const jungle = {
        title: 'ジャングルの奥地へ',
        tags: ['緊張感', '軽快'],
        genre: 'ゲーム音楽',
        melody: ['lead'],
        bpm: 112,
        gain: 0.093,
        reverb: { seconds: 1.8, tone: 0.45 },
        delay: { time: 0.75, feedback: 0.25, tone: 2200, reverb: 0.2 },
        humanize: { time: 0.005, velocity: 0.1 },
        parts: {
            lead: { instrument: 'piano', volume: 0.6, pan: -0.08, decay: 0.75, brightness: 0.85, reverb: 0.18, delay: 0.08 },
            flute: { instrument: 'flute', volume: 0.5, pan: 0.25, breath: 0.06, vibrato: 10, reverb: 0.3, delay: 0.15 },
            // B' で主題に重ねるフルート
            fluteDouble: { instrument: 'flute', volume: 0.35, pan: 0.25, breath: 0.04, vibrato: 8, reverb: 0.3, delay: 0.1 },
            // 鳥の声のつもり：カリンバ
            kalimba: { instrument: 'kalimba', volume: 0.4, pan: 0.35, reverb: 0.35, delay: 0.25 },
            // 低いブラス：暗めに吹き返す
            brass: { instrument: 'brass', volume: 0.8, pan: 0.25, brightness: 2.5, cutoff: 2000, attack: 0.03, release: 0.15, vibrato: 6, reverb: 0.25 },
            // 低いブラスの裏の刻み
            stab: { instrument: 'brass', mode: 'chords', center: 'G3', voices: 3, gate: 0.5, volume: 0.71, pan: 0.2, brightness: 2.5, cutoff: 2000, reverb: 0.2 },
            marimba: { instrument: 'marimba', mode: 'arp', from: 'D4', volume: 0.32, pan: -0.25, reverb: 0.2 },
            bass: { instrument: 'synthBass', mode: 'bass', octave: 2, wave: 'triangle', cutoff: 320, envelope: 0.8, decay: 0.3, sustain: 0.45, release: 0.06, volume: 0.45, gate: 0.75 },
            drums: { instrument: 'drums', kit: 'soft', mode: 'drums', volume: 0.8, cutoff: 7000, levels: { kick: 0.55, tomLow: 0.55, tom: 0.45, tomHigh: 0.45, shaker: 0.35 } }
        },
        sections: {
            // イントロ：タムから、マリンバが入り、低いブラスが B7 を吹いて主題へ
            intro: {
                label: 'イントロ',
                chords: 'Em | C | D | B7',
                marimba: 'r:16 | ' + ARP + ' | ' + ARP + ' | ' + ARP,
                brass: 'r:16 | r:16 | r:16 | B3:4 D#4:4 F#4:4 A4:4',
                bass: { pattern: `r:16 | r:16 | ${BASS} | ${BASS}` },
                drums: { tomLow: repeat('x.....x...x.....', 4, '|'), tom: repeat('....x.......x.x.', 4, '|') }
            },
            A: {
                chords: CHORDS_A,
                lead: THEME,
                marimba: ARP,
                bass: BASS,
                drums: JUNGLE
            },
            // A'：カリンバが答え、低いブラスが裏で刻む
            A2: {
                label: "A'",
                chords: CHORDS_A,
                lead: THEME,
                kalimba: KALIMBA_A,
                stab: STAB,
                marimba: ARP,
                bass: BASS,
                drums: JUNGLE_FILL
            },
            // B：ハ長調の方へ開き、低いブラスが吹き返す
            B: {
                chords: CHORDS_B,
                lead: SONG_B,
                brass: BRASS_B,
                marimba: ARP,
                bass: BASS,
                drums: JUNGLE
            },
            // B'：フルートが主題に重なる。B7 で休憩へ
            B2: {
                label: "B'",
                chords: CHORDS_B,
                lead: SONG_B,
                fluteDouble: SONG_B,
                brass: BRASS_B,
                marimba: ARP,
                bass: BASS,
                drums: JUNGLE_FILL
            },
            // 休憩：ピアノとブラスを抜き、フルートがひとりで歌う。マリンバは4分、打楽器は低いタムとシェイカーだけ
            C: {
                chords: CHORDS_C,
                flute: FLUTE_C,
                marimba: '0:4 1 2 1',
                bass: 'R:8 5:8',
                drums: { tomLow: repeat('x.......x.......', 8, '|'), shaker: repeat('x.o.'.repeat(4), 8, '|') }
            },
            // 最後の A'：カリンバが答え、低いブラスが刻む。B7 で頭の Em へ戻る
            A3: {
                label: "A'",
                chords: CHORDS_LAST,
                lead: THEME_LAST,
                kalimba: KALIMBA_A,
                stab: STAB,
                marimba: ARP,
                bass: BASS,
                drums: JUNGLE_FILL
            }
        },
        intro: ['intro'],
        loop: ['A', 'A2', 'B', 'B2', 'C', 'A3']
    };

    SoundKit.register('catalog', { songs: { jungle } });
})();
