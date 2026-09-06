import { apiBaseUrl } from '../../../config/env'
import type { ProgressSummary } from '../types'

interface ErrorBody {
  message?: string
}

async function parseJsonSafely(response: Response): Promise<unknown> {
  try {
    return await response.json()
  } catch {
    return null
  }
}

async function handleResponse<T>(response: Response): Promise<T> {
  if (!response.ok) {
    const body = (await parseJsonSafely(response)) as ErrorBody | null
    throw new Error(body?.message ?? `リクエストに失敗しました(status: ${String(response.status)})`)
  }
  return (await response.json()) as T
}

export async function fetchProgress(): Promise<ProgressSummary> {
  const response = await fetch(`${apiBaseUrl}/progress`)
  return handleResponse<ProgressSummary>(response)
}
