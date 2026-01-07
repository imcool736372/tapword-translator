/**
 * Represents the request body for the Speech Synthesis API.
 */
export interface SpeechApiRequest {
    /**
     * The text content to be converted into speech.
     */
    text: string

    /**
     * Optional language code (e.g., 'en', 'zh', 'ja').
     * Defaults to 'en'. Determines the voice type to be used.
     */
    language?: string
}

/**
 * Represents the successful data structure for the Speech Synthesis API response.
 */
export interface SpeechApiResponse {
    /**
     * Base64-encoded WAV audio data.
     */
    audio: string
}
