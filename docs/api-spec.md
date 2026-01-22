# API仕様

## 共通
- Base URL: `/api`
- レスポンス: JSON
- エラー時: `status >= 400` かつ `{ error: string }`

## POST /api/upload
画像をVercel Blobにアップロードする。

### リクエスト
- Content-Type: `multipart/form-data`
- フィールド
  - `image`: JPG/PNG画像ファイル

### レスポンス（200）
```json
{
  "url": "https://...",
  "filename": "works/1700000000000.jpg"
}
```

### 主なエラー
- 400: 画像未指定/形式不正/サイズ超過
- 500: アップロード失敗

## POST /api/analyze
画像をGeminiに送信してタイトル/コメントを生成する。

### リクエスト
```json
{
  "imageUrl": "https://...",
  "title": "任意",
  "recipient": "任意",
  "situation": "任意",
  "notes": "任意",
  "regenerate": true
}
```

### レスポンス（200）
```json
{
  "title": "タイトル",
  "description": "コメント本文"
}
```

### 主なエラー
- 400: imageUrl未指定
- 500: 解析失敗

## POST /api/approve
承認済み作品をRedisへ保存する。

### リクエスト
```json
{
  "imageUrl": "https://...",
  "title": "タイトル",
  "description": "コメント本文"
}
```

### レスポンス（200）
```json
{
  "success": true,
  "work": {
    "id": 16,
    "title": "...",
    "image": "https://...",
    "description": "...",
    "createdAt": "2026-01-21T00:00:00.000Z"
  }
}
```

### 主なエラー
- 400: 必須項目不足
- 500: 保存失敗

## GET /api/works
作品一覧を取得する（Redisが空の場合は`/works-data.json`にフォールバック）。

### レスポンス（200）
```json
{
  "collection": {
    "title": "高村和弘 作品集",
    "subtitle": "〜いくつもの夜を越えて〜",
    "closing": {
      "quote": "「俺ってまだでしょ？」",
      "message": "..."
    }
  },
  "works": [
    {
      "id": 1,
      "title": "...",
      "image": "/assets/works/1.JPG",
      "description": "..."
    }
  ]
}
```
