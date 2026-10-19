import { Outlet } from 'react-router-dom';
import '../styles/EngineerDashboard.css';
import WorkspaceHeader from '../components/WorkspaceHeader';
import Icon from '../components/Icon';
import useApplicantApplication from '../features/applicant/hooks/useApplicantApplication';
import ApplicationNavigation from '../features/applicant/components/ApplicationNavigation';
export default function EngineerDashboard() {
 const model = useApplicantApplication();
 if (model.loading) return <div className="workspace-loading" role="status"><div className="loader-spinner" /><p>Getting your application ready...</p></div>;
 return <div className="applicant-page workspace-page"><WorkspaceHeader user={model.user} onLogout={model.logout} />
 <main className="workspace-content"><ApplicationNavigation />
 {model.message && <div className="workspace-notice success" role="status"><Icon name="check" />{model.message}</div>}
 {model.error && <div className="workspace-notice error" role="alert"><p>{model.error}</p>{model.loadFailed && <button onClick={model.retryApplication} disabled={model.retrying}>{model.retrying ? 'Retrying...' : 'Try again'}</button>}</div>}
 <Outlet context={model} />
 </main></div>;
}
