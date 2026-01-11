import { useState, useCallback } from 'react';
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

  const fetchArticle = useCallback(async (lang: SupportedLang) => {
    setIsLoading(true);
    setError(null);

    try {
      const data = await fetchRandomArticle(lang);
      setArticle(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : '記事の取得に失敗しました');
      setArticle(null);
    } finally {
      setIsLoading(false);
    }
  }, []);

  return { article, isLoading, error, fetchArticle };
}
