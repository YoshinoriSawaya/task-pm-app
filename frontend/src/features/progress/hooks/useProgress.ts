import { useCallback, useEffect, useState } from 'react'
import { fetchProgress } from '../api/progressApiClient'
import type { ProgressSummary } from '../types'

interface UseProgressResult {
  data: ProgressSummary | null
  error: string | null
  isLoading: boolean
  refetch: () => void
}

export function useProgress(): UseProgressResult {
  const [data, setData] = useState<ProgressSummary | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [refetchCount, setRefetchCount] = useState(0)

  useEffect(() => {
    let isMounted = true

    setIsLoading(true)
    fetchProgress()
      .then((progress) => {
        if (!isMounted) return
        setData(progress)
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
