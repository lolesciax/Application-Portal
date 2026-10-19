import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import '../styles/LandingPage.css';
import Icon from '../components/Icon';

const steps = [
  { number: '01', title: 'Create your profile', text: 'Register with your contact details so the hiring team can reach you.' },
  { number: '02', title: 'Submit your application', text: 'Review your information and attach your resume. PDF, Word, JPG, and PNG files up to 5 MB are supported.' },
  { number: '03', title: 'Follow your progress', text: 'Return to your dashboard to check review status, interview details, and messages from the hiring team.' },
];

export default function LandingPage() {
  const { user } = useAuth();
  const dashboard = user?.role === 'admin' ? '/admin-dashboard' : '/engineer-dashboard';
  return <main className="landing-page">
    <nav className="portal-nav container" aria-label="Main navigation">
      <Link to="/" className="portal-brand"><span aria-hidden="true">AP</span>Application Portal</Link>
      <div><a href="#how-it-works">How it works</a><Link to={user ? dashboard : '/login'}>{user ? 'Dashboard' : 'Sign in'} &rarr;</Link></div>
    </nav>
    <section className="hero-section">
      <div className="container portal-hero-grid">
        <div className="portal-hero-copy"><p className="portal-eyebrow">YOUR NEXT CHAPTER STARTS HERE</p><h1>Your next opportunity.<br /><span>One application away.</span></h1><p>A clear path from your first application to your next interview. Keep your details, resume, and progress in one place.</p>
          <div className="cta-buttons">{user ? <Link to={dashboard} className="btn btn-primary">Open your dashboard &rarr;</Link> : <><Link to="/register" className="btn btn-primary">Start your application &rarr;</Link><Link to="/login" className="btn btn-secondary">I already have an account</Link></>}</div>
          <p className="portal-hero-note">Have your latest resume ready. You can review your details before submitting.</p>
        </div>
        <aside className="application-preview" aria-label="Application process"><span className="preview-label">A CLEAR PATH FORWARD</span><h2>Know what comes next.</h2><ol><li><span className="preview-step">1</span><div><strong>Application submitted</strong><p>Your details and resume, together.</p></div></li><li><span className="preview-step">2</span><div><strong>Under review</strong><p>Follow updates in your dashboard.</p></div></li><li><span className="preview-step">3</span><div><strong>Interview scheduled</strong><p>Date, time, and location at a glance.</p></div></li></ol><p className="preview-footnote">An overview of the process. The hiring team updates your actual application status.</p></aside>
      </div>
    </section>
    <section className="features-section" id="how-it-works" aria-labelledby="steps-title"><div className="container"><p className="portal-eyebrow">SIMPLE FROM THE START</p><h2 id="steps-title">Focus on your next step.</h2><p className="section-subtitle">Three steps to a complete application.</p><div className="features-grid">{steps.map(step => <article className="feature-card" key={step.number}><span className="feature-icon" aria-hidden="true"><Icon name={step.number === '01' ? 'user' : step.number === '02' ? 'file' : 'clock'} size={24} />{step.number}</span><h3>{step.title}</h3><p>{step.text}</p></article>)}</div></div></section>
    <section className="portal-faq container" aria-labelledby="faq-title"><div><p className="portal-eyebrow">A LITTLE HELP BEFORE YOU START</p><h2 id="faq-title">Good questions.<br />Clear answers.</h2><p>Everything you need to feel ready for your next step.</p></div><div className="portal-faq-items">
      <details><summary>What do I need to apply?</summary><p>Create an account with your contact details, then upload a resume or CV. PDF, Word, JPG, and PNG files up to 5 MB are supported.</p></details>
      <details><summary>Can I update my application later?</summary><p>Yes. Sign in to your dashboard to update your details or replace your resume, then save your changes.</p></details>
      <details><summary>Where can I find interview updates?</summary><p>Your dashboard shows your application status, interview date, time, location, and any notes shared by the hiring team.</p></details>
    </div></section>
    <section className="portal-final-cta"><div className="container"><div><p className="portal-eyebrow">YOUR NEXT CHAPTER</p><h2>Ready when you are.</h2><p>A complete profile is a good place to start.</p></div><Link to={user ? dashboard : '/register'} className="btn btn-primary">{user ? 'Open dashboard' : 'Create your profile'}<Icon name="arrow" size={17} /></Link></div></section>
    <footer className="portal-footer container"><span>Application Portal</span><p>Your profile. Your application. Your next opportunity.</p><Link to={user ? dashboard : '/register'}>{user ? 'View dashboard' : 'Get started'} &rarr;</Link></footer>
  </main>;
}
