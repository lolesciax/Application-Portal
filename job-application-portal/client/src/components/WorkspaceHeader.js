import React from 'react';
import { Link } from 'react-router-dom';
import { getDisplayName } from '../utils/nameUtils';

export default function WorkspaceHeader({ user, onLogout, role = 'Applicant workspace' }) {
  const name = getDisplayName(user || {}) || 'Applicant';
  const initials = name.split(/\s+/).filter(Boolean).slice(0, 2).map(part => part[0]).join('').toUpperCase() || 'AP';
  return <header className="workspace-header">
    <Link to="/" className="workspace-brand" aria-label="Application Portal home">
      <span aria-hidden="true">AP</span>
      <div>Application Portal<small>{role}</small></div>
    </Link>
    <div className="workspace-account" aria-label="Signed-in account">
      <span className="workspace-avatar" aria-hidden="true">{initials}</span>
      <div><strong title={name}>{name}</strong><small title={user?.email}>{user?.email}</small></div>
      <button type="button" className="workspace-signout" onClick={onLogout}>Sign out</button>
    </div>
  </header>;
}
