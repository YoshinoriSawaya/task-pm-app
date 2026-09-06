import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import { TaskPage } from './TaskPage'
import { useTasks } from '../hooks/useTasks'
import { useTask } from '../hooks/useTask'
import { createTask, updateTask, deleteTask } from '../api/taskApiClient'
import type { Task } from '../types'

jest.mock('../hooks/useTasks')
jest.mock('../hooks/useTask')
jest.mock('../api/taskApiClient')

const mockUseTasks = useTasks as jest.MockedFunction<typeof useTasks>
const mockUseTask = useTask as jest.MockedFunction<typeof useTask>
const mockCreateTask = createTask as jest.MockedFunction<typeof createTask>
const mockUpdateTask = updateTask as jest.MockedFunction<typeof updateTask>
const mockDeleteTask = deleteTask as jest.MockedFunction<typeof deleteTask>

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
  const refetchTasks = jest.fn()
  const refetchTask = jest.fn()

  afterEach(() => {
    jest.clearAllMocks()
  })

  it('一覧が読み込み中の場合は読み込み中メッセージを表示する', () => {
    // Arrange
    mockUseTasks.mockReturnValue({
      data: null,
      error: null,
      isLoading: true,
      refetch: refetchTasks,
    })
    mockUseTask.mockReturnValue({ data: null, error: null, isLoading: false, refetch: refetchTask })

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
      refetch: refetchTasks,
    })
    mockUseTask.mockReturnValue({ data: null, error: null, isLoading: false, refetch: refetchTask })

    // Act
    render(<TaskPage />)

    // Assert
    expect(screen.getByRole('alert')).toHaveTextContent('一覧の取得に失敗しました')
  })

  it('タスクを選択すると詳細取得フックへidが渡され、詳細が表示される', () => {
    // Arrange
    mockUseTasks.mockReturnValue({
      data: [task],
      error: null,
      isLoading: false,
      refetch: refetchTasks,
    })
    mockUseTask.mockReturnValue({ data: null, error: null, isLoading: false, refetch: refetchTask })
    render(<TaskPage />)
    expect(screen.getByText('タスクを選択してください')).toBeInTheDocument()

    // Act
    mockUseTask.mockReturnValue({ data: task, error: null, isLoading: false, refetch: refetchTask })
    fireEvent.click(screen.getByRole('button', { name: '要件定義' }))

    // Assert
    expect(mockUseTask).toHaveBeenLastCalledWith(1)
  })

  it('新規作成ボタンから作成フォームを送信するとcreateTaskが呼ばれ、一覧がrefetchされる', async () => {
    // Arrange
    mockUseTasks.mockReturnValue({
      data: [task],
      error: null,
      isLoading: false,
      refetch: refetchTasks,
    })
    mockUseTask.mockReturnValue({ data: null, error: null, isLoading: false, refetch: refetchTask })
    mockCreateTask.mockResolvedValue({ ...task, id: 2, title: '新しいタスク' })
    render(<TaskPage />)

    // Act
    fireEvent.click(screen.getByRole('button', { name: '新規作成' }))
    fireEvent.change(screen.getByLabelText('タイトル'), { target: { value: '新しいタスク' } })
    fireEvent.click(screen.getByRole('button', { name: '作成' }))

    // Assert
    await waitFor(() => {
      expect(mockCreateTask).toHaveBeenCalled()
    })
    expect(refetchTasks).toHaveBeenCalled()
    expect(screen.queryByLabelText('タイトル')).not.toBeInTheDocument()
  })

  it('詳細表示中に編集して送信するとupdateTaskが呼ばれ、一覧・詳細がrefetchされる', async () => {
    // Arrange
    mockUseTasks.mockReturnValue({
      data: [task],
      error: null,
      isLoading: false,
      refetch: refetchTasks,
    })
    mockUseTask.mockReturnValue({ data: task, error: null, isLoading: false, refetch: refetchTask })
    mockUpdateTask.mockResolvedValue({ ...task, status: 'in_progress' })
    render(<TaskPage />)

    // Act
    fireEvent.click(screen.getByRole('button', { name: '要件定義' }))
    fireEvent.click(screen.getByRole('button', { name: '編集' }))
    fireEvent.click(screen.getByRole('button', { name: '更新' }))

    // Assert
    await waitFor(() => {
      expect(mockUpdateTask).toHaveBeenCalledWith(1, expect.any(Object))
    })
    expect(refetchTasks).toHaveBeenCalled()
    expect(refetchTask).toHaveBeenCalled()
  })

  it('削除ボタンを押すとdeleteTaskが呼ばれ、選択が解除され一覧がrefetchされる', async () => {
    // Arrange
    mockUseTasks.mockReturnValue({
      data: [task],
      error: null,
      isLoading: false,
      refetch: refetchTasks,
    })
    mockUseTask.mockReturnValue({ data: task, error: null, isLoading: false, refetch: refetchTask })
    mockDeleteTask.mockResolvedValue(undefined)
    render(<TaskPage />)

    // Act
    fireEvent.click(screen.getByRole('button', { name: '要件定義' }))
    fireEvent.click(screen.getByRole('button', { name: '削除' }))

    // Assert
    await waitFor(() => {
      expect(mockDeleteTask).toHaveBeenCalledWith(1)
    })
    expect(refetchTasks).toHaveBeenCalled()
  })

  it('削除に失敗した場合、詳細表示(viewモード)にErrorMessageを表示する(/code-review指摘)', async () => {
    // Arrange
    mockUseTasks.mockReturnValue({
      data: [task],
      error: null,
      isLoading: false,
      refetch: refetchTasks,
    })
    mockUseTask.mockReturnValue({ data: task, error: null, isLoading: false, refetch: refetchTask })
    mockDeleteTask.mockRejectedValue(new Error('削除に失敗しました(サーバーエラー)'))
    render(<TaskPage />)

    // Act
    fireEvent.click(screen.getByRole('button', { name: '要件定義' }))
    fireEvent.click(screen.getByRole('button', { name: '削除' }))

    // Assert
    await waitFor(() => {
      expect(screen.getByRole('alert')).toHaveTextContent('削除に失敗しました(サーバーエラー)')
    })
  })

  it('作成中に別タスクを選択すると、作成フォームを閉じて詳細を表示する(/code-review指摘)', () => {
    // Arrange
    mockUseTasks.mockReturnValue({
      data: [task],
      error: null,
      isLoading: false,
      refetch: refetchTasks,
    })
    mockUseTask.mockReturnValue({ data: task, error: null, isLoading: false, refetch: refetchTask })
    render(<TaskPage />)
    fireEvent.click(screen.getByRole('button', { name: '新規作成' }))
    expect(screen.getByLabelText('タイトル')).toBeInTheDocument()

    // Act
    fireEvent.click(screen.getByRole('button', { name: '要件定義' }))

    // Assert
    expect(screen.queryByLabelText('タイトル')).not.toBeInTheDocument()
    expect(screen.getByRole('heading', { name: '要件定義' })).toBeInTheDocument()
  })

  it('編集中に新規作成をキャンセルしても、編集フォームが再表示されない(/code-review指摘)', () => {
    // Arrange
    mockUseTasks.mockReturnValue({
      data: [task],
      error: null,
      isLoading: false,
      refetch: refetchTasks,
    })
    mockUseTask.mockReturnValue({ data: task, error: null, isLoading: false, refetch: refetchTask })
    render(<TaskPage />)
    fireEvent.click(screen.getByRole('button', { name: '要件定義' }))
    fireEvent.click(screen.getByRole('button', { name: '編集' }))
    expect(screen.getByRole('button', { name: '更新' })).toBeInTheDocument()

    // Act
    fireEvent.click(screen.getByRole('button', { name: '新規作成' }))
    fireEvent.click(screen.getByRole('button', { name: 'キャンセル' }))

    // Assert
    expect(screen.queryByRole('button', { name: '更新' })).not.toBeInTheDocument()
    expect(screen.getByRole('button', { name: '編集' })).toBeInTheDocument()
  })

  it('タスク切替時に詳細取得中の場合は読み込み中と表示し、前のタスクの詳細を残さない(/code-review指摘)', () => {
    // Arrange
    mockUseTasks.mockReturnValue({
      data: [task],
      error: null,
      isLoading: false,
      refetch: refetchTasks,
    })
    mockUseTask.mockReturnValue({ data: null, error: null, isLoading: true, refetch: refetchTask })

    // Act
    render(<TaskPage />)

    // Assert
    expect(screen.getByText('詳細を読み込み中...')).toBeInTheDocument()
    expect(screen.queryByRole('heading', { name: '要件定義' })).not.toBeInTheDocument()
  })
})
