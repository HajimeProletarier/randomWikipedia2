import { useEffect } from 'react';
import { RefreshCw, Loader2 } from 'lucide-react';
import { Header } from '@/components/Header';
import { Article } from '@/components/Article';
import { useWikipedia } from '@/hooks/useWikipedia';
import { useTheme } from '@/hooks/useTheme';
import { useSettingsStore } from '@/stores/settingsStore';
import { useHistoryStore } from '@/stores/historyStore';
import { getArticleUrl } from '@/services/wikipedia';

function App() {
  useTheme();

  const lang = useSettingsStore((state) => state.lang);
  const addHistoryItem = useHistoryStore((state) => state.addItem);
  const { article, isLoading, error, fetchArticle } = useWikipedia();

  // 初回読み込み
  useEffect(() => {
    fetchArticle(lang);
  }, []);

  // 記事取得後に履歴に追加
  useEffect(() => {
    if (article) {
      addHistoryItem({
        title: article.title,
        url: getArticleUrl(article),
        lang: article.lang,
        extract: article.extract,
        thumbnail: article.thumbnail?.source,
      });
    }
  }, [article, addHistoryItem]);

  const handleNextArticle = () => {
    fetchArticle(lang);
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors">
      <Header />

      <main className="max-w-4xl mx-auto px-4 py-8">
        {/* 次の記事ボタン */}
        <div className="flex justify-center mb-8">
          <button
            onClick={handleNextArticle}
            disabled={isLoading}
            className="flex items-center gap-2 px-6 py-3 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white font-medium rounded-lg transition-colors"
          >
            {isLoading ? (
              <Loader2 className="w-5 h-5 animate-spin" />
            ) : (
              <RefreshCw className="w-5 h-5" />
            )}
            {isLoading ? '読み込み中...' : '次の記事'}
          </button>
        </div>

        {/* エラー表示 */}
        {error && (
          <div className="mb-8 p-4 bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-400 rounded-lg">
            {error}
          </div>
        )}

        {/* 記事表示 */}
        {article && <Article article={article} />}

        {/* 初期状態 */}
        {!article && !isLoading && !error && (
          <div className="text-center text-gray-500 dark:text-gray-400">
            「次の記事」ボタンを押してランダムな Wikipedia 記事を表示
          </div>
        )}
      </main>

      <footer className="max-w-4xl mx-auto px-4 py-8 text-center text-sm text-gray-500 dark:text-gray-400">
        <p>
          Powered by{' '}
          <a
            href="https://www.mediawiki.org/wiki/API:REST_API"
            target="_blank"
            rel="noopener noreferrer"
            className="text-blue-600 dark:text-blue-400 hover:underline"
          >
            Wikipedia REST API
          </a>
        </p>
      </footer>
    </div>
  );
}

export default App;
