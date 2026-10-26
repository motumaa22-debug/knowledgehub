import React, { useState, useEffect, useRef } from 'react';
import { Link, NavLink, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useLanguage } from '../i18n/LanguageContext';

/**
 * Navbar Component
 * Responsive navigation bar with hamburger mobile menu, multilingual language
 * switcher, Translation Studio, and authentication state indicators.
 */
export default function Navbar() {
  const { user, isAuthenticated, logout } = useAuth();
  const { language, setLanguage, t, supportedLanguages } = useLanguage();
  const [mobileOpen, setMobileOpen] = useState(false);
  const navRef = useRef(null);
  const location = useLocation();

  // Close mobile menu on route change
  useEffect(() => {
    setMobileOpen(false);
  }, [location.pathname]);

  // Close mobile menu when clicking outside
  useEffect(() => {
    function handleClickOutside(e) {
      if (navRef.current && !navRef.current.contains(e.target)) {
        setMobileOpen(false);
      }
    }
    if (mobileOpen) {
      document.addEventListener('mousedown', handleClickOutside);
      document.addEventListener('touchstart', handleClickOutside);
    }
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('touchstart', handleClickOutside);
    };
  }, [mobileOpen]);

  // Prevent body scroll when mobile nav is open
  useEffect(() => {
    if (mobileOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => { document.body.style.overflow = ''; };
  }, [mobileOpen]);

  const navLinkClass = ({ isActive }) => (isActive ? 'nav-link active' : 'nav-link');

  return (
    <header className="navbar" ref={navRef}>
      <div className="container navbar-container">
        {/* Brand */}
        <Link to="/" className="brand-link" onClick={() => setMobileOpen(false)}>
          <span>📚 KnowledgeHub</span>
          <span className="brand-badge">Library</span>
        </Link>

        {/* Desktop Nav Links */}
        <nav className="nav-desktop">
          <ul className="nav-links">
            <li><NavLink to="/" className={navLinkClass}>{t('nav.home', 'Home')}</NavLink></li>
            <li><NavLink to="/browse" className={navLinkClass}>{t('nav.browse', 'Browse Library')}</NavLink></li>
            <li><NavLink to="/translate" className={navLinkClass}>🌐 {t('nav.translate', 'Translate Studio')}</NavLink></li>
            <li><NavLink to="/submit" className={navLinkClass}>{t('nav.contribute', 'Contribute')}</NavLink></li>
            {isAuthenticated && (
              <>
                <li><NavLink to="/my-submissions" className={navLinkClass}>{t('nav.mySubmissions', 'My Submissions')}</NavLink></li>
                {user?.role === 'admin' && (
                  <li><NavLink to="/admin" className={navLinkClass}>🛡️ {t('nav.adminPanel', 'Admin Panel')}</NavLink></li>
                )}
              </>
            )}
          </ul>
        </nav>

        {/* Right-side controls: language + auth */}
        <div className="nav-auth-buttons">
          {/* Language Selector */}
          <div className="lang-selector-wrap">
            <select
              value={language}
              onChange={(e) => setLanguage(e.target.value)}
              aria-label="Language Selector"
              className="lang-select"
            >
              {supportedLanguages.map((l) => (
                <option key={l.code} value={l.code}>{l.flag} {l.native}</option>
              ))}
            </select>
          </div>

          {/* Auth buttons — hidden on mobile (shown in drawer) */}
          <div className="auth-btns-desktop">
            {isAuthenticated ? (
              <>
                <span className="nav-username">
                  {user?.role === 'admin' ? '🛡️' : '👤'} <strong>{user?.username || 'User'}</strong>
                </span>
                <button onClick={logout} className="btn btn-outline btn-sm">
                  {t('nav.logout', 'Sign Out')}
                </button>
              </>
            ) : (
              <>
                <Link to="/login" className="btn btn-outline btn-sm">{t('nav.login', 'Sign In')}</Link>
                <Link to="/register" className="btn btn-primary btn-sm">{t('nav.register', 'Join')}</Link>
              </>
            )}
          </div>

          {/* Hamburger button — visible on mobile only */}
          <button
            className={`hamburger${mobileOpen ? ' open' : ''}`}
            onClick={() => setMobileOpen((v) => !v)}
            aria-label={mobileOpen ? 'Close menu' : 'Open menu'}
            aria-expanded={mobileOpen}
          >
            <span className="ham-bar" />
            <span className="ham-bar" />
            <span className="ham-bar" />
          </button>
        </div>
      </div>

      {/* Mobile Drawer Overlay */}
      {mobileOpen && <div className="mobile-nav-overlay" onClick={() => setMobileOpen(false)} />}

      {/* Mobile Drawer */}
      <div className={`mobile-nav-drawer${mobileOpen ? ' open' : ''}`} aria-hidden={!mobileOpen}>
        <ul className="mobile-nav-links">
          <li><NavLink to="/" className={navLinkClass} onClick={() => setMobileOpen(false)}>{t('nav.home', 'Home')}</NavLink></li>
          <li><NavLink to="/browse" className={navLinkClass} onClick={() => setMobileOpen(false)}>{t('nav.browse', 'Browse Library')}</NavLink></li>
          <li><NavLink to="/translate" className={navLinkClass} onClick={() => setMobileOpen(false)}>🌐 {t('nav.translate', 'Translate Studio')}</NavLink></li>
          <li><NavLink to="/submit" className={navLinkClass} onClick={() => setMobileOpen(false)}>{t('nav.contribute', 'Contribute')}</NavLink></li>
          {isAuthenticated && (
            <>
              <li><NavLink to="/my-submissions" className={navLinkClass} onClick={() => setMobileOpen(false)}>{t('nav.mySubmissions', 'My Submissions')}</NavLink></li>
              {user?.role === 'admin' && (
                <li><NavLink to="/admin" className={navLinkClass} onClick={() => setMobileOpen(false)}>🛡️ {t('nav.adminPanel', 'Admin Panel')}</NavLink></li>
              )}
            </>
          )}
        </ul>

        <div className="mobile-nav-auth">
          {isAuthenticated ? (
            <>
              <span className="mobile-username">
                {user?.role === 'admin' ? '🛡️' : '👤'} <strong>{user?.username || 'User'}</strong>
              </span>
              <button onClick={() => { logout(); setMobileOpen(false); }} className="btn btn-outline" style={{ width: '100%' }}>
                {t('nav.logout', 'Sign Out')}
              </button>
            </>
          ) : (
            <div style={{ display: 'flex', gap: '0.75rem' }}>
              <Link to="/login" className="btn btn-outline" style={{ flex: 1, textAlign: 'center' }} onClick={() => setMobileOpen(false)}>{t('nav.login', 'Sign In')}</Link>
              <Link to="/register" className="btn btn-primary" style={{ flex: 1, textAlign: 'center' }} onClick={() => setMobileOpen(false)}>{t('nav.register', 'Join')}</Link>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
