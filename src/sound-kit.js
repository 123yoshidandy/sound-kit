/**
 * sound-kit：ブラウザゲームの BGM と効果音
 * 音は Web Audio API でその場で合成する（音声ファイルも鳴らせる）。曲と効果音は、データ（games/*.js）で書く
 *
 * 普通の <script> で読み込むと window.SoundKit になる。ES モジュールからは sound-kit.mjs を import する
 *
 * 使い方:
 *   <script src="js/sound/sound-kit.js"></script>
 *   <script src="js/sound/mine-blocks.js"></script>      // SoundKit.register('mine-blocks', { songs, effects })
 *
 *   const sound = SoundKit.createPlayer({ library: 'mine-blocks', storageKey: 'mineBlocks.sound' });
 *   sound.setup();              // 最初のタップ・クリック・キー入力まで鳴らさない。別のタブを見ている間は止める
 *   sound.playBgm('main');      // BGM を流す（BGM が OFF なら、ON にしたときに流れる）
 *   sound.play('select');       // 効果音を鳴らす
 *   sound.toggle('bgm');        // 'effects'・'bgm' の ON/OFF（localStorage に保存する）
 *   sound.toggleAll();          // どちらかが鳴っていれば両方消し、両方消えていれば両方つける
 *   sound.onChange((settings) => ...);
 *
 * 曲の書き方は docs/composing.md にある
 */

