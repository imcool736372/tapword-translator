/**
 * Settings Manager for Popup
 *
 * Handles loading, saving, and updating user settings
 */

import type * as types from "@/0_common/types"
import * as i18nModule from "@/0_common/utils/i18n"
import * as loggerModule from "@/0_common/utils/logger"
import * as storageManagerModule from "@/0_common/utils/storageManager"
import * as toastManagerModule from "./toastManager"

const logger = loggerModule.createLogger("Popup/Settings")

function setTranslationControlsEnabled(enabled: boolean): void {
    const dependentIds = ["showIcon", "doubleClickTranslate"]

    dependentIds.forEach((id) => {
        const input = document.getElementById(id) as HTMLInputElement | null
        if (!input) {
            return
        }

        input.disabled = !enabled

        const settingItem = input.closest(".setting-item")
        if (settingItem) {
            settingItem.classList.toggle("is-disabled", !enabled)
        }
    })
}

async function restoreDependentTogglesIfAllOff(): Promise<void> {
    const showIconInput = document.getElementById("showIcon") as HTMLInputElement | null
    const doubleClickInput = document.getElementById("doubleClickTranslate") as HTMLInputElement | null

    if (!showIconInput || !doubleClickInput) {
        return
    }

    const bothDisabled = !showIconInput.checked && !doubleClickInput.checked
    if (!bothDisabled) {
        return
    }

    showIconInput.checked = true
    doubleClickInput.checked = true

    // Atomic update to avoid concurrent overwrite between the two toggles
    await storageManagerModule.updateUserSettings({
        showIcon: true,
        doubleClickTranslate: true,
    })
}

/**
 * Load and display current settings from storage
 */
export async function loadSettings(): Promise<void> {
    try {
        const settings = await storageManagerModule.getUserSettings()
        logger.info("Loaded settings:", settings)

        // Update all checkboxes
        const checkboxes = document.querySelectorAll('input[type="checkbox"][data-setting]')
        checkboxes.forEach((checkbox) => {
            const input = checkbox as HTMLInputElement
            const settingKey = input.dataset.setting as keyof types.UserSettings
            if (settingKey && settingKey in settings) {
                input.checked = settings[settingKey] as boolean
            }
        })

        // Update select elements
        const selects = document.querySelectorAll("select[data-setting]")
        selects.forEach((select) => {
            const selectElement = select as HTMLSelectElement
            const settingKey = selectElement.dataset.setting as keyof types.UserSettings
            if (settingKey && settingKey in settings) {
                // Convert to string for select value assignment
                selectElement.value = String(settings[settingKey])
            }
        })

        // Apply master toggle effect to dependent controls
        setTranslationControlsEnabled(settings.enableTapWord)
    } catch (error) {
        logger.error("Failed to load settings:", error)
    }
}

/**
 * Save a single setting change to storage
 */
export async function saveSetting(settingKey: keyof types.UserSettings, value: boolean | string | number): Promise<void> {
    try {
        await storageManagerModule.updateUserSettings({
            [settingKey]: value,
        })
        logger.info(`Setting ${settingKey} updated to ${value}`)
    } catch (error) {
        logger.error(`Failed to save setting ${settingKey}:`, error)
    }
}

/**
 * Set up change listeners for all setting controls (checkboxes and selects)
 */
export function setupSettingChangeListeners(): void {
    // Add change listeners to all checkboxes
    const checkboxes = document.querySelectorAll('input[type="checkbox"][data-setting]')
    checkboxes.forEach((checkbox) => {
        checkbox.addEventListener("change", async (event) => {
            const input = event.target as HTMLInputElement
            const settingKey = input.dataset.setting as keyof types.UserSettings
            if (settingKey) {
                await saveSetting(settingKey, input.checked)

                if (settingKey === "enableTapWord") {
                    setTranslationControlsEnabled(input.checked)
                    if (input.checked) {
                        await restoreDependentTogglesIfAllOff()
                    }
                }
            }
        })
    })

    // Add change listeners to all select elements
    const selects = document.querySelectorAll("select[data-setting]")
    selects.forEach((select) => {
        select.addEventListener("change", async (event) => {
            const selectElement = event.target as HTMLSelectElement
            const settingKey = selectElement.dataset.setting as keyof types.UserSettings
            if (settingKey) {
                const value = selectElement.value
                await saveSetting(settingKey, value)

                // Show refresh reminder toast for translation font size preset change
                if (settingKey === "translationFontSizePreset") {
                    const message = i18nModule.translate("popup.refreshReminder")
                    toastManagerModule.showToast(message, "info")
                }
            }
        })
    })
}
