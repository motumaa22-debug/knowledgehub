import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useLanguage } from '../i18n/LanguageContext';
import authService from '../services/authService';

/**
 * Login Page
 * Authenticates against live PHP MySQL REST API.
 */
export default function Login() {
  const { t } = useLanguage();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const from = location.state?.from?.pathname || (typeof location.state?.from === 'string' ? location.state?.from : '/');

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!username.trim() || !password) {
      setError('Please provide your username/email and password.');
      return;
    }

    try {
      setError('');
      setLoading(true);
      const res = await authService.login(username.trim(), password);

      if (res && res.status === 'unverified') {
        navigate('/verify', {
          state: {
            email: res.email,
            phone_number: res.phone_number,
            username: res.username,
            from: location.state?.from,
          },
        });
      } else if (res && res.token && res.user) {
        login(res.user, res.token);
        if (res.user.role === 'admin' && from === '/') {
          navigate('/admin', { replace: true });
        } else {
          navigate(from, { replace: true });
        }
      } else {
        // Show real backend message, or detailed debug info
        const debugInfo = res
          ? `Backend returned: status="${res.status}", message="${res.message || 'none'}" — no token received.`
          : 'No response received from server.';
        setError(res?.message || debugInfo);
      }
    } catch (err) {
      setError(err.message || 'Login failed. Please check your credentials.');
    } finally {
      setLoading(false);
    }
  };

  const handleQuickFill = (u, p) => {
    setUsername(u);
    setPassword(p);
  };

  return (
    <div className="container page-container" style={{ maxWidth: '500px' }}>
      <div style={{ background: '#ffffff', padding: '3rem 2.5rem', borderRadius: 'var(--radius-xl)', border: '1px solid var(--color-border)', boxShadow: 'var(--shadow-xl)' }}>
        <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
          <span style={{ fontSize: '2.5rem', display: 'block', marginBottom: '0.5rem' }}>🔐</span>
          <h1 style={{ fontFamily: 'var(--font-serif)', fontSize: '2rem', color: 'var(--color-primary-dark)', marginBottom: '0.4rem' }}>
            Welcome Back
          </h1>
          <p style={{ color: 'var(--color-text-muted)', fontSize: '0.95rem' }}>
            Sign in to contribute books, poems, and proverbs to KnowledgeHub.
          </p>
        </div>

        {location.state?.from && (
          <div style={{ background: '#fef3c7', color: '#92400e', padding: '0.85rem 1rem', borderRadius: 'var(--radius-md)', marginBottom: '1.5rem', fontSize: '0.88rem', border: '1px solid #fde68a', textAlign: 'center', fontWeight: 600 }}>
            🔒 Member Access Required: Please sign in or register to view this document and download PDF books.
          </div>
        )}

        {error && (
          <div style={{ background: '#fee2e2', color: '#991b1b', padding: '0.85rem 1.25rem', borderRadius: 'var(--radius-md)', marginBottom: '1.5rem', fontSize: '0.92rem', border: '1px solid #fecaca' }}>
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <div style={{ marginBottom: '1.35rem' }}>
            <label style={{ display: 'block', fontSize: '0.9rem', fontWeight: 700, marginBottom: '0.45rem', color: 'var(--color-primary-dark)' }}>
              Username or Email Address
            </label>
            <input
              type="text"
              required
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="e.g. contributor or admin"
              style={{ width: '100%', padding: '0.85rem 1.1rem', borderRadius: 'var(--radius-md)', border: '1px solid var(--color-border)', outline: 'none', fontSize: '0.98rem' }}
            />
          </div>

          <div style={{ marginBottom: '1.75rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.45rem' }}>
              <label style={{ fontSize: '0.9rem', fontWeight: 700, color: 'var(--color-primary-dark)', margin: 0 }}>
                Password
              </label>
              <Link
                to="/forgot-password"
                style={{ fontSize: '0.84rem', color: 'var(--color-primary-light)', fontWeight: 600, textDecoration: 'none' }}
              >
                {t('nav.forgotPassword', 'Forgot Password?')}
              </Link>
            </div>
            <input
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              style={{ width: '100%', padding: '0.85rem 1.1rem', borderRadius: 'var(--radius-md)', border: '1px solid var(--color-border)', outline: 'none', fontSize: '0.98rem' }}
            />
          </div>

          <button type="submit" disabled={loading} className="btn btn-primary" style={{ width: '100%', padding: '0.9rem', fontSize: '1rem', borderRadius: 'var(--radius-md)' }}>
            {loading ? 'Authenticating...' : 'Sign In to Your Account'}
          </button>
        </form>

        <p style={{ marginTop: '1.75rem', textAlign: 'center', fontSize: '0.92rem', color: 'var(--color-text-muted)' }}>
          Don't have an account yet? <Link to="/register" state={{ from: location.state?.from }} style={{ fontWeight: 700, color: 'var(--color-primary-light)' }}>Create an account &rarr;</Link>
        </p>

        {/* Demo Fast-Fill Box */}
        <div style={{ marginTop: '2rem', padding: '1.25rem', background: 'var(--color-bg-alt)', borderRadius: 'var(--radius-lg)', border: '1px solid var(--color-border)', fontSize: '0.84rem' }}>
          <div style={{ fontWeight: 700, color: 'var(--color-primary-dark)', marginBottom: '0.5rem' }}>
            💡 Quick Demo Credentials (Click to Fill):
          </div>
          <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap' }}>
            <button
              type="button"
              onClick={() => handleQuickFill('contributor', 'password123')}
              className="btn btn-outline"
              style={{ fontSize: '0.8rem', padding: '0.35rem 0.75rem', background: '#fff' }}
            >
              👤 Contributor (contributor)
            </button>
            <button
              type="button"
              onClick={() => handleQuickFill('admin', 'password123')}
              className="btn btn-outline"
              style={{ fontSize: '0.8rem', padding: '0.35rem 0.75rem', background: '#fff' }}
            >
              🛡️ Administrator (admin)
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
