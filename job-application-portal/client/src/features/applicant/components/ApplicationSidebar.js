import { Link } from 'react-router-dom';
import Icon from '../../../components/Icon';
import { getStatusBadgeClass } from '../../../utils/applicationStatus';

function formattedInterviewDate(value) {
  if (!value) return '';
  const date = new Date(value);
  return Number.isNaN(date.getTime()) ? '' : date.toLocaleDateString('en-PH', {
    month: 'long', day: 'numeric', year: 'numeric'
  });
}

export default function ApplicationSidebar({
  application,
  contactReady,
  complete,
  resumeFile,
  stage,
  steps
}) {
  const submitted = Boolean(application);
  const resumeReady = Boolean(resumeFile || application?.resume);
  const status = application?.status;
  // Only recognized workflow states advance the timeline. Imported/unknown records
  // must not appear as completed hiring decisions.
  const currentStep = !submitted ? -1 : status === 'hired' || status === 'rejected'
    ? 3 : status === 'interview_scheduled' ? 2 : status === 'pending' ? 1 : 0;
  const date = formattedInterviewDate(application?.interviewSchedule?.date);
  const nextMessage = !submitted
    ? 'Confirm your details and upload your resume to submit your application.'
    : status === 'hired'
      ? 'Your hiring decision has been recorded. Check for any notes from the hiring team.'
      : status === 'rejected'
        ? 'Your application has been reviewed. Check for any feedback from the hiring team.'
        : status === 'pending'
          ? 'Your application is in the review queue. Interview details will appear here if one is scheduled.'
          : 'Review your application and check here for further updates from the hiring team.';

  return <aside className="applicant-aside applicant-dashboard-grid" aria-label="Application progress and updates">
    <div className="applicant-dashboard-main-column">
      <section className="workspace-card status-journey-card" id="application-status" aria-labelledby="application-status-title">
        <header className="workspace-card-header applicant-card-heading">
          <div>
            <span className="applicant-card-kicker">HIRING JOURNEY</span>
            <h2 id="application-status-title">Application status</h2>
            <p>Follow the stages recorded by the hiring team.</p>
          </div>
          <span className={`status-badge ${submitted ? getStatusBadgeClass(status) : 'status-draft'}`}>{stage}</span>
        </header>
        <ol className="application-timeline">
          {steps.map((label, index) => {
            const reached = index <= currentStep;
            const current = index === currentStep;
            return <li key={label} className={`${reached ? 'reached' : ''}${current ? ' is-current' : ''}`.trim()}
              aria-current={current ? 'step' : undefined}>
              <span className="applicant-step-indicator" aria-hidden="true">
                {index < currentStep ? <Icon name="check" size={15} /> : index + 1}
              </span>
              <div className="applicant-step-copy">
                <strong>{label}</strong>
                {current && <small>{stage}</small>}
              </div>
            </li>;
          })}
        </ol>
        {!submitted && <p className="applicant-timeline-footnote">Your hiring timeline will begin after you submit your application.</p>}
      </section>
      {application?.adminNotes && <section className="workspace-card applicant-team-note" aria-labelledby="applicant-team-notes-heading">
        <header className="workspace-card-header applicant-card-heading">
          <div><span className="applicant-card-kicker">LATEST MESSAGE</span><h2 id="applicant-team-notes-heading">From the hiring team</h2></div>
          <Icon name="file" size={19} />
        </header>
        <p className="workspace-helper">{application.adminNotes}</p>
      </section>}
    </div>
    <div className="applicant-dashboard-side-column">
      <section className="workspace-card readiness-card applicant-progress-card" aria-labelledby="applicant-readiness-heading">
        <header className="workspace-card-header applicant-card-heading">
          <div><span className="applicant-card-kicker">YOUR CHECKLIST</span><h2 id="applicant-readiness-heading">Application readiness</h2></div>
          <Icon name="check" size={19} />
        </header>
        <div className="applicant-readiness-value">
          <strong>{Math.round(complete / 5 * 100)}%</strong>
          <span>{complete} of 5 profile requirements complete</span>
        </div>
        <progress value={complete} max={5} aria-label="Application readiness" />
        <ul className="readiness-checklist">
          <li className={contactReady ? 'done' : ''}><Icon name="check" size={16} /><span>Contact information</span></li>
          <li className={resumeReady ? 'done' : ''}><Icon name="check" size={16} /><span>Resume or CV</span></li>
          <li className={submitted ? 'done' : ''}><Icon name="check" size={16} /><span>Application submitted</span></li>
        </ul>
        <p className="applicant-readiness-note">Based on your name, email, phone, and resume.</p>
      </section>
      {date ? <section className="workspace-card interview-detail applicant-update-card" aria-labelledby="applicant-interview-heading">
        <header className="workspace-card-header applicant-card-heading">
          <div><span className="applicant-card-kicker">SCHEDULE</span><h2 id="applicant-interview-heading">Your interview</h2></div>
          <Icon name="calendar" size={19} />
        </header>
        <strong className="applicant-interview-date">{date}</strong>
        {application.interviewSchedule.time && <p className="applicant-interview-info"><Icon name="clock" size={16} />{application.interviewSchedule.time}</p>}
        {application.interviewSchedule.location && <p className="applicant-interview-info">{application.interviewSchedule.location}</p>}
        {application.interviewSchedule.notes && <p className="workspace-helper applicant-interview-notes">{application.interviewSchedule.notes}</p>}
      </section> : <section className="workspace-card applicant-update-card applicant-next-step-card" aria-labelledby="applicant-updates-heading">
        <header className="workspace-card-header applicant-card-heading">
          <div><span className="applicant-card-kicker">STAY INFORMED</span><h2 id="applicant-updates-heading">What happens next?</h2></div>
          <Icon name="clock" size={19} />
        </header>
        <p className="workspace-helper">{nextMessage}</p>
        <Link to="/engineer-dashboard/application" className="applicant-dashboard-text-action">
          {submitted ? 'Review your details' : 'Complete your application'} <Icon name="arrow" size={16} />
        </Link>
      </section>}
    </div>
    <p className="workspace-helper aside-note">Keep your contact details and resume current so the hiring team can reach you.</p>
  </aside>;
}
