import { Link } from 'react-router-dom';
import Icon from '../../../components/Icon';
import { getApplicationDisplayName } from '../utils/applicationDisplay';

export default function HiringPipelineBoard({
  statusBreakdown,
  upcomingInterviews,
  totalApplicants,
  applications,
  handleViewApplication
}) {
  return <div className="pipeline-workspace" id="admin-pipeline">
    <section className="pipeline-stage-section" aria-labelledby="pipeline-stage-heading">
      <div className="pipeline-section-heading">
        <div>
          <span className="sidebar-kicker">CANDIDATE FLOW</span>
          <h2 id="pipeline-stage-heading">Hiring stages</h2>
          <p>Open a stage to review its applicants or select a candidate below.</p>
        </div>
        <span className="pipeline-total"><strong>{totalApplicants}</strong> candidates</span>
      </div>
      <div className="pipeline-board">
        {statusBreakdown.map(item => {
          const candidates = applications.filter(application => application.status === item.key).slice(0, 3);
          return <article className={`pipeline-lane pipeline-lane-${item.key}`} key={item.key}>
            <div className="pipeline-lane-header">
              <span className={`pipeline-stage-dot ${item.badgeClass}`} />
              <div><h3>{item.label}</h3><span>{item.count} {item.count === 1 ? 'candidate' : 'candidates'}</span></div>
              <strong>{totalApplicants ? Math.round(item.count / totalApplicants * 100) : 0}%</strong>
            </div>
            <progress className="pipeline-meter" value={item.count} max={totalApplicants || 1} aria-label={`${item.label}: ${item.count} of ${totalApplicants} applications`} />
            {candidates.length ? <ul className="pipeline-candidate-list">{candidates.map(application => <li key={application._id}>
              <button type="button" onClick={() => handleViewApplication(application)}>
                <span className="admin-candidate-avatar">{`${application.personalInfo?.firstName?.[0] || ''}${application.personalInfo?.lastName?.[0] || ''}` || 'AP'}</span>
                <span><strong>{getApplicationDisplayName(application)}</strong><small>{application.personalInfo?.position || 'Role not specified'}</small></span>
                <Icon name="arrow" size={14} />
              </button>
            </li>)}</ul> : <div className="pipeline-lane-empty">No candidates in this stage.</div>}
            <Link to={`/admin-dashboard/applications?status=${item.key}`}>View stage <Icon name="arrow" size={13} /></Link>
          </article>;
        })}
      </div>
    </section>
    <section className="application-card interview-agenda" aria-labelledby="interview-agenda-heading">
      <div className="section-header">
        <div><h2 id="interview-agenda-heading"><span className="dashboard-section-icon"><Icon name="calendar" size={17} /></span>Interview agenda</h2><p className="section-subtitle">Upcoming interviews ordered by date.</p></div>
        <Link to="/admin-dashboard/applications?status=interview_scheduled">View all interviews <Icon name="arrow" size={14} /></Link>
      </div>
      {upcomingInterviews.length ? <ol className="interview-agenda-list">{upcomingInterviews.map(application => <li key={application._id}>
        <div className="agenda-date"><strong>{new Date(application.interviewSchedule.date).toLocaleDateString('en-PH', { day: '2-digit' })}</strong><span>{new Date(application.interviewSchedule.date).toLocaleDateString('en-PH', { month: 'short' })}</span></div>
        <div className="agenda-candidate"><strong>{getApplicationDisplayName(application)}</strong><span>{application.personalInfo?.email || application.user?.email || 'No email provided'}</span></div>
        <div className="agenda-details"><strong>{application.interviewSchedule.time}</strong><span>{application.interviewSchedule.location || 'Location to be confirmed'}</span></div>
        <button type="button" className="admin-interview-review" onClick={() => handleViewApplication(application)}>Review <Icon name="arrow" size={14} /></button>
      </li>)}</ol> : <div className="pipeline-empty-agenda"><Icon name="calendar" size={24} /><div><strong>No upcoming interviews</strong><p>Schedule an interview from an applicant's review window.</p></div><Link to="/admin-dashboard/applications">Open applications</Link></div>}
    </section>
  </div>;
}
