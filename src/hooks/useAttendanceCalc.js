import { useMemo } from 'react'

const SEMESTER_START = '2026-01-05'
const SEMESTER_END = '2026-04-30'

// Sunday = 0 and Saturday = 6 are intentionally left out.
const SUBJECT_TIMETABLE = {
  Workshop: {
    4: 4,
  },
  Programming: {
    1: 3,
    2: 1,
  },
  Mathematics: {
    1: 1,
    3: 2,
    5: 1,
  },
  Electronics: {
    2: 2,
    4: 1,
  },
  Physics: {
    3: 2,
    5: 2,
  },
}

const clampNumber = (value, min, max) => Math.min(Math.max(value, min), max)

const parseDateInput = (value) => {
  if (!value) {
    return null
  }

  const parsed = new Date(`${value}T00:00:00`)
  return Number.isNaN(parsed.getTime()) ? null : parsed
}

const getDateKey = (date) => {
  const year = date.getFullYear()
  const month = String(date.getMonth() + 1).padStart(2, '0')
  const day = String(date.getDate()).padStart(2, '0')
  return `${year}-${month}-${day}`
}

const addDays = (date, days) => {
  const clone = new Date(date)
  clone.setDate(clone.getDate() + days)
  return clone
}

const countScheduledClasses = ({ subject, rangeStart, rangeEnd }) => {
  if (!subject || !rangeStart || !rangeEnd || rangeStart > rangeEnd) {
    return 0
  }

  const dayPlan = SUBJECT_TIMETABLE[subject] ?? {}
  let total = 0
  const cursor = new Date(rangeStart)

  while (cursor <= rangeEnd) {
    const day = cursor.getDay()

    // Strict weekend skip rule: Saturday (6) and Sunday (0).
    if (day !== 0 && day !== 6) {
      total += dayPlan[day] ?? 0
    }

    cursor.setDate(cursor.getDate() + 1)
  }

  return total
}

export const getSubjectNames = () => Object.keys(SUBJECT_TIMETABLE)

export const useAttendanceCalc = ({
  subject,
  today,
  currentAttendancePct,
  currentTotalClasses,
  plannedSkips,
}) => {
  return useMemo(() => {
    const semesterStartDate = parseDateInput(SEMESTER_START)
    const semesterEndDate = parseDateInput(SEMESTER_END)
    const selectedDate = parseDateInput(today)

    const normalizedPct = clampNumber(Number(currentAttendancePct) || 0, 0, 100)
    const normalizedCurrentTotal = Math.max(0, Number(currentTotalClasses) || 0)

    const effectiveToday = selectedDate
      ? new Date(Math.min(selectedDate.getTime(), semesterEndDate.getTime()))
      : semesterStartDate

    const classesHeldBySchedule = countScheduledClasses({
      subject,
      rangeStart: semesterStartDate,
      rangeEnd: effectiveToday,
    })

    const remainingScheduleStart = addDays(effectiveToday, 1)
    const remainingBySchedule = countScheduledClasses({
      subject,
      rangeStart: remainingScheduleStart,
      rangeEnd: semesterEndDate,
    })

    const boundedPlannedSkips = clampNumber(
      Number(plannedSkips) || 0,
      0,
      remainingBySchedule,
    )

    const classesAttended = (normalizedPct / 100) * normalizedCurrentTotal
    const totalClassesEnd = normalizedCurrentTotal + remainingBySchedule
    const remainingAfterPlannedSkips = remainingBySchedule - boundedPlannedSkips

    const mustAttend75Raw = Math.ceil(0.75 * totalClassesEnd - classesAttended)
    const mustAttend90Raw = Math.ceil(0.9 * totalClassesEnd - classesAttended)

    const mustAttend75 = Math.max(0, mustAttend75Raw)
    const mustAttend90 = Math.max(0, mustAttend90Raw)

    const impossibleFor75 = mustAttend75 > remainingAfterPlannedSkips
    const impossibleFor90 = mustAttend90 > remainingAfterPlannedSkips

    const currentTotalAfterSkips = normalizedCurrentTotal + boundedPlannedSkips
    const safeToBunk = Math.floor(classesAttended - 0.75 * currentTotalAfterSkips)

    const projectedAttendedIfAttendRest = classesAttended + remainingAfterPlannedSkips
    const projectedPctIfAttendRest =
      totalClassesEnd > 0
        ? (projectedAttendedIfAttendRest / totalClassesEnd) * 100
        : 0

    const liveCurrentPct =
      currentTotalAfterSkips > 0
        ? (classesAttended / currentTotalAfterSkips) * 100
        : normalizedPct

    const safeGauge =
      currentTotalAfterSkips > 0
        ? clampNumber((liveCurrentPct - 60) / 40, 0, 1)
        : 0

    return {
      semesterStart: SEMESTER_START,
      semesterEnd: SEMESTER_END,
      selectedDate: selectedDate ? getDateKey(selectedDate) : SEMESTER_START,
      classesHeldBySchedule,
      remainingBySchedule,
      remainingAfterPlannedSkips,
      maxSkips: remainingBySchedule,
      boundedPlannedSkips,
      normalizedPct,
      classesAttended,
      totalClassesEnd,
      mustAttend75,
      mustAttend90,
      impossibleFor75,
      impossibleFor90,
      safeToBunk,
      projectedPctIfAttendRest,
      liveCurrentPct,
      safeGauge,
      status: {
        critical: impossibleFor75,
        recoverableWarning: !impossibleFor75 && liveCurrentPct < 75,
        safe: liveCurrentPct >= 75,
        excellent: liveCurrentPct >= 90,
      },
    }
  }, [subject, today, currentAttendancePct, currentTotalClasses, plannedSkips])
}
