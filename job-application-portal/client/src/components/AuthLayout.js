import React from 'react';
import { Link } from 'react-router-dom';
import Icon from './Icon';
import '../styles/Auth.css';

export default function AuthLayout({ mode, title, description, children }) {
  const signup = mode === 'signup';
  return <main className={`auth-page ${signup ? 'signup-page' : 'login-page'}`}>
    <aside className="auth-story">
      <Link className="auth-brand" to="/"><span>AP</span>Application Portal</Link>
      <div className="auth-story-content"><span className="auth-eyebrow">A LITTLE CLARITY. A BIG NEXT STEP.</span><h2>Your next chapter<br />starts with you.</h2><p>One place for your profile, your application, and everything that comes next.</p>
        <div className="auth-story-card"><div className="story-card-icon"><Icon name="file" size={24} /></div><div><strong>Make your first impression count.</strong><p>Keep your details together and put your experience forward.</p></div></div>
        <ol className="auth-story-steps"><li><span>01</span>Create your profile</li><li><span>02</span>Share your experience</li><li><span>03</span>Follow your progress</li></ol>
      </div>
      <p className="auth-story-footer">YOUR PROFILE. YOUR POTENTIAL. YOUR NEXT OPPORTUNITY.</p>
    </aside>
    <section className="auth-workspace" aria-labelledby="auth-title">
      <div className="auth-topbar"><Link to="/" className="auth-back"><Icon name="back" size={16} />Back to home</Link><p>{signup ? 'Already registered?' : 'New here?'} <Link to={signup ? '/login' : '/register'}>{signup ? 'Sign in' : 'Create an account'}</Link></p></div>
      <div className="auth-panel"><div className="auth-heading"><span className="auth-eyebrow">{signup ? 'LET US GET YOU STARTED' : 'GOOD TO SEE YOU AGAIN'}</span><h1 id="auth-title">{title}</h1><p>{description}</p></div>{children}</div>
      <p className="auth-bottom-note">{signup ? 'Your profile details will be ready when you start your application.' : 'Applicants and administrators use the same sign-in form.'}</p>
    </section>
  </main>;
}
