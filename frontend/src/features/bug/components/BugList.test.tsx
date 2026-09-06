import { render, screen, fireEvent } from '@testing-library/react'
import { BugList } from './BugList'
import type { Bug } from '../types'

const bug: Bug = {
  id: 1,
  related_task_id: null,
  title: 'ステータス更新後に画面が再描画されない',
  description: null,
  severity: 'high',
  status: 'open',
  discovered_at: '2026-09-06',
  resolved_at: null,
  created_at: '2026-09-06T04:00:00Z',
  updated_at: '2026-09-06T04:00:00Z',
}

describe('BugList', () => {
  it('バグの一覧を表示する', () => {
    // Arrange & Act
    render(<BugList bugs={[bug]} selectedBugId={null} onSelectBug={jest.fn()} />)

    // Assert
    expect(screen.getByText('ステータス更新後に画面が再描画されない')).toBeInTheDocument()
    expect(screen.getByText('high')).toBeInTheDocument()
    expect(screen.getByText('open')).toBeInTheDocument()
  })

  it('バグをクリックするとonSelectBugがそのidで呼ばれる', () => {
    // Arrange
    const handleSelect = jest.fn()
    render(<BugList bugs={[bug]} selectedBugId={null} onSelectBug={handleSelect} />)

    // Act
    fireEvent.click(screen.getByRole('button', { name: /ステータス更新後に画面が再描画されない/ }))

    // Assert
    expect(handleSelect).toHaveBeenCalledWith(1)
  })

  it('バグが0件の場合は空であることを示すメッセージを表示する', () => {
    // Arrange & Act
    render(<BugList bugs={[]} selectedBugId={null} onSelectBug={jest.fn()} />)

    // Assert
    expect(screen.getByText('バグはありません')).toBeInTheDocument()
  })
})
