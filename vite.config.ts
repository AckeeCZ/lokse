import { defineConfig } from 'vitest/config';
import path from 'path';

export default defineConfig({
    test: {
        alias: {
            '@lokse/core': path.resolve(__dirname, './packages/core/src'),
        },
        environment: 'node',
        include: ['packages/**/*.{test,spec}.ts'],
        coverage: {
            enabled: true,
            reporter: ['lcov', 'text-summary'],
        },
        outputFile: 'coverage/sonar-report.xml',
        disableConsoleIntercept: true,
        watch: false,
        testTimeout: 10_000,
    },
});
