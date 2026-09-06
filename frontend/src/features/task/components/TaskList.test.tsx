import { render, screen, fireEvent } from '@testing-library/react'
import { TaskList } from './TaskList'
import type { Task } from '../types'

const parentTask: Task = {
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
  subtasks: [
    {
      id: 2,
      parent_task_id: 1,
      title: 'スコープ確定',
      description: null,
      status: 'in_progress',
      priority: 'medium',
      due_date: null,
      definition_of_done: null,
      estimated_effort: 2,
      actual_effort: null,
      created_at: '2026-09-05T02:00:00Z',
      updated_at: '2026-09-05T03:00:00Z',
    },
  ],
}

describe('TaskList', () => {
  it('親タスクと子タスク(subtasks)をネストして一覧表示する', () => {
    // Arrange & Act
    render(<TaskList tasks={[parentTask]} selectedTaskId={null} onSelectTask={jest.fn()} />)

    // Assert
    expect(screen.getByText('要件定義')).toBeInTheDocument()
    expect(screen.getByText('スコープ確定')).toBeInTheDocument()
  })

  it('タスクをクリックするとonSelectTaskがそのidで呼ばれる', () => {
    // Arrange
    const handleSelect = jest.fn()
    render(<TaskList tasks={[parentTask]} selectedTaskId={null} onSelectTask={handleSelect} />)

    // Act
    fireEvent.click(screen.getByText('スコープ確定'))

    // Assert
    expect(handleSelect).toHaveBeenCalledWith(2)
  })

  it('タスクが0件の場合は空であることを示すメッセージを表示する', () => {
    // Arrange & Act
    render(<TaskList tasks={[]} selectedTaskId={null} onSelectTask={jest.fn()} />)

    // Assert
    expect(screen.getByText('タスクがありません')).toBeInTheDocument()
  })
})
