import { useState, useCallback, useRef } from 'react';
import type { WikipediaArticle, SupportedLang } from '@/types';
import { fetchRandomArticle } from '@/services/wikipedia';

interface UseWikipediaResult {
  article: WikipediaArticle | null;
  isLoading: boolean;
  error: string | null;
  fetchArticle: (lang: SupportedLang) => Promise<void>;
}

export function useWikipedia(): UseWikipediaResult {
  const [article, setArticle] = useState<WikipediaArticle | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // プリフェッチ用のキャッシュ
  const prefetchedArticle = useRef<WikipediaArticle | null>(null);
  const prefetchLang = useRef<SupportedLang | null>(null);
  const isPrefetching = useRef(false);

  // バックグラウンドで次の記事をプリフェッチ
  const prefetch = useCallback(async (lang: SupportedLang) => {
    if (isPrefetching.current) return;

    isPrefetching.current = true;
    try {
      const data = await fetchRandomArticle(lang);
      prefetchedArticle.current = data;
      prefetchLang.current = lang;
    } catch {
      // プリフェッチの失敗は無視
      prefetchedArticle.current = null;
    } finally {
      isPrefetching.current = false;
    }
  }, []);

  const fetchArticle = useCallback(async (lang: SupportedLang) => {
    setError(null);

    // プリフェッチ済みの記事があり、言語が一致すれば即座に表示
    if (prefetchedArticle.current && prefetchLang.current === lang) {
      setArticle(prefetchedArticle.current);
      prefetchedArticle.current = null;
      prefetchLang.current = null;
      // 次の記事をプリフェッチ開始
      prefetch(lang);
      return;
    }

    // プリフェッチがない場合は通常取得
    setIsLoading(true);

    try {
      const data = await fetchRandomArticle(lang);
      setArticle(data);
      // 次の記事をプリフェッチ開始
      prefetch(lang);
    } catch (err) {
      setError(err instanceof Error ? err.message : '記事の取得に失敗しました');
      setArticle(null);
    } finally {
      setIsLoading(false);
    }
  }, [prefetch]);

  return { article, isLoading, error, fetchArticle };
}
