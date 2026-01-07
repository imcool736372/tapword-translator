/**
 * API Response Types
 *
 * Generic structure to represent the standard API response from the backend
 */

/**
 * Standard API response structure
 *
 * @template T - The type of the data field
 */
export interface APIResponse<T> {
    /** Response data (null if error occurred) */
    data: T | null
    /** Business status code (0 = success) */
    code: number
    /** Response message */
    message: string
}
