# sound-kit

ブラウザゲーム（mine-blocks・lucky-numbers・panel-de-pon など）の BGM と効果音の共通部品です。

- 音は Web Audio API でその場で合成します（音声ファイルも鳴らせます）
- 曲と効果音は、データ（`games/<ゲーム名>.js`）で書きます。作曲もこのリポジトリで行います
- 配り方は netplay-kit と同じ「コピーして同期」です（npm パッケージや git submodule にはしない）

試聴ページ：https://123yoshidandy.github.io/sound-kit/
曲・効果音・楽器をボタンで鳴らして聞き比べられます。曲は区間（イントロ・A・B …）を押すと、そこから鳴ります。曲ごとに主旋律の楽器を替えられます（音量は、元の楽器と同じ大きさに自動でそろえる）。

## フォルダ構成

- `src/sound-kit.js`：本体（普通の `<script>` で読むと `window.SoundKit` になる）
- `src/sound-kit.mjs`：ES モジュールから使うための入口
- `games/<ゲーム名>.js`：ゲームごとの曲と効果音（`SoundKit.register('<ゲーム名>', { songs, effects })`）
- `games/catalog.<曲名>.js`：ゲームに縛らない曲の一覧（`SoundKit.register('catalog', …)`。曲に `genre` を書くと、試聴ページでジャンル別に並ぶ）。ゲームで使うときは、そのゲームの `games/<ゲーム名>.js` に写す
- `games/<ゲーム名>.<曲名>.js`：曲の候補（同じ名前で `SoundKit.register` を呼ぶと、曲が足し合わされる）。試聴ページでは `index.html` に読み込みを足す。ゲームには配らないので、曲が決まったら `games/<ゲーム名>.js` に移す
- `games/<ゲーム名>-legacy.js`：今の音を同じ形に移したもの（試聴ページで聞き比べるため。ゲームには配らない）
- `index.html`・`audition/`：試聴ページ（GitHub Pages）。楽器の一覧と主旋律の候補は `audition/instruments.js`
- `docs/composing.md`：作曲の作法（音域・パートの役割・ループのつなぎ方・音量の目安・記法）
- `tools/measure.mjs`：曲と効果音を書き出して、音量と音割れを数値で確かめる（ヘッドレス Chrome）
- `tools/lint-songs.mjs`：和声の書き間違い（避けたい音・半音のぶつかり）と、パートの音域を調べる
- `scripts/sync.mjs`：各ゲームへの同期と確認
- `test/`：テスト（Vitest）

## 使い方

```html
<!-- 普通の <script> のゲーム（mine-blocks） -->
<script src="js/sound/sound-kit.js"></script>
<script src="js/sound/mine-blocks.js"></script>
```

```js
// ES Modules のゲーム（lucky-numbers・panel-de-pon）
import SoundKit from './sound/sound-kit.mjs';
import './sound/lucky-numbers.js';
```

```js
const sound = SoundKit.createPlayer({ library: 'mine-blocks', storageKey: 'mineBlocks.sound' });
sound.setup();                 // 最初のタップ・クリック・キー入力まで鳴らさない。別のタブを見ている間は止める
sound.playBgm('pixel');        // BGM を流す（BGM が OFF なら、ON にしたときに流れる）
sound.stopBgm();
sound.play('select');          // 効果音（{ delay: 秒, volume: 倍率 } も渡せる）
sound.toggle('bgm');           // 'effects'・'bgm' の ON/OFF（storageKey の localStorage に保存する）
sound.toggleAll();             // どちらかが鳴っていれば両方消し、両方消えていれば両方つける
sound.getSettings();           // { effects: true, bgm: true }
sound.onChange((settings) => updateButtons(settings));
sound.setVolume({ bgm: 0.8 }); // 音量（master・bgm・effects。既定は 0.8・1・1）
sound.setOverrides('pixel', { lead: { instrument: 'flute', volume: 0.5 } }); // パートの楽器を差し替える（{} で元に戻す）
```

`createPlayer` の `volume` で、最初の音量も決められます。音声ファイルの曲は `{ file: 'sounds/bgm.m4a', gain, loopStart, loopEnd }`、効果音は `{ file: 'sounds/pop.mp3', volume, rate }` と書きます（`sound.preload()` で前もって読み込めます）。

### 共通の作法

