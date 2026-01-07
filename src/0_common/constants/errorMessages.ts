/**
 * User-facing error messages
 *
 * Centralized error messages for consistent user experience
 * These messages are displayed directly to users in the UI
 */

export const ERROR_MESSAGES = {
    SERVER_BUSY: "网络繁忙,请稍后再试",
    SERVICE_UNAVAILABLE: "服务暂不可用,请稍后再试",
    CONTENT_BLOCKED: "翻译内容可能包含不适宜内容,已被拦截",
    RATE_LIMITED: "翻译太快啦, 休息一下吧",
    QUOTA_EXCEEDED_SHORT: "额度用光了",
} as const
