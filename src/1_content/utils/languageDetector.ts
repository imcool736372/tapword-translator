/**
 * Language Detection Utility
 *
 * Prefer Chrome's built-in detector, then fallback to franc-min.
 * Keep sync API as a minimal fallback only.
 */
import * as loggerModule from "@/0_common/utils/logger"
import { franc } from "franc-min"

const logger = loggerModule.createLogger("languageDetector")

/**
 * Detect the source language of the given text using async language detection.
 * Prefer Chrome's built-in detector, then fallback to franc-min.
 *
 * @param text - The text to detect language for
 * @returns Language code (e.g., 'en', 'zh', 'es')
 */
export async function detectSourceLanguageAsync(text: string): Promise<string> {
    logger.debug("Starting async language detection:", text)
    const trimmed = (text || "").trim()
    const fallback = "en"
    if (trimmed.length === 0) return fallback

    try {
        if (typeof chrome !== "undefined" && chrome.i18n && typeof chrome.i18n.detectLanguage === "function") {
            logger.info("Using chrome.i18n.detectLanguage")
            const result = await new Promise<chrome.i18n.LanguageDetectionResult>((resolve) => {
                chrome.i18n.detectLanguage(trimmed.slice(0, 1200), (res) => resolve(res))
            })
            if (result && Array.isArray(result.languages) && result.languages.length > 0) {
                const top = result.languages[0]
                if (top && top.language) {
                    const norm = normalizeLangCode(top.language)
                    if (norm) {
                        logger.info(`Chrome detected language: ${norm}`)
                        return norm
                    }
                }
            }
        }
    } catch (error) {
        logger.error("chrome.i18n.detectLanguage failed, falling back to franc", error)
    }

    try {
        logger.info("Using franc for language detection")
        const iso3 = franc(trimmed, { minLength: 3 })
        if (iso3 && iso3 !== "und") {
            const iso1 = iso3to1(iso3)
            if (iso1) {
                logger.info(`Franc detected language: ${iso1}`)
                return iso1
            }
        }
    } catch (error) {
        logger.error("Franc detection failed", error)
    }

    logger.info(`Falling back to default language: ${fallback}`)
    return fallback
}

function normalizeLangCode(code: string): string | null {
    if (!code) return null
    const parts = code.toLowerCase().split("-")
    const primary = parts.length > 0 ? parts[0] : ""
    switch (primary) {
        case "zh":
            return "zh"
        case "en":
            return "en"
        case "ja":
            return "ja"
        case "ko":
            return "ko"
        case "ru":
            return "ru"
        case "ar":
            return "ar"
        case "el":
            return "el"
        case "he":
            return "he"
        case "th":
            return "th"
        case "hi":
            return "hi"
        case "es":
            return "es"
        case "fr":
            return "fr"
        case "de":
            return "de"
        case "pt":
            return "pt"
        case "it":
            return "it"
        case "nl":
            return "nl"
        case "vi":
            return "vi"
        case "tr":
            return "tr"
        case "pl":
            return "pl"
        case "ro":
            return "ro"
        default:
            return primary || null
    }
}

function iso3to1(code: string): string | null {
    const map: Record<string, string> = {
        eng: "en",
        zho: "zh",
        cmn: "zh",
        jpn: "ja",
        kor: "ko",
        rus: "ru",
        ara: "ar",
        ell: "el",
        heb: "he",
        tha: "th",
        hin: "hi",
        spa: "es",
        fra: "fr",
        fre: "fr",
        deu: "de",
        ger: "de",
        por: "pt",
        ita: "it",
        nld: "nl",
        dut: "nl",
        vie: "vi",
        tur: "tr",
        pol: "pl",
        ron: "ro",
        rum: "ro",
        ukr: "uk",
        ces: "cs",
        cze: "cs",
        slk: "sk",
        slo: "sk",
        swe: "sv",
        dan: "da",
        nor: "no",
        fin: "fi",
    }
    const lower = (code || "").toLowerCase()
    return map[lower] || null
}

/**
 * Resolves the actual target language to use for translation.
 * If the source language matches the target language, automatically switch to a fallback:
 * - Chinese (zh) -> English (en)
 * - English (en) -> Japanese (ja)
 * - Other languages -> English (en)
 *
 * @param sourceLanguage - The detected source language code
 * @param targetLanguage - The user's preferred target language code
 * @returns The resolved target language code to use for translation
 */
export function resolveTargetLanguage(sourceLanguage: string, targetLanguage: string): string {
    // Normalize to lowercase for comparison
    const srcLang = (sourceLanguage || "").toLowerCase()
    const tgtLang = (targetLanguage || "").toLowerCase()

    // If source and target are the same, apply fallback rules
    if (srcLang === tgtLang) {
        logger.info(`Source language (${srcLang}) matches target language (${tgtLang}), applying fallback`)
        
        if (srcLang === "zh") {
            // Chinese content with Chinese target -> English
            logger.info("Chinese -> English fallback applied")
            return "en"
        } else if (srcLang === "en") {
            // English content with English target -> Japanese
            logger.info("English -> Japanese fallback applied")
            return "ja"
        } else {
            // Other languages -> English
            logger.info(`${srcLang} -> English fallback applied`)
            return "en"
        }
    }

    // No conflict, use original target language
    return targetLanguage
}
