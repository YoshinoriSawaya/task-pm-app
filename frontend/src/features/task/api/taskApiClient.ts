import { apiBaseUrl } from '../../../config/env'
import type { CreateTaskInput, Task, UpdateTaskInput } from '../types'

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

async function throwIfError(response: Response): Promise<void> {
  if (!response.ok) {
    const body = (await parseJsonSafely(response)) as ErrorBody | null
    throw new Error(body?.message ?? `リクエストに失敗しました(status: ${String(response.status)})`)
  }
}

async function handleResponse<T>(response: Response): Promise<T> {
  await throwIfError(response)
  return (await response.json()) as T
}

const jsonHeaders = { 'Content-Type': 'application/json' }

export async function fetchTasks(): Promise<Task[]> {
  const response = await fetch(`${apiBaseUrl}/tasks`)
  const body = await handleResponse<{ data: Task[] }>(response)
  return body.data
}

export async function fetchTask(id: number): Promise<Task> {
  const response = await fetch(`${apiBaseUrl}/tasks/${String(id)}`)
  return handleResponse<Task>(response)
}

export async function createTask(input: CreateTaskInput): Promise<Task> {
  const response = await fetch(`${apiBaseUrl}/tasks`, {
    method: 'POST',
    headers: jsonHeaders,
    body: JSON.stringify(input),
  })
  return handleResponse<Task>(response)
}

export async function updateTask(id: number, input: UpdateTaskInput): Promise<Task> {
  const response = await fetch(`${apiBaseUrl}/tasks/${String(id)}`, {
    method: 'PATCH',
    headers: jsonHeaders,
    body: JSON.stringify(input),
  })
  return handleResponse<Task>(response)
}

export async function deleteTask(id: number): Promise<void> {
  const response = await fetch(`${apiBaseUrl}/tasks/${String(id)}`, { method: 'DELETE' })
  await throwIfError(response)
}
