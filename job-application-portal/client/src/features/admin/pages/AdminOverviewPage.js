import { Link, useNavigate, useOutletContext } from 'react-router-dom';
import HiringOverview from '../components/HiringOverview';
import HiringSummary from '../components/HiringSummary';
import Icon from '../../../components/Icon';
export default function AdminOverviewPage() {
 const { model, overview } = useOutletContext();
 const navigate = useNavigate();
 const openApplications = status => navigate('/admin-dashboard/applications' + (status === 'all' ? '' : '?status=' + status));
 return <>
 <HiringOverview {...overview} />
 <HiringSummary summaryCards={overview.summaryCards} onSelectStatus={openApplications} />
 <section className="admin-dashboard-focus" aria-label="Hiring priorities">
 <article className="application-card admin-priority-card">
 <div className="section-header"><div><h2><span className="dashboard-section-icon"><Icon name="clock" size={17} /></span>Needs your attention</h2><p className="section-subtitle">The newest applications still waiting for review.</p></div><Link to="/admin-dashboard/applications?status=pending">View queue <Icon name="arrow" size={14} /></Link></div>
 {overview.pendingApplications.length ? <ul className="admin-priority-list">{overview.pendingApplications.map(app => <li key={app._id}><button type="button" onClick={() => model.handleViewApplication(app)}><span className="admin-candidate-avatar">{`${app.personalInfo?.firstName?.[0] || ''}${app.personalInfo?.lastName?.[0] || ''}` || 'AP'}</span><span><strong>{`${app.personalInfo?.firstName || ''} ${app.personalInfo?.lastName || ''}`.trim() || 'Applicant'}</strong><small>{app.personalInfo?.position || 'Role not specified'} · Submitted {new Date(app.submittedAt).toLocaleDateString('en-PH', { month: 'short', day: 'numeric' })}</small></span><Icon name="arrow" size={16} /></button></li>)}</ul> : <div className="admin-focus-empty"><Icon name="check" /><strong>Review queue cleared</strong><p>There are no pending applications right now.</p></div>}
 </article>
 <article className="application-card admin-next-card">
 <div className="section-header"><div><h2><span className="dashboard-section-icon"><Icon name="calendar" size={17} /></span>Next interview</h2><p className="section-subtitle">Your nearest scheduled candidate conversation.</p></div></div>
 {overview.nextInterview ? <div className="admin-next-interview"><div className="admin-date-tile"><strong>{new Date(overview.nextInterview.interviewSchedule.date).toLocaleDateString('en-PH', { day: '2-digit' })}</strong><span>{new Date(overview.nextInterview.interviewSchedule.date).toLocaleDateString('en-PH', { month: 'short' })}</span></div><div><span className="status-badge status-interview_scheduled">Scheduled</span><h3>{`${overview.nextInterview.personalInfo?.firstName || ''} ${overview.nextInterview.personalInfo?.lastName || ''}`.trim() || 'Applicant'}</h3><p>{overview.nextInterview.interviewSchedule.time} · {overview.nextInterview.interviewSchedule.location}</p><button type="button" onClick={() => model.handleViewApplication(overview.nextInterview)}>Open interview details <Icon name="arrow" size={14} /></button></div></div> : <div className="admin-focus-empty"><Icon name="calendar" /><strong>No interview scheduled</strong><p>Schedule one while reviewing an application.</p><Link to="/admin-dashboard/applications">Open applications</Link></div>}
 </article>
 </section>
 <section className="module-action-grid" aria-label="Hiring tasks">
 <Link className="module-action-card" to="/admin-dashboard/applications"><span className="dashboard-section-icon"><Icon name="file" /></span><div><span className="module-action-eyebrow">RECORDS</span><h2>Browse all applications</h2><p>Search candidates, open full records, and share decisions.</p></div><Icon name="arrow" size={18} /></Link>
 <Link className="module-action-card" to="/admin-dashboard/pipeline"><span className="dashboard-section-icon"><Icon name="grid" /></span><div><span className="module-action-eyebrow">WORKFLOW</span><h2>Open the hiring pipeline</h2><p>Compare stages and review the complete interview agenda.</p></div><Icon name="arrow" size={18} /></Link>
 </section>
 </>;
}
