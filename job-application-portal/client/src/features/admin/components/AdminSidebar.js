import { Link, NavLink } from 'react-router-dom';
import { getDisplayName } from '../../../utils/nameUtils';
import Icon from '../../../components/Icon';
const items = [
 { to: '/admin-dashboard', end: true, label: 'Dashboard', meta: 'Hiring overview', icon: 'grid' },
 { to: '/admin-dashboard/applications', label: 'Applications', meta: 'Review applicant records', icon: 'file' },
 { to: '/admin-dashboard/pipeline', label: 'Pipeline', meta: 'Status and interviews', icon: 'calendar' },
];
export default function AdminSidebar({ user, logout }) {
 return <aside className="dashboard-sidebar">
 <div className="sidebar-brand"><Link to="/" className="admin-brand"><span>AP</span>Application Portal</Link><span className="sidebar-kicker">HIRING WORKSPACE</span></div>
 <nav className="sidebar-nav" aria-label="Admin sections">{items.map(item => <NavLink key={item.to} to={item.to} end={item.end} className={({ isActive }) => 'sidebar-link' + (isActive ? ' active' : '')}><span className="sidebar-link-title"><Icon name={item.icon} size={17} />{item.label}</span><span className="sidebar-link-meta">{item.meta}</span></NavLink>)}</nav>
 <div className="sidebar-footer"><div className="sidebar-user"><span className="sidebar-user-label">Signed in as</span><strong>{getDisplayName(user || {})}</strong><span className="sidebar-user-meta">{user?.username || user?.email}</span></div><button onClick={logout} className="sidebar-logout-btn">Sign out</button></div>
 </aside>;
}
