# The Detention Saver

A single-page React application that helps college students track attendance risk and avoid detention by calculating:

- Remaining classes in the semester for a selected subject
- How many classes must be attended to reach 75% and 90%
- Safe bunk buffer before dropping below 75%
- What-if projections based on planned future skips

## Tech Stack

- React (functional components + hooks)
- Vite
- Plain CSS

## Project Structure

```text
src/
	components/
		Header.jsx
		InputPanel.jsx
		MetricCard.jsx
		ResultsDashboard.jsx
		WarningBanner.jsx
		WhatIfCalculator.jsx
	hooks/
		useAttendanceCalc.js
	App.jsx
	App.css
	index.css
	main.jsx
```

## Run Locally

1. Install dependencies:

```bash
npm install
```

2. Start dev server:

```bash
npm run dev
```

3. Open the local URL printed by Vite.

## Attendance Logic Notes

- Hardcoded semester range:
	- Start: `2026-01-05`
	- End: `2026-04-30`
- Weekend rule is strict:
	- Sunday = 0
	- Saturday = 6
	- Both skipped while counting schedule classes
- Timetable is hardcoded per subject by weekday
- All calculations are reactive and memoized in `useAttendanceCalc`

## UI States

- Normal: default white card layout
- Recoverable warning: pulsing red border for risk state
- Critical: flashing detention banner + red screen alert overlay
- Safe/Excellent: subtle green glow when attendance is very strong
