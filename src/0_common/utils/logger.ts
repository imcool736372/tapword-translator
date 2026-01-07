/**
 * Logger Utility
 *
 * Simple logging wrapper that provides:
 * 1. Consistent log format with module prefixes
 * 2. Log level control (info, warn, error, debug)
 * 3. Easy replacement for console.log/console.error
 * 4. Production-ready with optional log level filtering
 */

export type LogLevel = "debug" | "info" | "warn" | "error"

export interface LoggerConfig {
    /** Minimum log level to display */
    minLevel?: LogLevel
    /** Enable/disable logging globally */
    enabled?: boolean
}

const LOG_LEVELS: Record<LogLevel, number> = {
    debug: 0,
    info: 1,
    warn: 2,
    error: 3,
}

class Logger {
    private config: LoggerConfig = {
        minLevel: "debug",
        enabled: true,
    }

    constructor() {
        // Automatically configure logger based on environment variable
        const loggerEnabled = import.meta.env.VITE_LOGGER_ENABLED === "true"
        this.config.enabled = loggerEnabled
    }

    /**
     * Update logger configuration
     */
    configure(config: Partial<LoggerConfig>): void {
        this.config = { ...this.config, ...config }
    }

    /**
     * Check if a log level should be displayed
     */
    private shouldLog(level: LogLevel): boolean {
        if (!this.config.enabled) {
            return false
        }
        const minLevel = this.config.minLevel || "debug"
        return LOG_LEVELS[level] >= LOG_LEVELS[minLevel]
    }

    /**
     * Format log message with prefix and serialize objects
     */
    private formatAndSerialize(prefix: string, ...args: unknown[]): unknown[] {
        const serializedArgs = args.map((arg) => (typeof arg === "object" && arg !== null ? JSON.stringify(arg, null, 2) : arg))
        return [`[${prefix}]`, ...serializedArgs]
    }

    /**
     * Debug level log (lowest priority)
     */
    debug(prefix: string, ...args: unknown[]): void {
        if (this.shouldLog("debug")) {
            console.log(...this.formatAndSerialize(prefix, ...args))
        }
    }

    /**
     * Info level log (general information)
     */
    info(prefix: string, ...args: unknown[]): void {
        if (this.shouldLog("info")) {
            console.log(...this.formatAndSerialize(prefix, ...args))
        }
    }

    /**
     * Warning level log
     */
    warn(prefix: string, ...args: unknown[]): void {
        if (this.shouldLog("warn")) {
            console.warn(...this.formatAndSerialize(prefix, ...args))
        }
    }

    /**
     * Error level log (highest priority)
     */
    error(prefix: string, ...args: unknown[]): void {
        if (this.shouldLog("error")) {
            console.error(...this.formatAndSerialize(prefix, ...args))
        }
    }
}

// Singleton instance
const logger = new Logger()

/**
 * Configure the global logger
 */
export function configureLogger(config: Partial<LoggerConfig>): void {
    logger.configure(config)
}

/**
 * Create a module-specific logger with automatic prefix
 */
export function createLogger(moduleName: string) {
    return {
        debug: (...args: unknown[]) => logger.debug(moduleName, ...args),
        info: (...args: unknown[]) => logger.info(moduleName, ...args),
        warn: (...args: unknown[]) => logger.warn(moduleName, ...args),
        error: (...args: unknown[]) => logger.error(moduleName, ...args),
    }
}

/**
 * Direct access to logger methods (for backward compatibility)
 */
export const log = {
    debug: (prefix: string, ...args: unknown[]) => logger.debug(prefix, ...args),
    info: (prefix: string, ...args: unknown[]) => logger.info(prefix, ...args),
    warn: (prefix: string, ...args: unknown[]) => logger.warn(prefix, ...args),
    error: (prefix: string, ...args: unknown[]) => logger.error(prefix, ...args),
}
