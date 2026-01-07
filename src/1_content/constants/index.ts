/**
 * Content Script Constants
 *
 * Centralized exports for all constants used in the content script module
 */

export { CSS_CLASSES } from "@/1_content/constants/cssClasses"
export { ICON_COLORS } from "@/1_content/constants/iconColors"

/** Maximum character length for a selection to trigger the translation icon */
export const MAX_SELECTION_LENGTH = 800

/** Minimum tooltip font size in pixels (configurable) */
export const MIN_TOOLTIP_FONT_PX = 10

/** Safety delta added to min font when adjusting line-height (px) */
export const MIN_TOOLTIP_SAFETY_DELTA_PX = 1
