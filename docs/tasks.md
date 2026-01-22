# 実装タスク一覧

## 実装
- [x] アップロードUI（upload.html）
- [x] 画像アップロードAPI（/api/upload）
- [x] Claude解析API（/api/analyze）
- [x] Gemini 3.0 Flashに移行（/api/analyze）
- [x] 承認API（/api/approve）
- [x] 作品一覧API（/api/works）
- [x] 作品集のデータ取得をAPI経由に変更（index.html）
- [x] 仕様ドキュメントの作成（requirements / architecture / ui / api / knowhow）
- [x] @vercel/kv を Upstash Redis に置き換え
- [x] Next.jsへ移行（pages/api と public 配置）
- [x] Worksセクションの「作品追加」導線を削除し、長押し隠しリンクを追加
- [x] いいね・コメント機能のAPI実装
- [x] 作品管理APIと管理画面を追加
- [x] 作品集にいいね/コメント表示を追加
- [x] モバイル配色をライト寄りに調整（始まりの章以降）
- [x] 資格セクションのアイコンを削除
- [x] 管理ページ/アップロードページの相互リンクを追加

## インフラ/運用
- [ ] Vercel Blob/Upstash Redisの有効化
- [ ] 環境変数の設定（GEMINI_API_KEY, UPSTASH_REDIS_REST_URL など）
- [ ] works-data.json のRedis移行
- [ ] Redis初期投入スクリプトを実行

## テスト
- [ ] アップロード〜承認までのE2Eテスト
- [ ] 作品集反映の表示確認
