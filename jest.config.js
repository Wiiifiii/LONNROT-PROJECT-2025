// jest.config.js  (or jest.config.cjs)
/* eslint-disable @typescript-eslint/no-require-imports */
const nextJest = require('next/jest');
const createJestConfig = nextJest({ dir: './' });

/** @type {import('jest').Config} */
const customJestConfig = {
  moduleNameMapper: {
    // tell Jest “@/foo” maps to “<rootDir>/src/foo”
    '^@/(.*)$': '<rootDir>/src/$1',
    // your existing mappings for CSS & images
    '^.+\\.module\\.(css|sass|scss)$': 'identity-obj-proxy',
    '^.+\\.(css|sass|scss)$': '<rootDir>/__mocks__/styleMock.js',
    '^.+\\.(png|jpg|jpeg|gif|webp|svg)$': '<rootDir>/__mocks__/fileMock.js',
  },
  setupFilesAfterEnv: ['<rootDir>/jest.setup.js'],  // ← must match this
  testEnvironment: 'jest-environment-jsdom',
};

module.exports = createJestConfig(customJestConfig);
