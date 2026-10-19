import { useOutletContext } from 'react-router-dom';
import HiringPipeline from '../components/HiringPipelineBoard';
import Icon from '../../../components/Icon';

export default function AdminPipelinePage() {
  const { model, overview } = useOutletContext();
  return <>
    <section className="dashboard-hero admin-page-hero" aria-labelledby="pipeline-heading">
      <div><span className="sidebar-kicker"><Icon name="calendar" size={14} /> RECRUITMENT WORKFLOW</span><h1 id="pipeline-heading">Pipeline &amp; interviews</h1><p>See each candidate's progress through the hiring stages and stay ahead of upcoming interviews.</p></div>
      <div className="admin-page-hero-count"><strong>{overview.interviewCount}</strong><span>Interviews</span></div>
    </section>
    <HiringPipeline {...overview} applications={model.applications} handleViewApplication={model.handleViewApplication} />
  </>;
}
