import { afterAll, beforeAll, describe, expect, it } from "vitest"
import { initAPIService } from "../../../src/5_backend"
import { synthesizeSpeech } from "../../../src/7_speech"

describe("SpeechService Integration Tests", () => {
    const TEST_BASE_URL = "https://local.tapword.cc"
    const TEST_JWT_TOKEN = "test-random-jwt-token-12345"

    beforeAll(() => {
        process.env.NODE_TLS_REJECT_UNAUTHORIZED = "0"

        initAPIService({
            baseURL: TEST_BASE_URL,
            clientVersion: "1.0.0",
            getToken: async () => TEST_JWT_TOKEN,
            refreshToken: async () => {
                // No-op for integration tests
            },
        })
    })

    afterAll(() => {
        delete process.env.NODE_TLS_REJECT_UNAUTHORIZED
    })

    it("should return a blob on successful synthesis", async () => {
        // Act
        const result = await synthesizeSpeech({ text: "hello", language: "en" })

        // Assert
        expect(result.audio).toBeInstanceOf(Blob)
        expect(result.audio.type).toBe("audio/wav")
        expect(result.audio.size).toBeGreaterThan(0)
    }, 30000)

    it("should handle API errors gracefully", async () => {
        // Arrange
        initAPIService({
            baseURL: "http://localhost:9999", // Non-existent port
            clientVersion: "1.0.0",
            getToken: async () => TEST_JWT_TOKEN,
        })

        // Act & Assert
        await expect(synthesizeSpeech({ text: "test", language: "en" })).rejects.toThrow()

        // Restore correct configuration for other tests
        initAPIService({
            baseURL: TEST_BASE_URL,
            clientVersion: "1.0.0",
            getToken: async () => TEST_JWT_TOKEN,
        })
    }, 10000)
})
