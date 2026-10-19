import { getNameParts } from '../../../utils/nameUtils';
import { getStatusBadgeClass } from '../../../utils/applicationStatus';
export default function ApplicantHeading({
  user,
  application,
  nextStep,
  stage,
  title
}) {
  return <section className="workspace-page-heading">
  <div>
    <span className="workspace-eyebrow">MAKE YOUR EXPERIENCE COUNT</span>
    <h1>{title || ('Hello, ' + (getNameParts(user || {}).firstName || 'there') + '.')}</h1>
    <p>
      {nextStep}
    </p>
  </div>
  <div className="applicant-hero-status">
    <span className={`status-badge ${application ? getStatusBadgeClass(application.status) : 'status-draft'}`}>
      {stage}
    </span>
    <small>
      {application?.submittedAt ? 'Submitted ' + new Date(application.submittedAt).toLocaleDateString('en-PH', {
          month: 'short',
          day: 'numeric',
          year: 'numeric'
        }) : 'Your application workspace'}
    </small>
  </div>
</section>;
}
