# TAKAMURA KAZUHIRO | Floral Designer

髙村 和弘 フラワーデザイナーのランディングページ

## 🌸 概要

回り道の先に、花が咲いた。  
15歳で社会に出て、バンド活動を経て、フラワーデザイナーとして新たな人生を歩む髙村和弘の物語を伝えるLPサイトです。

## 🚀 技術スタック

- **Next.js** - フロントとAPIを統合したフレームワーク
- **HTML/CSS** - モダンなレスポンシブデザイン
- **JavaScript** - インタラクティブなアニメーション
- **Vercel** - 自動デプロイ対応
- **Vercel Blob** - 画像ストレージ
- **Upstash Redis** - データストレージ
- **Gemini API** - AI画像解析

## 📦 セットアップ

```bash
# 依存関係のインストール
npm install

# 開発サーバー起動（ポート1105）
npm run dev

# ビルド
npm run build

# 本番起動
npm run start
```

## 🎨 特徴

- レスポンシブデザイン（PC/タブレット/スマホ対応）
- スクロールアニメーション
- モダンなタイポグラフィ
- グラデーション背景とカラーアクセント
- ギャラリー機能
- 作品アップロード & AIコメント生成
- いいね & コメント機能
- 作品管理画面（編集/並び替え/非表示）

## 📂 ディレクトリ構造

```
kazuhiro_Takamura/
├── pages/              # Next.js Pages
│   ├── index.js        # ルート（/index.htmlへリダイレクト）
│   ├── upload.js       # /upload.htmlへリダイレクト
│   └── api/            # API Routes
│       ├── upload.js   # 画像アップロードAPI
│       ├── analyze.js  # Gemini AI解析API
│       ├── approve.js  # 作品承認API
│       └── works.js    # 作品一覧API
├── public/             # 静的ファイル
│   ├── index.html      # メインHTML（静的配信）
│   ├── upload.html     # 作品アップロードページ
│   ├── admin.html      # 作品管理ページ
│   └── assets/         # 画像アセット
├── docs/               # 仕様ドキュメント
├── next.config.js      # Next.js設定
├── vercel.json         # Vercel設定
├── package.json        # 依存関係
└── .gitignore          # Git除外設定
```

## 🔐 環境変数

Vercelダッシュボードで以下の環境変数を設定してください：

| 変数名 | 説明 |
|--------|------|
| `GEMINI_API_KEY` | Gemini API キー |
| `BLOB_READ_WRITE_TOKEN` | Vercel Blob トークン |
| `UPSTASH_REDIS_REST_URL` | Upstash Redis URL（推奨） |
| `UPSTASH_REDIS_REST_TOKEN` | Upstash Redis トークン（推奨） |
| `KV_REST_API_URL` | Vercel Marketplaceが自動追加するURL（互換） |
| `KV_REST_API_TOKEN` | Vercel Marketplaceが自動追加するトークン（互換） |

⚠️ **注意**: `.env`ファイルは絶対にGitHubにpushしないでください！

## 🌐 デプロイ

Vercelで自動デプロイ設定済み。  
mainブランチへのプッシュで自動的にデプロイされます。

## 📘 ドキュメント

- `docs/requirements.md` - 機能要件定義
- `docs/architecture.md` - アーキテクチャ設計
- `docs/ui-spec.md` - UIデザイン仕様
- `docs/api-spec.md` - API仕様
- `docs/tasks.md` - 実装タスク一覧
- `docs/knowhow.md` - つまづきポイントと解決方法

## 👨‍💻 開発情報

- 開発サーバー: `http://localhost:1105`
- ホットリロード: 有効
- ビルド出力: `.next/`

## 📝 ライセンス

© 2026 TAKAMURA KAZUHIRO. All rights reserved.
