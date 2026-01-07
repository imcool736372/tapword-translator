Last updated on: 2026-01-07

# 8_generate: Local LLM-based Translation Generation

## Module Overview

This module provides direct LLM-based translation generation by assembling prompts locally and calling LLM APIs directly, without relying on a cloud backend. It enables users to configure their own API keys and URLs for various LLM providers (OpenAI, Qwen, Gemini, etc.), offering flexibility and privacy.

It supports both word-level and fragment-level translation with rich context analysis.

## File Structure

```
8_generate/
├── README.md                           # This document
├── index.ts                            # Main entry point, exports public members
├── constants/
│   └── GenerateConstants.ts            # Default configurations and model settings
├── services/
│   ├── FragmentTranslationService.ts   # Orchestrates fragment/phrase translation logic
│   ├── WordTranslationService.ts       # Orchestrates single-word translation logic
│   └── llm/
│       └── OpenAICompatibleClient.ts   # Generic OpenAI-compatible LLM API client
├── types/
│   └── GenerateTypes.ts                # TypeScript types for requests, responses, and configs
└── utils/
    ├── languageUtils.ts                # Language name and code utilities
    ├── promptLoader.ts                 # Loads prompt templates from resources
    └── templateRenderer.ts             # Renders prompt templates with variables
```

Prompt assets:
```
resources/8_generate/
├── fragment_translation/
│   ├── system_prompt.txt
│   └── user_prompt_template.txt
├── fragment_translation_only/
│   ├── system_prompt.txt
│   └── user_prompt_template.txt
└── word_translation/
    ├── system_prompt.txt
    ├── user_prompt_template.txt
    └── en/
        └── fewshot.json
```

## Core Components

### 1. Business Logic (`services/`)

- **`services/WordTranslationService.ts`**: Main service class for **single-word** translation.
  - Initializes prompts and the LLM client.
  - Constructs detailed user prompts including context, sentence structure, and metadata.
  - Loads language-specific few-shot examples to improve accuracy.
  - Parses the structured JSON response from the LLM.

- **`services/FragmentTranslationService.ts`**: A dedicated service for translating **multi-word fragments or phrases**.
  - Handles two scenarios: translating a fragment within a full sentence, or translating a fragment in isolation.
  - Dynamically selects the appropriate prompt (`fragment_translation` vs. `fragment_translation_only`) based on whether the surrounding sentence is provided.
  - Builds user prompts with contextual information.

- **`services/llm/OpenAICompatibleClient.ts`**: A generic client for interacting with any LLM that follows the OpenAI API signature.
  - Enforces JSON output from the model.
  - Manages API calls, including timeouts and error handling.
  - Maps provider-specific errors to standardized application errors.

### 2. Data Types (`types/`)

- **`types/GenerateTypes.ts`**: Contains all TypeScript type definitions for the module.
  - `LLMConfig`: Configuration for the LLM provider (apiKey, baseUrl, model).
  - `WordTranslationRequest`, `WordTranslationResult`: Input and output for word translation.
  - `FragmentTranslationRequest`, `FragmentTranslationResult`: Input and output for fragment translation.
  - `ChatMessage`: The message structure for LLM API calls.

### 3. Utilities (`utils/`)

- **`utils/promptLoader.ts`**: Loads and caches prompt content (system prompts, user templates, few-shot examples) from the `resources/` directory.
- **`utils/templateRenderer.ts`**: A simple utility to substitute variables in prompt templates.
- **`utils/languageUtils.ts`**: Provides helper functions to convert language codes (e.g., `en`, `zh-CN`) into full, human-readable names (e.g., "English", "Chinese").

### 4. Constants (`constants/`)

- **`constants/GenerateConstants.ts`**: Defines default model parameters (temperature, max tokens), task names, and paths to prompt files.

### 5. Module Entry Point (`index.ts`)

- Serves as the public API for the `8_generate` module.
- Exports all necessary services, types, and constants for external consumption, including:
  - `WordTranslationService`, `createWordTranslationService`, `translateWord`
  - `FragmentTranslationService`, `createFragmentTranslationService`, `translateFragment`
  - `LLMConfig`, `WordTranslationRequest`, `FragmentTranslationRequest`, etc.

## Usage Example

### Word Translation

```typescript
import * as generateModule from '@/8_generate';

// 1. Configure LLM provider
const config: generateModule.LLMConfig = {
    apiKey: 'sk-xxx...',
    baseUrl: 'https://api.openai.com/v1',
    model: 'gpt-4',
};

// 2. Translate a word using the convenience function
const result = await generateModule.translateWord({
    word: 'light',
    leadingText: 'The room was filled with natural ',
    trailingText: ' from the large windows.',
    sourceLanguage: 'en',
    targetLanguage: 'zh',
}, config);

console.log(result.wordTranslation);      // "光线"
console.log(result.fragmentTranslation);  // "房间里充满了来自大窗户的自然光线。"
```

### Fragment (Phrase) Translation

```typescript
import * as generateModule from '@/8_generate';

const config: generateModule.LLMConfig = {
    apiKey: 'sk-xxx...',
    baseUrl: 'https://api.openai.com/v1',
    model: 'gpt-4',
};

// Use the dedicated fragment translation function
const fragmentResult = await generateModule.translateFragment({
    fragment: 'filled with natural light',
    leadingText: 'The room was ',
    trailingText: ' from the large windows.',
    sourceLanguage: 'en',
    targetLanguage: 'fr',
}, config);

console.log(fragmentResult.translation);            // "remplie de lumière naturelle"
console.log(fragmentResult.sentenceTranslation);    // "La pièce était remplie de lumière naturelle provenant des grandes fenêtres."
```

## Development Notes

- **Import Style**: Always use the `@/` prefix for absolute imports (`import * as module from '@/path/to/module'`).
- **Error Handling**: All LLM API errors are mapped to application-level errors for consistent handling.
- **Prompt Files**: All prompt-related text files are stored in `resources/8_generate/`.