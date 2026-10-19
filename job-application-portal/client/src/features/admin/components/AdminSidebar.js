import { Link, NavLink } from 'react-router-dom';
import { getDisplayName } from '../../../utils/nameUtils';
import Icon from '../../../components/Icon';
import { SIDEBAR_MIN, SIDEBAR_MAX } from '../../../hooks/useWorkspaceNavigation';

const adminSections = [
  { to: '/admin-dashboard', end: true, label: 'Dashboard', meta: 'Hiring overview', icon: 'grid' },
  { to: '/admin-dashboard/applications', label: 'Applications', meta: 'Review applicant records', icon: 'file' },
  { to: '/admin-dashboard/pipeline', label: 'Pipeline', meta: 'Status and interviews', icon: 'calendar' }
];
const applicantSections = [
  { to: '/engineer-dashboard', end: true, label: 'Dashboard', icon: 'grid' },
  { to: '/engineer-dashboard/application', label: 'My application', icon: 'file' }
];

export default function AdminSidebar({
  user, logout, open = false, sidebarRef, onClose, onTouchStart, onTouchEnd,
  sidebarWidth = 264, startResizing, resizeFromKeyboard, applicant = false
}) {
  const name = getDisplayName(user || {}) || (applicant ? 'Applicant' : 'Administrator');
  const initials = name.split(/\s+/).filter(Boolean).slice(0, 2).map(part => part[0]).join('').toUpperCase() || 'AP';
  const sections = applicant ? applicantSections : adminSections;
  const dashboard = applicant ? '/engineer-dashboard' : '/admin-dashboard';
  const sectionLabel = applicant ? 'Applicant sections' : 'Admin sections';
  return <aside
    ref={sidebarRef} id={applicant ? 'applicant-sidebar-navigation' : 'admin-sidebar-navigation'}
    className={`dashboard-sidebar${open ? ' is-open' : ''}`}
    aria-label={applicant ? 'Applicant navigation' : 'Admin navigation'}
    onTouchStart={onTouchStart} onTouchEnd={onTouchEnd}
  >
    <div className="sidebar-brand">
      <div className="sidebar-brand-row">
        <Link to={dashboard} className="admin-brand" onClick={onClose} aria-label="Application Portal dashboard">
          <span className="sidebar-brand-mark" aria-hidden="true">AP</span>
          <span className="sidebar-brand-copy">
            <span className="sidebar-brand-name">Application Portal</span>
            <span className="sidebar-brand-subtitle">{applicant ? 'Applicant workspace' : 'Hiring workspace'}</span>
          </span>
        </Link>
        <button type="button" className="admin-drawer-close" aria-label="Close navigation" onClick={onClose}>
          <svg aria-hidden="true" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><path d="M18 6 6 18M6 6l12 12" /></svg>
        </button>
      </div>
    </div>
    <div className="sidebar-menu-group">
      <span className="sidebar-group-label">NAVIGATION</span>
      <nav className="sidebar-nav" aria-label={sectionLabel}>
        {sections.map(section => <NavLink
          key={section.to} to={section.to} end={section.end} onClick={onClose}
          className={({ isActive }) => 'sidebar-link' + (isActive ? ' active' : '')}
        >
          <span className="sidebar-link-title"><span className="sidebar-nav-icon" aria-hidden="true"><Icon name={section.icon} size={18} /></span><span>{section.label}</span></span>
          {section.meta && <span className="sidebar-link-meta">{section.meta}</span>}
        </NavLink>)}
      </nav>
    </div>
    <div className="sidebar-footer">
      <div className="sidebar-account-card">
        <div className="sidebar-account-head">
          <span className="sidebar-account-avatar" aria-hidden="true">{initials}</span>
          <div className="sidebar-user">
            <span className="sidebar-user-label">{applicant ? 'APPLICANT ACCOUNT' : 'ADMIN ACCOUNT'}</span>
            <strong>{name}</strong>
          </div>
        </div>
        {(user?.email || user?.username) && <span className="sidebar-user-meta">{user?.email || user?.username}</span>}
      </div>
      <button type="button" onClick={logout} className="sidebar-logout-btn"><Icon name="back" size={16} /> Sign out</button>
    </div>
    <div className="admin-sidebar-resizer" role="separator" tabIndex={0} aria-orientation="vertical"
      aria-label="Resize navigation sidebar" aria-valuemin={SIDEBAR_MIN} aria-valuemax={SIDEBAR_MAX}
      aria-valuenow={sidebarWidth} aria-valuetext={`${sidebarWidth} pixels wide`}
      title="Drag to resize the sidebar, or use arrow keys"
      onPointerDown={startResizing} onKeyDown={resizeFromKeyboard}
    ><span aria-hidden="true" /></div>
  </aside>;
}
