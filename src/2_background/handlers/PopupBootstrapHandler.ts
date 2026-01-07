/**
 * Popup Bootstrap Handler
 *
 * Provides aggregated initialization data for the popup UI via a single message.
 */
import type { PopupBootstrapResponseMessage } from "@/0_common/types"
import * as loggerModule from "@/0_common/utils/logger"
import { isLowerVersion } from "@/0_common/utils/version"
import { getConfigService } from "@/5_backend"

const logger = loggerModule.createLogger("PopupBootstrapHandler")

export function buildPopupBootstrapResponse(): PopupBootstrapResponseMessage {
    const configService = getConfigService()
    const config = configService.getConfig()
    const websiteUrl = config.websiteUrl
    const cloudVersion = config.chromeExtensionVersion
    const currentVersion = chrome.runtime.getManifest().version
    const needsUpdate = isLowerVersion(currentVersion, cloudVersion)

    logger.info("Building popup bootstrap payload", {
        websiteUrl,
        cloudVersion,
        currentVersion,
        needsUpdate,
    })

    return {
        type: "POPUP_BOOTSTRAP_RESPONSE",
        success: true,
        data: {
            websiteUrl,
            cloudVersion,
            currentVersion,
            needsUpdate,
        },
    }
}
