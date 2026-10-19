import { NavLink } from 'react-router-dom';
import Icon from '../../../components/Icon';
export default function ApplicationNavigation() {
 return <nav className="applicant-quicklinks applicant-module-nav" aria-label="Applicant modules">
 <NavLink to="/engineer-dashboard" end><Icon name="grid" size={16} />Dashboard</NavLink>
 <NavLink to="/engineer-dashboard/application"><Icon name="file" size={16} />My application</NavLink>
 </nav>;
}
