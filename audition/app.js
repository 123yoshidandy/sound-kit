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

    // ゲームに縛らない曲の一覧（games/catalog.<曲名>.js）。曲の id は catalog/<曲名> にする
    const catalogSongs = (() => {
        try {
            return SoundKit.library('catalog').songs;
        } catch {
            return {};
        }
    })();
    const songs = { ...current.songs, legacy: legacy.songs.legacy };
    Object.entries(catalogSongs).forEach(([id, song]) => { songs[`catalog/${id}`] = song; });

    // BGM のタブの見出し。全曲をジャンル別に並べる（この順に並べ、ここにないジャンルは最後。今の BGM はそのジャンルの最後）
    const GENRES = ['チップチューン', 'ゲーム音楽', 'クラシック', 'ジャズ・ブルース', 'ファンク・ソウル', 'ロック・ポップ', 'ラテン', 'ワールド', 'アンビエント', 'エレクトロ'];
    const genreOf = (song) => song.genre ?? 'そのほか';
    const songIds = [...Object.keys(songs).filter(id => id !== 'legacy'), 'legacy'];
    const SONG_GROUPS = [...new Set(songIds.map(id => genreOf(songs[id])))]
        .sort((a, b) => (GENRES.indexOf(a) + 1 || 99) - (GENRES.indexOf(b) + 1 || 99))
        .map(genre => ({ title: genre, ids: songIds.filter(id => genreOf(songs[id]) === genre) }));
    const player = SoundKit.createPlayer({ songs, effects, ignoreSilentSwitch: true });
    player.setup();

    // ===== 音量をそろえる =====
    // 書き出して測った大きさ（LUFS）で合わせる。書き出すだけなので、音は鳴らない

    const DEMO_LEVEL = -34;  // 楽器のフレーズの大きさ。楽器ごとの聞こえ方の補正（trim）は audition/instruments.js

    // 曲のパートの楽器に当たる、一覧の楽器の補正
    function trimOfPart(part) {
        return INSTRUMENTS.find(item => sameInstrument(item.preset, part))?.trim ?? 0;
    }

    const dbToGain = (db) => 10 ** (db / 20);
    const demoGains = new Map();

    async function demoGain(item) {
        if (!demoGains.has(item.id)) {
            const buffer = await SoundKit.renderEffect(instruments.effects[item.id]);
            demoGains.set(item.id, dbToGain(DEMO_LEVEL + item.trim - SoundKit.loudness(buffer)));
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

    async function leadOverrides(id, item) {
        const { preset } = item;
        const song = songs[id];
        const overrides = {};
        for (const partName of song.melody) {
            const original = song.parts[partName];
            const volume = original.volume ?? 1;
            const before = await partLoudness(id, partName, null);
            const after = await partLoudness(id, partName, { ...preset, volume });
            const trim = item.trim - trimOfPart(original);
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

    // ===== タグ =====
    // 雰囲気は曲のデータの tags。テンポ・拍子・主旋律の楽器は、曲のデータから自動で決める

    const MOODS = ['明るい', '軽快', '楽しい', '落ち着いた', '静か', 'やさしい', 'のどか', 'おしゃれ', '優雅', '渋い', '冒険', '緊張感', '神秘的', '和風', '中華風', '中東風', '南国', 'ケルト'];
    const FACETS = [
        { name: '雰囲気', of: (song) => song.tags ?? [], order: MOODS },
        { name: 'テンポ', of: (song) => [song.bpm < 90 ? 'ゆっくり' : song.bpm >= 126 ? '速い' : 'ふつう'], order: ['ゆっくり', 'ふつう', '速い'] },
        { name: '拍子', of: (song) => [song.meter === '6/8' ? '8分の6拍子' : (song.stepsPerBar ?? 16) === 12 ? '3拍子' : '4拍子'], order: ['4拍子', '3拍子', '8分の6拍子'] },
        { name: '主旋律', of: (song) => song.melody ? [instrumentName(song.parts[song.melody[0]])] : [], order: [] }
    ];

    // 絞り込みでは、チップの矩形波の幅の違いはまとめて「チップ」にする
    function instrumentName(part) {
        if (part.instrument === 'chip' && part.wave !== 'triangle') return 'チップ';
        return INSTRUMENTS.find(item => sameInstrument(item.preset, part))?.name ?? part.instrument;
    }

    // 選んだタグ（種類ごと）。同じ種類の中は「どれか」、違う種類どうしは「すべて」に当てはまる曲を出す
    const selected = new Map(FACETS.map(facet => [facet.name, new Set()]));

    function matches(song) {
        return FACETS.every(facet => {
            const chosen = selected.get(facet.name);
            return chosen.size === 0 || facet.of(song).some(tag => chosen.has(tag));
        });
    }

    function toggleTag(facetName, tag) {
        const chosen = selected.get(facetName);
        if (chosen.has(tag)) chosen.delete(tag);
        else chosen.add(tag);
        applyFilter();
    }

    const bgmPanel = document.querySelector('#bgm');
    const filters = createFilters();
    bgmPanel.appendChild(filters.element);

    const groupElements = SONG_GROUPS.map(({ title, ids }) => {
        const heading = document.createElement('h2');
        heading.className = 'group';
        heading.textContent = title;
        // ジャンルの中の曲は、画面の幅に合わせて横にも並べる
        const grid = document.createElement('div');
        grid.className = 'song-grid';
        bgmPanel.append(heading, grid);
        ids.forEach(id => createCard(id, songs[id], grid));
        return { heading, grid, ids };
    });
    applyFilter();

    // 絞り込みの欄。スマホでは閉じておき、押すと開く
    function createFilters() {
        const element = document.createElement('section');
        element.className = 'filters';
        element.innerHTML = `
            <div class="filters-head">
                <button class="filters-toggle" aria-expanded="false">絞り込み<span class="chevron"></span></button>
                <span class="count"></span>
                <button class="clear">解除</button>
            </div>
            <div class="facets"></div>`;
        const facetBox = element.querySelector('.facets');
        const chips = [];
        FACETS.forEach(facet => {
            const counts = new Map();
            Object.values(songs).forEach(song => facet.of(song).forEach(tag => counts.set(tag, (counts.get(tag) ?? 0) + 1)));
            const tags = [...counts.keys()].sort((a, b) => {
                const ia = facet.order.indexOf(a), ib = facet.order.indexOf(b);
                if (ia !== -1 || ib !== -1) return (ia === -1 ? 99 : ia) - (ib === -1 ? 99 : ib);
                return counts.get(b) - counts.get(a);
            });
            const row = document.createElement('div');
            row.className = 'facet';
            row.innerHTML = '<span class="facet-name"></span><div class="chips"></div>';
            row.querySelector('.facet-name').textContent = facet.name;
            tags.forEach(tag => {
                const chip = document.createElement('button');
                chip.className = 'chip';
                chip.textContent = tag;
                chip.addEventListener('click', () => toggleTag(facet.name, tag));
                row.querySelector('.chips').appendChild(chip);
                chips.push({ chip, facet: facet.name, tag });
            });
            facetBox.appendChild(row);
        });
        const toggle = element.querySelector('.filters-toggle');
        const setOpen = (open) => {
            element.classList.toggle('is-open', open);
            toggle.setAttribute('aria-expanded', String(open));
        };
        setOpen(window.matchMedia('(min-width: 700px)').matches);
        toggle.addEventListener('click', () => setOpen(!element.classList.contains('is-open')));
        element.querySelector('.clear').addEventListener('click', () => {
            selected.forEach(set => set.clear());
            applyFilter();
        });
        return { element, chips };
    }

    function applyFilter() {
        let shown = 0;
        groupElements.forEach(({ heading, grid, ids }) => {
            let visible = 0;
            ids.forEach(id => {
                const ok = matches(songs[id]);
                cards.get(id).card.hidden = !ok;
                if (ok) visible++;
            });
            heading.hidden = grid.hidden = visible === 0;
            shown += visible;
        });
        const active = [...selected.values()].some(set => set.size > 0);
        filters.element.querySelector('.count').textContent = active ? `${Object.keys(songs).length}曲中 ${shown}曲` : `${Object.keys(songs).length}曲`;
        filters.element.querySelector('.clear').hidden = !active;
        filters.element.classList.toggle('is-active', active);
        const isOn = (facet, tag) => selected.get(facet).has(tag);
        filters.chips.forEach(({ chip, facet, tag }) => chip.classList.toggle('is-on', isOn(facet, tag)));
        document.querySelectorAll('.song .tag').forEach(chip => chip.classList.toggle('is-on', isOn(chip.dataset.facet, chip.textContent)));
    }

    function createCard(id, song, container) {
        const compiled = SoundKit.compileSong(song);
        const card = document.createElement('article');
        card.className = 'song' + (id === 'legacy' ? ' is-reference' : '');
        const loopSeconds = compiled.loopLength * compiled.stepSeconds;
        card.innerHTML = `
            <div class="song-head">
                <button class="play" aria-label="再生">${PLAY_ICON}</button>
                <div class="song-title">
                    <h2></h2>
                    <div class="tags"></div>
                </div>
            </div>
            <div class="sections"></div>
            <div class="now"><span class="where"></span><span class="time"></span></div>
            <label class="lead">主旋律<select></select></label>`;
        card.querySelector('h2').textContent = song.title;
        // カードのタグ（雰囲気と、4拍子でない拍子）。押すと、そのタグで絞り込む
        const cardTags = [...(song.tags ?? []).map(tag => ['雰囲気', tag]), ...FACETS[2].of(song).filter(tag => tag !== '4拍子').map(tag => ['拍子', tag])];
        cardTags.forEach(([facet, tag]) => {
            const chip = document.createElement('button');
            chip.className = 'tag';
            chip.dataset.facet = facet;
            chip.textContent = tag;
            chip.addEventListener('click', () => toggleTag(facet, tag));
            card.querySelector('.tags').appendChild(chip);
        });
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
        container.appendChild(card);
        cards.set(id, { card, segments, compiled, info });
    }

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
                const overrides = await leadOverrides(id, item);
                if (mine === request) player.setOverrides(id, overrides);
            } finally {
                select.disabled = false;
            }
        });
    }

    function sameInstrument(preset, part) {
        if (preset.instrument !== part.instrument) return false;
        if (part.instrument !== 'chip') return true;
        // 'square' は幅 50% の矩形波と同じ音
        const shape = (p) => (p.wave ?? 'square') === 'square' ? 'pulse:0.5' : p.wave === 'pulse' ? `pulse:${p.duty ?? 0.25}` : p.wave;
        return shape(preset) === shape(part);
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

    // 種別ごとに見出しを付けて並べる
    const instrumentPanel = document.querySelector('#instruments');
    const grids = new Map(instruments.groups.map(group => {
        const heading = document.createElement('h2');
        heading.className = 'group';
        heading.textContent = group;
        const grid = document.createElement('div');
        grid.className = 'instrument-grid';
        instrumentPanel.append(heading, grid);
        return [group, grid];
    }));
    INSTRUMENTS.forEach(item => {
        const button = document.createElement('button');
        button.className = 'instrument';
        button.innerHTML = '<strong></strong><span></span>';
        button.querySelector('strong').textContent = item.name;
        button.querySelector('span').textContent = item.note;
        button.addEventListener('click', async () => player.play(`instrument:${item.id}`, { volume: await demoGain(item) }));
        grids.get(item.group).appendChild(button);
    });

    // ===== 音量 =====

    const bgmVolume = document.querySelector('#bgm-volume');
    const effectsVolume = document.querySelector('#effects-volume');
    bgmVolume.addEventListener('input', () => player.setVolume({ bgm: Number(bgmVolume.value) }));
    effectsVolume.addEventListener('input', () => player.setVolume({ effects: Number(effectsVolume.value) }));

    // 確認用（ヘッドレスのブラウザから触る）
    window.audition = { player, songs, effects, demoGain, leadOverrides };
})();
