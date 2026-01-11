import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { Settings, SupportedLang } from '@/types';

interface SettingsState extends Settings {
  setLang: (lang: SupportedLang) => void;
  setTheme: (theme: Settings['theme']) => void;
  setHistoryMaxItems: (max: number) => void;
}

export const useSettingsStore = create<SettingsState>()(
  persist(
    (set) => ({
      lang: 'ja',
      theme: 'system',
      historyMaxItems: 100,

      setLang: (lang) => set({ lang }),
      setTheme: (theme) => set({ theme }),
      setHistoryMaxItems: (historyMaxItems) => set({ historyMaxItems }),
    }),
    {
      name: 'random-wiki-settings',
    }
  )
);
