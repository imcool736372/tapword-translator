/**
 * AuthService Simple Test - JWT Token Acquisition Only
 * 
 * This is a minimal test file focusing only on JWT token acquisition.
 * Use this for debugging backend authentication issues.
 * 
 * Prerequisites:
 * - Backend server running on https://api.tapword.cc
 * - Valid API credentials in other/key/
 * - Run: npm run build (to generate credentials.ts)
 * 
 * Run:
 * npm test -- tests/5_backend/services/AuthService.simple.test.ts
 */

import { afterAll, beforeAll, describe, expect, it } from 'vitest'
import { BUILD_TIME_CREDENTIALS, hasBuildTimeCredentials } from '../../../src/5_backend/config/credentials'
import { DEFAULT_BASE_URL } from '../../../src/5_backend/constants'
import { AuthService } from '../../../src/5_backend/services/AuthService'
import type { APICredentials } from '../../../src/5_backend/types/AuthTypes'

describe('AuthService - JWT Token Acquisition (Simple Test)', () => {
    let authService: AuthService
    let testCredentials: APICredentials
    const testUID = 'test-device-simple-' + Date.now()
    const TEST_BASE_URL = DEFAULT_BASE_URL

    beforeAll(() => {
        // Disable SSL certificate verification for local development
        process.env.NODE_TLS_REJECT_UNAUTHORIZED = '0'

        // Check if build-time credentials are available
        if (!hasBuildTimeCredentials()) {
            throw new Error(
                '❌ Build-time credentials not found!\n\n' +
                'Please run the following commands:\n' +
                '  1. echo "your-api-key" > other/key/apikey.txt\n' +
                '  2. echo "your-api-secret" > other/key/apisecret.txt\n' +
                '  3. npm run build\n'
            )
        }

        // Get credentials from build-time injection
        console.log('\n========================================')
        console.log('🔍 Debugging Credentials Extraction')
        console.log('========================================')
        console.log('hasBuildTimeCredentials():', hasBuildTimeCredentials())
        console.log('BUILD_TIME_CREDENTIALS.apiKey type:', typeof BUILD_TIME_CREDENTIALS.apiKey)
        console.log('BUILD_TIME_CREDENTIALS.apiSecret type:', typeof BUILD_TIME_CREDENTIALS.apiSecret)
        console.log('BUILD_TIME_CREDENTIALS.apiKey length:', BUILD_TIME_CREDENTIALS.apiKey?.length || 0)
        console.log('BUILD_TIME_CREDENTIALS.apiSecret length:', BUILD_TIME_CREDENTIALS.apiSecret?.length || 0)
        console.log('========================================\n')

        testCredentials = {
            apiKey: BUILD_TIME_CREDENTIALS.apiKey!,
            apiSecret: BUILD_TIME_CREDENTIALS.apiSecret!,
        }

        console.log('========================================')
        console.log('🔧 Test Configuration')
        console.log('========================================')
        console.log('Base URL:', TEST_BASE_URL)
        console.log('testCredentials.apiKey length:', testCredentials.apiKey.length)
        console.log('testCredentials.apiSecret length:', testCredentials.apiSecret.length)
        console.log('Device UID:', testUID)
        console.log('========================================\n')

        // Initialize AuthService
        authService = new AuthService()
        
        console.log('Before initialize - checking credentials:')
        console.log('  apiKey type:', typeof testCredentials.apiKey)
        console.log('  apiSecret type:', typeof testCredentials.apiSecret)
        console.log('  apiKey length:', testCredentials.apiKey.length)
        console.log('  apiSecret length:', testCredentials.apiSecret.length)
        console.log('  apiKey is empty?', testCredentials.apiKey === '')
        console.log('  apiSecret is empty?', testCredentials.apiSecret === '')
        console.log('')
        
        authService.initialize(testCredentials, testUID, TEST_BASE_URL)
        console.log('✓ AuthService initialized\n')
        
        // Verify credentials are stored correctly
        console.log('After initialize - verifying internal state:')
        console.log('  isInitialized:', authService.isInitialized())
        console.log('')
    })

    afterAll(() => {
        // Restore SSL certificate verification
        delete process.env.NODE_TLS_REJECT_UNAUTHORIZED
        console.log('\n✓ Test cleanup completed\n')
    })

    it('should successfully acquire JWT token from backend', async () => {
        console.log('========================================')
        console.log('🚀 Starting JWT Token Acquisition Test')
        console.log('========================================\n')

        console.log('Step 1: Requesting JWT token from backend...')
        console.log('Endpoint:', `${TEST_BASE_URL}/api/v1/auth/extension/token`)
        console.log('Method: POST')
        console.log('Timestamp:', new Date().toISOString())
        console.log('')

        // Request token
        const token = await authService.getToken()

        console.log('\n========================================')
        console.log('✅ JWT Token Acquired Successfully!')
        console.log('========================================')
        console.log('Token (first 50 chars):', token.substring(0, 50) + '...')
        console.log('Token (last 20 chars): ...', token.substring(token.length - 20))
        console.log('Token length:', token.length, 'characters')
        console.log('')

        // Verify token format
        const tokenParts = token.split('.')
        console.log('Token structure:')
        console.log('  - Header length:', tokenParts[0]?.length || 0)
        console.log('  - Payload length:', tokenParts[1]?.length || 0)
        console.log('  - Signature length:', tokenParts[2]?.length || 0)
        console.log('')

        // Assertions
        expect(token).toBeDefined()
        expect(typeof token).toBe('string')
        expect(token.length).toBeGreaterThan(0)
        expect(tokenParts.length).toBe(3) // JWT has 3 parts: header.payload.signature

        console.log('✅ All assertions passed!')
        console.log('========================================\n')

        // Optional: Decode JWT header and payload (base64)
        try {
            const header = JSON.parse(Buffer.from(tokenParts[0], 'base64').toString())
            const payload = JSON.parse(Buffer.from(tokenParts[1], 'base64').toString())
            
            console.log('📋 Decoded JWT Token Information:')
            console.log('========================================')
            console.log('Header:', JSON.stringify(header, null, 2))
            console.log('')
            console.log('Payload:', JSON.stringify(payload, null, 2))
            console.log('========================================\n')

            if (payload.exp) {
                const expiryDate = new Date(payload.exp * 1000)
                const now = new Date()
                const remainingTime = expiryDate.getTime() - now.getTime()
                const remainingMinutes = Math.floor(remainingTime / 1000 / 60)
                
                console.log('⏱️  Token Expiry Information:')
                console.log('Expires at:', expiryDate.toISOString())
                console.log('Current time:', now.toISOString())
                console.log('Remaining time:', remainingMinutes, 'minutes')
                console.log('========================================\n')
            }
        } catch (error) {
            console.log('⚠️  Note: Could not decode JWT token (this is normal for encrypted tokens)')
            console.log('Error:', error instanceof Error ? error.message : String(error))
            console.log('')
        }

        console.log('🎉 Test completed successfully!\n')
    }, 30000) // 30 second timeout
})
