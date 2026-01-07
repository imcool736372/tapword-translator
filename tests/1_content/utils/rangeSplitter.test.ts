/**
 * Range Splitter Tests
 *
 * @vitest-environment jsdom
 */

import { describe, it, expect, beforeEach } from 'vitest';
import { splitRangeByBlocks } from '@/1_content/utils/rangeSplitter';
import { createTestDOM, cleanupDOM } from './test-helpers';

describe('rangeSplitter', () => {
    beforeEach(() => {
        cleanupDOM();
    });

    // Helper to create a range spanning multiple nodes
    const createMultiNodeRange = (startNode: Node, startOffset: number, endNode: Node, endOffset: number): Range => {
        const range = document.createRange();
        range.setStart(startNode, startOffset);
        range.setEnd(endNode, endOffset);
        return range;
    };

    describe('Golden Path Scenarios', () => {
        it('should split a selection spanning multiple paragraphs', () => {
            const html = `
                <p>First paragraph.</p>
                <p>Second paragraph.</p>
                <p>Third paragraph.</p>
            `;
            const container = createTestDOM(html);
            const p1 = container.querySelectorAll('p')[0];
            const p3 = container.querySelectorAll('p')[2];
            const range = createMultiNodeRange(p1.firstChild!, 0, p3.firstChild!, 5); // "First paragraph.Second paragraph.Third"

            const result = splitRangeByBlocks(range);

            expect(result.length).toBe(3);
            expect(result[0].toString()).toBe('First paragraph.');
            expect(result[1].toString()).toBe('Second paragraph.');
            expect(result[2].toString()).toBe('Third');
        });

        it('should split a selection from a heading to a paragraph', () => {
            const html = `
                <h2>Title</h2>
                <p>This is the content.</p>
            `;
            const container = createTestDOM(html);
            const h2 = container.querySelector('h2')!;
            const p = container.querySelector('p')!;
            const range = createMultiNodeRange(h2.firstChild!, 0, p.firstChild!, 11); // "TitleThis is the"

            const result = splitRangeByBlocks(range);

            expect(result.length).toBe(2);
            expect(result[0].toString()).toBe('Title');
            expect(result[1].toString()).toBe('This is the');
        });

        it('should split a selection across multiple list items', () => {
            const html = `
                <ul>
                    <li>Item one</li>
                    <li>Item two</li>
                    <li>Item three</li>
                </ul>
            `;
            const container = createTestDOM(html);
            const li1 = container.querySelectorAll('li')[0];
            const li3 = container.querySelectorAll('li')[2];
            const range = createMultiNodeRange(li1.firstChild!, 5, li3.firstChild!, 4); // "oneItem twoItem thr"

            const result = splitRangeByBlocks(range);

            expect(result.length).toBe(3);
            expect(result[0].toString()).toBe('one');
            expect(result[1].toString()).toBe('Item two');
            expect(result[2].toString()).toBe('Item');
        });

        it('should handle a selection that partially covers the first and last block', () => {
            const html = `
                <p>Start here in this paragraph.</p>
                <div>Some middle content.</div>
                <p>End here in this one.</p>
            `;
            const container = createTestDOM(html);
            const p1 = container.querySelectorAll('p')[0];
            const p2 = container.querySelectorAll('p')[1];
            const range = createMultiNodeRange(p1.firstChild!, 6, p2.firstChild!, 8); // "here in this paragraph.Some middle content.End here"

            const result = splitRangeByBlocks(range);

            expect(result.length).toBe(3);
            expect(result[0].toString()).toBe('here in this paragraph.');
            expect(result[1].toString()).toBe('Some middle content.');
            expect(result[2].toString()).toBe('End here');
        });

        it('should correctly extract partial text from the first and last blocks', () => {
            const html = `
                <p>Some prefix start suffix.</p>
                <p>This is a middle block.</p>
                <p>Another prefix end suffix.</p>
            `;
            const container = createTestDOM(html);
            const p1 = container.querySelectorAll('p')[0];
            const p3 = container.querySelectorAll('p')[2];

            // Select from "start" in the first p to "end" in the third p.
            // Range: "start suffix.This is a middle block.Another prefix end"
            const range = createMultiNodeRange(p1.firstChild!, 12, p3.firstChild!, 18);

            const result = splitRangeByBlocks(range);

            expect(result.length).toBe(3);
            expect(result[0].toString()).toBe('start suffix.');
            expect(result[1].toString()).toBe('This is a middle block.');
            expect(result[2].toString()).toBe('Another prefix end');
        });
    });

    describe('Edge Cases', () => {
        it('should return a single range if the selection is within one block', () => {
            const html = '<p>This is a single paragraph.</p>';
            const container = createTestDOM(html);
            const p = container.querySelector('p')!;
            const range = createMultiNodeRange(p.firstChild!, 5, p.firstChild!, 16); // "is a single"

            const result = splitRangeByBlocks(range);

            expect(result.length).toBe(1);
            expect(result[0].toString()).toBe('is a single');
        });

        it('should return an empty array for a collapsed range', () => {
            const html = '<p>Some text.</p>';
            const container = createTestDOM(html);
            const p = container.querySelector('p')!;
            const range = document.createRange();
            range.setStart(p.firstChild!, 5);
            range.collapse(true);

            const result = splitRangeByBlocks(range);

            expect(result.length).toBe(0);
        });

        it('should ignore blocks that only contain whitespace', () => {
            const html = `
                <p>Start</p>
                <div>   </div>
                <p>End</p>
            `;
            const container = createTestDOM(html);
            const p1 = container.querySelectorAll('p')[0];
            const p2 = container.querySelectorAll('p')[1];
            const range = createMultiNodeRange(p1.firstChild!, 0, p2.firstChild!, 3); // "Start   End"

            const result = splitRangeByBlocks(range);

            expect(result.length).toBe(2);
            expect(result[0].toString()).toBe('Start');
            expect(result[1].toString()).toBe('End');
        });

        it('should handle selection ending at the start of a block', () => {
            const html = `
                <p>First paragraph.</p>
                <p>Second paragraph.</p>
            `;
            const container = createTestDOM(html);
            const p1 = container.querySelectorAll('p')[0];
            const p2 = container.querySelectorAll('p')[1];
            const range = createMultiNodeRange(p1.firstChild!, 0, p2.firstChild!, 0);

            const result = splitRangeByBlocks(range);

            expect(result.length).toBe(1);
            expect(result[0].toString()).toBe('First paragraph.');
        });
    });

    describe('Complex and Nested Scenarios', () => {
        it('should handle nested block elements correctly', () => {
            const html = `
                <div>
                    <p>Outer paragraph.</p>
                    <blockquote>
                        <p>Inner paragraph.</p>
                    </blockquote>
                </div>
            `;
            const container = createTestDOM(html);
            const p1 = container.querySelectorAll('p')[0];
            const p2 = container.querySelectorAll('p')[1];
            const range = createMultiNodeRange(p1.firstChild!, 6, p2.firstChild!, 5); // "paragraph.Inner"

            const result = splitRangeByBlocks(range);

            expect(result.length).toBe(2);
            expect(result[0].toString()).toBe('paragraph.');
            expect(result[1].toString()).toBe('Inner');
        });

        it('should handle inline elements within blocks', () => {
            const html = `
                <p>Some <strong>bold</strong> text.</p>
                <p>And some <i>italic</i> text.</p>
            `;
            const container = createTestDOM(html);
            const p1 = container.querySelector('p')!;
            const p2 = container.querySelector('p:nth-of-type(2)')!;
            const range = createMultiNodeRange(p1.firstChild!, 5, p2.querySelector('i')!.firstChild!, 6);

            const result = splitRangeByBlocks(range);

            expect(result.length).toBe(2);
            expect(result[0].toString()).toBe('bold text.');
            expect(result[1].toString()).toBe('And some italic');
        });

        it('should correctly identify the block parent even if common ancestor is a non-block element', () => {
            const html = `
                <span>
                    <p>First block</p>
                    <p>Second block</p>
                </span>
            `;
            const container = createTestDOM(html);
            const p1 = container.querySelectorAll('p')[0];
            const p2 = container.querySelectorAll('p')[1];
            const range = createMultiNodeRange(p1.firstChild!, 0, p2.firstChild!, 6); // "First blockSecond "

            const result = splitRangeByBlocks(range);

            expect(result.length).toBe(2);
            expect(result[0].toString()).toBe('First block');
            expect(result[1].toString()).toBe('Second');
        });

        it('should handle adjacent text nodes within the same block', () => {
            const html = '<p>Part one and <strong>part two</strong></p>';
            const container = createTestDOM(html);
            const p = container.querySelector('p')!;
            const strongText = p.querySelector('strong')!.firstChild!;
            const range = createMultiNodeRange(p.firstChild!, 0, strongText, 8); // "Part one and part two"

            const result = splitRangeByBlocks(range);

            expect(result.length).toBe(1);
            expect(result[0].toString()).toBe('Part one and part two');
        });
    });
});
