/**
 * Parameters for synthesizing speech.
 */
export interface SynthesizeSpeechParams {
    /**
     * The text to be synthesized.
     */
    text: string

    /**
     * The language of the text.
     */
    language?: string
}

/**
 * Represents the result of a successful speech synthesis.
 */
export interface SpeechSynthesisResult {
    /**
     * The synthesized audio data as a base64 string.
     */
    audio: string

    /**
     * Whether the audio was retrieved from cache (true) or freshly synthesized (false).
     * Used to determine if quota should be consumed.
     */
    cacheHit: boolean
}
