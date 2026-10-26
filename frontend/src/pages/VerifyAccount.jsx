import React, { useState, useEffect, useRef } from 'react';
import { useLocation, useNavigate, Link } from 'react-router-dom';
import authService from '../services/authService';
import { useAuth } from '../context/AuthContext';
import { useLanguage } from '../i18n/LanguageContext';

/**
 * VerifyAccount Page
 * Secure Email 4-Digit OTP Verification.
 * The OTP is sent directly to the user's email inbox and entered here.
 */
export default function VerifyAccount() {
  const location = useLocation();
  const navigate = useNavigate();
  const { login } = useAuth();
  const { t } = useLanguage();

  const queryParams = new URLSearchParams(location.search);
  const initialEmail = location.state?.email || queryParams.get('email') || '';
  const initialPhone = location.state?.phone_number || queryParams.get('phone') || '';
  // Destination to go after successful OTP verification
  const fromState = location.state?.from;
  const postVerifyPath = fromState?.pathname || (typeof fromState === 'string' ? fromState : '/browse');

  const [email, setEmail] = useState(initialEmail);
  const [phone, setPhone] = useState(initialPhone);
  const [digits, setDigits] = useState(['', '', '', '']);
  const [loading, setLoading] = useState(false);
  const [resending, setResending] = useState(false);
  const [error, setError] = useState('');
  const [successMsg, setSuccessMsg] = useState('');
  const [resendCooldown, setResendCooldown] = useState(0);

  const inputRefs = [useRef(), useRef(), useRef(), useRef()];

  // Countdown timer for resend
  useEffect(() => {
    let timer;
    if (resendCooldown > 0) {
      timer = setInterval(() => {
        setResendCooldown((prev) => (prev > 0 ? prev - 1 : 0));
      }, 1000);
    }
    return () => clearInterval(timer);
  }, [resendCooldown]);

  // Focus first input on mount
  useEffect(() => {
    if (inputRefs[0].current) {
      inputRefs[0].current.focus();
    }
  }, []);

  // Handle single digit change and auto-advance
  const handleDigitChange = (index, value) => {
    const cleaned = value.replace(/\D/g, '');
    if (!cleaned && value !== '') return;

    const newDigits = [...digits];
    newDigits[index] = cleaned.slice(-1);
    setDigits(newDigits);

    if (cleaned && index < 3) {
      inputRefs[index + 1].current?.focus();
    }
  };

  // Handle key down for backspace navigation
  const handleKeyDown = (index, e) => {
    if (e.key === 'Backspace' && !digits[index] && index > 0) {
      inputRefs[index - 1].current?.focus();
    }
  };

  // Handle paste full 4-digit code
  const handlePaste = (e) => {
    e.preventDefault();
    const pasted = e.clipboardData.getData('text').replace(/\D/g, '').slice(0, 4);
    if (pasted.length > 0) {
      const newDigits = ['', '', '', ''];
      for (let i = 0; i < pasted.length; i++) {
        newDigits[i] = pasted[i];
      }
      setDigits(newDigits);
      const nextFocus = Math.min(pasted.length, 3);
      inputRefs[nextFocus].current?.focus();
    }
  };

  const handleSubmit = async (e) => {
    if (e) e.preventDefault();
    const code = digits.join('');
    const identifier = email || phone;

    if (!identifier) {
      setError('Please provide your email address.');
      return;
    }

    if (code.length !== 4) {
      setError('Please enter the complete 4-digit verification code received in your email.');
      return;
    }

    try {
      setLoading(true);
      setError('');
      setSuccessMsg('');

      const res = await authService.verifyCode(identifier, code);

      if (res && res.token && res.user) {
        login(res.user, res.token);
        setSuccessMsg('✓ Email verified successfully! Welcome to KnowledgeHub...');
        setTimeout(() => {
          // Navigate back to where the user was trying to go before registration
          navigate(postVerifyPath, { replace: true });
        }, 1400);
      } else {
        setSuccessMsg(res.message || 'Verification successful! You can now log in.');
        setTimeout(() => {
          navigate('/login');
        }, 1800);
      }
    } catch (err) {
      setError(err.message || 'Verification failed. Please check the 4-digit code from your email.');
    } finally {
      setLoading(false);
    }
  };

  const handleResend = async () => {
    if (resendCooldown > 0 || resending) return;
    const identifier = email || phone;

    if (!identifier) {
      setError('Email address is missing. Please re-register.');
      return;
    }

    try {
      setResending(true);
      setError('');
      await authService.resendCode(identifier);
      setSuccessMsg('A fresh 4-digit verification code has been dispatched to your email inbox.');
      setResendCooldown(30);
    } catch (err) {
      setError(err.message || 'Failed to resend email. Please try again.');
    } finally {
      setResending(false);
    }
  };

  // Detect webmail link helper
  const getWebmailLink = () => {
    if (email.includes('@gmail.com')) return 'https://mail.google.com';
    if (email.includes('@outlook.com') || email.includes('@hotmail.com')) return 'https://outlook.live.com';
    if (email.includes('@yahoo.com')) return 'https://mail.yahoo.com';
    return null;
  };
  const webmailUrl = getWebmailLink();

  return (
    <div className="container page-container" style={{ minHeight: '80vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <div
        style={{
          background: '#ffffff',
          borderRadius: 'var(--radius-xl)',
          border: '1px solid var(--color-border)',
          boxShadow: 'var(--shadow-xl)',
          padding: '3rem 2.5rem',
          maxWidth: '520px',
          width: '100%',
          textAlign: 'center',
        }}
      >
        {/* Email Shield Icon */}
        <div
          style={{
            width: '72px',
            height: '72px',
            borderRadius: '50%',
            background: 'var(--color-primary-subtle)',
            color: 'var(--color-primary)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: '2.2rem',
            margin: '0 auto 1.5rem',
          }}
        >
          ✉️
        </div>

        <h1 style={{ fontFamily: 'var(--font-serif)', fontSize: '2rem', color: 'var(--color-primary-dark)', margin: '0 0 0.5rem 0' }}>
          Check Your Email
        </h1>

        <p style={{ color: 'var(--color-text-muted)', fontSize: '0.95rem', margin: '0 0 1.5rem 0', lineHeight: 1.6 }}>
          We sent a 4-digit verification code to:
          <br />
          <strong style={{ color: 'var(--color-primary-dark)', fontSize: '1.15rem', display: 'inline-block', marginTop: '0.25rem' }}>
            {email || phone || 'your email address'}
          </strong>
        </p>

        <div
          style={{
            background: '#f8fafc',
            border: '1px solid var(--color-border)',
            borderRadius: 'var(--radius-md)',
            padding: '0.85rem 1rem',
            marginBottom: '1.75rem',
            fontSize: '0.85rem',
            color: 'var(--color-text-muted)',
            lineHeight: 1.5,
          }}
        >
          📬 Open your email inbox (and check your <strong>Spam / Junk</strong> folder if needed) and enter the 4-digit code below.
        </div>

        {webmailUrl && (
          <div style={{ marginBottom: '1.75rem' }}>
            <a
              href={webmailUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="btn btn-outline"
              style={{ padding: '0.45rem 1.25rem', fontSize: '0.88rem', background: '#fff' }}
            >
              🚀 Open Email Inbox &rarr;
            </a>
          </div>
        )}

        {error && (
          <div
            style={{
              background: '#fee2e2',
              color: '#991b1b',
              padding: '0.85rem 1rem',
              borderRadius: 'var(--radius-md)',
              marginBottom: '1.5rem',
              fontSize: '0.9rem',
              border: '1px solid #fecaca',
            }}
          >
            {error}
          </div>
        )}

        {successMsg && (
          <div
            style={{
              background: '#ecfdf5',
              color: '#065f46',
              padding: '0.85rem 1rem',
              borderRadius: 'var(--radius-md)',
              marginBottom: '1.5rem',
              fontSize: '0.9rem',
              border: '1px solid #a7f3d0',
              fontWeight: 600,
            }}
          >
            ✓ {successMsg}
          </div>
        )}

        <form onSubmit={handleSubmit}>
          {!email && !phone && (
            <div style={{ marginBottom: '1.5rem', textAlign: 'left' }}>
              <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 700, marginBottom: '0.35rem' }}>
                Email Address:
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@example.com"
                className="form-input"
                required
              />
            </div>
          )}

          {/* 4 Segmented Digit Input Boxes */}
          <div
            className="otp-digit-row"
            style={{ marginBottom: '2rem' }}
            onPaste={handlePaste}
          >
            {digits.map((digit, idx) => (
              <input
                key={idx}
                ref={inputRefs[idx]}
                type="text"
                inputMode="numeric"
                maxLength={1}
                value={digit}
                onChange={(e) => handleDigitChange(idx, e.target.value)}
                onKeyDown={(e) => handleKeyDown(idx, e)}
                className={`otp-digit-input${digit ? ' filled' : ''}`}
              />
            ))}
          </div>

          <button
            type="submit"
            disabled={loading || digits.join('').length !== 4}
            className="btn btn-primary"
            style={{
              width: '100%',
              padding: '0.9rem',
              fontSize: '1.05rem',
              marginBottom: '1.5rem',
            }}
          >
            {loading ? 'Verifying 4-Digit Code...' : 'Verify & Activate Account →'}
          </button>
        </form>

        {/* Resend Code Section */}
        <div style={{ fontSize: '0.9rem', color: 'var(--color-text-muted)', marginBottom: '1.75rem' }}>
          Didn't receive the email?{' '}
          <button
            type="button"
            onClick={handleResend}
            disabled={resendCooldown > 0 || resending}
            style={{
              background: 'none',
              border: 'none',
              color: resendCooldown > 0 ? '#94a3b8' : 'var(--color-primary-light)',
              fontWeight: 700,
              cursor: resendCooldown > 0 ? 'not-allowed' : 'pointer',
              padding: 0,
              textDecoration: resendCooldown > 0 ? 'none' : 'underline',
            }}
          >
            {resending
              ? 'Sending Email...'
              : resendCooldown > 0
              ? `Resend Email in ${resendCooldown}s`
              : 'Resend Verification Email'}
          </button>
        </div>

        <div style={{ paddingTop: '1.5rem', borderTop: '1px solid var(--color-border-subtle)', display: 'flex', justifyContent: 'space-between', fontSize: '0.88rem' }}>
          <Link to="/register" style={{ color: 'var(--color-text-muted)' }}>
            Wrong email address?
          </Link>
          <Link to="/login" style={{ color: 'var(--color-primary-light)', fontWeight: 600 }}>
            Back to Sign In &rarr;
          </Link>
        </div>
      </div>
    </div>
  );
}
