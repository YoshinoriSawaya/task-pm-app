import { useState } from 'react'
import type { CreateTaskInput, Task, TaskPriority, TaskStatus, UpdateTaskInput } from '../types'
import { ErrorMessage } from '../../../components/ErrorMessage'
import styles from './TaskForm.module.css'

interface CreateModeProps {
  mode: 'create'
  initialValues?: undefined
  onSubmit: (input: CreateTaskInput) => void
  onCancel?: () => void
  error?: string | null
  // 子タスクとして作成する場合に選択できる親タスクの候補(トップレベルタスクのみ、
  // 2階層制約により子タスク自身はさらに子を持てないため)。api-design.mdの通り、
  // parent_task_idは作成時にのみ指定可能
  parentTaskOptions?: Task[]
}

interface EditModeProps {
  mode: 'edit'
  initialValues: Task
  onSubmit: (input: UpdateTaskInput) => void
  onCancel?: () => void
  error?: string | null
}

type TaskFormProps = CreateModeProps | EditModeProps

function toNullableString(value: string): string | null {
  return value.trim() === '' ? null : value
}

function toNullableNumber(value: string): number | null {
  return value.trim() === '' ? null : Number(value)
}

export function TaskForm(props: TaskFormProps): React.JSX.Element {
  const { mode, initialValues, onSubmit, onCancel, error } = props
  const parentTaskOptions = mode === 'create' ? (props.parentTaskOptions ?? []) : []

  const [parentTaskId, setParentTaskId] = useState('')
  const [title, setTitle] = useState(initialValues?.title ?? '')
  const [description, setDescription] = useState(initialValues?.description ?? '')
  const [priority, setPriority] = useState<TaskPriority>(initialValues?.priority ?? 'medium')
  const [dueDate, setDueDate] = useState(initialValues?.due_date ?? '')
  const [definitionOfDone, setDefinitionOfDone] = useState(initialValues?.definition_of_done ?? '')
  const [estimatedEffort, setEstimatedEffort] = useState(
    initialValues?.estimated_effort !== undefined && initialValues.estimated_effort !== null
      ? String(initialValues.estimated_effort)
      : '',
  )
  const [status, setStatus] = useState<TaskStatus>(initialValues?.status ?? 'not_started')
  const [actualEffort, setActualEffort] = useState(
    initialValues?.actual_effort !== undefined && initialValues.actual_effort !== null
      ? String(initialValues.actual_effort)
      : '',
  )
  const [titleError, setTitleError] = useState<string | null>(null)

  function handleSubmit(event: React.SubmitEvent<HTMLFormElement>): void {
    event.preventDefault()

    if (title.trim() === '') {
      setTitleError('タイトルは必須です')
      return
    }
    setTitleError(null)

    if (mode === 'create') {
      const input: CreateTaskInput = {
        parent_task_id: parentTaskId === '' ? null : Number(parentTaskId),
        title,
        description: toNullableString(description),
        priority,
        due_date: toNullableString(dueDate),
        definition_of_done: toNullableString(definitionOfDone),
        estimated_effort: toNullableNumber(estimatedEffort),
      }
      onSubmit(input)
      return
    }

    const input: UpdateTaskInput = {
      title,
      description: toNullableString(description),
      status,
      priority,
      due_date: toNullableString(dueDate),
      definition_of_done: toNullableString(definitionOfDone),
      estimated_effort: toNullableNumber(estimatedEffort),
      actual_effort: toNullableNumber(actualEffort),
    }
    onSubmit(input)
  }

  return (
    <form className={styles.form} onSubmit={handleSubmit}>
      {error !== null && error !== undefined && <ErrorMessage message={error} />}

      {mode === 'create' && parentTaskOptions.length > 0 && (
        <div className={styles.field}>
          <label htmlFor="task-parent">親タスク</label>
          <select
            id="task-parent"
            value={parentTaskId}
            onChange={(e) => {
              setParentTaskId(e.target.value)
            }}
          >
            <option value="">なし(トップレベルタスクとして作成)</option>
            {parentTaskOptions.map((task) => (
              <option key={task.id} value={task.id}>
                {task.title}
              </option>
            ))}
          </select>
        </div>
      )}

      <div className={styles.field}>
        <label htmlFor="task-title">タイトル</label>
        <input
          id="task-title"
          type="text"
          value={title}
          onChange={(e) => {
            setTitle(e.target.value)
          }}
        />
        {titleError !== null && <span className={styles.fieldError}>{titleError}</span>}
      </div>

      <div className={styles.field}>
        <label htmlFor="task-description">説明</label>
        <textarea
          id="task-description"
          value={description}
          onChange={(e) => {
            setDescription(e.target.value)
          }}
        />
      </div>

      <div className={styles.field}>
        <label htmlFor="task-priority">優先度</label>
        <select
          id="task-priority"
          value={priority}
          onChange={(e) => {
            setPriority(e.target.value as TaskPriority)
          }}
        >
          <option value="high">high</option>
          <option value="medium">medium</option>
          <option value="low">low</option>
        </select>
      </div>

      {mode === 'edit' && (
        <div className={styles.field}>
          <label htmlFor="task-status">ステータス</label>
          <select
            id="task-status"
            value={status}
            onChange={(e) => {
              setStatus(e.target.value as TaskStatus)
            }}
          >
            <option value="not_started">not_started</option>
            <option value="in_progress">in_progress</option>
            <option value="done">done</option>
          </select>
        </div>
      )}

      <div className={styles.field}>
        <label htmlFor="task-due-date">期限</label>
        <input
          id="task-due-date"
          type="date"
          value={dueDate}
          onChange={(e) => {
            setDueDate(e.target.value)
          }}
        />
      </div>

      <div className={styles.field}>
        <label htmlFor="task-definition-of-done">完了の定義</label>
        <textarea
          id="task-definition-of-done"
          value={definitionOfDone}
          onChange={(e) => {
            setDefinitionOfDone(e.target.value)
          }}
        />
      </div>

      <div className={styles.field}>
        <label htmlFor="task-estimated-effort">見積り工数(h)</label>
        <input
          id="task-estimated-effort"
          type="number"
          step="0.01"
          min="0"
          value={estimatedEffort}
          onChange={(e) => {
            setEstimatedEffort(e.target.value)
          }}
        />
      </div>

      {mode === 'edit' && (
        <div className={styles.field}>
          <label htmlFor="task-actual-effort">実績工数(h)</label>
          <input
            id="task-actual-effort"
            type="number"
            step="0.01"
            min="0"
            value={actualEffort}
            onChange={(e) => {
              setActualEffort(e.target.value)
            }}
          />
        </div>
      )}

      <div className={styles.actions}>
        <button type="submit">{mode === 'create' ? '作成' : '更新'}</button>
        {onCancel !== undefined && (
          <button type="button" onClick={onCancel}>
            キャンセル
          </button>
        )}
      </div>
    </form>
  )
}
