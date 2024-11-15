/**
 * @type {import('ts-jest').JestConfigWithTsJest}
 */
export default {
  testEnvironment: "node",
  moduleFileExtensions: ["ts", "js", "json"],
  testMatch: ["<rootDir>/packages/*/src/**/__tests__/**/*.test.ts"],
  transform: {
    "\\.ts$": [
      "ts-jest",
      {
        diagnostics: { warnOnly: true },
      },
    ],
  },
  coverageReporters: ["lcov", "text-summary"],
  collectCoverageFrom: ["packages/*/src/**/*.ts"],
  coveragePathIgnorePatterns: ["/templates/"],
  coverageThreshold: {
    global: {
      branches: 100,
      functions: 100,
      lines: 100,
      statements: 100,
    },
  },
  resolver: "<rootDir>/test-utils/resolver",
};
