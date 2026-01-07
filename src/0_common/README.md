Last updated on: 2025-11-14

# 0_common: Shared Utilities and Types

## Module Overview

The `0_common` module serves as the foundational layer of the AI Click Translator extension. It contains shared utilities, core TypeScript type definitions, and application-wide constants that are consumed by all other modules. Its primary purpose is to centralize cross-cutting concerns like logging, storage, and data model definitions to ensure consistency and avoid code duplication.

## File Structure

```
0_common/
├── README.md           # This document.
├── index.ts            # Main entry point, exporting all shared components.
├── constants/
│   ├── index.ts        # Exports all constants.
│   └── errorMessages.ts# User-facing error messages.
├── types/
│   ├── index.ts        # Exports all type definitions and interfaces.
│   └── QuotaExceededError.ts # Custom error for quota-related issues.
└── utils/
    ├── logger.ts       # Configurable logging utility.
    ├── storageManager.ts # Manages data persistence via chrome.storage.
    ├── textTruncator.ts# UI utility for width-aware text truncation.
    ├── translationManager.ts # Placeholder for translation caching and history.
    ├── updateChecker.ts# Placeholder for extension version checks.
    └── version.ts      # Semantic version comparison helpers.
```

## Core Components

### 1. Constants (`constants/`)

This directory centralizes all static, unchanging values used across the application.

-   **`constants/index.ts`**: Defines and exports application metadata (`APP_NAME`, `APP_VERSION`), storage keys (`STORAGE_KEYS`), API endpoints, and default settings.
-   **`constants/errorMessages.ts`**: Contains a map of user-facing error messages for a consistent user experience.

### 2. Type Definitions (`types/`)

This directory contains the core TypeScript interfaces and types that define the data structures for the entire application, ensuring type safety and clear contracts between modules.

-   **`types/index.ts`**: Exports all major data structures, including:
    -   `TranslationContextData`: The shape of data sent for a translation request.
    -   Message Types (`TranslateRequestMessage`, `TranslateResponseMessage`, etc.): Defines the communication protocol between content scripts and the background service worker.
    -   `UserSettings`: The structure for user-configurable settings.
-   **`types/QuotaExceededError.ts`**: A custom error class thrown specifically when a translation or speech synthesis quota has been met.

### 3. Shared Utilities (`utils/`)

This directory provides a collection of reusable services and helper functions that encapsulate common functionalities.

-   **`utils/logger.ts`**: A singleton logger that provides prefixed, level-controlled logging (`debug`, `info`, `warn`, `error`) and can be disabled in production environments. Use `createLogger('module-name')` for module-specific logging.
-   **`utils/storageManager.ts`**: An abstraction layer over the `chrome.storage` API. It handles CRUD operations for user settings, manages a unique device UID, and caches cloud configuration.
-   **`utils/version.ts`**: Provides helper functions (`compareSemver`, `isLowerVersion`) for comparing semantic version strings, used by the update checker.
-   **`utils/textTruncator.ts`**: A utility for truncating strings to fit a specific pixel width, useful for dynamically rendering text in constrained UI elements.
