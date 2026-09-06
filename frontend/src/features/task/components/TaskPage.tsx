import { useState } from 'react'
import { useTasks } from '../hooks/useTasks'
import { useTask } from '../hooks/useTask'
import { TaskList } from './TaskList'
import { TaskDetail } from './TaskDetail'
import { ErrorMessage } from '../../../components/ErrorMessage'
import styles from './TaskPage.module.css'

export function TaskPage(): React.JSX.Element {
  const [selectedTaskId, setSelectedTaskId] = useState<number | null>(null)
  const { data: tasks, error: listError, isLoading: isListLoading } = useTasks()
  const { data: selectedTask, error: detailError } = useTask(selectedTaskId)

  return (
    <div className={styles.page}>
      <section className={styles.listSection}>
        <h1>タスク一覧</h1>
        {isListLoading && <p>読み込み中...</p>}
        {listError !== null && <ErrorMessage message={listError} />}
        {tasks !== null && (
          <TaskList
            tasks={tasks}
            selectedTaskId={selectedTaskId}
            onSelectTask={setSelectedTaskId}
          />
        )}
      </section>
      <section className={styles.detailSection}>
        {detailError !== null ? (
          <ErrorMessage message={detailError} />
        ) : (
          <TaskDetail task={selectedTask} />
        )}
      </section>
    </div>
  )
}
