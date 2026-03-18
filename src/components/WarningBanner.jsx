function WarningBanner({ show }) {
  if (!show) {
    return null
  }

  return (
    <div className="critical-banner" role="alert" aria-live="assertive">
      DETENTION INCOMING. Cannot recover.
    </div>
  )
}

export default WarningBanner
