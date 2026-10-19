import { useOutletContext } from 'react-router-dom';
import ApplicationQueue from '../components/ApplicationQueue';
import useApplicationQueue from '../hooks/useApplicationQueue';
import Icon from '../../../components/Icon';

export default function AdminApplicationsPage() {
  const { model } = useOutletContext();
  const queue = useApplicationQueue(model.applications);
  return <>
    <section className="dashboard-hero admin-page-hero" aria-labelledby="applications-heading">
      <div><span className="sidebar-kicker"><Icon name="file" size={14} /> APPLICANT RECORDS</span><h1 id="applications-heading">Applications</h1><p>Find candidates, view complete records, and manage every hiring decision from one workspace.</p></div>
      <div className="admin-page-hero-count"><strong>{model.applications.length}</strong><span>Total records</span></div>
    </section>
    <ApplicationQueue applications={model.applications} queue={queue} refreshingApplications={model.refreshingApplications} handleRefreshApplications={model.handleRefreshApplications} handleViewApplication={model.handleViewApplication} />
  </>;
}
