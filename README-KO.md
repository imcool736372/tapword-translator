<p align="center">
  <img src="resources/icons/icon-128.png" width="80" alt="Logo" />
</p>

<h1 align="center">TapWord Translator</h1>

<p align="center">
    <b>메모하듯 번역하기</b>
</p>

<p align="center">
    <br> 
    <a href="README.md">English</a> | 
    <a href="README-CN.md">简体中文</a> | 
    <a href="README-DE.md">Deutsch</a> | 
    <a href="README-ES.md">Español</a> | 
    <a href="README-FR.md">Français</a> | 
    <a href="README-JA.md">日本語</a> | 
    <b>한국어</b> | 
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

![TapWord Translator 데모](resources/public/demo.gif)

## 📖 소개

문맥을 이해한 번역이 **원문 바로 아래에** 표시됩니다. 영화 자막이나 책의 주석처럼 자연스럽게요.

핵심 철학은 간단합니다: **방해하지 않기**. 필요할 때 고품질 AI 번역을 제공하면서 사용자의 읽기 흐름을 유지합니다.

> 이 저장소는 TapWord Translator의 **커뮤니티 에디션**입니다. 완전한 오픈소스이며, 프라이버시 중심으로 설계되었고, 여러분의 API 키(OpenAI, DeepSeek 또는 OpenAI 호환 제공업체)로 작동합니다.

## ⭐ 주요 기능

### 메모 스타일 번역
번역이 **텍스트 바로 아래 자막처럼** 나타납니다. 팝업 없이, 화면 이동 없이. 페이지에 메모를 하는 것처럼 느껴지며, 읽기 흐름을 방해하지 않습니다.

### AI 기반 정확성
고급 AI(LLM)를 기반으로 문장의 **전체 맥락**을 이해하여, 기존 도구보다 훨씬 더 정확하고 세밀한 번역을 제공합니다.

### 스마트 단어 선택
단어의 일부만 선택해도 확장 프로그램이 **자동으로 완전한 단어로 확장**합니다. 정확한 선택이 필요 없습니다—어떤 부분이든 강조하면 전체 단어 번역을 받을 수 있습니다.


## 🚀 설치 방법

### 옵션 1: Chrome 웹 스토어 (무료)
공식 버전은 무료로 사용할 수 있습니다.

[**Chrome 웹 스토어에서 설치**](https://chromewebstore.google.com/detail/bjcaamcpfbhldgngnfmnmcdkcmdmhebb)

### 옵션 2: 커뮤니티 에디션 직접 빌드
**자신의 키 사용** 모델을 선호하신다면, 직접 빌드하실 수 있습니다:

1.  **저장소 복제**
    ```bash
    git clone https://github.com/hongyuan007/tapword-translator-plugin.git
    cd tapword-translator-plugin
    ```

2.  **의존성 설치**
    ```bash
    npm install
    ```

3.  **프로젝트 빌드**
    ```bash
    npm run build:community
    ```

4.  **Chrome에 로드**
    - Chrome을 열고 `chrome://extensions/`로 이동합니다
    - 우측 상단의 **개발자 모드**를 활성화합니다
    - **압축해제된 확장 프로그램을 로드합니다** 클릭
    - 3단계에서 생성된 `dist` 폴더를 선택합니다

## ⚙️ 설정 (커뮤니티 에디션)

30초 안에 시작하세요:

1.  브라우저 도구 모음의 확장 프로그램 아이콘을 클릭하여 **팝업**을 엽니다
2.  **설정** 아이콘(톱니바퀴)을 클릭하여 옵션 페이지를 엽니다
3.  "사용자 정의 API" 찾기 (커뮤니티 에디션에서는 필수입니다)
4.  **API 설정**을 입력합니다:
    - **API 키**: `sk-.......`
    - **모델**: `gpt-3.5-turbo`, `gpt-4o` 또는 기타 호환 모델
    - **API 기본 URL**: 기본값은 `https://api.openai.com/v1`이지만, 프록시나 다른 제공업체(예: DeepSeek, Moonshot)를 사용하도록 변경할 수 있습니다
5.  저장하고 즐기세요!

## 🛠 개발

최신 스택을 사용합니다: **TypeScript**, **Vite**, **순수 HTML/CSS**.

### 프로젝트 구조
```
src/
├── 1_content/       # 웹 페이지에 주입되는 스크립트 (페이지에서 보이는 UI)
├── 2_background/    # 서비스 워커 (API 호출, 컨텍스트 메뉴)
├── 3_popup/         # 확장 프로그램 팝업 UI
├── 5_backend/       # 공유 API 서비스
├── 6_translate/     # 번역 비즈니스 로직
└── 8_generate/      # LLM 프롬프트 엔지니어링 및 응답 파싱
```

### 명령어

| 명령어 | 설명 |
| :--- | :--- |
| `npm run dev:community` | 감시 모드에서 개발 서버 시작 (커뮤니티 설정) |
| `npm run build:community` | 프로덕션용 빌드 (커뮤니티 설정) |
| `npm type-check` | TypeScript 타입 검사 실행 |
| `npm test` | Vitest로 단위 테스트 실행 |

### 아키텍처 참고사항: "이중 빌드" 시스템
컴파일 타임 환경 변수를 사용하여 커뮤니티와 공식 로직을 분리합니다:
- **커뮤니티 빌드**: `VITE_APP_EDITION=community`. 독점 클라우드 로직을 비활성화하고, 사용자 정의 API 사용을 강제하며, TTS 코드를 제거합니다
- **공식 빌드**: (비공개) 독점 서버 로직을 포함합니다

## 👏 기여하기

저희는 언어 학습자와 열정적인 독자들의 커뮤니티입니다. 신선한 아이디어, UI 제안 또는 버그 수정이 있으시다면, 여러분의 기여를 환영합니다. Pull Request를 환영합니다!

1.  프로젝트 포크
2.  기능 브랜치 생성 (`git checkout -b feature/AmazingFeature`)
3.  변경사항 커밋 (`git commit -m 'Add some AmazingFeature'`)
4.  브랜치에 푸시 (`git push origin feature/AmazingFeature`)
5.  Pull Request 열기

## 📄 라이선스

**AGPL-3.0 라이선스** 하에 배포됩니다. 자세한 내용은 `LICENSE.txt`를 참조하세요.

---

<p align="center">
  전 세계 독자들을 위해 ❤️ 로 만들었습니다.
</p>
