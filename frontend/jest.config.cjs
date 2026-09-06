/** @type {import('jest').Config} */
module.exports = {
  preset: 'ts-jest',
  testEnvironment: 'jsdom',
  setupFilesAfterEnv: ['@testing-library/jest-dom'],
  moduleNameMapper: {
    '\\.module\\.css$': 'identity-obj-proxy',
    // ts-jestはimport.meta構文をパースできないため、env.tsは常にモックへ差し替える
    '^(.*)/config/env$': '<rootDir>/src/config/__mocks__/env.ts',
  },
  transform: {
    // ルートのtsconfig.json(references専用で空)しか自動参照されないため、
    // テスト専用のtsconfig.test.json(jest/jest-domの型を含む)を明示的に指定する
    '^.+\\.tsx?$': ['ts-jest', { tsconfig: 'tsconfig.test.json' }],
  },
}
