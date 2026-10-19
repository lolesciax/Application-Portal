import { getNameParts } from '../../../utils/nameUtils';
import { getStatusBadgeClass } from '../../../utils/applicationStatus';

export default function ApplicantHeading({ user, application, nextStep, stage, title }) {
  const firstName = getNameParts(user || {}).firstName || 'there';
  return <header className="workspace-page-heading" aria-label="Application workspace overview">
    <div><span className="admin-section-eyebrow">{title ? 'APPLICATION DETAILS' : 'YOUR WORKSPACE'}</span>
      <h1>{title || `Welcome back, ${firstName}`}</h1><p>{nextStep}</p></div>
    <div className="applicant-hero-status"><span className={`status-badge ${application ? getStatusBadgeClass(application.status) : 'status-draft'}`}>{stage}</span>
      <small>{application?.submittedAt && !Number.isNaN(new Date(application.submittedAt).getTime()) ? `Submitted ${new Date(application.submittedAt).toLocaleDateString('en-PH', { month: 'short', day: 'numeric', year: 'numeric' })}` : 'Application status'}</small></div>
  </header>;
}
