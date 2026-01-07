/**
 * Integration tests for ConfigService
 *
 * Tests real cloud service integration (NO MOCKS):
 * 1. Loads real dev API credentials from other/key/dev/
 * 2. Initializes AuthService and APIService with real backend
 * 3. Makes actual HTTP requests to DEFAULT_BASE_URL
 * 4. Tests caching, config fetching, and error handling
 *
 * ⚠️ REQUIREMENTS:
 * - Backend service must be running at DEFAULT_BASE_URL
 * - Valid API credentials must exist in other/key/dev/
 * - Tests will fail if backend is unreachable
 */

import { readFileSync } from 'fs'
import { join } from 'path'
import { afterEach, beforeAll, beforeEach, describe, expect, it, vi } from 'vitest'
import { CLIENT_VERSION, CONFIG_ENDPOINTS, DEFAULT_BASE_URL } from '../../../src/5_backend/constants'
import { initAPIService } from '../../../src/5_backend/services/APIService'
import { initAuthService } from '../../../src/5_backend/services/AuthService'
import { ConfigService } from '../../../src/5_backend/services/ConfigService'
import type { APICredentials } from '../../../src/5_backend/types/AuthTypes'

// Load API credentials from dev files
function loadDevCredentials(): APICredentials {
    const projectRoot = join(__dirname, '../../..')
    const apiKey = readFileSync(join(projectRoot, 'other/key/dev/apikey.txt'), 'utf-8').trim()
    const apiSecret = readFileSync(join(projectRoot, 'other/key/dev/apisecret.txt'), 'utf-8').trim()
    return { apiKey, apiSecret }
}

// Generate a test device UID
function generateTestUID(): string {
    return `test-extension-${Date.now()}-${Math.random().toString(36).substring(7)}`
}

// Mock chrome.storage for tests
const mockStorage: Record<string, any> = {}

global.chrome = {
    storage: {
        local: {
            get: vi.fn(async (keys: string | string[]) => {
                const keyArray = Array.isArray(keys) ? keys : [keys]
                const result: Record<string, any> = {}
                keyArray.forEach(key => {
                    if (key in mockStorage) {
                        result[key] = mockStorage[key]
                    }
                })
                return result
            }),
            set: vi.fn(async (items: Record<string, any>) => {
                Object.assign(mockStorage, items)
            }),
        },
        sync: {
            get: vi.fn(async () => ({})),
            set: vi.fn(async () => {}),
        },
    },
    runtime: {
        id: 'test-extension-id',
    },
} as any

