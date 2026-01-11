# Random Wikipedia v2 - 要件定義書

## プロジェクト概要

### プロジェクト名
**Random Wikipedia v2**

### 目的
既存の Java Servlet/JSP ベースのランダム Wikipedia アプリケーションを、モダンな技術スタックでリプレイスする。
認証機能とデータベースを削除し、よりシンプルで軽量な SPA (Single Page Application) として再構築する。

### 背景
- 現行システム（v1）は Java + Tomcat + PostgreSQL の 3層アーキテクチャ
- ユーザー認証・DB管理が過剰な機能であることが判明
- よりモダンで保守性の高い技術スタックへの移行を目指す
- 完全無料で運用可能な構成を実現

---

## 目標

### ビジネス目標
1. ユーザー体験の向上（高速化、スリープなし）
2. 運用コストの削減（完全無料運用）
3. 開発・保守の効率化（モダンな技術スタック）
4. 収益化の実現（アフィリエイト広告の導入）

### 技術目標
1. サーバーレスアーキテクチャへの移行
2. データベースレス設計（localStorage/Cookie による永続化）
3. TypeScript による型安全性の確保
4. CI/CD パイプラインの整備

---

## 機能要件

### 1. コア機能（必須）

#### 1.1 ランダム Wikipedia 記事取得
- **説明**: ランダムな Wikipedia 記事を取得して表示する
- **実装方法**: Wikipedia REST API の `/page/random/summary` エンドポイントを使用
- **表示内容**:
  - 記事タイトル
  - 記事 URL
  - 記事の抜粋（summary/extract）
  - サムネイル画像（可能な場合）
- **操作**: 「次の記事」ボタンで新しいランダム記事を取得

#### 1.2 言語切り替え
- **対応言語**:
  - 日本語（ja.wikipedia.org）- デフォルト
  - 英語（en.wikipedia.org）
  - その他主要言語（オプション）
- **保存方法**: localStorage に言語設定を保存
- **UI**: ヘッダーに言語選択ドロップダウンまたはトグル

#### 1.3 閲覧履歴
- **保存先**: localStorage
- **最大件数**: 100件（設定可能）
- **保存内容**:
  ```typescript
  interface HistoryItem {
    title: string;
    url: string;
    lang: string;
    timestamp: number;
    thumbnail?: string;
  }
  ```
- **機能**:
  - 履歴一覧表示
  - 履歴から記事を再表示
  - 個別削除
  - 全削除
  - 古い履歴から自動削除（最大件数超過時）

#### 1.4 ブックマーク
- **保存先**: localStorage
- **最大件数**: 100件（設定可能）
- **保存内容**:
  ```typescript
  interface Bookmark {
    id: string; // UUID
    title: string;
    url: string;
    lang: string;
    addedAt: number;
    memo?: string; // オプション: ユーザーメモ
    thumbnail?: string;
  }
  ```
- **機能**:
  - ブックマーク追加/削除
  - ブックマーク一覧表示
  - メモの追加・編集（オプション）

### 2. 追加機能（推奨）

#### 2.1 検索・フィルタリング
- 履歴・ブックマーク内のテキスト検索
- フロントエンドで実装（配列フィルタリング）

#### 2.2 データエクスポート/インポート
- **エクスポート**: JSON 形式でダウンロード
  ```json
  {
    "version": "2.0",
    "exportedAt": 1234567890,
    "history": [...],
    "bookmarks": [...],
    "settings": {...}
  }
  ```
- **インポート**: JSON ファイルをアップロードして復元
- **用途**: 端末間のデータ移行、バックアップ

#### 2.3 ユーザー設定
- **保存先**: localStorage
- **設定項目**:
  - 言語設定
  - ダークモード/ライトモード
  - 履歴の最大保存件数
  - 自動再生機能の有効/無効

#### 2.4 ダークモード
- システム設定に追従（prefers-color-scheme）
- 手動切り替え可能
- 設定を localStorage に保存

### 3. オプション機能（将来的に検討）

#### 3.1 タグ機能
- ブックマークにタグを付けて分類
- タグによるフィルタリング

