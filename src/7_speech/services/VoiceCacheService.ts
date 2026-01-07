import { createLogger } from "@/0_common/utils/logger"

const logger = createLogger("VoiceCacheService")

const MAX_CACHE_SIZE = 100

export class VoiceCacheService {
    private cache: Map<string, string> = new Map()

    get(key: string): string | undefined {
        return this.cache.get(key)
    }

    put(key: string, data: string): void {
        if (this.cache.size >= MAX_CACHE_SIZE) {
            // Simple FIFO cache eviction
            const oldestKey = this.cache.keys().next().value
            if (oldestKey) {
                this.cache.delete(oldestKey)
                logger.info(`Cache full. Evicted: ${oldestKey}`)
            }
        }
        this.cache.set(key, data)
        logger.info(`Cached voice for key: ${key}`)
    }

    has(key: string): boolean {
        return this.cache.has(key)
    }

    clear(): void {
        this.cache.clear()
        logger.info("Voice cache cleared")
    }
}
