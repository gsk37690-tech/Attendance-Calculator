function WhatIfCalculator({ plannedSkips, maxSkips, onSkipChange }) {
  return (
    <section className="panel what-if-panel">
      <h2>What if I skip tomorrow?</h2>
      <div className="what-if-controls">
        <label htmlFor="skip-slider">
          I plan to skip <strong>{plannedSkips}</strong> more classes
        </label>
        <input
          id="skip-slider"
          type="range"
          min="0"
          max={maxSkips}
          step="1"
          value={plannedSkips}
          onChange={(event) => onSkipChange(Number(event.target.value))}
        />
        <div className="what-if-scale">
          <span>0</span>
          <span>{maxSkips}</span>
        </div>
      </div>
    </section>
  )
}

export default WhatIfCalculator
