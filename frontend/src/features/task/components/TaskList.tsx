import type { Task } from '../types'
import styles from './TaskList.module.css'

interface TaskListProps {
  tasks: Task[]
  selectedTaskId: number | null
  onSelectTask: (id: number) => void
}

interface TaskItemProps {
  task: Task
  isSelected: boolean
  onSelect: () => void
}

function TaskItem({ task, isSelected, onSelect }: TaskItemProps): React.JSX.Element {
  const className = [styles.item, isSelected ? styles.selected : null].filter(Boolean).join(' ')
  return (
    <button type="button" className={className} onClick={onSelect}>
      {task.title}
    </button>
  )
}

export function TaskList({
  tasks,
  selectedTaskId,
  onSelectTask,
}: TaskListProps): React.JSX.Element {
  if (tasks.length === 0) {
    return <p>タスクがありません</p>
  }

  return (
    <ul className={styles.list}>
      {tasks.map((task) => (
        <li key={task.id}>
          <TaskItem
            task={task}
            isSelected={task.id === selectedTaskId}
            onSelect={() => {
              onSelectTask(task.id)
            }}
          />
          {task.subtasks !== undefined && task.subtasks.length > 0 && (
            <ul className={styles.subtasks}>
              {task.subtasks.map((subtask) => (
                <li key={subtask.id}>
                  <TaskItem
                    task={subtask}
                    isSelected={subtask.id === selectedTaskId}
                    onSelect={() => {
                      onSelectTask(subtask.id)
                    }}
                  />
                </li>
              ))}
            </ul>
          )}
        </li>
      ))}
    </ul>
  )
}
