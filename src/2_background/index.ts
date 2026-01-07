/**
 * Background Script - Service Worker
 *
 * Main entry point for the extension's background script.
 * Responsible for initialization and setup only.
 *
 * Responsibilities:
 * 1. Initialize backend services (API client, storage, etc.)
 * 2. Setup message listeners for content script communication
 * 3. Register extension lifecycle event handlers
 * 4. Coordinate between different modules
 *
 * Note: Business logic is delegated to specialized handlers and services.
 */

import * as loggerModule from "@/0_common/utils/logger"
import * as MessageRouter from "./messaging/MessageRouter"
import * as ServiceInitializer from "./services/ServiceInitializer"

const logger = loggerModule.createLogger("background")

logger.info("Background script loading...")

// ============================================================================
// Initialization
// ============================================================================

/**
 * Initialize all services required by the extension
 */
async function initialize(): Promise<void> {
    // Register message listener ASAP to avoid first-message race on cold start
    logger.info("[INIT_DEBUG] Registering message listener early")
    MessageRouter.setupMessageListener()

    logger.info("[INIT_DEBUG] Starting services initialization")
    await ServiceInitializer.initializeServices()
    logger.info("[INIT_DEBUG] Services initialization finished")

    logger.info("Background script loaded successfully")
}

// Start initialization
initialize().catch((error) => {
    logger.error("Failed to initialize background script:", error)
})

// ============================================================================
// Extension Lifecycle Events
// ============================================================================

/**
 * Extension installation/update handler
 */
chrome.runtime.onInstalled.addListener(() => {
    logger.info("Extension installed or updated")
    // TODO: Add migration logic if needed
})
