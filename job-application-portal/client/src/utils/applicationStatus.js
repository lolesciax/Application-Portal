const statusLabels = {
  pending: 'Pending Review',
  interview_scheduled: 'Interview Scheduled',
  hired: 'Hired',
  rejected: 'Rejected'
};
export const getStatusText = status => statusLabels[status] || status;
export const getStatusBadgeClass = status => statusLabels[status] ? 'status-' + status : '';
