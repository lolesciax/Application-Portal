import React from 'react';
import ModuleScrollRestoration from './components/ModuleScrollRestoration';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import './App.css';
import LandingPage from './pages/LandingPage';
import ProtectedRoute from './components/ProtectedRoute';
import { Link } from 'react-router-dom';
import Login from './pages/Login';
import Register from './pages/Register';
import EngineerDashboard from './pages/EngineerDashboard';
import AdminDashboard from './pages/AdminDashboard';
import AdminOverviewPage from './features/admin/pages/AdminOverviewPage';
import AdminApplicationsPage from './features/admin/pages/AdminApplicationsPage';
import AdminPipelinePage from './features/admin/pages/AdminPipelinePage';
import ApplicantOverviewPage from './features/applicant/pages/ApplicantOverviewPage';
import ApplicantApplicationPage from './features/applicant/pages/ApplicantApplicationPage';
import { AuthProvider } from './context/AuthContext';
import './styles/Workspace.css';
import './styles/PortalIdentity.css';
import './styles/Interactions.css';
import './styles/ApplicationReviewModal.css';
import './styles/ResponsiveTypography.css';
import './styles/DashboardExperience.css';
import './styles/PortalSystem.css';

function App() {
  return (
    <AuthProvider>
      <Router>
        <ModuleScrollRestoration />
        <div className="App">
          <Routes>
            <Route path="/" element={<LandingPage />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/engineer-dashboard" element={<ProtectedRoute role="engineer"><EngineerDashboard /></ProtectedRoute>}>
              <Route index element={<ApplicantOverviewPage />} />
              <Route path="application" element={<ApplicantApplicationPage />} />
            </Route>
            <Route path="/admin-dashboard" element={<ProtectedRoute role="admin"><AdminDashboard /></ProtectedRoute>}>
              <Route index element={<AdminOverviewPage />} />
              <Route path="applications" element={<AdminApplicationsPage />} />
              <Route path="pipeline" element={<AdminPipelinePage />} />
            </Route>
            <Route path="*" element={<main className="session-error"><h1>Page not found</h1><p>This page may have moved.</p><Link to="/" className="btn btn-primary">Back to home</Link></main>} />
          </Routes>
        </div>
      </Router>
    </AuthProvider>
  );
}

export default App;
