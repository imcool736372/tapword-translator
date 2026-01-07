/**
 * Toast Manager for Popup
 *
 * Displays temporary notification messages in the popup.
 * Uses inline styles to avoid external CSS dependencies.
 */

import * as loggerModule from "@/0_common/utils/logger"

const logger = loggerModule.createLogger("Popup/Toast")

// Auto-dismiss duration in milliseconds
const TOAST_DURATION_MS = 3000

const DEFAULT_MAX_WIDTH_PX = 300
const POPUP_SAFE_MARGIN_PX = 32
const TOAST_SINGLE_LINE_THRESHOLD_PX = 36

// Currently active toast element
let activeToast: HTMLElement | null = null

// Auto-dismiss timer
let dismissTimer: number | null = null

/** Toast type */
export type ToastType = "info" | "success" | "warning"

/** Toast options for customization */
export interface ToastOptions {
    /** Toast type: 'info' | 'success' | 'warning' (defaults to 'info') */
    type?: ToastType
    /** Maximum width in pixels (defaults to 320, should be slightly smaller than popup width) */
    maxWidth?: number
}

/**
 * Show a toast notification message in the popup
 *
 * @param message - The message to display
 * @param typeOrOptions - Toast type string or options object (for backward compatibility)
 */
export function showToast(message: string, typeOrOptions: ToastType | ToastOptions = {}): void {
    // Normalize parameters for backward compatibility
    const options: ToastOptions = typeof typeOrOptions === "string"
        ? { type: typeOrOptions }
        : typeOrOptions
    const { type = "info", maxWidth = DEFAULT_MAX_WIDTH_PX } = options

    try {
        // Remove any existing toast first
        if (activeToast) {
            removeToast()
        }

        // Create toast element
        const toast = document.createElement("div")
        toast.textContent = message

        // Apply inline styles for toast - initial hidden state (above viewport)
        const baseStyles: Partial<CSSStyleDeclaration> = {
            position: "fixed",
            top: "12px",
            left: "50%",
            transform: "translateX(-50%) translateY(-100%)",
            zIndex: "10000",
            padding: "8px 16px",
            borderRadius: "16px",
            fontFamily: "-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif",
            fontSize: "12px",
            fontWeight: "500",
            lineHeight: "1.4",
            boxShadow: "0 4px 12px rgba(0, 0, 0, 0.15)",
            opacity: "0",
            transition: "opacity 0.2s ease, transform 0.3s cubic-bezier(0.34, 1.56, 0.64, 1)",
            pointerEvents: "none",
            userSelect: "none",
            textAlign: "left",
            whiteSpace: "normal",
            wordBreak: "break-word",
            boxSizing: "border-box",
            maxWidth: `${maxWidth}px`,
        }

        // Type-specific colors
        const typeColors: Record<"info" | "success" | "warning", { background: string; color: string }> = {
            info: { background: "linear-gradient(135deg, #007AFF 0%, #0A84FF 100%)", color: "white" },
            success: { background: "linear-gradient(135deg, #34C759 0%, #30D158 100%)", color: "white" },
            warning: { background: "linear-gradient(135deg, #FF9500 0%, #FFCC00 100%)", color: "#1a1a1a" },
        }

        const colors = typeColors[type]
        Object.assign(toast.style, baseStyles, {
            background: colors.background,
            color: colors.color,
        })

        // Add to document body
        document.body.appendChild(toast)
        activeToast = toast

        const viewportWidth = document.body?.clientWidth ?? window.innerWidth ?? 0
        const availableWidth = viewportWidth > 0
            ? Math.max(0, viewportWidth - POPUP_SAFE_MARGIN_PX)
            : maxWidth
        const resolvedWidth = Math.min(maxWidth, availableWidth || maxWidth)

        const naturalWidth = toast.scrollWidth
        const naturalHeight = toast.scrollHeight

        toast.style.width = `${resolvedWidth}px`

        const isSingleLine = naturalHeight <= TOAST_SINGLE_LINE_THRESHOLD_PX
        const canShrink = naturalWidth <= resolvedWidth
        if (isSingleLine && canShrink) {
            toast.style.width = "fit-content"
        }

        // Trigger slide-down animation after a brief delay (two frames for reliable animation)
        requestAnimationFrame(() => {
            requestAnimationFrame(() => {
                toast.style.opacity = "1"
                toast.style.transform = "translateX(-50%) translateY(0)"
            })
        })

        // Auto-dismiss after duration
        dismissTimer = window.setTimeout(() => {
            removeToast()
        }, TOAST_DURATION_MS)

        logger.info("Toast shown:", message, type)
    } catch (error) {
        logger.error("Error showing toast:", error)
    }
}

/**
 * Manually remove the current toast notification
 */
export function removeToast(): void {
    if (!activeToast) {
        return
    }

    // Clear auto-dismiss timer
    if (dismissTimer) {
        clearTimeout(dismissTimer)
        dismissTimer = null
    }

    const toastToRemove = activeToast
    activeToast = null

    // Trigger slide-up animation (back to hidden state)
    toastToRemove.style.opacity = "0"
    toastToRemove.style.transform = "translateX(-50%) translateY(-100%)"

    // Remove from DOM after animation completes
    setTimeout(() => {
        try {
            toastToRemove.remove()
        } catch (error) {
            logger.warn("Error removing toast element:", error)
        }
    }, 300)
}
