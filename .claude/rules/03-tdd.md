# TDD - テスト駆動開発

t-wada (和田卓人) の教えに基づく、テストファーストの実践。

## TDD の黄金律

### Red → Green → Refactor

1. **Red**: 失敗するテストを書く
2. **Green**: テストを通す最小限のコードを書く
3. **Refactor**: コードを整理する（テストは通ったまま）

このサイクルを小さく、速く回す。

## テストの書き方

### Arrange-Act-Assert (AAA)
```python
def test_user_can_login():
    # Arrange: 準備
    user = User(email="test@example.com", password="secret")

    # Act: 実行
    result = user.login("secret")

    # Assert: 検証
    assert result.is_success
```

### テストは仕様である
- テスト名は「何ができるか」を日本語で書いても良い
- テストを読めば仕様がわかる状態を目指す
- テストは最も信頼できるドキュメント

## 何をテストするか

### テストすべきもの
- ビジネスロジック
- 境界値
- 異常系・エッジケース
- 回帰（一度直したバグ）

### テストしなくてよいもの
- フレームワークの機能
- 外部ライブラリの動作
- プライベートメソッド（間接的にテストされる）

## テストの原則

### FIRST 原則
- **Fast**: 速い（遅いテストは実行されなくなる）
- **Isolated**: 独立（他のテストに依存しない）
- **Repeatable**: 再現可能（何度実行しても同じ結果）
- **Self-validating**: 自己検証（pass/fail が明確）
- **Timely**: タイムリー（コードと同時に書く）

### テストの信頼性
- 落ちたテストは即座に直す
- Flaky なテストは許容しない
- テストが壊れたまま放置しない

## TDD のマインドセット

### 小さく始める
- 最も単純なケースから
- 一度に1つのことだけテスト
- 動くコードを維持しながら進む

### 不安をテストに変える
- 「これ、大丈夫かな？」→ テストを書く
- 不安がなくなるまでテストを書く
- テストがあれば変更を恐れない

### 過度な事前設計をしない
- テストが設計を導く
- 必要になってから作る (YAGNI)
- リファクタリングで設計を改善

## 質の高いテストとは

```
# Bad: 実装の詳細をテスト
def test_internal_cache_structure():
    service._cache["key"] = "value"  # 内部構造に依存

# Good: 振る舞いをテスト
def test_cached_value_is_returned():
    service.store("key", "value")
    assert service.retrieve("key") == "value"
```

テストは「何をするか」をテストし、「どうやるか」はテストしない。
