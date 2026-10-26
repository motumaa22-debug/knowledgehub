import React from 'react';
import { Link } from 'react-router-dom';
import { useLanguage } from '../i18n/LanguageContext';

/**
 * Footer Component
 * Library information, multilingual categories, and translation links.
 */
export default function Footer() {
  const { t } = useLanguage();

  return (
    <footer className="footer">
      <div className="container footer-grid">
        <div className="footer-brand">
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem', marginBottom: '1rem' }}>
            <span style={{ fontSize: '1.75rem' }}>📚</span>
            <h3 style={{ margin: 0 }}>KnowledgeHub</h3>
          </div>
          <p>
            {t(
              'footer.tagline',
              'An open community digital archive dedicated to discovering, preserving, and sharing literature, traditional proverbs, lyrical poetry, and digital books across Afaan Oromoo, English, and Amharic.'
            )}
          </p>
          <div style={{ marginTop: '1.5rem', display: 'flex', gap: '0.75rem', flexWrap: 'wrap' }}>
            <span style={{ background: 'rgba(255,255,255,0.08)', padding: '0.35rem 0.75rem', borderRadius: 'var(--radius-full)', fontSize: '0.78rem', color: '#cbd5e1' }}>
              🌐 Trilingual Translation
            </span>
            <span style={{ background: 'rgba(255,255,255,0.08)', padding: '0.35rem 0.75rem', borderRadius: 'var(--radius-full)', fontSize: '0.78rem', color: '#cbd5e1' }}>
              🔒 Protected Storage
            </span>
            <span style={{ background: 'rgba(255,255,255,0.08)', padding: '0.35rem 0.75rem', borderRadius: 'var(--radius-full)', fontSize: '0.78rem', color: '#cbd5e1' }}>
              🛡️ Moderated Archive
            </span>
          </div>
        </div>

        <div className="footer-links">
          <h4>Knowledge Domains</h4>
          <ul>
            <li><Link to="/browse?category=books">📖 Books in PDF</Link></li>
            <li><Link to="/browse?category=proverbs">💬 Traditional Proverbs</Link></li>
            <li><Link to="/browse?category=poems">✒️ Poetry &amp; Verses</Link></li>
            <li><Link to="/browse?category=fiction">🎭 Fiction &amp; Stories</Link></li>
          </ul>
        </div>

        <div className="footer-links">
          <h4>Platform Access</h4>
          <ul>
            <li><Link to="/browse">Browse Library Catalog</Link></li>
            <li><Link to="/translate">🌐 Translate Studio</Link></li>
            <li><Link to="/submit">Contribute / Upload Work</Link></li>
            <li><Link to="/login">Contributor Sign In</Link></li>
            <li><Link to="/register">Create Contributor Profile</Link></li>
          </ul>
        </div>
      </div>

      <div className="container footer-bottom">
        <p>&copy; {new Date().getFullYear()} KnowledgeHub — Digital Knowledge Library (Afaan Oromoo • English • አማርኛ).</p>
      </div>
    </footer>
  );
}
