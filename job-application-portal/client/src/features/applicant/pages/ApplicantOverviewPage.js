import { Link, useOutletContext } from 'react-router-dom';
import ApplicantHeading from '../components/ApplicantHeading';
import ApplicationSidebar from '../components/ApplicationSidebar';
import Icon from '../../../components/Icon';

export default function ApplicantOverviewPage() {
  const model = useOutletContext();
  const hasApplication = Boolean(model.application);

  return <div className="applicant-dashboard-overview">
    <ApplicantHeading user={model.user} application={model.application} nextStep={model.nextStep} stage={model.stage} />

    <section className="applicant-dashboard-action" aria-labelledby="applicant-next-action-title">
      <span className="applicant-dashboard-action-icon" aria-hidden="true"><Icon name="file" size={22} /></span>
      <div className="applicant-dashboard-action-copy">
        <span className="admin-section-eyebrow">YOUR NEXT STEP</span>
        <h2 id="applicant-next-action-title">{hasApplication ? 'Keep your application up to date' : 'Complete your application'}</h2>
        <p>{hasApplication
          ? 'Review your information or upload a newer resume whenever your details change.'
          : 'Confirm your contact information and attach your resume to submit your application.'}</p>
      </div>
      <Link to="/engineer-dashboard/application" className="applicant-dashboard-action-button">
        {hasApplication ? 'Manage application' : 'Start application'}
        <Icon name="arrow" size={17} />
      </Link>
    </section>

    <div className="applicant-dashboard-section-heading">
      <div>
        <span className="admin-section-eyebrow">APPLICATION CENTER</span>
        <h2>Your progress and updates</h2>
        <p>Track each stage, check your readiness, and review messages from the hiring team.</p>
      </div>
    </div>

    <div className="applicant-overview-panels"><ApplicationSidebar {...model} /></div>
  </div>;
}
