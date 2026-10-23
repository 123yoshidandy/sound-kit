#!/usr/bin/env node
/**
 * sound-kit のファイルを、各ゲームのリポジトリにコピーする（コピーして同期）
 *
 *   node scripts/sync.mjs <ゲームのリポジトリ> [--game mine-blocks] [--dir js/sound] [--force]
 *     本体（sound-kit.js・sound-kit.mjs）と、そのゲームの曲と効果音（games/<ゲーム名>.js）を決まったフォルダにコピーし、
 *     sound-kit.lock.json（版・コミット・各ファイルの sha256）を置く。ゲーム名を省くと、リポジトリのフォルダ名を使う
 *     コピー先が手で直されていたら、上書きせずに止める（--force で上書きする）
 *
 *   node scripts/sync.mjs check <ゲームのリポジトリ>
 *     コピー先が手で直されていないかを確かめる（直されていたら終了コード1）。sound-kit より古ければ知らせる
 */

import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';
import { execFileSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';

const KIT_ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const LOCK_FILE = 'sound-kit.lock.json';
const CORE_FILES = ['sound-kit.js', 'sound-kit.mjs'];

// ===== 入口 =====

export function main(argv, { kitRoot = KIT_ROOT } = {}) {
    const args = parseArgs(argv);
    if (!args.repo) {
        console.error('使い方: node scripts/sync.mjs [check] <ゲームのリポジトリ> [--game 名前] [--dir 場所] [--force]');
        return 2;
    }
    const repo = path.resolve(args.repo);
    if (!fs.existsSync(repo)) {
        console.error(`リポジトリが見つかりません: ${repo}`);
        return 2;
    }
    return args.command === 'check' ? check(repo, kitRoot) : sync(repo, args, kitRoot);
}

function parseArgs(argv) {
    const args = { command: 'sync', repo: null, game: null, dir: null, force: false };
    const rest = [...argv];
    if (rest[0] === 'check' || rest[0] === 'sync') args.command = rest.shift();
    while (rest.length > 0) {
        const arg = rest.shift();
        if (arg === '--force') args.force = true;
        else if (arg === '--game') args.game = rest.shift();
        else if (arg === '--dir') args.dir = rest.shift();
        else args.repo = arg;
    }
    return args;
}

// ===== 同期 =====

function sync(repo, args, kitRoot) {
    const lock = readLock(repo);
    const game = args.game ?? lock?.game ?? path.basename(repo);
    const dir = args.dir ?? lock?.dir ?? detectDir(repo);
    if (!dir) {
        console.error('コピー先のフォルダが見つかりません。--dir で指定してください（例: js/sound）');
        return 2;
    }
    const gameFile = path.join(kitRoot, 'games', `${game}.js`);
    if (!fs.existsSync(gameFile)) {
        console.error(`曲と効果音のデータがありません: games/${game}.js（--game で名前を指定できます）`);
        return 2;
    }

    // 手で直されたファイルがあれば止める（同期で消えてしまうため）
    if (!args.force) {
        const problems = lock ? findModified(repo, lock) : findUnmanaged(repo, dir);
        if (problems.length > 0) {
            console.error('コピー先が手で直されています。sound-kit 側に直しを移してから同期してください（上書きしてよければ --force）:');
            problems.forEach(problem => console.error(`  ${problem}`));
            return 1;
        }
    }

    const { version, commit } = kitVersion(kitRoot);
    const header = `// sound-kit ${version}（${commit}）からコピーしたファイル。ここでは直さず、sound-kit で直してから同期する\n`;
    const files = {};
    fs.mkdirSync(path.join(repo, dir), { recursive: true });
    const copy = (source, name) => {
        const content = header + fs.readFileSync(source, 'utf8');
        const target = path.posix.join(dir, name);
        fs.writeFileSync(path.join(repo, target), content);
        files[target] = hash(content);
    };
    CORE_FILES.forEach(name => copy(path.join(kitRoot, 'src', name), name));
    copy(gameFile, `${game}.js`);

    // 前の版にあって、今の版にないファイルは消す
    Object.keys(lock?.files ?? {}).filter(file => !(file in files)).forEach(file => {
        fs.rmSync(path.join(repo, file), { force: true });
        console.log(`消しました: ${file}`);
    });

    const nextLock = { version, commit, game, dir, files };
    fs.writeFileSync(path.join(repo, LOCK_FILE), JSON.stringify(nextLock, null, 2) + '\n');
    console.log(`sound-kit ${version}（${commit}）を ${repo} の ${dir}/ に同期しました（曲と効果音: ${game}）`);
    return 0;
}

// lucky-numbers は public/js、mine-blocks・panel-de-pon は js
function detectDir(repo) {
    if (fs.existsSync(path.join(repo, 'public/js'))) return 'public/js/sound';
    if (fs.existsSync(path.join(repo, 'js'))) return 'js/sound';
    return null;
}

// ===== 確認 =====

function check(repo, kitRoot) {
    const lock = readLock(repo);
    if (!lock) {
        console.error(`${LOCK_FILE} がありません。先に node scripts/sync.mjs ${repo} で同期してください`);
        return 1;
    }
    const problems = [...findModified(repo, lock), ...findExtra(repo, lock)];
    if (problems.length > 0) {
        console.error('コピー先が手で直されています:');
        problems.forEach(problem => console.error(`  ${problem}`));
        return 1;
    }
    const { version, commit } = kitVersion(kitRoot);
    console.log(`手で直されたファイルはありません（sound-kit ${lock.version}（${lock.commit})）`);
    if (lock.commit !== commit || lock.version !== version) {
        console.log(`sound-kit の今の版は ${version}（${commit}）です。node scripts/sync.mjs ${repo} で更新できます`);
    }
    return 0;
}

function findModified(repo, lock) {
    return Object.entries(lock.files).flatMap(([file, expected]) => {
        const full = path.join(repo, file);
        if (!fs.existsSync(full)) return [`見つかりません: ${file}`];
        return hash(fs.readFileSync(full, 'utf8')) === expected ? [] : [`直されています: ${file}`];
    });
}

// 同期したフォルダに、同期していないファイルが置かれていないか
function findExtra(repo, lock) {
    const full = path.join(repo, lock.dir);
    if (!fs.existsSync(full)) return [];
    return fs.readdirSync(full)
        .map(name => path.posix.join(lock.dir, name))
        .filter(file => !(file in lock.files))
        .map(file => `同期していないファイル: ${file}`);
}

// 初めて同期する前に、コピー先のフォルダにファイルがあれば止める
function findUnmanaged(repo, dir) {
    const full = path.join(repo, dir);
    if (!fs.existsSync(full)) return [];
    return fs.readdirSync(full).map(name => `同期していないファイル: ${path.posix.join(dir, name)}`);
}

// ===== 補助 =====

function readLock(repo) {
    const file = path.join(repo, LOCK_FILE);
    return fs.existsSync(file) ? JSON.parse(fs.readFileSync(file, 'utf8')) : null;
}

function hash(content) {
    return crypto.createHash('sha256').update(content).digest('hex');
}

// package.json の版と、git のコミット（配るファイルにコミットしていない変更があれば -dirty を付ける）
function kitVersion(kitRoot) {
    const { version } = JSON.parse(fs.readFileSync(path.join(kitRoot, 'package.json'), 'utf8'));
    let commit = 'unknown';
    try {
        commit = execFileSync('git', ['rev-parse', '--short', 'HEAD'], { cwd: kitRoot, encoding: 'utf8', stdio: ['ignore', 'pipe', 'ignore'] }).trim();
        const dirty = execFileSync('git', ['status', '--porcelain', '--', 'src', 'games'], { cwd: kitRoot, encoding: 'utf8' }).trim();
        if (dirty) commit += '-dirty';
    } catch {
        // git がなくても同期はできる
    }
    return { version, commit };
}

if (process.argv[1] && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
    process.exitCode = main(process.argv.slice(2));
}
