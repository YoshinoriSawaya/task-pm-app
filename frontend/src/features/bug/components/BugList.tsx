import type { Bug } from '../types'
import styles from './BugList.module.css'

interface BugListProps {
  bugs: Bug[]
  selectedBugId: number | null
  onSelectBug: (id: number) => void
}

export function BugList({ bugs, selectedBugId, onSelectBug }: BugListProps): React.JSX.Element {
  if (bugs.length === 0) {
    return <p>バグはありません</p>
  }

  return (
    <ul className={styles.list}>
      {bugs.map((bug) => {
        const className = [styles.item, bug.id === selectedBugId ? styles.selected : null]
          .filter(Boolean)
          .join(' ')
        return (
          <li key={bug.id}>
            <button
              type="button"
              className={className}
              onClick={() => {
                onSelectBug(bug.id)
              }}
            >
              <span className={styles.badge}>{bug.severity}</span>
              <span className={styles.badge}>{bug.status}</span>
              <span>{bug.title}</span>
            </button>
          </li>
        )
      })}
    </ul>
  )
}
