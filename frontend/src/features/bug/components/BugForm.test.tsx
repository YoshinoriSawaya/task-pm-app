import { render, screen, fireEvent } from '@testing-library/react'
import { BugForm } from './BugForm'
import type { Bug, CreateBugInput, UpdateBugInput } from '../types'
import type { Task } from '../../task/types'

const existingBug: Bug = {
  id: 1,
  related_task_id: 2,
  title: 'ステータス更新後に画面が再描画されない',
  description: 'PATCH成功後、一覧の該当行が古いステータスのまま表示される',
  severity: 'high',
  status: 'open',
  discovered_at: '2026-09-06',
  resolved_at: null,
  created_at: '2026-09-06T04:00:00Z',
  updated_at: '2026-09-06T04:00:00Z',
}

const relatedTask: Task = {
  id: 2,
  parent_task_id: null,
  title: 'タスクCRUD API実装',
  description: null,
  status: 'done',
  priority: 'high',
  due_date: null,
  definition_of_done: null,
  estimated_effort: null,
  actual_effort: null,
  created_at: '2026-09-05T00:00:00Z',
  updated_at: '2026-09-05T00:00:00Z',
  subtasks: [],
}

describe('BugForm(作成モード)', () => {
  it('ステータス・解決日は表示しない(作成時は指定不可のため)', () => {
    // Arrange & Act
    render(<BugForm mode="create" onSubmit={jest.fn()} />)

    // Assert
    expect(screen.getByLabelText('タイトル')).toBeInTheDocument()
    expect(screen.getByLabelText('発見日')).toBeInTheDocument()
    expect(screen.queryByLabelText('ステータス')).not.toBeInTheDocument()
    expect(screen.queryByLabelText('解決日')).not.toBeInTheDocument()
  })

  it('タイトルまたは発見日が空のまま送信すると検証エラーを表示し、onSubmitを呼ばない', () => {
    // Arrange
    const handleSubmit = jest.fn()
    render(<BugForm mode="create" onSubmit={handleSubmit} />)

    // Act
    fireEvent.click(screen.getByRole('button', { name: '作成' }))

    // Assert
    expect(screen.getByText('タイトルは必須です')).toBeInTheDocument()
    expect(screen.getByText('発見日は必須です')).toBeInTheDocument()
    expect(handleSubmit).not.toHaveBeenCalled()
  })

  it('必須項目を入力して送信するとCreateBugInputの形でonSubmitが呼ばれる', () => {
    // Arrange
    const handleSubmit = jest.fn()
    render(<BugForm mode="create" onSubmit={handleSubmit} />)

    // Act
    fireEvent.change(screen.getByLabelText('タイトル'), { target: { value: 'バグ1' } })
    fireEvent.change(screen.getByLabelText('発見日'), { target: { value: '2026-09-06' } })
    fireEvent.click(screen.getByRole('button', { name: '作成' }))

    // Assert
    const expected: CreateBugInput = {
      related_task_id: null,
      title: 'バグ1',
      description: null,
      severity: 'medium',
      discovered_at: '2026-09-06',
    }
    expect(handleSubmit).toHaveBeenCalledWith(expected)
  })

  it('関連タスクの選択肢がある場合、選択して送信するとrelated_task_idを含む', () => {
    // Arrange
    const handleSubmit = jest.fn()
    render(<BugForm mode="create" onSubmit={handleSubmit} relatedTaskOptions={[relatedTask]} />)

    // Act
    fireEvent.change(screen.getByLabelText('タイトル'), { target: { value: 'バグ1' } })
    fireEvent.change(screen.getByLabelText('発見日'), { target: { value: '2026-09-06' } })
    fireEvent.change(screen.getByLabelText('関連タスク'), { target: { value: '2' } })
    fireEvent.click(screen.getByRole('button', { name: '作成' }))

    // Assert
    expect(handleSubmit).toHaveBeenCalledWith(expect.objectContaining({ related_task_id: 2 }))
  })
})

describe('BugForm(編集モード)', () => {
  it('initialValuesの内容がフォームに反映される', () => {
    // Arrange & Act
    render(<BugForm mode="edit" initialValues={existingBug} onSubmit={jest.fn()} />)

    // Assert
    expect(screen.getByLabelText('タイトル')).toHaveValue(existingBug.title)
    expect(screen.getByLabelText('ステータス')).toHaveValue('open')
  })

  it('ステータスをresolvedにして解決日を入力し送信するとUpdateBugInputの形でonSubmitが呼ばれる', () => {
    // Arrange
    const handleSubmit = jest.fn()
    render(<BugForm mode="edit" initialValues={existingBug} onSubmit={handleSubmit} />)

    // Act
    fireEvent.change(screen.getByLabelText('ステータス'), { target: { value: 'resolved' } })
    fireEvent.change(screen.getByLabelText('解決日'), { target: { value: '2026-09-07' } })
    fireEvent.click(screen.getByRole('button', { name: '更新' }))

    // Assert
    const expected: UpdateBugInput = {
      title: existingBug.title,
      description: existingBug.description,
      severity: existingBug.severity,
      status: 'resolved',
      discovered_at: existingBug.discovered_at,
      resolved_at: '2026-09-07',
    }
    expect(handleSubmit).toHaveBeenCalledWith(expected)
  })

  it('ステータスがopenのまま解決日を入力すると検証エラーを表示し、onSubmitを呼ばない', () => {
    // Arrange
    const handleSubmit = jest.fn()
    render(<BugForm mode="edit" initialValues={existingBug} onSubmit={handleSubmit} />)

    // Act
    fireEvent.change(screen.getByLabelText('解決日'), { target: { value: '2026-09-07' } })
    fireEvent.click(screen.getByRole('button', { name: '更新' }))

    // Assert
    expect(
      screen.getByText('解決日を指定する場合はステータスをresolvedにしてください'),
    ).toBeInTheDocument()
    expect(handleSubmit).not.toHaveBeenCalled()
  })

  it('キャンセルボタンを押すとonCancelが呼ばれる', () => {
    // Arrange
    const handleCancel = jest.fn()
    render(
      <BugForm
        mode="edit"
        initialValues={existingBug}
        onSubmit={jest.fn()}
        onCancel={handleCancel}
      />,
    )

    // Act
    fireEvent.click(screen.getByRole('button', { name: 'キャンセル' }))

    // Assert
    expect(handleCancel).toHaveBeenCalled()
  })

  it('errorが指定されている場合はErrorMessageを表示する', () => {
    // Arrange & Act
    render(
      <BugForm
        mode="edit"
        initialValues={existingBug}
        onSubmit={jest.fn()}
        error="更新に失敗しました"
      />,
    )

    // Assert
    expect(screen.getByRole('alert')).toHaveTextContent('更新に失敗しました')
  })
})
