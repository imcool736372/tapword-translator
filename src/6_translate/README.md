Last updated on: 2025-10-26

# 6_translate: Translation Business Logic

## Module Overview

This module encapsulates the core business logic for all translation-related functionalities within the application. It provides services for performing context-aware translations of words and sentences by communicating with the backend translation API.

## File Structure

```
6_translate/
├── README.md                       # This document.
├── index.ts                        # Main entry point, exports public members.
├── constants/
│   └── TranslationConstants.ts     # Defines API endpoints for translation services.
├── services/
│   └── TranslationService.ts       # Contains the core translation logic.
└── types/
    ├── TranslationApiTypes.ts      # TypeScript types for the backend translation API.
    └── TranslationModels.ts        # Defines the data models used by the translation service.
```

## Core Components

### 1. Business Logic (`services/TranslationService.ts`)

-   **`translate(params: TranslateParams)`**: The primary function for context-aware translation. It constructs a request payload including the target word, surrounding text, and other contextual information (like adjacent sentences or book details) and sends it to the backend API.
-   **`translateWord(...)`**: A convenience wrapper around the `translate` function for simple, context-free word translations.

### 2. Data Types (`types/`)

-   **`types/TranslationModels.ts`**:
    -   `TranslateParams`: Defines the input structure for the `translate` function, specifying the word, context, and language settings.
    -   `TranslationResult`: Defines the expected output structure, containing the translated word and, if available, the full sentence translation.
-   **`types/TranslationApiTypes.ts`**:
    -   `TranslationApiRequest`: Defines the precise request payload structure expected by the backend translation API endpoint.
    -   `TranslationApiResponse`: Defines the structure of the successful response from the backend, including translations and provider information.

### 3. Constants (`constants/`)

-   **`constants/TranslationConstants.ts`**:
    -   `TRANSLATION_API_ENDPOINTS`: Centralizes the API endpoint paths for translation-related network requests, making them easy to manage.

### 4. Module Entry Point (`index.ts`)

-   Serves as the public API for the module, exporting the core `translate` and `translateWord` functions, as well as the primary data models (`TranslateParams`, `TranslationResult`), so they can be easily consumed by other parts of the application.
