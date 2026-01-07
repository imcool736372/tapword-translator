/**
 * Quota Exceeded Error
 *
 * Custom error thrown when daily quota is exceeded
 * This is independent from APIError and is thrown by QuotaManager
 */

export class QuotaExceededError extends Error {
    public readonly quotaType: "translation" | "speech"

    constructor(quotaType: "translation" | "speech", message: string) {
        super(message)
        this.name = "QuotaExceededError"
        this.quotaType = quotaType
    }
}
