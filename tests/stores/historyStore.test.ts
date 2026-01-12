import { describe, it, expect, beforeEach } from 'vitest';
import { useHistoryStore } from '@/stores/historyStore';

describe('historyStore', () => {
  beforeEach(() => {
    useHistoryStore.setState({ items: [] });
  });

  it('初期状態は空の配列', () => {
    const { items } = useHistoryStore.getState();
    expect(items).toEqual([]);
  });

  it('履歴アイテムを追加できる', () => {
    const { addItem } = useHistoryStore.getState();

    addItem({
      title: 'テスト記事',
      url: 'https://ja.wikipedia.org/wiki/Test',
      lang: 'ja',
    });

    const { items } = useHistoryStore.getState();
    expect(items).toHaveLength(1);
    expect(items[0].title).toBe('テスト記事');
    expect(items[0].url).toBe('https://ja.wikipedia.org/wiki/Test');
    expect(items[0].lang).toBe('ja');
    expect(items[0].id).toBeDefined();
    expect(items[0].timestamp).toBeDefined();
  });

  it('新しい履歴が先頭に追加される', () => {
    const { addItem } = useHistoryStore.getState();

    addItem({ title: '記事1', url: 'https://example.com/1', lang: 'ja' });
    addItem({ title: '記事2', url: 'https://example.com/2', lang: 'ja' });

    const { items } = useHistoryStore.getState();
    expect(items[0].title).toBe('記事2');
    expect(items[1].title).toBe('記事1');
  });

  it('履歴アイテムを削除できる', () => {
    const { addItem, removeItem } = useHistoryStore.getState();

    addItem({ title: 'テスト', url: 'https://example.com', lang: 'ja' });
    const { items: itemsBefore } = useHistoryStore.getState();
    const id = itemsBefore[0].id;

    removeItem(id);

    const { items: itemsAfter } = useHistoryStore.getState();
    expect(itemsAfter).toHaveLength(0);
  });

  it('全履歴をクリアできる', () => {
    const { addItem, clearAll } = useHistoryStore.getState();

    addItem({ title: '記事1', url: 'https://example.com/1', lang: 'ja' });
    addItem({ title: '記事2', url: 'https://example.com/2', lang: 'ja' });

    clearAll();

    const { items } = useHistoryStore.getState();
    expect(items).toHaveLength(0);
  });

  it('最大100件まで保存される', () => {
    const { addItem } = useHistoryStore.getState();

    // 105件追加
    for (let i = 0; i < 105; i++) {
      addItem({ title: `記事${i}`, url: `https://example.com/${i}`, lang: 'ja' });
    }

    const { items } = useHistoryStore.getState();
    expect(items).toHaveLength(100);
    // 最新のものが先頭
    expect(items[0].title).toBe('記事104');
  });
});
