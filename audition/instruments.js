/**
 * 試聴ページの「楽器」で鳴らす短いフレーズと、主旋律に選べる楽器
 * 音量は、ページの中で書き出して測り、同じ大きさにそろえる（audition/app.js）
 * lead: true の楽器は、曲の「主旋律」の選択欄に出る
 * trim：聞こえ方の補正（dB）。同じ大きさにそろえても大きく聞こえる楽器を、その分小さくする
 */

(function () {
    const MELODY = 'C5:2 E5 G5 C6 B5:4 G5:4 A5:2 G5 E5 D5 C5:8';
    const CHIP = (duty, extra = {}) => ({ instrument: 'chip', wave: 'pulse', duty, level: 0.2, vibrato: 14, sustain: 0.6, ...extra });

    const LIST = [
        { id: 'marimba', group: 'たたく・はじく', name: 'マリンバ', note: '木の板をたたく', instrument: 'marimba', lead: true },
        { id: 'xylophone', group: 'たたく・はじく', name: 'シロフォン', note: '硬く短い木の板', instrument: 'xylophone', lead: true },
        { id: 'vibes', group: 'たたく・はじく', name: 'ビブラフォン', note: '金属の板・揺れ', instrument: 'vibes', lead: true },
        { id: 'bell', group: 'たたく・はじく', name: 'ベル', note: 'FM・金属的', instrument: 'bell', lead: true },
        { id: 'musicBox', group: 'たたく・はじく', name: 'オルゴール', note: '細い金属の歯', instrument: 'musicBox', lead: true },
        { id: 'kalimba', group: 'たたく・はじく', name: 'カリンバ', note: '丸い金属の歯', instrument: 'kalimba', lead: true },
        { id: 'steelpan', group: 'たたく・はじく', name: 'スチールパン', note: '南国の金属の鍋', instrument: 'steelpan', lead: true },
        { id: 'epiano', group: 'たたく・はじく', name: 'エレピ', note: 'FM・電気ピアノ', instrument: 'epiano', lead: true },
        { id: 'harp', group: 'たたく・はじく', trim: -3, name: 'ハープ', note: '明るくはじく弦', instrument: { instrument: 'pluck', brightness: 0.75, sustain: 0.997 }, lead: true },
        { id: 'pluck', group: 'たたく・はじく', trim: -3, name: 'はじく弦', note: 'やわらかい弦', instrument: 'pluck', lead: true },
        { id: 'flute', group: '伸ばす', name: 'フルート', note: '息の音・ビブラート', instrument: 'flute', lead: true },
        { id: 'whistle', group: '伸ばす', name: '口笛', note: '澄んだサイン波', instrument: { instrument: 'flute', breath: 0, vibrato: 18 }, lead: true },
        { id: 'ocarina', group: '伸ばす', name: 'オカリナ', note: '丸くこもった笛', instrument: 'ocarina', lead: true },
        { id: 'clarinet', group: '伸ばす', name: 'クラリネット', note: '木の管・奇数倍音', instrument: 'clarinet', lead: true },
        { id: 'organ', group: '伸ばす', name: 'オルガン', note: '倍音を足した持続音', instrument: 'organ', lead: true },
        { id: 'softLead', group: '伸ばす', name: 'シンセリード', note: 'やわらかい・ビブラート', instrument: 'softLead', lead: true },
        { id: 'chip25', group: 'チップ', trim: -5, name: 'チップ 25%', note: '矩形波・ファミコン風', instrument: CHIP(0.25), lead: true },
        { id: 'chip12', group: 'チップ', trim: -5, name: 'チップ 12.5%', note: '細い矩形波', instrument: CHIP(0.125, { vibrato: 16 }), lead: true },
        { id: 'chip50', group: 'チップ', trim: -5, name: 'チップ 50%', note: '太い矩形波', instrument: CHIP(0.5), lead: true },
        { id: 'pad', group: '伴奏・ドラム', name: 'パッド', note: 'やわらかい持続音', instrument: 'pad', notes: '[C4,E4,G4,B4]:16 [A3,C4,E4,G4]:16', gate: 0.85 },
        { id: 'synthBass', group: '伴奏・ドラム', name: 'シンセベース', note: 'ローパス', instrument: 'synthBass', notes: 'C2:3 C2:1 r:2 C3:2 G2:3 G2:1 Bb2:2 C3:4' },
        { id: 'triangle', group: 'チップ', name: 'チップ 三角波', note: 'ベース向き', instrument: { instrument: 'chip', wave: 'triangle', level: 0.4, sustain: 0.85 }, notes: 'C3:2 C4 C3 C4 G2:2 G3 G2 G3 C3:8' },
        { id: 'drums', group: '伴奏・ドラム', name: 'ドラム', note: 'やわらかい組', instrument: { instrument: 'drums', kit: 'soft' }, notes: 'kick:2 hat snare hat kick kick snare openHat kick:2 shaker rim shaker kick clap tom tom', unit: 0.13 },
        { id: 'chipDrums', group: 'チップ', name: 'ドラム（チップ）', note: '雑音と三角波', instrument: { instrument: 'drums', kit: 'chip' }, notes: 'kick:2 hat snare hat kick kick snare openHat', unit: 0.12 }
    ];

    const GROUPS = ['たたく・はじく', '伸ばす', 'チップ', '伴奏・ドラム'];
    LIST.sort((a, b) => GROUPS.indexOf(a.group) - GROUPS.indexOf(b.group));

    const effects = {};
    LIST.forEach(item => {
        effects[item.id] = [{ instrument: item.instrument, notes: item.notes ?? MELODY, unit: item.unit ?? 0.11, gate: item.gate, reverb: 0.2 }];
    });

    SoundKit.register('audition-instruments', {
        effects,
        groups: GROUPS,
        list: LIST.map(({ id, name, note, lead, instrument, group, trim }) => ({
            id, name, note, group, trim: trim ?? 0, lead: Boolean(lead),
            preset: typeof instrument === 'string' ? { instrument } : instrument
        }))
    });
})();
