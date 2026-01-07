Last updated on: 2026-01-02

# 8_generate: Local LLM-based Translation Generation

## Module Overview

This module provides direct LLM-based translation generation by assembling prompts locally and calling LLM APIs directly, without relying on cloud backend translation APIs. It enables users to configure their own API keys and URLs for various LLM providers (OpenAI, Qwen, Gemini, etc.), offering flexibility and privacy.

## File Structure

```
8_generate/
├── README.md                           # This document
├── index.ts                            # Main entry point, exports public members
├── constants/
│   └── GenerateConstants.ts            # Default configurations and model settings
├── services/
│   ├── WordTranslationService.ts       # Orchestrates word translation logic (class-based)
│   └── llm/
│       └── OpenAICompatibleClient.ts   # OpenAI-compatible LLM API client
├── types/
│   └── GenerateTypes.ts                # TypeScript types for requests, responses, and configs
└── utils/
    ├── promptLoader.ts                 # Loads prompt templates from resources
    └── templateRenderer.ts             # Renders prompt templates with variables
```

Prompt assets:
```
resources/8_generate/word_translation/
├── system_prompt.txt                   # System prompt for word translation
├── user_prompt_template.txt            # User prompt template with placeholders
└── en/
    └── fewshot.json                    # Few-shot examples (English)
```

## Core Components

### 1. Business Logic (`services/`)

- **`services/WordTranslationService.ts`**: Main service class for word translation
  - Pre-initializes system prompts and user prompt templates
  - Manages OpenAI-compatible LLM client instance
  - Builds messages with system prompt, few-shot examples, and user prompt
  - Parses and validates JSON response
  - Returns structured translation result
  - Provides both class-based and convenience function APIs

- **`services/llm/OpenAICompatibleClient.ts`**: Generic OpenAI-compatible LLM client
  - Supports multiple providers (OpenAI, Qwen, Gemini, etc.)
  - Enforces JSON response format
  - Handles timeouts, rate limits, and errors
  - Maps provider errors to application errors

### 2. Data Types (`types/`)

- **`types/GenerateTypes.ts`**:
  - `WordTranslationRequest`: Input parameters for word translation (word, context, languages)
  - `WordTranslationResult`: Structured output (word translation, fragment translation)
  - `LLMConfig`: Configuration for LLM provider (apiKey, baseUrl, model, etc.)
  - `ChatMessage`: Message format for LLM API calls

### 3. Utilities (`utils/`)

- **`utils/promptLoader.ts`**: Loads prompt templates and few-shot examples
  - Caches loaded prompts for performance
  - Supports language-specific few-shot examples with fallback to English
  - Validates prompt file existence

- **`utils/templateRenderer.ts`**: Renders prompt templates
  - Substitutes variables in template placeholders (${variable})
  - Normalizes whitespace and formatting
  - Simple and straightforward - all section building done in service layer

### 4. Constants (`constants/`)

- **`constants/GenerateConstants.ts`**:
  - Default model configurations (temperature, max tokens, timeout)
  - Model name mappings
  - Prompt file paths

### 5. Module Entry Point (`index.ts`)

- Serves as the public API for the module
- Explicitly exports core functions and types
- Provides clean interface for other modules to consume

## Usage Example

```typescript
import * as generateModule from '@/8_generate';

// Configure LLM provider (example with OpenAI)
const config: generateModule.LLMConfig = {
    apiKey: 'sk-xxx...', // User's API key
    baseUrl: 'https://api.openai.com/v1',
    model: 'gpt-4',
    temperature: 0.35,
    maxTokens: 1200,
    timeout: 10000
};

// Option 1: One-off translation (convenience function)
const result1 = await generateModule.translateWord({
    word: 'light',
    sourceLanguage: 'en',
    targetLanguage: 'zh'
}, config);

console.log(result1.wordTranslation); // "光"

// Option 2: Reusable service instance (recommended for multiple translations)
const service = await generateModule.createWordTranslationService(config);

// Translate multiple words with the same service
const result2 = await service.translateWord({
    word: 'light',
    leadingText: 'The room was filled with natural ',
    trailingText: ' from the large windows.',
    sourceLanguage: 'en',
    targetLanguage: 'zh',
});

console.log(result2.wordTranslation);      // "光线"
console.log(result2.fragmentTranslation);  // "房间里充满了来自大窗户的自然光线。"

// Option 3: Manual service instantiation (for advanced control)
const manualService = new generateModule.WordTranslationService(config);
await manualService.initialize();

const result3 = await manualService.translateWord({
    word: 'light',
    leadingText: 'The room was filled with natural ',
    trailingText: ' from the large windows.',
    sourceLanguage: 'en',
    targetLanguage: 'zh',
    contextInfo: {
        previousSentences: ['He opened the curtains.'],
        nextSentences: ['It made the space feel warm and inviting.'],
        sourceTitle: 'Harry Potter and the Philosopher\'s Stone',
        sourceAuthor: 'J.K. Rowling',
        sourceType: 'book'
    }
});

console.log(result3.wordTranslation);      // "光线"
console.log(result3.fragmentTranslation);  // "房间里充满了来自大窗户的自然光线。"

// Example with different LLM providers (Qwen)
const qwenConfig: generateModule.LLMConfig = {
    apiKey: 'your-qwen-api-key',
    baseUrl: 'https://dashscope.aliyuncs.com/compatible-mode/v1',
    model: 'qwen-max',
    temperature: 0.35,
    maxTokens: 1200,
    timeout: 10000
};

const qwenService = await generateModule.createWordTranslationService(qwenConfig);

const result4 = await qwenService.translateWord({
    word: '光',
    leadingText: '房间里充满了来自大窗户的自然',
    trailingText: '。',
    sourceLanguage: 'zh',
    targetLanguage: 'en'
});

console.log(result4.wordTranslation);      // "light"
console.log(result4.fragmentTranslation);  // "The room was filled with natural light from the large windows."
```

## Development Notes

- **Import Style**: Always use `@/` prefix for absolute imports
- **Namespace Imports**: Use `import * as module from '...'` for functions and variables
- **Error Handling**: All LLM API errors are mapped to application-level errors
- **Prompt Files**: Must be placed in `resources/8_generate/` directory
- **Testing**: Do not run tests unless explicitly requested

## Future Extensions

This module is designed to be extensible:
- Fragment translation (multi-word/phrase translation)
- Sentence translation
- Example sentence generation
- Dictionary summarization
