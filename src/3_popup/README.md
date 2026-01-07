Last updated on: 2025-11-07

# 3_popup: Extension Settings Popup

## Module Overview

This module implements the extension's popup interface that appears when users click the extension icon in their browser toolbar. It provides a clean, user-friendly settings panel for configuring translation behavior.

## File Structure

```
3_popup/
├── README.md                       # This document
├── index.html                      # Popup HTML structure
├── index.ts                        # Main popup logic and event handlers
└── styles/
    └── popup.css                   # Popup styles matching modal design
```

## Features

The popup provides four toggle settings:

1. **Show Translation Icon** (`showIcon`)
   - Controls whether the translation icon appears when text is selected
   - Default: `true`

2. **Double-Click Translation** (`doubleClickTranslate`)
   - Enables translation of single words via double-click
   - Default: `true`

3. **Auto-Adjust Line Height** (`autoAdjustHeight`)
   - Automatically adjusts text spacing for better translation display
   - Default: `true`

4. **Auto-Play Pronunciation** (`autoPlayAudio`)
   - Automatically plays audio pronunciation when words are translated
   - Default: `false`

## Design

The popup follows the same design language as the translation modal:

- **Color Scheme**: Uses the same CSS variables (`--popup-primary-color`, `--popup-accent-color`, etc.)
- **Typography**: Consistent font families (Inter, PingFang SC) and sizes
- **Components**: Clean toggle switches with smooth animations
- **Feedback**: Status messages for user actions with auto-hide

## Implementation Details

### Settings Storage

Settings are stored using Chrome's `chrome.storage.sync` API, which synchronizes across the user's Chrome browsers when signed in. The storage is managed through `@/0_common/utils/storageManager`.

### State Management

1. **Load**: On popup open, current settings are loaded from storage
2. **Update**: When a toggle is changed, the setting is immediately saved
3. **Reset**: Reset button restores all settings to default values
4. **Feedback**: Visual confirmation via status messages

### Key Functions

- `loadSettings()`: Loads current settings and updates UI
- `saveSetting()`: Saves individual setting changes
- `resetSettings()`: Resets all settings to defaults
- `showStatus()`: Displays temporary status messages

## Usage

The popup automatically initializes when opened. No user action is required beyond interacting with the toggles and reset button.

### For Future Development

To read these settings in the `1_content` module:

```typescript
import * as storageManagerModule from '@/0_common/utils/storageManager'

// Get current settings
const settings = await storageManagerModule.getUserSettings()

// Use settings
if (settings.showIcon) {
    // Show translation icon
}

if (settings.doubleClickTranslate) {
    // Enable double-click translation
}

// Listen for setting changes
chrome.storage.onChanged.addListener((changes, area) => {
    if (area === 'sync' && changes.userSettings) {
        const newSettings = changes.userSettings.newValue
        // Update behavior based on new settings
    }
})
```

## Coding Conventions

- **Import Style**: Uses namespace imports with `@/` prefix
- **Logging**: Uses `createLogger('Popup')` for consistent logging
- **Error Handling**: All async operations include try-catch blocks
- **Type Safety**: Full TypeScript typing with `types.UserSettings`
