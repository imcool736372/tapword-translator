import path from 'path';
import { defineConfig } from 'vitest/config';

export default defineConfig({
    test: {
        globals: true,
        environment: 'node', // Default to 'node' for better performance
        include: ['tests/**/*.test.ts', 'tests/**/*.integration.test.ts'],
        coverage: {
            provider: 'v8',
            reporter: ['text', 'html'],
            include: ['src/**/*.ts'],
            exclude: ['src/**/*.test.ts'],
        },
    },
    resolve: {
        alias: {
            '@': path.resolve(__dirname, '../src'),
            '@utils': path.resolve(__dirname, '../src/0_common/utils'),
            '@types': path.resolve(__dirname, '../src/0_common/types'),
            '@constants': path.resolve(__dirname, '../src/0_common/constants'),
        },
    },
});
