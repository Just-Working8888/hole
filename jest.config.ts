import type { Config } from 'jest';

const config: Config = {
    preset: 'ts-jest',
    testEnvironment: 'jsdom',
moduleNameMapper: {
        '^@/(.*)$': '<rootDir>/src/$1',
        '\\.module\\.(css|scss)$': 'identity-obj-proxy',
    },
    transform: {
        '^.+\\.tsx?$': ['ts-jest', { tsconfig: { jsx: 'react-jsx' } }],
    },
    testMatch: ['**/*.test.ts', '**/*.test.tsx'],
};

export default config;