- **自動再生の制限**：ブラウザは、ユーザーが操作するまで音を出させません。`setup()` は最初のタップ・クリック・キー入力で音を使えるようにします。それまでの `play()` は鳴らずに捨てられます
- **別のタブ**：見ていない間は止め、戻ったら BGM を続きから鳴らします
- **ON/OFF の保存**：効果音と BGM の ON/OFF を `storageKey` の localStorage に保存します（初めは両方 ON）
- **iPhone の消音モード**：Web Audio の音は、iPhone の消音モード（横のスイッチ）では鳴りません。ゲームではこれに従います。試聴ページだけは、対応するブラウザでは消音モードでも鳴らします（`ignoreSilentSwitch: true`。iOS 17 以降の `navigator.audioSession`）

## 曲と効果音の書き方

`docs/composing.md` にまとめています。短い例：

```js
const song = {
    title: 'ひだまりパズル',
    bpm: 110,
    reverb: { seconds: 2.2, tone: 0.5 },
    parts: {
        lead: { instrument: 'marimba', reverb: 0.2 },
        bass: { instrument: 'pluck', mode: 'bass', octave: 2 },
        drums: { instrument: 'drums', kit: 'soft', mode: 'drums' }
    },
    sections: {
        A: {
            chords: 'F | C/E | Dm7 | Am7',
            lead: 'A4:2 C5 F5:3 E5:1 F5:2 A5 r G5 | E5:2 G5 C5:4 r:2 C5 D5 E5 | ...',
            bass: 'R:4 r:2 R:2 5:2 r:2 R+:2 5:2',
            drums: { kick: 'x.....x...x.....', shaker: 'oxoxoxoxoxoxoxox' }
        }
    },
    intro: [],
    loop: ['A']
};
```

楽器は次のとおりです。試聴ページの「楽器」で鳴らせます。

- 鍵盤：`piano`・`epiano`・`organ`
- たたく・はじく：`marimba`・`xylophone`・`vibes`・`bell`・`musicBox`（オルゴール）・`kalimba`・`steelpan`・`pluck`（`brightness` を上げるとハープ）・`guitar`（胴の響き付き。和音の刻みのパートに `strum: 0.012` などと書くと、かき鳴らすようにずらす）
- 伸ばす：`strings`（弦楽器のアンサンブル）・`brass`・`accordion`・`choir`（合唱）・`flute`（`breath: 0` で口笛）・`ocarina`・`clarinet`・`softLead`・`pad`
- そのほか：`synthBass`・`chip`（矩形波・三角波）・`drums`（組は `soft`・`brush`（ジャズ向き。こするスネアは `swish`）・`acoustic`（生ドラム風）・`chip`・`legacy`。`ride`・`crash` のシンバルと、高さの違うタム `tomHigh`・`tomMid`・`tomLow` は soft・brush・acoustic で使える）

## 同期

```bash
# 各ゲームにコピーする（ゲームの直下に sound-kit.lock.json を置く）
node scripts/sync.mjs ~/MyProjects/mine-blocks

# コピー先が手で直されていないか確かめる（直されていたら終了コード1）
node scripts/sync.mjs check ~/MyProjects/mine-blocks
```

- 本体（`sound-kit.js`・`sound-kit.mjs`）と、そのゲームの `games/<ゲーム名>.js` をコピーします。ゲーム名はリポジトリのフォルダ名（`--game` で変えられる）
- コピー先は、`public/js` があれば `public/js/sound/`、なければ `js/sound/`（`--dir` で変えられる。2回目からは lock の場所を使う）
- コピーしたファイルの先頭には、版とコミットを書いた1行が付きます。コピー先が手で直されていたら、同期は止まります（`--force` で上書きする）
- 直したいところがあれば、sound-kit で直してテストし、コミットしてから各ゲームに同期します

## 開発

必要なもの：Node.js 22 以上（計測には Google Chrome も）

```bash
npm install
npm test                    # テスト
npm run lint:songs          # 和声の書き間違いと、パートの音域
npm run measure             # 書き出して、音量・音割れを数値で確かめる（数分かかる）
npm run measure -- --only pixel --parts --out /tmp/spec   # 1曲だけ、パートごとの音量と、スペクトログラムの画像
```

試聴ページを手元で開くときは、リポジトリの直下で静的なサーバーを動かします（例：`python3 -m http.server <空いているポート>`）。
