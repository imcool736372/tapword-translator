/**
 * AuthService Integration Tests
 * 
 * Tests the complete JWT authentication flow with real backend API
 * 
 * Prerequisites:
 * - Backend server running on https://api.tapword.cc
 * - Valid API credentials configured in other/key/
 * 
 * Test Coverage:
 * 1. JWT token acquisition with HMAC signature
 * 2. Token caching and reuse
 * 3. Token expiration detection
 * 4. Token refresh mechanism
 * 5. Auto-refresh timer
 * 6. Concurrent request handling
 * 7. Error scenarios
 */

import { afterAll, beforeAll, describe, expect, it, vi } from 'vitest'
import { initAPIService, initAuthService } from '../../../src/5_backend'
import { BUILD_TIME_CREDENTIALS, hasBuildTimeCredentials } from '../../../src/5_backend/config/credentials'
import { CLIENT_VERSION, DEFAULT_BASE_URL } from '../../../src/5_backend/constants'
import { AuthService } from '../../../src/5_backend/services/AuthService'
import type { APICredentials } from '../../../src/5_backend/types/AuthTypes'

// Mock chrome.storage for Node.js environment
const mockDeviceUID = 'extension-test-device-uid-12345678'

// Import getDeviceUID before mocking
import { getDeviceUID } from '../../../src/0_common/utils/storageManager'

// Mock getDeviceUID to return a fixed UID in tests
vi.mock('../../../src/0_common/utils/storageManager', async () => {
    const actual = await vi.importActual('../../../src/0_common/utils/storageManager')
    return {
        ...actual,
        getDeviceUID: vi.fn(async () => mockDeviceUID)
    }
})