#### 3.2 統計表示
- 総閲覧記事数
- 言語別閲覧数
- よく見るカテゴリ（フロントエンドで集計）

#### 3.3 連続再生モード
- 自動的に次の記事へ遷移（タイマー設定）
- BGM的な使い方

---

## 収益化機能

### アフィリエイト広告

#### Google AdSense
- **広告タイプ**: ディスプレイ広告、インフィード広告
- **配置位置**:
  - ヘッダー下: 728x90 (PC) / 320x50 (モバイル)
  - 記事と履歴の間: 336x280
  - サイドバー: 300x250 (PC のみ)
- **実装**: React コンポーネント化（`<AdBanner />`）
- **レスポンシブ対応**: 自動サイズ調整
- **注意事項**: AdSense 審査が必要（コンテンツ公開後に申請）

#### Amazon アソシエイト（オプション）
- **実装方法**: 記事タイトルに基づいた関連書籍リンクを生成
- **UI**: 「関連書籍を探す」ボタン
- **リンク例**: `https://www.amazon.co.jp/s?k={記事タイトル}&tag={アソシエイトID}`

---

## 非機能要件

### パフォーマンス
- 初回表示: < 2秒
- API レスポンス: < 1秒
- 画面遷移: < 500ms
- バンドルサイズ: < 500KB (gzip 圧縮後)

### 可用性
- 稼働率: 99.9% 以上（Firebase の SLA に準拠）
- スリープ: なし（Cloud Functions は常時起動可能）

### スケーラビリティ
- 同時接続: Firebase の自動スケーリングに依存
- 無料枠想定: 月間 200万リクエストまで

### セキュリティ
- XSS 対策: React の自動エスケープに依存
- CORS: Firebase Hosting + Functions 統合により不要
- HTTPS: Firebase Hosting により自動提供
- 個人情報: 一切収集しない（localStorage のみ使用）

### アクセシビリティ
- **目標**: WCAG 2.1 AA レベル準拠
- **対応**:
  - キーボード操作対応
  - スクリーンリーダー対応（aria-label 等）
  - 適切なコントラスト比
  - フォーカスインジケーター

### レスポンシブデザイン
- **対応デバイス**:
  - モバイル: 320px 〜 768px
  - タブレット: 768px 〜 1024px
  - デスクトップ: 1024px 〜
- **ブレークポイント**: TailwindCSS のデフォルト設定に準拠

### ブラウザ対応
- **モダンブラウザ**: Chrome, Firefox, Safari, Edge（最新版・1つ前のバージョン）
- **非対応**: IE11 以下

---

## 技術スタック

### フロントエンド

#### コア技術
- **フレームワーク**: React 18+
- **言語**: TypeScript 5+
- **ビルドツール**: Vite 5+

#### UI/スタイリング
- **CSS フレームワーク**: TailwindCSS 3+
- **コンポーネントライブラリ**: なし（フルスクラッチ、または shadcn/ui）
- **アイコン**: Lucide React / Heroicons

#### 状態管理
- **グローバル状態**: Zustand
- **サーバー状態**: なし（シンプルな fetch で十分）
- **フォーム**: React Hook Form（必要に応じて）

#### ルーティング
- **ライブラリ**: React Router v6（必要に応じて）
- **構成**: SPA なので基本的に単一ページ

#### データ永続化
- **主要**: localStorage
  - 履歴、ブックマーク、設定
- **ライブラリ**: 素の localStorage API または localforage

#### HTTP クライアント
- **ライブラリ**: Fetch API（ブラウザ標準）
- **型安全性**: TypeScript の型定義で担保

### バックエンド

#### ランタイム・フレームワーク
- **ランタイム**: Node.js 20 LTS
- **言語**: TypeScript 5+
- **フレームワーク**: Firebase Cloud Functions (2nd gen)
- **HTTP**: Express（オプション、ルーティング用）

#### API 設計
- **アーキテクチャ**: RESTful API
- **エンドポイント**:
  ```
  GET /api/random?lang={ja|en}
  - レスポンス: Wikipedia のランダム記事情報
  ```

#### 外部 API
- **Wikipedia REST API**:
  - エンドポイント: `https://{lang}.wikipedia.org/api/rest_v1/page/random/summary`
  - ドキュメント: https://www.mediawiki.org/wiki/API:REST_API

