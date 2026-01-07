<p align="center">
  <img src="resources/icons/icon-128.png" width="80" alt="Logo" />
</p>

<h1 align="center">TapWord Translator</h1>

<p align="center">
    <b>Translate like Taking Notes</b>
</p>

<p align="center">
    <br> 
    <b>English</b> | 
    <a href="docs/README/README-CN.md">简体中文</a> | 
    <a href="docs/README/README-DE.md">Deutsch</a> | 
    <a href="docs/README/README-ES.md">Español</a> | 
    <a href="docs/README/README-FR.md">Français</a> | 
    <a href="docs/README/README-JA.md">日本語</a> | 
    <a href="docs/README/README-KO.md">한국어</a> | 
    <a href="docs/README/README-RU.md">Русский</a>
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

![TapWord Translator Demo](resources/public/demo.gif)

## 📖 Introduction

Placing context-aware translations **directly below the original text**, just like subtitles in a movie or annotations in a book.

The core philosophy is simple: **Do not disturb.** Keep the user in the "flow state" of reading while providing high-quality, LLM-powered translations when needed.

> This repository hosts the **Community Edition** of TapWord Translator. It is fully open-source, privacy-focused, and designed to work with your own API Keys (OpenAI, DeepSeek, or any OpenAI-compatible provider).

## ⭐ Key Features

### Note-Style Translation
Translations appear as **subtitles directly under the text**. No popups, no jumping. It feels like taking notes on the page, keeping your reading flow uninterrupted.

### AI-Powered Accuracy
Powered by advanced AI (LLMs), it understands the **full context** of sentences, delivering translations that are far more accurate and nuanced than traditional tools.

### Smart Word Selection
Select part of a word, and the extension **automatically expands to the complete word**. No need for precise selection—just highlight any portion, and get the full word translated.


## 🚀 Installation

### Option 1: Chrome Web Store (Free)
The official version is free to use.

[**Install from Chrome Web Store**](https://chromewebstore.google.com/detail/bjcaamcpfbhldgngnfmnmcdkcmdmhebb)

### Option 2: Build Community Edition
If you prefer the **Bring Your Own Key** model, you can build it yourself:

1.  **Clone the repository**
    ```bash
    git clone https://github.com/hongyuan007/tapword-translator.git
    cd tapword-translator
    ```

2.  **Install dependencies**
    ```bash
    npm install
    ```

3.  **Build the project**
    ```bash
    npm run build:community
    ```

4.  **Load into Chrome**
    - Open Chrome and navigate to `chrome://extensions/`.
    - Enable **Developer mode** (top right toggle).
    - Click **Load unpacked**.
    - Select the `dist` folder generated in step 3.

## ⚙️ Configuration (Community Edition)

Start using the extension in 30 seconds:

1.  Click the extension icon in your browser toolbar to open the **Popup**.
2.  Click the **Settings** (gear icon) to open the Options page.
3.  Locate "Custom API" (In Community Edition, this is mandatory).
4.  Enter your **API configuration**:
    - **API Key**: `sk-.......`
    - **Model**: `gpt-3.5-turbo`, `gpt-4o`, or other compatible models.
    - **API Base URL**: Defaults to `https://api.openai.com/v1`, but you can change this to use proxies or other providers (e.g., DeepSeek, Moonshot).
5.  Save and enjoy!

## 🛠 Development

We use a modern stack: **TypeScript**, **Vite**, and **pure HTML/CSS**.

### Project Structure
```
src/
├── 1_content/       # Scripts injected into web pages (The UI you see on pages)
├── 2_background/    # Service workers (API calls, context menu)
├── 3_popup/         # Extension popup UI
├── 5_backend/       # Shared API services
├── 6_translate/     # Translation business logic
└── 8_generate/      # LLM prompt engineering & response parsing
```

### Commands

| Command | Description |
| :--- | :--- |
| `npm run dev:community` | Start development server in watch mode (Community Config) |
| `npm run build:community` | Build for production (Community Config) |
| `npm type-check` | Run TypeScript type checking |
| `npm test` | Run unit tests with Vitest |

### Architecture Note: The "Dual Build" System
We use compile-time environment variables to separate the Community and Official logic.
- **Community Build**: `VITE_APP_EDITION=community`. Disables proprietary cloud logic, enforces custom API usage, and strips out TTS code.
- **Official Build**: (Private) Includes proprietary server logic.

## 👏 Contributing

We are a community of language learners and avid readers. If you have fresh ideas, UI suggestions, or bug fixes, we'd love your contributions, Pull requests are warmly welcome!

1.  Fork the Project
2.  Create your Feature Branch (`git checkout -b feature/AmazingFeature`)
3.  Commit your Changes (`git commit -m 'Add some AmazingFeature'`)
4.  Push to the Branch (`git push origin feature/AmazingFeature`)
5.  Open a Pull Request

## 📄 License

Distributed under the **AGPL-3.0 License**. See `LICENSE.txt` for more information.

---

<p align="center">
  Made with ❤️ for readers around the world.
</p>
