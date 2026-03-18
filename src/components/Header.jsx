function Header({ semesterStart, semesterEnd }) {
  return (
    <header className="hero-header">
      <p className="eyebrow">Attendance Survival Dashboard</p>
      <h1>The Detention Saver 🚨</h1>
      <p className="semester-meta">
        Semester Window: {semesterStart} to {semesterEnd}
      </p>
    </header>
  )
}

export default Header
