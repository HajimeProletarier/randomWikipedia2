# Random Wikipedia v2

ランダムな Wikipedia 記事を表示する Web アプリケーション（v2 - モダンリプレイス版）

## 概要

既存の Java/Servlet ベースアプリケーションを、モダンな技術スタックでリプレイス。
データベースレス・サーバーレス構成で、完全無料運用を実現。

## 技術スタック

- **フロントエンド**: React + TypeScript + TailwindCSS
- **バックエンド**: Firebase Cloud Functions (Node.js + TypeScript)
- **ホスティング**: Firebase Hosting + Cloud Functions
- **状態管理**: Zustand
- **永続化**: localStorage

## 主な機能

- ランダム Wikipedia 記事の取得・表示
- 閲覧履歴管理（localStorage）
- ブックマーク機能（localStorage）
- 言語切り替え（日本語/英語）
- ダークモード対応
- データエクスポート/インポート
- レスポンシブデザイン
- アフィリエイト広告統合

## ドキュメント

詳細は [要件定義書](./REQUIREMENTS.md) を参照してください。

## 開発状況

Phase 0（プロジェクトセットアップ）を進行中

## ライセンス

MIT

## 旧バージョン

- [randomWikipedia (v1)](https://github.com/HajimeProletarier/randomWikipedia) - Java/Servlet 版
