import { fetchBugs, fetchBug, createBug, updateBug, deleteBug } from './bugApiClient'
import type { Bug, CreateBugInput, UpdateBugInput } from '../types'

const baseBug: Bug = {
  id: 1,
  related_task_id: 2,
  title: 'ステータス更新後に画面が再描画されない',
  description: null,
  severity: 'medium',
  status: 'open',
  discovered_at: '2026-09-06',
  resolved_at: null,
  created_at: '2026-09-06T04:00:00Z',
  updated_at: '2026-09-06T04:00:00Z',
}

describe('bugApiClient', () => {
  const originalFetch = global.fetch

  afterEach(() => {
    global.fetch = originalFetch
    jest.restoreAllMocks()
  })

  describe('fetchBugs', () => {
    it('GET /bugs を呼び出し、data配列をバグ一覧として返す', async () => {
      // Arrange
      const mockFetch = jest.fn().mockResolvedValue({
        ok: true,
        status: 200,
        json: () => Promise.resolve({ data: [baseBug] }),
      })
      global.fetch = mockFetch

      // Act
      const result = await fetchBugs()

      // Assert
      expect(mockFetch).toHaveBeenCalledWith(expect.stringMatching(/\/bugs$/))
      expect(result).toEqual([baseBug])
    })

    it('レスポンスがエラーの場合、messageを含むErrorを投げる', async () => {
      // Arrange
      const mockFetch = jest.fn().mockResolvedValue({
        ok: false,
        status: 500,
        json: () => Promise.resolve({ message: 'サーバーエラーが発生しました' }),
      })
      global.fetch = mockFetch

      // Act & Assert
      await expect(fetchBugs()).rejects.toThrow('サーバーエラーが発生しました')
    })
  })

  describe('fetchBug', () => {
    it('GET /bugs/{id} を呼び出し、単一バグを返す', async () => {
      // Arrange
      const mockFetch = jest.fn().mockResolvedValue({
        ok: true,
        status: 200,
        json: () => Promise.resolve(baseBug),
      })
      global.fetch = mockFetch

      // Act
      const result = await fetchBug(1)

      // Assert
      expect(mockFetch).toHaveBeenCalledWith(expect.stringMatching(/\/bugs\/1$/))
      expect(result).toEqual(baseBug)
    })
  })

  describe('createBug', () => {
    it('POST /bugs を呼び出し、作成されたバグを返す', async () => {
      // Arrange
      const input: CreateBugInput = {
        related_task_id: 2,
        title: 'ステータス更新後に画面が再描画されない',
        description: null,
        severity: 'medium',
        discovered_at: '2026-09-06',
      }
      const mockFetch = jest.fn().mockResolvedValue({
        ok: true,
        status: 201,
        json: () => Promise.resolve(baseBug),
      })
      global.fetch = mockFetch

      // Act
      const result = await createBug(input)

      // Assert
      expect(mockFetch).toHaveBeenCalledWith(
        expect.stringMatching(/\/bugs$/),
        expect.objectContaining({
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(input),
        }),
      )
      expect(result).toEqual(baseBug)
    })
  })

  describe('updateBug', () => {
    it('PATCH /bugs/{id} を呼び出し、更新後のバグを返す', async () => {
      // Arrange
      const input: UpdateBugInput = {
        title: 'ステータス更新後に画面が再描画されない',
        description: null,
        severity: 'medium',
        status: 'resolved',
        discovered_at: '2026-09-06',
        resolved_at: '2026-09-06',
      }
      const mockFetch = jest.fn().mockResolvedValue({
        ok: true,
        status: 200,
        json: () => Promise.resolve(baseBug),
      })
      global.fetch = mockFetch

      // Act
      const result = await updateBug(1, input)

      // Assert
      expect(mockFetch).toHaveBeenCalledWith(
        expect.stringMatching(/\/bugs\/1$/),
        expect.objectContaining({
          method: 'PATCH',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(input),
        }),
      )
      expect(result).toEqual(baseBug)
    })
  })

  describe('deleteBug', () => {
    it('DELETE /bugs/{id} を呼び出す', async () => {
      // Arrange
      const mockFetch = jest.fn().mockResolvedValue({
        ok: true,
        status: 204,
        json: () => Promise.reject(new Error('no body')),
      })
      global.fetch = mockFetch

      // Act
      await deleteBug(1)

      // Assert
      expect(mockFetch).toHaveBeenCalledWith(
        expect.stringMatching(/\/bugs\/1$/),
        expect.objectContaining({ method: 'DELETE' }),
      )
    })
  })
})
