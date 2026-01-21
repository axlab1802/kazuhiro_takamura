# TAKAMURA KAZUHIRO | Floral Designer

髙村 和弘 フラワーデザイナーのランディングページ

## 🌸 概要

回り道の先に、花が咲いた。  
15歳で社会に出て、バンド活動を経て、フラワーデザイナーとして新たな人生を歩む髙村和弘の物語を伝えるLPサイトです。

## 🚀 技術スタック

- **Vite** - 高速な開発環境とホットリロード
- **HTML/CSS** - モダンなレスポンシブデザイン
- **JavaScript** - インタラクティブなアニメーション
- **Vercel** - 自動デプロイ対応
- **Vercel Blob** - 画像ストレージ
- **Vercel KV** - データストレージ
- **Claude API** - AI画像解析

## 📦 セットアップ

```bash
# 依存関係のインストール
npm install

# 開発サーバー起動（ポート1105）
npm run dev

# ビルド
npm run build

# プレビュー
npm run preview
```

## 🎨 特徴

- レスポンシブデザイン（PC/タブレット/スマホ対応）
- スクロールアニメーション
- モダンなタイポグラフィ
- グラデーション背景とカラーアクセント
- ギャラリー機能

## 📂 ディレクトリ構造

```
kazuhiro_Takamura/
├── index.html          # メインHTMLファイル
├── upload.html         # 作品アップロードページ
├── api/                # Vercel Functions
│   ├── upload.js       # 画像アップロードAPI
│   ├── analyze.js      # Claude AI解析API
│   ├── approve.js      # 作品承認API
│   └── works.js        # 作品一覧API
├── public/             # 静的ファイル
│   └── assets/         # 画像アセット
├── vite.config.js      # Vite設定
├── vercel.json         # Vercel設定
├── package.json        # 依存関係
└── .gitignore          # Git除外設定
```

## 🔐 環境変数

Vercelダッシュボードで以下の環境変数を設定してください：

| 変数名 | 説明 |
|--------|------|
| `ANTHROPIC_API_KEY` | Claude API キー |
| `BLOB_READ_WRITE_TOKEN` | Vercel Blob トークン |
| `KV_REST_API_URL` | Vercel KV URL |
| `KV_REST_API_TOKEN` | Vercel KV トークン |

⚠️ **注意**: `.env`ファイルは絶対にGitHubにpushしないでください！

## 🌐 デプロイ

Vercelで自動デプロイ設定済み。  
mainブランチへのプッシュで自動的にデプロイされます。

## 👨‍💻 開発情報

- 開発サーバー: `http://localhost:1105`
- ホットリロード: 有効
- ビルド出力: `dist/`

## 📝 ライセンス

© 2026 TAKAMURA KAZUHIRO. All rights reserved.
