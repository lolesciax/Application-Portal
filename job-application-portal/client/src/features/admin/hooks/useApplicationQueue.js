import { useSearchParams } from 'react-router-dom';
import { getApplicationDisplayName, formatRoleDisplay } from '../utils/applicationDisplay';
export default function useApplicationQueue(applications) {
  const [params, setParams] = useSearchParams();
  const allowedStatuses = ['all', 'pending', 'interview_scheduled', 'hired', 'rejected'];
  const statusFilter = allowedStatuses.includes(params.get('status')) ? params.get('status') : 'all';
  const searchQuery = params.get('q') || '';
  const sortOrder = ['newest', 'oldest', 'name'].includes(params.get('sort')) ? params.get('sort') : 'newest';
  const requestedPage = Number(params.get('page') || 1);
  const page = Number.isSafeInteger(requestedPage) && requestedPage > 0 ? requestedPage : 1;
  const changeParam = (key, value, defaultValue, resetPage = true) => {
    const next = new URLSearchParams(params);
    if (value === defaultValue || value === '') next.delete(key); else next.set(key, String(value));
    if (resetPage) next.delete('page');
    setParams(next, { replace: true });
  };
  const setStatusFilter = value => changeParam('status', value, 'all');
  const setSearchQuery = value => changeParam('q', value, '');
  const setSortOrder = value => changeParam('sort', value, 'newest');
  const setPage = value => changeParam('page', value, 1, false);
  const filteredApplications = applications.filter(app => {
    const statusMatch = statusFilter === 'all' || app.status === statusFilter;
    const query = searchQuery.trim().toLowerCase();
    if (!statusMatch) return false;
    if (!query) return true;
    const name = getApplicationDisplayName(app).toLowerCase();
    const email = (app.personalInfo?.email || app.user?.email || '').toLowerCase();
    const position = (app.personalInfo?.position || formatRoleDisplay(app.user?.role)).toLowerCase();
    return name.includes(query) || email.includes(query) || position.includes(query);
  });
  const sortedApplications = [...filteredApplications].sort((a, b) => sortOrder === 'name' ? getApplicationDisplayName(a).localeCompare(getApplicationDisplayName(b)) : sortOrder === 'oldest' ? new Date(a.submittedAt) - new Date(b.submittedAt) : new Date(b.submittedAt) - new Date(a.submittedAt));
  const totalPages = Math.max(1, Math.ceil(sortedApplications.length / 8));
  const currentPage = Math.min(page, totalPages);
  const visibleApplications = sortedApplications.slice((currentPage - 1) * 8, currentPage * 8);
  const clearFilters = () => setParams({}, { replace: true });
  return {
    statusFilter,
    setStatusFilter,
    searchQuery,
    setSearchQuery,
    sortOrder,
    setSortOrder,
    setPage,
    filteredApplications,
    sortedApplications,
    currentPage,
    totalPages,
    visibleApplications,
    clearFilters
  };
}
