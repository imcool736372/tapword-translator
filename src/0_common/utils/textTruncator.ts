/**
 * Text Truncator Utility
 *
 * Provides width-aware truncation with a configurable ellipsis using
 * Canvas text measurement and the element's computed font.
 */

// Cache a shared canvas for measurements
let __measureCanvas: HTMLCanvasElement | null = null

function getMeasureContext(): CanvasRenderingContext2D | null {
    if (!__measureCanvas) {
        __measureCanvas = document.createElement("canvas")
    }
    const ctx = __measureCanvas.getContext("2d")
    return ctx
}

/**
 * Build a CSS font shorthand string from an element's computed styles.
 */
export function getFontShorthandFromElement(element: HTMLElement): string {
    const cs = window.getComputedStyle(element)
    const shorthand = (cs as any).font as string | undefined
    if (shorthand && typeof shorthand === "string" && shorthand.trim().length > 0) {
        return shorthand
    }
    const style = cs.fontStyle || "normal"
    const variant = cs.fontVariant || "normal"
    const weight = cs.fontWeight || "400"
    const size = cs.fontSize || "16px"
    const family = cs.fontFamily || "sans-serif"
    return `${style} ${variant} ${weight} ${size} ${family}`
}

/**
 * Measure the width of text using a given CSS font string.
 */
export function measureTextWidth(text: string, font: string): number {
    const ctx = getMeasureContext()
    if (!ctx) return text.length * 10 // Fallback rough estimate
    ctx.font = font
    return ctx.measureText(text).width
}

/**
 * Truncate a string so that its rendered width with the provided font
 * does not exceed maxWidthPx. Adds the ellipsis (default '...') and
 * ensures its width is included in the fit.
 */
export function truncateTextToWidth(fullText: string, maxWidthPx: number, font: string, ellipsis: string = "..."): string {
    if (maxWidthPx <= 0) return ""
    const fullWidth = measureTextWidth(fullText, font)
    if (fullWidth <= maxWidthPx) return fullText

    const ellWidth = measureTextWidth(ellipsis, font)
    if (ellWidth >= maxWidthPx) return "." // Not enough room even for ellipsis

    let lo = 0
    let hi = fullText.length
    let best = 0
    while (lo <= hi) {
        const mid = (lo + hi) >> 1
        const candidate = fullText.slice(0, mid)
        const width = measureTextWidth(candidate, font) + ellWidth
        if (width <= maxWidthPx) {
            best = mid
            lo = mid + 1
        } else {
            hi = mid - 1
        }
    }
    const truncated = fullText.slice(0, best)
    return truncated + ellipsis
}

/**
 * Convenience wrapper: compute font from the element and truncate.
 */
export function truncateUsingElement(fullText: string, maxWidthPx: number, elementForFont: HTMLElement, ellipsis: string = "..."): string {
    const font = getFontShorthandFromElement(elementForFont)
    return truncateTextToWidth(fullText, maxWidthPx, font, ellipsis)
}
