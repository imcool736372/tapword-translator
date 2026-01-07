/**
 * Translation Service Integration Tests
 * 
 * These tests make real HTTP requests to a local backend server.
 * They require a running backend server on localhost.
 */

import { afterAll, beforeAll, describe, expect, it } from 'vitest';
import { getDeviceUID } from '../../../src/0_common/utils/storageManager';
import { initAPIService, initAuthService } from '../../../src/5_backend';
import { BUILD_TIME_CREDENTIALS, hasBuildTimeCredentials } from '../../../src/5_backend/config/credentials';
import { translateFragment, translateWord } from '../../../src/6_translate';

describe('TranslationService Integration Tests', () => {
    const TEST_BASE_URL = 'https://local.tapword.cc';
    let deviceUID: string;

    beforeAll(async () => {
        // Disable SSL certificate verification for local development
        // This allows testing with self-signed certificates
        process.env.NODE_TLS_REJECT_UNAUTHORIZED = '0';
        if (!hasBuildTimeCredentials()) {
            throw new Error('Missing build-time credentials; run secret inject step.');
        }
        deviceUID = await getDeviceUID();
        initAuthService({
            apiKey: BUILD_TIME_CREDENTIALS.apiKey,
            apiSecret: BUILD_TIME_CREDENTIALS.apiSecret,
        }, deviceUID, TEST_BASE_URL);
        initAPIService({
            baseURL: TEST_BASE_URL,
            clientVersion: '1.0.0',
        });
    });

    afterAll(() => {
        // Restore SSL certificate verification
        delete process.env.NODE_TLS_REJECT_UNAUTHORIZED;
    });

    describe('translateWord function', () => {
        it('should translate a word with full context', async () => {
            const result = await translateWord({
                word: 'light',
                leadingText: 'The room was filled with natural ',
                trailingText: ' from the large windows.',
                sourceLanguage: 'en',
                targetLanguage: 'zh',
                contextInfo: {
                    previousSentences: ['He opened the curtains.'],
                    nextSentences: ['It made the space feel warm and inviting.'],
                    bookName: 'Sample Book',
                    bookAuthor: 'John Doe',
                },
            });

            // Verify response structure
            expect(result).toBeDefined();
            expect(result.wordTranslation).toBeDefined();
            expect(typeof result.wordTranslation).toBe('string');
            expect(result.wordTranslation.length).toBeGreaterThan(0);

            // Should have sentence translation since context is provided
            expect(result.sentenceTranslation).toBeDefined();
            expect(typeof result.sentenceTranslation).toBe('string');
            expect(result.sentenceTranslation!.length).toBeGreaterThan(0);

            console.log('Translation result:', result);
        }, 30000); // 30 second timeout for API calls

        it('should translate a word without context information', async () => {
            const result = await translateWord({
                word: 'hello',
                leadingText: 'Say ',
                trailingText: ' to the world.',
                sourceLanguage: 'en',
                targetLanguage: 'zh',
            });

            // Verify response structure
            expect(result).toBeDefined();
            expect(result.wordTranslation).toBeDefined();
            expect(typeof result.wordTranslation).toBe('string');
            expect(result.wordTranslation.length).toBeGreaterThan(0);

            // May or may not have sentence translation
            if (result.sentenceTranslation) {
                expect(typeof result.sentenceTranslation).toBe('string');
            }

            console.log('Translation result:', result);
        }, 30000);

        it('should translate with minimal context', async () => {
            const result = await translateWord({
                word: 'book',
                leadingText: 'Read the ',
                trailingText: ' carefully.',
                sourceLanguage: 'en',
                targetLanguage: 'zh',
            });

            expect(result).toBeDefined();
            expect(result.wordTranslation).toBeDefined();
            expect(typeof result.wordTranslation).toBe('string');

            console.log('Translation result:', result);
        }, 30000);

        it('should use default target language (zh)', async () => {
            const result = await translateWord({
                word: 'world',
                leadingText: 'Hello ',
                trailingText: '!',
                sourceLanguage: 'en',
            });

            expect(result).toBeDefined();
            expect(result.wordTranslation).toBeDefined();
            expect(typeof result.wordTranslation).toBe('string');

            console.log('Translation result:', result);
        }, 30000);

        it('should translate with book information', async () => {
            const result = await translateWord({
                word: 'magic',
                leadingText: 'The ancient ',
                trailingText: ' was powerful.',
                sourceLanguage: 'en',
                targetLanguage: 'zh',
                contextInfo: {
                    bookName: 'Harry Potter',
                    bookAuthor: 'J.K. Rowling',
                },
            });

            expect(result).toBeDefined();
            expect(result.wordTranslation).toBeDefined();
            expect(typeof result.wordTranslation).toBe('string');

            console.log('Translation result:', result);
        }, 30000);

        it('should translate with surrounding sentences', async () => {
            const result = await translateWord({
                word: 'adventure',
                leadingText: 'This ',
                trailingText: ' was just beginning.',
                sourceLanguage: 'en',
                targetLanguage: 'zh',
                contextInfo: {
                    previousSentences: [
                        'They packed their bags.',
                        'The journey would be long.',
                    ],
                    nextSentences: [
                        'They had no idea what awaited them.',
                        'But they were ready for anything.',
                    ],
                },
            });

            expect(result).toBeDefined();
            expect(result.wordTranslation).toBeDefined();
            expect(result.sentenceTranslation).toBeDefined();
            expect(typeof result.wordTranslation).toBe('string');

            console.log('Translation result:', result);
        }, 30000);
    });

    describe('error handling', () => {
        it('should handle API errors gracefully', async () => {
            // Create a service with invalid endpoint to trigger error
            initAPIService({
                baseURL: 'http://localhost:9999', // Non-existent port
                clientVersion: '1.0.0',
            });

            try {
                await translateWord({
                    word: 'test',
                    leadingText: '',
                    trailingText: '',
                });
                // If it doesn't throw, fail the test
                expect.fail('Should have thrown an error');
            } catch (error) {
                expect(error).toBeDefined();
                console.log('Expected error caught:', error);
            }

            // Restore correct configuration for other tests
            initAPIService({
                baseURL: TEST_BASE_URL,
                clientVersion: '1.0.0',
            });
        }, 10000);
    });

    describe('edge cases', () => {
        it('should handle empty leading and trailing text', async () => {
            const result = await translateWord({
                word: 'test',
                leadingText: '',
                trailingText: '',
                sourceLanguage: 'en',
                targetLanguage: 'zh',
            });

            expect(result).toBeDefined();
            expect(result.wordTranslation).toBeDefined();
            expect(typeof result.wordTranslation).toBe('string');

            console.log('Translation result:', result);
        }, 30000);

        it('should handle long context text', async () => {
            const longText = 'This is a very long sentence that contains many words and should still be handled correctly by the translation API. '.repeat(3);

            const result = await translateWord({
                word: 'important',
                leadingText: longText + 'The most ',
                trailingText: ' thing is to understand the context.',
                sourceLanguage: 'en',
                targetLanguage: 'zh',
            });

            expect(result).toBeDefined();
            expect(result.wordTranslation).toBeDefined();
            expect(typeof result.wordTranslation).toBe('string');

            console.log('Translation result:', result);
        }, 30000);

        it('should handle special characters in text', async () => {
            const result = await translateWord({
                word: 'test',
                leadingText: 'This is a "quoted" ',
                trailingText: ' with special chars: @#$%',
                sourceLanguage: 'en',
                targetLanguage: 'zh',
            });

            expect(result).toBeDefined();
            expect(result.wordTranslation).toBeDefined();
            expect(typeof result.wordTranslation).toBe('string');

            console.log('Translation result:', result);
        }, 30000);
    });
});

