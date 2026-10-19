import { Link } from 'react-router-dom';
import Icon from '../../../components/Icon';
export default function ApplicationSidebar({
  application,
  contactReady,
  complete,
  resumeFile,
  stage,
  stageIndex,
  steps
}) {
  return <aside className="applicant-aside">
  <section className="workspace-card status-journey-card" id="application-status">
    <div className="workspace-card-header">
      <h2>Application status</h2>
      <Icon name="file" />
    </div>
    <ol className="application-timeline">
      {steps.map((label, index) => <li key={label} className={index <= stageIndex && (index !== 2 || application?.interviewSchedule?.date || application?.status === 'interview_scheduled') ? 'reached' : ''} aria-current={index === stageIndex ? 'step' : undefined}>
        <span>
          {index < stageIndex ? <Icon name="check" size={12} /> : index + 1}
        </span>
        <div>
          <strong>
            {label}
          </strong>
          {index === stageIndex && <small>
            {stage}
          </small>}
        </div>
      </li>)}
    </ol>
    {!application && <p className="workspace-helper">Your progress will appear here after you submit.</p>}
  </section>
  <section className="workspace-card readiness-card applicant-progress-card">
    <div className="workspace-card-header">
      <h2>Your progress</h2>
      <Icon name="clock" />
    </div>
    <div className="profile-readiness">
      <strong>{Math.round(complete / 5 * 100)}%</strong>
      <span>Application readiness</span>
      <progress value={complete} max="5" aria-label="Application readiness" />
    </div>
    <ul className="readiness-checklist">
      <li className={contactReady ? 'done' : ''}><Icon name="check" size={15} />Personal and contact details</li>
      <li className={resumeFile || application?.resume ? 'done' : ''}><Icon name="check" size={15} />Resume attached</li>
      <li className={application ? 'done' : ''}><Icon name="check" size={15} />Application submitted</li>
    </ul>
  </section>
  {application?.interviewSchedule?.date ? <section className="workspace-card interview-detail applicant-update-card">
    <div className="workspace-card-header">
      <h2>Your interview</h2>
      <Icon name="calendar" />
    </div>
    <strong>
      {new Date(application.interviewSchedule.date).toLocaleDateString('en-PH', {
          month: 'long',
          day: 'numeric',
          year: 'numeric'
        })}
    </strong>
    <p>
      {application.interviewSchedule.time}
    </p>
    <p>
      {application.interviewSchedule.location}
    </p>
    {application.interviewSchedule.notes && <p className="workspace-helper">
      {application.interviewSchedule.notes}
    </p>}
  </section> : <section className="workspace-card applicant-update-card applicant-next-step-card"><div className="workspace-card-header"><h2>{application ? 'What happens next?' : 'Start your application'}</h2><Icon name={application ? 'clock' : 'file'} /></div><p className="workspace-helper">{application ? 'The hiring team is reviewing your application. Any interview details will appear here.' : 'Add your resume and confirm your contact details to enter the hiring process.'}</p><Link to="/engineer-dashboard/application">{application ? 'Review your details' : 'Complete application'} <Icon name="arrow" size={14} /></Link></section>}
  {application?.adminNotes && <section className="workspace-card applicant-team-note">
    <div className="workspace-card-header">
      <h2>From the hiring team</h2>
    </div>
    <p className="workspace-helper">
      {application.adminNotes}
    </p>
  </section>}
  <p className="workspace-helper aside-note">Keep your contact details and resume current so the hiring team can reach you.</p>
</aside>;
}
