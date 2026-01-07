# Context Extractor Tests

Unit tests for the DOM-based context extraction functionality.

## 🔧 Test Environment Configuration

**Important**: This test file requires a DOM environment.

### File-Level Environment Override

This test uses `jsdom` environment via a file-level comment:

```typescript
/**
 * @vitest-environment jsdom
 */
```

### Why Not Global jsdom?

- **Performance**: jsdom is ~4x slower than node environment
- **Scope**: Only this test file needs DOM APIs
- **Best Practice**: Use the fastest environment that works

### Global Configuration

The global `vitest.config.ts` uses `node` environment by default:

```typescript
export default defineConfig({
    test: {
        environment: 'node', // Fast default
    }
});
```

Individual test files can override with `@vitest-environment` comment.

## 🎯 Test Coverage

### ✅ Passing Tests (12/17)

#### Basic Scenarios (4/4)
- ✅ Extract context from simple sentence
- ✅ Handle word at sentence beginning
- ✅ Handle word at sentence end  
- ✅ Handle selection in middle of long sentence

#### Block-Level Elements (2/3)
- ✅ Respect paragraph boundaries
- ✅ Stop at heading boundaries
- ❌ Handle nested elements (leadingText is empty)

#### Special Punctuation (1/3)
- ✅ Handle Chinese punctuation
- ❌ Handle question marks (previousSentences undefined)
- ❌ Handle exclamation marks (previousSentences undefined)

#### Edge Cases (3/3)
- ✅ Handle single word in paragraph
- ✅ Handle empty context gracefully
- ✅ Return valid context for invalid range

#### Real-World Scenarios (2/2)
- ✅ Handle article-like content
- ✅ Handle list items

### ❌ Failing Tests (5/17)

The failing tests are all related to extracting previous/next sentences:

1. **Multiple Sentences** (0/2)
   - `previousSentences` and `nextSentences` are undefined
   - Likely due to whitespace handling in DOM traversal

2. **Nested Elements** (1 test)
   - `leadingText` is empty when word appears after `<strong>` tag
   - Need to handle inline element boundaries better

3. **Special Punctuation** (2 tests)
   - Previous sentences not extracted when using `?` or `!` as delimiters
   - TreeWalker might not be traversing correctly

## 🧪 Running Tests

### Run All Tests
```bash
npm test
```

### Run Context Extractor Tests Only
```bash
npm test -- tests/1_content/utils/contextExtractor.test.ts
```

### Run Tests in Non-Watch Mode
```bash
npm run test:run -- tests/1_content/utils/contextExtractor.test.ts
```

### Run Specific Test Suite
```bash
npm test -- tests/1_content/utils/contextExtractor.test.ts -t "Basic Scenarios"
```

## 🔧 Test Environment

- **Environment**: jsdom (simulates browser DOM)
- **Framework**: Vitest
- **Dependencies**: 
  - `jsdom` - DOM implementation for Node.js
  - `@types/jsdom` - TypeScript definitions

## 📝 Test Structure

Each test follows the **Arrange-Act-Assert** pattern:

```typescript
it('should extract context from a simple sentence', () => {
    // Arrange: Create DOM structure
    const html = '<p>The quick brown fox jumps over the lazy dog.</p>';
    const container = createTestDOM(html);
    const range = createRangeFromText(container, 'fox');

    // Act: Extract context
    const context = extractContext(range!, 'fox');

    // Assert: Verify results
    expect(context).not.toBeNull();
    expect(context?.word).toBe('fox');
    expect(context?.leadingText).toContain('brown');
    expect(context?.trailingText).toContain('jumps');
});
```

## 🐛 Known Issues

### Issue 1: Previous/Next Sentences Not Extracted
**Status**: ❌ Failing  
**Affected Tests**: 5 tests  
**Root Cause**: The `extractPreviousSentences()` and `extractNextSentences()` functions may not be:
- Properly traversing across text nodes
- Handling whitespace between sentences
- Starting from the correct node position

**Suggested Fix**:
```typescript
// In contextExtractor.ts, the walker might need to start from a different position
// Current: walker.currentNode = startNode
// Should: Find the actual text node boundary first
```

### Issue 2: Empty Leading Text with Nested Elements
**Status**: ❌ Failing  
**Affected Tests**: 1 test  
**Root Cause**: When the selected word appears immediately after an inline element like `<strong>`, the leading text extraction stops at the element boundary.

**Suggested Fix**: The `extractTextBetweenNodes()` function should:
- Continue traversing through inline elements
- Only stop at block-level boundaries

## 🎯 Next Steps

1. **Debug Previous/Next Sentence Extraction**
   - Add console.log statements in `extractPreviousSentences()`
   - Check if TreeWalker is finding the correct nodes
   - Verify sentence boundary detection

2. **Fix Nested Element Handling**
   - Modify `findSentenceStart()` to skip over inline elements
   - Only stop traversal at block-level elements

3. **Add More Test Cases**
   - Test with real web page HTML
   - Test with complex nested structures
   - Test with edge cases like empty paragraphs

4. **Integration Testing**
   - Test the full flow from double-click to translation display
   - Test with actual Chrome extension environment

## 📚 References

- [jsdom Documentation](https://github.com/jsdom/jsdom)
- [Vitest Documentation](https://vitest.dev/)
- [DOM TreeWalker API](https://developer.mozilla.org/en-US/docs/Web/API/TreeWalker)
- [DOM Range API](https://developer.mozilla.org/en-US/docs/Web/API/Range)

## ✨ Success Metrics

**Current**: 12/17 tests passing (70.6%)  
**Target**: 17/17 tests passing (100%)

The fact that 12 tests pass confirms:
- ✅ DOM environment setup works correctly
- ✅ Basic context extraction logic is sound
- ✅ Sentence boundary detection works for most cases
- ✅ Block-level element handling works for most cases

The 5 failing tests are related to edge cases that need refinement, not fundamental flaws in the approach.
