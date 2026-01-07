Last updated on: 2025-11-07

# 1_content: Content Script Module

## Module Overview

This module is the core of the extension that runs on web pages. It is responsible for detecting user text selections, displaying a translation icon, extracting the context of the selected text, and rendering the final translation in an unobtrusive floating card.

## File Structure

```
1_content/
├── README.md                       # This document
├── index.ts                        # Main entry point for the content script
├── constants/
│   ├── index.ts                    # Module constants exports
│   └── cssClasses.ts               # CSS class names for UI elements
├── handlers/
│   └── selectionHandler.ts         # Handles user interactions (selection, clicks)
├── resources/                      # Static resources (HTML templates, CSS)
│   ├── content.css                 # CSS for the translation icon and display card
│   ├── modal.css                   # CSS for the translation modal
│   ├── modal-error-fragment.html   # Error state template for fragments
│   ├── modal-error.html            # Error state template for words
│   ├── modal-loading-fragment.html # Loading state template for fragments
│   ├── modal-loading.html          # Loading state template for words
│   ├── modal-success-fragment.html # Success state template for fragments
│   ├── modal-success.html          # Success state template for words
│   ├── section-dictionary.html     # Dictionary section template
│   ├── section-original-sentence.html # Original sentence section template
│   └── section-sentence-fragment.html # Sentence section template for fragments
├── services/
│   └── translationRequest.ts       # Communicates with the background script for translation
├── ui/
│   ├── iconManager.ts              # Manages the translation icon's lifecycle
│   ├── modalTemplates.ts           # Loads and renders HTML templates for the modal
│   ├── translationDisplay.ts       # Manages the display of translation results
│   └── translationModal.ts         # Manages the translation detail modal
└── utils/
    ├── contextExtractorV2.ts       # Extracts sentence-level context around the selection
    ├── domSanitizer.ts             # Cleans DOM selections from extension's UI elements
    ├── languageDetector.ts         # Detects the source language of the selected text
    ├── lineHeightAdjuster.ts       # Dynamically adjusts line-height for better tooltip display
    ├── modalPositioner.ts          # Calculates optimal position for the translation modal
    ├── rangeAdjuster.ts            # Trims and expands selection ranges to word boundaries
    ├── selectionClassifier.ts      # Classifies selection as a word or fragment
    ├── styleCalculator.ts          # Calculates tooltip styles based on context
    └── translationOverlapDetector.ts # Detects and handles overlapping translations
```

## Core Components

### 1. Entry Point (`index.ts`)

- **`index.ts`**: Initializes the content script, setting up all necessary event listeners for user interactions like `dblclick`, `mouseup`, `mousedown`, and `scroll`. It orchestrates the functionality of the other components in this module.

### 2. Constants (`constants/`)

- **`cssClasses.ts`**: Defines all CSS class names used by the content script UI elements (icon, anchor, tooltip, modal). Centralized constant definitions ensure consistency across the module.

### 3. User Interaction (`handlers/`)

- **`selectionHandler.ts`**: This is the central hub for handling user actions.
  - It detects user selections and decides whether to show the translation icon or trigger an immediate translation (on double-click).
  - It uses `selectionClassifier` to distinguish between a single word and a text fragment and `rangeAdjuster` to refine the selection boundaries before requesting a translation.

### 4. UI Management (`ui/`)

- **`iconManager.ts`**: Manages the creation, positioning, and removal of the small translation icon that appears next to selected text.
- **`translationDisplay.ts`**: Responsible for rendering the translation results. It creates an underlined anchor for the selected text and displays a floating card (tooltip) with the translation. It handles different states (`loading`, `success`, `error`) and manages clicks on the anchor to open the detail modal.
- **`translationModal.ts`**: Manages the detailed translation modal that appears when a user clicks on a translated word. It displays comprehensive information like definitions and sentence context, and provides actions such as re-translating, deleting the annotation, and text-to-speech.
- **`modalTemplates.ts`**: Loads and renders the HTML content for the translation modal. It manages different templates for loading, success, and error states for both word and fragment translations, separating the view logic from the modal's state management.

### 5. Backend Communication (`services/`)

- **`translationRequest.ts`**: Contains functions (`requestTranslation`, `requestFragmentTranslation`) that send the extracted text and its context to the background script (`2_background`) for processing by the AI translation service.

### 6. Utilities (`utils/`)

- **`contextExtractorV2.ts`**: A sophisticated utility that analyzes the DOM around the selected text to extract the full sentence, as well as preceding and succeeding sentences. This provides crucial context to the AI for more accurate translations.
- **`domSanitizer.ts`**: Provides functions to filter out the extension's own UI elements from DOM operations, ensuring that text extraction doesn't accidentally include content from tooltips or icons.
- **`languageDetector.ts`**: A utility to detect the source language of the text, using `chrome.i18n.detectLanguage` with a fallback to a lightweight library.
- **`lineHeightAdjuster.ts`**: Dynamically adjusts the line-height of text blocks to ensure translation tooltips have adequate space without overlapping surrounding content.
- **`modalPositioner.ts`**: A helper class that computes the optimal position for the translation modal, ensuring it remains visible within the viewport.
- **`rangeAdjuster.ts`**: Provides functions to trim whitespace from the boundaries of a selection range and expand it to encompass full words.
- **`selectionClassifier.ts`**: An intelligent utility that classifies a selection as a "word" or a "fragment" and determines if the selection boundaries are complete.
- **`styleCalculator.ts`**: Calculates the optimal font size and color for the translation tooltip based on the styles of the original selected text.
- **`translationOverlapDetector.ts`**: A utility to detect when a new selection overlaps with an existing translation anchor, allowing for cleanup to prevent nested or duplicate translations.
