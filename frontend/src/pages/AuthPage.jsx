import React, { useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { Footer } from '../components/common/Footer';
import { projectsApi } from '../services/api';

export function AuthPage() {
  const { login, register } = useAuth();
  const [mode, setMode] = useState('login');
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [announcement, setAnnouncement] = useState({
    title: 'PROVEN TRACK RECORD',
    text: 'We did 100+ projects as of now, 200+ clients satisfied across colleges!',
    stats_badge: '100+ Projects Completed · 200+ Satisfied Students',
  });

  useEffect(() => {
    projectsApi
      .getAnnouncement()
      .then((data) => {
        if (data && data.text) {
          setAnnouncement(data);
        }
      })
      .catch(() => {
        // Fallback to default metrics
      });
  }, []);

  async function handleSubmit(e) {
    e.preventDefault();
    setError('');
    setSubmitting(true);

    const formData = new FormData(e.target);
    const formValues = Object.fromEntries(formData.entries());

    try {
      if (mode === 'signup') {
        await register(formValues.name, formValues.email, formValues.password);
      } else {
        await login(formValues.usernameOrEmail, formValues.password);
      }
    } catch (err) {
      setError(err.message || 'Authentication failed. Please check your credentials.');
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="auth-page-wrapper">
      <main className="auth">
        <section className="hero">
          <span className="logo">
            <span>◉</span> College Circuit
          </span>
          <h1>
            Bring your project
            <br />
            <i>to life.</i>
          </h1>
          <p>
            From bright campus ideas to polished digital products — collaborate with experienced
            student developers and freelance mentors.
          </p>

          {/* Hero Announcement & Metrics Dialog Box */}
          <div className="hero-announcement-dialog">
            <div className="announcement-header">
              <span className="live-pulse" />
              <span className="announcement-tag">{announcement.title}</span>
            </div>
            <p className="announcement-body">{announcement.text}</p>
            <div className="announcement-badge-row">
              <span>✦ {announcement.stats_badge}</span>
            </div>
          </div>

          <div className="chips">
            <span>Web Apps</span>
            <span>IoT Builds</span>
            <span>AI / Machine Learning</span>
            <span>Mobile Apps</span>
          </div>
        </section>

        <section className="authbox">
          <div>
            <p className="eyebrow">WELCOME TO COLLEGE CIRCUIT</p>
            <h2>{mode === 'login' ? 'Welcome back' : 'Start your project'}</h2>
            <p className="muted">
              {mode === 'login'
                ? 'Sign in to monitor your requests and delivery status.'
                : 'Create your account in seconds to begin.'}
            </p>
          </div>

          <form onSubmit={handleSubmit}>
            {mode === 'signup' && (
              <label>
                Full name
                <input
                  name="name"
                  required
                  placeholder="e.g. Alex Johnson"
                  autoComplete="name"
                />
              </label>
            )}

            <label>
              {mode === 'login' ? 'Email address or username' : 'Email address'}
              <input
                name={mode === 'login' ? 'usernameOrEmail' : 'email'}
                type={mode === 'login' ? 'text' : 'email'}
                required
                placeholder={mode === 'login' ? 'you@college.edu or username' : 'you@college.edu'}
                autoComplete={mode === 'login' ? 'username' : 'email'}
              />
            </label>

            <label>
              Password
              <input
                name="password"
                type="password"
                minLength={8}
                required
                placeholder="At least 8 characters"
                autoComplete={mode === 'login' ? 'current-password' : 'new-password'}
              />
            </label>

            {error && <div className="error">{error}</div>}

            <button type="submit" disabled={submitting}>
              {submitting ? 'Please wait…' : mode === 'login' ? 'Log in' : 'Create account'} <b>→</b>
            </button>
          </form>

          <p className="switch">
            {mode === 'login' ? 'New to College Circuit? ' : 'Already have an account? '}
            <a
              onClick={() => {
                setMode(mode === 'login' ? 'signup' : 'login');
                setError('');
              }}
            >
              {mode === 'login' ? 'Create an account' : 'Log in'}
            </a>
          </p>
        </section>
      </main>

      <Footer />
    </div>
  );
}
