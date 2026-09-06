// import.meta.env への唯一のアクセス経路。
// ts-jest(CommonJS変換)は import.meta 構文をパースできないため、
// テスト時は jest.config.cjs の moduleNameMapper で __mocks__/env.ts に差し替える。
export const apiBaseUrl = import.meta.env.VITE_API_BASE_URL as string
