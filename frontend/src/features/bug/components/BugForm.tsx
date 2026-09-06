import { useState } from 'react'
import type { Bug, BugSeverity, BugStatus, CreateBugInput, UpdateBugInput } from '../types'
import type { Task } from '../../task/types'
import { ErrorMessage } from '../../../components/ErrorMessage'
import styles from './BugForm.module.css'

interface CreateModeProps {
  mode: 'create'
  initialValues?: undefined
  onSubmit: (input: CreateBugInput) => void
  onCancel?: () => void
  error?: string | null
  // 関連付けられるトップレベルタスクの候補(api-design.mdの通り、related_task_idは作成時にのみ指定可能)
  relatedTaskOptions?: Task[]
}

interface EditModeProps {
  mode: 'edit'
  initialValues: Bug
  onSubmit: (input: UpdateBugInput) => void
  onCancel?: () => void
  error?: string | null
}

type BugFormProps = CreateModeProps | EditModeProps

function toNullableString(value: string): string | null {
  return value.trim() === '' ? null : value
}

export function BugForm(props: BugFormProps): React.JSX.Element {
  const { mode, initialValues, onSubmit, onCancel, error } = props
  const relatedTaskOptions = mode === 'create' ? (props.relatedTaskOptions ?? []) : []

  const [relatedTaskId, setRelatedTaskId] = useState('')
  const [title, setTitle] = useState(initialValues?.title ?? '')
  const [description, setDescription] = useState(initialValues?.description ?? '')
  const [severity, setSeverity] = useState<BugSeverity>(initialValues?.severity ?? 'medium')
  const [status, setStatus] = useState<BugStatus>(initialValues?.status ?? 'open')
  const [discoveredAt, setDiscoveredAt] = useState(initialValues?.discovered_at ?? '')
  const [resolvedAt, setResolvedAt] = useState(initialValues?.resolved_at ?? '')
  const [errors, setErrors] = useState<{
    title?: string
    discoveredAt?: string
    resolvedAt?: string
  }>({})

  function handleSubmit(event: React.SubmitEvent<HTMLFormElement>): void {
    event.preventDefault()

    const nextErrors: typeof errors = {}
    if (title.trim() === '') {
      nextErrors.title = 'タイトルは必須です'
    }
    if (discoveredAt.trim() === '') {
      nextErrors.discoveredAt = '発見日は必須です'
    }
    if (mode === 'edit' && resolvedAt.trim() !== '' && status !== 'resolved') {
      nextErrors.resolvedAt = '解決日を指定する場合はステータスをresolvedにしてください'
    }
    setErrors(nextErrors)
    if (Object.keys(nextErrors).length > 0) {
      return
    }

    if (mode === 'create') {
      const input: CreateBugInput = {
        related_task_id: relatedTaskId === '' ? null : Number(relatedTaskId),
        title,
        description: toNullableString(description),
        severity,
        discovered_at: discoveredAt,
      }
      onSubmit(input)
      return
    }

    const input: UpdateBugInput = {
      title,
      description: toNullableString(description),
      severity,
      status,
      discovered_at: discoveredAt,
      resolved_at: toNullableString(resolvedAt),
    }
    onSubmit(input)
  }

  return (
    <form className={styles.form} onSubmit={handleSubmit}>
      {error !== null && error !== undefined && <ErrorMessage message={error} />}

      {mode === 'create' && relatedTaskOptions.length > 0 && (
        <div className={styles.field}>
          <label htmlFor="bug-related-task">関連タスク</label>
          <select
            id="bug-related-task"
            value={relatedTaskId}
            onChange={(e) => {
              setRelatedTaskId(e.target.value)
            }}
          >
            <option value="">なし</option>
            {relatedTaskOptions.map((task) => (
              <option key={task.id} value={task.id}>
                {task.title}
              </option>
            ))}
          </select>
        </div>
      )}

      <div className={styles.field}>
        <label htmlFor="bug-title">タイトル</label>
        <input
          id="bug-title"
          type="text"
          value={title}
          onChange={(e) => {
            setTitle(e.target.value)
          }}
        />
        {errors.title !== undefined && <span className={styles.fieldError}>{errors.title}</span>}
      </div>

      <div className={styles.field}>
        <label htmlFor="bug-description">説明</label>
        <textarea
          id="bug-description"
          value={description}
          onChange={(e) => {
            setDescription(e.target.value)
          }}
        />
      </div>

      <div className={styles.field}>
        <label htmlFor="bug-severity">深刻度</label>
        <select
          id="bug-severity"
          value={severity}
          onChange={(e) => {
            setSeverity(e.target.value as BugSeverity)
          }}
        >
          <option value="high">high</option>
          <option value="medium">medium</option>
          <option value="low">low</option>
        </select>
      </div>

      {mode === 'edit' && (
        <div className={styles.field}>
          <label htmlFor="bug-status">ステータス</label>
          <select
            id="bug-status"
            value={status}
            onChange={(e) => {
              setStatus(e.target.value as BugStatus)
            }}
          >
            <option value="open">open</option>
            <option value="resolved">resolved</option>
          </select>
        </div>
      )}

      <div className={styles.field}>
        <label htmlFor="bug-discovered-at">発見日</label>
        <input
          id="bug-discovered-at"
          type="date"
          value={discoveredAt}
          onChange={(e) => {
            setDiscoveredAt(e.target.value)
          }}
        />
        {errors.discoveredAt !== undefined && (
          <span className={styles.fieldError}>{errors.discoveredAt}</span>
        )}
      </div>

      {mode === 'edit' && (
        <div className={styles.field}>
          <label htmlFor="bug-resolved-at">解決日</label>
          <input
            id="bug-resolved-at"
            type="date"
            value={resolvedAt}
            onChange={(e) => {
              setResolvedAt(e.target.value)
            }}
          />
          {errors.resolvedAt !== undefined && (
            <span className={styles.fieldError}>{errors.resolvedAt}</span>
          )}
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
