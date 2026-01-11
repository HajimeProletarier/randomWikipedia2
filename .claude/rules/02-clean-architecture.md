# Clean Architecture - 依存関係の原則

Robert C. Martin の教えに基づく、持続可能な設計。

## 依存性の方向

**依存は常に「外側から内側」へ向かう**

```
[Frameworks/Drivers] → [Interface Adapters] → [Use Cases] → [Entities]
      外側                                                    内側
```

- 内側は外側を知らない
- Entity は UseCase を知らない
- UseCase は Controller を知らない

## 各層の責務

### Entities（エンティティ）
- ビジネスルールの核心
- 最も変更されにくい
- フレームワークに依存しない

### Use Cases（ユースケース）
- アプリケーション固有のビジネスルール
- 「〜する」という動詞で表現できる
- Entity を操作してビジネス価値を実現

### Interface Adapters（インターフェースアダプター）
- データ形式の変換
- Controller, Presenter, Gateway
- 外部と内部の橋渡し

### Frameworks & Drivers（フレームワーク）
- Web, DB, UI など
- 詳細であり、プラグイン可能であるべき

## 実践的なルール

### 依存性逆転の原則 (DIP)
```
# Bad: 高レベルが低レベルに依存
class OrderService:
    def __init__(self):
        self.repository = MySQLOrderRepository()  # 具象に依存

# Good: 抽象に依存
class OrderService:
    def __init__(self, repository: OrderRepository):  # 抽象に依存
        self.repository = repository
```

### 境界を越えるデータ
- 層を越えるときは DTO を使う
- Entity をそのまま外に出さない
- 各層に適したデータ構造を持つ

### フレームワークと距離を置く
- フレームワークは「詳細」である
- ビジネスロジックにフレームワーク固有のコードを書かない
- 交換可能な設計を目指す

## 判断基準

コードを書くとき、常に問う：
1. この依存の方向は正しいか？
2. このコードはどの層に属するか？
3. フレームワークを変えたとき、ここは影響を受けるか？
