module.exports = {
  preset: 'ts-jest',
  testEnvironment: 'node',
  moduleNameMapper: {
    '^scripts/(.*)$': '<rootDir>/scripts/$1',
  },
  modulePathIgnorePatterns: ['<rootDir>/build/'],
  verbose: true,
};
