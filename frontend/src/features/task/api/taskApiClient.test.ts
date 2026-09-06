import { fetchTasks, fetchTask } from './taskApiClient'
import type { Task } from '../types'

const baseTask: Task = {
  id: 1,
  parent_task_id: null,
  title: '要件定義',
  description: null,
  status: 'done',
  priority: 'high',
  due_date: null,
  definition_of_done: null,
  estimated_effort: 4,
  actual_effort: 3.5,
  created_at: '2026-09-05T02:00:00Z',
  updated_at: '2026-09-05T03:00:00Z',
  subtasks: [],
}

describe('taskApiClient', () => {
  const originalFetch = global.fetch

  afterEach(() => {
    global.fetch = originalFetch
    jest.restoreAllMocks()
  })

  describe('fetchTasks', () => {
    it('GET /tasks を呼び出し、data配列をタスク一覧として返す', async () => {
      // Arrange
      const mockFetch = jest.fn().mockResolvedValue({
        ok: true,
        status: 200,
        json: () => Promise.resolve({ data: [baseTask] }),
      })
      global.fetch = mockFetch

      // Act
      const result = await fetchTasks()

      // Assert
      expect(mockFetch).toHaveBeenCalledWith(expect.stringMatching(/\/tasks$/))
      expect(result).toEqual([baseTask])
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
      await expect(fetchTasks()).rejects.toThrow('サーバーエラーが発生しました')
    })
  })

  describe('fetchTask', () => {
    it('GET /tasks/{id} を呼び出し、単一タスクを返す', async () => {
      // Arrange
      const mockFetch = jest.fn().mockResolvedValue({
        ok: true,
        status: 200,
        json: () => Promise.resolve(baseTask),
      })
      global.fetch = mockFetch

      // Act
      const result = await fetchTask(1)

      // Assert
      expect(mockFetch).toHaveBeenCalledWith(expect.stringMatching(/\/tasks\/1$/))
      expect(result).toEqual(baseTask)
    })

    it('404の場合、messageを含むErrorを投げる', async () => {
      // Arrange
      const mockFetch = jest.fn().mockResolvedValue({
        ok: false,
        status: 404,
        json: () => Promise.resolve({ message: 'タスクが見つかりません' }),
      })
      global.fetch = mockFetch

      // Act & Assert
      await expect(fetchTask(999)).rejects.toThrow('タスクが見つかりません')
    })
  })
})
