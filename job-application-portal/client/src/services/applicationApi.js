import axios from 'axios';
export const fetchApplicantApplication = () => axios.get('/applications/my-application');
export const fetchAdminApplications = () => axios.get('/admin/applications');
export const submitApplication = formData => axios.post('/applications/submit', formData, {
  headers: {
    'Content-Type': 'multipart/form-data'
  }
});
export const saveApplicationReview = (id, section, data) => axios.put('/admin/applications/' + id + (section === 'interview' ? '/schedule-interview' : '/status'), data);
export const getResumeUrl = filename => filename ? new URL('/uploads/' + encodeURIComponent(filename), new URL(axios.defaults.baseURL, window.location.origin)).href : null;
