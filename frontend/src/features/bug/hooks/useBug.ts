import { useCallback, useEffect, useState } from 'react'
import { fetchBug } from '../api/bugApiClient'
import type { Bug } from '../types'

interface UseBugResult {
  data: Bug | null
  error: string | null
  isLoading: boolean
  refetch: () => void
}

export function useBug(id: number | null): UseBugResult {
  const [data, setData] = useState<Bug | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(id !== null)
  const [refetchCount, setRefetchCount] = useState(0)

  useEffect(() => {
    if (id === null) {
      setData(null)
      setError(null)
      setIsLoading(false)
      return
    }

    let isMounted = true

    setIsLoading(true)
    fetchBug(id)
      .then((bug) => {
        if (!isMounted) return
        setData(bug)
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
  }, [id, refetchCount])

  const refetch = useCallback(() => {
    setRefetchCount((count) => count + 1)
  }, [])

  return { data, error, isLoading, refetch }
}
