/**
 * Translation Error
 *
 * Custom error class for translation errors with user-friendly messages
 * Thrown by TranslationService when translation fails
 */

/**
 * Translation error with full and short message variants
 */
export class TranslationError extends Error {
    /**
     * Short version of error message for compact UI display
     */
    shortMessage?: string

    /**
     * Create a translation error
     * @param message - Full error message
     * @param shortMessage - Optional short error message for compact display
     */
    constructor(message: string, shortMessage?: string) {
        super(message)
        this.name = "TranslationError"
        this.shortMessage = shortMessage
    }
}
