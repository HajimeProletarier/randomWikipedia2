import type { WikipediaArticle, SupportedLang } from '@/types';

const WIKIPEDIA_API_BASE = 'wikipedia.org/api/rest_v1/page/random/summary';

export async function fetchRandomArticle(lang: SupportedLang): Promise<WikipediaArticle> {
  const url = `https://${lang}.${WIKIPEDIA_API_BASE}?origin=*`;

  const response = await fetch(url, {
    headers: {
      'Api-User-Agent': 'RandomWikipedia/2.0 (https://github.com/HajimeProletarier/randomWikipedia2)',
    },
  });

  if (!response.ok) {
    throw new Error(`Wikipedia API error: ${response.status}`);
  }

  return response.json();
}

export function getArticleUrl(article: WikipediaArticle): string {
  return article.content_urls.desktop.page;
}
