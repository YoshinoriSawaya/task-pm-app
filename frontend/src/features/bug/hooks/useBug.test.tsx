import { renderHook, waitFor } from '@testing-library/react'
import { useBug } from './useBug'
import { fetchBug } from '../api/bugApiClient'
import type { Bug } from '../types'

jest.mock('../api/bugApiClient')

const mockFetchBug = fetchBug as jest.MockedFunction<typeof fetchBug>

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

describe('useBug', () => {
  afterEach(() => {
    jest.clearAllMocks()
  })

  it('idを指定するとfetchBugを呼び出し、取得成功後にdataへ反映される', async () => {
    // Arrange
    mockFetchBug.mockResolvedValue(bug)

    // Act
    const { result } = renderHook(() => useBug(1))

    // Assert
    expect(result.current.isLoading).toBe(true)
    await waitFor(() => {
      expect(result.current.isLoading).toBe(false)
    })
    expect(mockFetchBug).toHaveBeenCalledWith(1)
    expect(result.current.data).toEqual(bug)
  })

  it('idがnullの場合はfetchBugを呼び出さない', () => {
    // Act
    const { result } = renderHook(() => useBug(null))

    // Assert
    expect(mockFetchBug).not.toHaveBeenCalled()
    expect(result.current.isLoading).toBe(false)
    expect(result.current.data).toBeNull()
  })

  it('refetchを呼ぶと再度fetchBugを呼び出し、dataを更新する', async () => {
    // Arrange
    mockFetchBug.mockResolvedValueOnce(bug)
    const { result } = renderHook(() => useBug(1))
    await waitFor(() => {
      expect(result.current.isLoading).toBe(false)
    })
    const updatedBug: Bug = { ...bug, status: 'resolved' }
    mockFetchBug.mockResolvedValueOnce(updatedBug)

    // Act
    result.current.refetch()

    // Assert
    await waitFor(() => {
      expect(result.current.data).toEqual(updatedBug)
    })
    expect(mockFetchBug).toHaveBeenCalledTimes(2)
  })
})
