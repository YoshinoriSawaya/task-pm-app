import { renderHook, waitFor } from '@testing-library/react'
import { useBugs } from './useBugs'
import { fetchBugs } from '../api/bugApiClient'
import type { Bug } from '../types'

jest.mock('../api/bugApiClient')

const mockFetchBugs = fetchBugs as jest.MockedFunction<typeof fetchBugs>

const bug: Bug = {
  id: 1,
  related_task_id: null,
  title: 'バグ1',
  description: null,
  severity: 'medium',
  status: 'open',
  discovered_at: '2026-09-06',
  resolved_at: null,
  created_at: '2026-09-06T04:00:00Z',
  updated_at: '2026-09-06T04:00:00Z',
}

describe('useBugs', () => {
  afterEach(() => {
    jest.clearAllMocks()
  })

  it('初期状態はisLoading=trueで、取得成功後にdataへ反映される', async () => {
    // Arrange
    mockFetchBugs.mockResolvedValue([bug])

    // Act
    const { result } = renderHook(() => useBugs())

    // Assert(初期状態)
    expect(result.current.isLoading).toBe(true)
    expect(result.current.data).toBeNull()

    // Assert(取得完了後)
    await waitFor(() => {
      expect(result.current.isLoading).toBe(false)
    })
    expect(result.current.data).toEqual([bug])
    expect(result.current.error).toBeNull()
  })

  it('取得失敗時はerrorにメッセージが入る', async () => {
    // Arrange
    mockFetchBugs.mockRejectedValue(new Error('サーバーエラーが発生しました'))

    // Act
    const { result } = renderHook(() => useBugs())

    // Assert
    await waitFor(() => {
      expect(result.current.isLoading).toBe(false)
    })
    expect(result.current.error).toBe('サーバーエラーが発生しました')
  })

  it('refetchを呼ぶと再度fetchBugsを呼び出し、dataを更新する', async () => {
    // Arrange
    mockFetchBugs.mockResolvedValueOnce([bug])
    const { result } = renderHook(() => useBugs())
    await waitFor(() => {
      expect(result.current.isLoading).toBe(false)
    })
    const updatedBug: Bug = { ...bug, status: 'resolved' }
    mockFetchBugs.mockResolvedValueOnce([updatedBug])

    // Act
    result.current.refetch()

    // Assert
    await waitFor(() => {
      expect(result.current.data).toEqual([updatedBug])
    })
    expect(mockFetchBugs).toHaveBeenCalledTimes(2)
  })
})
