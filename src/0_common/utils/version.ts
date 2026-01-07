/**
 * Version utilities
 *
 * Provides semantic version comparison helpers.
 */

/**
 * Compare two semantic version strings (e.g., "0.1.0").
 * Returns -1 if a<b, 1 if a>b, 0 if equal.
 */
export function compareSemver(a: string, b: string): -1 | 0 | 1 {
    const parse = (v: string) => v.split(".").map((x) => parseInt(x, 10) || 0)
    const av = parse(a)
    const bv = parse(b)
    const len = Math.max(av.length, bv.length)
    for (let i = 0; i < len; i++) {
        const ai = av[i] ?? 0
        const bi = bv[i] ?? 0
        if (ai < bi) return -1
        if (ai > bi) return 1
    }
    return 0
}

/**
 * Returns true if currentVersion is lower than targetVersion.
 */
export function isLowerVersion(currentVersion: string, targetVersion: string): boolean {
    return compareSemver(currentVersion, targetVersion) === -1
}
