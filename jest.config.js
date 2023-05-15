module.exports = {
  coveragePathIgnorePatterns: ['<rootDir>/test'],
  testEnvironment: 'jsdom',
  transformIgnorePatterns: ['node_modules', 'dist', '.turbo'],
  transform: {
    '^.+\\.(t|j)sx?$': ['@swc/jest'],
  },
};
