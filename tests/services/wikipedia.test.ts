import { describe, it, expect, vi, beforeEach } from 'vitest';
import { fetchRandomArticle, getArticleUrl } from '@/services/wikipedia';
import type { WikipediaArticle } from '@/types';

// fetch をモック
const mockFetch = vi.fn();
global.fetch = mockFetch;

const mockArticle: WikipediaArticle = {
  type: 'standard',
  title: 'テスト記事',
  displaytitle: 'テスト記事',
  pageid: 12345,
  extract: 'これはテスト記事の抜粋です。',
  lang: 'ja',
  dir: 'ltr',
  timestamp: '2024-01-01T00:00:00Z',
  content_urls: {
    desktop: { page: 'https://ja.wikipedia.org/wiki/テスト記事' },
    mobile: { page: 'https://ja.m.wikipedia.org/wiki/テスト記事' },
  },
};

describe('wikipedia service', () => {
  beforeEach(() => {
    mockFetch.mockReset();
  });

  describe('fetchRandomArticle', () => {
    it('日本語 Wikipedia からランダム記事を取得できる', async () => {
      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: () => Promise.resolve(mockArticle),
      });

      const article = await fetchRandomArticle('ja');

      expect(mockFetch).toHaveBeenCalledWith(
        'https://ja.wikipedia.org/api/rest_v1/page/random/summary?origin=*',
        expect.objectContaining({
          headers: expect.objectContaining({
            'Api-User-Agent': expect.any(String),
          }),
        })
      );
      expect(article.title).toBe('テスト記事');
    });

    it('英語 Wikipedia からランダム記事を取得できる', async () => {
      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: () => Promise.resolve({ ...mockArticle, lang: 'en' }),
      });

      const article = await fetchRandomArticle('en');

      expect(mockFetch).toHaveBeenCalledWith(
        'https://en.wikipedia.org/api/rest_v1/page/random/summary?origin=*',
        expect.anything()
      );
      expect(article.lang).toBe('en');
    });

    it('API エラー時に例外をスローする', async () => {
      mockFetch.mockResolvedValueOnce({
        ok: false,
        status: 500,
      });

      await expect(fetchRandomArticle('ja')).rejects.toThrow('Wikipedia API error: 500');
    });

    it('ネットワークエラー時に例外をスローする', async () => {
      mockFetch.mockRejectedValueOnce(new Error('Network error'));

      await expect(fetchRandomArticle('ja')).rejects.toThrow('Network error');
    });
  });

  describe('getArticleUrl', () => {
    it('デスクトップ版 URL を返す', () => {
      const url = getArticleUrl(mockArticle);
      expect(url).toBe('https://ja.wikipedia.org/wiki/テスト記事');
    });
  });
});