### インフラ・ホスティング

#### サービス
- **プロバイダー**: Firebase (Google)
- **サービス構成**:
  - Firebase Hosting: フロントエンド（React SPA）
  - Firebase Cloud Functions: バックエンド API

#### デプロイ
- **方法**: Firebase CLI
- **コマンド**: `firebase deploy`
- **CI/CD**: GitHub Actions（オプション）

#### ドメイン
- **デフォルト**: `{project-id}.web.app` / `{project-id}.firebaseapp.com`
- **カスタムドメイン**: 設定可能（オプション）

#### 無料枠
- **Firebase Hosting**:
  - ストレージ: 10GB
  - 転送量: 360MB/日
- **Cloud Functions**:
  - 呼び出し: 200万回/月
  - GB-秒: 400,000 GB-秒/月
  - GB-秒/ネットワーク: 200,000 GB-秒/月

---

## アーキテクチャ

### システム構成図

```
┌─────────────────────────────────────────────────────────┐
│                    Firebase Project                      │
│                                                           │
│  ┌──────────────────────┐      ┌────────────────────┐  │
│  │  Firebase Hosting    │      │  Cloud Functions   │  │
│  │                      │      │                    │  │
│  │  - React SPA         │─────▶│  - API Server      │  │
│  │  - Static Assets     │      │  - Wikipedia API   │  │
│  │  - /api/* rewrite    │      │    Client          │  │
│  └──────────────────────┘      └────────────────────┘  │
│            │                             │               │
└────────────┼─────────────────────────────┼───────────────┘
             │                             │
             │                             ▼
             │                  ┌─────────────────────┐
             │                  │  Wikipedia REST API │
             │                  │  ja.wikipedia.org   │
             │                  │  en.wikipedia.org   │
             │                  └─────────────────────┘
             ▼
      ┌─────────────┐
      │   Browser   │
      │             │
      │ localStorage│
      │  - History  │
      │  - Bookmark │
      │  - Settings │
      └─────────────┘
```

### データフロー

#### 記事取得フロー
```
1. User clicks "次の記事" button
   ↓
2. React → Fetch: GET /api/random?lang=ja
   ↓
3. Firebase Hosting → Cloud Functions (internal rewrite)
   ↓
4. Cloud Functions → Wikipedia API
   ↓
5. Wikipedia API → Cloud Functions (記事データ)
   ↓
6. Cloud Functions → React (JSON レスポンス)
   ↓
7. React → 画面更新 + localStorage に履歴保存
```

#### ブックマーク追加フロー
```
1. User clicks "ブックマーク" button
   ↓
2. React Component → Zustand Store
   ↓
3. Zustand Store → localStorage (同期書き込み)
   ↓
4. State update → React re-render
```

### Firebase 統合設定

#### firebase.json
```json
{
  "hosting": {
    "public": "frontend/dist",
    "ignore": ["firebase.json", "**/.*", "**/node_modules/**"],
    "rewrites": [
      {
        "source": "/api/**",
        "function": "api"
      }
    ],
    "headers": [
      {
        "source": "**/*.@(js|css)",
        "headers": [
          {
            "key": "Cache-Control",
            "value": "max-age=31536000"
          }
        ]
      }
    ]
  },
  "functions": {
    "source": "functions",
    "runtime": "nodejs20"
  }
}
```

---

## プロジェクト構成

