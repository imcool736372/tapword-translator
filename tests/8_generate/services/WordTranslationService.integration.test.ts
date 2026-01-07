/**
 * WordTranslationService Integration Test (local LLM)
 *
 * Requires environment variables:
 *   LOCAL_LLM_API_KEY
 *   LOCAL_LLM_BASE_URL
 *   LOCAL_LLM_MODEL
 * Optionally:
 *   LOCAL_LLM_TEMPERATURE
 *   LOCAL_LLM_MAX_TOKENS
 *   LOCAL_LLM_TIMEOUT
 *
 * Prompts are loaded directly from resources to avoid chrome runtime dependency in tests.
 */

import { describe, it, expect, vi, beforeAll, afterAll } from "vitest"
import * as fs from "fs"
import * as path from "path"
import { WordTranslationService } from "@/8_generate/services/WordTranslationService"
import * as promptLoaderModule from "@/8_generate/utils/promptLoader"
import type { LLMConfig } from "@/8_generate/types/GenerateTypes"
import { LOCAL_LLM_DEFAULT_CONFIG } from "@/6_translate/constants/TranslationConstants"

function readPrompt(file: string): string {
    const promptPath = path.resolve(__dirname, "../../../resources/8_generate/word_translation", file)
    return fs.readFileSync(promptPath, "utf-8")
}

function buildConfigFromConstants(): LLMConfig | null {
    const { apiKey, baseUrl, model, temperature, maxTokens, timeout } = LOCAL_LLM_DEFAULT_CONFIG
    const isPlaceholder = !apiKey || apiKey.startsWith("PUT_YOUR_LOCAL_LLM_API_KEY_HERE")
    if (isPlaceholder || !baseUrl || !model) {
        return null
    }
    return {
        apiKey,
        baseUrl,
        model,
        temperature,
        maxTokens,
        timeout,
    }
}

describe("WordTranslationService (local LLM)", () => {
    const config = buildConfigFromConstants()

    if (!config) {
        it.skip("skips because LOCAL_LLM_DEFAULT_CONFIG has no apiKey (set it in TranslationConstants.ts)", () => {
            expect(true).toBe(true)
        })
        return
    }

    const systemPrompt = readPrompt("system_prompt.txt")
    const userPromptTemplate = readPrompt("user_prompt_template.txt")
    const fewshot = JSON.parse(
        fs.readFileSync(path.resolve(__dirname, "../../../resources/8_generate/word_translation/en/fewshot.json"), "utf-8")
    )

    let service: WordTranslationService
    let systemSpy: ReturnType<typeof vi.spyOn>
    let templateSpy: ReturnType<typeof vi.spyOn>
    let fewshotSpy: ReturnType<typeof vi.spyOn>

    beforeAll(async () => {
        systemSpy = vi.spyOn(promptLoaderModule, "loadSystemPrompt").mockResolvedValue(systemPrompt)
        templateSpy = vi.spyOn(promptLoaderModule, "loadUserPromptTemplate").mockResolvedValue(userPromptTemplate)
        fewshotSpy = vi.spyOn(promptLoaderModule, "loadFewshot").mockResolvedValue(fewshot)

        service = new WordTranslationService(config)
        await service.initialize()
    })

    afterAll(() => {
        systemSpy.mockRestore()
        templateSpy.mockRestore()
        fewshotSpy.mockRestore()
    })

    it(
        "translates a word with context via local LLM",
        async () => {
            const result = await service.translateWord({
                word: "light",
                leadingText: "The room was filled with natural ",
                trailingText: " from the large windows.",
                sourceLanguage: "en",
                targetLanguage: "zh",
                contextInfo: {
                    previousSentences: ["He opened the curtains."],
                    nextSentences: ["It made the space feel warm and inviting."],
                    sourceTitle: "Sample Book",
                    sourceAuthor: "John Doe",
                },
            })

            expect(result).toBeDefined()
            expect(typeof result.wordTranslation).toBe("string")
            expect(result.wordTranslation.length).toBeGreaterThan(0)

            // Fragment translation may or may not be present depending on the model response
            if (result.fragmentTranslation) {
                expect(typeof result.fragmentTranslation).toBe("string")
            }

            console.log("Local LLM translation result:", result)
        },
        30000
    )
})
