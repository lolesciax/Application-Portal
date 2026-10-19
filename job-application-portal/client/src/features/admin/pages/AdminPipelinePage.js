import { useOutletContext } from 'react-router-dom';
import HiringPipeline from '../components/HiringPipelineBoard';
export default function AdminPipelinePage() {
 const { model, overview } = useOutletContext();
 return <><section className="dashboard-hero admin-page-hero"><div><span className="sidebar-kicker">HIRING PROGRESS</span><h1>Pipeline &amp; interviews</h1><p>Compare every hiring stage, then prepare for scheduled candidate conversations.</p></div><div className="admin-page-hero-count"><strong>{overview.interviewCount}</strong><span>Interviews</span></div></section><HiringPipeline {...overview} applications={model.applications} handleViewApplication={model.handleViewApplication} /></>;
}
