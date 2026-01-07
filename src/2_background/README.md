Last updated on: 2025-11-07

# 2_background: Background Service Worker

## Module Overview

This module serves as the central hub for the browser extension's background operations. It runs as a persistent service worker, responsible for initializing backend services, managing communication between different parts of the extension (like content scripts and the popup), and handling core events.

## File Structure

```
2_background/
├── README.md                               # This document.
├── index.ts                                # Main entry point for the background script.
├── handlers/
│   ├── FragmentTranslationRequestHandler.ts # Handles fragment translation requests from content scripts.
│   ├── SpeechSynthesisRequestHandler.ts    # Handles speech synthesis requests from content scripts.
│   └── TranslationRequestHandler.ts        # Handles word translation requests from content scripts.
├── messaging/
│   └── MessageRouter.ts                    # Routes incoming messages to the correct handlers.
└── services/
    └── ServiceInitializer.ts               # Initializes and configures core services.
```

## Core Components

### 1. Initialization (`index.ts` & `services/ServiceInitializer.ts`)

-   **`index.ts`**: The main entry point that orchestrates the initialization sequence. It calls `initializeServices` to set up all necessary backend components and `setupMessageListener` to prepare for communication. It also registers listeners for extension lifecycle events like installation or updates.
-   **`services/ServiceInitializer.ts`**:
    -   `initializeServices()`: A central function to initialize all required services.
    -   `initializeAPIService()`: Specifically configures and initializes the `APIService` from the `5_backend` module, setting the base URL and providing a mock token retrieval function for local development.

### 2. Communication (`messaging/MessageRouter.ts`)

-   **`setupMessageListener()`**: Registers a listener for `chrome.runtime.onMessage`. This function acts as a router, inspecting the `type` of incoming messages and delegating them to the appropriate handler. This keeps the message-handling logic organized and decoupled.

### 3. Request Handling (`handlers/`)

-   **`TranslationRequestHandler.ts`**:
    -   `handleTranslationRequest(...)`: Processes word translation requests received from content scripts. It extracts the necessary data, calls the `translate` service from the `6_translate` module, and sends the result back to the content script.
-   **`FragmentTranslationRequestHandler.ts`**:
    -   `handleFragmentTranslationRequest(...)`: Processes fragment translation requests received from content scripts. It extracts the necessary data, calls the `translateFragment` service from the `6_translate` module, and sends the result back to the content script.
-   **`SpeechSynthesisRequestHandler.ts`**:
    -   `handleSpeechSynthesisRequest(...)`: Processes speech synthesis requests received from content scripts. It extracts the text and language, calls the `synthesizeSpeech` service from the `7_speech` module, and sends the base64 audio data back to the content script.