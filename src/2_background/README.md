Last updated on: 2026-01-07

# 2_background: Background Service Worker

## Module Overview

This module is the event-driven core of the browser extension. It runs as a persistent service worker, responsible for initializing backend services, managing all communication between different parts of the extension (content scripts, popup, options page), and handling core API interactions in response to messages.

## File Structure

```
2_background/
├── README.md
├── index.ts
├── handlers/
│   ├── BackgroundErrorHandler.ts
│   ├── FragmentTranslationRequestHandler.ts
│   ├── PopupBootstrapHandler.ts
│   ├── SpeechSynthesisRequestHandler.ts
│   └── TranslationRequestHandler.ts
├── messaging/
│   └── MessageRouter.ts
└── services/
    └── ServiceInitializer.ts
```

## Core Components

### 1. Initialization (`index.ts` & `services/ServiceInitializer.ts`)

-   **`index.ts`**: The main entry point that orchestrates the initialization sequence. It calls `initializeServices` to set up all necessary backend components and `setupMessageListener` to prepare for communication. It also registers listeners for extension lifecycle events like `onInstalled`.
-   **`services/ServiceInitializer.ts`**: This module is responsible for the ordered initialization of all core backend services from the `5_backend` module. This includes:
    1.  `initializeAPIService()`: Configures authentication and the base API client.
    2.  `initializeConfigService()`: Fetches and manages remote cloud configuration.
    3.  `initializeQuotaManager()`: Sets up the services for tracking API usage quotas.

### 2. Communication (`messaging/MessageRouter.ts`)

-   **`setupMessageListener()`**: This function registers the single `chrome.runtime.onMessage` listener. It acts as a central router, inspecting the `type` of each incoming message and delegating it to the appropriate handler. This keeps the message-handling logic organized and decoupled.

### 3. Request Handling (`handlers/`)

This directory contains the business logic for each type of message the background script can receive.

-   **`TranslationRequestHandler.ts`**: Processes word translation requests. It checks quotas, calls the `translateWord` service from `6_translate`, and sends the result back to the content script.
-   **`FragmentTranslationRequestHandler.ts`**: Processes translation requests for longer text fragments, calling the `translateFragment` service.
-   **`SpeechSynthesisRequestHandler.ts`**: Processes text-to-speech requests, calling the `synthesizeSpeech` service from `7_speech`.
-   **`PopupBootstrapHandler.ts`**: Handles requests from the popup and options pages (`POPUP_BOOTSTRAP_REQUEST`) to provide them with essential initial data, such as the extension version and remote configuration details.
-   **`BackgroundErrorHandler.ts`**: A crucial utility that centralizes error handling. It creates consistent, typed error responses for various scenarios (e.g., `QuotaExceededError`, `TranslationError`), ensuring that content scripts and UI components receive predictable error objects.
