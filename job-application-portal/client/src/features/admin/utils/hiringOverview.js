export default function getHiringOverview(applications) {
  const totalApplicants = applications.length;
  const pendingCount = applications.filter(app => app.status === 'pending').length;
  const interviewCount = applications.filter(app => app.status === 'interview_scheduled').length;
  const hiredCount = applications.filter(app => app.status === 'hired').length;
  const rejectedCount = applications.filter(app => app.status === 'rejected').length;
  const hireRate = totalApplicants > 0 ? Math.round(hiredCount / totalApplicants * 100) : 0;
  const summaryCards = [{
    key: 'total',
    label: 'Total Applicants',
    value: totalApplicants,
    caption: 'All submitted applications in the pipeline.',
    className: 'admin-summary-total'
  }, {
    key: 'pending',
    label: 'Pending Review',
    value: pendingCount,
    caption: 'Candidates waiting for your next action.',
    className: 'admin-summary-pending'
  }, {
    key: 'interviews',
    label: 'Interviews',
    value: interviewCount,
    caption: 'Applicants with scheduled interview steps.',
    className: 'admin-summary-interview'
  }, {
    key: 'hired',
    label: 'Hired',
    value: hiredCount,
    caption: 'Successful candidates already marked hired.',
    className: 'admin-summary-hired'
  }, {
    key: 'hire-rate',
    label: 'Hire Rate',
    value: `${hireRate}%`,
    caption: 'Percentage of applicants converted to hired.',
    className: 'admin-summary-rate'
  }];
  const statusBreakdown = [{
    key: 'pending',
    label: 'Pending Review',
    count: pendingCount,
    badgeClass: 'status-pending'
  }, {
    key: 'interview_scheduled',
    label: 'Interview Scheduled',
    count: interviewCount,
    badgeClass: 'status-interview_scheduled'
  }, {
    key: 'hired',
    label: 'Hired',
    count: hiredCount,
    badgeClass: 'status-hired'
  }, {
    key: 'rejected',
    label: 'Rejected',
    count: rejectedCount,
    badgeClass: 'status-rejected'
  }];
  const upcomingInterviews = applications.filter(app => app.status === 'interview_scheduled' && app.interviewSchedule?.date && new Date(app.interviewSchedule.date).getTime() >= new Date().setHours(0, 0, 0, 0)).sort((firstApplication, secondApplication) => new Date(firstApplication.interviewSchedule.date) - new Date(secondApplication.interviewSchedule.date)).slice(0, 5);
  const pendingApplications = applications.filter(app => app.status === 'pending').sort((firstApplication, secondApplication) => new Date(secondApplication.submittedAt || 0) - new Date(firstApplication.submittedAt || 0)).slice(0, 4);
  return {
    totalApplicants,
    pendingCount,
    interviewCount,
    summaryCards,
    statusBreakdown,
    upcomingInterviews,
    pendingApplications,
    nextInterview: upcomingInterviews[0] || null
  };
}
