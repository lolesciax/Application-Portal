import Icon from '../../../components/Icon';
import { getStatusText, getStatusBadgeClass } from '../../../utils/applicationStatus';
import { getApplicationDisplayName, formatRoleDisplay } from '../utils/applicationDisplay';
export default function ApplicationQueue({
  applications,
  queue,
  refreshingApplications,
  handleRefreshApplications,
  handleViewApplication
}) {
  const {
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
  } = queue;
  return <section className="application-card table-card" id="admin-applications">
  <div className="section-header">
    <div>
      <h3><span className="dashboard-section-icon">
          <Icon name="file" size={17} />
        </span>Application directory</h3>
      <p className="section-subtitle">Filter, review, and open each applicant record from the table below.</p>
    </div>
    <button type="button" className="btn btn-secondary admin-refresh-btn" onClick={handleRefreshApplications} disabled={refreshingApplications} aria-busy={refreshingApplications}>
      <Icon name="refresh" size={16} />
      {refreshingApplications ? 'Refreshing...' : 'Refresh'}
    </button>
  </div>
  <div className="filter-bar admin-filter-panel">
    <div className="filter-group admin-search-filter">
      <label htmlFor="application-search">Search:</label>
      <div className="admin-search-control"><Icon name="search" size={17} /><input id="application-search" type="text" value={searchQuery} onChange={e => {
          setSearchQuery(e.target.value);
        }} placeholder="Search by name or email..." className="form-control" /></div>
    </div>
    <div className="filter-group">
      <label htmlFor="application-filter">Status:</label>
      <select id="application-filter" value={statusFilter} onChange={e => {
          setStatusFilter(e.target.value);
        }} className="form-control">
        <option value="all">All</option>
        <option value="pending">Pending Review</option>
        <option value="interview_scheduled">Interview Scheduled</option>
        <option value="hired">Hired</option>
        <option value="rejected">Rejected</option>
      </select>
    </div>
  </div>
  <div className="admin-results-toolbar">
    <p role="status">
      {filteredApplications.length}{' '}
      {filteredApplications.length === 1 ? 'application' : 'applications'}
      {statusFilter !== 'all' || searchQuery ? ' matching your filters' : ' in total'}
    </p>
    <div>
      <label htmlFor="application-sort">Sort by</label>
      <select id="application-sort" value={sortOrder} onChange={event => {
          setSortOrder(event.target.value);
        }}>
        <option value="newest">Newest first</option>
        <option value="oldest">Oldest first</option>
        <option value="name">Name: A-Z</option>
      </select>
      {(searchQuery || statusFilter !== 'all') && <button onClick={clearFilters}>Clear filters</button>}
    </div>
  </div>
  <div className="table-wrapper">
    <table className="table" role="table" aria-label="Applicant applications">
      <thead>
        <tr>
          <th>Applicant</th>
          <th>Role</th>
          <th>Submitted</th>
          <th>Status</th>
          <th>Action</th>
        </tr>
      </thead>
      <tbody>
        {filteredApplications.length > 0 ? visibleApplications.map(app => <tr key={app._id}>
          <td data-label="Applicant">
            <div className="application-table-person"><span className="admin-candidate-avatar">{`${app.personalInfo?.firstName?.[0] || ''}${app.personalInfo?.lastName?.[0] || ''}` || 'AP'}</span><span><strong>{getApplicationDisplayName(app) || 'N/A'}</strong><small>{app.personalInfo?.email || app.user?.email || 'No email provided'}</small></span></div>
          </td>
          <td data-label="Role">
            {app.personalInfo?.position || formatRoleDisplay(app.user?.role)}
          </td>
          <td data-label="Submitted">
            {new Date(app.submittedAt).toLocaleDateString()}
          </td>
          <td data-label="Status">
            <span className={`status-badge ${getStatusBadgeClass(app.status)}`}>
              {getStatusText(app.status)}
            </span>
          </td>
          <td data-label="Action">
            <button aria-label={`Review ${getApplicationDisplayName(app)}`} onClick={() => handleViewApplication(app)} className="btn btn-primary admin-review-button">Review <Icon name="arrow" size={14} /></button>
          </td>
        </tr>) : <tr>
          <td colSpan="5" className="text-center" style={{
              padding: '40px'
            }}>
            <div className="admin-empty">
              <Icon name="search" size={28} />
              <h3>
                {applications.length ? 'No matching applications' : 'Your pipeline starts here'}
              </h3>
              <p className="text-muted">
                {applications.length ? 'Try another name, email, or status.' : 'Submitted applications will appear here when candidates apply.'}
              </p>
              {applications.length > 0 && <button className="btn btn-secondary" onClick={clearFilters}>Clear filters</button>}
            </div>
          </td>
        </tr>}
      </tbody>
    </table>
  </div>
  {sortedApplications.length > 0 && <nav className="admin-pagination" aria-label="Application pages">
    <span>Showing {(currentPage - 1) * 8 + 1} - {Math.min(currentPage * 8, sortedApplications.length)} of {sortedApplications.length}</span>
    <div>
      <button onClick={() => setPage(currentPage - 1)} disabled={currentPage === 1}>Previous</button>
      <span>Page {currentPage} of {totalPages}</span>
      <button onClick={() => setPage(currentPage + 1)} disabled={currentPage === totalPages}>Next</button>
    </div>
  </nav>}
</section>;
}
