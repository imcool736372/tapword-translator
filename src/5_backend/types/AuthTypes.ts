/**
 * Authentication Types
 *
 * Types for JWT authentication and HMAC signature generation
 */

/**
 * JWT token data stored in memory/storage
 */
export interface JWTToken {
    /** The JWT token string */
    token: string
    /** Token expiration time in seconds */
    expiresIn: number
    /** Timestamp when the token was obtained (in milliseconds) */
    obtainedAt: number
}

/**
 * API credentials for authentication
 */
export interface APICredentials {
    /** The unique API key assigned to the browser extension */
    apiKey: string
    /** The shared secret key for HMAC signature generation */
    apiSecret: string
}

/**
 * Authentication request body
 */
export interface AuthRequestBody {
    /** A unique identifier for the client instance or user (8-128 characters) */
    uid: string
    /** A random, unique string (nonce) for this specific request (16-128 characters) */
    nonce: string
}

/**
 * Authentication response data
 */
export interface AuthResponseData {
    /** The JWT token returned by backend */
    token: string
}

/**
 * HMAC signature generation parameters
 */
export interface SignatureParams {
    /** HTTP method (e.g., 'POST', 'GET') */
    method: string
    /** Request URI including path and query parameters */
    uri: string
    /** Unix timestamp in seconds */
    timestamp: string
    /** JSON string of request body */
    body: string
}

/**
 * Authentication headers for HMAC signature
 */
export interface AuthHeaders {
    /** The API key */
    "x-api-key": string
    /** The Unix timestamp in seconds */
    "x-timestamp": string
    /** The HMAC-SHA256 signature */
    "x-signature": string
}
