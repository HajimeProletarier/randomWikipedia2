import { describe, it, expect, beforeEach } from 'vitest';
import { useSettingsStore } from '@/stores/settingsStore';

describe('settingsStore', () => {
  beforeEach(() => {
    // ストアをリセット
    useSettingsStore.setState({
      lang: 'ja',
      theme: 'system',
      historyMaxItems: 100,
    });
  });

  it('デフォルト値が正しく設定されている', () => {
    const state = useSettingsStore.getState();
    expect(state.lang).toBe('ja');
    expect(state.theme).toBe('system');
    expect(state.historyMaxItems).toBe(100);
  });

  it('言語を変更できる', () => {
    const { setLang } = useSettingsStore.getState();
    setLang('en');
    expect(useSettingsStore.getState().lang).toBe('en');
  });

  it('テーマを変更できる', () => {
    const { setTheme } = useSettingsStore.getState();

    setTheme('dark');
    expect(useSettingsStore.getState().theme).toBe('dark');

    setTheme('light');
    expect(useSettingsStore.getState().theme).toBe('light');
  });

  it('履歴の最大件数を変更できる', () => {
    const { setHistoryMaxItems } = useSettingsStore.getState();
    setHistoryMaxItems(50);
    expect(useSettingsStore.getState().historyMaxItems).toBe(50);
  });
});
