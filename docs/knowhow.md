# 実装中つまづいた点と解決方法

## 1. Vercel FunctionsでMultipartを扱う
- 問題: デフォルトのbodyParserだとファイルが読めない
- 解決: `config.api.bodyParser = false` を指定し、手動でmultipartをパース
- 参照: `api/upload.js`

## 2. Claude応答のJSONパース
- 問題: 返答がコードブロックで返る場合がある
- 解決: ```json``` の囲みを除去してからJSON.parseする
- 参照: `api/analyze.js`

## 3. Redisが空のときの作品表示
- 問題: 初回はRedisにデータがなく作品集が空になる
- 解決: `/api/works` で `works-data.json` にフォールバック
- 参照: `api/works.js`

## 4. 管理画面からの画像差し替え
- 問題: 画像URL差し替えだけだと手元画像を使いづらい
- 解決: `admin.html` でファイルを `/api/upload` に投げ、返却URLで更新
