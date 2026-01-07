Last updated on: 2025-10-26

# 5_backend: Backend API Service

## Module Overview

This module provides a generic, centralized API client for communicating with backend services. It is designed to handle HTTP requests, responses, error parsing, and authentication token management in a standardized way, inspired by Swift's `APIService` pattern. Its primary role is to provide a robust and reusable infrastructure for all network communication with the application's backend.

## File Structure

```
5_backend/
├── README.md           # This document.
├── index.ts            # Main entry point, exports all public members.
├── services/
│   └── APIService.ts   # Core API client implementation.
└── types/
    ├── APIError.ts     # Defines custom error types for API communication.
    └── APIResponse.ts  # Defines the standard backend response structure.
```

## Core Components

### 1. API Client (`services/APIService.ts`)

-   **`APIService` class**: The core of the module. It's a centralized client for making backend API requests.
    -   **Features**:
        -   Generic, type-safe request/response handling.
        -   Automatic parsing and classification of network and business logic errors.
        -   Handles JWT token management, including attachment to requests and automatic token refresh logic.
        -   Manages request timeouts and detects rate limiting.
-   **Convenience Functions (`get`, `post`, `put`, `del`)**: Simplified wrappers around the `APIService` for common HTTP methods.
-   **`initAPIService`**: An initialization function to configure the service at application startup, setting parameters like the `baseURL` and token management callbacks.

### 2. Data Types (`types/`)

-   **`types/APIError.ts`**:
    -   Defines a discriminated union type `APIError` to represent various error scenarios, such as business logic errors, network request errors, token expiration, and rate limiting.
    -   Includes utility functions (`getUserMessage`, `getDebugMessage`) to generate user-friendly and debug-friendly error messages.
    -   Contains `APIErrorCodes` constants that match backend error conventions.
-   **`types/APIResponse.ts`**:
    -   Defines the generic `APIResponse<T>` interface, which standardizes the structure for all responses from the backend, including a `data` payload, a business status `code`, and a `message`.

### 3. Module Entry Point (`index.ts`)

-   Acts as the public interface for the module.
-   It explicitly exports all the necessary types, classes, and functions from the `services` and `types` subdirectories, making them available to other parts of the application while encapsulating the internal structure.
