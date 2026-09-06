import { apiBaseUrl } from '../../../config/env'
import type { Task } from '../types'

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

export async function fetchTasks(): Promise<Task[]> {
  const response = await fetch(`${apiBaseUrl}/tasks`)
  const body = await handleResponse<{ data: Task[] }>(response)
  return body.data
}

export async function fetchTask(id: number): Promise<Task> {
  const response = await fetch(`${apiBaseUrl}/tasks/${String(id)}`)
  return handleResponse<Task>(response)
}
