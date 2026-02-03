# Scrapbox Quick Link PWA（Android共有対応）

Androidのネイティブな「共有」メニューからScrapboxに送信できるPWA（Progressive Web App）です。

## 特徴

- Androidの「共有」メニューに統合
- アプリのようにホーム画面から起動可能
- オフラインでも動作（Service Worker使用）
- インストール不要（Webアプリとして動作）

## セットアップ方法

### 1. Webサーバーにデプロイ

このPWAはHTTPSで配信する必要があります。以下のいずれかの方法でデプロイしてください：

#### GitHub Pagesを使用する場合

1. GitHubリポジトリを作成
2. `pwa`フォルダ内のファイルをリポジトリにプッシュ
3. Settings → Pages → Source を "main branch" に設定
4. `https://username.github.io/repository-name/` でアクセス可能

#### Netlifyを使用する場合

1. [Netlify](https://www.netlify.com/)にサインアップ
2. `pwa`フォルダをドラッグ&ドロップでデプロイ
3. 自動的にHTTPSで配信される

#### その他のホスティングサービス

- Vercel
- Firebase Hosting
- Cloudflare Pages

### 2. Android端末でインストール

1. Chrome（Android）でデプロイしたURLにアクセス
2. メニュー (⋮) → 「ホーム画面に追加」または「アプリをインストール」
3. 確認画面で「追加」または「インストール」をタップ

### 3. 使い方

1. 任意のWebページやアプリで「共有」ボタンをタップ
2. 共有先に「Scrapbox Quick Link」が表示されるのでタップ
3. 自動的にScrapboxの新しいページが開きます

## ファイル構成

- `index.html` - メインのHTMLファイル
- `manifest.json` - PWAマニフェスト（共有ターゲット機能を含む）
- `service-worker.js` - Service Worker（オフライン対応）
- `icon-192.png`, `icon-512.png` - PWAアイコン

## カスタマイズ

### プロジェクト名の変更

`index.html` の以下の部分を編集：

```javascript
const scrapboxUrl = `https://scrapbox.io/piyoryyta/${encodedTitle}?body=`;
```

`piyoryyta` を任意のプロジェクト名に変更してください。

### アイコンの変更

`icon-192.png` と `icon-512.png` を独自のアイコン画像に置き換えてください。

## 技術仕様

- **Web Share Target API**: Androidの共有メニューに統合
- **Service Worker**: オフライン対応とキャッシュ管理
- **manifest.json**: PWAの設定とアイコン定義

## 動作要件

- **ブラウザ**: Chrome 71+ (Android)
- **プロトコル**: HTTPS必須（localhostは除く）
- **Android**: 7.0以上推奨

## トラブルシューティング

### 共有メニューに表示されない

1. PWAがホーム画面に追加されているか確認
2. HTTPSで配信されているか確認
3. manifest.jsonのshare_targetが正しく設定されているか確認
4. 一度アンインストールして再インストール

### ホーム画面に追加できない

1. ブラウザがChromeであることを確認
2. HTTPSで配信されているか確認
3. manifest.jsonとservice-worker.jsが正しく読み込まれているか確認

## 注意事項

- PWAは一度ホーム画面に追加する必要があります
- HTTPで配信するとPWA機能が動作しません（localhostを除く）
- 初回アクセス時はService Workerの登録に少し時間がかかります
