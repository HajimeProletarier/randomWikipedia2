// Wikipedia API レスポンス型
export interface WikipediaArticle {
  type: string;
  title: string;
  displaytitle: string;
  pageid: number;
  extract: string;
  extract_html?: string;
  thumbnail?: {
    source: string;
    width: number;
    height: number;
  };
  originalimage?: {
    source: string;
    width: number;
    height: number;
  };
  lang: string;
  dir: string;
  timestamp: string;
  content_urls: {
    desktop: { page: string };
    mobile: { page: string };
  };
}

// 履歴アイテム
export interface HistoryItem {
  id: string;
  title: string;
  url: string;
  lang: string;
  timestamp: number;
  extract?: string;
  thumbnail?: string;
}

// ブックマーク
export interface Bookmark {
  id: string;
  title: string;
  url: string;
  lang: string;
  addedAt: number;
  memo?: string;
  thumbnail?: string;
}

// 設定
export interface Settings {
  lang: 'ja' | 'en';
  theme: 'light' | 'dark' | 'system';
  historyMaxItems: number;
}

// 対応言語
export type SupportedLang = 'ja' | 'en';

export const SUPPORTED_LANGS: { code: SupportedLang; name: string }[] = [
  { code: 'ja', name: '日本語' },
  { code: 'en', name: 'English' },
];
