import type { Task } from '../types'
import styles from './TaskDetail.module.css'

interface TaskDetailProps {
  task: Task | null
}

function displayValue(value: string | number | null): string | number {
  return value ?? '未設定'
}

export function TaskDetail({ task }: TaskDetailProps): React.JSX.Element {
  if (task === null) {
    return <p>タスクを選択してください</p>
  }

  return (
    <div className={styles.container}>
      <h2>{task.title}</h2>
      <div className={styles.row}>
        <span className={styles.label}>説明</span>
        <span>{displayValue(task.description)}</span>
      </div>
      <div className={styles.row}>
        <span className={styles.label}>ステータス</span>
        <span>{task.status}</span>
      </div>
      <div className={styles.row}>
        <span className={styles.label}>優先度</span>
        <span>{task.priority}</span>
      </div>
      <div className={styles.row}>
        <span className={styles.label}>期限</span>
        <span>{displayValue(task.due_date)}</span>
      </div>
      <div className={styles.row}>
        <span className={styles.label}>完了の定義</span>
        <span>{displayValue(task.definition_of_done)}</span>
      </div>
      <div className={styles.row}>
        <span className={styles.label}>見積り工数(h)</span>
        <span>{displayValue(task.estimated_effort)}</span>
      </div>
      <div className={styles.row}>
        <span className={styles.label}>実績工数(h)</span>
        <span>{displayValue(task.actual_effort)}</span>
      </div>
    </div>
  )
}
