
/**
 * Test Helpers for DOM-related tests
 */

/**
 * Creates a DOM structure for testing.
 * @param html - The HTML content to inject.
 * @returns The container element.
 */
export function createTestDOM(html: string): HTMLElement {
    const container = document.createElement('div');
    container.innerHTML = html;
    document.body.appendChild(container);
    return container;
}

/**
 * Creates a Range object from a text selection within a container.
 * @param container - The container element.
 * @param searchText - The text to find and select.
 * @param partialStart - Optional characters to skip from the start.
 * @param partialEnd - Optional characters to skip from the end.
 * @returns A Range object or null if not found.
 */
export function createRangeFromText(
    container: HTMLElement,
    searchText: string,
    partialStart: number = 0,
    partialEnd: number = 0
): Range | null {
    const walker = document.createTreeWalker(
        container,
        NodeFilter.SHOW_TEXT,
        null
    );

    const textNodes: Node[] = [];
    let node: Node | null;
    while ((node = walker.nextNode())) {
        textNodes.push(node);
    }

    const fullText = textNodes.map(n => n.textContent || '').join('');
    const startIndex = fullText.indexOf(searchText);

    if (startIndex === -1) {
        console.warn(`searchText "${searchText}" not found in container.`);
        return null;
    }

    const targetStart = startIndex + partialStart;
    const targetEnd = startIndex + searchText.length - partialEnd;

    let charCount = 0;
    let startNode: Node | null = null;
    let startOffset = 0;
    let endNode: Node | null = null;
    let endOffset = 0;

    for (const currentNode of textNodes) {
        const nodeText = currentNode.textContent || '';
        const nodeStart = charCount;
        const nodeEnd = nodeStart + nodeText.length;

        if (startNode === null && targetStart >= nodeStart && targetStart <= nodeEnd) {
            startNode = currentNode;
            startOffset = targetStart - nodeStart;
        }
        
        if (endNode === null && targetEnd >= nodeStart && targetEnd <= nodeEnd) {
            endNode = currentNode;
            endOffset = targetEnd - nodeStart;
        }

        if (startNode && endNode) {
            break;
        }

        charCount = nodeEnd;
    }

    if (startNode && endNode) {
        const range = document.createRange();
        range.setStart(startNode, startOffset);
        range.setEnd(endNode, endOffset);
        return range;
    }

    return null;
}

/**
 * Cleans up the DOM after each test.
 */
export function cleanupDOM(): void {
    document.body.innerHTML = '';
}
