# 注意

> このドキュメントは AI ペアプロで自動生成。信じすぎて地雷を踏んでも知らないよ。

# ずぼら GPT V2

「めんどくさい」を極めた Chrome 拡張。選択テキストを右クリックだけで ChatGPT に投げられる。コピペ？そんなの前時代の遺物だよ。

## 機能

- テキストを選択して右クリック →ChatGPT に送信
- 結果はポップアップで表示
- OpenAI API キーは設定画面で管理

## インストール方法

1. このリポジトリをクローン（面倒ならやらなくてもいいよ）
2. パッケージをインストール
   ```bash
   npm install
   ```
3. ビルド
   ```bash
   npm run build
   ```
4. Chrome の拡張機能管理（chrome://extensions/）で「パッケージ化されていない拡張機能を読み込む」から`dist`を選択

## 使い方

1. 設定画面で OpenAI API キーを入力（忘れたら動かないよ）
2. テキストを選択して右クリック
3. 結果がポップアップで出る（見逃しても知らん）

## 開発

- Node.js と npm が必要（なければ諦めて）

### セットアップ

```bash
git clone https://github.com/yourusername/zubora-gpt-extension-v2.git
cd zubora-gpt-extension-v2
npm install
npm run dev
```

### ビルド

```bash
npm run build
```

## ライセンス

MIT。好きにして。

---

README をここまで読んだあなた、もう「ずぼら」じゃないかもね。
