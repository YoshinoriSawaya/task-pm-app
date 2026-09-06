// docs/architecture/api-design.md の Bug リソース定義と1対1で対応させる

export type BugSeverity = 'high' | 'medium' | 'low'
export type BugStatus = 'open' | 'resolved'

export interface Bug {
  id: number
  related_task_id: number | null
  title: string
  description: string | null
  severity: BugSeverity
  status: BugStatus
  discovered_at: string
  resolved_at: string | null
  created_at: string
  updated_at: string
}

// POST /api/bugs のリクエストボディ。statusは指定不可(常にopenから開始)
export interface CreateBugInput {
  related_task_id: number | null
  title: string
  description: string | null
  severity: BugSeverity
  discovered_at: string
}

// PATCH /api/bugs/{id} のリクエストボディ。related_task_idは受け付けない(作成時のみ指定可能、Taskと同じ方針)。
// resolved_atを指定する場合はstatusも同時にresolvedにする必要がある
export interface UpdateBugInput {
  title: string
  description: string | null
  severity: BugSeverity
  status: BugStatus
  discovered_at: string
  resolved_at: string | null
}
