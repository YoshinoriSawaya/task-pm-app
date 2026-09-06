import { apiBaseUrl } from '../../../config/env'
import type { Bug, CreateBugInput, UpdateBugInput } from '../types'

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

export async function fetchBugs(): Promise<Bug[]> {
  const response = await fetch(`${apiBaseUrl}/bugs`)
  const body = await handleResponse<{ data: Bug[] }>(response)
  return body.data
}

export async function fetchBug(id: number): Promise<Bug> {
  const response = await fetch(`${apiBaseUrl}/bugs/${String(id)}`)
  return handleResponse<Bug>(response)
}

export async function createBug(input: CreateBugInput): Promise<Bug> {
  const response = await fetch(`${apiBaseUrl}/bugs`, {
    method: 'POST',
    headers: jsonHeaders,
    body: JSON.stringify(input),
  })
  return handleResponse<Bug>(response)
}

export async function updateBug(id: number, input: UpdateBugInput): Promise<Bug> {
  const response = await fetch(`${apiBaseUrl}/bugs/${String(id)}`, {
    method: 'PATCH',
    headers: jsonHeaders,
    body: JSON.stringify(input),
  })
  return handleResponse<Bug>(response)
}

export async function deleteBug(id: number): Promise<void> {
  const response = await fetch(`${apiBaseUrl}/bugs/${String(id)}`, { method: 'DELETE' })
  await throwIfError(response)
}
