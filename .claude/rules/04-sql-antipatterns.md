# SQL アンチパターン

Bill Karwin の教えに基づく、データベース設計の戒め。

## 論理設計のアンチパターン

### Jaywalking（信号無視）
**カンマ区切りで複数の値を1カラムに格納しない**

```sql
-- Bad: タグをカンマ区切りで格納
CREATE TABLE articles (
    id INT,
    tags VARCHAR(255)  -- "python,web,api"
);

-- Good: 交差テーブルを使う
CREATE TABLE article_tags (
    article_id INT,
    tag_id INT,
    PRIMARY KEY (article_id, tag_id)
);
```

### Polymorphic Associations（ポリモーフィック関連）
**外部キーの参照先が複数テーブルになる設計を避ける**

```sql
-- Bad: comment_type によって参照先が変わる
CREATE TABLE comments (
    id INT,
    comment_type VARCHAR(20),  -- 'article' or 'photo'
    parent_id INT              -- articles.id? photos.id?
);

-- Good: 共通の親テーブルを作る
CREATE TABLE commentable (id INT PRIMARY KEY);
CREATE TABLE articles (id INT REFERENCES commentable(id));
CREATE TABLE photos (id INT REFERENCES commentable(id));
CREATE TABLE comments (
    id INT,
    parent_id INT REFERENCES commentable(id)
);
```

### Entity-Attribute-Value (EAV)
**汎用的すぎる設計は避ける**

```sql
-- Bad: 何でも入るが何も保証しない
CREATE TABLE attributes (
    entity_id INT,
    attribute_name VARCHAR(50),
    attribute_value VARCHAR(255)
);

-- Good: 型安全なテーブル設計
CREATE TABLE products (
    id INT,
    name VARCHAR(100),
    price DECIMAL(10,2),
    weight DECIMAL(8,3)
);
```

## クエリのアンチパターン

### Implicit Columns（暗黙のカラム）
```sql
-- Bad: どのカラムが返るか不明
SELECT * FROM users;

-- Good: 明示的に指定
SELECT id, name, email FROM users;
```

### Spaghetti Query
```sql
-- Bad: 1つの巨大クエリで全てを解決しようとする
SELECT ... FROM a
JOIN b JOIN c JOIN d JOIN e
WHERE ... AND ... AND ...
GROUP BY ... HAVING ...

-- Good: 目的ごとにクエリを分割、または VIEW を使う
```

### Index Shotgun
```sql
-- Bad: とりあえず全カラムにインデックス
CREATE INDEX idx1 ON users(name);
CREATE INDEX idx2 ON users(email);
CREATE INDEX idx3 ON users(created_at);
...

-- Good: クエリパターンを分析してから必要なインデックスを作成
```

## 設計の原則

### NULL の扱い
- NULL は「不明」であり「空」ではない
- NULL との比較は常に UNKNOWN
- NOT NULL 制約を適切に使う

### 正規化と非正規化
- まず正規化する
- パフォーマンス問題が実証されたら非正規化を検討
- 「たぶん遅くなる」で非正規化しない

### 外部キー制約
- 参照整合性はDBで担保する
- アプリケーション側だけでの整合性管理は危険
- 制約はドキュメントでもある

## 問いかけ

SQLを書くとき、常に問う：
1. この設計で型安全性は保たれているか？
2. 参照整合性は担保されているか？
3. このクエリはインデックスを活用できるか？
4. NULL の扱いは正しいか？