```
randomWikipedia2/
├── .github/
│   └── workflows/
│       └── deploy.yml              # GitHub Actions CI/CD (オプション)
│
├── frontend/                        # React SPA
│   ├── public/
│   │   └── favicon.ico
│   ├── src/
│   │   ├── components/
│   │   │   ├── Layout.tsx          # レイアウトコンポーネント
│   │   │   ├── Header.tsx          # ヘッダー（言語切替、設定）
│   │   │   ├── Article.tsx         # 記事表示
│   │   │   ├── History.tsx         # 履歴一覧
│   │   │   ├── Bookmarks.tsx       # ブックマーク一覧
│   │   │   ├── AdBanner.tsx        # 広告表示
│   │   │   └── ThemeToggle.tsx     # ダークモード切替
│   │   ├── hooks/
│   │   │   ├── useLocalStorage.ts  # localStorage カスタムフック
│   │   │   └── useWikipedia.ts     # Wikipedia API 呼び出し
│   │   ├── stores/
│   │   │   ├── historyStore.ts     # 履歴管理
│   │   │   ├── bookmarkStore.ts    # ブックマーク管理
│   │   │   └── settingsStore.ts    # 設定管理
│   │   ├── services/
│   │   │   └── api.ts              # API クライアント
│   │   ├── types/
│   │   │   └── index.ts            # TypeScript 型定義
│   │   ├── utils/
│   │   │   ├── storage.ts          # localStorage ヘルパー
│   │   │   └── export.ts           # データエクスポート/インポート
│   │   ├── App.tsx                 # ルートコンポーネント
│   │   ├── main.tsx                # エントリーポイント
│   │   └── index.css               # グローバルスタイル
│   ├── index.html
│   ├── package.json
│   ├── tsconfig.json
│   ├── vite.config.ts
│   ├── tailwind.config.js
│   └── postcss.config.js
│
├── functions/                       # Cloud Functions
│   ├── src/
│   │   ├── index.ts                # エントリーポイント
│   │   ├── handlers/
│   │   │   └── random.ts           # /api/random ハンドラー
│   │   ├── services/
│   │   │   └── wikipedia.ts        # Wikipedia API クライアント
│   │   └── types/
│   │       └── index.ts            # 型定義
│   ├── package.json
│   ├── tsconfig.json
│   └── .eslintrc.js
│
├── .firebaserc                      # Firebase プロジェクト設定
├── firebase.json                    # Firebase 全体設定
├── .gitignore
├── README.md                        # プロジェクト README
└── REQUIREMENTS.md                  # 本ドキュメント
```

---

## データ構造

### localStorage スキーマ

#### 履歴データ
```typescript
// Key: "random-wiki-history"
interface History {
  version: string; // "2.0"
  items: HistoryItem[];
}

interface HistoryItem {
  id: string; // UUID
  title: string;
  url: string;
  lang: string; // "ja" | "en"
  timestamp: number; // Unix timestamp (ms)
  extract?: string; // 記事の抜粋
  thumbnail?: string; // サムネイル URL
}
```

#### ブックマークデータ
```typescript
// Key: "random-wiki-bookmarks"
interface Bookmarks {
  version: string; // "2.0"
  items: Bookmark[];
}

interface Bookmark {
  id: string; // UUID
  title: string;
  url: string;
  lang: string;
  addedAt: number; // Unix timestamp (ms)
  memo?: string; // ユーザーメモ
  thumbnail?: string;
}
```

#### 設定データ
```typescript
// Key: "random-wiki-settings"
interface Settings {
  version: string; // "2.0"
  lang: string; // "ja" | "en"
  theme: "light" | "dark" | "system";
  historyMaxItems: number; // デフォルト: 100
  autoPlay: boolean; // 連続再生モード
}
```

### API レスポンス

#### GET /api/random
```typescript
// Request
GET /api/random?lang=ja

// Response (200 OK)
{
  "title": "東京都",
  "url": "https://ja.wikipedia.org/wiki/東京都",
  "extract": "東京都（とうきょうと）は、日本の首都...",
  "thumbnail": {
    "source": "https://upload.wikimedia.org/.../300px-Tokyo_Tower.jpg",
    "width": 300,
    "height": 200
  },
  "lang": "ja"
}

// Error Response (500)
{
  "error": "Failed to fetch article",
  "message": "Wikipedia API returned an error"
}
```

---

## 開発フェーズ

### Phase 0: プロジェクトセットアップ
- [ ] 要件定義書作成
- [ ] リポジトリ初期化
- [ ] Firebase プロジェクト作成
- [ ] フロントエンド環境構築（Vite + React + TypeScript）
- [ ] バックエンド環境構築（Cloud Functions）
- [ ] TailwindCSS セットアップ
- [ ] Zustand セットアップ
- [ ] 型定義ファイル作成

