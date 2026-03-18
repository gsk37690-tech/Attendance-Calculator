function InputPanel({
  subjects,
  form,
  onChange,
  classesHeldBySchedule,
}) {
  return (
    <section className="panel input-panel">
      <h2>Input Panel</h2>
      <div className="input-grid">
        <label>
          Subject
          <select
            name="subject"
            value={form.subject}
            onChange={onChange}
          >
            {subjects.map((subjectName) => (
              <option key={subjectName} value={subjectName}>
                {subjectName}
              </option>
            ))}
          </select>
        </label>

        <label>
          Today&apos;s Date
          <input
            type="date"
            name="today"
            value={form.today}
            onChange={onChange}
          />
        </label>

        <label>
          Current Attendance %
          <input
            type="number"
            name="currentAttendancePct"
            min="0"
            max="100"
            step="0.1"
            value={form.currentAttendancePct}
            onChange={onChange}
          />
        </label>

        <label>
          Total Classes Held So Far
          <input
            type="number"
            name="currentTotalClasses"
            min="0"
            step="1"
            value={form.currentTotalClasses}
            onChange={onChange}
          />
        </label>
      </div>
      <p className="helper-text">
        Schedule estimate for this subject till selected date: {classesHeldBySchedule}{' '}
        classes.
      </p>
    </section>
  )
}

export default InputPanel
