import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function ProtectedRoute({ role, children }) {
  const { user, loading, sessionError, retrySession, logout } = useAuth();
  if (loading) return <div className="loader" role="status"><div className="loader-spinner" /><p>Restoring your session...</p></div>;
  if (sessionError) return <main className="session-error"><h1>We could not restore your session</h1><p role="alert">{sessionError}</p><button className="btn btn-primary" onClick={retrySession}>Try again</button><button className="btn btn-secondary" onClick={logout}>Sign out</button></main>;
  if (!user) return <Navigate to="/login" replace />;
  if (user.role !== role) return <Navigate to={user.role === 'admin' ? '/admin-dashboard' : '/engineer-dashboard'} replace />;
  return children;
}
