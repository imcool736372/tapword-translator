Last updated on: 2026-01-07

# Static Resources

This directory stores all static assets required for the TapWord Translator extension's functionality and presentation.

## Directory Structure

```
resources/
├── 8_generate/     # AI prompt templates for text generation
├── icons/          # Extension icons for different display contexts
└── public/         # Publicly accessible assets
```

---

### `8_generate`

This directory contains the prompt templates used by the AI generation module (`src/8_generate`). These prompts are crucial for guiding the language models to produce accurate and contextually relevant translations.

- **`fragment_translation/`**: Contains prompts for translating a text fragment while considering the surrounding text as context. This is the standard, high-quality translation mode.
  - `system_prompt.txt`: The base instruction that sets the persona and task for the AI.
  - `user_prompt_template.txt`: The template for the user's query, which includes placeholders for the selected text and surrounding context.
  - Subdirectories (e.g., `de/`, `es/`, `zh/`): Contain language-specific variations or examples for the prompts, if any.

- **`fragment_translation_only/`**: Contains prompts for translating a text fragment without any surrounding context.
  - `system_prompt.txt`: System prompt for context-less fragment translation.
  - `user_prompt_template.txt`: User prompt template for context-less fragment translation.

- **`word_translation/`**: Contains prompts specifically designed for translating a single word.
  - `system_prompt.txt`: System prompt for single-word translation.
  - `user_prompt_template.txt`: User prompt template for single-word translation.
  - Subdirectories (e.g., `en/`, `zh/`): Language-specific prompt variations.

### `icons`

This directory holds the official icons for the browser extension, which are displayed in various parts of the browser UI, such as the toolbar and the extensions management page.

- **`icon-16.png`**: A 16x16 pixel icon, typically used as the favicon or in dense toolbar menus.
- **`icon-48.png`**: A 48x48 pixel icon, used on the extensions management page (`chrome://extensions`).
- **`icon-128.png`**: A 128x128 pixel icon, required for the Chrome Web Store listing and for installation prompts.

### `public`

This directory contains any static assets that are made publicly available, for example, in the project's main `README.md` or for promotional purposes.

- **`demo.gif`**: An animated GIF demonstrating the extension's features and user flow.
