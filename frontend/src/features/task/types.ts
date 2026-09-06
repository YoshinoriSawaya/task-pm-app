// docs/architecture/api-design.md の Task リソース定義と1対1で対応させる

export type TaskStatus = 'not_started' | 'in_progress' | 'done'
export type TaskPriority = 'high' | 'medium' | 'low'

export interface Task {
  id: number
  parent_task_id: number | null
  title: string
  description: string | null
  status: TaskStatus
  priority: TaskPriority
  due_date: string | null
  definition_of_done: string | null
  estimated_effort: number | null
  actual_effort: number | null
  created_at: string
  updated_at: string
  // 親タスクのレスポンスにのみ含まれる(子タスク自身のレスポンスにはキー自体が存在しない)
  subtasks?: Task[]
}
