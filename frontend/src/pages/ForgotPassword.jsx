import React, { useState, useEffect, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useLanguage } from '../i18n/LanguageContext';
import authService from '../services/authService';

/**
 * ForgotPassword Page
 * Two-stage secure password recovery with 4-digit Email OTP verification
 * and instant password update with trilingual support.
 */
export default function ForgotPassword() {
  const { t } = useLanguage();
  const { login } = useAuth();
  const navigate = useNavigate();

  // Recovery flow: 1 = Request Code, 2 = Enter Code & New Password, 3 = Complete
  const [step, setStep] = useState(1);

  // Form states
  const [identifier, setIdentifier] = useState('');
  const [targetEmail, setTargetEmail] = useState('');
  const [digits, setDigits] = useState(['', '', '', '']);
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  // UI status
  const [loading, setLoading] = useState(false);
  const [resending, setResending] = useState(false);
  const [error, setError] = useState('');
  const [successMsg, setSuccessMsg] = useState('');
  const [resendCooldown, setResendCooldown] = useState(0);

  const inputRefs = [useRef(), useRef(), useRef(), useRef()];

  // Countdown timer for code resend
  useEffect(() => {
    let timer;
    if (resendCooldown > 0) {
      timer = setInterval(() => {
        setResendCooldown((prev) => (prev > 0 ? prev - 1 : 0));
      }, 1000);
    }
    return () => clearInterval(timer);
  }, [resendCooldown]);

  // Focus first OTP input when step 2 opens
  useEffect(() => {
    if (step === 2 && inputRefs[0].current) {
      setTimeout(() => inputRefs[0].current?.focus(), 150);
    }
  }, [step]);

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

  // Handle backspace navigation between digit boxes
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

  // Step 1: Request 4-digit reset OTP
  const handleRequestCode = async (e) => {
    e.preventDefault();
    if (!identifier.trim()) {
      setError(t('forgotPassword.emailLabel', 'Please provide your registered email or username.'));
      return;
    }

    try {
      setLoading(true);
      setError('');
      setSuccessMsg('');

      const res = await authService.forgotPassword(identifier.trim());

      if (res && res.status === 'success') {
        setTargetEmail(res.email || identifier.trim());
        setStep(2);
        setResendCooldown(30);
        setSuccessMsg(res.message || t('forgotPassword.codeSentNotice', '4-digit code dispatched to your email!'));
      } else {
        setError(res?.message || 'Failed to dispatch reset code.');
      }
    } catch (err) {
      setError(err.message || 'Failed to request reset code. Please check your credentials.');
    } finally {
      setLoading(false);
    }
  };

  // Step 2: Verify Code and Reset Password
  const handleResetPassword = async (e) => {
    e.preventDefault();
    const code = digits.join('');

    if (code.length !== 4) {
      setError('Please enter the complete 4-digit verification code from your email.');
      return;
    }

    if (newPassword.length < 6) {
      setError('New password must be at least 6 characters long.');
      return;
    }

    if (newPassword !== confirmPassword) {
      setError('Passwords do not match. Please verify both fields.');
      return;
    }

    try {
      setLoading(true);
      setError('');
      setSuccessMsg('');

      const res = await authService.resetPassword(
        targetEmail || identifier.trim(),
        code,
        newPassword,
        confirmPassword
      );

      if (res && res.status === 'success') {
        setStep(3);
        setSuccessMsg(res.message || t('forgotPassword.successTitle', 'Password reset successfully!'));

        // If server provided JWT session token, log user in seamlessly
        if (res.token && res.user) {
          login(res.user, res.token);
          setTimeout(() => {
            navigate('/browse');
          }, 2000);
        } else {
          setTimeout(() => {
            navigate('/login');
          }, 2200);
        }
      } else {
        setError(res?.message || 'Password reset failed.');
      }
    } catch (err) {
      setError(err.message || 'Failed to reset password. Please check the 4-digit code.');
    } finally {
      setLoading(false);
    }
  };

  // Resend fresh reset code
  const handleResend = async () => {
    if (resendCooldown > 0 || resending) return;

    try {
      setResending(true);
      setError('');
      const res = await authService.forgotPassword(targetEmail || identifier.trim());
      setSuccessMsg(res?.message || 'A fresh 4-digit code has been dispatched to your email.');
      setResendCooldown(30);
    } catch (err) {
      setError(err.message || 'Failed to resend code. Please try again.');
    } finally {
      setResending(false);
    }
  };

  // Webmail helper link
  const getWebmailLink = () => {
    const em = (targetEmail || identifier).toLowerCase();
    if (em.includes('@gmail.com')) return 'https://mail.google.com';
    if (em.includes('@outlook.com') || em.includes('@hotmail.com')) return 'https://outlook.live.com';
    if (em.includes('@yahoo.com')) return 'https://mail.yahoo.com';
    return null;
  };
  const webmailUrl = getWebmailLink();

  return (
    <div className="container page-container" style={{ minHeight: '80vh', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '2rem 1rem' }}>
      <div
        className="forgot-password-card"
      >
        {/* Top Icon Badge */}
        <div
          style={{
            width: '74px',
            height: '74px',
            borderRadius: '50%',
            background: step === 3 ? '#ecfdf5' : 'var(--color-primary-subtle)',
            color: step === 3 ? '#059669' : 'var(--color-primary)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: '2.4rem',
            margin: '0 auto 1.5rem',
            boxShadow: '0 4px 14px rgba(30, 58, 138, 0.1)',
          }}
        >
          {step === 3 ? '✅' : step === 2 ? '📬' : '🔑'}
        </div>

        <span className="content-badge badge-pdf" style={{ marginBottom: '0.85rem', display: 'inline-block' }}>
          {t('forgotPassword.badge', '🔐 Account Recovery')}
        </span>

        <h1
          style={{
            fontFamily: 'var(--font-serif)',
            fontSize: '2rem',
            color: 'var(--color-primary-dark)',
            margin: '0.35rem 0 0.5rem 0',
          }}
        >
          {step === 3
            ? t('forgotPassword.successTitle', 'Password Reset Complete!')
            : step === 2
            ? t('forgotPassword.step2Title', 'Set Your New Password')
            : t('forgotPassword.title', 'Reset Your Password')}
        </h1>

        <p style={{ color: 'var(--color-text-muted)', fontSize: '0.94rem', margin: '0 0 1.75rem 0', lineHeight: 1.6 }}>
          {step === 3
            ? t('forgotPassword.successMsg', 'Your password has been securely updated. Redirecting you to your account...')
            : step === 2
            ? t('forgotPassword.step2Subtitle', 'Enter the 4-digit code sent to your email along with your new password.')
            : t('forgotPassword.subtitle', 'Enter your registered email address or username. We will send a 4-digit code to securely reset your password.')}
        </p>

        {/* Error Notification */}
        {error && (
          <div
            style={{
              background: '#fee2e2',
              color: '#991b1b',
              padding: '0.85rem 1.25rem',
              borderRadius: 'var(--radius-md)',
              marginBottom: '1.5rem',
              fontSize: '0.9rem',
              border: '1px solid #fecaca',
              textAlign: 'left',
            }}
          >
            {error}
          </div>
        )}

        {/* Success Notification */}
        {successMsg && step !== 3 && (
          <div
            style={{
              background: '#ecfdf5',
              color: '#065f46',
              padding: '0.85rem 1.25rem',
              borderRadius: 'var(--radius-md)',
              marginBottom: '1.5rem',
              fontSize: '0.9rem',
              border: '1px solid #a7f3d0',
              fontWeight: 600,
              textAlign: 'left',
            }}
          >
            ✓ {successMsg}
          </div>
        )}

        {/* STEP 1: Enter email or username */}
        {step === 1 && (
          <form onSubmit={handleRequestCode} style={{ textAlign: 'left' }}>
            <div style={{ marginBottom: '1.75rem' }}>
              <label
                style={{
                  display: 'block',
                  fontSize: '0.9rem',
                  fontWeight: 700,
                  marginBottom: '0.5rem',
                  color: 'var(--color-primary-dark)',
                }}
              >
                {t('forgotPassword.emailLabel', 'Registered Email or Username')}
              </label>
              <input
                type="text"
                required
                value={identifier}
                onChange={(e) => setIdentifier(e.target.value)}
                placeholder="e.g. contributor or you@example.com"
                style={{
                  width: '100%',
                  padding: '0.85rem 1.1rem',
                  borderRadius: 'var(--radius-md)',
                  border: '1px solid var(--color-border)',
                  outline: 'none',
                  fontSize: '1rem',
                }}
              />
            </div>

            <button
              type="submit"
              disabled={loading || !identifier.trim()}
              className="btn btn-primary"
              style={{
                width: '100%',
                padding: '0.95rem',
                fontSize: '1.02rem',
                borderRadius: 'var(--radius-md)',
                marginBottom: '1.5rem',
              }}
            >
              {loading ? 'Sending Code...' : t('forgotPassword.sendBtn', 'Send 4-Digit Reset Code →')}
            </button>
          </form>
        )}

        {/* STEP 2: Enter 4-digit code & choose new password */}
        {step === 2 && (
          <form onSubmit={handleResetPassword} style={{ textAlign: 'left' }}>
            {targetEmail && (
              <div
                style={{
                  background: '#f8fafc',
                  border: '1px solid var(--color-border)',
                  borderRadius: 'var(--radius-md)',
                  padding: '0.75rem 1rem',
                  marginBottom: '1.5rem',
                  fontSize: '0.85rem',
                  color: 'var(--color-text-muted)',
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  flexWrap: 'wrap',
                  gap: '0.5rem',
                }}
              >
                <span>
                  Code sent to: <strong style={{ color: 'var(--color-primary-dark)' }}>{targetEmail}</strong>
                </span>
                {webmailUrl && (
                  <a
                    href={webmailUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    style={{ fontSize: '0.8rem', fontWeight: 700, color: 'var(--color-primary-light)' }}
                  >
                    Open Inbox &rarr;
                  </a>
                )}
              </div>
            )}

            {/* 4 Digit segmented input */}
            <div style={{ marginBottom: '1.75rem', textAlign: 'center' }}>
              <label
                style={{
                  display: 'block',
                  fontSize: '0.88rem',
                  fontWeight: 700,
                  marginBottom: '0.75rem',
                  color: 'var(--color-primary-dark)',
                  textAlign: 'left',
                }}
              >
                {t('forgotPassword.codeLabel', '4-Digit Verification Code')}
              </label>

              <div
                className="otp-digit-row"
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
            </div>

            {/* New Password */}
            <div style={{ marginBottom: '1.25rem' }}>
              <label
                style={{
                  display: 'block',
                  fontSize: '0.88rem',
                  fontWeight: 700,
                  marginBottom: '0.45rem',
                  color: 'var(--color-primary-dark)',
                }}
              >
                {t('forgotPassword.newPasswordLabel', 'New Password (min 6 characters)')}
              </label>
              <div style={{ position: 'relative' }}>
                <input
                  type={showPassword ? 'text' : 'password'}
                  required
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  placeholder="••••••••"
                  style={{
                    width: '100%',
                    padding: '0.85rem 2.8rem 0.85rem 1.1rem',
                    borderRadius: 'var(--radius-md)',
                    border: '1px solid var(--color-border)',
                    outline: 'none',
                    fontSize: '0.98rem',
                  }}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  style={{
                    position: 'absolute',
                    right: '12px',
                    top: '50%',
                    transform: 'translateY(-50%)',
                    background: 'none',
                    border: 'none',
                    cursor: 'pointer',
                    fontSize: '1.1rem',
                    color: 'var(--color-text-muted)',
                  }}
                  title={showPassword ? 'Hide password' : 'Show password'}
                >
                  {showPassword ? '🙈' : '👁️'}
                </button>
              </div>
            </div>

            {/* Confirm Password */}
            <div style={{ marginBottom: '1.75rem' }}>
              <label
                style={{
                  display: 'block',
                  fontSize: '0.88rem',
                  fontWeight: 700,
                  marginBottom: '0.45rem',
                  color: 'var(--color-primary-dark)',
                }}
              >
                {t('forgotPassword.confirmPasswordLabel', 'Confirm New Password')}
              </label>
              <input
                type={showPassword ? 'text' : 'password'}
                required
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="••••••••"
                style={{
                  width: '100%',
                  padding: '0.85rem 1.1rem',
                  borderRadius: 'var(--radius-md)',
                  border: '1px solid var(--color-border)',
                  outline: 'none',
                  fontSize: '0.98rem',
                }}
              />
            </div>

            <button
              type="submit"
              disabled={loading || digits.join('').length !== 4 || newPassword.length < 6}
              className="btn btn-primary"
              style={{
                width: '100%',
                padding: '0.95rem',
                fontSize: '1.02rem',
                borderRadius: 'var(--radius-md)',
                marginBottom: '1.5rem',
              }}
            >
              {loading ? 'Updating Password...' : t('forgotPassword.resetBtn', 'Reset Password & Sign In →')}
            </button>

            {/* Resend Code Section */}
            <div style={{ textAlign: 'center', fontSize: '0.88rem', color: 'var(--color-text-muted)', marginBottom: '1.25rem' }}>
              Didn't receive the email code?{' '}
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
                  ? 'Sending...'
                  : resendCooldown > 0
                  ? `Resend in ${resendCooldown}s`
                  : t('forgotPassword.resendCode', 'Resend Reset Code')}
              </button>
            </div>
          </form>
        )}

        {/* STEP 3: Complete / Redirecting */}
        {step === 3 && (
          <div style={{ padding: '1rem 0 1.5rem 0' }}>
            <Link
              to="/browse"
              className="btn btn-primary"
              style={{ padding: '0.85rem 2rem', fontSize: '1rem' }}
            >
              Go to Library Catalog &rarr;
            </Link>
          </div>
        )}

        {/* Back to Sign In Link */}
        <div style={{ paddingTop: '1.5rem', borderTop: '1px solid var(--color-border-subtle)', textAlign: 'center' }}>
          <Link
            to="/login"
            style={{
              color: 'var(--color-primary-light)',
              fontWeight: 600,
              fontSize: '0.92rem',
              display: 'inline-flex',
              alignItems: 'center',
              gap: '0.35rem',
            }}
          >
            ← {t('forgotPassword.backToLogin', 'Back to Sign In')}
          </Link>
        </div>
      </div>
    </div>
  );
}
