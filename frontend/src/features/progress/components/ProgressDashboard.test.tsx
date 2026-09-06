import { render, screen } from '@testing-library/react'
import { ProgressDashboard } from './ProgressDashboard'
import { useProgress } from '../hooks/useProgress'
import type { ProgressSummary } from '../types'

jest.mock('../hooks/useProgress')

const mockUseProgress = useProgress as jest.MockedFunction<typeof useProgress>

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

describe('ProgressDashboard', () => {
  afterEach(() => {
    jest.clearAllMocks()
  })

  it('読み込み中の場合は読み込み中メッセージを表示する', () => {
    // Arrange
    mockUseProgress.mockReturnValue({
      data: null,
      error: null,
      isLoading: true,
      refetch: jest.fn(),
    })

    // Act
    render(<ProgressDashboard />)

    // Assert
    expect(screen.getByText('読み込み中...')).toBeInTheDocument()
  })

  it('取得エラー時はErrorMessageを表示する', () => {
    // Arrange
    mockUseProgress.mockReturnValue({
      data: null,
      error: '進捗指標の取得に失敗しました',
      isLoading: false,
      refetch: jest.fn(),
    })

    // Act
    render(<ProgressDashboard />)

    // Assert
    expect(screen.getByRole('alert')).toHaveTextContent('進捗指標の取得に失敗しました')
  })

  it('EVM指標・バグ検知度を表示する', () => {
    // Arrange
    mockUseProgress.mockReturnValue({
      data: progress,
      error: null,
      isLoading: false,
      refetch: jest.fn(),
    })

    // Act
    render(<ProgressDashboard />)

    // Assert
    expect(screen.getByText('40')).toBeInTheDocument() // BAC
    expect(screen.getByText('0.88')).toBeInTheDocument() // CPI
    expect(screen.getByText('0.83')).toBeInTheDocument() // SPI
    expect(screen.getByText('45.5')).toBeInTheDocument() // EAC
    expect(screen.getByText('6')).toBeInTheDocument() // バグ総数
    expect(screen.getByText('67%')).toBeInTheDocument() // resolution_rate
  })

  it('resolution_rate・defect_densityがnullの場合は未計測であることを示す', () => {
    // Arrange
    const noBugsProgress: ProgressSummary = {
      ...progress,
      bugs: { total: 0, open: 0, resolved: 0, resolution_rate: null, defect_density: null },
    }
    mockUseProgress.mockReturnValue({
      data: noBugsProgress,
      error: null,
      isLoading: false,
      refetch: jest.fn(),
    })

    // Act
    render(<ProgressDashboard />)

    // Assert
    expect(screen.getAllByText('未計測').length).toBeGreaterThan(0)
  })
})
