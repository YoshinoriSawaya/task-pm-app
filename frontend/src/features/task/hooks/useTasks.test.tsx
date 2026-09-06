import { renderHook, waitFor } from '@testing-library/react'
import { useTasks } from './useTasks'
import { fetchTasks } from '../api/taskApiClient'
import type { Task } from '../types'

jest.mock('../api/taskApiClient')

const mockFetchTasks = fetchTasks as jest.MockedFunction<typeof fetchTasks>

const task: Task = {
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

describe('useTasks', () => {
  afterEach(() => {
    jest.clearAllMocks()
  })

  it('初期状態はisLoading=trueで、取得成功後にdataへ反映される', async () => {
    // Arrange
    mockFetchTasks.mockResolvedValue([task])

    // Act
    const { result } = renderHook(() => useTasks())

    // Assert(初期状態)
    expect(result.current.isLoading).toBe(true)
    expect(result.current.data).toBeNull()
    expect(result.current.error).toBeNull()

    // Assert(取得完了後)
    await waitFor(() => {
      expect(result.current.isLoading).toBe(false)
    })
    expect(result.current.data).toEqual([task])
    expect(result.current.error).toBeNull()
  })

  it('取得失敗時はerrorにメッセージが入り、isLoadingはfalseになる', async () => {
    // Arrange
    mockFetchTasks.mockRejectedValue(new Error('サーバーエラーが発生しました'))

    // Act
    const { result } = renderHook(() => useTasks())

    // Assert
    await waitFor(() => {
      expect(result.current.isLoading).toBe(false)
    })
    expect(result.current.data).toBeNull()
    expect(result.current.error).toBe('サーバーエラーが発生しました')
  })
})
