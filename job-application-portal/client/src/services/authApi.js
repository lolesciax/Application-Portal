import axios from 'axios';
export const checkAccountAvailability = (name, value, signal) => axios.get('/auth/check-' + name, {
  params: {
    [name]: value
  },
  signal
});
export const fetchSession = signal => axios.get('/auth/me', {
  signal
});
export const authenticateAccount = (path, data) => axios.post(path, data);
