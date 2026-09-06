import { useState } from 'react'
import { TaskPage } from './features/task/components/TaskPage'
import { BugPage } from './features/bug/components/BugPage'
import { ProgressDashboard } from './features/progress/components/ProgressDashboard'
import styles from './App.module.css'

type Tab = 'task' | 'bug' | 'progress'

const TABS: { key: Tab; label: string }[] = [
  { key: 'task', label: 'タスク' },
  { key: 'bug', label: 'バグ' },
  { key: 'progress', label: '進捗' },
]

function App(): React.JSX.Element {
  const [tab, setTab] = useState<Tab>('task')

  return (
    <div>
      <nav className={styles.nav}>
        {TABS.map(({ key, label }) => {
          const className = [styles.navButton, tab === key ? styles.navButtonActive : null]
            .filter(Boolean)
            .join(' ')
          return (
            <button
              key={key}
              type="button"
              className={className}
              onClick={() => {
                setTab(key)
              }}
            >
              {label}
            </button>
          )
        })}
      </nav>
      {tab === 'task' && <TaskPage />}
      {tab === 'bug' && <BugPage />}
      {tab === 'progress' && <ProgressDashboard />}
    </div>
  )
}

export default App
