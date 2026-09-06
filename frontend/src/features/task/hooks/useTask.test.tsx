import { renderHook, waitFor } from '@testing-library/react'
import { useTask } from './useTask'
import { fetchTask } from '../api/taskApiClient'
import type { Task } from '../types'

jest.mock('../api/taskApiClient')

const mockFetchTask = fetchTask as jest.MockedFunction<typeof fetchTask>

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

describe('useTask', () => {
  afterEach(() => {
    jest.clearAllMocks()
  })

  it('idを指定するとfetchTaskを呼び出し、取得成功後にdataへ反映される', async () => {
    // Arrange
    mockFetchTask.mockResolvedValue(task)

    // Act
    const { result } = renderHook(() => useTask(1))

    // Assert
    expect(result.current.isLoading).toBe(true)
    await waitFor(() => {
      expect(result.current.isLoading).toBe(false)
    })
    expect(mockFetchTask).toHaveBeenCalledWith(1)
    expect(result.current.data).toEqual(task)
    expect(result.current.error).toBeNull()
  })

  it('idがnullの場合はfetchTaskを呼び出さず、dataもnullのままにする', () => {
    // Act
    const { result } = renderHook(() => useTask(null))

    // Assert
    expect(mockFetchTask).not.toHaveBeenCalled()
    expect(result.current.isLoading).toBe(false)
    expect(result.current.data).toBeNull()
  })

  it('取得失敗時はerrorにメッセージが入る', async () => {
    // Arrange
    mockFetchTask.mockRejectedValue(new Error('タスクが見つかりません'))

    // Act
    const { result } = renderHook(() => useTask(999))

    // Assert
    await waitFor(() => {
      expect(result.current.isLoading).toBe(false)
    })
    expect(result.current.data).toBeNull()
    expect(result.current.error).toBe('タスクが見つかりません')
  })

  it('refetchを呼ぶと再度fetchTaskを呼び出し、dataを更新する', async () => {
    // Arrange
    mockFetchTask.mockResolvedValueOnce(task)
    const { result } = renderHook(() => useTask(1))
    await waitFor(() => {
      expect(result.current.isLoading).toBe(false)
    })
    const updatedTask: Task = { ...task, title: '要件定義(更新済み)' }
    mockFetchTask.mockResolvedValueOnce(updatedTask)

    // Act
    result.current.refetch()

    // Assert
    await waitFor(() => {
      expect(result.current.data).toEqual(updatedTask)
    })
    expect(mockFetchTask).toHaveBeenCalledTimes(2)
  })
})
