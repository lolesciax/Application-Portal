import { Link, useOutletContext } from 'react-router-dom';
import ApplicantHeading from '../components/ApplicantHeading';
import ApplicationSidebar from '../components/ApplicationSidebar';
import Icon from '../../../components/Icon';
export default function ApplicantOverviewPage() {
 const model = useOutletContext();
 return <><ApplicantHeading user={model.user} application={model.application} nextStep={model.nextStep} stage={model.stage} />
 <Link to="/engineer-dashboard/application" className="module-action-card applicant-application-action applicant-next-action"><span className="dashboard-section-icon"><Icon name="file" /></span><div><span className="module-action-eyebrow">YOUR NEXT STEP</span><h2>{model.application ? 'Keep your application current' : 'Complete and submit your application'}</h2><p>{model.application ? 'Review your contact details and replace your resume whenever something changes.' : 'Check your profile, attach your resume, and send it to the hiring team.'}</p></div><span className="applicant-action-label">Open application <Icon name="arrow" size={16} /></span></Link>
 <div className="applicant-overview-panels"><ApplicationSidebar {...model} /></div>
 </>;
}
