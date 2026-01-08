Last updated on: 2026-01-07

# 6_translate: Translation Business Logic

## Module Overview

This module encapsulates the core business logic for all translation-related functionalities. It provides services for performing context-aware translations of both single words and text fragments. It can operate in two modes: using a remote cloud-based API or leveraging a local Large Language Model (LLM) via the `8_generate` module for enhanced privacy and offline capabilities.

## File Structure

```
6_translate/
├── README.md                       # This document.
├── index.ts                        # Main entry point, exports public members.
├── constants/
│   └── TranslationConstants.ts     # Defines API endpoints and configuration for translation services.
├── services/
│   └── TranslationService.ts       # Contains the core logic for word and fragment translation.
└── types/
    ├── TranslationApiTypes.ts      # TypeScript types for the backend translation API.
    ├── TranslationError.ts         # Custom error class for translation-specific errors.
    └── TranslationModels.ts        # Defines data models used by the translation service.
```

## Core Components

### 1. Business Logic (`services/TranslationService.ts`)

-   **`translateWord(params: TranslateParams)`**: The primary function for context-aware word translation. It constructs a request payload and sends it to the appropriate translation service (cloud or local).
-   **`translateFragment(params: TranslateFragmentParams)`**: The primary function for context-aware translation of a text fragment (multiple words). It operates similarly to `translateWord`.
-   **Local LLM Integration**: The service can dynamically switch to using a local LLM if configured by the user. It manages the lifecycle of the local translation services from the `8_generate` module and formats requests accordingly.
-   **Error Handling**: Catches `APIError` from the backend and converts them into user-friendly `TranslationError` instances with internationalized messages.

### 2. Data Types (`types/`)

-   **`types/TranslationModels.ts`**:
    -   `TranslateParams`: Defines the input for `translateWord`, including the word, context, and language settings.
    -   `TranslationResult`: Defines the output for `translateWord`.
    -   `TranslateFragmentParams`: Defines the input for `translateFragment`.
    -   `FragmentTranslationResult`: Defines the output for `translateFragment`.
-   **`types/TranslationApiTypes.ts`**:
    -   `TranslationApiRequest`/`TranslationApiResponse`: Defines the request/response structure for the cloud word translation API.
    -   `FragmentTranslationApiRequest`/`FragmentTranslationApiResponse`: Defines the request/response structure for the cloud fragment translation API.
-   **`types/TranslationError.ts`**:
    -   `TranslationError`: A custom error class that includes a `shortMessage` property for use in constrained UI spaces.

### 3. Constants (`constants/`)

-   **`constants/TranslationConstants.ts`**:
    -   `TRANSLATION_API_ENDPOINTS`: Centralizes API endpoint paths, now including `TRANSLATE` and `TRANSLATE_FRAGMENT`.
    -   `USE_LOCAL_LLM_TRANSLATION`: A flag that was likely used for development and is now superseded by user settings.
    -   `LOCAL_LLM_DEFAULT_CONFIG`: Placeholder configuration for the local LLM.

### 4. Module Entry Point (`index.ts`)

-   Serves as the public API for the module, exporting the core services (`translateWord`, `translateFragment`) and the relevant types (`TranslateParams`, `TranslationResult`, `TranslateFragmentParams`, `FragmentTranslationResult`, `TranslationError`) for consumption by other parts of the application.