/**
 * Version Status Utility
 *
 * Provides cached version check results to avoid frequent requests to background.
 * Cache duration: 30 minutes
 */

import * as loggerModule from "@/0_common/utils/logger"

const logger = loggerModule.createLogger("versionStatus")

// Cache key in chrome.storage.local
const CACHE_KEY = "versionStatusCache"

// Cache duration in milliseconds (30 minutes)
const CACHE_DURATION_MS = 30 * 60 * 1000

/**
 * Version status data
 */
export interface VersionStatus {
    needsUpdate: boolean
    currentVersion: string
    cloudVersion: string
    websiteUrl: string
    timestamp: number
}

/**
 * Get version status with 30-minute cache
 *
 * @returns Promise<VersionStatus | null> Version status or null if unavailable
 */
export async function getVersionStatus(): Promise<VersionStatus | null> {
    try {
        // Try to get cached data first
        const cached = await getCachedVersionStatus()
        if (cached) {
            logger.info("Using cached version status:", cached)
            return cached
        }

        // Cache miss or expired, fetch from background
        logger.info("Cache miss, fetching version status from background")
        const status = await fetchVersionStatusFromBackground()

        if (status) {
            // Cache the result
            await cacheVersionStatus(status)
            logger.info("Fetched and cached version status:", status)
            return status
        }

        return null
    } catch (error) {
        logger.error("Error getting version status:", error)
        return null
    }
}

/**
 * Get cached version status if valid
 */
async function getCachedVersionStatus(): Promise<VersionStatus | null> {
    try {
        const result = await chrome.storage.local.get(CACHE_KEY)
        const cached = result[CACHE_KEY] as VersionStatus | undefined

        if (!cached) {
            return null
        }

        // Check if cache is still valid (within 30 minutes)
        const now = Date.now()
        const age = now - cached.timestamp

        if (age < CACHE_DURATION_MS) {
            return cached
        }

        // Cache expired
        logger.info("Cache expired, age:", age, "ms")
        return null
    } catch (error) {
        logger.error("Error reading cached version status:", error)
        return null
    }
}

/**
 * Cache version status to chrome.storage.local
 */
async function cacheVersionStatus(status: VersionStatus): Promise<void> {
    try {
        await chrome.storage.local.set({
            [CACHE_KEY]: {
                ...status,
                timestamp: Date.now(),
            },
        })
    } catch (error) {
        logger.error("Error caching version status:", error)
    }
}

/**
 * Fetch version status from background script
 */
async function fetchVersionStatusFromBackground(): Promise<VersionStatus | null> {
    return new Promise((resolve) => {
        try {
            const request = { type: "POPUP_BOOTSTRAP_REQUEST" as const }
            chrome.runtime.sendMessage(request, (response: any) => {
                if (!response || response.type !== "POPUP_BOOTSTRAP_RESPONSE" || !response.success) {
                    logger.warn("Bootstrap response invalid:", response)
                    resolve(null)
                    return
                }

                const { websiteUrl, needsUpdate, currentVersion, cloudVersion } = response.data as {
                    websiteUrl: string
                    needsUpdate: boolean
                    currentVersion: string
                    cloudVersion: string
                }

                resolve({
                    needsUpdate,
                    currentVersion,
                    cloudVersion,
                    websiteUrl,
                    timestamp: Date.now(),
                })
            })
        } catch (error) {
            logger.error("Error fetching version status from background:", error)
            resolve(null)
        }
    })
}

/**
 * Clear version status cache (useful for testing)
 */
export async function clearVersionStatusCache(): Promise<void> {
    try {
        await chrome.storage.local.remove(CACHE_KEY)
        logger.info("Version status cache cleared")
    } catch (error) {
        logger.error("Error clearing version status cache:", error)
    }
}
