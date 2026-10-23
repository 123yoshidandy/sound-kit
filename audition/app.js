/**
 * 試聴ページ：曲・効果音・楽器をボタンで鳴らして聞き比べる
 */

(function () {
    const GAME = 'mine-blocks';
    const current = SoundKit.library(GAME);
    const legacy = SoundKit.library(`${GAME}-legacy`);

    // 効果音は、今の音（old:）と新しい音（new:）を並べる
    const effects = {};
    Object.entries(current.effects).forEach(([name, def]) => { effects[`new:${name}`] = def; });
    Object.entries(legacy.effects).forEach(([name, def]) => { effects[`old:${name}`] = def; });

    // 楽器の聞き比べ（audition/instruments.js）
    const instruments = SoundKit.library('audition-instruments');
    const INSTRUMENTS = instruments.list;
    INSTRUMENTS.forEach(item => { effects[`instrument:${item.id}`] = instruments.effects[item.id]; });

    const songs = { ...current.songs, legacy: legacy.songs.legacy };
    const player = SoundKit.createPlayer({ songs, effects, ignoreSilentSwitch: true });
    player.setup();

    // ===== 音量をそろえる =====
    // 書き出して測った大きさ（LUFS）で合わせる。書き出すだけなので、音は鳴らない

    const DEMO_LEVEL = -34;  // 楽器のフレーズの大きさ
    const CHIP_TRIM = -5;    // 矩形波は、同じ数値でも大きく聞こえるので、その分小さくする

    function perceivedTrim(preset) {
        return preset.instrument === 'chip' && preset.wave !== 'triangle' ? CHIP_TRIM : 0;
    }

    const dbToGain = (db) => 10 ** (db / 20);
    const demoGains = new Map();

    async function demoGain(item) {
        if (!demoGains.has(item.id)) {
            const buffer = await SoundKit.renderEffect(instruments.effects[item.id]);
            demoGains.set(item.id, dbToGain(DEMO_LEVEL + perceivedTrim(item.preset) - SoundKit.loudness(buffer)));
        }
        return demoGains.get(item.id);
    }

    // 主旋律のパートを、別の楽器に差し替えたときの音量（元の楽器と同じ大きさに聞こえるように）
    const leadLevels = new Map();

    async function partLoudness(id, partName, override) {
        const key = `${id}:${partName}:${JSON.stringify(override ?? null)}`;
        if (!leadLevels.has(key)) {
            const song = songs[id];
            const compiled = SoundKit.compileSong(song);
            // そのパートが鳴る最初の区間だけを書き出す
            const first = compiled.events.find(event => event.part === partName);
            const section = compiled.sections.find(s => first.start >= s.start && first.start < s.start + s.length);
            const buffer = await SoundKit.renderSong(song, {
                fromStep: section.start, seconds: section.length * compiled.stepSeconds,
                parts: [partName], overrides: override ? { [partName]: override } : {}
            });
            leadLevels.set(key, SoundKit.loudness(buffer));
        }
        return leadLevels.get(key);
    }

    async function leadOverrides(id, preset) {
        const song = songs[id];
        const overrides = {};
        for (const partName of song.melody) {
            const original = song.parts[partName];
            const volume = original.volume ?? 1;
            const before = await partLoudness(id, partName, null);
            const after = await partLoudness(id, partName, { ...preset, volume });
            const trim = perceivedTrim(preset) - perceivedTrim(original);
            overrides[partName] = { ...preset, volume: volume * dbToGain(before - after + trim) };
        }
        return overrides;
    }

    // ===== タブ =====

    document.querySelectorAll('.tab').forEach(tab => {
        tab.addEventListener('click', () => {
            document.querySelectorAll('.tab').forEach(t => t.classList.toggle('is-active', t === tab));
            document.querySelectorAll('.panel').forEach(p => p.classList.toggle('is-active', p.id === tab.dataset.tab));
        });
    });

    // ===== BGM =====

    const PLAY_ICON = '<svg viewBox="0 0 24 24"><path d="M7 4.5v15l13-7.5z"/></svg>';
    const STOP_ICON = '<svg viewBox="0 0 24 24"><rect x="6" y="6" width="12" height="12" rx="2"/></svg>';
    const formatTime = (seconds) => `${Math.floor(seconds / 60)}:${String(Math.floor(seconds % 60)).padStart(2, '0')}`;
    const cards = new Map();

    const bgmPanel = document.querySelector('#bgm');
    Object.entries(songs).forEach(([id, song]) => {
        const compiled = SoundKit.compileSong(song);
        const card = document.createElement('article');
        card.className = 'song' + (id === 'legacy' ? ' is-reference' : '');
        const loopSeconds = compiled.loopLength * compiled.stepSeconds;
        card.innerHTML = `
            <div class="song-head">
                <button class="play" aria-label="再生">${PLAY_ICON}</button>
                <div class="song-title">
                    <h2></h2>
                    <p></p>
                </div>
            </div>
            <div class="sections"></div>
            <div class="now"><span class="where"></span><span class="time"></span></div>
            <label class="lead">主旋律<select></select></label>`;
        card.querySelector('h2').textContent = song.title;
        card.querySelector('.song-title p').textContent = song.description;
        const info = `テンポ ${song.bpm}・ループ ${formatTime(loopSeconds)}`;

        const strip = card.querySelector('.sections');
        const segments = compiled.sections.map(section => {
            const button = document.createElement('button');
            button.className = 'segment' + (section.intro ? ' is-intro' : '');
            button.style.flex = `${section.length} 1 0`;
            button.innerHTML = '<span class="fill"></span><span class="label"></span>';
            button.querySelector('.label').textContent = section.label;
            button.addEventListener('click', () => player.playBgm(id, { fromStep: section.start }));
            strip.appendChild(button);
            return { section, button };
        });

        card.querySelector('.play').addEventListener('click', () => {
            if (player.position()?.name === id) player.stopBgm();
            else player.playBgm(id);
        });
        setupLeadSelect(card.querySelector('.lead'), id, song);
        bgmPanel.appendChild(card);
        cards.set(id, { card, segments, compiled, info });
    });

    // 主旋律の楽器を選ぶ（流れていれば、止めずに次の音から変わる）
    function setupLeadSelect(label, id, song) {
        if (!song.melody) {
            label.remove();
            return;
        }
        const select = label.querySelector('select');
        const original = song.parts[song.melody[0]];
        const originalName = INSTRUMENTS.find(item => sameInstrument(item.preset, original))?.name ?? original.instrument;
        select.innerHTML = `<option value="">元の楽器（${originalName}）</option>`;
        INSTRUMENTS.filter(item => item.lead).forEach(item => {
            const option = document.createElement('option');
            option.value = item.id;
            option.textContent = item.name;
            select.appendChild(option);
        });
        let request = 0;
        select.addEventListener('change', async () => {
            const mine = ++request;
            const item = INSTRUMENTS.find(i => i.id === select.value);
            if (!item) {
                player.setOverrides(id, {});
                return;
            }
            select.disabled = true;
            try {
                const overrides = await leadOverrides(id, item.preset);
                if (mine === request) player.setOverrides(id, overrides);
            } finally {
                select.disabled = false;
            }
        });
    }

    function sameInstrument(preset, part) {
        if (preset.instrument !== part.instrument) return false;
        if (part.instrument !== 'chip') return true;
        return (preset.wave ?? 'square') === (part.wave ?? 'square') && (preset.duty ?? 0.25) === (part.duty ?? 0.25);
    }

    // 再生中の位置を、区間の帯と文字で見せる
    function render() {
        const position = player.position();
        cards.forEach(({ card, segments, compiled, info }, id) => {
            const playing = position?.name === id;
            card.classList.toggle('is-playing', playing);
            card.querySelector('.play').innerHTML = playing ? STOP_ICON : PLAY_ICON;
            card.querySelector('.play').setAttribute('aria-label', playing ? '停止' : '再生');
            segments.forEach(({ section, button }) => {
                const inside = playing && position.step >= section.start && position.step < section.start + section.length;
                button.classList.toggle('is-current', inside);
                const ratio = !playing ? 0 : inside ? (position.step - section.start) / section.length : position.step >= section.start + section.length ? 1 : 0;
                button.querySelector('.fill').style.width = `${ratio * 100}%`;
            });
            card.querySelector('.where').textContent = playing ? `${position.label}　${position.bar} / ${position.bars} 小節` : info;
            card.querySelector('.time').textContent = playing
                ? `${formatTime(position.step * compiled.stepSeconds)} / ${formatTime(compiled.length * compiled.stepSeconds)}`
                : '';
        });
        requestAnimationFrame(render);
    }
    requestAnimationFrame(render);

    // ===== 効果音 =====

    const EFFECT_ROWS = [
        ['選ぶ', ['select']],
        ['置く', ['place']],
        ['置けない', ['invalid']],
        ['外す', ['remove']],
        ['クリア', ['clear']],
        ['+20秒', ['bonus']],
        ['降参', ['surrender']],
        ['負け', ['lose']],
        ['残り10秒の時計', ['tick', 'tick', 'tick']],
        ['時間切れ', ['timeUp']],
        ['カウントダウンと開始', ['count', 'count', 'count', 'go']],
        ['優勝', ['victory']]
    ];

    const list = document.querySelector('#effect-list');
    EFFECT_ROWS.forEach(([label, sequence]) => {
        const row = document.createElement('div');
        row.className = 'effect-row';
        row.innerHTML = '<span class="name"></span><button class="fx old">今</button><button class="fx new">新</button>';
        row.querySelector('.name').textContent = label;
        const playSequence = (prefix) => sequence.forEach((name, i) => player.play(`${prefix}:${name}`, { delay: i * 0.8 }));
        row.querySelector('.old').addEventListener('click', () => playSequence('old'));
        row.querySelector('.new').addEventListener('click', () => playSequence('new'));
        list.appendChild(row);
    });

    // ===== 楽器 =====

    const grid = document.createElement('div');
    grid.className = 'instrument-grid';
    INSTRUMENTS.forEach(item => {
        const button = document.createElement('button');
        button.className = 'instrument';
        button.innerHTML = '<strong></strong><span></span>';
        button.querySelector('strong').textContent = item.name;
        button.querySelector('span').textContent = item.note;
        button.addEventListener('click', async () => player.play(`instrument:${item.id}`, { volume: await demoGain(item) }));
        grid.appendChild(button);
    });
    document.querySelector('#instruments').appendChild(grid);

    // ===== 音量 =====

    const bgmVolume = document.querySelector('#bgm-volume');
    const effectsVolume = document.querySelector('#effects-volume');
    bgmVolume.addEventListener('input', () => player.setVolume({ bgm: Number(bgmVolume.value) }));
    effectsVolume.addEventListener('input', () => player.setVolume({ effects: Number(effectsVolume.value) }));

    // 確認用（ヘッドレスのブラウザから触る）
    window.audition = { player, songs, effects, demoGain, leadOverrides };
})();
