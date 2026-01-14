import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { HistoryItem } from '@/types';

interface HistoryState {
  items: HistoryItem[];
  addItem: (item: Omit<HistoryItem, 'id' | 'timestamp'>) => void;
  removeItem: (id: string) => void;
  clearAll: () => void;
}

export const useHistoryStore = create<HistoryState>()(
  persist(
    (set) => ({
      items: [],

      addItem: (item) => {
        const newItem: HistoryItem = {
          ...item,
          id: crypto.randomUUID(),
          timestamp: Date.now(),
        };

        set((state) => {
          // 最大100件に制限（古いものから削除）
          const maxItems = 100;
          const newItems = [newItem, ...state.items].slice(0, maxItems);
          return { items: newItems };
        });
      },

      removeItem: (id) => {
        set((state) => ({
          items: state.items.filter((item) => item.id !== id),
        }));
      },

      clearAll: () => set({ items: [] }),
    }),
    {
      name: 'random-wiki-history',
    }
  )
);
