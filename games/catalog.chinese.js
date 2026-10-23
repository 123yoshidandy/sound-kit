/**
 * 曲の一覧：桃の花の庭（中華風）
 * ヘ調の五音音階（宮 F・商 G・角 A・徴 C・羽 D）だけで書く。B は羽（D）を中心にして、少し陰らせる
 * 和音も五音音階の音だけでできるもの（F・F6・Dm7・sus2・sus4）にして、半音の響きを出さない
 */
(function () {
    const { repeat } = SoundKit;

    // A の主題（前半6小節は、どの A でも同じ）
    const A_HEAD = `C5:4 D5:2 F5:2 A5:6 G5:2 | F5:4 D5:2 C5:2 D5:8 | G5:3 A5:1 G5:2 F5:2 D5:4 G5:4 | C6:6 A5:2 G5:8 |
                    A5:4 C6:2 A5:2 G5:4 A5:4 | D6:6 C6:2 A5:4 F5:4`;
    // A の終わり：徴（C）の和音で止めて、頭の F へ戻る
    const A_END_HALF = 'G5:4 A5:2 G5:2 D5:4 C5:4 | F5:4 D5:4 G5:8';
    // A' の終わり：宮（F）で落ち着く
    const A_END_FULL = 'D5:4 F5:2 G5:2 A5:4 G5:4 | F5:12 r:4';

    const A_CHORDS = 'F | Dm7 | Gsus4 | Csus4 | F6 | Dm7 | Gsus2:8 Gsus4:8 | Csus4:8 Csus2:8';
    const A2_CHORDS = 'F | Dm7 | Gsus4 | Csus4 | F6 | Dm7 | Gsus4:8 Csus4:8 | F';

    // 古箏のグリッサンド：五音音階を16分音符で駆け上がる・駆け下りる（メロディより下で）
    const GLISS_UP = 'G3:1 A3:1 C4:1 D4:1 F4:1 G4:1 A4:1 C5:1';
    const GLISS_DOWN = 'C5:1 A4:1 G4:1 F4:1 D4:1 C4:1 A3:1 G3:1';
    const REST = 'r:16';

    const DRUMS_A = {
        kick: repeat('x.......x.......', 8, '|'),
        rim: repeat('....o.......o...', 8, '|')
    };
    // 堂鼓のつもりの tom を、8小節目で打ち込む
    const DRUMS_A2 = {
        kick: repeat('x.......x.......', 8, '|'),
        rim: repeat('x...o...x...o...', 8, '|'),
        tom: repeat('................', 7, '|') + '|........x.x.x.x.'
    };

    const chinese = {
        title: '桃の花の庭',
        tags: ['のどか', '中華風'],
        genre: 'ワールド',
        melody: ['lead'],
        bpm: 96,
        gain: 0.055,
        reverb: { seconds: 2.8, tone: 0.45 },
        delay: { time: 0.75, feedback: 0.25, tone: 2400, reverb: 0.3 },
        humanize: { time: 0.008, velocity: 0.1 },
        parts: {
            lead: { instrument: 'piano', volume: 1, decay: 0.9, brightness: 0.85, pan: -0.05, reverb: 0.3, delay: 0.12 },
            // 笛子（ディーズ）のつもり：息の音を多めに、ビブラートを深く
            dizi: { instrument: 'flute', volume: 0.5, vibrato: 10, breath: 0.07, pan: 0.25, reverb: 0.35, delay: 0.15 },
            // 古箏：明るくはじいて、長めに響かせる
            zheng: { instrument: 'pluck', mode: 'arp', from: 'G3', brightness: 0.85, sustain: 0.997, gate: 2.5, volume: 0.9, pan: 0.3, reverb: 0.25 },
            gliss: { instrument: 'pluck', brightness: 0.9, sustain: 0.997, gate: 3, volume: 0.8, pan: 0.35, reverb: 0.3, delay: 0.1 },
            // 銅鑼の代わり：低いベルの変調の比を整数からずらして、うなる金属の音にする
            gong: { instrument: 'bell', ratio: 1.41, index: 2, decay: 3.5, volume: 0.6, reverb: 0.45 },
            bass: { instrument: 'pluck', mode: 'bass', octave: 2, brightness: 0.3, sustain: 0.995, release: 0.15, volume: 1.05, gate: 0.95 },
            pad: { instrument: 'pad', mode: 'chords', center: 'A3', voices: 3, volume: 0.38, cutoff: 900, reverb: 0.5 },
            // kick と tom を堂鼓、rim を拍子木（梆子）に見立てる
            drums: { instrument: 'drums', kit: 'soft', mode: 'drums', volume: 1.1, levels: { kick: 0.6, tom: 0.55, rim: 0.4 } }
        },
        sections: {
            intro: {
                label: 'イントロ',
                chords: 'F6 | Dm7 | Gsus4 | Csus4:8 Csus2:8',
                zheng: '0:2 1 2 3 4 3 2 1',
                gliss: `G4:1 A4:1 C5:1 D5:1 F5:1 G5:1 A5:1 C6:1 D6:8 | ${REST} | ${REST} | r:8 ${GLISS_UP}`,
                gong: `F3:16 | ${REST} | ${REST} | ${REST}`,
                bass: 'r:16 | r:16 | R:16 | R:8 R:8',
                drums: { tom: '................|................|................|........x...x.x.' }
            },
            A: {
                chords: A_CHORDS,
                lead: `${A_HEAD} | ${A_END_HALF}`,
                zheng: '0:2 1 2 3 4 3 2 1',
                gliss: `${REST} | ${REST} | ${REST} | r:8 ${GLISS_UP} | ${REST} | ${REST} | ${REST} | r:8 ${GLISS_UP}`,
                gong: `F3:16 | ${repeat(REST, 7, ' | ')}`,
                bass: 'R:6 R:2 5:8',
                drums: DRUMS_A
            },
            // A'：メロディが伸ばしている所に、笛が答える
            A2: {
                label: "A'",
                chords: A2_CHORDS,
                lead: `${A_HEAD} | ${A_END_FULL}`,
                dizi: `r:16 | r:8 A5:2 C6:2 D6:4 | r:16 | r:8 A5:2 C6:2 D6:4 |
                       r:16 | r:12 C6:2 D6:2 | D6:8 C6:8 | A5:4 G5:2 A5:2 C6:8`,
                zheng: '0:2 1 2 3 4 3 2 1',
                gliss: `${REST} | ${REST} | ${REST} | r:8 ${GLISS_UP} | ${REST} | ${REST} | ${REST} | ${REST}`,
                gong: `F3:16 | ${repeat(REST, 7, ' | ')}`,
                bass: 'R:6 R:2 5:8',
                drums: DRUMS_A2
            },
            // B：羽（D）を中心に、メロディを高く。笛を休ませてパッドを敷き、古箏の形を変える
            B: {
                chords: 'Dm7 | Dm7/C | Gsus4 | Dm7 | F6 | Csus2 | Gsus4:8 Csus4:8 | Dm7',
                lead: `A5:4 C6:4 D6:6 C6:2 | A5:2 G5:2 F5:4 D5:8 | G5:4 A5:2 C6:2 D6:8 | C6:3 D6:1 C6:2 A5:2 G5:4 A5:4 |
                       F5:4 A5:4 C6:6 A5:2 | G5:6 F5:2 D5:4 C5:4 | D5:4 G5:4 F5:4 G5:4 | A5:12 r:4`,
                zheng: '0:2 2 1 3 2 4 3 2',
                gliss: `${REST} | ${REST} | ${REST} | r:8 ${GLISS_UP} | ${REST} | ${REST} | ${REST} | r:8 ${GLISS_DOWN}`,
                gong: `D3:16 | ${repeat(REST, 7, ' | ')}`,
                pad: 'hold',
                bass: 'R:8 5:8',
                drums: {
                    kick: repeat('x.........x.....', 8, '|'),
                    tom: repeat('................|............o.o.', 4, '|')
                }
            },
            // C：休憩。ドラムを抜き、ピアノは長い音だけ。笛が間で答え、古箏は4分音符に
            C: {
                chords: 'F6 | Dm7 | Gsus2 | Dm7 | F6 | Csus2 | Gsus4 | Csus4:8 Csus2:8',
                lead: 'F5:8 A5:8 | C6:16 | D6:8 A5:8 | F5:16 | C5:8 D5:8 | G5:16 | D5:8 G5:8 | G5:16',
                dizi: 'r:16 | r:8 D6:2 C6:2 A5:4 | r:16 | r:8 G5:2 A5:2 C6:4 | r:16 | r:8 A5:2 G5:2 D5:4 | r:16 | r:16',
                zheng: '0:4 2 3 4',
                gliss: `${repeat(REST, 7, ' | ')} | r:8 ${GLISS_UP}`,
                gong: `F3:16@0.7 | ${REST} | ${REST} | ${REST} | C3:16@0.7 | ${REST} | ${REST} | ${REST}`,
                pad: 'hold',
                bass: 'R:16',
                drums: { tom: repeat('................', 7, '|') + '|........x...x.x.' }
            },
            // 最後の A：笛が上で伸ばし、グリッサンドを増やす
            A3: {
                label: 'A',
                chords: A_CHORDS,
                lead: `${A_HEAD} | ${A_END_HALF}`,
                dizi: 'A5:8 C6:8 | A5:16 | D6:8 C6:8 | D6:8 C6:8 | C6:16 | F6:8 D6:8 | D6:16 | C6:8 D6:8',
                zheng: '0:2 1 2 3 4 3 2 1',
                gliss: `${REST} | r:8 ${GLISS_UP} | ${REST} | r:8 ${GLISS_UP} | ${REST} | r:8 ${GLISS_DOWN} | ${REST} | r:8 ${GLISS_UP}`,
                gong: `F3:16 | ${repeat(REST, 7, ' | ')}`,
                pad: 'hold',
                bass: 'R:6 R:2 5:8',
                drums: DRUMS_A2
            }
        },
        intro: ['intro'],
        loop: ['A', 'A2', 'B', 'C', 'A3']
    };

    SoundKit.register('catalog', { songs: { chinese } });
})();
