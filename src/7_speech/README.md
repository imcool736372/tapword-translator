Last updated on: 2025-10-30

# 7_speech: Text-to-Speech Synthesis

## Module Overview

This module is responsible for converting text into audible speech by interfacing with a backend speech synthesis API. It includes a caching mechanism to optimize performance and reduce redundant API calls for frequently requested text.

## File Structure

```
7_speech/
├── README.md
├── index.ts
├── constants/
│   └── SpeechConstants.ts      # Defines API endpoints for the speech service.
├── services/
│   ├── SpeechService.ts        # Contains the core logic for speech synthesis.
│   └── VoiceCacheService.ts    # Implements in-memory caching for synthesized audio.
└── types/
    ├── SpeechApiTypes.ts       # TypeScript types for the backend API request/response.
    └── SpeechModels.ts         # Core data models for use within the module.
```

## Core Components

### 1. Business Logic (`services/`)

-   **`services/SpeechService.ts`**: This is the primary service that exposes the `synthesizeSpeech` function. It first checks a local cache for the requested text. If a cached version is not found, it sends a request to the backend API to generate the audio, which is then cached for future use.
-   **`services/VoiceCacheService.ts`**: Provides a simple in-memory caching layer for the `SpeechService`. It stores base64-encoded audio data with a FIFO (First-In, First-Out) eviction policy to manage memory usage.

### 2. Constants (`constants/`)

-   **`constants/SpeechConstants.ts`**: This file contains constants for the module, specifically the API endpoint path for the speech synthesis service.

### 3. Data Types (`types/`)

-   **`types/SpeechApiTypes.ts`**: Defines the TypeScript interfaces for the request and response payloads of the backend speech synthesis API. This ensures type safety when communicating with the server.
-   **`types/SpeechModels.ts`**: Contains the internal data models used by the module's services, such as the parameters required for the `synthesizeSpeech` function and the structure of the result it returns.
