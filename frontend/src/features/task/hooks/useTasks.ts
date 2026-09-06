import { useCallback, useEffect, useState } from 'react'
import { fetchTasks } from '../api/taskApiClient'
import type { Task } from '../types'

interface UseTasksResult {
  data: Task[] | null
  error: string | null
  isLoading: boolean
  refetch: () => void
}

export function useTasks(): UseTasksResult {
  const [data, setData] = useState<Task[] | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [refetchCount, setRefetchCount] = useState(0)

  useEffect(() => {
    let isMounted = true

    setIsLoading(true)
    fetchTasks()
      .then((tasks) => {
        if (!isMounted) return
        setData(tasks)
        setError(null)
      })
      .catch((err: unknown) => {
        if (!isMounted) return
        setError(err instanceof Error ? err.message : '不明なエラーが発生しました')
      })
      .finally(() => {
        if (!isMounted) return
        setIsLoading(false)
      })

    return () => {
      isMounted = false
    }
  }, [refetchCount])

  const refetch = useCallback(() => {
    setRefetchCount((count) => count + 1)
  }, [])

  return { data, error, isLoading, refetch }
}
