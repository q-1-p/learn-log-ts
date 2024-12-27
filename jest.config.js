/** @type {import('ts-jest').JestConfigWithTsJest} **/
export default {
  setupFilesAfterEnv: ['@testing-library/jest-dom'],
  testEnvironment: "jsdom",
  transform: {
    "^.+.tsx?$": ["ts-jest",{}],
  },
};