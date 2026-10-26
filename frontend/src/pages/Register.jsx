import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import authService from '../services/authService';

/**
 * Register Page
 * Creates new contributor account with Email OTP dispatch.
 * Preserves destination (from) so user lands back after verifying email.
 */
export default function Register() {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  // Preserve destination from the protected route redirect
  const from = location.state?.from;

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!username.trim() || !email.trim() || !password || !confirmPassword) {
      setError('Username, email, and password fields are required.');
      return;
    }

    if (password !== confirmPassword) {
      setError('Passwords do not match.');
      return;
    }

    if (password.length < 6) {
      setError('Password must be at least 6 characters.');
      return;
    }

    try {
      setError('');
      setLoading(true);
      const res = await authService.register(
        username.trim(),
        email.trim(),
        password,
        phoneNumber.trim()
      );

      if (res && res.status === 'pending_verification') {
        navigate('/verify', {
          state: {
            email: res.email,
            username: res.username,
            phone_number: res.phone_number,
            from, // forward destination so VerifyAccount can navigate back there after OTP
          },
        });
      } else if (res && res.token && res.user) {
        login(res.user, res.token);
        // Navigate to originally intended page or my-submissions
        const dest = from?.pathname || from || '/my-submissions';
        navigate(dest, { replace: true });
      } else {
        setError(res?.message || 'Registration failed.');
      }
    } catch (err) {
      setError(err.message || 'Failed to create account.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container page-container" style={{ maxWidth: '520px' }}>
      <div style={{ background: '#ffffff', padding: '3rem 2.5rem', borderRadius: 'var(--radius-xl)', border: '1px solid var(--color-border)', boxShadow: 'var(--shadow-xl)' }}>
        <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
          <span style={{ fontSize: '2.5rem', display: 'block', marginBottom: '0.5rem' }}>✨</span>
          <h1 style={{ fontFamily: 'var(--font-serif)', fontSize: '2rem', color: 'var(--color-primary-dark)', marginBottom: '0.4rem' }}>
            Join the Community
          </h1>
          <p style={{ color: 'var(--color-text-muted)', fontSize: '0.95rem' }}>
            Create a contributor profile. A 4-digit verification code will be sent to your email inbox.
          </p>
        </div>

        {error && (
          <div style={{ background: '#fee2e2', color: '#991b1b', padding: '0.85rem 1.25rem', borderRadius: 'var(--radius-md)', marginBottom: '1.5rem', fontSize: '0.92rem', border: '1px solid #fecaca' }}>
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <div style={{ marginBottom: '1.25rem' }}>
            <label style={{ display: 'block', fontSize: '0.9rem', fontWeight: 700, marginBottom: '0.45rem', color: 'var(--color-primary-dark)' }}>
              Choose a Username
            </label>
            <input
              type="text"
              required
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="e.g. motuma_dev"
              style={{ width: '100%', padding: '0.85rem 1.1rem', borderRadius: 'var(--radius-md)', border: '1px solid var(--color-border)', outline: 'none', fontSize: '0.98rem' }}
            />
          </div>

          <div style={{ marginBottom: '1.25rem' }}>
            <label style={{ display: 'block', fontSize: '0.9rem', fontWeight: 700, marginBottom: '0.45rem', color: 'var(--color-primary-dark)' }}>
              ✉️ Email Address (for 4-digit OTP)
            </label>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@example.com"
              style={{ width: '100%', padding: '0.85rem 1.1rem', borderRadius: 'var(--radius-md)', border: '1px solid var(--color-border)', outline: 'none', fontSize: '0.98rem' }}
            />
            <span style={{ fontSize: '0.8rem', color: 'var(--color-text-muted)', marginTop: '0.25rem', display: 'block' }}>
              We will send your 4-digit verification code to this inbox.
            </span>
          </div>

          <div style={{ marginBottom: '1.25rem' }}>
            <label style={{ display: 'block', fontSize: '0.9rem', fontWeight: 700, marginBottom: '0.45rem', color: 'var(--color-primary-dark)' }}>
              📱 Mobile Phone Number (Optional)
            </label>
            <input
              type="tel"
              value={phoneNumber}
              onChange={(e) => setPhoneNumber(e.target.value)}
              placeholder="e.g. 0952833568 or +251 9..."
              style={{ width: '100%', padding: '0.85rem 1.1rem', borderRadius: 'var(--radius-md)', border: '1px solid var(--color-border)', outline: 'none', fontSize: '0.98rem' }}
            />
          </div>

          <div style={{ marginBottom: '1.25rem' }}>
            <label style={{ display: 'block', fontSize: '0.9rem', fontWeight: 700, marginBottom: '0.45rem', color: 'var(--color-primary-dark)' }}>
              Password (Min 6 Characters)
            </label>
            <input
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              style={{ width: '100%', padding: '0.85rem 1.1rem', borderRadius: 'var(--radius-md)', border: '1px solid var(--color-border)', outline: 'none', fontSize: '0.98rem' }}
            />
          </div>

          <div style={{ marginBottom: '1.75rem' }}>
            <label style={{ display: 'block', fontSize: '0.9rem', fontWeight: 700, marginBottom: '0.45rem', color: 'var(--color-primary-dark)' }}>
              Confirm Password
            </label>
            <input
              type="password"
              required
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              placeholder="••••••••"
              style={{ width: '100%', padding: '0.85rem 1.1rem', borderRadius: 'var(--radius-md)', border: '1px solid var(--color-border)', outline: 'none', fontSize: '0.98rem' }}
            />
          </div>

          <button type="submit" disabled={loading} className="btn btn-primary" style={{ width: '100%', padding: '0.9rem', fontSize: '1rem', borderRadius: 'var(--radius-md)' }}>
            {loading ? 'Sending Verification Code...' : 'Send 4-Digit OTP to Email →'}
          </button>
        </form>

        <p style={{ marginTop: '1.75rem', textAlign: 'center', fontSize: '0.92rem', color: 'var(--color-text-muted)' }}>
          Already have an account? <Link to="/login" style={{ fontWeight: 700, color: 'var(--color-primary-light)' }}>Sign in here &rarr;</Link>
        </p>
      </div>
    </div>
  );
}
