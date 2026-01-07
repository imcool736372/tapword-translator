<p align="center">
  <img src="../../resources/icons/icon-128.png" width="80" alt="Logo" />
</p>

<h1 align="center">TapWord Translator</h1>

<p align="center">
    <b>メモを取るように翻訳する</b>
</p>

<p align="center">
    <br> 
    <a href="../../README.md">English</a> | 
    <a href="README-CN.md">简体中文</a> | 
    <a href="README-DE.md">Deutsch</a> | 
    <a href="README-ES.md">Español</a> | 
    <a href="README-FR.md">Français</a> | 
    <b>日本語</b> | 
    <a href="README-KO.md">한국어</a> | 
    <a href="README-RU.md">Русский</a>
</p>

<p align="center">
  <a href="https://chromewebstore.google.com/detail/bjcaamcpfbhldgngnfmnmcdkcmdmhebb" target="_blank">
    <img alt="Chrome Web Store" src="https://img.shields.io/chrome-web-store/stars/bjcaamcpfbhldgngnfmnmcdkcmdmhebb?color=F472B6&label=Chrome&style=flat-square&logo=google-chrome&logoColor=white" />
  </a>
  <a href="LICENSE.txt" target="_blank">
    <img alt="License" src="https://img.shields.io/badge/License-AGPL--3.0-4ADE80?style=flat-square" />
  </a>
  <img alt="TypeScript" src="https://img.shields.io/badge/-TypeScript-3178C6?style=flat-square&logo=typescript&logoColor=white" />
  <img alt="Vite" src="https://img.shields.io/badge/-Vite-646CFF?style=flat-square&logo=vite&logoColor=white" />
</p>

---

![TapWord Translator デモ](../../resources/public/demo.gif)

## 📖 概要

文脈を理解した翻訳を**元のテキストの真下に直接**配置します。映画の字幕や本の注釈のように自然です。

コンセプトはシンプルです：**邪魔をしない**。必要なときに高品質なAI翻訳を提供しながら、ユーザーの読書フロー状態を維持します。

> このリポジトリは、TapWord Translatorの**コミュニティエディション**です。完全にオープンソースで、プライバシー重視の設計となっており、お客様自身のAPIキー（OpenAI、DeepSeek、または任意のOpenAI互換プロバイダー）で動作します。

## ⭐ 主な機能

### ノートスタイル翻訳
翻訳は**テキストの真下に字幕として**表示されます。ポップアップなし、ページ遷移なし。ページにメモを取るような感覚で、読書の流れを妨げません。

### AI駆動の精度
高度なAI（LLM）を活用し、文章の**完全な文脈**を理解することで、従来のツールよりも遥かに正確でニュアンスに富んだ翻訳を提供します。

### スマートな単語選択
単語の一部を選択すると、拡張機能が**自動的に完全な単語に拡張**します。正確な選択は不要—任意の部分をハイライトするだけで、完全な単語の翻訳が得られます。


## 🚀 インストール

### オプション1：Chrome ウェブストア（無料）
公式版は無料でご利用いただけます。

[**Chrome ウェブストアからインストール**](https://chromewebstore.google.com/detail/bjcaamcpfbhldgngnfmnmcdkcmdmhebb)

### オプション2：コミュニティエディションをビルド
**独自のキーを使用**するモデルをお好みの場合は、ご自身でビルドできます：

1.  **リポジトリをクローン**
    ```bash
    git clone https://github.com/hongyuan007/tapword-translator-plugin.git
    cd tapword-translator-plugin
    ```

2.  **依存関係をインストール**
    ```bash
    npm install
    ```

3.  **プロジェクトをビルド**
    ```bash
    npm run build:community
    ```

4.  **Chromeに読み込む**
    - Chromeを開き、`chrome://extensions/`にアクセスします
    - 右上の**デベロッパーモード**を有効にします
    - **パッケージ化されていない拡張機能を読み込む**をクリックします
    - ステップ3で生成された`dist`フォルダを選択します

## ⚙️ 設定（コミュニティエディション）

30秒で使い始められます：

1.  ブラウザのツールバーにある拡張機能アイコンをクリックして**ポップアップ**を開きます
2.  **設定**アイコン（歯車）をクリックして、オプションページを開きます
3.  「カスタムAPI」を見つけます（コミュニティエディションでは必須です）
4.  **API設定**を入力します：
    - **APIキー**：`sk-.......`
    - **モデル**：`gpt-3.5-turbo`、`gpt-4o`、またはその他の互換モデル
    - **APIベースURL**：デフォルトは`https://api.openai.com/v1`ですが、プロキシや他のプロバイダー（DeepSeek、Moonshotなど）を使用するために変更できます
5.  保存して、お楽しみください！

## 🛠 開発

モダンな技術スタックを使用しています：**TypeScript**、**Vite**、**純粋なHTML/CSS**。

### プロジェクト構造
```
src/
├── 1_content/       # Webページに注入されるスクリプト（ページ上で見えるUI）
├── 2_background/    # サービスワーカー（API呼び出し、コンテキストメニュー）
├── 3_popup/         # 拡張機能のポップアップUI
├── 5_backend/       # 共有APIサービス
├── 6_translate/     # 翻訳ビジネスロジック
└── 8_generate/      # LLMプロンプトエンジニアリングとレスポンス解析
```

### コマンド

| コマンド | 説明 |
| :--- | :--- |
| `npm run dev:community` | ウォッチモードで開発サーバーを起動（コミュニティ設定） |
| `npm run build:community` | プロダクション用にビルド（コミュニティ設定） |
| `npm type-check` | TypeScriptの型チェックを実行 |
| `npm test` | Vitestでユニットテストを実行 |

### アーキテクチャの注記：「デュアルビルド」システム
コンパイル時の環境変数を使用して、コミュニティと公式のロジックを分離しています：
- **コミュニティビルド**：`VITE_APP_EDITION=community`。独自のクラウドロジックを無効化し、カスタムAPIの使用を強制し、TTSコードを削除します
- **公式ビルド**：（非公開）独自のサーバーロジックを含みます

## 👏 コントリビューション

私たちは語学学習者と熱心な読書家のコミュニティです。新しいアイデア、UIの提案、バグ修正がある場合は、ぜひコントリビューションをお願いします。プルリクエストを心よりお待ちしております！

1.  プロジェクトをフォーク
2.  機能ブランチを作成（`git checkout -b feature/AmazingFeature`）
3.  変更をコミット（`git commit -m 'Add some AmazingFeature'`）
4.  ブランチにプッシュ（`git push origin feature/AmazingFeature`）
5.  プルリクエストを開く

## 📄 ライセンス

**AGPL-3.0ライセンス**の下で配布されています。詳細は`LICENSE.txt`をご覧ください。

---

<p align="center">
  世界中の読者のために ❤️ を込めて作られました。
</p>
