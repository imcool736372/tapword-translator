/**
 * DOM Sanitizer Utility
 *
 * Provides functions to filter out UI-specific elements from DOM operations,
 * ensuring that text extraction and traversal logic doesn't accidentally
 * include content from the extension's own UI (e.g., tooltips, icons).
 */

import * as constants from "@/1_content/constants"

/**
 * Creates a TreeWalker that automatically skips text nodes located inside
 * the extension's UI elements (tooltips, icons, etc.).
 *
 * This is essential for DOM traversal tasks like context extraction or
 * boundary expansion, preventing them from crossing into UI-generated content.
 *
 * @returns A configured TreeWalker instance.
 */
export function createFilteredTextWalker(): TreeWalker {
    const filter: NodeFilter = {
        acceptNode: (node: Node) => {
            // We only care about text nodes
            if (node.nodeType !== Node.TEXT_NODE) {
                return NodeFilter.FILTER_SKIP
            }
            // Reject nodes that are inside our ignored UI elements
            return isInsideIgnoredElement(node) ? NodeFilter.FILTER_REJECT : NodeFilter.FILTER_ACCEPT
        },
    }
    // Walk the entire document body for text nodes, applying our filter
    return document.createTreeWalker(document.body, NodeFilter.SHOW_TEXT, filter)
}

/**
 * Checks if a given DOM node is a descendant of any of the extension's
 * designated UI container elements.
 *
 * @param node - The node to check.
 * @returns `true` if the node is inside an ignored element, `false` otherwise.
 */
export function isInsideIgnoredElement(node: Node): boolean {
    // Start from the node's parent element
    let el: Element | null = node.parentElement
    while (el && el !== document.body) {
        // Check if the element has any of the CSS classes we want to ignore
        if (el.classList && (el.classList.contains(constants.CSS_CLASSES.TOOLTIP) || el.classList.contains(constants.CSS_CLASSES.ICON))) {
            return true
        }
        // Move up the DOM tree
        el = el.parentElement
    }
    return false
}

/**
 * Extracts clean text content from a DOM Range object by first removing any
 * of the extension's UI elements from a cloned fragment of the range.
 *
 * This prevents text from tooltips or other UI from being included in the
 * selected text.
 *
 * @param r - The DOM Range to clean.
 * @returns The sanitized text content.
 */
export function getCleanTextFromRange(r: Range): string {
    try {
        // Clone the range content to avoid modifying the live DOM
        const fragment = r.cloneContents()
        const container = document.createElement("div")
        container.appendChild(fragment)

        // Find and remove any of our UI elements within the cloned fragment
        container.querySelectorAll(`.${constants.CSS_CLASSES.TOOLTIP}, .${constants.CSS_CLASSES.ICON}`).forEach((el) => el.remove())

        // Return the text content of the cleaned fragment
        return container.textContent || ""
    } catch {
        // Fallback to the original range's text if cloning fails
        return r.toString()
    }
}

/**
 * Block-scoped traversal helpers
 *
 * These utilities constrain text traversal within the closest block-level
 * ancestor, preventing cross-block hops while allowing inline merges.
 */

// A conservative list of common block-level tags for scoping traversal
export const BLOCK_ELEMENTS = new Set<string>([
    "ADDRESS",
    "ARTICLE",
    "ASIDE",
    "BLOCKQUOTE",
    "DIV",
    "DL",
    "DT",
    "DD",
    "FIELDSET",
    "FIGCAPTION",
    "FIGURE",
    "FOOTER",
    "FORM",
    "H1",
    "H2",
    "H3",
    "H4",
    "H5",
    "H6",
    "HEADER",
    "HR",
    "LI",
    "MAIN",
    "NAV",
    "OL",
    "P",
    "PRE",
    "SECTION",
    "TABLE",
    "THEAD",
    "TBODY",
    "TFOOT",
    "TR",
    "TD",
    "TH",
    "UL",
])

/** Create a TreeWalker over text nodes inside the given root, skipping our UI. */
export function createLocalTextWalker(root: Node): TreeWalker {
    const filter: NodeFilter = {
        acceptNode: (n: Node) => {
            if (n.nodeType !== Node.TEXT_NODE) return NodeFilter.FILTER_SKIP
            return isInsideIgnoredElement(n) ? NodeFilter.FILTER_REJECT : NodeFilter.FILTER_ACCEPT
        },
    }
    return document.createTreeWalker(root, NodeFilter.SHOW_TEXT, filter)
}

/** Find the closest block-level ancestor element for a node. */
export function getClosestBlockAncestor(node: Node): Element {
    let el: Element | null = node.nodeType === Node.ELEMENT_NODE ? (node as Element) : node.parentElement
    while (el && el !== document.body) {
        if (BLOCK_ELEMENTS.has(el.tagName)) return el
        el = el.parentElement
    }
    return document.body
}

/** Previous text node within the provided root subtree. */
export function getPreviousTextNodeWithin(node: Node, root: Node): Node | null {
    const walker = createLocalTextWalker(root)
    walker.currentNode = node
    return walker.previousNode()
}

/** Next text node within the provided root subtree. */
export function getNextTextNodeWithin(node: Node, root: Node): Node | null {
    const walker = createLocalTextWalker(root)
    walker.currentNode = node
    return walker.nextNode()
}

/**
 * Extract surrounding text from range for language detection.
 * Starts from the closest block ancestor and expands upward if needed.
 *
 * @param range - The selection range
 * @param minChars - Minimum characters to extract (default: 150)
 * @returns Text with sufficient context for language detection
 */
export function getSurroundingTextForDetection(range: Range, minChars: number = 150): string {
    try {
        const container = range.commonAncestorContainer
        let blockAncestor = getClosestBlockAncestor(container)

        // Try extracting text from current block
        let extractedText = extractTextFromBlock(blockAncestor)

        // If text is too short, try parent block (up to 2 levels)
        let attempts = 0
        while (extractedText.length < minChars && blockAncestor !== document.body && attempts < 2) {
            attempts++
            const parentElement = blockAncestor.parentElement
            if (!parentElement) break

            const parentBlock = getClosestBlockAncestor(parentElement)
            if (parentBlock === blockAncestor) break // No higher block found

            blockAncestor = parentBlock
            extractedText = extractTextFromBlock(blockAncestor)
        }

        return extractedText.trim() || getCleanTextFromRange(range).trim()
    } catch (error) {
        // Fallback: just return selection text
        return getCleanTextFromRange(range).trim()
    }
}

/**
 * Extract clean text from a block element, skipping UI elements
 */
function extractTextFromBlock(block: Element): string {
    try {
        const range = document.createRange()
        range.selectNodeContents(block)
        return getCleanTextFromRange(range)
    } catch {
        return block.textContent || ""
    }
}
