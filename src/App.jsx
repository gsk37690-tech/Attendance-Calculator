import { useEffect, useMemo, useState } from 'react'
import Header from './components/Header'
import InputPanel from './components/InputPanel'
import ResultsDashboard from './components/ResultsDashboard'
import WarningBanner from './components/WarningBanner'
import WhatIfCalculator from './components/WhatIfCalculator'
import { getSubjectNames, useAttendanceCalc } from './hooks/useAttendanceCalc'
import './App.css'

const getTodayDateInput = () => {
  const now = new Date()
  const year = now.getFullYear()
  const month = String(now.getMonth() + 1).padStart(2, '0')
  const day = String(now.getDate()).padStart(2, '0')
  return `${year}-${month}-${day}`
}

function App() {
  const subjects = useMemo(() => getSubjectNames(), [])

  const [form, setForm] = useState({
    subject: subjects[0] ?? 'Workshop',
    today: getTodayDateInput(),
    currentAttendancePct: '76',
    currentTotalClasses: '',
  })

  const [plannedSkips, setPlannedSkips] = useState(0)
  const [manuallyEditedTotal, setManuallyEditedTotal] = useState(false)

  const calc = useAttendanceCalc({
    subject: form.subject,
    today: form.today,
    currentAttendancePct: Number(form.currentAttendancePct),
    currentTotalClasses: Number(form.currentTotalClasses),
    plannedSkips,
  })

  useEffect(() => {
    if (manuallyEditedTotal) {
      return
    }

    const recommended = String(calc.classesHeldBySchedule)
    setForm((prev) =>
      prev.currentTotalClasses === recommended
        ? prev
        : {
            ...prev,
            currentTotalClasses: recommended,
          },
    )
  }, [calc.classesHeldBySchedule, manuallyEditedTotal])

  useEffect(() => {
    if (plannedSkips > calc.maxSkips) {
      setPlannedSkips(calc.maxSkips)
    }
  }, [plannedSkips, calc.maxSkips])

  const handleChange = (event) => {
    const { name, value } = event.target

    if (name === 'currentTotalClasses') {
      setManuallyEditedTotal(true)
    }

    setForm((prev) => ({
      ...prev,
      [name]: value,
    }))
  }

  return (
    <div
      className={`app-shell ${calc.status.excellent ? 'state-excellent' : ''} ${
        calc.status.recoverableWarning ? 'state-warning' : ''
      } ${calc.status.critical ? 'state-critical' : ''}`}
    >
      <WarningBanner show={calc.status.critical} />

      <Header semesterStart={calc.semesterStart} semesterEnd={calc.semesterEnd} />

      <ResultsDashboard calc={calc} />

      <InputPanel
        subjects={subjects}
        form={form}
        onChange={handleChange}
        classesHeldBySchedule={calc.classesHeldBySchedule}
      />

      <WhatIfCalculator
        plannedSkips={calc.boundedPlannedSkips}
        maxSkips={calc.maxSkips}
        onSkipChange={setPlannedSkips}
      />
    </div>
  )
}

export default App
