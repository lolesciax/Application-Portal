import React, { useEffect, useRef, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import useAccountAvailability from '../features/auth/hooks/useAccountAvailability';
import { useAuth } from '../context/AuthContext';
import AuthLayout from '../components/AuthLayout';
import FormField from '../components/FormField';
import Icon from '../components/Icon';
import { validName, validEmail, validPhone, validUsername, validPassword, validBirthDate } from '../utils/validation';

const initial = { username: '', firstName: '', lastName: '', email: '', phone: '', address: '', dateOfBirth: '', password: '', confirmPassword: '' };

export default function Register() {
  const [formData, setFormData] = useState(initial);
  const [step, setStep] = useState(0);
  const [fieldErrors, setFieldErrors] = useState({});
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const { availability, checkAvailability, clearAvailability } = useAccountAvailability(formData);
  const busy = useRef(false);
  const { register, user, loading: sessionLoading } = useAuth();
  const navigate = useNavigate();
  const stepHeading = useRef(null);

  useEffect(() => { if (user && !sessionLoading) navigate(user.role === 'admin' ? '/admin-dashboard' : '/engineer-dashboard', { replace: true }); }, [user, sessionLoading, navigate]);
  useEffect(() => { if (step === 1) stepHeading.current?.focus(); }, [step]);

  const change = event => {
    const { name, value } = event.target;
    clearAvailability(name);
    setFormData(data => ({ ...data, [name]: value }));
    setFieldErrors(errors => ({ ...errors, [name]: '' }));
    setError('');
  };
  const validate = currentStep => {
    const errors = {};
    if (currentStep === 0) {
      if (!validName(formData.firstName)) errors.firstName = 'Enter 2-50 characters using letters, spaces, apostrophes, or hyphens.';
      if (!validName(formData.lastName)) errors.lastName = 'Enter 2-50 characters using letters, spaces, apostrophes, or hyphens.';
      if (!validEmail(formData.email)) errors.email = 'Enter a valid email address.';
      else if (availability.email === 'taken') errors.email = 'This email is already registered. Sign in or use another address.';
      if (!validPhone(formData.phone)) errors.phone = 'Enter exactly 11 digits without spaces or punctuation.';
      if (!validBirthDate(formData.dateOfBirth)) errors.dateOfBirth = 'Enter a valid birth date. Applicants must be 18-100 years old.';
    } else {
      if (!validUsername(formData.username)) errors.username = 'Use 4-20 letters, numbers, or underscores.';
      else if (availability.username === 'taken') errors.username = 'This username is taken. Try another one.';
      if (!validPassword(formData.password)) errors.password = 'Use 8 or more characters with uppercase, lowercase, and a number. Letters and numbers only.';
      if (formData.password !== formData.confirmPassword) errors.confirmPassword = 'Your passwords do not match.';
      if (!formData.confirmPassword) errors.confirmPassword = 'Enter your password again.';
    }
    return errors;
  };
  const showErrors = (errors, targetStep) => {
    setFieldErrors(errors); setStep(targetStep);
    requestAnimationFrame(() => {
      const name = Object.keys(errors)[0];
      document.getElementById(name === 'password' ? 'register-password' : name === 'confirmPassword' ? 'confirm-password' : name)?.focus();
    });
  };
  const handleSubmit = async event => {
    event.preventDefault();
    if (busy.current || sessionLoading) return;
    const errors = validate(step);
    if (Object.keys(errors).length) { showErrors(errors, step); return; }
    if (step === 0) { setFieldErrors({}); setStep(1); return; }
    const profileErrors = validate(0);
    if (Object.keys(profileErrors).length) { showErrors(profileErrors, 0); return; }
    busy.current = true; setSubmitting(true); setError('');
    const data = { ...formData };
    delete data.confirmPassword;
    try {
      const result = await register({ ...data, username: data.username.trim().toLowerCase(), firstName: data.firstName.trim(), lastName: data.lastName.trim(), email: data.email.trim().toLowerCase(), phone: data.phone.trim(), address: data.address.trim(), dateOfBirth: data.dateOfBirth || null });
      if (!result.success) {
        const message = result.error || 'We could not create your account. Please try again.';
        if (result.errors && Object.keys(result.errors).length) {
          const profileFields = ['firstName', 'lastName', 'email', 'phone', 'dateOfBirth'];
          showErrors(result.errors, profileFields.some(name => result.errors[name]) ? 0 : 1);
        }
        else if (/username/i.test(message)) showErrors({ username: message }, 1);
        else if (/phone/i.test(message)) showErrors({ phone: message }, 0);
        else if (/email/i.test(message)) showErrors({ email: message }, 0);
        else setError(message);
      }
    } catch { setError('We could not reach the server. Your details are still here. Please try again.'); }
    finally { busy.current = false; setSubmitting(false); }
  };
  const availabilityHint = name => ({ checking: 'Checking availability...', available: 'Available to use.', taken: 'Already registered. Please try another.', unknown: 'Availability will be checked when you create your account.' }[availability[name]]);
  const field = (name, label, props = {}) => <FormField id={name} name={name} label={label} value={formData[name]} onChange={change} error={fieldErrors[name] || (availability[name] === 'taken' ? availabilityHint(name) : '')} disabled={submitting} {...props} />;
  const passwordRules = [['8 or more characters', formData.password.length >= 8], ['Uppercase & lowercase', /[A-Z]/.test(formData.password) && /[a-z]/.test(formData.password)], ['At least one number', /[0-9]/.test(formData.password)], ['Letters & numbers only', !!formData.password && /^[a-zA-Z0-9]+$/.test(formData.password)]];

  return <AuthLayout mode="signup" title="Make your next move." description="Create your profile. Your application comes next.">
    <ol className="signup-progress" aria-label="Registration progress">{['Your profile', 'Account setup'].map((label, index) => <li key={label} className={step >= index ? 'current' : ''} aria-current={step === index ? 'step' : undefined}><span>{step > index ? <Icon name="check" size={14} /> : index + 1}</span>{label}</li>)}</ol>
    <div className="signup-step-heading"><h2 ref={stepHeading} tabIndex={-1}>{step === 0 ? 'First, a little about you.' : 'Now, make it yours.'}</h2><span>Step {step + 1} of 2</span></div>
    {error && <div className="auth-alert" role="alert">{error}</div>}
    {Object.values(fieldErrors).some(Boolean) && <p className="auth-error-summary" role="alert">Please check the highlighted fields below.</p>}
    <form className="auth-form" noValidate onSubmit={handleSubmit} aria-busy={submitting}>
      {step === 0 ? <>
        <div className="auth-field-grid">{field('firstName', 'First name', { autoComplete: 'given-name', placeholder: 'First name', required: true })}{field('lastName', 'Last name', { autoComplete: 'family-name', placeholder: 'Last name', required: true })}</div>
        {field('email', 'Email address', { type: 'email', autoComplete: 'email', placeholder: 'you@example.com', required: true, onBlur: () => checkAvailability('email'), hint: availabilityHint('email') || 'The hiring team can contact you here.' })}
        {field('phone', 'Phone number', { type: 'tel', inputMode: 'numeric', maxLength: 11, minLength: 11, pattern: '[0-9]{11}', autoComplete: 'tel', placeholder: '09123456789', required: true, hint: 'exactly 11 digits, without spaces or punctuation.' })}
        <div className="auth-field-grid">{field('dateOfBirth', 'Date of birth', { type: 'date', autoComplete: 'bday', optional: true, hint: 'Applicants must be 18 or older.' })}{field('address', 'Address', { autoComplete: 'street-address', placeholder: 'City, province', optional: true })}</div>
      </> : <>
        {field('username', 'Username', { autoComplete: 'username', placeholder: 'Choose a username', required: true, onBlur: () => checkAvailability('username'), hint: availabilityHint('username') || '4-20 letters, numbers, or underscores.' })}
        <FormField id="register-password" name="password" label="Password" type={showPassword ? 'text' : 'password'} value={formData.password} onChange={change} autoComplete="new-password" placeholder="Create a password" error={fieldErrors.password} disabled={submitting} required><button type="button" className="field-action" aria-label={showPassword ? 'Hide password' : 'Show password'} aria-pressed={showPassword} onClick={() => setShowPassword(value => !value)}><Icon name="eye" /></button></FormField>
        <ul className="password-rules" aria-label="Password requirements">{passwordRules.map(([label, met]) => <li key={label} className={met ? 'met' : ''}><Icon name="check" size={13} />{label}</li>)}</ul>
        <FormField id="confirm-password" name="confirmPassword" label="Confirm password" type={showConfirmPassword ? 'text' : 'password'} value={formData.confirmPassword} onChange={change} autoComplete="new-password" placeholder="Enter your password again" error={fieldErrors.confirmPassword} hint={formData.confirmPassword && formData.password === formData.confirmPassword ? 'Your passwords match.' : undefined} disabled={submitting} required><button type="button" className="field-action" aria-label={showConfirmPassword ? 'Hide confirm password' : 'Show confirm password'} aria-pressed={showConfirmPassword} onClick={() => setShowConfirmPassword(value => !value)}><Icon name="eye" /></button></FormField>
        <div className="signup-profile-summary"><Icon name="user" /><div><strong>{formData.firstName} {formData.lastName}</strong><span>{formData.email}</span></div><button type="button" onClick={() => setStep(0)} disabled={submitting}>Edit</button></div>
      </>}
      <div className="signup-actions">{step === 1 && <button className="auth-previous" type="button" disabled={submitting} onClick={() => { setStep(0); setFieldErrors({}); }}><Icon name="back" size={16} />Back</button>}<button className="auth-submit" type="submit" disabled={submitting || sessionLoading}>{submitting ? 'Creating your account...' : step === 0 ? 'Continue to account setup' : 'Create Account'}<Icon name="arrow" size={18} /></button></div>
    </form>
    <p className="auth-footnote">Already have a profile? <Link to="/login">Sign in <Icon name="arrow" size={14} /></Link></p>
  </AuthLayout>;
}
