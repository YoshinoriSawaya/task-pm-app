import { useProgress } from '../hooks/useProgress'
import { ErrorMessage } from '../../../components/ErrorMessage'
import styles from './ProgressDashboard.module.css'

function displayPercent(value: number | null): string {
  return value === null ? '未計測' : `${String(Math.round(value * 100))}%`
}

function displayOrUnmeasured(value: number | null): string | number {
  return value ?? '未計測'
}

export function ProgressDashboard(): React.JSX.Element {
  const { data, error, isLoading } = useProgress()

  return (
    <div className={styles.page}>
      <h1>進捗ダッシュボード</h1>
      {isLoading && <p>読み込み中...</p>}
      {error !== null && <ErrorMessage message={error} />}

      {data !== null && (
        <>
          <section className={styles.section}>
            <h2>EVM(進捗指標)</h2>
            <table className={styles.table}>
              <thead>
                <tr>
                  <th>BAC</th>
                  <th>PV</th>
                  <th>EV</th>
                  <th>AC</th>
                  <th>CV</th>
                  <th>SV</th>
                  <th>CPI</th>
                  <th>SPI</th>
                  <th>EAC</th>
                  <th>ETC</th>
                  <th>VAC</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>{data.evm.bac}</td>
                  <td>{data.evm.pv}</td>
                  <td>{data.evm.ev}</td>
                  <td>{data.evm.ac}</td>
                  <td>{data.evm.cv}</td>
                  <td>{data.evm.sv}</td>
                  <td>{data.evm.cpi}</td>
                  <td>{data.evm.spi}</td>
                  <td>{data.evm.eac}</td>
                  <td>{data.evm.etc}</td>
                  <td>{data.evm.vac}</td>
                </tr>
              </tbody>
            </table>
          </section>

          <section className={styles.section}>
            <h2>バグ検知度</h2>
            <table className={styles.table}>
              <thead>
                <tr>
                  <th>総数</th>
                  <th>未解決</th>
                  <th>解決済み</th>
                  <th>解決率</th>
                  <th>検知度</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>{data.bugs.total}</td>
                  <td>{data.bugs.open}</td>
                  <td>{data.bugs.resolved}</td>
                  <td>{displayPercent(data.bugs.resolution_rate)}</td>
                  <td>{displayOrUnmeasured(data.bugs.defect_density)}</td>
                </tr>
              </tbody>
            </table>
          </section>
        </>
      )}
    </div>
  )
}
