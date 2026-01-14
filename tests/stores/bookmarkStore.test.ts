import { describe, it, expect, beforeEach } from 'vitest';
import { useBookmarkStore } from '@/stores/bookmarkStore';

describe('bookmarkStore', () => {
  beforeEach(() => {
    useBookmarkStore.setState({ items: [] });
  });

  it('初期状態は空の配列', () => {
    const { items } = useBookmarkStore.getState();
    expect(items).toEqual([]);
  });

  it('ブックマークを追加できる', () => {
    const { addItem } = useBookmarkStore.getState();

    addItem({
      title: 'お気に入り記事',
      url: 'https://ja.wikipedia.org/wiki/Favorite',
      lang: 'ja',
    });

    const { items } = useBookmarkStore.getState();
    expect(items).toHaveLength(1);
    expect(items[0].title).toBe('お気に入り記事');
    expect(items[0].id).toBeDefined();
    expect(items[0].addedAt).toBeDefined();
  });

  it('同じ URL は重複して追加されない', () => {
    const { addItem } = useBookmarkStore.getState();
    const url = 'https://ja.wikipedia.org/wiki/Same';

    addItem({ title: '記事1', url, lang: 'ja' });
    addItem({ title: '記事2', url, lang: 'ja' });

    const { items } = useBookmarkStore.getState();
    expect(items).toHaveLength(1);
    expect(items[0].title).toBe('記事1');
  });

  it('ブックマークを削除できる', () => {
    const { addItem, removeItem } = useBookmarkStore.getState();

    addItem({ title: 'テスト', url: 'https://example.com', lang: 'ja' });
    const { items: itemsBefore } = useBookmarkStore.getState();

    removeItem(itemsBefore[0].id);

    const { items: itemsAfter } = useBookmarkStore.getState();
    expect(itemsAfter).toHaveLength(0);
  });

  it('ブックマーク済みかどうかを確認できる', () => {
    const { addItem, isBookmarked } = useBookmarkStore.getState();
    const url = 'https://ja.wikipedia.org/wiki/Test';

    expect(isBookmarked(url)).toBe(false);

    addItem({ title: 'テスト', url, lang: 'ja' });

    // getState() を再度呼び出して最新の状態を取得
    expect(useBookmarkStore.getState().isBookmarked(url)).toBe(true);
  });

  it('メモを更新できる', () => {
    const { addItem, updateMemo } = useBookmarkStore.getState();

    addItem({ title: 'テスト', url: 'https://example.com', lang: 'ja' });
    const { items: itemsBefore } = useBookmarkStore.getState();
    const id = itemsBefore[0].id;

    updateMemo(id, 'これは重要な記事');

    const { items: itemsAfter } = useBookmarkStore.getState();
    expect(itemsAfter[0].memo).toBe('これは重要な記事');
  });

  it('全ブックマークをクリアできる', () => {
    const { addItem, clearAll } = useBookmarkStore.getState();

    addItem({ title: '記事1', url: 'https://example.com/1', lang: 'ja' });
    addItem({ title: '記事2', url: 'https://example.com/2', lang: 'ja' });

    clearAll();

    const { items } = useBookmarkStore.getState();
    expect(items).toHaveLength(0);
  });
});
