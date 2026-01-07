/**
 * Fragment Translation Service
 *
 * Provides fragment translation using local LLM generation
 */

import * as loggerModule from "@/0_common/utils/logger"
import type {
    ChatMessage,
    FragmentTranslationRequest,
    FragmentTranslationResult,
    LLMConfig,
    LLMFragmentTranslationResponse,
} from "../types/GenerateTypes"
import * as promptLoaderModule from "../utils/promptLoader"
import * as templateRendererModule from "../utils/templateRenderer"
import * as languageUtilsModule from "../utils/languageUtils"
import * as constants from "../constants/GenerateConstants"
import { OpenAICompatibleClient } from "./llm/OpenAICompatibleClient"

const logger = loggerModule.createLogger("8_generate/FragmentTranslationService")

function escapeXmlChars(text: string): string {
    return text.replace(/</g, "&lt;").replace(/>/g, "&gt;")
}

function buildOptionalSection(title: string, value: string | undefined): string {
    if (value && value.trim().length > 0) {
        return `# ${title}\n${value.trim()}`
    }
    return ""
}

function buildContextText(params: {
    previousSentences?: string[]
    highlightedText: string
    nextSentences?: string[]
}): string {
    const cleanPrevious = (params.previousSentences ?? []).map((s) => s.replace(/\n/g, " ").trim()).filter(Boolean)
    const cleanNext = (params.nextSentences ?? []).map((s) => s.replace(/\n/g, " ").trim()).filter(Boolean)

    const previousText = cleanPrevious.join(" ")
    const nextText = cleanNext.join(" ")

    return [previousText, params.highlightedText, nextText].filter((part) => part.trim().length > 0).join(" ")
}

export class FragmentTranslationService {
    private client: OpenAICompatibleClient
    private systemPromptWithSentence: string | null = null
    private userPromptWithSentence: string | null = null
    private systemPromptFragmentOnly: string | null = null
    private userPromptFragmentOnly: string | null = null

    constructor(config: LLMConfig) {
        this.client = new OpenAICompatibleClient(config)
        logger.info("FragmentTranslationService initialized")
    }

    async initialize(): Promise<void> {
        logger.debug("Loading prompts for fragment translation")
        this.systemPromptWithSentence = await promptLoaderModule.loadSystemPrompt(constants.TASK_FRAGMENT_TRANSLATION)
        this.userPromptWithSentence = await promptLoaderModule.loadUserPromptTemplate(constants.TASK_FRAGMENT_TRANSLATION)
        this.systemPromptFragmentOnly = await promptLoaderModule.loadSystemPrompt(constants.TASK_FRAGMENT_ONLY_TRANSLATION)
        this.userPromptFragmentOnly = await promptLoaderModule.loadUserPromptTemplate(constants.TASK_FRAGMENT_ONLY_TRANSLATION)
        logger.info("Fragment translation prompts loaded successfully")
    }

    private buildUserPromptWithSentence(request: FragmentTranslationRequest): string {
        if (!this.userPromptWithSentence) {
            throw new Error("Service not initialized. Call initialize() first.")
        }

        const { fragment, leadingText, trailingText, sourceLanguage, targetLanguage, contextInfo } = request
        const { sourceName, targetName } = languageUtilsModule.getLanguageNames(sourceLanguage, targetLanguage)

        const cleanFragmentText = fragment.replace(/\n/g, " ").trim()
        const cleanLeadingText = (leadingText ?? "").replace(/\n/g, " ")
        const cleanTrailingText = (trailingText ?? "").replace(/\n/g, " ")
        const cleanSentenceText = `${cleanLeadingText}${cleanFragmentText}${cleanTrailingText}`.trim()

        const escapedFragment = escapeXmlChars(cleanFragmentText)
        const escapedLeading = escapeXmlChars(cleanLeadingText)
        const escapedTrailing = escapeXmlChars(cleanTrailingText)

        const highlightedSentence = `<sentence>${escapedLeading}<fragment>${escapedFragment}</fragment>${escapedTrailing}</sentence>`
        const contextText = buildContextText({
            previousSentences: contextInfo?.previousSentences,
            highlightedText: highlightedSentence,
            nextSentences: contextInfo?.nextSentences,
        })

        const sourceLanguageSection = buildOptionalSection("Source Language", sourceName)
        const targetLanguageSection = buildOptionalSection("Target Language", targetName)
        const targetFragmentSection = buildOptionalSection("Target Fragment", cleanFragmentText)
        const targetSentenceSection = buildOptionalSection("Target Sentence", cleanSentenceText)
        const contextSection = buildOptionalSection("Context", contextText)
        const sourceTypeSection = buildOptionalSection("Source Type", contextInfo?.sourceType)
        const sourceTitleSection = buildOptionalSection("Source Title", contextInfo?.sourceTitle)
        const sourceAuthorSection = buildOptionalSection("Source Author", contextInfo?.sourceAuthor)

        const variables: Record<string, string | undefined> = {
            sourceLanguageSection,
            targetLanguageSection,
            targetFragmentSection,
            targetSentenceSection,
            contextSection,
            sourceTypeSection,
            sourceTitleSection,
            sourceAuthorSection,
        }

        return templateRendererModule.renderTemplate(this.userPromptWithSentence, variables)
    }

