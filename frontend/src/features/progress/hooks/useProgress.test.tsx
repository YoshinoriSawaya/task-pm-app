import { renderHook, waitFor } from '@testing-library/react'
import { useProgress } from './useProgress'
import { fetchProgress } from '../api/progressApiClient'
import type { ProgressSummary } from '../types'

jest.mock('../api/progressApiClient')

const mockFetchProgress = fetchProgress as jest.MockedFunction<typeof fetchProgress>

const progress: ProgressSummary = {
  evm: {
    bac: 40.0,
    pv: 18.0,
    ev: 15.0,
    ac: 17.0,
    cv: -2.0,
    sv: -3.0,
    cpi: 0.88,
    spi: 0.83,
    eac: 45.5,
    etc: 28.5,
    vac: -5.5,
  },
  bugs: { total: 6, open: 2, resolved: 4, resolution_rate: 0.67, defect_density: 0.75 },
  calculated_at: '2026-09-06T04:00:00Z',
}

describe('useProgress', () => {
  afterEach(() => {
    jest.clearAllMocks()
  })

  it('初期状態はisLoading=trueで、取得成功後にdataへ反映される', async () => {
    // Arrange
    mockFetchProgress.mockResolvedValue(progress)

    // Act
    const { result } = renderHook(() => useProgress())

    // Assert(初期状態)
    expect(result.current.isLoading).toBe(true)
    expect(result.current.data).toBeNull()

    // Assert(取得完了後)
    await waitFor(() => {
      expect(result.current.isLoading).toBe(false)
    })
    expect(result.current.data).toEqual(progress)
    expect(result.current.error).toBeNull()
  })

  it('取得失敗時はerrorにメッセージが入る', async () => {
    // Arrange
    mockFetchProgress.mockRejectedValue(new Error('サーバーエラーが発生しました'))

    // Act
    const { result } = renderHook(() => useProgress())

    // Assert
    await waitFor(() => {
      expect(result.current.isLoading).toBe(false)
    })
    expect(result.current.error).toBe('サーバーエラーが発生しました')
  })

  it('refetchを呼ぶと再度fetchProgressを呼び出し、dataを更新する', async () => {
    // Arrange
    mockFetchProgress.mockResolvedValueOnce(progress)
    const { result } = renderHook(() => useProgress())
    await waitFor(() => {
      expect(result.current.isLoading).toBe(false)
    })
    const updated: ProgressSummary = { ...progress, evm: { ...progress.evm, cpi: 1.0 } }
    mockFetchProgress.mockResolvedValueOnce(updated)

    // Act
    result.current.refetch()

    // Assert
    await waitFor(() => {
      expect(result.current.data).toEqual(updated)
    })
    expect(mockFetchProgress).toHaveBeenCalledTimes(2)
  })
})
