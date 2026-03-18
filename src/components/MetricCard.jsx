function MetricCard({ title, value, subtitle, variant = 'default', big = false }) {
  return (
    <article className={`metric-card ${variant}`}>
      <p className="metric-title">{title}</p>
      <p className={`metric-value ${big ? 'big' : ''}`}>{value}</p>
      {subtitle ? <p className="metric-subtitle">{subtitle}</p> : null}
    </article>
  )
}

export default MetricCard
