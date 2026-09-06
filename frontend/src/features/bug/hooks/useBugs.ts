import { useCallback, useEffect, useState } from 'react'
import { fetchBugs } from '../api/bugApiClient'
import type { Bug } from '../types'

interface UseBugsResult {
  data: Bug[] | null
  error: string | null
  isLoading: boolean
  refetch: () => void
}

export function useBugs(): UseBugsResult {
  const [data, setData] = useState<Bug[] | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [refetchCount, setRefetchCount] = useState(0)

  useEffect(() => {
    let isMounted = true

    setIsLoading(true)
    fetchBugs()
      .then((bugs) => {
        if (!isMounted) return
        setData(bugs)
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
