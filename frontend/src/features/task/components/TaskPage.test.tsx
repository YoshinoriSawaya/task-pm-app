import { render, screen, fireEvent } from '@testing-library/react'
import { TaskPage } from './TaskPage'
import { useTasks } from '../hooks/useTasks'
import { useTask } from '../hooks/useTask'
import type { Task } from '../types'

jest.mock('../hooks/useTasks')
jest.mock('../hooks/useTask')

const mockUseTasks = useTasks as jest.MockedFunction<typeof useTasks>
const mockUseTask = useTask as jest.MockedFunction<typeof useTask>

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

describe('TaskPage', () => {
  afterEach(() => {
    jest.clearAllMocks()
  })

  it('一覧が読み込み中の場合は読み込み中メッセージを表示する', () => {
    // Arrange
    mockUseTasks.mockReturnValue({ data: null, error: null, isLoading: true })
    mockUseTask.mockReturnValue({ data: null, error: null, isLoading: false })

    // Act
    render(<TaskPage />)

    // Assert
    expect(screen.getByText('読み込み中...')).toBeInTheDocument()
  })

  it('一覧取得エラー時はErrorMessageを表示する', () => {
    // Arrange
    mockUseTasks.mockReturnValue({
      data: null,
      error: '一覧の取得に失敗しました',
      isLoading: false,
    })
    mockUseTask.mockReturnValue({ data: null, error: null, isLoading: false })

    // Act
    render(<TaskPage />)

    // Assert
    expect(screen.getByRole('alert')).toHaveTextContent('一覧の取得に失敗しました')
  })

  it('タスクを選択すると詳細取得フックへidが渡され、詳細が表示される', () => {
    // Arrange
    mockUseTasks.mockReturnValue({ data: [task], error: null, isLoading: false })
    mockUseTask.mockReturnValue({ data: null, error: null, isLoading: false })
    render(<TaskPage />)
    expect(screen.getByText('タスクを選択してください')).toBeInTheDocument()

    // Act
    mockUseTask.mockReturnValue({ data: task, error: null, isLoading: false })
    fireEvent.click(screen.getByText('要件定義'))

    // Assert
    expect(mockUseTask).toHaveBeenLastCalledWith(1)
  })
})
