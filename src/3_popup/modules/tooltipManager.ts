/**
 * Tooltip Manager for Popup (portal-based)
 *
 * Renders tooltips into document.body to avoid clipping by scroll containers or headers.
 */

const TOOLTIP_MAX_WIDTH_PX = 250
const TOOLTIP_SIDE_MARGIN_PX = 8
const TOOLTIP_VERTICAL_GAP_PX = 6

let portalTooltip: HTMLDivElement | null = null
let currentAnchor: HTMLElement | null = null

type TooltipPlacement = "top" | "bottom"

function ensurePortalTooltip(): HTMLDivElement {
    if (portalTooltip) {
        return portalTooltip
    }

    const tooltip = document.createElement("div")
    tooltip.className = "popup-tooltip-portal"
    tooltip.setAttribute("data-placement", "top")
    tooltip.style.display = "none"
    document.body.appendChild(tooltip)
    portalTooltip = tooltip
    return tooltip
}

function isTooltipVisible(): boolean {
    return !!portalTooltip && portalTooltip.style.display !== "none"
}

function hideTooltip(): void {
    if (!portalTooltip) {
        return
    }
    portalTooltip.style.opacity = "0"
    portalTooltip.style.visibility = "hidden"
    portalTooltip.style.display = "none"
    currentAnchor = null
}

function positionTooltip(anchor: HTMLElement): void {
    const text = anchor.getAttribute("data-tooltip") || ""
    if (!text) {
        hideTooltip()
        return
    }

    const tooltip = ensurePortalTooltip()
    tooltip.textContent = text
    tooltip.style.visibility = "hidden"
    tooltip.style.opacity = "0"
    tooltip.style.display = "block"
    tooltip.style.maxWidth = `${TOOLTIP_MAX_WIDTH_PX}px`

    // Measure after content set
    const tooltipRect = tooltip.getBoundingClientRect()
    const iconRect = anchor.getBoundingClientRect()
    const viewportWidth = document.documentElement.clientWidth
    const viewportHeight = document.documentElement.clientHeight

    let placement: TooltipPlacement = "top"
    let top = iconRect.top - TOOLTIP_VERTICAL_GAP_PX - tooltipRect.height
    if (top < 4) {
        placement = "bottom"
        top = iconRect.bottom + TOOLTIP_VERTICAL_GAP_PX
    }

    let left = iconRect.left + iconRect.width / 2 - tooltipRect.width / 2
    const maxLeft = viewportWidth - tooltipRect.width - TOOLTIP_SIDE_MARGIN_PX
    left = Math.max(TOOLTIP_SIDE_MARGIN_PX, Math.min(left, maxLeft))

    if (placement === "bottom" && top + tooltipRect.height + 4 > viewportHeight) {
        top = Math.max(4, viewportHeight - tooltipRect.height - 4)
    }

    tooltip.style.left = `${Math.round(left)}px`
    tooltip.style.top = `${Math.round(top)}px`
    tooltip.setAttribute("data-placement", placement)
    tooltip.style.visibility = "visible"
    tooltip.style.opacity = "1"
    currentAnchor = anchor
}

function showTooltip(anchor: HTMLElement): void {
    positionTooltip(anchor)
}

function handleOutsideClick(event: MouseEvent): void {
    const target = event.target as HTMLElement
    if (!target.closest(".help-icon")) {
        hideTooltip()
    }
}

function handleResize(): void {
    if (currentAnchor) {
        positionTooltip(currentAnchor)
    }
}

/**
 * Set up tooltip positioning and hover/focus interactions for help icons
 */
export function setupTooltipPositioning(helpIcons: NodeListOf<HTMLElement>, container: HTMLElement): void {
    const iconsArray = Array.from(helpIcons)

    const hide = () => hideTooltip()

    iconsArray.forEach((icon) => {
        icon.addEventListener("mouseenter", () => showTooltip(icon))
        icon.addEventListener("mouseleave", hide)
        icon.addEventListener("focus", () => showTooltip(icon))
        icon.addEventListener("blur", hide)
        icon.addEventListener("touchstart", () => showTooltip(icon), { passive: true })
    })

    window.addEventListener("resize", handleResize)
    container.addEventListener("scroll", hide, { passive: true })
}

/**
 * Set up click handlers for tooltip toggle on mobile/touch devices
 */
export function setupTooltipClickHandlers(helpIcons: NodeListOf<HTMLElement>, _popupContainer: HTMLElement | null): void {
    void _popupContainer
    const iconsArray = Array.from(helpIcons)

    iconsArray.forEach((icon) => {
        icon.addEventListener("click", (event) => {
            event.preventDefault()
            event.stopPropagation()

            const isCurrent = currentAnchor === icon && isTooltipVisible()
            if (isCurrent) {
                hideTooltip()
                return
            }

            showTooltip(icon)
        })
    })

    document.addEventListener("click", handleOutsideClick)
}
