import { useOutletContext } from 'react-router-dom';
import ApplicationQueue from '../components/ApplicationQueue';
import useApplicationQueue from '../hooks/useApplicationQueue';
export default function AdminApplicationsPage() {
 const { model } = useOutletContext();
 const queue = useApplicationQueue(model.applications);
 return <><section className="dashboard-hero admin-page-hero"><div><span className="sidebar-kicker">APPLICANT RECORDS</span><h1>Applications</h1><p>Search, filter, and review each application in one dedicated workspace.</p></div><div className="admin-page-hero-count"><strong>{model.applications.length}</strong><span>Total records</span></div></section>
 <ApplicationQueue applications={model.applications} queue={queue} refreshingApplications={model.refreshingApplications} handleRefreshApplications={model.handleRefreshApplications} handleViewApplication={model.handleViewApplication} />
 </>;
}