### Phase 1: コア機能実装
- [ ] Wikipedia API クライアント実装（Cloud Functions）
- [ ] /api/random エンドポイント実装
- [ ] 基本 UI レイアウト（Header, Footer）
- [ ] 記事表示コンポーネント
- [ ] 「次の記事」ボタン機能
- [ ] 言語切り替え機能
- [ ] ローカルデプロイ・動作確認

### Phase 2: 履歴・ブックマーク機能
- [ ] localStorage ヘルパー実装
- [ ] Zustand ストア実装（history, bookmarks, settings）
- [ ] 履歴保存・表示機能
- [ ] ブックマーク追加・削除機能
- [ ] 履歴/ブックマーク一覧 UI
- [ ] 個別削除・全削除機能

### Phase 3: 追加機能
- [ ] ダークモード実装
- [ ] 検索・フィルタリング機能
- [ ] データエクスポート/インポート機能
- [ ] レスポンシブデザイン調整
- [ ] アクセシビリティ対応

### Phase 4: 広告実装
- [ ] AdBanner コンポーネント作成
- [ ] Google AdSense スクリプト統合
- [ ] 広告配置の最適化
- [ ] 広告表示の動作確認
- [ ] AdSense 審査申請

### Phase 5: テスト・デプロイ
- [ ] 単体テスト（必要に応じて）
- [ ] E2E テスト（Playwright/Cypress）
- [ ] パフォーマンステスト
- [ ] 本番デプロイ（Firebase）
- [ ] カスタムドメイン設定（オプション）

### Phase 6: 運用・改善
- [ ] Google Analytics 導入
- [ ] エラー監視（Sentry 等）
- [ ] ユーザーフィードバック収集
- [ ] 継続的な改善

---

## リスク管理

### 技術リスク

| リスク | 影響度 | 対策 |
|--------|--------|------|
| Wikipedia API の仕様変更 | 中 | API バージョン固定、エラーハンドリング強化 |
| Firebase 無料枠超過 | 低 | 使用量監視、アラート設定 |
| localStorage 容量不足 | 低 | 最大件数制限、古いデータ自動削除 |
| AdSense 審査不承認 | 中 | コンテンツ充実、再審査 |

### 運用リスク

| リスク | 影響度 | 対策 |
|--------|--------|------|
| Firebase サービス障害 | 中 | SLA 確認、別プロバイダーへの移行検討 |
| 突然のトラフィック増加 | 低 | Firebase の自動スケーリングに依存 |
| 不適切な広告表示 | 中 | AdSense の広告ブロック設定活用 |

---

## 成功指標（KPI）

### 技術指標
- [ ] ページ読み込み速度: < 2秒
- [ ] Lighthouse スコア: 90+ (Performance, Accessibility, Best Practices, SEO)
- [ ] バンドルサイズ: < 500KB (gzip)
- [ ] エラー率: < 1%

### ビジネス指標
- [ ] 月間アクティブユーザー（MAU）: 100+ (初月)
- [ ] 平均セッション時間: 3分+
- [ ] 記事閲覧数/セッション: 5+
- [ ] 広告収益: $10+/月（AdSense 承認後）

---

## 参考資料

### 技術ドキュメント
- [React 公式ドキュメント](https://react.dev/)
- [TypeScript ハンドブック](https://www.typescriptlang.org/docs/)
- [Firebase ドキュメント](https://firebase.google.com/docs)
- [Wikipedia REST API](https://www.mediawiki.org/wiki/API:REST_API)
- [TailwindCSS ドキュメント](https://tailwindcss.com/docs)
- [Zustand ドキュメント](https://docs.pmnd.rs/zustand)

### 広告関連
- [Google AdSense ヘルプ](https://support.google.com/adsense)
- [Amazon アソシエイト ガイドライン](https://affiliate.amazon.co.jp/)

---

## 変更履歴

| 日付 | バージョン | 変更内容 | 担当者 |
|------|------------|----------|--------|
| 2026-01-11 | 1.0 | 初版作成 | - |

---

## 承認

| 役割 | 氏名 | 承認日 | 署名 |
|------|------|--------|------|
| プロダクトオーナー | - | - | - |
| 技術リード | - | - | - |
