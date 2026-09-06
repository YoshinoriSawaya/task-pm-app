import { render, screen } from '@testing-library/react'
import { BugDetail } from './BugDetail'
import type { Bug } from '../types'

const bug: Bug = {
  id: 1,
  related_task_id: 2,
  title: 'ステータス更新後に画面が再描画されない',
  description: 'PATCH成功後、一覧の該当行が古いステータスのまま表示される',
  severity: 'high',
  status: 'resolved',
  discovered_at: '2026-09-06',
  resolved_at: '2026-09-07',
  created_at: '2026-09-06T04:00:00Z',
  updated_at: '2026-09-07T04:00:00Z',
}

describe('BugDetail', () => {
  it('バグの主要項目を表示する', () => {
    // Arrange & Act
    render(<BugDetail bug={bug} />)

    // Assert
    expect(screen.getByRole('heading', { name: bug.title })).toBeInTheDocument()
    expect(
      screen.getByText('PATCH成功後、一覧の該当行が古いステータスのまま表示される'),
    ).toBeInTheDocument()
    expect(screen.getByText('high')).toBeInTheDocument()
    expect(screen.getByText('resolved')).toBeInTheDocument()
    expect(screen.getByText('2026-09-06')).toBeInTheDocument()
    expect(screen.getByText('2026-09-07')).toBeInTheDocument()
  })

  it('bugがnullの場合は選択を促すメッセージを表示する', () => {
    // Arrange & Act
    render(<BugDetail bug={null} />)

    // Assert
    expect(screen.getByText('バグを選択してください')).toBeInTheDocument()
  })

  it('description・resolved_atが未設定の場合は未設定であることを示す', () => {
    // Arrange
    const openBug: Bug = { ...bug, description: null, resolved_at: null, status: 'open' }

    // Act
    render(<BugDetail bug={openBug} />)

    // Assert
    expect(screen.getAllByText('未設定').length).toBeGreaterThan(0)
  })
})
