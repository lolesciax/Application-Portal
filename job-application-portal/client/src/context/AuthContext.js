import React, { createContext, useState, useContext, useEffect } from 'react';
import axios from 'axios';
import { fetchSession, authenticateAccount } from '../services/authApi';

const AuthContext = createContext();
export const useAuth = () => useContext(AuthContext);
axios.defaults.baseURL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(() => localStorage.getItem('token'));
  const [loading, setLoading] = useState(true);
  const [sessionError, setSessionError] = useState('');
  const [retryCount, setRetryCount] = useState(0);

  useEffect(() => {
    const controller = new AbortController();
    if (!token) {
      delete axios.defaults.headers.common['x-auth-token'];
      setUser(null);
      setSessionError('');
      setLoading(false);
      return () => controller.abort();
    }
    axios.defaults.headers.common['x-auth-token'] = token;
    setLoading(true);
    setSessionError('');
    fetchSession(controller.signal).then(response => {
      setUser(response.data);
    }).catch(error => {
      if (controller.signal.aborted) return;
      if ([401, 403, 404].includes(error.response?.status)) {
        localStorage.removeItem('token');
        delete axios.defaults.headers.common['x-auth-token'];
        setToken(null);
        setUser(null);
      } else {
        setSessionError('The server is unavailable. Check your connection and try again.');
      }
    }).finally(() => {
      if (!controller.signal.aborted) setLoading(false);
    });
    return () => controller.abort();
  }, [token, retryCount]);

  const authenticate = async (path, data) => {
    try {
      const response = await authenticateAccount(path, data);
      localStorage.setItem('token', response.data.token);
      axios.defaults.headers.common['x-auth-token'] = response.data.token;
      setUser(response.data.user);
      setSessionError('');
      setToken(response.data.token);
      return { success: true };
    } catch (error) {
      return { success: false, errors: error.response?.data?.errors, error: error.response?.data?.msg || 'Unable to sign in. Check your connection and try again.' };
    }
  };

  const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    delete axios.defaults.headers.common['x-auth-token'];
    setToken(null);
    setUser(null);
    setSessionError('');
  };

  return <AuthContext.Provider value={{ user, token, loading, sessionError, logout,
    retrySession: () => setRetryCount(value => value + 1),
    login: (username, password) => authenticate('/auth/login', { username, password }),
    register: data => authenticate('/auth/register', data),
  }}>{children}</AuthContext.Provider>;
};
