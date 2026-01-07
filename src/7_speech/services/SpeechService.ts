import { APP_EDITION } from "@/0_common/constants"
import { createLogger } from "@/0_common/utils/logger"
import { post } from "@/5_backend"
import { SPEECH_API_ENDPOINTS } from "../constants/SpeechConstants"
import { SpeechError } from "../types/SpeechErrors"
import { SpeechApiRequest, SpeechApiResponse } from "../types/SpeechApiTypes"
import { SpeechSynthesisResult, SynthesizeSpeechParams } from "../types/SpeechModels"
import { VoiceCacheService } from "./VoiceCacheService"

const logger = createLogger("SpeechService")
const voiceCacheService = new VoiceCacheService()

/**
 * Synthesizes speech from text.
 *
 * @param params - Speech synthesis parameters.
 * @returns A promise that resolves with the synthesized audio.
 * @throws {APIError} for API-related errors.
 */
export async function synthesizeSpeech(params: SynthesizeSpeechParams): Promise<SpeechSynthesisResult> {
    if (APP_EDITION === "community") {
        throw new SpeechError({ type: "communityUnsupported" })
    }

    const { text, language } = params
    const cacheKey = `${language || "en"}:${text}`

    // Check cache first
    const cachedAudio = voiceCacheService.get(cacheKey)
    if (cachedAudio) {
        logger.info("Speech synthesis cache hit:", cacheKey)
        return { audio: cachedAudio, cacheHit: true }
    }

    logger.info("Speech synthesis cache miss:", cacheKey)

    const request: SpeechApiRequest = {
        text,
        language,
    }

    logger.info("Sending speech synthesis request:", request)

    const data = await post<SpeechApiResponse, SpeechApiRequest>(SPEECH_API_ENDPOINTS.SYNTHESIZE, request)

    logger.info("Speech synthesis response data received")

    // Cache the raw base64 audio data
    voiceCacheService.put(cacheKey, data.audio)

    return {
        audio: data.audio,
        cacheHit: false,
    }
}
