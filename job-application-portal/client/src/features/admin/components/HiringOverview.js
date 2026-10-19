export default function HiringOverview({
  totalApplicants,
  pendingCount,
  interviewCount
}) {
  return <section className="dashboard-hero" id="admin-overview">
  <div>
    <span className="sidebar-kicker">YOUR HIRING OVERVIEW</span>
    <h1>Hiring overview</h1>
    <p>Review applications, manage interviews, and keep your hiring process moving.</p>
  </div>
  <div className="dashboard-hero-meta">
    <div className="hero-stat">
      <span className="hero-stat-label">Applicants in pipeline</span>
      <strong className="hero-stat-value">
        {totalApplicants}
      </strong>
    </div>
    <div className="hero-stat">
      <span className="hero-stat-label">Pending actions</span>
      <strong className="hero-stat-value">
        {pendingCount + interviewCount}
      </strong>
    </div>
  </div>
</section>;
}
