import { useState } from 'react'
import { useTasks } from '../hooks/useTasks'
import { useTask } from '../hooks/useTask'
import { createTask, deleteTask, updateTask } from '../api/taskApiClient'
import { TaskList } from './TaskList'
import { TaskDetail } from './TaskDetail'
import { TaskForm } from './TaskForm'
import { ErrorMessage } from '../../../components/ErrorMessage'
import type { CreateTaskInput, UpdateTaskInput } from '../types'
import styles from './TaskPage.module.css'

type DetailMode = 'view' | 'edit'

export function TaskPage(): React.JSX.Element {
  const [selectedTaskId, setSelectedTaskId] = useState<number | null>(null)
  const [isCreating, setIsCreating] = useState(false)
  const [detailMode, setDetailMode] = useState<DetailMode>('view')
  const [mutationError, setMutationError] = useState<string | null>(null)

  const {
    data: tasks,
    error: listError,
    isLoading: isListLoading,
    refetch: refetchTasks,
  } = useTasks()
  const { data: selectedTask, error: detailError, refetch: refetchTask } = useTask(selectedTaskId)

  function handleSelectTask(id: number): void {
    setSelectedTaskId(id)
    setDetailMode('view')
    setMutationError(null)
  }

  async function handleCreate(input: CreateTaskInput): Promise<void> {
    setMutationError(null)
    try {
      await createTask(input)
      setIsCreating(false)
      refetchTasks()
    } catch (err) {
      setMutationError(err instanceof Error ? err.message : '作成に失敗しました')
    }
  }

  async function handleUpdate(input: UpdateTaskInput): Promise<void> {
    if (selectedTaskId === null) return
    setMutationError(null)
    try {
      await updateTask(selectedTaskId, input)
      setDetailMode('view')
      refetchTasks()
      refetchTask()
    } catch (err) {
      setMutationError(err instanceof Error ? err.message : '更新に失敗しました')
    }
  }

  async function handleDelete(): Promise<void> {
    if (selectedTaskId === null) return
    setMutationError(null)
    try {
      await deleteTask(selectedTaskId)
      setSelectedTaskId(null)
      refetchTasks()
    } catch (err) {
      setMutationError(err instanceof Error ? err.message : '削除に失敗しました')
    }
  }

  return (
    <div className={styles.page}>
      <section className={styles.listSection}>
        <h1>タスク一覧</h1>
        <button
          type="button"
          onClick={() => {
            setIsCreating(true)
            setMutationError(null)
          }}
        >
          新規作成
        </button>
        {isListLoading && <p>読み込み中...</p>}
        {listError !== null && <ErrorMessage message={listError} />}
        {tasks !== null && (
          <TaskList tasks={tasks} selectedTaskId={selectedTaskId} onSelectTask={handleSelectTask} />
        )}
      </section>
      <section className={styles.detailSection}>
        {isCreating && (
          <TaskForm
            mode="create"
            onSubmit={(input) => {
              void handleCreate(input)
            }}
            onCancel={() => {
              setIsCreating(false)
              setMutationError(null)
            }}
            error={mutationError}
            parentTaskOptions={tasks ?? []}
          />
        )}
        {!isCreating && detailError !== null && <ErrorMessage message={detailError} />}
        {!isCreating && detailError === null && selectedTask === null && <TaskDetail task={null} />}
        {!isCreating && detailError === null && selectedTask !== null && detailMode === 'view' && (
          <>
            <TaskDetail task={selectedTask} />
            <div className={styles.detailActions}>
              <button
                type="button"
                onClick={() => {
                  setDetailMode('edit')
                  setMutationError(null)
                }}
              >
                編集
              </button>
              <button
                type="button"
                onClick={() => {
                  void handleDelete()
                }}
              >
                削除
              </button>
            </div>
          </>
        )}
        {!isCreating && detailError === null && selectedTask !== null && detailMode === 'edit' && (
          <TaskForm
            mode="edit"
            initialValues={selectedTask}
            onSubmit={(input) => {
              void handleUpdate(input)
            }}
            onCancel={() => {
              setDetailMode('view')
              setMutationError(null)
            }}
            error={mutationError}
          />
        )}
      </section>
    </div>
  )
}
