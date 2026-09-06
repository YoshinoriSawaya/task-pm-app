import { render, screen } from '@testing-library/react'
import { TaskDetail } from './TaskDetail'
import type { Task } from '../types'

const task: Task = {
  id: 1,
  parent_task_id: null,
  title: '要件定義',
  description: 'スコープとDoDを確定する',
  status: 'in_progress',
  priority: 'high',
  due_date: '2026-09-06',
  definition_of_done: 'client-requirements.mdが確定していること',
  estimated_effort: 4,
  actual_effort: 3.5,
  created_at: '2026-09-05T02:00:00Z',
  updated_at: '2026-09-05T03:00:00Z',
  subtasks: [],
}

describe('TaskDetail', () => {
  it('タスクの主要項目を表示する', () => {
    // Arrange & Act
    render(<TaskDetail task={task} />)

    // Assert
    expect(screen.getByRole('heading', { name: '要件定義' })).toBeInTheDocument()
    expect(screen.getByText('スコープとDoDを確定する')).toBeInTheDocument()
    expect(screen.getByText('in_progress')).toBeInTheDocument()
    expect(screen.getByText('high')).toBeInTheDocument()
    expect(screen.getByText('2026-09-06')).toBeInTheDocument()
    expect(screen.getByText('client-requirements.mdが確定していること')).toBeInTheDocument()
    expect(screen.getByText('4')).toBeInTheDocument()
    expect(screen.getByText('3.5')).toBeInTheDocument()
  })

  it('taskがnullの場合は選択を促すメッセージを表示する', () => {
    // Arrange & Act
    render(<TaskDetail task={null} />)

    // Assert
    expect(screen.getByText('タスクを選択してください')).toBeInTheDocument()
  })

  it('descriptionやdue_date等が未設定の場合は未設定であることを示す', () => {
    // Arrange
    const taskWithoutOptionalFields: Task = {
      ...task,
      description: null,
      due_date: null,
      definition_of_done: null,
      estimated_effort: null,
      actual_effort: null,
    }

    // Act
    render(<TaskDetail task={taskWithoutOptionalFields} />)

    // Assert
    expect(screen.getAllByText('未設定').length).toBeGreaterThan(0)
  })
})
