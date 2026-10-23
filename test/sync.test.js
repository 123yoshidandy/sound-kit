import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { main } from '../scripts/sync.mjs';

let repo;

beforeEach(() => {
    repo = fs.mkdtempSync(path.join(os.tmpdir(), 'sound-kit-sync-'));
    fs.mkdirSync(path.join(repo, 'js'));
    vi.spyOn(console, 'log').mockImplementation(() => {});
    vi.spyOn(console, 'error').mockImplementation(() => {});
});

afterEach(() => {
    fs.rmSync(repo, { recursive: true, force: true });
    vi.restoreAllMocks();
});

describe('同期', () => {
    it('本体とゲームの曲を js/sound にコピーし、lock を置く', () => {
        expect(main([repo, '--game', 'mine-blocks'])).toBe(0);
        const files = fs.readdirSync(path.join(repo, 'js/sound')).sort();
        expect(files).toEqual(['mine-blocks.js', 'sound-kit.js', 'sound-kit.mjs']);
        const lock = JSON.parse(fs.readFileSync(path.join(repo, 'sound-kit.lock.json'), 'utf8'));
        expect(lock.game).toBe('mine-blocks');
        expect(lock.dir).toBe('js/sound');
        expect(Object.keys(lock.files)).toHaveLength(3);
        expect(fs.readFileSync(path.join(repo, 'js/sound/sound-kit.js'), 'utf8')).toMatch(/^\/\/ sound-kit .*からコピーしたファイル/);
    });

    it('public/js があれば、public/js/sound にコピーする', () => {
        fs.mkdirSync(path.join(repo, 'public/js'), { recursive: true });
        expect(main([repo, '--game', 'mine-blocks'])).toBe(0);
        expect(fs.existsSync(path.join(repo, 'public/js/sound/sound-kit.mjs'))).toBe(true);
    });

    it('ゲームのデータがなければ止める', () => {
        expect(main([repo, '--game', 'no-such-game'])).toBe(2);
    });

    it('手で直されていれば、check は 1 を返し、同期も止まる（--force で上書きする）', () => {
        main([repo, '--game', 'mine-blocks']);
        expect(main(['check', repo])).toBe(0);
        fs.appendFileSync(path.join(repo, 'js/sound/sound-kit.js'), '\n// 手で直した\n');
        expect(main(['check', repo])).toBe(1);
        expect(main([repo])).toBe(1);
        expect(main([repo, '--force'])).toBe(0);
        expect(main(['check', repo])).toBe(0);
    });

    it('同期したフォルダに、同期していないファイルがあれば知らせる', () => {
        main([repo, '--game', 'mine-blocks']);
        fs.writeFileSync(path.join(repo, 'js/sound/extra.js'), '');
        expect(main(['check', repo])).toBe(1);
    });
});
