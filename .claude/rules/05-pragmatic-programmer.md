# 達人プログラマー

David Thomas & Andrew Hunt の教えに基づく、職人としての心得。

## 自分の技術に責任を持つ

### 割れ窓を放置しない
- 悪いコードを見つけたら直す
- 「後で」と言い訳しない
- 1つの割れ窓が全体を腐らせる

### 十分に良いソフトウェア
- 完璧を求めて前に進まないより、十分に良いものを出す
- ただし「十分に良い」は「雑」ではない
- ユーザーに価値を届けることが最優先

## DRY - Don't Repeat Yourself

**あらゆる知識は、システム内で単一、明確、正式な表現を持つべき**

### DRY の本質
```
# これは DRY 違反ではない（偶然の重複）
def validate_email(email): ...
def validate_username(username): ...  # 似た構造でも目的が違う

# これは DRY 違反（知識の重複）
TAX_RATE = 0.1  # 設定ファイルに
tax = price * 0.1  # コードにも同じ知識
```

DRY はコードの重複だけでなく「知識の重複」を排除する。

## 直交性

**無関係なものは互いに影響を与えない**

- コンポーネントは独立させる
- 変更の影響範囲を限定する
- 再利用性が高まる

```
# Bad: 直交性がない
def calculate_total(order):
    total = sum(item.price for item in order.items)
    send_email(order.user, f"Total: {total}")  # 計算と通知が結合
    return total

# Good: 直交性がある
def calculate_total(order):
    return sum(item.price for item in order.items)

def notify_user(user, total):
    send_email(user, f"Total: {total}")
```

## 可逆性

**重要な決定は可逆にしておく**

- 特定のベンダーにロックインしない
- 抽象化層を設けて交換可能にする
- 「もし変わったら」に備える

## 曳光弾

**動くものを早く作って軌道修正する**

- 完璧な設計を待たない
- エンドツーエンドで薄く動くものを作る
- フィードバックを得て調整する

## 契約による設計

### 事前条件・事後条件・不変条件

```python
def divide(dividend: float, divisor: float) -> float:
    """
    事前条件: divisor != 0
    事後条件: result * divisor == dividend
    """
    assert divisor != 0, "Divisor must not be zero"
    return dividend / divisor
```

- 入力の検証は呼び出し側の責務を明確にする
- 出力の保証はその関数の責務を明確にする

## エラー処理

### 早めにクラッシュする
- エラーを握りつぶさない
- 中途半端な状態で続行しない
- 問題は早く発見するほど修正が容易

### 表明プログラミング
- 「起こるはずがない」ことを assert で表明する
- assert はドキュメントでもある
- 本番でも（パフォーマンスが許す限り）有効にする

## 見積もり

- 精度に見合った単位を使う
- 「1-2ヶ月」と「45日」は印象が違う
- 経験から学び、見積もりを改善し続ける

## 達人の習慣

1. **毎年少なくとも1つの言語を学ぶ**
2. **毎月技術書を読む**
3. **異なる環境を試す**
4. **常に批判的に考える**
5. **自分の作品に署名する** - 自分のコードに誇りを持つ
