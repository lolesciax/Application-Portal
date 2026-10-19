export const tabs = [{
  id: 'overview',
  label: 'Overview',
  icon: 'user'
}, {
  id: 'interview',
  label: 'Interview',
  icon: 'calendar'
}, {
  id: 'status',
  label: 'Status & notes',
  icon: 'file'
}];
export const statuses = {
  pending: 'Pending review',
  interview_scheduled: 'Interview scheduled',
  hired: 'Hired',
  rejected: 'Rejected'
};
export const displayDate = value => {
  if (!value) return 'Not provided';
  const date = new Date(String(value).slice(0, 10) + 'T12:00:00');
  return Number.isNaN(date.getTime()) ? 'Not provided' : date.toLocaleDateString('en-PH', {
    month: 'short',
    day: 'numeric',
    year: 'numeric'
  });
};
export const localDate = () => {
  const date = new Date();
  return [date.getFullYear(), String(date.getMonth() + 1).padStart(2, '0'), String(date.getDate()).padStart(2, '0')].join('-');
};
