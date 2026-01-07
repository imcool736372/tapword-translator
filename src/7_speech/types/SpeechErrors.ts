import * as i18nModule from "@/0_common/utils/i18n"

export type SpeechErrorType = "communityUnsupported" | "unexpected"

interface SpeechErrorParams {
    type: SpeechErrorType
    message?: string
}

const i18nKeyMap: Record<SpeechErrorType, string> = {
    communityUnsupported: "error.speech.communityUnsupported",
    unexpected: "error.speech.unexpected",
}

/**
 * Speech module error with module identifier and localized message.
 */
export class SpeechError extends Error {
    readonly module = "speech"
    readonly type: SpeechErrorType

    constructor(params: SpeechErrorParams) {
        const message = params.message ?? i18nModule.translate(i18nKeyMap[params.type])
        super(message)
        this.name = "SpeechError"
        this.type = params.type
    }
}