    private buildUserPromptFragmentOnly(request: FragmentTranslationRequest): string {
        if (!this.userPromptFragmentOnly) {
            throw new Error("Service not initialized. Call initialize() first.")
        }

        const { fragment, sourceLanguage, targetLanguage, contextInfo } = request
        const { sourceName, targetName } = languageUtilsModule.getLanguageNames(sourceLanguage, targetLanguage)

        const cleanFragmentText = fragment.replace(/\n/g, " ").trim()
        const escapedFragment = escapeXmlChars(cleanFragmentText)

        const highlightedFragment = `<fragment>${escapedFragment}</fragment>`
        const contextText = buildContextText({
            previousSentences: contextInfo?.previousSentences,
            highlightedText: highlightedFragment,
            nextSentences: contextInfo?.nextSentences,
        })

        const sourceLanguageSection = buildOptionalSection("Source Language", sourceName)
        const targetLanguageSection = buildOptionalSection("Target Language", targetName)
        const targetFragmentSection = buildOptionalSection("Target Fragment", cleanFragmentText)
        const contextSection = buildOptionalSection("Context", contextText)
        const sourceTypeSection = buildOptionalSection("Source Type", contextInfo?.sourceType)
        const sourceTitleSection = buildOptionalSection("Source Title", contextInfo?.sourceTitle)
        const sourceAuthorSection = buildOptionalSection("Source Author", contextInfo?.sourceAuthor)

        const variables: Record<string, string | undefined> = {
            sourceLanguageSection,
            targetLanguageSection,
            targetFragmentSection,
            contextSection,
            sourceTypeSection,
            sourceTitleSection,
            sourceAuthorSection,
        }

        return templateRendererModule.renderTemplate(this.userPromptFragmentOnly, variables)
    }

    private buildMessages(request: FragmentTranslationRequest): { messages: ChatMessage[]; expectsSentence: boolean } {
        const hasSentence = Boolean(request.leadingText || request.trailingText)
        const messages: ChatMessage[] = []

        if (hasSentence) {
            if (!this.systemPromptWithSentence) {
                throw new Error("Service not initialized. Call initialize() first.")
            }
            const userPrompt = this.buildUserPromptWithSentence(request)
            messages.push({ role: "system", content: this.systemPromptWithSentence })
            messages.push({ role: "user", content: userPrompt })
            return { messages, expectsSentence: true }
        }

        if (!this.systemPromptFragmentOnly) {
            throw new Error("Service not initialized. Call initialize() first.")
        }

        const userPrompt = this.buildUserPromptFragmentOnly(request)
        messages.push({ role: "system", content: this.systemPromptFragmentOnly })
        messages.push({ role: "user", content: userPrompt })
        return { messages, expectsSentence: false }
    }

    private parseModelResponse(content: string, expectsSentence: boolean): FragmentTranslationResult {
        try {
            const parsed = JSON.parse(content) as LLMFragmentTranslationResponse

            if (!parsed.translation) {
                throw new Error("Missing translation in response")
            }

            return {
                translation: parsed.translation.trim(),
                sentenceTranslation: expectsSentence ? parsed.sentence_translation?.trim() : undefined,
            }
        } catch (error) {
            logger.error("Failed to parse fragment LLM response:", error)
            throw new Error("Could not parse fragment translation response from LLM")
        }
    }

    async translateFragment(request: FragmentTranslationRequest): Promise<FragmentTranslationResult> {
        if (!this.systemPromptWithSentence || !this.userPromptWithSentence || !this.systemPromptFragmentOnly || !this.userPromptFragmentOnly) {
            throw new Error("Service not initialized. Call initialize() first.")
        }

        logger.debug("Starting fragment translation")

        const { messages, expectsSentence } = this.buildMessages(request)

        const rawContent = await this.client.generate(messages)

        const result = this.parseModelResponse(rawContent, expectsSentence)

        logger.info("Fragment translation completed")

        return result
    }
}

export async function createFragmentTranslationService(config: LLMConfig): Promise<FragmentTranslationService> {
    const service = new FragmentTranslationService(config)
    await service.initialize()
    return service
}

export async function translateFragment(
    request: FragmentTranslationRequest,
    config: LLMConfig
): Promise<FragmentTranslationResult> {
    const service = await createFragmentTranslationService(config)
    return service.translateFragment(request)
}
