import { useState } from 'react'
import { useBugs } from '../hooks/useBugs'
import { useBug } from '../hooks/useBug'
import { createBug, deleteBug, updateBug } from '../api/bugApiClient'
import { useTasks } from '../../task/hooks/useTasks'
import { BugList } from './BugList'
import { BugDetail } from './BugDetail'
import { BugForm } from './BugForm'
import { ErrorMessage } from '../../../components/ErrorMessage'
import type { CreateBugInput, UpdateBugInput } from '../types'
import styles from './BugPage.module.css'

type DetailMode = 'view' | 'edit'

export function BugPage(): React.JSX.Element {
  const [selectedBugId, setSelectedBugId] = useState<number | null>(null)
  const [isCreating, setIsCreating] = useState(false)
  const [detailMode, setDetailMode] = useState<DetailMode>('view')
  const [mutationError, setMutationError] = useState<string | null>(null)

  const { data: bugs, error: listError, isLoading: isListLoading, refetch: refetchBugs } = useBugs()
  const {
    data: selectedBug,
    error: detailError,
    isLoading: isDetailLoading,
    refetch: refetchBug,
  } = useBug(selectedBugId)
  // 関連タスク選択用。トップレベルタスクのみで十分なため、あえて子タスクは含めない
  const { data: tasks } = useTasks()

  function handleSelectBug(id: number): void {
    setSelectedBugId(id)
    setIsCreating(false)
    setDetailMode('view')
    setMutationError(null)
  }

  function handleStartCreate(): void {
    setIsCreating(true)
    setDetailMode('view')
    setMutationError(null)
  }

  async function handleCreate(input: CreateBugInput): Promise<void> {
    setMutationError(null)
    try {
      await createBug(input)
      setIsCreating(false)
      refetchBugs()
    } catch (err) {
      setMutationError(err instanceof Error ? err.message : '作成に失敗しました')
    }
  }

  async function handleUpdate(input: UpdateBugInput): Promise<void> {
    if (selectedBugId === null) return
    setMutationError(null)
    try {
      await updateBug(selectedBugId, input)
      setDetailMode('view')
      refetchBugs()
      refetchBug()
    } catch (err) {
      setMutationError(err instanceof Error ? err.message : '更新に失敗しました')
    }
  }

  async function handleDelete(): Promise<void> {
    if (selectedBugId === null) return
    setMutationError(null)
    try {
      await deleteBug(selectedBugId)
      setSelectedBugId(null)
      refetchBugs()
    } catch (err) {
      setMutationError(err instanceof Error ? err.message : '削除に失敗しました')
    }
  }

  return (
    <div className={styles.page}>
      <section className={styles.listSection}>
        <h1>バグ一覧</h1>
        <button type="button" onClick={handleStartCreate}>
          新規作成
        </button>
        {isListLoading && <p>読み込み中...</p>}
        {listError !== null && <ErrorMessage message={listError} />}
        {bugs !== null && (
          <BugList bugs={bugs} selectedBugId={selectedBugId} onSelectBug={handleSelectBug} />
        )}
      </section>
      <section className={styles.detailSection}>
        {isCreating && (
          <BugForm
            mode="create"
            onSubmit={(input) => {
              void handleCreate(input)
            }}
            onCancel={() => {
              setIsCreating(false)
              setMutationError(null)
            }}
            error={mutationError}
            relatedTaskOptions={tasks ?? []}
          />
        )}
        {!isCreating && isDetailLoading && <p>詳細を読み込み中...</p>}
        {!isCreating && !isDetailLoading && detailError !== null && (
          <ErrorMessage message={detailError} />
        )}
        {!isCreating && !isDetailLoading && detailError === null && selectedBug === null && (
          <BugDetail bug={null} />
        )}
        {!isCreating &&
          !isDetailLoading &&
          detailError === null &&
          selectedBug !== null &&
          detailMode === 'view' && (
            <>
              <BugDetail bug={selectedBug} />
              {mutationError !== null && <ErrorMessage message={mutationError} />}
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
        {!isCreating &&
          !isDetailLoading &&
          detailError === null &&
          selectedBug !== null &&
          detailMode === 'edit' && (
            <BugForm
              mode="edit"
              initialValues={selectedBug}
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
