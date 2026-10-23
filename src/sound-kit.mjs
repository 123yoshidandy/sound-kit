/**
 * ES モジュールから SoundKit を使うための入口（中身は sound-kit.js）
 *   import SoundKit from './sound/sound-kit.mjs';
 *   import './sound/lucky-numbers.js';   // 曲と効果音のデータ（SoundKit.register を呼ぶ）
 */

import './sound-kit.js';

export const SoundKit = globalThis.SoundKit;
export default SoundKit;