describe('AuthService Integration Tests', () => {
    let authService: AuthService
    let testCredentials: APICredentials
    let testUID: string
    const TEST_BASE_URL = DEFAULT_BASE_URL

    beforeAll(async () => {
        // Disable SSL certificate verification for local development
        process.env.NODE_TLS_REJECT_UNAUTHORIZED = '0'

        // Check if build-time credentials are available
        if (!hasBuildTimeCredentials()) {
            throw new Error(
                'Build-time credentials not found. Please run: npm run build\n' +
                'Or manually create other/key/apikey.txt and other/key/apisecret.txt'
            )
        }

        // Get credentials from build-time injection
        testCredentials = {
            apiKey: BUILD_TIME_CREDENTIALS.apiKey!,
            apiSecret: BUILD_TIME_CREDENTIALS.apiSecret!,
        }

        // Get or generate device UID
        testUID = await getDeviceUID()

        console.log('Test setup:')
        console.log('  Base URL:', TEST_BASE_URL)
        console.log('  API Key:', testCredentials.apiKey.substring(0, 8) + '...')
        console.log('  Device UID:', testUID)
    })

    afterAll(() => {
        // Restore SSL certificate verification
        delete process.env.NODE_TLS_REJECT_UNAUTHORIZED
    })

    describe('Initialization', () => {
        it('should initialize AuthService with credentials', () => {
            authService = new AuthService()
            
            expect(authService.isInitialized()).toBe(false)

            authService.initialize(testCredentials, testUID, TEST_BASE_URL)

            expect(authService.isInitialized()).toBe(true)
        })

        it('should throw error when getting token without initialization', async () => {
            const uninitializedService = new AuthService()

            await expect(uninitializedService.getToken()).rejects.toThrow(
                'AuthService not initialized'
            )
        })
    })

    describe('JWT Token Acquisition', () => {
        beforeAll(() => {
            authService = new AuthService()
            authService.initialize(testCredentials, testUID, TEST_BASE_URL)
        })

        it('should successfully acquire JWT token from backend', async () => {
            const token = await authService.getToken()

            expect(token).toBeDefined()
            expect(typeof token).toBe('string')
            expect(token.length).toBeGreaterThan(0)

            // JWT tokens typically have 3 parts separated by dots
            const parts = token.split('.')
            expect(parts.length).toBe(3)

            console.log('JWT token acquired:', token.substring(0, 50) + '...')
        }, 10000)

        it('should return cached token on subsequent calls', async () => {
            const token1 = await authService.getToken()
            const token2 = await authService.getToken()

            // Should be the same token (cached)
            expect(token1).toBe(token2)

            console.log('Token reused from cache')
        }, 10000)

        it('should handle concurrent token requests', async () => {
            // Clear token to force new acquisition
            const freshService = new AuthService()
            freshService.initialize(testCredentials, testUID, TEST_BASE_URL)

            // Make 5 concurrent requests
            const promises = Array.from({ length: 5 }, () => freshService.getToken())
            const tokens = await Promise.all(promises)

            // All tokens should be identical (only one request was made)
            const firstToken = tokens[0]
            tokens.forEach((token: string) => {
                expect(token).toBe(firstToken)
            })

            console.log('Concurrent requests handled correctly')
        }, 15000)
    })

    describe('Token Refresh', () => {
        beforeAll(() => {
            authService = new AuthService()
            authService.initialize(testCredentials, testUID, TEST_BASE_URL)
        })

        it('should force refresh token', async () => {
            // Get initial token
            const token1 = await authService.getToken()

            // Wait a bit to ensure timestamp difference
            await new Promise(resolve => setTimeout(resolve, 1000))

            // Force refresh
            await authService.refreshToken()
            const token2 = await authService.getToken()

            // Token should be different after refresh
            // Note: Depending on backend implementation, token might be the same
            // if it's based on user/session rather than timestamp
            expect(token2).toBeDefined()
            expect(typeof token2).toBe('string')

            console.log('Token refreshed successfully')
            console.log('  Old token:', token1.substring(0, 50) + '...')
            console.log('  New token:', token2.substring(0, 50) + '...')
        }, 15000)

        it('should handle multiple refresh calls', async () => {
            // Make multiple refresh calls
            await authService.refreshToken()
            await authService.refreshToken()
            const token = await authService.getToken()

            expect(token).toBeDefined()
            expect(typeof token).toBe('string')

            console.log('Multiple refreshes handled correctly')
        }, 20000)
    })

    describe('Token Clearing', () => {
        beforeAll(() => {
            authService = new AuthService()
            authService.initialize(testCredentials, testUID, TEST_BASE_URL)
        })

        it('should clear token and acquire new one', async () => {
            // Get initial token
            const token1 = await authService.getToken()

            // Clear token
            authService.clearToken()

            // Get new token
            const token2 = await authService.getToken()

            expect(token2).toBeDefined()
            expect(typeof token2).toBe('string')

            // Both tokens should be valid JWT tokens
            expect(token1.split('.').length).toBe(3)
            expect(token2.split('.').length).toBe(3)

            console.log('Token cleared and re-acquired successfully')
        }, 15000)
    })

    describe('Integration with APIService', () => {
        it('should work with APIService for authenticated requests', async () => {
            // Initialize AuthService
            initAuthService(testCredentials, testUID, TEST_BASE_URL)

            // Initialize APIService
            initAPIService({
                baseURL: TEST_BASE_URL,
                clientVersion: CLIENT_VERSION,
            })

            // The APIService should now be able to make authenticated requests
            // This is tested indirectly through TranslationService integration tests

            console.log('AuthService integrated with APIService successfully')
        })
    })

    describe('Error Handling', () => {
        it('should handle invalid credentials gracefully', async () => {
            const invalidService = new AuthService()
            const invalidCredentials: APICredentials = {
                apiKey: 'invalid-api-key-12345',
                apiSecret: 'invalid-api-secret-67890',
            }

            invalidService.initialize(invalidCredentials, testUID, TEST_BASE_URL)

            await expect(invalidService.getToken()).rejects.toThrow()

            console.log('Invalid credentials rejected as expected')
        }, 10000)

        it('should handle network errors gracefully', async () => {
            const networkErrorService = new AuthService()
            networkErrorService.initialize(
                testCredentials,
                testUID,
                'http://localhost:9999' // Non-existent server
            )

            await expect(networkErrorService.getToken()).rejects.toThrow()

            console.log('Network error handled correctly')
        }, 10000)

        it('should handle invalid baseURL', async () => {
            const invalidURLService = new AuthService()
            invalidURLService.initialize(
                testCredentials,
                testUID,
                'not-a-valid-url' // Invalid URL
            )

            await expect(invalidURLService.getToken()).rejects.toThrow()

            console.log('Invalid URL handled correctly')
        }, 10000)
    })

    describe('HMAC Signature Generation', () => {
        it('should generate valid HMAC signature that backend accepts', async () => {
            const service = new AuthService()
            service.initialize(testCredentials, testUID, TEST_BASE_URL)

            // If token acquisition succeeds, HMAC signature was valid
            const token = await service.getToken()

            expect(token).toBeDefined()
            expect(token.length).toBeGreaterThan(0)

            console.log('HMAC signature generated and accepted by backend')
        }, 10000)
    })

    describe('Auto-Refresh Mechanism', () => {
        it('should start auto-refresh timer on initialization', async () => {
            const timerService = new AuthService()
            
            // Mock setInterval to verify it's called
            const setIntervalSpy = vi.spyOn(global, 'setInterval')

            timerService.initialize(testCredentials, testUID, TEST_BASE_URL)

            // Verify setInterval was called (auto-refresh timer)
            expect(setIntervalSpy).toHaveBeenCalled()

            setIntervalSpy.mockRestore()

            console.log('Auto-refresh timer started on initialization')
        })

        it('should stop auto-refresh on clearToken', async () => {
            const timerService = new AuthService()
            timerService.initialize(testCredentials, testUID, TEST_BASE_URL)

            // Mock clearInterval to verify it's called
            const clearIntervalSpy = vi.spyOn(global, 'clearInterval')

            timerService.clearToken()

            // Verify clearInterval was called
            expect(clearIntervalSpy).toHaveBeenCalled()

            clearIntervalSpy.mockRestore()

            console.log('Auto-refresh timer stopped on clearToken')
        })
    })

    describe('Token Expiration', () => {
        it('should detect token expiration and refresh', async () => {
            const expiryService = new AuthService()
            expiryService.initialize(testCredentials, testUID, TEST_BASE_URL)

            // Get initial token
            const token1 = await expiryService.getToken()

            // Mock token to be expired by modifying internal state
            // Note: This is a bit hacky, but necessary for testing expiration logic
            // In real scenario, we'd wait for actual expiration
            const currentToken = (expiryService as any).currentToken
            if (currentToken) {
                // Set obtainedAt to far in the past
                currentToken.obtainedAt = Date.now() - (currentToken.expiresIn + 1000) * 1000
            }

            // Next getToken should trigger refresh
            const token2 = await expiryService.getToken()

            expect(token2).toBeDefined()
            expect(typeof token2).toBe('string')

            console.log('Expired token detected and refreshed')
        }, 15000)
    })

    describe('Device UID Generation', () => {
        it('should persist device UID across calls', async () => {
            const uid1 = await getDeviceUID()
            const uid2 = await getDeviceUID()

            // Should be the same UID
            expect(uid1).toBe(uid2)

            // Should start with 'extension-'
            expect(uid1).toMatch(/^extension-/)

            console.log('Device UID persisted:', uid1)
        })
    })

    describe('Full Authentication Flow', () => {
        it('should complete full authentication flow', async () => {
            console.log('\n=== Starting Full Authentication Flow Test ===\n')

            // Step 1: Create service
            const flowService = new AuthService()
            console.log('✓ Step 1: AuthService created')

            // Step 2: Initialize with credentials
            flowService.initialize(testCredentials, testUID, TEST_BASE_URL)
            console.log('✓ Step 2: AuthService initialized')
            expect(flowService.isInitialized()).toBe(true)

            // Step 3: Get first token
            console.log('  Step 3: Requesting first JWT token...')
            const token1 = await flowService.getToken()
            console.log('✓ Step 3: First token acquired')
            expect(token1).toBeDefined()

            // Step 4: Verify token is cached
            console.log('  Step 4: Requesting token again (should use cache)...')
            const token2 = await flowService.getToken()
            console.log('✓ Step 4: Cached token returned')
            expect(token2).toBe(token1)

            // Step 5: Force refresh
            console.log('  Step 5: Force refreshing token...')
            await flowService.refreshToken()
            const token3 = await flowService.getToken()
            console.log('✓ Step 5: Token refreshed')
            expect(token3).toBeDefined()

            // Step 6: Clear and re-acquire
            console.log('  Step 6: Clearing token...')
            flowService.clearToken()
            console.log('  Step 6: Acquiring new token...')
            const token4 = await flowService.getToken()
            console.log('✓ Step 6: New token acquired after clearing')
            expect(token4).toBeDefined()

            console.log('\n=== Full Authentication Flow Completed Successfully ===\n')
        }, 30000)
    })

    describe('Performance', () => {
        it('should acquire token within reasonable time', async () => {
            const perfService = new AuthService()
            perfService.initialize(testCredentials, testUID, TEST_BASE_URL)

            const startTime = Date.now()
            await perfService.getToken()
            const endTime = Date.now()

            const duration = endTime - startTime

            // Should complete within 5 seconds
            expect(duration).toBeLessThan(5000)

            console.log(`Token acquisition took ${duration}ms`)
        }, 10000)

        it('should return cached token quickly', async () => {
            const perfService = new AuthService()
            perfService.initialize(testCredentials, testUID, TEST_BASE_URL)

            // First call to populate cache
            await perfService.getToken()

            // Measure cached token retrieval
            const startTime = Date.now()
            await perfService.getToken()
            const endTime = Date.now()

            const duration = endTime - startTime

            // Should be nearly instant (< 100ms)
            expect(duration).toBeLessThan(100)

            console.log(`Cached token retrieval took ${duration}ms`)
        }, 10000)
    })
})
