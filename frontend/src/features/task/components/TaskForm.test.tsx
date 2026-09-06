import { render, screen, fireEvent } from '@testing-library/react'
import { TaskForm } from './TaskForm'
import type { CreateTaskInput, Task, UpdateTaskInput } from '../types'

const existingTask: Task = {
  id: 1,
  parent_task_id: null,
  title: '要件定義',
  description: 'スコープを固める',
  status: 'in_progress',
  priority: 'high',
  due_date: '2026-09-06',
  definition_of_done: 'client-requirements.mdが確定していること',
  estimated_effort: 4,
  actual_effort: 2,
  created_at: '2026-09-05T02:00:00Z',
  updated_at: '2026-09-05T03:00:00Z',
  subtasks: [],
}

describe('TaskForm(作成モード)', () => {
  it('ステータス・実績工数は表示しない(作成時は指定不可のため)', () => {
    // Arrange & Act
    render(<TaskForm mode="create" onSubmit={jest.fn()} />)

    // Assert
    expect(screen.getByLabelText('タイトル')).toBeInTheDocument()
    expect(screen.queryByLabelText('ステータス')).not.toBeInTheDocument()
    expect(screen.queryByLabelText('実績工数(h)')).not.toBeInTheDocument()
  })

  it('タイトルが空のまま送信すると検証エラーを表示し、onSubmitを呼ばない', () => {
    // Arrange
    const handleSubmit = jest.fn()
    render(<TaskForm mode="create" onSubmit={handleSubmit} />)

    // Act
    fireEvent.click(screen.getByRole('button', { name: '作成' }))

    // Assert
    expect(screen.getByText('タイトルは必須です')).toBeInTheDocument()
    expect(handleSubmit).not.toHaveBeenCalled()
  })

  it('必須項目を入力して送信するとCreateTaskInputの形でonSubmitが呼ばれる(parent_task_idはnull)', () => {
    // Arrange
    const handleSubmit = jest.fn()
    render(<TaskForm mode="create" onSubmit={handleSubmit} />)

    // Act
    fireEvent.change(screen.getByLabelText('タイトル'), { target: { value: '要件定義' } })
    fireEvent.change(screen.getByLabelText('見積り工数(h)'), { target: { value: '4' } })
    fireEvent.click(screen.getByRole('button', { name: '作成' }))

    // Assert
    const expected: CreateTaskInput = {
      parent_task_id: null,
      title: '要件定義',
      description: null,
      priority: 'medium',
      due_date: null,
      definition_of_done: null,
      estimated_effort: 4,
    }
    expect(handleSubmit).toHaveBeenCalledWith(expected)
  })

  it('親タスクの選択肢が無い場合、親タスクフィールドを表示しない', () => {
    // Arrange & Act
    render(<TaskForm mode="create" onSubmit={jest.fn()} parentTaskOptions={[]} />)

    // Assert
    expect(screen.queryByLabelText('親タスク')).not.toBeInTheDocument()
  })

  it('親タスクの選択肢がある場合、選択して送信するとparent_task_idを含むCreateTaskInputでonSubmitが呼ばれる', () => {
    // Arrange
    const handleSubmit = jest.fn()
    render(<TaskForm mode="create" onSubmit={handleSubmit} parentTaskOptions={[existingTask]} />)

    // Act
    fireEvent.change(screen.getByLabelText('タイトル'), { target: { value: 'スコープ確定' } })
    fireEvent.change(screen.getByLabelText('親タスク'), { target: { value: '1' } })
    fireEvent.click(screen.getByRole('button', { name: '作成' }))

    // Assert
    const expected: CreateTaskInput = {
      parent_task_id: 1,
      title: 'スコープ確定',
      description: null,
      priority: 'medium',
      due_date: null,
      definition_of_done: null,
      estimated_effort: null,
    }
    expect(handleSubmit).toHaveBeenCalledWith(expected)
  })
})

describe('TaskForm(編集モード)', () => {
  it('initialValuesの内容がフォームに反映される', () => {
    // Arrange & Act
    render(<TaskForm mode="edit" initialValues={existingTask} onSubmit={jest.fn()} />)

    // Assert
    expect(screen.getByLabelText('タイトル')).toHaveValue('要件定義')
    expect(screen.getByLabelText('ステータス')).toHaveValue('in_progress')
    expect(screen.getByLabelText('実績工数(h)')).toHaveValue(2)
  })

  it('変更して送信するとUpdateTaskInputの形でonSubmitが呼ばれる', () => {
    // Arrange
    const handleSubmit = jest.fn()
    render(<TaskForm mode="edit" initialValues={existingTask} onSubmit={handleSubmit} />)

    // Act
    fireEvent.change(screen.getByLabelText('ステータス'), { target: { value: 'done' } })
    fireEvent.click(screen.getByRole('button', { name: '更新' }))

    // Assert
    const expected: UpdateTaskInput = {
      title: '要件定義',
      description: 'スコープを固める',
      status: 'done',
      priority: 'high',
      due_date: '2026-09-06',
      definition_of_done: 'client-requirements.mdが確定していること',
      estimated_effort: 4,
      actual_effort: 2,
    }
    expect(handleSubmit).toHaveBeenCalledWith(expected)
  })

  it('キャンセルボタンを押すとonCancelが呼ばれる', () => {
    // Arrange
    const handleCancel = jest.fn()
    render(
      <TaskForm
        mode="edit"
        initialValues={existingTask}
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
      <TaskForm
        mode="edit"
        initialValues={existingTask}
        onSubmit={jest.fn()}
        error="更新に失敗しました"
      />,
    )

    // Assert
    expect(screen.getByRole('alert')).toHaveTextContent('更新に失敗しました')
  })
})
