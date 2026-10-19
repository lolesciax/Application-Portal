import { Link, Outlet, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import '../styles/AdminDashboard.css';
import ApplicationReviewModal from '../components/ApplicationReviewModal';
import AdminSidebar from '../features/admin/components/AdminSidebar';
import useAdminApplications from '../features/admin/hooks/useAdminApplications';
import getHiringOverview from '../features/admin/utils/hiringOverview';
import useWorkspaceNavigation from '../hooks/useWorkspaceNavigation';

export default function AdminDashboard() {
  const { user, logout } = useAuth();
  const model = useAdminApplications(user);
  const overview = getHiringOverview(model.applications);
  const location = useLocation();
  const {
    sidebarWidth, mobileOpen, setMobileOpen, resizing, menuButton, sidebarRef,
    startResizing, resizeFromKeyboard, onDrawerTouchStart, onDrawerTouchEnd
  } = useWorkspaceNavigation(location.pathname, 'application-portal-admin-sidebar-width-v3');

  if (model.loading) {
    return <div className="loader" role="status"><div className="loader-spinner" /><p className="text-muted">Loading applications...</p></div>;
  }

  return <div className="dashboard admin-dashboard workspace-page">
    <a className="portal-skip-link" href="#admin-main">Skip to main content</a>
    <header className="admin-mobile-bar">
      <Link to="/admin-dashboard" className="admin-mobile-brand"><span>AP</span><strong>Application Portal</strong></Link>
      <button ref={menuButton} type="button" className="admin-menu-toggle" aria-label={mobileOpen ? 'Close navigation menu' : 'Open navigation menu'} aria-controls="admin-sidebar-navigation" aria-expanded={mobileOpen} onClick={() => setMobileOpen(value => !value)}>
        <svg aria-hidden="true" viewBox="0 0 24 24" width="21" height="21" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><path d={mobileOpen ? 'M6 6l12 12M18 6 6 18' : 'M4 7h16M4 12h16M4 17h16'} /></svg>
        <span>{mobileOpen ? 'Close' : 'Menu'}</span>
      </button>
    </header>
    {mobileOpen && <button className="admin-drawer-backdrop" type="button" tabIndex={-1} aria-label="Close navigation menu" onClick={() => setMobileOpen(false)} />}
    <div className={`dashboard-shell${resizing ? ' is-resizing' : ''}${mobileOpen ? ' drawer-open' : ''}`} style={{ '--admin-sidebar-width': `${sidebarWidth}px` }}>
      <AdminSidebar
        user={user}
        logout={logout}
        open={mobileOpen}
        sidebarRef={sidebarRef}
        onClose={() => setMobileOpen(false)}
        onTouchStart={onDrawerTouchStart}
        onTouchEnd={onDrawerTouchEnd}
        sidebarWidth={sidebarWidth}
        startResizing={startResizing}
        resizeFromKeyboard={resizeFromKeyboard}
      />
      <main id="admin-main" className="dashboard-main" tabIndex={-1}>
        <div className="admin-content-frame">
        <div className="admin-workspace-toolbar" aria-label="Current workspace">
          <span><span className="admin-toolbar-home">Hiring workspace</span><span className="admin-toolbar-chevron" aria-hidden="true">/</span><strong>{location.pathname.includes('/applications') ? 'Applications' : location.pathname.includes('/pipeline') ? 'Pipeline & interviews' : 'Dashboard'}</strong></span>
          <span className="admin-toolbar-pill"><span aria-hidden="true" /> Administrator</span>
        </div>
        {model.message && <div className="alert alert-success" role="status">{model.message}</div>}
        {model.error && <div className="alert alert-error" role="alert">{model.error}</div>}
        <Outlet context={{ model, overview }} />
        </div>
      </main>
    </div>
    {model.selectedApplication && <ApplicationReviewModal key={model.selectedApplication._id} application={model.selectedApplication} onClose={model.closeModal} onSaved={model.handleReviewSaved} />}
  </div>;
}
