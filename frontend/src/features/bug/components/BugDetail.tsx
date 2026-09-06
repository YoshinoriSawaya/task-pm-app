import type { Bug } from '../types'
import styles from './BugDetail.module.css'

interface BugDetailProps {
  bug: Bug | null
}

function displayValue(value: string | number | null): string | number {
  return value ?? '未設定'
}

export function BugDetail({ bug }: BugDetailProps): React.JSX.Element {
  if (bug === null) {
    return <p>バグを選択してください</p>
  }

  return (
    <div className={styles.container}>
      <h2>{bug.title}</h2>
      <div className={styles.row}>
        <span className={styles.label}>説明</span>
        <span>{displayValue(bug.description)}</span>
      </div>
      <div className={styles.row}>
        <span className={styles.label}>深刻度</span>
        <span>{bug.severity}</span>
      </div>
      <div className={styles.row}>
        <span className={styles.label}>ステータス</span>
        <span>{bug.status}</span>
      </div>
      <div className={styles.row}>
        <span className={styles.label}>関連タスクID</span>
        <span>{displayValue(bug.related_task_id)}</span>
      </div>
      <div className={styles.row}>
        <span className={styles.label}>発見日</span>
        <span>{bug.discovered_at}</span>
      </div>
      <div className={styles.row}>
        <span className={styles.label}>解決日</span>
        <span>{displayValue(bug.resolved_at)}</span>
      </div>
    </div>
  )
}
