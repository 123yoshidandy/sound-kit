/**
 * 曲の一覧：旅立ちの村の朝（ゲーム音楽・ト長調で、素朴に明るく）
 * ピアノの主題は和音の音を素直に上り下りする。ギターが8分で和音をつま弾き、はじく弦のベースが根音と5度を置く
 * A' から弦が和音を伸ばし、ドラムはバスドラムとハイハットだけで軽く歩く。B はホ短調の方から巡る
 * 休憩の C はピアノとドラムを抜き、フルートがゆっくり歌う。最後の A' はフルートが主題に重なり、D で頭の G へ戻る
 */
(function () {
    const { repeat } = SoundKit;

    // A の主題（前半6小節は A' でも同じ）
    const THEME_HEAD = `D5:4 G5:4 B5:6 A5:2 | C6:6 B5:2 G5:4 E5:4 | D5:4 G5:4 B5:4 D6:4 | A5:8 F#5:4 D5:4 |
                        E5:4 G5:4 B5:6 A5:2 | G5:6 E5:2 C6:8`;
    const THEME = `${THEME_HEAD} | A5:4 E5:4 F#5:4 A5:4 | G5:12 r:4`;
    // A' の終わり：D で止めて次へ
    const THEME_TURN = `${THEME_HEAD} | A5:4 E5:4 G5:4 C6:4 | A5:6 G5:2 F#5:4 E5:4`;
    const CHORDS_A = 'G | C | G | D | Em | C | Am7:8 D7:8 | G';
    const CHORDS_A2 = 'G | C | G | D | Em | C | Am7 | D';

    // B：ホ短調の方から巡り、D で休憩へ
    const CHORDS_B = 'Em | Bm | C | G | Am | Em | C | D';
    const SONG_B = `B5:6 A5:2 G5:4 E5:4 | D5:4 F#5:4 B5:8 | C6:6 B5:2 G5:4 E5:4 | D6:8 B5:8 |
                    C6:6 B5:2 A5:4 E5:4 | G5:6 F#5:2 E5:8 | E5:4 G5:4 C6:8 | D6:6 C6:2 A5:4 F#5:4`;

    // 休憩：フルートがゆっくり歌う。D7 で最後の A' へ
    const CHORDS_C = 'C | G | Am | Em | C | G | Am7 | D7';
    const SOLO_C = `E5:8 G5:8 | D5:8 B4:8 | C5:8 E5:8 | B4:16 |
                    G5:8 E5:8 | D5:12 B4:4 | C5:8 E5:8 | F#5:8 A5:4 C5:4`;

    // ギターは8分のつま弾き。休憩では4分にゆるめる
    const ARP = '0:2 1 2 3 2 1 2 1';
    const BASS = 'R:8 5:8';
    const BASS_B = 'R:6 R:2 5:8';
    const DRUMS_A2 = { kick: repeat('x.......x.......', 8, '|'), hat: repeat('....x.......x...', 8, '|') };
    const DRUMS_B = { kick: repeat('x.......x.......', 8, '|'), hat: repeat('..x...x...x...x.', 8, '|'), snare: repeat('............x...', 8, '|') };

    // 始まりの村：ピアノの主題、ギターのつま弾き、フルートと弦
    const hometown = {
        title: '旅立ちの村の朝',
        tags: ['明るい', '落ち着いた'],
        genre: 'ゲーム音楽',
        melody: ['lead'],
        bpm: 100,
        gain: 0.1,
        reverb: { seconds: 2.2, tone: 0.5 },
        delay: { time: 0.75, feedback: 0.22, tone: 2200, reverb: 0.25 },
        humanize: { time: 0.006, velocity: 0.08 },
        parts: {
            lead: { instrument: 'piano', volume: 0.52, pan: -0.08, decay: 0.85, brightness: 0.8, reverb: 0.25, delay: 0.1 },
            // 休憩の C で歌うフルート
            solo: { instrument: 'flute', volume: 0.45, pan: 0.15, vibrato: 12, reverb: 0.35, delay: 0.15 },
            // 最後の A' で主題に重ねるフルート
            unison: { instrument: 'flute', volume: 0.35, pan: 0.2, vibrato: 10, reverb: 0.3, delay: 0.1 },
            guitar: { instrument: 'guitar', mode: 'arp', from: 'G3', volume: 0.6, pan: -0.25, brightness: 0.55, reverb: 0.2 },
            strings: { instrument: 'strings', mode: 'chords', center: 'D4', voices: 3, volume: 0.4, pan: 0.2, attack: 0.4, release: 0.7, brightness: 0.75, reverb: 0.4 },
            bass: { instrument: 'pluck', mode: 'bass', octave: 2, brightness: 0.45, volume: 0.85 },
            drums: { instrument: 'drums', kit: 'soft', mode: 'drums', volume: 0.55, cutoff: 7000, levels: { kick: 0.7, snare: 0.4, hat: 0.4 } }
        },
        sections: {
            // イントロ：ギターと弦、ベースで始め、D で主題へ
            intro: {
                label: 'イントロ',
                chords: 'G | C | Am7 | D',
                guitar: ARP,
                strings: 'hold',
                bass: BASS
            },
            A: {
                chords: CHORDS_A,
                lead: THEME,
                guitar: ARP,
                bass: BASS
            },
            // A'：弦が和音を伸ばし、ドラムが軽く入る。D で B へ
            A2: {
                label: "A'",
                chords: CHORDS_A2,
                lead: THEME_TURN,
                guitar: ARP,
                strings: 'hold',
                bass: BASS,
                drums: DRUMS_A2
            },
            // B：ホ短調の方から巡る。小太鼓が4拍目にそっと入る
            B: {
                chords: CHORDS_B,
                lead: SONG_B,
                guitar: ARP,
                strings: 'hold',
                bass: BASS_B,
                drums: DRUMS_B
            },
            // 休憩：ピアノとドラムを抜き、フルートが歌う。ギターは4分
            C: {
                chords: CHORDS_C,
                solo: SOLO_C,
                guitar: '0:4 1 2 1',
                strings: 'hold',
                bass: 'R:16'
            },
            // 最後の A'：フルートが主題に重なり、D で頭の G へ戻る
            A3: {
                label: "A'",
                chords: CHORDS_A2,
                lead: THEME_TURN,
                unison: THEME_TURN,
                guitar: ARP,
                strings: 'hold',
                bass: BASS_B,
                drums: DRUMS_B
            }
        },
        intro: ['intro'],
        loop: ['A', 'A2', 'B', 'C', 'A3']
    };

    SoundKit.register('catalog', { songs: { hometown } });
})();
