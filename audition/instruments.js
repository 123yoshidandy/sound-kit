/**
 * 試聴ページの「楽器」で鳴らす短いフレーズ
 * 音量は、BGM と同じくらいの大きさにそろえる（LEVELS の dB。tools/measure.mjs --extra audition/instruments.js で測る）
 */

(function () {
    const LIST = [
        { id: 'marimba', name: 'マリンバ', note: '木の板をたたく音', instrument: 'marimba', notes: 'C5:2 E5 G5 C6 G5:1 E5 C5:6 [C4,G4]:8', unit: 0.11 },
        { id: 'vibes', name: 'ビブラフォン', note: '金属の板・揺れ', instrument: 'vibes', notes: 'E5:3 G5:1 B5:4 A5:8 [C4,E4,G4,B4]:12', unit: 0.11 },
        { id: 'bell', name: 'ベル', note: 'FM・金属的', instrument: 'bell', notes: 'G5:2 C6 E6 G6:6 [C6,E6,G6]:10', unit: 0.11 },
        { id: 'epiano', name: 'エレピ', note: 'FM・電気ピアノ', instrument: 'epiano', notes: '[F#3,A3,C#4,E4]:8 [E3,G3,B3,D4]:8 [D3,F#3,A3,C#4]:12', unit: 0.13 },
        { id: 'pluck', name: 'はじく弦', note: 'Karplus-Strong', instrument: 'pluck', notes: 'C4:2 G4 C5 E5 G5:2 E5 C5 G4 [C3,G3]:8', unit: 0.11 },
        { id: 'pad', name: 'パッド', note: 'やわらかい持続音', instrument: 'pad', notes: '[C4,E4,G4,B4]:16 [A3,C4,E4,G4]:16', unit: 0.1, gate: 0.85 },
        { id: 'synthBass', name: 'シンセベース', note: 'ローパス', instrument: 'synthBass', notes: 'C2:3 C2:1 r:2 C3:2 G2:3 G2:1 Bb2:2 C3:4', unit: 0.11 },
        { id: 'softLead', name: 'シンセリード', note: 'やわらかい・ビブラート', instrument: 'softLead', notes: 'E5:3 D5:1 C5:4 G5:8 E5:12', unit: 0.11 },
        { id: 'chip25', name: 'チップ 25%', note: '矩形波・ファミコン風', instrument: { instrument: 'chip', wave: 'pulse', duty: 0.25, level: 0.2, vibrato: 14 }, notes: 'C5:2 E5 G5 C6 B5:4 G5:4 C6:8', unit: 0.1 },
        { id: 'chip12', name: 'チップ 12.5%', note: '細い矩形波', instrument: { instrument: 'chip', wave: 'pulse', duty: 0.125, level: 0.22, vibrato: 16 }, notes: 'C5:2 E5 G5 C6 B5:4 G5:4 C6:8', unit: 0.1 },
        { id: 'triangle', name: 'チップ 三角波', note: 'ベース向き', instrument: { instrument: 'chip', wave: 'triangle', level: 0.4, sustain: 0.85 }, notes: 'C3:2 C4 C3 C4 G2:2 G3 G2 G3 C3:8', unit: 0.1 },
        { id: 'drums', name: 'ドラム', note: 'やわらかい組', instrument: { instrument: 'drums', kit: 'soft' }, notes: 'kick:2 hat snare hat kick kick snare openHat kick:2 shaker rim shaker kick clap tom tom', unit: 0.13 },
        { id: 'chipDrums', name: 'ドラム（チップ）', note: '雑音と三角波', instrument: { instrument: 'drums', kit: 'chip' }, notes: 'kick:2 hat snare hat kick kick snare openHat', unit: 0.12 }
    ];

    // 楽器ごとの音量（dB）
    const LEVELS = {
        marimba: -25.7, vibes: -26.0, bell: -28.8, epiano: -24.1, pluck: -21.3, pad: -20.4, synthBass: -20.4, softLead: -20.3, chip25: -15.3, chip12: -13.2, triangle: -22.2, drums: -22.4, chipDrums: -18.8
    };

    const effects = {};
    LIST.forEach(item => {
        effects[item.id] = [{
            instrument: item.instrument, notes: item.notes, unit: item.unit, gate: item.gate,
            volume: 10 ** ((LEVELS[item.id] ?? 0) / 20), reverb: 0.2
        }];
    });

    SoundKit.register('audition-instruments', { effects, list: LIST.map(({ id, name, note }) => ({ id, name, note })) });
})();
