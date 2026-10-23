import { describe, expect, it } from 'vitest';
import { loadKit } from '../tools/lint-songs.mjs';

const sandbox = {};
const SoundKit = loadKit([], sandbox);

// Web Audio のノードの形だけをまねた、音を出さない AudioContext（呼び出しの書き間違いを見つけるため）
function fakeContext() {
    const param = () => ({
        value: 0,
        setValueAtTime() {}, linearRampToValueAtTime() {}, exponentialRampToValueAtTime() {},
        setTargetAtTime() {}, cancelScheduledValues() {}
    });
    const node = (extra = {}) => ({
        connect(target) { return target; },
        disconnect() {},
        ...extra
    });
    const source = (extra = {}) => node({ start() {}, stop() {}, ...extra });
    const counts = { oscillators: 0, sources: 0 };
    const context = {
        sampleRate: 48000,
        currentTime: 0,
        counts,
        createOscillator: () => { counts.oscillators++; return source({ type: 'sine', frequency: param(), detune: param(), setPeriodicWave() {} }); },
        createGain: () => node({ gain: param() }),
        createBiquadFilter: () => node({ type: 'lowpass', frequency: param(), Q: param() }),
        createBufferSource: () => { counts.sources++; return source({ buffer: null, loop: false, playbackRate: param() }); },
        createBuffer: (channels, length) => {
            const data = Array.from({ length: channels }, () => new Float32Array(length));
            return { duration: length / 48000, getChannelData: (c) => data[c] };
        },
        createPeriodicWave: () => ({}),
        createDelay: () => node({ delayTime: param() }),
        createStereoPanner: () => node({ pan: param() }),
        createChannelMerger: () => node(),
        createConvolver: () => node({ buffer: null }),
        createDynamicsCompressor: () => node({ threshold: param(), knee: param(), ratio: param(), attack: param(), release: param() })
    };
    return context;
}

describe('楽器', () => {
    it.each(SoundKit.instruments.filter(name => name !== 'drums'))('%s を鳴らせる', (instrument) => {
        const context = fakeContext();
        // 効果音の形で、高い音・低い音・和音・滑らせる音を鳴らす
        const effect = [{ instrument, notes: 'C3:4 C6:4 [E4,G4]:8 C5~G5:4', unit: 0.1 }];
        expect(() => runEffect(context, effect)).not.toThrow();
        expect(context.counts.oscillators + context.counts.sources).toBeGreaterThan(0);
    });

    it.each(Object.entries(SoundKit.drumKits).flatMap(([kit, drums]) => drums.map(drum => [kit, drum])))('ドラム %s の %s を鳴らせる', (kit, drum) => {
        const context = fakeContext();
        expect(() => runEffect(context, [{ instrument: { instrument: 'drums', kit }, notes: `${drum}:1` }])).not.toThrow();
    });
});

// renderEffect は OfflineAudioContext を使うので、偽の context で同じ処理を通す
function runEffect(context, effect) {
    sandbox.OfflineAudioContext = function () { return Object.assign(context, { startRendering: () => Promise.resolve(null), destination: {} }); };
    try {
        SoundKit.renderEffect(effect);
    } finally {
        delete sandbox.OfflineAudioContext;
    }
}
