import { Link, Outlet, useLocation } from 'react-router-dom';
import '../styles/EngineerDashboard.css';
import Icon from '../components/Icon';
import useApplicantApplication from '../features/applicant/hooks/useApplicantApplication';
import AdminSidebar from '../features/admin/components/AdminSidebar';
import useWorkspaceNavigation from '../hooks/useWorkspaceNavigation';

export default function EngineerDashboard() {
  const model = useApplicantApplication();
  const location = useLocation();
  const nav = useWorkspaceNavigation(location.pathname, 'application-portal-applicant-sidebar-width-v4');

  if (model.loading) return <div className="workspace-loading" role="status"><div className="loader-spinner" /><p>Getting your application ready...</p></div>;

  return <div className="applicant-page workspace-page">
    <a className="portal-skip-link" href="#applicant-main">Skip to main content</a>
    <header className="admin-mobile-bar">
      <Link to="/engineer-dashboard" className="admin-mobile-brand"><span>AP</span><strong>Application Portal</strong></Link>
      <button ref={nav.menuButton} type="button" className="admin-menu-toggle"
        aria-label={nav.mobileOpen ? 'Close navigation menu' : 'Open navigation menu'}
        aria-controls="applicant-sidebar-navigation" aria-expanded={nav.mobileOpen}
        onClick={() => nav.setMobileOpen(value => !value)}>
        <svg aria-hidden="true" viewBox="0 0 24 24" width="21" height="21" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><path d={nav.mobileOpen ? 'M6 6l12 12M18 6 6 18' : 'M4 7h16M4 12h16M4 17h16'} /></svg>
        <span>{nav.mobileOpen ? 'Close' : 'Menu'}</span>
      </button>
    </header>
    {nav.mobileOpen && <button type="button" className="admin-drawer-backdrop" tabIndex={-1}
      aria-label="Close navigation menu" onClick={() => nav.setMobileOpen(false)} />}
    <div className={`dashboard-shell${nav.resizing ? ' is-resizing' : ''}${nav.mobileOpen ? ' drawer-open' : ''}`}
      style={{ '--admin-sidebar-width': `${nav.sidebarWidth}px` }}>
      <AdminSidebar applicant user={model.user} logout={model.logout} open={nav.mobileOpen}
        sidebarRef={nav.sidebarRef} onClose={() => nav.setMobileOpen(false)}
        onTouchStart={nav.onDrawerTouchStart} onTouchEnd={nav.onDrawerTouchEnd}
        sidebarWidth={nav.sidebarWidth} startResizing={nav.startResizing}
        resizeFromKeyboard={nav.resizeFromKeyboard} />
      <main id="applicant-main" className="dashboard-main" tabIndex={-1}>
        <div className="applicant-content-frame">
          <div className="applicant-workspace-label"><span>Applicant workspace</span><span aria-hidden="true">/</span><strong>{location.pathname.endsWith('/application') ? 'My application' : 'Dashboard'}</strong></div>
          {model.message && <div className="workspace-notice success" role="status"><Icon name="check" />{model.message}</div>}
          {model.error && <div className="workspace-notice error" role="alert"><p>{model.error}</p>{model.loadFailed && <button onClick={model.retryApplication} disabled={model.retrying}>{model.retrying ? 'Retrying...' : 'Try again'}</button>}</div>}
          <Outlet context={model} />
        </div>
      </main>
    </div>
  </div>;
}
