import { Link } from 'react-router-dom';
import Icon from '../../../components/Icon';

export default function HiringOverview({ totalApplicants, pendingCount }) {
  return <header className="dashboard-hero admin-overview-hero" id="admin-overview" aria-labelledby="admin-overview-heading">
    <div className="admin-hero-content">
      <span className="admin-section-eyebrow">HIRING WORKSPACE</span>
      <h1 id="admin-overview-heading">Hiring overview</h1>
      <p>Track applications, prioritize reviews, and prepare for interviews.</p>
    </div>
    <Link className="admin-hero-action" to="/admin-dashboard/applications?status=pending"><Icon name="clock" size={16} /> {pendingCount} need review <Icon name="arrow" size={15} /></Link>
  </header>;
}
