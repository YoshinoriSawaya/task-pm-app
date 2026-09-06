import { defineConfig, devices } from '@playwright/test'

// docker compose up (frontend/backend/db)が起動済みであることを前提とする。
// DBを含むフルスタックの起動をdocker-composeに一元化するため、webServerによる
// 自動起動は行わない(docs/development/coding-standards.md「E2Eテスト」参照)。
export default defineConfig({
  testDir: '.',
  fullyParallel: false,
  retries: 0,
  reporter: [['list'], ['html', { open: 'never' }]],
  // Docker Desktop(Windows)のbind mount経由I/Oオーバーヘッドにより、
  // php artisan serveの1リクエストあたりの応答が1.5〜2秒程度かかる
  // ([change-log.md](../docs/pmbok/change-log.md) C15)。デフォルト5秒では
  // 不安定になるため余裕を持たせる
  expect: { timeout: 10_000 },
  use: {
    baseURL: 'http://localhost:5173',
    trace: 'retain-on-failure',
  },
  projects: [{ name: 'chromium', use: { ...devices['Desktop Chrome'] } }],
})
