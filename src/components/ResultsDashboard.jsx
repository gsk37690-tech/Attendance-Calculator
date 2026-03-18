import MetricCard from './MetricCard'

const formatNumber = (value) => {
  if (!Number.isFinite(value)) {
    return '0'
  }

  return value % 1 === 0 ? String(value) : value.toFixed(2)
}

function ResultsDashboard({ calc }) {
  const {
    remainingBySchedule,
    mustAttend75,
    mustAttend90,
    impossibleFor75,
    impossibleFor90,
    safeToBunk,
    safeGauge,
    projectedPctIfAttendRest,
    remainingAfterPlannedSkips,
    status,
  } = calc

  const safeVariant = safeToBunk >= 0 ? 'safe-bunk' : 'danger-bunk'
  const safeText = safeToBunk >= 0 ? safeToBunk : safeToBunk

  return (
    <section className="results-section">
      <h2>Results Dashboard</h2>
      <div className="metrics-grid">
        <MetricCard
          title="Total Remaining Classes"
          value={remainingBySchedule}
          subtitle={`Attendable after planned skips: ${remainingAfterPlannedSkips}`}
          variant="default"
          big
        />

        <MetricCard
          title="Must Attend for 75%"
          value={mustAttend75}
          subtitle={
            impossibleFor75
              ? 'DETENTION INCOMING. Cannot recover.'
              : status.safe
                ? "You're safe!"
                : `Recoverable. Attend at least ${mustAttend75} classes.`
          }
          variant={
            impossibleFor75
              ? 'critical'
              : status.safe
                ? 'safe'
                : 'warning'
          }
          big
        />

        <MetricCard
          title="Must Attend for 90%"
          value={mustAttend90}
          subtitle={
            impossibleFor90
              ? 'Cannot reach 90% from this scenario.'
              : 'Possible if you stay disciplined.'
          }
          variant={impossibleFor90 ? 'warning-yellow' : 'default'}
          big
        />

        <article className={`metric-card ${safeVariant}`}>
          <p className="metric-title">Safe to Bunk</p>
          <p className="metric-value big">{safeText}</p>
          <p className="metric-subtitle">Buffer before falling below 75%</p>
          <div className="meter-shell" aria-hidden="true">
            <div
              className="meter-fill"
              style={{ width: `${Math.round(safeGauge * 100)}%` }}
            />
          </div>
        </article>
      </div>

      <p className="projection-note">
        Projected attendance if you attend every remaining planned class: {' '}
        {formatNumber(projectedPctIfAttendRest)}%
      </p>
    </section>
  )
}

export default ResultsDashboard
