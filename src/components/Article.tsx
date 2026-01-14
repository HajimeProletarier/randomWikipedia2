import { ExternalLink, Bookmark, BookmarkCheck } from 'lucide-react';
import type { WikipediaArticle } from '@/types';
import { getArticleUrl } from '@/services/wikipedia';
import { useBookmarkStore } from '@/stores/bookmarkStore';

interface ArticleProps {
  article: WikipediaArticle;
}

export function Article({ article }: ArticleProps) {
  const url = getArticleUrl(article);
  const { isBookmarked, addItem, removeItem, items } = useBookmarkStore();
  const bookmarked = isBookmarked(url);

  const toggleBookmark = () => {
    if (bookmarked) {
      const bookmark = items.find((item) => item.url === url);
      if (bookmark) removeItem(bookmark.id);
    } else {
      addItem({
        title: article.title,
        url,
        lang: article.lang,
        thumbnail: article.thumbnail?.source,
      });
    }
  };

  return (
    <article className="bg-white dark:bg-gray-800 rounded-lg shadow-lg overflow-hidden">
      {/* サムネイル */}
      {article.thumbnail && (
        <div className="w-full h-48 md:h-64 overflow-hidden bg-gray-100 dark:bg-gray-700">
          <img
            src={article.thumbnail.source}
            alt={article.title}
            className="w-full h-full object-cover"
          />
        </div>
      )}

      <div className="p-6">
        {/* タイトル */}
        <div className="flex items-start justify-between gap-4 mb-4">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
            {article.title}
          </h2>
          <button
            onClick={toggleBookmark}
            className={`p-2 rounded-lg transition-colors ${
              bookmarked
                ? 'bg-yellow-100 dark:bg-yellow-900 text-yellow-600 dark:text-yellow-400'
                : 'bg-gray-100 dark:bg-gray-700 text-gray-500 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-600'
            }`}
            aria-label={bookmarked ? 'ブックマーク解除' : 'ブックマーク追加'}
          >
            {bookmarked ? (
              <BookmarkCheck className="w-5 h-5" />
            ) : (
              <Bookmark className="w-5 h-5" />
            )}
          </button>
        </div>

        {/* 抜粋 */}
        <p className="text-gray-600 dark:text-gray-300 mb-6 leading-relaxed">
          {article.extract}
        </p>

        {/* リンク */}
        <a
          href={url}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-2 text-blue-600 dark:text-blue-400 hover:underline"
        >
          Wikipedia で読む
          <ExternalLink className="w-4 h-4" />
        </a>
      </div>
    </article>
  );
}
