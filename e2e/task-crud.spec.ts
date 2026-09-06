import { test, expect } from '@playwright/test'

// #23: タスクCRUDの主要フロー(作成→一覧反映→編集→削除)をE2Eで検証する。
// docker compose up (frontend:5173 / backend:8000 / db) が起動済みであることが前提。

test('タスクを作成し、編集し、削除できる', async ({ page }) => {
  const title = `E2Eテストタスク ${Date.now()}`

  // Arrange & Act: 一覧画面を開く
  await page.goto('/')
  await expect(page.getByRole('heading', { name: 'タスク一覧' })).toBeVisible()

  // Act: 新規作成
  await page.getByRole('button', { name: '新規作成' }).click()
  await page.getByLabel('タイトル').fill(title)
  await page.getByLabel('見積り工数(h)').fill('4')
  await page.getByRole('button', { name: '作成', exact: true }).click()

  // Assert: 一覧に作成したタスクが反映される
  const listItem = page.getByRole('button', { name: title })
  await expect(listItem).toBeVisible()

  // Act: 選択して詳細を開く
  await listItem.click()
  await expect(page.getByRole('heading', { name: title })).toBeVisible()

  // Act: 編集してステータスをdoneに変更
  await page.getByRole('button', { name: '編集' }).click()
  await page.getByLabel('ステータス').selectOption('done')
  await page.getByRole('button', { name: '更新' }).click()

  // Assert: 詳細にステータスの変更が反映される
  await expect(page.getByText('done')).toBeVisible()

  // Act: 削除する
  await page.getByRole('button', { name: '削除' }).click()

  // Assert: 一覧から削除される
  await expect(listItem).not.toBeVisible()
})
