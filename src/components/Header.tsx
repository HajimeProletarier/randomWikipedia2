import { Globe, Moon, Sun, Monitor } from 'lucide-react';
import { useSettingsStore } from '@/stores/settingsStore';
import { SUPPORTED_LANGS, type SupportedLang } from '@/types';

export function Header() {
  const { lang, theme, setLang, setTheme } = useSettingsStore();

  const themeIcons = {
    light: Sun,
    dark: Moon,
    system: Monitor,
  };
  const ThemeIcon = themeIcons[theme];

  const cycleTheme = () => {
    const themes: Array<'light' | 'dark' | 'system'> = ['light', 'dark', 'system'];
    const currentIndex = themes.indexOf(theme);
    const nextIndex = (currentIndex + 1) % themes.length;
    setTheme(themes[nextIndex]);
  };

  return (
    <header className="bg-white dark:bg-gray-800 shadow-sm">
      <div className="max-w-4xl mx-auto px-4 py-4 flex items-center justify-between">
        <h1 className="text-xl font-bold text-gray-900 dark:text-white">
          Random Wikipedia
        </h1>

        <div className="flex items-center gap-4">
          {/* 言語切り替え */}
          <div className="flex items-center gap-2">
            <Globe className="w-4 h-4 text-gray-500 dark:text-gray-400" />
            <select
              value={lang}
              onChange={(e) => setLang(e.target.value as SupportedLang)}
              className="bg-gray-100 dark:bg-gray-700 text-gray-900 dark:text-white rounded px-2 py-1 text-sm"
            >
              {SUPPORTED_LANGS.map((l) => (
                <option key={l.code} value={l.code}>
                  {l.name}
                </option>
              ))}
            </select>
          </div>

          {/* テーマ切り替え */}
          <button
            onClick={cycleTheme}
            className="p-2 rounded-lg bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
            aria-label={`テーマ: ${theme}`}
          >
            <ThemeIcon className="w-5 h-5 text-gray-600 dark:text-gray-300" />
          </button>
        </div>
      </div>
    </header>
  );
}
