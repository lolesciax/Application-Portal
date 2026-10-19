import React, { useEffect, useRef, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import AuthLayout from '../components/AuthLayout';
import FormField from '../components/FormField';
import Icon from '../components/Icon';
import { validLoginIdentifier } from '../utils/validation';

export default function Login() {
  const [formData, setFormData] = useState({ username: '', password: '' });
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [fieldErrors, setFieldErrors] = useState({});
  const [submitting, setSubmitting] = useState(false);
  const [failedAttempts, setFailedAttempts] = useState(0);
  const [cooldownTime, setCooldownTime] = useState(0);
  const busy = useRef(false);
  const { login, user, loading: sessionLoading } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (user && !sessionLoading) navigate(user.role === 'admin' ? '/admin-dashboard' : '/engineer-dashboard', { replace: true });
  }, [user, sessionLoading, navigate]);
  useEffect(() => {
    if (!cooldownTime) return;
    const timer = setTimeout(() => setCooldownTime(value => value - 1), 1000);
    return () => clearTimeout(timer);
  }, [cooldownTime]);

  const handleSubmit = async event => {
    event.preventDefault();
    if (busy.current || cooldownTime || sessionLoading) return;
    const errors = {};
    if (!formData.username.trim()) errors.username = 'Enter your username or email address.';
    else if (!validLoginIdentifier(formData.username.trim())) errors.username = 'Enter a valid email or a username with 4-20 letters, numbers, or underscores.';
    if (!formData.password.trim()) errors.password = 'Enter your password.';
    setFieldErrors(errors);
    if (Object.keys(errors).length) { document.getElementById(errors.username ? 'login-username' : 'login-password')?.focus(); return; }
    busy.current = true;
    setSubmitting(true); setError('');
    try {
      const result = await login(formData.username.trim().toLowerCase(), formData.password);
      if (!result.success) {
        const attempts = failedAttempts + 1;
        setFailedAttempts(attempts >= 5 ? 0 : attempts);
        if (attempts >= 5) { setCooldownTime(60); setError('Too many unsuccessful attempts. Please try again in a minute.'); }
        else setError(`${result.error} (${5 - attempts} attempts remaining before 60s cooldown)`);
      } else setFailedAttempts(0);
    } catch { setError('We could not reach the server. Please try again.'); }
    finally { busy.current = false; setSubmitting(false); }
  };
  const change = event => { const { name, value } = event.target; setFormData(data => ({ ...data, [name]: value })); setFieldErrors(errors => ({ ...errors, [name]: '' })); setError(''); };
  const disabled = submitting || cooldownTime > 0 || sessionLoading;
  return <AuthLayout title="Welcome back." description="Sign in to pick up where you left off.">
    {error && <div className="auth-alert" role="alert">{error}</div>}
    {cooldownTime > 0 && <p className="auth-cooldown">You can try again in <strong>{cooldownTime}s</strong>.</p>}
    <form className="auth-form" noValidate onSubmit={handleSubmit} aria-busy={submitting}>
      <FormField id="login-username" label="Username or email" name="username" value={formData.username} onChange={change} autoComplete="username" autoCapitalize="none" spellCheck={false} placeholder="you@example.com" disabled={disabled} error={fieldErrors.username} required />
      <FormField id="login-password" label="Password" name="password" type={showPassword ? 'text' : 'password'} value={formData.password} onChange={change} autoComplete="current-password" placeholder="Enter your password" disabled={disabled} error={fieldErrors.password} required>
        <button type="button" className="field-action" aria-label={showPassword ? 'Hide password' : 'Show password'} aria-pressed={showPassword} onClick={() => setShowPassword(value => !value)} disabled={disabled}><Icon name="eye" /></button>
      </FormField>
      <button type="submit" className="auth-submit" disabled={disabled}>{submitting ? 'Signing in...' : cooldownTime ? `Wait ${cooldownTime}s` : sessionLoading ? 'Restoring session...' : 'Login'}<Icon name="arrow" size={18} /></button>
    </form>
    <div className="auth-divider"><span>YOUR NEXT OPPORTUNITY AWAITS</span></div>
    <p className="auth-footnote">Don't have an account? <Link to="/register">Create your profile <Icon name="arrow" size={14} /></Link></p>
  </AuthLayout>;
}
