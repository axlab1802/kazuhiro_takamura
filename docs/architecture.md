# アーキテクチャ設計

## 構成概要
- フロントエンド: Next.js配下の静的HTML（public/index.html / public/upload.html）
- バックエンド: Next.js API Routes（pages/api/*.js）
- ストレージ: Vercel Blob（画像）、Upstash Redis（作品データ）
- AI: Gemini 3.0 Flash（画像解析/コメント生成）

## データフロー
1. ユーザーが画像をアップロード
2. `/api/upload` がVercel Blobへ保存し、URLを返却
3. `/api/analyze` が画像URLを取得し、Geminiに送信してタイトル/コメント生成
4. 管理者が確認・編集して承認
5. `/api/approve` が作品データをUpstash Redisへ保存
6. 作品集は `/api/works` からRedisデータを取得して表示

## コンポーネント
- `public/index.html`: 作品集/LP表示
- `upload.html`: アップロード/AI生成/承認UI
- `public/admin.html`: 作品管理UI
- `pages/api/upload.js`: Multipart受信・Blob保存
- `pages/api/analyze.js`: 画像取得・Gemini解析
- `pages/api/approve.js`: Redis保存
- `pages/api/works.js`: Redis読み込み・静的JSONフォールバック
- `pages/api/like.js`: いいね更新
- `pages/api/comment.js`: コメント追加
- `pages/api/admin/works.js`: 作品管理API

## セキュリティ/運用
- 環境変数でAPIキーを管理
- 画像は公開URLとして保存
- KVは作品データの永続化に使用
- VercelダッシュボードでBlob/KV接続を行う
