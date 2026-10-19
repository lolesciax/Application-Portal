import React from 'react';
import { Link } from 'react-router-dom';
import { getDisplayName } from '../utils/nameUtils';
export default function WorkspaceHeader({ user, onLogout, role = 'Applicant workspace' }) {
  const name = getDisplayName(user || {}) || 'Applicant';
  return <header className="workspace-header"><Link to="/" className="workspace-brand"><span>AP</span><div>Application Portal<small>{role}</small></div></Link><div className="workspace-account"><span className="workspace-avatar" aria-hidden="true">{name.split(' ').map(part => part[0]).slice(0, 2).join('')}</span><div><strong>{name}</strong><small>{user?.email}</small></div><button className="workspace-signout" onClick={onLogout}>Sign out</button></div></header>;
}
