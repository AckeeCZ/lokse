module.exports = {
  testEnvironment: "node",
  transform: { "\\.ts$": "ts-jest" },
  coverageReporters: ["lcov", "text-summary"],
  coverageThreshold: {
    global: {
      branches: 100,
      functions: 100,
      lines: 100,
      statements: 100,
    },
  },
  globals: {
    "ts-jest": {
      diagnostics: { warnOnly: true },
    },
  },
};
