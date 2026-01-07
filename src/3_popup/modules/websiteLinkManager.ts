/**
 * Website Link Manager for Popup
 *
 * Handles loading the official website link and update notifications
 */

import * as i18nModule from "@/0_common/utils/i18n"
import * as loggerModule from "@/0_common/utils/logger"

const logger = loggerModule.createLogger("Popup/WebsiteLink")

/**
 * Load and set official website link from background service
 * If current version is lower than cloud version, show update notification with prominent color
 */
export async function loadWebsiteLink(): Promise<void> {
    try {
        logger.info("=== Loading Website Link (via background message) ===")

        const linkElement = document.getElementById("websiteLink") as HTMLAnchorElement
        if (!linkElement) {
            logger.error("Website link element not found!")
            return
        }

        // Ask background for bootstrap data
        const request = { type: "POPUP_BOOTSTRAP_REQUEST" as const }
        chrome.runtime.sendMessage(request, (response: any) => {
            if (!response || response.type !== "POPUP_BOOTSTRAP_RESPONSE" || !response.success) {
                logger.warn("Bootstrap response invalid:", response)
                // Fallback to default link text using i18n
                linkElement.innerHTML = `${i18nModule.translate("popup.websiteLink")} <span class="website-link-icon">→</span>`
                linkElement.classList.remove("update-available")
                return
            }

            const { websiteUrl, needsUpdate, currentVersion, cloudVersion } = response.data as {
                websiteUrl: string
                needsUpdate: boolean
                currentVersion: string
                cloudVersion: string
            }

            logger.info("Bootstrap data received:", { websiteUrl, needsUpdate, currentVersion, cloudVersion })

            const url = websiteUrl.startsWith("http") ? websiteUrl : `https://${websiteUrl}`
            linkElement.href = url
            logger.info("Link URL set to:", url)

            if (needsUpdate) {
                linkElement.innerHTML = `${i18nModule.translate("popup.websiteLink.updateAvailable")} <span class="website-link-icon update-icon">✨</span>`
                linkElement.classList.add("update-available")
                logger.info(`✅ UPDATE AVAILABLE - Setting text to "${i18nModule.translate("popup.websiteLink.updateAvailable")}"`)
            } else {
                linkElement.innerHTML = `${i18nModule.translate("popup.websiteLink")} <span class="website-link-icon">→</span>`
                linkElement.classList.remove("update-available")
                logger.info(`❌ NO UPDATE - Keeping text to ${i18nModule.translate("popup.websiteLink")}`)
            }

            logger.info("Final link text:", linkElement.textContent)
            logger.info("Final link classes:", linkElement.className)
        })
    } catch (error) {
        logger.error("Failed to load website link:", error)
        if (error instanceof Error) {
            logger.error("Error stack:", error.stack)
        }
    }
}
