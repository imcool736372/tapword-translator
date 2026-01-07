/**
 * Common Module Index
 *
 * Shared utilities, types, and constants used across the extension
 */

// Logger
export { configureLogger, createLogger, log } from "./utils/logger"
export type { LogLevel, LoggerConfig } from "./utils/logger"

// Storage Manager
export { getUserSettings, resetUserSettings, saveUserSettings, updateUserSettings } from "./utils/storageManager"

// Version utils
export { compareSemver, isLowerVersion } from "./utils/version"

// i18n (Internationalization)
export {
    applyTranslations,
    getCurrentLocale,
    initI18n,
    isLocaleSupported,
    setLocale,
    SUPPORTED_LOCALES,
    translate,
    translateTemplate,
} from "./utils/i18n"
export type { LocaleCode, LocaleMessages } from "./utils/i18n"

// Types
export type * from "./types"
export { DEFAULT_USER_SETTINGS } from "./types"

// Constants
export * from "./constants"