describe('ConfigService - Real API Integration', () => {
    let service: ConfigService

    beforeAll(async () => {
        // Load dev credentials
        const credentials = loadDevCredentials()
        const uid = generateTestUID()
        
        // Initialize AuthService and APIService with real backend
        console.log('Initializing services with base URL:', DEFAULT_BASE_URL)
        console.log('Using test UID:', uid)
        
        initAuthService(credentials, uid, DEFAULT_BASE_URL)
        await initAPIService({ baseURL: DEFAULT_BASE_URL })
    })

    beforeEach(() => {
        service = new ConfigService()
        // Clear mock storage
        Object.keys(mockStorage).forEach(key => delete mockStorage[key])
    })

    afterEach(() => {
        service.shutdown()
    })

    describe('Initialization', () => {
        it('should initialize and fetch real config from cloud', async () => {
            await service.initialize(CONFIG_ENDPOINTS.CONFIG, 60000)

            expect(service.isReady()).toBe(true)
            
            const config = service.getConfig()
            expect(config).toBeDefined()
            expect(config.quota).toBeDefined()
            expect(typeof config.quota.dailyFreeTranslations).toBe('number')
            expect(config.quota.dailyFreeTranslations).toBeGreaterThan(0)
            
            console.log('Fetched real config:', config)
        }, 10000) // 10 second timeout for network request

        it('should not initialize twice', async () => {
            await service.initialize(CONFIG_ENDPOINTS.CONFIG, 60000)
            const firstReady = service.isReady()

            await service.initialize(CONFIG_ENDPOINTS.CONFIG, 60000)
            const secondReady = service.isReady()

            expect(firstReady).toBe(true)
            expect(secondReady).toBe(true)
        }, 10000)
    })

    describe('Fetching Config', () => {
        it('should fetch real config from API on initialization', async () => {
            await service.initialize(CONFIG_ENDPOINTS.CONFIG, 60000)

            const config = service.getConfig()
            expect(config.quota).toBeDefined()
            expect(config.quota.dailyFreeTranslations).toBeGreaterThan(0)
        }, 10000)

        it('should return fetched config with correct structure', async () => {
            await service.initialize(CONFIG_ENDPOINTS.CONFIG, 60000)
            const config = service.getConfig()

            // Verify config structure
            expect(config).toHaveProperty('quota')
            expect(config.quota).toHaveProperty('dailyFreeTranslations')
            expect(config.quota).toHaveProperty('dailyFreeSpeech')
            expect(config).toHaveProperty('websiteUrl')
            expect(config).toHaveProperty('chromeExtensionVersion')
            expect(typeof config.quota.dailyFreeTranslations).toBe('number')
            expect(typeof config.quota.dailyFreeSpeech).toBe('number')
            expect(typeof config.websiteUrl).toBe('string')
            expect(typeof config.chromeExtensionVersion).toBe('string')
        }, 10000)
    })

    describe('Caching', () => {
        it('should save config to chrome.storage.local', async () => {
            await service.initialize(CONFIG_ENDPOINTS.CONFIG, 60000)

            expect(chrome.storage.local.set).toHaveBeenCalled()
            expect(mockStorage.cloudConfig).toBeDefined()
            expect(mockStorage.cloudConfig.data).toBeDefined()
            expect(mockStorage.cloudConfig.data.quota).toBeDefined()
            expect(mockStorage.cloudConfig.version).toBe(CLIENT_VERSION)
        }, 10000)

        it('should load cached config on initialization', async () => {
            // First initialization to populate cache
            await service.initialize(CONFIG_ENDPOINTS.CONFIG, 60000)
            const firstConfig = service.getConfig()
            service.shutdown()

            // Create new service instance - should load from cache
            const service2 = new ConfigService()
            await service2.initialize(CONFIG_ENDPOINTS.CONFIG, 60000)
            const cachedConfig = service2.getConfig()

            expect(cachedConfig.quota.dailyFreeTranslations).toBe(firstConfig.quota.dailyFreeTranslations)
            
            service2.shutdown()
        }, 15000)

        it('should ignore cached config from different version', async () => {
            // Pre-populate cache with old version
            const cachedConfig = {
                data: {
                    quota: {
                        dailyFreeTranslations: 999,
                        dailyFreeSpeech: 888,
                    },
                    websiteUrl: 'old-website.com',
                    chromeExtensionVersion: '0.0.1',
                },
                fetchedAt: Date.now(),
                version: '0.0.1', // Old version
            }
            mockStorage.cloudConfig = cachedConfig

            // Initialize - should fetch fresh config due to version mismatch
            await service.initialize(CONFIG_ENDPOINTS.CONFIG, 60000)
            const config = service.getConfig()

            // Should NOT use the cached values
            expect(config.quota.dailyFreeTranslations).not.toBe(999)
            expect(config.quota.dailyFreeTranslations).toBeGreaterThan(0)
            expect(config.quota.dailyFreeSpeech).not.toBe(888)
            expect(config.quota.dailyFreeSpeech).toBeGreaterThan(0)
            expect(config.websiteUrl).not.toBe('old-website.com')
            expect(config.chromeExtensionVersion).not.toBe('0.0.1')
        }, 10000)
    })

    describe('Getting Config Values', () => {
        it('should get daily free translations from real API', async () => {
            await service.initialize(CONFIG_ENDPOINTS.CONFIG, 60000)
            const quota = service.getDailyFreeTranslations()

            expect(typeof quota).toBe('number')
            expect(quota).toBeGreaterThan(0)
            
            console.log('Daily free translations quota:', quota)
        }, 10000)

        it('should get daily free speech from real API', async () => {
            await service.initialize(CONFIG_ENDPOINTS.CONFIG, 60000)
            const quota = service.getDailyFreeSpeech()

            expect(typeof quota).toBe('number')
            expect(quota).toBeGreaterThan(0)
            
            console.log('Daily free speech quota:', quota)
        }, 10000)

        it('should get official website URL', async () => {
            await service.initialize(CONFIG_ENDPOINTS.CONFIG, 60000)
            const websiteUrl = service.getOfficialWebsite()

            expect(typeof websiteUrl).toBe('string')
            expect(websiteUrl.length).toBeGreaterThan(0)
            
            console.log('Official website URL:', websiteUrl)
        }, 10000)

        it('should get Chrome extension version', async () => {
            await service.initialize(CONFIG_ENDPOINTS.CONFIG, 60000)
            const version = service.getChromeExtensionVersion()

            expect(typeof version).toBe('string')
            expect(version.length).toBeGreaterThan(0)
            
            console.log('Chrome extension version:', version)
        }, 10000)

        it('should return default value when not initialized', () => {
            const translationQuota = service.getDailyFreeTranslations()
            const speechQuota = service.getDailyFreeSpeech()
            const websiteUrl = service.getOfficialWebsite()
            const version = service.getChromeExtensionVersion()

            // Should return default values
            expect(translationQuota).toBe(100)
            expect(speechQuota).toBe(300)
            expect(websiteUrl).toBe('www.tapword.cc')
            expect(version).toBe('0.0.0')
        })

        it('should return a copy of config to prevent external modifications', async () => {
            await service.initialize(CONFIG_ENDPOINTS.CONFIG, 60000)
            const config1 = service.getConfig()
            const config2 = service.getConfig()

            // Modify one copy
            const originalQuota = config1.quota.dailyFreeTranslations
            config1.quota.dailyFreeTranslations = 999

            // Other copy should not be affected
            expect(config2.quota.dailyFreeTranslations).toBe(originalQuota)
            expect(config2.quota.dailyFreeTranslations).not.toBe(999)
        }, 10000)
    })

    describe('Refresh Config', () => {
        it('should force refresh config from API', async () => {
            await service.initialize(CONFIG_ENDPOINTS.CONFIG, 60000)
            const initialQuota = service.getDailyFreeTranslations()

            // Force refresh
            await service.refreshConfig()
            const refreshedQuota = service.getDailyFreeTranslations()

            // Both should be valid numbers (may or may not be different)
            expect(typeof initialQuota).toBe('number')
            expect(typeof refreshedQuota).toBe('number')
            expect(refreshedQuota).toBeGreaterThan(0)
        }, 15000)
    })

    describe('Shutdown', () => {
        it('should stop being ready after shutdown', async () => {
            await service.initialize(CONFIG_ENDPOINTS.CONFIG, 60000)
            expect(service.isReady()).toBe(true)

            service.shutdown()
            expect(service.isReady()).toBe(false)
        }, 10000)
    })
})
