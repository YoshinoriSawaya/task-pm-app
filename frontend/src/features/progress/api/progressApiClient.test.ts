import { fetchProgress } from './progressApiClient'
import type { ProgressSummary } from '../types'

const baseProgress: ProgressSummary = {
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
  bugs: {
    total: 6,
    open: 2,
    resolved: 4,
    resolution_rate: 0.67,
    defect_density: 0.75,
  },
  calculated_at: '2026-09-06T04:00:00Z',
}

describe('progressApiClient', () => {
  const originalFetch = global.fetch

  afterEach(() => {
    global.fetch = originalFetch
    jest.restoreAllMocks()
  })

  describe('fetchProgress', () => {
    it('GET /progress を呼び出し、EVM・バグ統計を返す', async () => {
      // Arrange
      const mockFetch = jest.fn().mockResolvedValue({
        ok: true,
        status: 200,
        json: () => Promise.resolve(baseProgress),
      })
      global.fetch = mockFetch

      // Act
      const result = await fetchProgress()

      // Assert
      expect(mockFetch).toHaveBeenCalledWith(expect.stringMatching(/\/progress$/))
      expect(result).toEqual(baseProgress)
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
      await expect(fetchProgress()).rejects.toThrow('サーバーエラーが発生しました')
    })
  })
})
