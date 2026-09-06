// docs/architecture/api-design.md の GET /api/progress レスポンス定義と1対1で対応させる(ADR-0002)

export interface EvmSummary {
  bac: number
  pv: number
  ev: number
  ac: number
  cv: number
  sv: number
  cpi: number
  spi: number
  eac: number
  etc: number
  vac: number
}

export interface BugStats {
  total: number
  open: number
  resolved: number
  resolution_rate: number | null
  defect_density: number | null
}

export interface ProgressSummary {
  evm: EvmSummary
  bugs: BugStats
  calculated_at: string
}
