import { useEffect, useState } from 'react'
import { fetchTask } from '../api/taskApiClient'
import type { Task } from '../types'

interface UseTaskResult {
  data: Task | null
  error: string | null
  isLoading: boolean
}

export function useTask(id: number | null): UseTaskResult {
  const [data, setData] = useState<Task | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(id !== null)

  useEffect(() => {
    if (id === null) {
      setData(null)
      setError(null)
      setIsLoading(false)
      return
    }

    let isMounted = true

    setIsLoading(true)
    fetchTask(id)
      .then((task) => {
        if (!isMounted) return
        setData(task)
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
  }, [id])

  return { data, error, isLoading }
}
