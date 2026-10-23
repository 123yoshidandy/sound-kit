/**
 * ヘッドレス Chrome を DevTools Protocol で操作する（Node 22 標準の WebSocket を使い、依存なし）
 * ポートは Chrome に空いている番号を選ばせるので、ほかの作業とぶつからない
 *
 *   const chrome = await launchChrome();
 *   const page = await chrome.openPage('about:blank');
 *   await page.eval('1 + 1');
 *   await chrome.close();
 */

import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { spawn } from 'node:child_process';

const CHROME_PATHS = [
    process.env.CHROME_PATH,
    '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome',
    '/usr/bin/google-chrome',
    '/usr/bin/chromium'
].filter(Boolean);

export async function launchChrome({ headless = true, chromePath = CHROME_PATHS.find(p => fs.existsSync(p)) } = {}) {
    if (!chromePath) throw new Error('Chrome が見つかりません。CHROME_PATH で場所を指定してください');
    const profile = fs.mkdtempSync(path.join(os.tmpdir(), 'sound-kit-chrome-'));
    const child = spawn(chromePath, [
        '--remote-debugging-port=0',
        `--user-data-dir=${profile}`,
        '--no-first-run',
        '--no-default-browser-check',
        '--autoplay-policy=no-user-gesture-required',
        // ヘッドレスでも音は PC のスピーカーから出るので、必ず消す（計測は書き出した音を数値で調べる）
        '--mute-audio',
        ...(headless ? ['--headless=new'] : [])
    ], { stdio: 'ignore' });

    // 選ばれたポートは、プロファイルの DevToolsActivePort に書かれる
    const portFile = path.join(profile, 'DevToolsActivePort');
    const start = Date.now();
    while (!fs.existsSync(portFile) || fs.readFileSync(portFile, 'utf8').split('\n').length < 2) {
        if (Date.now() - start > 15000) {
            child.kill();
            throw new Error('Chrome が起動しませんでした');
        }
        await new Promise(resolve => setTimeout(resolve, 100));
    }
    const [port, wsPath] = fs.readFileSync(portFile, 'utf8').trim().split('\n');
    const ws = new WebSocket(`ws://127.0.0.1:${port}${wsPath}`);
    await new Promise((resolve, reject) => {
        ws.addEventListener('open', resolve);
        ws.addEventListener('error', () => reject(new Error('Chrome につなげませんでした')));
    });

    let nextId = 0;
    const pending = new Map();
    const consoleListeners = new Map();
    ws.addEventListener('message', (event) => {
        const message = JSON.parse(event.data);
        if (message.id && pending.has(message.id)) {
            const { resolve, reject } = pending.get(message.id);
            pending.delete(message.id);
            if (message.error) reject(new Error(JSON.stringify(message.error)));
            else resolve(message.result);
        } else if (message.method === 'Runtime.consoleAPICalled') {
            const text = message.params.args.map(arg => arg.value ?? arg.description).join(' ');
            consoleListeners.get(message.sessionId)?.(`${message.params.type}: ${text}`);
        } else if (message.method === 'Runtime.exceptionThrown') {
            consoleListeners.get(message.sessionId)?.(`exception: ${message.params.exceptionDetails.exception?.description ?? message.params.exceptionDetails.text}`);
        }
    });
    const cdp = (method, params = {}, sessionId) => new Promise((resolve, reject) => {
        const id = ++nextId;
        pending.set(id, { resolve, reject });
        ws.send(JSON.stringify({ id, method, params, sessionId }));
    });

    async function openPage(url, { width = 390, height = 664, mobile = true, onConsole = null } = {}) {
        const { targetId } = await cdp('Target.createTarget', { url: 'about:blank' });
        const { sessionId } = await cdp('Target.attachToTarget', { targetId, flatten: true });
        await cdp('Page.enable', {}, sessionId);
        await cdp('Runtime.enable', {}, sessionId);
        await cdp('Network.enable', {}, sessionId);
        await cdp('Network.setCacheDisabled', { cacheDisabled: true }, sessionId);
        if (onConsole) consoleListeners.set(sessionId, onConsole);
        await cdp('Emulation.setDeviceMetricsOverride', { width, height, deviceScaleFactor: 2, mobile }, sessionId);

        const page = {
            cdp: (method, params) => cdp(method, params, sessionId),
            async eval(expression) {
                const result = await cdp('Runtime.evaluate', { expression, returnByValue: true, awaitPromise: true }, sessionId);
                if (result.exceptionDetails) throw new Error(result.exceptionDetails.exception?.description ?? JSON.stringify(result.exceptionDetails));
                return result.result.value;
            },
            async goto(nextUrl) {
                await cdp('Page.navigate', { url: nextUrl }, sessionId);
                await page.waitFor('document.readyState === "complete"', 30000); // 外部のフォントの読み込みを待つ
            },
            async waitFor(expression, timeout = 10000) {
                const begin = Date.now();
                while (Date.now() - begin < timeout) {
                    try {
                        if (await page.eval(expression)) return;
                    } catch {
                        // ページの切り替え中は評価できないことがある
                    }
                    await new Promise(resolve => setTimeout(resolve, 100));
                }
                throw new Error(`待ちきれませんでした: ${expression}`);
            },
            async shot(file) {
                const { data } = await cdp('Page.captureScreenshot', { format: 'png' }, sessionId);
                fs.writeFileSync(file, Buffer.from(data, 'base64'));
            },
            close: () => cdp('Target.closeTarget', { targetId })
        };
        if (url !== 'about:blank') await page.goto(url);
        return page;
    }

    return {
        openPage,
        async close() {
            ws.close();
            const exited = new Promise(resolve => child.once('exit', resolve));
            child.kill();
            await Promise.race([exited, new Promise(resolve => setTimeout(resolve, 3000))]);
            try {
                fs.rmSync(profile, { recursive: true, force: true });
            } catch {
                // Chrome が書き込み中なら残す（一時フォルダなので、あとで消える）
            }
        }
    };
}