(function () {
    'use strict';

    const VERSION = '0.1.0';
    const LOOKAHEAD_SEC = 0.35;   // BGM は、この先の分まで前もって予約する
    const SCHEDULE_MS = 60;       // 予約を確かめる間隔
    const UNLOCK_EVENTS = ['pointerdown', 'touchend', 'click', 'keydown'];

    // ===== 音名と和音 =====

    const PITCH_CLASSES = { C: 0, D: 2, E: 4, F: 5, G: 7, A: 9, B: 11 };

    // 音名（'C5'・'F#4'・'Bb3'）を MIDI の番号にする
    function noteToMidi(name) {
        const match = /^([A-G])(#|b)?(-?\d)$/.exec(name);
        if (!match) throw new Error(`音名が読めません: ${name}`);
        return (Number(match[3]) + 1) * 12 + pitchClass(match[1], match[2]);
    }

    function pitchClass(letter, accidental) {
        return (PITCH_CLASSES[letter] + (accidental === '#' ? 1 : accidental === 'b' ? -1 : 0) + 12) % 12;
    }

    function midiToFrequency(midi) {
        return 440 * 2 ** ((midi - 69) / 12);
    }

    function frequencyToMidi(frequency) {
        return 69 + 12 * Math.log2(frequency / 440);
    }

    // 音名か周波数（'1200hz'）を MIDI の番号にする（周波数のときは小数になる）
    function pitchToMidi(text) {
        const hz = /^(\d+(?:\.\d+)?)hz$/.exec(text);
        return hz ? frequencyToMidi(Number(hz[1])) : noteToMidi(text);
    }

    // 和音の種類 → 根音からの半音の数
    const CHORD_TYPES = {
        '': [0, 4, 7], m: [0, 3, 7], dim: [0, 3, 6], aug: [0, 4, 8], sus2: [0, 2, 7], sus4: [0, 5, 7],
        6: [0, 4, 7, 9], m6: [0, 3, 7, 9], 7: [0, 4, 7, 10], maj7: [0, 4, 7, 11], m7: [0, 3, 7, 10],
        m7b5: [0, 3, 6, 10], dim7: [0, 3, 6, 9], '7sus4': [0, 5, 7, 10], add9: [0, 4, 7, 14], madd9: [0, 3, 7, 14],
        9: [0, 4, 7, 10, 14], maj9: [0, 4, 7, 11, 14], m9: [0, 3, 7, 10, 14], '7b9': [0, 4, 7, 10, 13], 69: [0, 4, 7, 9, 14]
    };

    // 和音の記号（'Fmaj7'・'C/E'・'A7sus4'）を読む
    function parseChord(symbol) {
        const match = /^([A-G])(#|b)?([^/]*)(?:\/([A-G])(#|b)?)?$/.exec(symbol);
        if (!match || !(match[3] in CHORD_TYPES)) throw new Error(`和音が読めません: ${symbol}`);
        const root = pitchClass(match[1], match[2]);
        return {
            symbol,
            root,
            intervals: CHORD_TYPES[match[3]],
            bass: match[4] ? pitchClass(match[4], match[5]) : root
        };
    }

    // 和音の度数（'3'・'5' など）を、根音からの半音の数にする。和音にない度数は、近いもので代える
    function chordDegree(chord, degree) {
        const find = (candidates, fallback) => chord.intervals.find(i => candidates.includes(i)) ?? fallback;
        switch (degree) {
            case '1': return 0;
            case '3': return find([3, 4], find([2, 5], 4));
            case '5': return find([6, 7, 8], 7);
            case '6': return find([8, 9], 9);
            case '7': return find([9, 10, 11], 12);
            case '8': return 12;
            case '9': return find([13, 14, 15], 14);
            default: throw new Error(`度数が読めません: ${degree}`);
        }
    }

    // ===== 並びの記法 =====

    // 空白で区切った並びを読む。各項目は「中身[:長さ][@強さ]」。長さは16分音符の数で、省略すると前の項目と同じ
    // '|' は小節の区切りで、そこまでの長さが小節の長さの倍数でなければエラーにする（書き間違いを見つけるため）
    function parseSequence(text, { stepsPerBar = 16, defaultLength = 4, context = '' } = {}) {
        const items = [];
        let position = 0;
        let length = defaultLength;
        for (const raw of text.replace(/\|/g, ' | ').trim().split(/\s+/)) {
            if (raw === '') continue;
            if (raw === '|') {
                if (stepsPerBar && !isMultiple(position, stepsPerBar)) {
                    throw new Error(`${context}: 小節の長さが合いません（${Math.ceil(position / stepsPerBar)} 小節目、${position} ステップ）`);
                }
                continue;
            }
            const match = /^([^:@]+)(?::(\d+(?:\.\d+)?))?(?:@(\d+(?:\.\d+)?))?$/.exec(raw);
            if (!match) throw new Error(`${context}: 読めません: ${raw}`);
            if (match[2]) length = Number(match[2]);
            items.push({ token: match[1], start: position, length, velocity: match[3] ? Number(match[3]) : 1 });
            position += length;
        }
        return { items, length: position };
    }

    function isMultiple(value, unit) {
        const ratio = value / unit;
        return Math.abs(ratio - Math.round(ratio)) < 1e-6;
    }

    // 並びを、区間の長さまで繰り返す（区間より長ければエラー）
    function fillSection(parsed, sectionLength, context) {
        if (parsed.length === 0) return [];
        if (parsed.length > sectionLength + 1e-6) {
            throw new Error(`${context}: 区間より長い（${parsed.length} ステップ。区間は ${sectionLength} ステップ）`);
        }
        const items = [];
        for (let offset = 0; offset < sectionLength - 1e-6; offset += parsed.length) {
            for (const item of parsed.items) {
                const start = offset + item.start;
                if (start < sectionLength - 1e-6) items.push({ ...item, start, length: Math.min(item.length, sectionLength - start) });
            }
        }
        return items;
    }

    // 和音の並び（'F C/E | Dm7 | A7sus4:8 A7:8'）を読む。1小節に複数あれば、長さの指定がないものは残りを等分する
    function parseChordTrack(text, stepsPerBar, context) {
        const chords = [];
        let position = 0;
        text.split('|').forEach((bar, barIndex) => {
            const tokens = bar.trim().split(/\s+/).filter(Boolean);
            if (tokens.length === 0) throw new Error(`${context}: ${barIndex + 1} 小節目に和音がありません`);
            const parsed = tokens.map(token => {
                const [symbol, length] = token.split(':');
                return { chord: parseChord(symbol), length: length ? Number(length) : null };
            });
            const fixed = parsed.reduce((sum, p) => sum + (p.length ?? 0), 0);
            const free = parsed.filter(p => p.length === null).length;
            const each = free > 0 ? (stepsPerBar - fixed) / free : 0;
            if (Math.abs(fixed + each * free - stepsPerBar) > 1e-6 || each < 0) {
                throw new Error(`${context}: ${barIndex + 1} 小節目の和音の長さが合いません`);
            }
            parsed.forEach(p => {
                const length = p.length ?? each;
                chords.push({ start: position, length, chord: p.chord });
                position += length;
            });
        });
        return { chords, length: position };
    }

    function chordAt(track, step) {
        let found = track.chords[0];
        for (const entry of track.chords) {
            if (entry.start <= step + 1e-6) found = entry;
            else break;
        }
        return found;
    }

    function octaveShift(marks) {
        return 12 * ((marks.match(/\+/g) || []).length - (marks.match(/-/g) || []).length);
    }

    // ===== 曲の組み立て =====
    // 曲のデータを、音の一覧（いつ・どのパートで・どの高さを・どれだけの長さ）にする

    const compiledSongs = new WeakMap();

    function compileSong(song) {
        if (compiledSongs.has(song)) return compiledSongs.get(song);
        if (song.file) throw new Error('音声ファイルの曲は組み立てられません');
        const stepsPerBar = song.stepsPerBar ?? 16;
        const stepSeconds = 60 / song.bpm / 4; // 1ステップは16分音符（3拍子は stepsPerBar: 12）
        const order = [...(song.intro ?? []), ...song.loop];
        const events = [];
        const sections = [];
        const voicingState = {}; // パートごとの、前の和音の積み方（なめらかにつなぐため）
        let step = 0;

        order.forEach((name, orderIndex) => {
            const section = song.sections[name];
            if (!section) throw new Error(`${song.title ?? ''}: 区間 ${name} がありません`);
            const context = `${song.title ?? ''} ${name}`;
            const chords = section.chords ? parseChordTrack(section.chords, stepsPerBar, context) : null;
            const length = chords ? chords.length : (section.bars ?? 0) * stepsPerBar;
            if (!length) throw new Error(`${context}: 長さがありません（chords か bars を書く）`);
            sections.push({ name, label: section.label ?? name, start: step, length, bars: length / stepsPerBar, intro: orderIndex < (song.intro ?? []).length });

            for (const [partName, part] of Object.entries(song.parts)) {
                const content = section[partName];
                if (content == null || content === '') continue;
                const partContext = `${context} ${partName}`;
                const partEvents = compilePart(part, content, { chords, length, stepsPerBar, context: partContext, voicingState, partName });
                partEvents.forEach(event => events.push({ ...event, part: partName, start: event.start + step }));
            }
            step += length;
        });

        events.sort((a, b) => a.start - b.start);
        humanize(song, events);
        const loopStart = sections.filter(s => s.intro).reduce((sum, s) => sum + s.length, 0);
        const compiled = { song, stepSeconds, stepsPerBar, length: step, loopStart, loopLength: step - loopStart, events, sections };
        compiledSongs.set(song, compiled);
        return compiled;
    }

    // パートの書き方（mode）ごとに、音の一覧を作る
    function compilePart(part, content, info) {
        const spec = typeof content === 'string' ? { pattern: content } : content;
        const settings = { ...part, ...spec };
        const mode = part.mode ?? 'notes';
        const needsChords = mode === 'bass' || mode === 'arp' || mode === 'chords';
        if (needsChords && !info.chords) throw new Error(`${info.context}: 和音（chords）がない区間では使えません`);
        switch (mode) {
            case 'notes': return compileNotes(settings, info);
            case 'bass': return compileBass(settings, info);
            case 'arp': return compileArp(settings, info);
            case 'chords': return compileChords(settings, info);
            case 'drums': return compileDrums(spec, info);
            default: throw new Error(`${info.context}: mode が読めません: ${mode}`);
        }
    }

    // 音符の並び：'E5:2 G5 C6:4 r:4 [C4,E4,G4]:8 C5~G5:2'（r は休み、[ ] は同時に鳴らす音、~ は音の高さを滑らせる）
    function compileNotes(settings, info) {
        const parsed = parseSequence(settings.pattern, { stepsPerBar: info.stepsPerBar, context: info.context });
        const transpose = settings.transpose ?? 0;
        return fillSection(parsed, info.length, info.context).flatMap(item => {
            if (item.token === 'r') return [];
            const pitches = parsePitches(item.token, info.context);
            return pitches.midis.map(midi => ({
                start: item.start, length: item.length, velocity: item.velocity,
                midi: midi + transpose, glide: pitches.glide === null ? null : pitches.glide + transpose
            }));
        });
    }

    function parsePitches(token, context) {
        try {
            if (token.startsWith('[')) return { midis: token.slice(1, -1).split(',').map(pitchToMidi), glide: null };
            const [from, to] = token.split('~');
            return { midis: [pitchToMidi(from)], glide: to ? pitchToMidi(to) : null };
        } catch (error) {
            throw new Error(`${context}: ${error.message}`);
        }
    }

    // ベース：'R:4 r:2 5:2 8:4 5-:4'（R は根音か分数和音の低音、数字は和音の度数、+ と - でオクターブを上下する）
    // 1小節ぶんを書くと、区間の終わりまで繰り返す。音名もそのまま書ける
    function compileBass(settings, info) {
        const octave = settings.octave ?? 2;
        const parsed = parseSequence(settings.pattern, { stepsPerBar: info.stepsPerBar, context: info.context });
        return fillSection(parsed, info.length, info.context).flatMap(item => {
            if (item.token === 'r') return [];
            const { chord } = chordAt(info.chords, item.start);
            const match = /^(R|[1-9])([+-]*)$/.exec(item.token);
            let midi;
            if (match) {
                const base = (octave + 1) * 12;
                midi = match[1] === 'R'
                    ? base + chord.bass + octaveShift(match[2])
                    : base + chord.root + chordDegree(chord, match[1]) + octaveShift(match[2]);
            } else {
                midi = parsePitches(item.token, info.context).midis[0];
            }
            return [{ start: item.start, length: item.length, velocity: item.velocity, midi, glide: null }];
        });
    }

    // 分散和音：'0 1 2 1'（数字は、from の音より上で数えた和音の何番目の音か。+ と - でオクターブを上下する）
    function compileArp(settings, info) {
        const from = noteToMidi(settings.from ?? 'C4');
        const parsed = parseSequence(settings.pattern, { stepsPerBar: info.stepsPerBar, defaultLength: settings.length ?? 2, context: info.context });
        return fillSection(parsed, info.length, info.context).flatMap(item => {
            if (item.token === 'r') return [];
            const match = /^(\d)([+-]*)$/.exec(item.token);
            if (!match) throw new Error(`${info.context}: 分散和音の音が読めません: ${item.token}`);
            const { chord } = chordAt(info.chords, item.start);
            const tones = chordTonesFrom(chord, from);
            const index = Number(match[1]);
            const midi = tones[index % tones.length] + 12 * Math.floor(index / tones.length) + octaveShift(match[2]);
            return [{ start: item.start, length: item.length, velocity: item.velocity, midi, glide: null }];
        });
    }

    // 和音の構成音を、from 以上で低い順に並べる（1オクターブぶん）
    function chordTonesFrom(chord, from) {
        const classes = [...new Set(chord.intervals.map(i => (chord.root + i) % 12))];
        const tones = [];
        for (let midi = from; tones.length < classes.length; midi++) {
            if (classes.includes(((midi % 12) + 12) % 12)) tones.push(midi);
        }
        return tones;
    }

    // 和音の刻み：'x---x-x-'（x で鳴らし、- の数だけ伸ばす。. は休み。X は強く、o は弱く）
    // 'hold' と書くと、和音が変わるたびに、その和音の長さだけ鳴らす
    function compileChords(settings, info) {
        const center = noteToMidi(settings.center ?? 'C4');
        const voices = settings.voices ?? 4;
        const hits = settings.pattern === 'hold'
            ? info.chords.chords.map(entry => ({ start: entry.start, length: entry.length, velocity: 0.8 }))
            : gridHits(settings.pattern, info);
        return hits.flatMap(hit => {
            const { chord } = chordAt(info.chords, hit.start);
            const previous = info.voicingState[info.partName];
            const voicing = voiceChord(chord, center, voices, previous, settings.bass ?? false);
            info.voicingState[info.partName] = voicing;
            // strum：低い音から順に、何番目の音か（パートの strum の秒数だけずらして鳴らす）
            return voicing.map((midi, strum) => ({ start: hit.start, length: hit.length, velocity: hit.velocity, midi, glide: null, strum }));
        });
    }

    const GRID_VELOCITY = { X: 1, x: 0.8, o: 0.5 };

    // 刻みの文字列（16分音符1つが1文字。'|' は読み飛ばす）を、鳴らす位置・長さ・強さにする
    function gridHits(pattern, info) {
        const cells = pattern.replace(/[|\s]/g, '').split('');
        const hits = [];
        cells.forEach((cell, index) => {
            if (cell in GRID_VELOCITY) {
                let length = 1;
                while (cells[index + length] === '-') length++;
                hits.push({ start: index, length, velocity: GRID_VELOCITY[cell] });
            } else if (cell !== '-' && cell !== '.') {
                throw new Error(`${info.context}: 刻みの文字が読めません: ${cell}`);
            }
        });
        const parsed = { items: hits.map(hit => ({ ...hit, token: 'x' })), length: cells.length };
        return fillSection(parsed, info.length, info.context);
    }

    // 和音を、center のあたりに voices 個の音で積む。前の和音から動きが少ない積み方を選ぶ
    function voiceChord(chord, center, voices, previous, withBass) {
        let classes = chord.intervals.map(i => (chord.root + i) % 12);
        classes = [...new Set(classes)];
        // 音が多すぎたら、5度、根音の順に省く（響きを決める3度・7度・テンションを残す）
        const fifth = (chord.root + 7) % 12;
        if (classes.length > voices && classes.includes(fifth) && chord.intervals.includes(7)) classes = classes.filter(c => c !== fifth);
        if (classes.length > voices) classes = classes.filter(c => c !== chord.root);
        while (classes.length < voices) classes.push(classes[classes.length % Math.max(1, classes.length)]);
        classes = classes.slice(0, voices);

        let best = null;
        for (let rotation = 0; rotation < classes.length; rotation++) {
            const ordered = [...classes.slice(rotation), ...classes.slice(0, rotation)];
            for (const startOctaveOffset of [-12, 0]) {
                const stack = [];
                let low = center - 7 + startOctaveOffset;
                for (const pc of ordered) {
                    let midi = low;
                    while (((midi % 12) + 12) % 12 !== pc) midi++;
                    stack.push(midi);
                    low = midi + 1;
                }
                const mean = stack.reduce((a, b) => a + b, 0) / stack.length;
                let score = Math.abs(mean - center);
                if (previous && previous.length === stack.length) {
                    score += 0.6 * stack.reduce((sum, midi, i) => sum + Math.abs(midi - previous[i]), 0) / stack.length;
                }
                if (!best || score < best.score) best = { stack, score };
            }
        }
        const voicing = best.stack;
        if (withBass) {
            // いちばん下の音より下に、根音（分数和音なら指定の低音）を足す
            let bass = Math.min(...voicing) - 1;
            while (((bass % 12) + 12) % 12 !== chord.bass) bass--;
            voicing.unshift(bass);
        }
        return voicing;
    }

    // ドラム：{ kick: 'x...x...', snare: '....x...', hat: 'xoxoxoxo' }（1文字が16分音符1つ。X は強く、o は弱く）
    function compileDrums(spec, info) {
        return Object.entries(spec).flatMap(([drum, pattern]) => {
            const cells = pattern.replace(/[|\s]/g, '').split('');
            const hits = [];
            cells.forEach((cell, index) => {
                if (cell in GRID_VELOCITY) hits.push({ token: drum, start: index, length: 1, velocity: GRID_VELOCITY[cell] });
                else if (cell !== '.' && cell !== '-') throw new Error(`${info.context} ${drum}: 刻みの文字が読めません: ${cell}`);
            });
            return fillSection({ items: hits, length: cells.length }, info.length, `${info.context} ${drum}`)
                .map(item => ({ start: item.start, length: 1, velocity: item.velocity, drum }));
        });
    }

    // 人が弾いたような、わずかな時刻と強さのばらつきを付ける（乱数は固定なので、毎回同じになる）
    function humanize(song, events) {
        const random = seededRandom(song.seed ?? 1);
        const amount = song.humanize ?? { time: 0, velocity: 0 };
        events.forEach(event => {
            const part = song.parts[event.part];
            const enabled = part.humanize !== false;
            const t = random() * 2 - 1;
            const v = random() * 2 - 1;
            event.offset = enabled ? t * (amount.time ?? 0) : 0;
            event.velocity *= enabled ? 1 + v * (amount.velocity ?? 0) : 1;
        });
    }

    function seededRandom(seed) {
        let state = seed >>> 0;
        return () => {
            state = (state + 0x6D2B79F5) >>> 0;
            let t = state;
            t = Math.imul(t ^ (t >>> 15), t | 1);
            t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
            return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
        };
    }

    // ===== 音の部品 =====

    const contextCaches = new WeakMap(); // AudioContext ごとの、雑音や波形の作り置き

    function cacheOf(context) {
        if (!contextCaches.has(context)) contextCaches.set(context, { noise: null, waves: new Map(), plucks: new Map(), impulses: new Map() });
        return contextCaches.get(context);
    }

    function noiseBuffer(context) {
        const cache = cacheOf(context);
        if (!cache.noise) {
            const buffer = context.createBuffer(1, context.sampleRate * 2, context.sampleRate);
            const data = buffer.getChannelData(0);
            for (let i = 0; i < data.length; i++) data[i] = Math.random() * 2 - 1;
            cache.noise = buffer;
        }
        return cache.noise;
    }

    // 幅（duty）を変えた矩形波。0.5 で普通の矩形波、0.125 で細い音になる
    function pulseWave(context, duty) {
        const cache = cacheOf(context);
        if (!cache.waves.has(duty)) {
            const size = 64;
            const real = new Float32Array(size);
            const imag = new Float32Array(size);
            for (let n = 1; n < size; n++) real[n] = (2 / (n * Math.PI)) * Math.sin(n * Math.PI * duty);
            cache.waves.set(duty, context.createPeriodicWave(real, imag));
        }
        return cache.waves.get(duty);
    }

    function clamp(value, min, max) {
        return Math.min(max, Math.max(min, value));
    }

    // 音量の形（立ち上がり・減衰・持続・余韻）。decay と release は、-40dB まで下がる時間。音を止める時刻を返す
    function envelope(param, time, duration, { attack = 0.003, decay = 0.4, sustain = 0, release = 0.08 }, peak) {
        param.setValueAtTime(0, time);
        param.linearRampToValueAtTime(peak, time + attack);
        param.setTargetAtTime(peak * sustain, time + attack, decay / 4.6);
        const end = time + Math.max(duration, attack);
        param.setTargetAtTime(0, end, release / 4.6);
        const stop = end + release * 1.5;
        return sustain > 0 ? stop : Math.min(stop, time + attack + decay * 1.5);
    }

    function oscillator(context, type, frequency, time) {
        const node = context.createOscillator();
        if (typeof type === 'string') node.type = type;
        else node.setPeriodicWave(type);
        node.frequency.setValueAtTime(frequency, time);
        return node;
    }

    // だんだん消えるサイン波（打楽器の倍音に使う）。bend は、たたいた瞬間に高さが上ずる割合
    function decayingSine(context, out, time, frequency, peak, decay, bend = 0) {
        if (frequency > context.sampleRate * 0.45 || peak <= 0) return;
        const osc = oscillator(context, 'sine', frequency * (1 + bend), time);
        if (bend) osc.frequency.exponentialRampToValueAtTime(frequency, time + 0.04);
        const gain = context.createGain();
        gain.gain.setValueAtTime(0, time);
        gain.gain.linearRampToValueAtTime(peak, time + 0.002);
        gain.gain.setTargetAtTime(0, time + 0.002, decay / 4.6);
        osc.connect(gain).connect(out);
        osc.start(time);
        osc.stop(time + decay * 1.5 + 0.02);
    }

    // 板や歯をたたいた音：倍音（[倍率, 大きさ, 減衰の割合]）を重ね、当たる音を少し足す
    function struck(context, out, note, { partials, decay, click = 0, clickFrequency = 4000, bend = 0 }) {
        const { time, frequency, velocity } = note;
        partials.forEach(([ratio, level, share]) => decayingSine(context, out, time, frequency * ratio, level * velocity, decay * share, bend));
        if (click) noiseBurst(context, out, time, { duration: 0.012, peak: click * velocity, type: 'bandpass', frequency: Math.min(clickFrequency, 8000), q: 1 });
    }

    // 息の音：音の長さのあいだ鳴り続ける、帯域を絞った雑音
    function breath(context, out, time, duration, { frequency, peak, release = 0.1 }) {
        if (peak <= 0) return;
        const source = context.createBufferSource();
        source.buffer = noiseBuffer(context);
        source.loop = true;
        const filter = context.createBiquadFilter();
        filter.type = 'bandpass';
        filter.frequency.value = Math.min(frequency, 9000);
        filter.Q.value = 1.2;
        const gain = context.createGain();
        gain.gain.setValueAtTime(0, time);
        gain.gain.linearRampToValueAtTime(peak, time + 0.03);
        gain.gain.setTargetAtTime(peak * 0.35, time + 0.03, 0.06);
        const end = time + Math.max(duration, 0.03);
        gain.gain.setTargetAtTime(0, end, release / 4.6);
        source.connect(filter).connect(gain).connect(out);
        source.start(time, Math.random() * 1.5);
        source.stop(end + release * 1.5);
    }

    // 管楽器・オルガン：倍音（[倍率, 大きさ]）を重ねて伸ばし、ビブラートと息の音を足す
    function wind(context, out, note, { partials, wave = null, peak, attack, release = 0.12, sustain = 0.85, vibrato = 0, vibratoRate = 5, vibratoDelay = 0.25, breathLevel = 0, cutoff = null }) {
        const { time, frequency, velocity, duration } = note;
        const amp = context.createGain();
        const stop = envelope(amp.gain, time, duration, { attack, decay: 0.4, sustain, release }, peak * velocity);
        let input = amp;
        if (cutoff) {
            const filter = context.createBiquadFilter();
            filter.type = 'lowpass';
            filter.frequency.value = cutoff;
            filter.Q.value = 0.5;
            filter.connect(amp);
            input = filter;
        }
        const oscs = (wave ? [[1, 1, wave]] : partials).flatMap(([ratio, level, type = 'sine']) => {
            if (frequency * ratio > context.sampleRate * 0.45) return [];
            const osc = oscillator(context, type, frequency * ratio, time);
            applyGlide(osc, { ...note, glideFrequency: note.glideFrequency ? note.glideFrequency * ratio : null });
            const gain = context.createGain();
            gain.gain.value = level;
            osc.connect(gain).connect(input);
            osc.start(time);
            osc.stop(stop + 0.02);
            return [osc];
        });
        addVibrato(context, oscs, time, stop, { depth: vibrato, rate: vibratoRate, delay: vibratoDelay });
        amp.connect(out);
        breath(context, out, time, duration, { frequency: frequency * 2, peak: breathLevel * velocity, release });
    }

    // クラリネットの波形：奇数倍の倍音が強い
    function clarinetWave(context) {
        const cache = cacheOf(context);
        if (!cache.waves.has('clarinet')) {
            const size = 32;
            const real = new Float32Array(size);
            const imag = new Float32Array(size);
            for (let n = 1; n < size; n++) imag[n] = n % 2 === 1 ? 1 / n ** 1.1 : 0.03 / n;
            cache.waves.set('clarinet', context.createPeriodicWave(real, imag));
        }
        return cache.waves.get('clarinet');
    }

    // 雑音を、フィルターを通して短く鳴らす（打楽器）
    function noiseBurst(context, out, time, { duration, peak, type = 'highpass', frequency = 6000, q = 0.7, attack = 0.001 }) {
        const source = context.createBufferSource();
        source.buffer = noiseBuffer(context);
        const filter = context.createBiquadFilter();
        filter.type = type;
        filter.frequency.value = frequency;
        filter.Q.value = q;
        const gain = context.createGain();
        gain.gain.setValueAtTime(0, time);
        gain.gain.linearRampToValueAtTime(peak, time + attack);
        gain.gain.setTargetAtTime(0, time + attack, duration / 4.6);
        source.connect(filter).connect(gain).connect(out);
        source.start(time, Math.random() * 1.5);
        source.stop(time + attack + duration * 1.5 + 0.02);
    }

    // 高さが下がりながら消える音（キックなど）
    function sweepTone(context, out, time, { type = 'sine', from, to, sweep, duration, peak }) {
        const osc = oscillator(context, type, from, time);
        osc.frequency.exponentialRampToValueAtTime(to, time + sweep);
        const gain = context.createGain();
        gain.gain.setValueAtTime(0, time);
        gain.gain.linearRampToValueAtTime(peak, time + 0.002);
        gain.gain.setTargetAtTime(0, time + 0.002, duration / 4.6);
        osc.connect(gain).connect(out);
        osc.start(time);
        osc.stop(time + duration * 1.5 + 0.02);
    }

    // FM の1組（変調する音で、鳴る音の周波数を揺らす。index が大きいほど倍音が多く、明るい音になる）
    function fmTone(context, out, { time, end, frequency, ratio, index, indexEnd = 0, indexTime, peak, attack = 0.002, decay, sustain = 0, release = 0.1, detune = 0 }) {
        const carrier = oscillator(context, 'sine', frequency, time);
        carrier.detune.value = detune;
        const modulator = oscillator(context, 'sine', frequency * ratio, time);
        const depth = context.createGain();
        const deviation = frequency * ratio;
        depth.gain.setValueAtTime(index * deviation, time);
        depth.gain.setTargetAtTime(indexEnd * deviation, time, indexTime);
        modulator.connect(depth).connect(carrier.frequency);
        const amp = context.createGain();
        const stop = envelope(amp.gain, time, end - time, { attack, decay, sustain, release }, peak);
        carrier.connect(amp).connect(out);
        carrier.start(time);
        modulator.start(time);
        carrier.stop(stop + 0.02);
        modulator.stop(stop + 0.02);
        return carrier;
    }

    // ビブラート（少し遅れてかかる揺れ）を、音の detune につなぐ
    function addVibrato(context, targets, time, end, { depth = 0, rate = 5.5, delay = 0.25 }) {
        if (!depth) return;
        const lfo = oscillator(context, 'sine', rate, time);
        const amount = context.createGain();
        amount.gain.setValueAtTime(0, time);
        amount.gain.setValueAtTime(0, time + delay);
        amount.gain.linearRampToValueAtTime(depth, time + delay + 0.3);
        lfo.connect(amount);
        targets.forEach(target => amount.connect(target.detune));
        lfo.start(time);
        lfo.stop(end + 0.05);
    }

    function applyGlide(osc, note) {
        if (note.glideFrequency) osc.frequency.exponentialRampToValueAtTime(note.glideFrequency, note.time + (note.glideTime ?? note.duration));
    }

    // ===== 楽器 =====
    // 楽器は (context, 出力, 音, パートの設定) を受け取って、1つの音を鳴らす
    // 音：{ time, duration, frequency, midi, velocity, glideFrequency, drum }

    const INSTRUMENTS = {
        // マリンバ：木の板をたたいた音。基音と、2オクターブ上・約10倍の倍音が速く消える。マレットの当たる音を少し足す
        marimba(context, out, note, p) {
            const { time, frequency, velocity } = note;
            const decay = clamp(0.95 * (262 / frequency) ** 0.7, 0.14, 1.6) * (p.decay ?? 1);
            const brightness = p.brightness ?? 1;
            decayingSine(context, out, time, frequency, 0.6 * velocity, decay);
            decayingSine(context, out, time, frequency * 4, 0.14 * velocity * brightness, decay * 0.2);
            decayingSine(context, out, time, frequency * 9.8, 0.04 * velocity * brightness, decay * 0.07);
            noiseBurst(context, out, time, { duration: 0.012, peak: 0.08 * velocity * brightness, type: 'bandpass', frequency: Math.min(frequency * 5, 5000), q: 1 });
        },

        // ビブラフォン：マリンバより長く響く金属の板。ゆっくり揺れる
        vibes(context, out, note, p) {
            const { time, frequency, velocity, duration } = note;
            const decay = clamp(3 * (262 / frequency) ** 0.5, 0.8, 4) * (p.decay ?? 1);
            const amp = context.createGain();
            const stop = envelope(amp.gain, time, duration + (p.ring ?? 0.4), { attack: 0.002, decay, release: 0.3 }, 0.45 * velocity);
            const tremolo = context.createGain();
            const lfo = oscillator(context, 'sine', p.tremolo ?? 4.5, time);
            const depth = context.createGain();
            depth.gain.value = 0.25;
            lfo.connect(depth).connect(tremolo.gain);
            tremolo.gain.value = 0.75;
            const partials = [[1, 1], [4, 0.12], [10, 0.03]];
            partials.forEach(([ratio, level]) => {
                if (frequency * ratio > context.sampleRate * 0.45) return;
                const osc = oscillator(context, 'sine', frequency * ratio, time);
                const g = context.createGain();
                g.gain.setValueAtTime(level, time);
                if (ratio > 1) g.gain.setTargetAtTime(0, time, decay * 0.04);
                osc.connect(g).connect(amp);
                osc.start(time);
                osc.stop(stop + 0.02);
            });
            amp.connect(tremolo).connect(out);
            lfo.start(time);
            lfo.stop(stop + 0.02);
        },

        // ベル（FM）：変調の比が整数でないので、金属的な響きになる
        bell(context, out, note, p) {
            const { time, frequency, velocity, duration } = note;
            const decay = (p.decay ?? 2.2) * clamp((523 / frequency) ** 0.4, 0.5, 1.5);
            fmTone(context, out, {
                time, end: time + Math.max(duration, decay), frequency, ratio: p.ratio ?? 3.5,
                index: (p.index ?? 1.1) * (0.5 + 0.5 * velocity), indexEnd: 0.1, indexTime: decay * 0.15,
                peak: 0.42 * velocity, decay, release: 0.5
            });
        },

        // エレピ（FM）：1:1 の柔らかい本体と、1:14 の金属的なアタックを重ねる。強く弾くほど明るい
        epiano(context, out, note, p) {
            const { time, frequency, velocity, duration } = note;
            const decay = clamp(3.4 * (262 / frequency) ** 0.5, 0.8, 5) * (p.decay ?? 1);
            const end = time + Math.max(duration, 0.03);
            const release = p.release ?? 0.25;
            fmTone(context, out, {
                time, end, frequency, ratio: 1, index: (p.warmth ?? 0.9) * velocity, indexEnd: 0.12, indexTime: 0.4,
                peak: 0.2 * velocity, decay, sustain: 0, release
            });
            fmTone(context, out, {
                time, end, frequency, ratio: 14, index: (p.tine ?? 0.7) * velocity, indexEnd: 0, indexTime: 0.02,
                peak: 0.05 * velocity, decay: 0.5, release, detune: 4
            });
        },

        // はじく弦（Karplus-Strong）：雑音を、音の高さの周期で繰り返しながら丸めていく
        pluck(context, out, note, p) {
            const { time, frequency, velocity, duration, midi } = note;
            const brightness = p.brightness ?? 0.5;
            const { buffer, baseFrequency } = pluckBuffer(context, midi, brightness, p.sustain ?? 0.996);
            const source = context.createBufferSource();
            source.buffer = buffer;
            source.playbackRate.value = frequency / baseFrequency;
            // 高い倍音が耳につかないように、音の高さに合わせたローパスで丸める
            const filter = context.createBiquadFilter();
            filter.type = 'lowpass';
            filter.frequency.value = clamp(frequency * (2.5 + 5 * brightness), 500, 5000);
            filter.Q.value = 0.5;
            const gain = context.createGain();
            const release = p.release ?? 0.12;
            const end = time + duration;
            // はじいた瞬間の「カチッ」を消すため、少しだけかけて立ち上げる
            gain.gain.setValueAtTime(0, time);
            gain.gain.linearRampToValueAtTime(0.45 * velocity, time + 0.005);
            gain.gain.setTargetAtTime(0, end, release / 4.6);
            source.connect(filter).connect(gain).connect(out);
            source.start(time);
            source.stop(Math.min(end + release * 1.5, time + buffer.duration / source.playbackRate.value));
        },

        // パッド：少しずらした2つののこぎり波を、ローパスで丸める。ゆっくり立ち上がり、ゆっくり消える
        pad(context, out, note, p) {
            const { time, frequency, velocity, duration } = note;
            const filter = context.createBiquadFilter();
            filter.type = 'lowpass';
            filter.frequency.value = p.cutoff ?? 1400;
            filter.Q.value = 0.3;
            const amp = context.createGain();
            const stop = envelope(amp.gain, time, duration, { attack: p.attack ?? 0.6, decay: 1.5, sustain: 0.8, release: p.release ?? 1.2 }, 0.13 * velocity);
            [-8, 8].forEach(detune => {
                const osc = oscillator(context, p.wave ?? 'sawtooth', frequency, time);
                osc.detune.value = detune;
                osc.connect(filter);
                osc.start(time);
                osc.stop(stop + 0.02);
            });
            filter.connect(amp).connect(out);
        },

        // シンセベース：のこぎり波とサイン波を、動くローパスに通す（はじいた瞬間だけ明るい）
        synthBass(context, out, note, p) {
            const { time, frequency, velocity, duration } = note;
            const filter = context.createBiquadFilter();
            filter.type = 'lowpass';
            const cutoff = p.cutoff ?? 420;
            filter.frequency.setValueAtTime(cutoff * (1 + (p.envelope ?? 3) * velocity), time);
            filter.frequency.setTargetAtTime(cutoff, time, p.filterDecay ?? 0.08);
            filter.Q.value = p.resonance ?? 2;
            const amp = context.createGain();
            const stop = envelope(amp.gain, time, duration, { attack: 0.004, decay: p.decay ?? 0.6, sustain: p.sustain ?? 0.65, release: p.release ?? 0.06 }, 0.2 * velocity);
            const saw = oscillator(context, p.wave ?? 'sawtooth', frequency, time);
            const sub = oscillator(context, 'sine', frequency, time);
            const subGain = context.createGain();
            subGain.gain.value = p.sub ?? 0.8;
            saw.connect(filter);
            sub.connect(subGain).connect(amp);
            filter.connect(amp).connect(out);
            [saw, sub].forEach(osc => {
                applyGlide(osc, note);
                osc.start(time);
                osc.stop(stop + 0.02);
            });
        },

        // 柔らかいシンセのリード：のこぎり波2つと三角波をローパスで丸め、遅れてビブラートをかける
        softLead(context, out, note, p) {
            const { time, frequency, velocity, duration } = note;
            const filter = context.createBiquadFilter();
            filter.type = 'lowpass';
            filter.frequency.value = p.cutoff ?? 2200;
            filter.Q.value = 0.5;
            const amp = context.createGain();
            const stop = envelope(amp.gain, time, duration, { attack: p.attack ?? 0.02, decay: 0.4, sustain: 0.75, release: p.release ?? 0.18 }, 0.16 * velocity);
            const oscs = [['sawtooth', -6], ['sawtooth', 6], ['triangle', 0]].map(([type, detune]) => {
                const osc = oscillator(context, type, frequency, time);
                osc.detune.value = detune;
                applyGlide(osc, note);
                osc.connect(filter);
                osc.start(time);
                osc.stop(stop + 0.02);
                return osc;
            });
            addVibrato(context, oscs, time, stop, { depth: p.vibrato ?? 12, rate: 5, delay: 0.2 });
            filter.connect(amp).connect(out);
        },

        // チップチューン（ファミコンのような音）：wave は 'pulse'（duty で幅を変える）・'square'・'triangle'
        // envelope: 'decay' は昔の mine-blocks の音（鳴らしてから、音の長さで消えていく）
        chip(context, out, note, p) {
            const { time, frequency, velocity, duration } = note;
            const osc = oscillator(context, p.wave === 'pulse' ? pulseWave(context, p.duty ?? 0.25) : (p.wave ?? 'square'), frequency, time);
            applyGlide(osc, note);
            const amp = context.createGain();
            const peak = (p.level ?? 0.3) * velocity;
            let stop;
            if (p.envelope === 'decay') {
                amp.gain.setValueAtTime(0.0001, time);
                amp.gain.exponentialRampToValueAtTime(peak, time + 0.005);
                amp.gain.exponentialRampToValueAtTime(0.0001, time + duration);
                stop = time + duration;
            } else {
                stop = envelope(amp.gain, time, duration, { attack: 0.002, decay: p.decay ?? 0.3, sustain: p.sustain ?? 0.6, release: p.release ?? 0.04 }, peak);
            }
            addVibrato(context, [osc], time, stop, { depth: p.vibrato ?? 0, rate: 6, delay: p.vibratoDelay ?? 0.18 });
            osc.connect(amp).connect(out);
            osc.start(time);
            osc.stop(stop + 0.02);
        },

        // ピアノ：弦の倍音を重ねる。高い倍音ほど少し高めにずれ（弦の硬さ）、速く消える。強く弾くほど明るい
        // 2本の弦のわずかなずれでうなりを出し、ハンマーの当たる音を足す。鍵盤を離すとダンパーで止まる
        piano(context, out, note, p) {
            const { time, frequency, velocity, duration } = note;
            const decay = clamp(5 * (262 / frequency) ** 0.6, 0.7, 9) * (p.decay ?? 1);
            const end = time + Math.max(duration, 0.05);
            const release = p.release ?? 0.18;
            const inharmonicity = 0.0004;
            const brightness = (p.brightness ?? 1) * (0.5 + 0.5 * velocity);
            for (let n = 1; n <= 7; n++) {
                const partial = frequency * n * Math.sqrt(1 + inharmonicity * n * n);
                if (partial > context.sampleRate * 0.45) break;
                const level = (0.42 / n ** 1.1) * velocity * (n === 1 ? 1 : brightness ** (n - 1));
                const partialDecay = decay / (1 + 0.55 * (n - 1));
                // 基音だけは2本の弦にして、わずかにずらす（うなり）
                const detunes = n === 1 ? [-1.5, 1.5] : [0];
                detunes.forEach(detune => {
                    const osc = oscillator(context, 'sine', partial, time);
                    osc.detune.value = detune;
                    const gain = context.createGain();
                    const peak = level / detunes.length;
                    gain.gain.setValueAtTime(0, time);
                    gain.gain.linearRampToValueAtTime(peak, time + 0.003);
                    gain.gain.setTargetAtTime(0, time + 0.003, partialDecay / 4.6);
                    gain.gain.setTargetAtTime(0, end, release / 4.6);
                    osc.connect(gain).connect(out);
                    osc.start(time);
                    osc.stop(Math.min(end + release * 1.5, time + partialDecay * 1.5) + 0.02);
                });
            }
            noiseBurst(context, out, time, { duration: 0.02, peak: 0.05 * velocity * brightness, type: 'lowpass', frequency: Math.min(frequency * 8, 5000) });
        },

        // シロフォン：マリンバより硬く、短い。倍音は3倍
        xylophone(context, out, note, p) {
            const decay = clamp(0.6 * (262 / note.frequency) ** 0.6, 0.1, 0.9) * (p.decay ?? 1);
            struck(context, out, note, { decay, partials: [[1, 0.55, 1], [3, 0.22, 0.3], [6.2, 0.06, 0.1]], click: 0.14, clickFrequency: note.frequency * 6 });
        },

        // オルゴール：細い金属の歯をはじいた音。高い倍音がすぐ消えて、基音が長く残る
        musicBox(context, out, note, p) {
            const decay = clamp(2.2 * (523 / note.frequency) ** 0.5, 0.6, 3) * (p.decay ?? 1);
            struck(context, out, note, { decay, partials: [[1, 0.5, 1], [6.27, 0.12, 0.12], [17.55, 0.04, 0.04]], click: 0.05, clickFrequency: 6000 });
        },

        // カリンバ：オルゴールより低く丸い。はじいた瞬間に少し高さが上ずり、わずかにうなる
        kalimba(context, out, note, p) {
            const decay = clamp(1.4 * (262 / note.frequency) ** 0.5, 0.4, 2) * (p.decay ?? 1);
            struck(context, out, note, { decay, bend: 0.012, partials: [[1, 0.5, 1], [1.006, 0.1, 0.6], [6.1, 0.06, 0.08]], click: 0.1, clickFrequency: 1800 });
        },

        // スチールパン：整数倍に近い倍音がにぎやかに鳴り、たたいた瞬間に少し上ずる
        steelpan(context, out, note, p) {
            const decay = clamp(1.3 * (262 / note.frequency) ** 0.4, 0.4, 1.6) * (p.decay ?? 1);
            struck(context, out, note, { decay, bend: 0.02, partials: [[1, 0.42, 1], [2.005, 0.26, 0.7], [3.01, 0.11, 0.4], [4, 0.05, 0.2]], click: 0.04, clickFrequency: 3000 });
        },

        // フルート：基音の強いやわらかい音に、息の音。breath: 0 で口笛のような澄んだ音になる
        flute(context, out, note, p) {
            wind(context, out, note, {
                partials: [[1, 1], [2, 0.18], [3, 0.06]], peak: 0.28, attack: p.attack ?? 0.06,
                vibrato: p.vibrato ?? 14, breathLevel: p.breath ?? 0.05, release: p.release ?? 0.12
            });
        },

        // オカリナ：フルートより丸く、こもった音
        ocarina(context, out, note, p) {
            wind(context, out, note, {
                partials: [[1, 1], [2, 0.04], [3, 0.08]], peak: 0.3, attack: p.attack ?? 0.04,
                vibrato: p.vibrato ?? 10, breathLevel: p.breath ?? 0.025, release: p.release ?? 0.1
            });
        },

        // クラリネット：奇数倍の倍音が強い、木の管の音
        clarinet(context, out, note, p) {
            wind(context, out, note, {
                wave: clarinetWave(context), peak: 0.16, attack: p.attack ?? 0.05, cutoff: p.cutoff ?? 2600,
                vibrato: p.vibrato ?? 8, breathLevel: p.breath ?? 0.015, release: p.release ?? 0.1
            });
        },

        // オルガン：足し合わせた倍音（ドローバー）をそのまま伸ばす。速い揺れを少し
        organ(context, out, note, p) {
            wind(context, out, note, {
                partials: [[0.5, 0.3], [1, 0.8], [2, 0.5], [3, 0.25], [4, 0.2]], peak: 0.12, attack: 0.008, sustain: 0.95,
                vibrato: p.vibrato ?? 6, vibratoRate: 6.5, vibratoDelay: 0, release: p.release ?? 0.06
            });
        },

        // 弦楽器（ストリングス）：少しずつずらした3本ののこぎり波を、ゆっくり立ち上げてビブラートをかける。ローパスで弓の音のやわらかさを出す
        strings(context, out, note, p) {
            const { time, frequency, velocity, duration } = note;
            const filter = context.createBiquadFilter();
            filter.type = 'lowpass';
            filter.frequency.value = clamp(frequency * 6, 1200, 5000) * (p.brightness ?? 1);
            filter.Q.value = 0.7;
            const amp = context.createGain();
            const stop = envelope(amp.gain, time, duration, { attack: p.attack ?? 0.18, decay: 0.6, sustain: 0.85, release: p.release ?? 0.35 }, 0.09 * velocity);
            const oscs = [-9, 0, 9].map(detune => {
                const osc = oscillator(context, 'sawtooth', frequency, time);
                osc.detune.value = detune;
                applyGlide(osc, note);
                osc.connect(filter);
                osc.start(time);
                osc.stop(stop + 0.02);
                return osc;
            });
            addVibrato(context, oscs, time, stop, { depth: p.vibrato ?? 9, rate: 5.2, delay: 0.25 });
            filter.connect(amp).connect(out);
        },

        // ブラス：吹いた瞬間に明るさが開くのこぎり波と矩形波。少し下からしゃくり上げる
        brass(context, out, note, p) {
            const { time, frequency, velocity, duration } = note;
            const filter = context.createBiquadFilter();
            filter.type = 'lowpass';
            filter.Q.value = 1;
            const open = frequency * (p.brightness ?? 5) * (0.6 + 0.4 * velocity);
            filter.frequency.setValueAtTime(frequency * 1.5, time);
            filter.frequency.linearRampToValueAtTime(Math.min(open, 9000), time + 0.06);
            filter.frequency.setTargetAtTime(Math.min(frequency * 3.5, 7000), time + 0.06, 0.3);
            const amp = context.createGain();
            const stop = envelope(amp.gain, time, duration, { attack: p.attack ?? 0.035, decay: 0.5, sustain: 0.8, release: p.release ?? 0.12 }, 0.14 * velocity);
            const oscs = [['sawtooth', -4, 1], ['square', 4, 0.4]].map(([type, detune, level]) => {
                const osc = oscillator(context, type, frequency, time);
                osc.detune.setValueAtTime(detune - 35, time);
                osc.detune.linearRampToValueAtTime(detune, time + 0.06);
                applyGlide(osc, note);
                const gain = context.createGain();
                gain.gain.value = level;
                osc.connect(gain).connect(filter);
                osc.start(time);
                osc.stop(stop + 0.02);
                return osc;
            });
            addVibrato(context, oscs, time, stop, { depth: p.vibrato ?? 8, rate: 5.5, delay: 0.3 });
            filter.connect(amp).connect(out);
        },

        // アコーディオン：少しずらした2枚のリード（ミュゼット）を重ねる
        accordion(context, out, note, p) {
            wind(context, out, note, {
                partials: [[1, 0.6, 'sawtooth'], [1.007, 0.6, 'sawtooth'], [2, 0.12, 'square']], peak: 0.14, attack: p.attack ?? 0.03,
                sustain: 0.9, cutoff: p.cutoff ?? 3000, vibrato: 0, breathLevel: 0.008, release: p.release ?? 0.08
            });
        },

        // 合唱：のこぎり波を、母音「あー」の響き（フォルマント）を作る3つの帯域フィルターに通す
        choir(context, out, note, p) {
            const { time, frequency, velocity, duration } = note;
            const amp = context.createGain();
            const stop = envelope(amp.gain, time, duration, { attack: p.attack ?? 0.25, decay: 0.8, sustain: 0.9, release: p.release ?? 0.5 }, 0.5 * velocity);
            const mix = context.createGain();
            [[750, 1, 6], [1150, 0.6, 8], [2600, 0.25, 10]].forEach(([center, level, q]) => {
                const band = context.createBiquadFilter();
                band.type = 'bandpass';
                band.frequency.value = center;
                band.Q.value = q;
                const gain = context.createGain();
                gain.gain.value = level;
                mix.connect(band).connect(gain).connect(amp);
            });
            const oscs = [-6, 6].map(detune => {
                const osc = oscillator(context, 'sawtooth', frequency, time);
                osc.detune.value = detune;
                applyGlide(osc, note);
                osc.connect(mix);
                osc.start(time);
                osc.stop(stop + 0.02);
                return osc;
            });
            addVibrato(context, oscs, time, stop, { depth: p.vibrato ?? 12, rate: 5, delay: 0.2 });
            amp.connect(out);
        },

        // ギター：はじく弦に、胴の響き（低い山と高い山）を足す。和音の刻みのパートに strum（秒）を書くと、かき鳴らすようにずらす
        guitar(context, out, note, p) {
            const low = context.createBiquadFilter();
            low.type = 'peaking';
            low.frequency.value = 220;
            low.gain.value = 4;
            low.Q.value = 1;
            const high = context.createBiquadFilter();
            high.type = 'peaking';
            high.frequency.value = 2500;
            high.gain.value = 3;
            high.Q.value = 1.2;
            low.connect(high).connect(out);
            INSTRUMENTS.pluck(context, low, note, { brightness: p.brightness ?? 0.55, sustain: p.sustain ?? 0.995, release: p.release ?? 0.15 });
        },

        // ドラム：kit で音色の組を選ぶ（'soft'・'brush'・'acoustic'・'chip'・'legacy'）。levels でドラムごとの音量を変えられる
        drums(context, out, note, p) {
            const kit = DRUM_KITS[p.kit ?? 'soft'];
            const play = kit[note.drum];
            if (!play) throw new Error(`ドラムがありません: ${p.kit ?? 'soft'} の ${note.drum}`);
            play(context, out, note.time, note.velocity * (p.levels?.[note.drum] ?? 1));
        }
    };

    // ドラムの音色の組
    const DRUM_KITS = {
        soft: {
            kick: (c, o, t, v) => {
                sweepTone(c, o, t, { from: 125, to: 48, sweep: 0.07, duration: 0.38, peak: 0.85 * v });
                noiseBurst(c, o, t, { duration: 0.01, peak: 0.12 * v, type: 'lowpass', frequency: 3000 });
            },
            snare: (c, o, t, v) => {
                noiseBurst(c, o, t, { duration: 0.17, peak: 0.4 * v, type: 'bandpass', frequency: 2200, q: 0.8 });
                sweepTone(c, o, t, { type: 'triangle', from: 230, to: 180, sweep: 0.02, duration: 0.1, peak: 0.3 * v });
            },
            clap: (c, o, t, v) => {
                [0, 0.011, 0.022].forEach((offset, i) => noiseBurst(c, o, t + offset, { duration: i === 2 ? 0.15 : 0.012, peak: 0.32 * v, type: 'bandpass', frequency: 1300, q: 1.2 }));
            },
            rim: (c, o, t, v) => {
                noiseBurst(c, o, t, { duration: 0.025, peak: 0.25 * v, type: 'bandpass', frequency: 2600, q: 3 });
                sweepTone(c, o, t, { type: 'triangle', from: 820, to: 800, sweep: 0.01, duration: 0.04, peak: 0.22 * v });
            },
            hat: (c, o, t, v) => noiseBurst(c, o, t, { duration: 0.045, peak: 0.2 * v, type: 'highpass', frequency: 8000 }),
            openHat: (c, o, t, v) => noiseBurst(c, o, t, { duration: 0.32, peak: 0.13 * v, type: 'highpass', frequency: 7500 }),
            shaker: (c, o, t, v) => noiseBurst(c, o, t, { duration: 0.06, peak: 0.16 * v, type: 'bandpass', frequency: 6500, q: 1.5, attack: 0.012 }),
            tom: (c, o, t, v) => sweepTone(c, o, t, { from: 180, to: 110, sweep: 0.12, duration: 0.3, peak: 0.6 * v })
        },
        chip: {
            kick: (c, o, t, v) => sweepTone(c, o, t, { type: 'triangle', from: 210, to: 50, sweep: 0.06, duration: 0.16, peak: 0.9 * v }),
            snare: (c, o, t, v) => {
                noiseBurst(c, o, t, { duration: 0.12, peak: 0.36 * v, type: 'highpass', frequency: 1500 });
                sweepTone(c, o, t, { type: 'triangle', from: 260, to: 140, sweep: 0.04, duration: 0.06, peak: 0.35 * v });
            },
            hat: (c, o, t, v) => noiseBurst(c, o, t, { duration: 0.03, peak: 0.16 * v, type: 'highpass', frequency: 7000 }),
            openHat: (c, o, t, v) => noiseBurst(c, o, t, { duration: 0.18, peak: 0.1 * v, type: 'highpass', frequency: 6000 })
        },
        // 昔の mine-blocks の BGM のドラム（そのまま移したもの）
        legacy: {
            kick: (c, o, t, v) => legacyTone(c, o, { type: 'sine', from: 150, to: 45, start: t, duration: 0.12, volume: 0.7 * v }),
            snare: (c, o, t, v) => legacyNoise(c, o, { start: t, duration: 0.12, volume: 0.35 * v, filter: 'bandpass', frequency: 1800 }),
            hat: (c, o, t, v) => legacyNoise(c, o, { start: t, duration: 0.03, volume: 0.15 * v })
        }
    };

    // 金属的な響き：整数比でない6つの矩形波を重ね、高い所だけを残す（シンバル・ハイハット）
    function metal(context, out, time, { duration, peak, highpass = 7000, pitch = 1 }) {
        const filter = context.createBiquadFilter();
        filter.type = 'highpass';
        filter.frequency.value = highpass;
        const gain = context.createGain();
        gain.gain.setValueAtTime(0, time);
        gain.gain.linearRampToValueAtTime(peak, time + 0.002);
        gain.gain.setTargetAtTime(0, time + 0.002, duration / 4.6);
        filter.connect(gain).connect(out);
        [205.3, 304.4, 369.6, 522.7, 540, 800].forEach(f => {
            const osc = oscillator(context, 'square', f * pitch, time);
            const level = context.createGain();
            level.gain.value = 1 / 6;
            osc.connect(level).connect(filter);
            osc.start(time);
            osc.stop(time + duration * 1.5 + 0.02);
        });
    }

    // シンバル（どの組でも使えるように、soft に足しておく）
    DRUM_KITS.soft.ride = (c, o, t, v) => {
        metal(c, o, t, { duration: 0.8, peak: 0.05 * v, highpass: 6000, pitch: 1.6 });
        noiseBurst(c, o, t, { duration: 0.5, peak: 0.03 * v, type: 'highpass', frequency: 8000 });
    };
    DRUM_KITS.soft.crash = (c, o, t, v) => {
        noiseBurst(c, o, t, { duration: 1.4, peak: 0.12 * v, type: 'highpass', frequency: 4500 });
        metal(c, o, t, { duration: 1.2, peak: 0.04 * v, highpass: 5000, pitch: 2.1 });
    };

    // ブラシ：こするスネア（swish）と、たたくスネア（tap）。ジャズ向き
    DRUM_KITS.brush = {
        ...DRUM_KITS.soft,
        kick: (c, o, t, v) => sweepTone(c, o, t, { from: 100, to: 50, sweep: 0.06, duration: 0.3, peak: 0.6 * v }),
        snare: (c, o, t, v) => noiseBurst(c, o, t, { duration: 0.08, peak: 0.22 * v, type: 'bandpass', frequency: 2200, q: 0.8 }),
        swish: (c, o, t, v) => noiseBurst(c, o, t, { duration: 0.24, peak: 0.12 * v, type: 'bandpass', frequency: 3200, q: 0.6, attack: 0.03 }),
        hat: (c, o, t, v) => noiseBurst(c, o, t, { duration: 0.03, peak: 0.1 * v, type: 'highpass', frequency: 9000 })
    };

    // 生ドラム風：踏んだ瞬間の音があるキック、響き線の鳴るスネア、金属的なハイハット
    DRUM_KITS.acoustic = {
        ...DRUM_KITS.soft,
        kick: (c, o, t, v) => {
            sweepTone(c, o, t, { from: 110, to: 45, sweep: 0.06, duration: 0.45, peak: 0.95 * v });
            noiseBurst(c, o, t, { duration: 0.008, peak: 0.25 * v, type: 'lowpass', frequency: 5000 });
        },
        snare: (c, o, t, v) => {
            sweepTone(c, o, t, { type: 'triangle', from: 200, to: 170, sweep: 0.03, duration: 0.12, peak: 0.35 * v });
            noiseBurst(c, o, t, { duration: 0.2, peak: 0.45 * v, type: 'highpass', frequency: 1500 });
        },
        hat: (c, o, t, v) => metal(c, o, t, { duration: 0.05, peak: 0.12 * v, highpass: 8000 }),
        openHat: (c, o, t, v) => metal(c, o, t, { duration: 0.35, peak: 0.09 * v, highpass: 7500 }),
        tom: (c, o, t, v) => sweepTone(c, o, t, { from: 160, to: 120, sweep: 0.1, duration: 0.4, peak: 0.6 * v })
    };

    function legacyTone(context, out, { type, from, to, start, duration, volume }) {
        const osc = oscillator(context, type, from, start);
        if (to !== from) osc.frequency.exponentialRampToValueAtTime(to, start + duration);
        const gain = context.createGain();
        gain.gain.setValueAtTime(0.0001, start);
        gain.gain.exponentialRampToValueAtTime(volume, start + 0.005);
        gain.gain.exponentialRampToValueAtTime(0.0001, start + duration);
        osc.connect(gain).connect(out);
        osc.start(start);
        osc.stop(start + duration + 0.02);
    }

    function legacyNoise(context, out, { start, duration, volume, filter = 'highpass', frequency = 6000 }) {
        const source = context.createBufferSource();
        source.buffer = noiseBuffer(context);
        const biquad = context.createBiquadFilter();
        biquad.type = filter;
        biquad.frequency.value = frequency;
        const gain = context.createGain();
        gain.gain.setValueAtTime(volume, start);
        gain.gain.exponentialRampToValueAtTime(0.0001, start + duration);
        source.connect(biquad).connect(gain).connect(out);
        source.start(start);
        source.stop(start + duration + 0.02);
    }

    // はじく弦の音を作り置きする（音の高さごと）
    function pluckBuffer(context, midi, brightness, sustain) {
        const key = `${Math.round(midi)}:${brightness}:${sustain}`;
        const cache = cacheOf(context).plucks;
        if (cache.has(key)) return cache.get(key);
        const rate = context.sampleRate;
        const frequency = midiToFrequency(Math.round(midi));
        const period = Math.max(2, Math.round(rate / frequency - 0.5));
        const seconds = clamp(3 * (110 / frequency) ** 0.5, 0.5, 3);
        const buffer = context.createBuffer(1, Math.floor(rate * seconds), rate);
        const data = buffer.getChannelData(0);
        // 最初の1周期は、2段のローパスで丸めた雑音（brightness が小さいほど柔らかい）
        const smoothing = 0.08 + 0.5 * brightness;
        let low = 0;
        let lower = 0;
        let mean = 0;
        for (let i = 0; i < period; i++) {
            low += smoothing * ((Math.random() * 2 - 1) - low);
            lower += smoothing * (low - lower);
            data[i] = lower;
            mean += lower / period;
        }
        let peak = 0;
        for (let i = 0; i < period; i++) {
            data[i] -= mean;
            peak = Math.max(peak, Math.abs(data[i]));
        }
        for (let i = 0; i < period; i++) data[i] *= 0.8 / (peak || 1);
        for (let i = period; i < data.length; i++) {
            data[i] = sustain * 0.5 * (data[i - period] + data[i - period - 1 >= 0 ? i - period - 1 : 0]);
        }
        // 平均を取る処理で、周期が半サンプル延びる
        const result = { buffer, baseFrequency: rate / (period + 0.5) };
        cache.set(key, result);
        return result;
    }

    // ===== 響き（リバーブ・エコー）とミキサー =====

    // 雑音を指数で減衰させた残響。時間とともに高い音から先に消える
    function impulseResponse(context, seconds, tone) {
        const key = `${seconds}:${tone}`;
        const cache = cacheOf(context).impulses;
        if (cache.has(key)) return cache.get(key);
        const rate = context.sampleRate;
        const length = Math.floor(rate * seconds);
        const buffer = context.createBuffer(2, length, rate);
        for (let channel = 0; channel < 2; channel++) {
            const data = buffer.getChannelData(channel);
            let low = 0;
            for (let i = 0; i < length; i++) {
                const t = i / length;
                const coefficient = (0.15 + 0.75 * tone) * (1 - 0.8 * t);
                low += coefficient * ((Math.random() * 2 - 1) - low);
                data[i] = low * Math.exp(-6.9 * t);
            }
        }
        cache.set(key, buffer);
        return buffer;
    }

    function createReverb(context, { seconds = 2, tone = 0.5, preDelay = 0.015, level = 1 } = {}) {
        const input = context.createGain();
        const delay = context.createDelay(0.2);
        delay.delayTime.value = preDelay;
        const convolver = context.createConvolver();
        convolver.buffer = impulseResponse(context, seconds, tone);
        const output = context.createGain();
        output.gain.value = level;
        input.connect(delay).connect(convolver).connect(output);
        return { input, output };
    }

    // 左右に跳ねるエコー。time は拍の数（0.75 で付点8分音符）
    function createEcho(context, { time = 0.75, feedback = 0.3, tone = 2600, level = 1 } = {}, beatSeconds) {
        const input = context.createGain();
        const left = context.createDelay(4);
        const right = context.createDelay(4);
        left.delayTime.value = time * beatSeconds;
        right.delayTime.value = time * beatSeconds;
        const filter = context.createBiquadFilter();
        filter.type = 'lowpass';
        filter.frequency.value = tone;
        const back = context.createGain();
        back.gain.value = feedback;
        const merger = context.createChannelMerger(2);
        const output = context.createGain();
        output.gain.value = level;
        input.connect(filter).connect(left);
        left.connect(right);
        right.connect(back).connect(left);
        left.connect(merger, 0, 0);
        right.connect(merger, 0, 1);
        merger.connect(output);
        return { input, output };
    }

    // 左右で少しずつ揺れる短いディレイを重ねて、音に広がりを出す
    function createChorus(context, source, { depth = 0.0025, rate = 0.7, mix = 0.5 } = {}) {
        const output = context.createGain();
        source.connect(output);
        const merger = context.createChannelMerger(2);
        const lfos = [0, 1].map(channel => {
            const delay = context.createDelay(0.05);
            delay.delayTime.value = 0.014 + channel * 0.005;
            const lfo = oscillator(context, 'sine', rate * (1 + channel * 0.13), 0);
            const amount = context.createGain();
            amount.gain.value = depth;
            lfo.connect(amount).connect(delay.delayTime);
            const wet = context.createGain();
            wet.gain.value = mix;
            source.connect(delay).connect(wet).connect(merger, 0, channel);
            lfo.start();
            return lfo;
        });
        merger.connect(output);
        return { output, lfos };
    }

    // パートごとの通り道：音量・左右・ローパス・コーラス・リバーブとエコーへの送り
    function createChannel(context, part, buses) {
        const input = context.createGain();
        const lfos = [];
        let node = input;
        if (part.cutoff) {
            const filter = context.createBiquadFilter();
            filter.type = 'lowpass';
            filter.frequency.value = part.cutoff;
            filter.Q.value = 0.5;
            node.connect(filter);
            node = filter;
        }
        if (part.chorus) {
            const chorus = createChorus(context, node, part.chorus === true ? {} : part.chorus);
            lfos.push(...chorus.lfos);
            node = chorus.output;
        }
        let panned = node;
        if (context.createStereoPanner) {
            const panner = context.createStereoPanner();
            panner.pan.value = part.pan ?? 0;
            if (part.autopan) {
                const lfo = oscillator(context, 'sine', part.autopan.rate ?? 0.25, 0);
                const amount = context.createGain();
                amount.gain.value = part.autopan.depth ?? 0.3;
                lfo.connect(amount).connect(panner.pan);
                lfo.start();
                lfos.push(lfo);
            }
            node.connect(panner);
            panned = panner;
        }
        const fader = context.createGain();
        fader.gain.value = part.volume ?? 1;
        panned.connect(fader).connect(buses.bus);
        if (part.reverb && buses.reverb) {
            const send = context.createGain();
            send.gain.value = part.reverb;
            fader.connect(send).connect(buses.reverb.input);
        }
        if (part.delay && buses.echo) {
            const send = context.createGain();
            send.gain.value = part.delay;
            fader.connect(send).connect(buses.echo.input);
        }
        return { input, lfos, fader };
    }

    // パートの差し替え：楽器を替えるときは、通り道の設定（音量・左右・送りなど）と書き方だけを元から残す
    const CHANNEL_KEYS = ['mode', 'octave', 'from', 'center', 'voices', 'transpose', 'volume', 'pan', 'reverb', 'delay', 'cutoff', 'chorus', 'autopan', 'humanize'];

    function partWith(part, override) {
        if (!override) return part;
        if (!override.instrument) return { ...part, ...override };
        const kept = Object.fromEntries(CHANNEL_KEYS.filter(key => key in part).map(key => [key, part[key]]));
        return { ...kept, ...override };
    }

    // 曲ごとのミキサー（曲の音量の出口と、リバーブ・エコー・パートの通り道）
    function createMixer(context, destination, song, compiled, overrides = {}) {
        const bus = context.createGain();
        bus.gain.value = song.gain ?? 1;
        bus.connect(destination);
        const reverb = song.reverb ? createReverb(context, song.reverb) : null;
        if (reverb) reverb.output.connect(bus);
        const echo = song.delay ? createEcho(context, song.delay, compiled.stepSeconds * 4) : null;
        if (echo) {
            echo.output.connect(bus);
            if (reverb && song.delay.reverb) {
                const send = context.createGain();
                send.gain.value = song.delay.reverb;
                echo.output.connect(send).connect(reverb.input);
            }
        }
        const channels = {};
        for (const [name, part] of Object.entries(song.parts)) channels[name] = createChannel(context, partWith(part, overrides[name]), { bus, reverb, echo });
        return {
            bus,
            channels,
            dispose() {
                Object.values(channels).forEach(channel => channel.lfos.forEach(lfo => lfo.stop()));
                bus.disconnect();
            }
        };
    }

    // 全体の出口：音量と、音割れを防ぐリミッター（普段は効かない高さにしておく）
    function createOutput(context, volume) {
        const master = context.createGain();
        master.gain.value = volume;
        const limiter = context.createDynamicsCompressor();
        limiter.threshold.value = -3;
        limiter.knee.value = 2;
        limiter.ratio.value = 12;
        limiter.attack.value = 0.002;
        limiter.release.value = 0.15;
        master.connect(limiter).connect(context.destination);
        return master;
    }

    // ===== 曲の再生（時刻どおりに予約する） =====

    class SongPlayback {
        // parts：鳴らすパートの名前の配列（省くと全部。パートごとの音量を測るときに使う）
        // overrides：パートの差し替え（{ lead: { instrument: 'flute', volume: 0.8 } } など。試聴ページで主旋律を選ぶとき）
        constructor(context, destination, song, { fromStep = 0, startTime = context.currentTime + 0.06, fadeIn = 0, parts = null, overrides = {} } = {}) {
            this.context = context;
            this.song = song;
            this.parts = parts;
            this.overrides = overrides;
            this.compiled = compileSong(song);
            this.mixer = createMixer(context, destination, song, this.compiled, overrides);
            const gain = song.gain ?? 1;
            if (fadeIn > 0) {
                this.mixer.bus.gain.setValueAtTime(0, startTime);
                this.mixer.bus.gain.linearRampToValueAtTime(gain, startTime + fadeIn);
            }
            const { stepSeconds, events } = this.compiled;
            this.origin = startTime - fromStep * stepSeconds; // 1周目の曲の頭の時刻
            this.shift = 0;                                   // 何周目か（ずらすステップ数）
            this.index = events.findIndex(event => event.start >= fromStep - 1e-6);
            if (this.index === -1) this.index = events.length;
            this.stopped = false;
        }

        // ステップ（16分音符の位置）を時刻にする。裏拍は swing の分だけ遅らせる
        timeOf(step) {
            const { stepSeconds } = this.compiled;
            const unit = this.song.swingUnit ?? 1;
            const swing = this.song.swing ?? 0;
            const swung = swing && isMultiple(step - unit, unit * 2) ? swing * unit * stepSeconds : 0;
            return this.origin + (step + this.shift) * stepSeconds + swung;
        }

        // until の時刻より前に鳴らす音を、まとめて予約する
        schedule(until) {
            const { events, loopStart, loopLength, stepSeconds } = this.compiled;
            if (this.stopped || events.length === 0) return;
            let wrapped = 0;
            while (true) {
                if (this.index >= events.length) {
                    // 曲の終わりまで来たら、ループの頭に戻る
                    this.shift += loopLength;
                    this.index = events.findIndex(event => event.start >= loopStart - 1e-6);
                    if (this.index === -1 || ++wrapped > 1) return;
                    continue;
                }
                const event = events[this.index];
                const time = this.timeOf(event.start) + event.offset + (event.strum ?? 0) * (this.song.parts[event.part].strum ?? 0);
                if (time >= until) return;
                const audible = !this.parts || this.parts.includes(event.part);
                if (audible && time >= this.context.currentTime - 0.02) this.playEvent(event, Math.max(time, this.context.currentTime), stepSeconds);
                this.index++;
            }
        }

        // 鳴らしている途中でパートを差し替える（次の音から変わる。音量はなめらかに変える）
        setOverrides(overrides) {
            this.overrides = overrides;
            const now = this.context.currentTime;
            for (const [name, part] of Object.entries(this.song.parts)) {
                this.mixer.channels[name].fader.gain.setTargetAtTime(partWith(part, overrides[name]).volume ?? 1, now, 0.03);
            }
        }

        playEvent(event, time, stepSeconds) {
            const part = partWith(this.song.parts[event.part], this.overrides[event.part]);
            const instrument = INSTRUMENTS[part.instrument];
            if (!instrument) throw new Error(`楽器がありません: ${part.instrument}`);
            const duration = event.length * stepSeconds * (part.gate ?? 1);
            instrument(this.context, this.mixer.channels[event.part].input, {
                time,
                duration,
                midi: event.midi,
                frequency: event.midi === undefined ? 0 : midiToFrequency(event.midi),
                glideFrequency: event.glide == null ? null : midiToFrequency(event.glide),
                velocity: event.velocity,
                drum: event.drum
            }, part);
        }

        // 今の位置（ループの中のステップ数・区間・小節）
        position(time = this.context.currentTime) {
            const { stepSeconds, length, loopStart, loopLength, sections, stepsPerBar } = this.compiled;
            let step = Math.max(0, (time - this.origin) / stepSeconds);
            if (step >= length) step = loopStart + ((step - loopStart) % loopLength);
            const section = sections.find(s => step >= s.start && step < s.start + s.length) ?? sections[0];
            return {
                step,
                length,
                section: section.name,
                label: section.label,
                bar: Math.floor((step - section.start) / stepsPerBar) + 1,
                bars: section.bars
            };
        }

        stop(fade = 0.3) {
            if (this.stopped) return;
            this.stopped = true;
            const now = this.context.currentTime;
            const gain = this.mixer.bus.gain;
            gain.cancelScheduledValues(now);
            gain.setValueAtTime(gain.value, now);
            gain.setTargetAtTime(0, now, fade / 4);
            setTimeout(() => this.mixer.dispose(), (fade + LOOKAHEAD_SEC + 0.5) * 1000);
        }
    }

    // 音声ファイルの BGM（loopStart・loopEnd でループの範囲を決められる）
    class FilePlayback {
        constructor(context, destination, song, buffer, { fadeIn = 0 } = {}) {
            this.context = context;
            this.song = song;
            this.gain = context.createGain();
            this.gain.connect(destination);
            const volume = song.gain ?? 1;
            const now = context.currentTime;
            this.gain.gain.setValueAtTime(fadeIn > 0 ? 0 : volume, now);
            if (fadeIn > 0) this.gain.gain.linearRampToValueAtTime(volume, now + fadeIn);
            this.source = context.createBufferSource();
            this.source.buffer = buffer;
            this.source.loop = true;
            if (song.loopStart) this.source.loopStart = song.loopStart;
            if (song.loopEnd) this.source.loopEnd = song.loopEnd;
            this.source.connect(this.gain);
            this.source.start(now + 0.02);
            this.startTime = now + 0.02;
            this.stopped = false;
        }

        schedule() {}

        position(time = this.context.currentTime) {
            return { step: 0, length: 0, section: '', label: '', bar: 0, bars: 0, seconds: time - this.startTime };
        }

        stop(fade = 0.3) {
            if (this.stopped) return;
            this.stopped = true;
            const now = this.context.currentTime;
            this.gain.gain.cancelScheduledValues(now);
            this.gain.gain.setValueAtTime(this.gain.gain.value, now);
            this.gain.gain.setTargetAtTime(0, now, fade / 4);
            this.source.stop(now + fade * 2);
        }
    }

    // ===== 効果音 =====
    // 効果音は、音の層の配列。各層：{ instrument, notes, unit（長さ1つの秒数）, at（始まりの秒）, volume, pan, reverb, gate }

    const parsedEffects = new WeakMap();

    function parseEffectLayer(layer) {
        if (!parsedEffects.has(layer)) {
            parsedEffects.set(layer, parseSequence(layer.notes, { stepsPerBar: 0, defaultLength: 1, context: '効果音' }).items);
        }
        return parsedEffects.get(layer);
    }

    function playEffect(context, destination, reverb, definition, time, volume = 1) {
        for (const layer of definition) {
            const part = typeof layer.instrument === 'string' ? { instrument: layer.instrument } : layer.instrument;
            const instrument = INSTRUMENTS[part.instrument];
            if (!instrument) throw new Error(`楽器がありません: ${part.instrument}`);
            const out = context.createGain();
            out.gain.value = volume * (layer.volume ?? 1);
            let panned = out;
            if (layer.pan && context.createStereoPanner) {
                const panner = context.createStereoPanner();
                panner.pan.value = layer.pan;
                out.connect(panner);
                panned = panner;
            }
            panned.connect(destination);
            if (layer.reverb && reverb) {
                const send = context.createGain();
                send.gain.value = layer.reverb;
                panned.connect(send).connect(reverb.input);
            }
            const unit = layer.unit ?? 0.05;
            const start = time + (layer.at ?? 0);
            for (const item of parseEffectLayer(layer)) {
                if (item.token === 'r') continue;
                const noteTime = start + item.start * unit;
                const duration = item.length * unit * (layer.gate ?? 1);
                if (part.instrument === 'drums') {
                    instrument(context, out, { time: noteTime, duration, velocity: item.velocity, drum: item.token }, part);
                    continue;
                }
                const pitches = parsePitches(item.token, '効果音');
                pitches.midis.forEach(midi => instrument(context, out, {
                    time: noteTime, duration, midi, frequency: midiToFrequency(midi), velocity: item.velocity,
                    glideFrequency: pitches.glide === null ? null : midiToFrequency(pitches.glide)
                }, part));
            }
        }
    }

    function effectLength(definition) {
        return Math.max(...definition.map(layer => {
            const items = parseEffectLayer(layer);
            const end = items.reduce((max, item) => Math.max(max, item.start + item.length), 0);
            return (layer.at ?? 0) + end * (layer.unit ?? 0.05);
        }));
    }

    // ===== 書き出し（音を聞けない分を、数値で確かめるため） =====

    const EFFECTS_REVERB = { seconds: 1.4, tone: 0.55 };

    // 曲を OfflineAudioContext で書き出す（seconds を省くと、イントロとループ1周と余韻）
    function renderSong(song, { seconds = null, fromStep = 0, sampleRate = 48000, volume = 0.8, parts = null, overrides = {} } = {}) {
        const compiled = compileSong(song);
        const total = seconds ?? (compiled.length - fromStep) * compiled.stepSeconds + 2.5;
        const context = new OfflineAudioContext(2, Math.ceil(total * sampleRate), sampleRate);
        const master = createOutput(context, volume);
        const playback = new SongPlayback(context, master, song, { fromStep, startTime: 0, parts, overrides });
        playback.schedule(total);
        return context.startRendering();
    }

    function renderEffect(definition, { seconds = null, sampleRate = 48000, volume = 0.8 } = {}) {
        const total = seconds ?? effectLength(definition) + 1.5;
        const context = new OfflineAudioContext(2, Math.ceil(total * sampleRate), sampleRate);
        const master = createOutput(context, volume);
        const reverb = createReverb(context, EFFECTS_REVERB);
        reverb.output.connect(master);
        playEffect(context, master, reverb, definition, 0.01);
        return context.startRendering();
    }

    // 書き出した音の大きさ（統合ラウドネス、LUFS）。K 特性の係数は 48kHz のもの（ほかの周波数でも目安にはなる）
    function loudness(buffer) {
        const filters = [
            { b: [1.53512485958697, -2.69169618940638, 1.19839281085285], a: [-1.69065929318241, 0.73248077421585] },
            { b: [1, -2, 1], a: [-1.99004745483398, 0.99007225036621] }
        ];
        const size = Math.floor(buffer.sampleRate * 0.4);
        const hop = Math.floor(buffer.sampleRate * 0.1);
        const sums = [];
        for (let c = 0; c < buffer.numberOfChannels; c++) {
            let data = buffer.getChannelData(c);
            for (const { b, a } of filters) {
                const out = new Float32Array(data.length);
                let x1 = 0, x2 = 0, y1 = 0, y2 = 0;
                for (let i = 0; i < data.length; i++) {
                    const y = b[0] * data[i] + b[1] * x1 + b[2] * x2 - a[0] * y1 - a[1] * y2;
                    x2 = x1; x1 = data[i]; y2 = y1; y1 = y;
                    out[i] = y;
                }
                data = out;
            }
            const sum = new Float64Array(data.length + 1);
            for (let i = 0; i < data.length; i++) sum[i + 1] = sum[i] + data[i] * data[i];
            sums.push(sum);
        }
        const toLufs = (power) => -0.691 + 10 * Math.log10(power || 1e-12);
        const blocks = [];
        for (let start = 0; start + size <= buffer.length; start += hop) {
            blocks.push(sums.reduce((total, sum) => total + (sum[start + size] - sum[start]) / size, 0));
        }
        const loud = blocks.filter(power => toLufs(power) > -70);
        if (loud.length === 0) return -Infinity;
        const gate = toLufs(loud.reduce((a, b) => a + b, 0) / loud.length) - 10;
        const kept = loud.filter(power => toLufs(power) > gate);
        return toLufs(kept.reduce((a, b) => a + b, 0) / kept.length);
    }

    // ===== ゲームから使う入口 =====

    const libraries = {};

    // ゲームごとの曲と効果音を登録する（games/*.js から呼ぶ）。ほかの項目もそのまま残す
    // 同じ名前で何度も呼ぶと、足し合わせる（曲の候補を別のファイルに分けて書くとき）
    function register(name, { songs = {}, effects = {}, ...rest }) {
        const current = libraries[name] ?? { songs: {}, effects: {} };
        libraries[name] = { ...current, ...rest, songs: { ...current.songs, ...songs }, effects: { ...current.effects, ...effects } };
    }

    function library(name) {
        if (!libraries[name]) throw new Error(`曲と効果音が登録されていません: ${name}（games/${name}.js を先に読み込む）`);
        return libraries[name];
    }

    // library：登録した名前。songs・effects で足したり差し替えたりできる
    // volume：{ master, bgm, effects }（既定は 0.8・1・1）。ignoreSilentSwitch：iPhone の消音モードでも鳴らす（試聴ページ用）
    function createPlayer({ library: libraryName = null, songs = {}, effects = {}, storageKey = null, volume = {}, ignoreSilentSwitch = false } = {}) {
        const base = libraryName ? library(libraryName) : { songs: {}, effects: {} };
        const allSongs = { ...base.songs, ...songs };
        const allEffects = { ...base.effects, ...effects };
        const levels = { master: 0.8, bgm: 1, effects: 1, ...volume };
        const state = {
            context: null, master: null, bgmBus: null, effectsBus: null, effectsReverb: null,
            settings: loadSettings(), listeners: new Set(),
            bgmName: null, bgmFromStep: 0, overrides: {}, playback: null, timer: null, buffers: new Map(), loading: new Map()
        };

        function loadSettings() {
            try {
                const saved = storageKey ? JSON.parse(localStorage.getItem(storageKey) || 'null') : null;
                return { effects: saved?.effects ?? true, bgm: saved?.bgm ?? true };
            } catch {
                return { effects: true, bgm: true };
            }
        }

        function saveSettings() {
            if (!storageKey) return;
            try {
                localStorage.setItem(storageKey, JSON.stringify(state.settings));
            } catch {
                // 保存できなくても、このページを開いている間は切り替えが効く
            }
        }

        function setSettings(settings) {
            state.settings = { ...state.settings, ...settings };
            saveSettings();
            unlock(); // 切り替えのボタンを押したこと自体が、最初の操作になることもある
            update();
            state.listeners.forEach(listener => listener(getSettings()));
        }

        function getSettings() {
            return { ...state.settings };
        }

        // 最初のタップ・クリック・キー入力で音を使えるようにする（自動再生の制限のため、操作の中で作る）
        function setup() {
            const onInput = () => {
                unlock();
                if (state.context?.state === 'running') UNLOCK_EVENTS.forEach(type => document.removeEventListener(type, onInput, true));
            };
            UNLOCK_EVENTS.forEach(type => document.addEventListener(type, onInput, true));
            // 別のタブを見ている間は、音を止める（戻ったら、続きから鳴らす）
            document.addEventListener('visibilitychange', () => {
                if (!state.context) return;
                if (document.hidden) state.context.suspend();
                else state.context.resume();
                update();
            });
        }

        function unlock() {
            if (!state.context) {
                const AudioContextClass = window.AudioContext || window.webkitAudioContext;
                if (!AudioContextClass) return;
                if (ignoreSilentSwitch && navigator.audioSession) {
                    try {
                        navigator.audioSession.type = 'playback';
                    } catch {
                        // 対応していないブラウザでは、そのまま
                    }
                }
                const context = new AudioContextClass();
                state.context = context;
                state.master = createOutput(context, levels.master);
                state.bgmBus = context.createGain();
                state.bgmBus.gain.value = levels.bgm;
                state.bgmBus.connect(state.master);
                state.effectsBus = context.createGain();
                state.effectsBus.gain.value = levels.effects;
                state.effectsBus.connect(state.master);
                state.effectsReverb = createReverb(context, EFFECTS_REVERB);
                state.effectsReverb.output.connect(state.effectsBus);
            }
            if (state.context.state !== 'running' && !document.hidden) state.context.resume();
            update();
        }

        // BGM を、設定・選んだ曲・タブの状態に合わせる
        function update() {
            const context = state.context;
            const wanted = state.settings.bgm && state.bgmName && context;
            if (!wanted) {
                stopPlayback();
                return;
            }
            if (document.hidden) return;
            if (state.playback && state.playback.name === state.bgmName && !state.playback.stopped) return;
            startPlayback();
        }

        function startPlayback() {
            const song = allSongs[state.bgmName];
            if (!song) throw new Error(`曲がありません: ${state.bgmName}`);
            const previous = state.playback;
            if (previous) previous.stop(0.4);
            const name = state.bgmName;
            if (song.file) {
                state.playback = null;
                loadBuffer(song.file).then(buffer => {
                    if (state.bgmName !== name || !state.settings.bgm || (state.playback && !state.playback.stopped)) return;
                    state.playback = Object.assign(new FilePlayback(state.context, state.bgmBus, song, buffer, { fadeIn: previous ? 0.4 : 0 }), { name });
                }).catch(() => {});
                return;
            }
            state.playback = Object.assign(new SongPlayback(state.context, state.bgmBus, song, { fromStep: state.bgmFromStep, fadeIn: previous ? 0.15 : 0, overrides: state.overrides[name] ?? {} }), { name });
            state.playback.schedule(state.context.currentTime + LOOKAHEAD_SEC);
            if (!state.timer) {
                state.timer = setInterval(() => {
                    if (state.playback && state.context.state === 'running') state.playback.schedule(state.context.currentTime + LOOKAHEAD_SEC);
                }, SCHEDULE_MS);
            }
        }

        function stopPlayback(fade = 0.4) {
            if (state.playback) state.playback.stop(fade);
            state.playback = null;
            if (state.timer) {
                clearInterval(state.timer);
                state.timer = null;
            }
        }

        function loadBuffer(url) {
            if (state.buffers.has(url)) return Promise.resolve(state.buffers.get(url));
            if (!state.loading.has(url)) {
                state.loading.set(url, fetch(url)
                    .then(response => response.arrayBuffer())
                    .then(data => new Promise((resolve, reject) => state.context.decodeAudioData(data, resolve, reject)))
                    .then(buffer => {
                        state.buffers.set(url, buffer);
                        return buffer;
                    }));
            }
            return state.loading.get(url);
        }

        // 効果音を鳴らす（効果音が OFF のとき・まだ最初の操作がないときは鳴らさない）
        // delay：遅らせる秒数、volume：音量の倍率
        function play(name, { delay = 0, volume = 1 } = {}) {
            const context = state.context;
            if (!state.settings.effects || !context || context.state !== 'running') return;
            const definition = allEffects[name];
            if (!definition) throw new Error(`効果音がありません: ${name}`);
            const time = context.currentTime + 0.01 + delay;
            if (definition.file) {
                const buffer = state.buffers.get(definition.file);
                if (!buffer) {
                    loadBuffer(definition.file).catch(() => {});
                    return;
                }
                const source = context.createBufferSource();
                source.buffer = buffer;
                source.playbackRate.value = definition.rate ?? 1;
                const gain = context.createGain();
                gain.gain.value = (definition.volume ?? 1) * volume;
                source.connect(gain).connect(state.effectsBus);
                source.start(time);
                return;
            }
            playEffect(context, state.effectsBus, state.effectsReverb, definition, time, volume);
        }

        // 音声ファイルを前もって読み込む（最初の操作のあとに呼ぶ）
        function preload() {
            if (!state.context) return Promise.resolve();
            const files = [...Object.values(allSongs), ...Object.values(allEffects)].filter(item => item.file).map(item => item.file);
            return Promise.all(files.map(file => loadBuffer(file).catch(() => null)));
        }

        return {
            setup,
            unlock,
            play,
            preload,
            // BGM を流す。fromStep で途中から（試聴ページで区間を選ぶとき）
            // fromStep を渡したときは、同じ曲が流れていても、その位置から鳴らし直す（0 なら頭から）
            playBgm(name, { fromStep } = {}) {
                const restart = fromStep !== undefined || state.bgmName !== name;
                state.bgmName = name;
                state.bgmFromStep = fromStep ?? 0;
                if (restart && state.playback) {
                    state.playback.stop(0.25);
                    state.playback = null;
                }
                update();
            },
            stopBgm() {
                state.bgmName = null;
                update();
            },
            getSettings,
            setSettings,
            // 音量を変える（{ master, bgm, effects } のうち、変えたいものだけ）
            // 曲のパートを差し替える（{ lead: { instrument: 'flute', volume: 0.8 } }。{} で元に戻す）。流れていれば次の音から変わる
            setOverrides(name, overrides) {
                state.overrides[name] = overrides;
                if (state.playback && state.playback.name === name && !state.playback.stopped && state.playback.setOverrides) state.playback.setOverrides(overrides);
            },
            setVolume(next) {
                Object.assign(levels, next);
                if (!state.context) return;
                const now = state.context.currentTime;
                state.master.gain.setTargetAtTime(levels.master, now, 0.03);
                state.bgmBus.gain.setTargetAtTime(levels.bgm, now, 0.03);
                state.effectsBus.gain.setTargetAtTime(levels.effects, now, 0.03);
            },
            toggle(kind) {
                setSettings({ [kind]: !state.settings[kind] });
            },
            toggleAll() {
                const on = !(state.settings.effects || state.settings.bgm);
                setSettings({ effects: on, bgm: on });
            },
            onChange(listener) {
                state.listeners.add(listener);
                return () => state.listeners.delete(listener);
            },
            // 今流れている BGM の位置（{ section, label, bar, bars, step, length }）。流れていなければ null
            position() {
                return state.playback && !state.playback.stopped ? { name: state.playback.name, ...state.playback.position() } : null;
            },
            get context() {
                return state.context;
            },
            songs: allSongs,
            effects: allEffects
        };
    }

    // 文字列を count 回つなぐ（同じ小節を繰り返して書くとき）
    function repeat(text, count, separator = ' | ') {
        return Array.from({ length: count }, () => text).join(separator);
    }

    const SoundKit = {
        version: VERSION,
        register,
        library,
        createPlayer,
        compileSong,
        renderSong,
        renderEffect,
        effectLength,
        loudness,
        parseSequence,
        parseChord,
        noteToMidi,
        midiToFrequency,
        repeat,
        instruments: Object.keys(INSTRUMENTS),
        drumKits: Object.fromEntries(Object.entries(DRUM_KITS).map(([name, kit]) => [name, Object.keys(kit)]))
    };

    globalThis.SoundKit = SoundKit;
})();
