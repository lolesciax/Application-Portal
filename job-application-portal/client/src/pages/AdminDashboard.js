import { Outlet } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import '../styles/AdminDashboard.css';
import ApplicationReviewModal from '../components/ApplicationReviewModal';
import AdminSidebar from '../features/admin/components/AdminSidebar';
import useAdminApplications from '../features/admin/hooks/useAdminApplications';
import getHiringOverview from '../features/admin/utils/hiringOverview';
export default function AdminDashboard() {
  const { user, logout } = useAuth();
  const model = useAdminApplications(user);
  const overview = getHiringOverview(model.applications);
  if (model.loading) return <div className="loader"><div className="loader-spinner" /><p className="text-muted">Loading applications...</p></div>;
  return <div className="dashboard admin-dashboard workspace-page"><div className="dashboard-shell">
    <AdminSidebar user={user} logout={logout} />
    <main className="dashboard-main">
      {model.message && <div className="alert alert-success" role="status">{model.message}</div>}
      {model.error && <div className="alert alert-error" role="alert">{model.error}</div>}
      <Outlet context={{ model, overview }} />
    </main>
  </div>{model.selectedApplication && <ApplicationReviewModal key={model.selectedApplication._id} application={model.selectedApplication} onClose={model.closeModal} onSaved={model.handleReviewSaved} />}</div>;
}
