import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { Bookmark } from '@/types';

interface BookmarkState {
  items: Bookmark[];
  addItem: (item: Omit<Bookmark, 'id' | 'addedAt'>) => void;
  removeItem: (id: string) => void;
  updateMemo: (id: string, memo: string) => void;
  isBookmarked: (url: string) => boolean;
  clearAll: () => void;
}

export const useBookmarkStore = create<BookmarkState>()(
  persist(
    (set, get) => ({
      items: [],

      addItem: (item) => {
        // 既にブックマーク済みなら追加しない
        if (get().isBookmarked(item.url)) return;

        const newItem: Bookmark = {
          ...item,
          id: crypto.randomUUID(),
          addedAt: Date.now(),
        };

        set((state) => ({
          items: [newItem, ...state.items].slice(0, 100),
        }));
      },

      removeItem: (id) => {
        set((state) => ({
          items: state.items.filter((item) => item.id !== id),
        }));
      },

      updateMemo: (id, memo) => {
        set((state) => ({
          items: state.items.map((item) =>
            item.id === id ? { ...item, memo } : item
          ),
        }));
      },

      isBookmarked: (url) => {
        return get().items.some((item) => item.url === url);
      },

      clearAll: () => set({ items: [] }),
    }),
    {
      name: 'random-wiki-bookmarks',
    }
  )
);