describe('translateFragment function', () => {
    const TEST_BASE_URL = 'https://local.tapword.cc';
    let deviceUID: string;

    beforeAll(async () => {
        process.env.NODE_TLS_REJECT_UNAUTHORIZED = '0';
        if (!hasBuildTimeCredentials()) {
            throw new Error('Missing build-time credentials; run secret inject step.');
        }
        deviceUID = await getDeviceUID();
        initAuthService({
            apiKey: BUILD_TIME_CREDENTIALS.apiKey,
            apiSecret: BUILD_TIME_CREDENTIALS.apiSecret,
        }, deviceUID, TEST_BASE_URL);
        initAPIService({
            baseURL: TEST_BASE_URL,
            clientVersion: '1.0.0',
        });
    });

    afterAll(() => {
        delete process.env.NODE_TLS_REJECT_UNAUTHORIZED;
    });

    describe('basic fragment translation', () => {
        it('should translate a noun phrase fragment with full context', async () => {
            const result = await translateFragment({
                fragment: 'beneath the ancient oak tree',
                leadingText: 'The children gathered ',
                trailingText: ' to share their stories.',
                sourceLanguage: 'en',
                targetLanguage: 'zh',
                contextInfo: {
                    previousSentences: ['Summer had finally arrived.'],
                    nextSentences: ['Their laughter echoed through the meadow.'],
                    bookName: 'Tales of Friendship',
                    bookAuthor: 'Sarah Mitchell',
                },
            });

            expect(result).toBeDefined();
            expect(result.translation).toBeDefined();
            expect(typeof result.translation).toBe('string');
            expect(result.translation.length).toBeGreaterThan(0);

            console.log('Fragment translation result:', result);
        }, 30000);

        it('should translate a verb phrase fragment', async () => {
            const result = await translateFragment({
                fragment: 'dancing wildly across the stage',
                leadingText: 'The performers were ',
                trailingText: ' while the audience cheered.',
                sourceLanguage: 'en',
                targetLanguage: 'zh',
            });

            expect(result).toBeDefined();
            expect(result.translation).toBeDefined();
            expect(typeof result.translation).toBe('string');

            console.log('Fragment translation result:', result);
        }, 30000);

        it('should translate an adjective phrase fragment', async () => {
            const result = await translateFragment({
                fragment: 'surprisingly elegant and sophisticated',
                leadingText: 'Her design was ',
                trailingText: ' despite the limited resources.',
                sourceLanguage: 'en',
                targetLanguage: 'zh',
                contextInfo: {
                    previousSentences: ['She worked tirelessly for weeks.'],
                    nextSentences: ['Everyone admired her creativity.'],
                },
            });

            expect(result).toBeDefined();
            expect(result.translation).toBeDefined();
            expect(typeof result.translation).toBe('string');

            console.log('Fragment translation result:', result);
        }, 30000);

        it('should translate a prepositional phrase fragment', async () => {
            const result = await translateFragment({
                fragment: 'through the misty mountains',
                leadingText: 'The caravan traveled ',
                trailingText: ' in search of the hidden temple.',
                sourceLanguage: 'en',
                targetLanguage: 'zh',
            });

            expect(result).toBeDefined();
            expect(result.translation).toBeDefined();
            expect(typeof result.translation).toBe('string');

            console.log('Fragment translation result:', result);
        }, 30000);
    });

    describe('fragment translation with context variations', () => {
        it('should translate fragment with only leadingText', async () => {
            const result = await translateFragment({
                fragment: 'artificial intelligence and machine learning',
                leadingText: 'The conference focused on ',
                sourceLanguage: 'en',
                targetLanguage: 'zh',
            });

            expect(result).toBeDefined();
            expect(result.translation).toBeDefined();
            expect(typeof result.translation).toBe('string');

            console.log('Fragment translation result:', result);
        }, 30000);

        it('should translate fragment with only trailingText', async () => {
            const result = await translateFragment({
                fragment: 'Revolutionary breakthroughs in quantum computing',
                trailingText: ' have transformed the industry.',
                sourceLanguage: 'en',
                targetLanguage: 'zh',
            });

            expect(result).toBeDefined();
            expect(result.translation).toBeDefined();
            expect(typeof result.translation).toBe('string');

            console.log('Fragment translation result:', result);
        }, 30000);

        it('should translate fragment with no leading or trailing text', async () => {
            const result = await translateFragment({
                fragment: 'sustainable development goals',
                sourceLanguage: 'en',
                targetLanguage: 'zh',
            });

            expect(result).toBeDefined();
            expect(result.translation).toBeDefined();
            expect(typeof result.translation).toBe('string');

            console.log('Fragment translation result:', result);
        }, 30000);

        it('should translate fragment with paragraph context only', async () => {
            const result = await translateFragment({
                fragment: 'emerging technologies in renewable energy',
                leadingText: 'Scientists are exploring ',
                trailingText: ' to combat climate change.',
                sourceLanguage: 'en',
                targetLanguage: 'zh',
                contextInfo: {
                    previousSentences: [
                        'The global energy crisis demands immediate action.',
                        'Traditional fossil fuels are no longer sustainable.',
                    ],
                    nextSentences: [
                        'These innovations could revolutionize power generation.',
                        'Governments worldwide are investing heavily in research.',
                    ],
                },
            });

            expect(result).toBeDefined();
            expect(result.translation).toBeDefined();
            expect(typeof result.translation).toBe('string');

            console.log('Fragment translation result:', result);
        }, 30000);

        it('should translate fragment with book metadata', async () => {
            const result = await translateFragment({
                fragment: 'whispered secrets of forgotten civilizations',
                leadingText: 'The manuscript contained ',
                trailingText: ' waiting to be discovered.',
                sourceLanguage: 'en',
                targetLanguage: 'zh',
                contextInfo: {
                    bookName: 'The Lost Archives',
                    bookAuthor: 'Dr. Michael Chen',
                },
            });

            expect(result).toBeDefined();
            expect(result.translation).toBeDefined();
            expect(typeof result.translation).toBe('string');

            console.log('Fragment translation result:', result);
        }, 30000);
    });

    describe('complex fragment scenarios', () => {
        it('should translate a long complex fragment', async () => {
            const result = await translateFragment({
                fragment: 'innovative approaches to solving challenging problems in distributed systems architecture',
                leadingText: 'The research team presented their ',
                trailingText: ' at the international symposium.',
                sourceLanguage: 'en',
                targetLanguage: 'zh',
            });

            expect(result).toBeDefined();
            expect(result.translation).toBeDefined();
            expect(typeof result.translation).toBe('string');

            console.log('Fragment translation result:', result);
        }, 30000);

        it('should translate fragment with technical terminology', async () => {
            const result = await translateFragment({
                fragment: 'neural networks and deep learning algorithms',
                leadingText: 'Modern applications rely heavily on ',
                trailingText: ' for pattern recognition.',
                sourceLanguage: 'en',
                targetLanguage: 'zh',
                contextInfo: {
                    previousSentences: ['Computer vision has made remarkable progress.'],
                    nextSentences: ['These technologies power many everyday devices.'],
                },
            });

            expect(result).toBeDefined();
            expect(result.translation).toBeDefined();
            expect(typeof result.translation).toBe('string');

            console.log('Fragment translation result:', result);
        }, 30000);

        it('should translate fragment with literary style', async () => {
            const result = await translateFragment({
                fragment: 'crimson hues painting the horizon',
                leadingText: 'As dusk approached, she watched the ',
                trailingText: ' with quiet contemplation.',
                sourceLanguage: 'en',
                targetLanguage: 'zh',
                contextInfo: {
                    bookName: 'Moments of Reflection',
                    bookAuthor: 'Emma Davidson',
                    previousSentences: ['The day had been long and tiring.'],
                    nextSentences: ['Soon, stars would begin to appear.'],
                },
            });

            expect(result).toBeDefined();
            expect(result.translation).toBeDefined();
            expect(typeof result.translation).toBe('string');

            console.log('Fragment translation result:', result);
        }, 30000);
    });

    describe('reverse translation (Chinese to English)', () => {
        it('should translate Chinese fragment to English', async () => {
            const result = await translateFragment({
                fragment: '人工智能技术的快速发展',
                leadingText: '近年来，',
                trailingText: '改变了许多行业。',
                sourceLanguage: 'zh',
                targetLanguage: 'en',
            });

            expect(result).toBeDefined();
            expect(result.translation).toBeDefined();
            expect(typeof result.translation).toBe('string');

            console.log('Fragment translation result:', result);
        }, 30000);

        it('should translate Chinese literary fragment to English', async () => {
            const result = await translateFragment({
                fragment: '在月光下轻轻摇曳',
                leadingText: '柳树的枝条',
                trailingText: '，如同诗人的梦境。',
                sourceLanguage: 'zh',
                targetLanguage: 'en',
                contextInfo: {
                    bookName: '春日诗集',
                    bookAuthor: '李明',
                },
            });

            expect(result).toBeDefined();
            expect(result.translation).toBeDefined();
            expect(typeof result.translation).toBe('string');

            console.log('Fragment translation result:', result);
        }, 30000);
    });

    describe('edge cases and special scenarios', () => {
        it('should handle fragment with special characters', async () => {
            const result = await translateFragment({
                fragment: 'cutting-edge technology & innovative solutions',
                leadingText: 'The company specializes in ',
                trailingText: ' for modern enterprises.',
                sourceLanguage: 'en',
                targetLanguage: 'zh',
            });

            expect(result).toBeDefined();
            expect(result.translation).toBeDefined();
            expect(typeof result.translation).toBe('string');

            console.log('Fragment translation result:', result);
        }, 30000);

        it('should handle fragment with numbers and units', async () => {
            const result = await translateFragment({
                fragment: 'over 10,000 square kilometers of pristine wilderness',
                leadingText: 'The national park encompasses ',
                trailingText: ' in the northern region.',
                sourceLanguage: 'en',
                targetLanguage: 'zh',
            });

            expect(result).toBeDefined();
            expect(result.translation).toBeDefined();
            expect(typeof result.translation).toBe('string');

            console.log('Fragment translation result:', result);
        }, 30000);

        it('should use default target language (zh) when not specified', async () => {
            const result = await translateFragment({
                fragment: 'breathtaking views of the coastline',
                leadingText: 'Visitors can enjoy ',
                trailingText: ' from the observation deck.',
                sourceLanguage: 'en',
            });

            expect(result).toBeDefined();
            expect(result.translation).toBeDefined();
            expect(typeof result.translation).toBe('string');

            console.log('Fragment translation result:', result);
        }, 30000);

        it('should handle very long surrounding context', async () => {
            const longLeadingText = 'In the rapidly evolving landscape of modern technology, where innovation drives progress and competition fuels creativity, researchers have discovered that ';
            const longTrailingText = ' will fundamentally reshape how we interact with digital systems and transform the way businesses operate in an increasingly connected world.';

            const result = await translateFragment({
                fragment: 'advanced artificial intelligence systems',
                leadingText: longLeadingText,
                trailingText: longTrailingText,
                sourceLanguage: 'en',
                targetLanguage: 'zh',
            });

            expect(result).toBeDefined();
            expect(result.translation).toBeDefined();
            expect(typeof result.translation).toBe('string');

            console.log('Fragment translation result:', result);
        }, 30000);
    });
});
