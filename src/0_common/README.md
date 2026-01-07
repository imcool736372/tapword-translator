Last updated on: 2026-01-07

# 0_common: Shared Utilities and Types

## Module Overview

The `0_common` module serves as the foundational layer of the TapWord Translator extension. It contains shared utilities, core TypeScript type definitions, internationalization (i18n) locales, and application-wide constants that are consumed by all other modules. Its primary purpose is to centralize cross-cutting concerns like logging, storage, i18n, and data model definitions to ensure consistency and avoid code duplication.

## File Structure

```
0_common/
├── README.md
├── index.ts
├── constants/
│   ├── customApi.ts
│   ├── errorMessages.ts
│   ├── index.ts
│   └── translationFontSize.ts
├── locales/
│   ├── en.json
│   ├── zh.json
│   └── ... (other languages)
├── types/
│   ├── index.ts
│   └── QuotaExceededError.ts
└── utils/
    ├── i18n.ts
    ├── logger.ts
    ├── storageManager.ts
    ├── textTruncator.ts
    ├── translationManager.ts
    └── version.ts
```

## Core Components

### 1. Constants (`constants/`)

This directory centralizes all static, unchanging values used across the application.

-   **`constants/index.ts`**: Exports application-level constants, such as cache expiry times and environment-driven feature flags.
-   **`constants/errorMessages.ts`**: Contains a map of user-facing error messages for a consistent user experience.
-   **`constants/customApi.ts`**: Defines fixed parameters (e.g., `temperature`, `maxTokens`) for requests made to custom OpenAI-compatible APIs.
-   **`constants/translationFontSize.ts`**: Provides a map and helper functions for managing translation font size presets (e.g., "small", "medium").

### 2. Locales (`locales/`)

This directory contains the translation files for the extension's user interface. Each JSON file corresponds to a supported language (e.g., `en.json`, `zh.json`) and contains a key-value map of translation strings.

### 3. Type Definitions (`types/`)

This directory contains the core TypeScript interfaces and types that define the data structures for the entire application, ensuring type safety and clear contracts between modules.

-   **`types/index.ts`**: Exports all major data structures, including:
    -   `TranslationContextData` & `FragmentTranslationContextData`: The shape of data sent for a translation request.
    -   `SpeechSynthesisRequestData`: The shape of data for a text-to-speech request.
    -   Message Types (`TranslateRequestMessage`, `SpeechSynthesisResponseMessage`, etc.): Defines the communication protocol between content scripts and the background service worker.
    -   `UserSettings`: The comprehensive structure for all user-configurable settings, including defaults in `DEFAULT_USER_SETTINGS`.
-   **`types/QuotaExceededError.ts`**: A custom error class thrown specifically when a translation or speech synthesis quota has been met.

### 4. Shared Utilities (`utils/`)

This directory provides a collection of reusable services and helper functions that encapsulate common functionalities.

-   **`utils/i18n.ts`**: A powerful internationalization utility that handles all UI translations. It automatically detects the browser's language, loads the appropriate locale from the `locales/` directory, and provides functions to translate strings. It can apply translations declaratively to the DOM by finding elements with a `data-i18n-key` attribute.
-   **`utils/logger.ts`**: A singleton logger that provides prefixed, level-controlled logging (`debug`, `info`, `warn`, `error`) and can be disabled in production environments via Vite environment variables. Use `createLogger('module-name')` for module-specific logging.
-   **`utils/storageManager.ts`**: An abstraction layer over the `chrome.storage` API. It handles CRUD operations for `UserSettings`, provides default settings for new users (detecting their browser language), and normalizes the settings object to ensure data integrity.
-   **`utils/version.ts`**: Provides helper functions (`compareSemver`, `isLowerVersion`) for comparing semantic version strings.
-   **`utils/textTruncator.ts`**: A utility for truncating strings to fit a specific pixel width, useful for dynamically rendering text in constrained UI elements.
-   **`utils/translationManager.ts`**: A placeholder for managing translation history and caching logic.