import React, { useState, useEffect } from 'react';
import { useParams, Link, useLocation } from 'react-router-dom';
import contentService from '../services/contentService';
import TranslationWidget from '../components/TranslationWidget';
import { useLanguage } from '../i18n/LanguageContext';
import { useAuth } from '../context/AuthContext';

/**
 * ContentDetails Page
 * Premium editorial reader layout with member-authenticated PDF download, full text view,
 * and integrated Afaan Oromoo / English / Amharic translation widget.
 */
export default function ContentDetails() {
  const { id } = useParams();
  const { t } = useLanguage();
  const { token, isAuthenticated } = useAuth();
  const location = useLocation();

  const [item, setItem] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [isAuthError, setIsAuthError] = useState(false);
  const [copied, setCopied] = useState(false);

  const API_BASE = import.meta.env.VITE_API_BASE_URL || 'http://localhost/knowledgehub/backend/api';

  useEffect(() => {
    async function loadContent() {
      try {
        setLoading(true);
        setError('');
        setIsAuthError(false);
        const res = await contentService.getContentDetails(id);
        if (res && res.data) {
          setItem(res.data);
        } else {
          setError('Content item not found.');
        }
      } catch (err) {
        const msg = err.message || 'Failed to load content details.';
        setError(msg);
        if (msg.toLowerCase().includes('member') || msg.toLowerCase().includes('register') || msg.toLowerCase().includes('auth')) {
          setIsAuthError(true);
        }
      } finally {
        setLoading(false);
      }
    }

    if (id) {
      loadContent();
    }
  }, [id, token]);

  const handleCopy = () => {
    if (item?.body_text) {
      navigator.clipboard.writeText(`${item.title}\nBy ${item.author_name}\n\n${item.body_text}`);
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    }
  };

  if (loading) {
    return (
      <div className="container page-container">
        <div className="placeholder-box">
          <p>Loading document from digital archives...</p>
        </div>
      </div>
    );
  }

  // Member Registration Gate if not authenticated
  if (isAuthError || (!isAuthenticated && !item)) {
    return (
      <div className="container page-container" style={{ maxWidth: '640px' }}>
        <Link to="/browse" style={{ display: 'inline-block', marginBottom: '1.5rem', fontWeight: 600, color: 'var(--color-primary-light)' }}>
          {t('reader.backToLibrary', '← Back to Library Catalog')}
        </Link>
        <div
          style={{
            background: '#ffffff',
            borderRadius: 'var(--radius-xl)',
            border: '1px solid var(--color-border)',
            boxShadow: 'var(--shadow-xl)',
            padding: '3rem 2.5rem',
            textAlign: 'center',
          }}
        >
          <div
            style={{
              width: '76px',
              height: '76px',
              borderRadius: '50%',
              background: '#fef3c7',
              color: '#d97706',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '2.4rem',
              margin: '0 auto 1.5rem',
            }}
          >
            🔒
          </div>

          <span className="content-badge badge-pdf" style={{ marginBottom: '0.75rem', display: 'inline-block' }}>
            {t('membership.requiredBadge', '🔒 Members Only')}
          </span>

          <h1 style={{ fontFamily: 'var(--font-serif)', fontSize: '1.85rem', color: 'var(--color-primary-dark)', margin: '0.5rem 0' }}>
            {t('membership.accessRequiredTitle', 'Member Registration Required')}
          </h1>

          <p style={{ color: 'var(--color-text-muted)', fontSize: '0.98rem', lineHeight: 1.6, margin: '1rem 0 2rem 0' }}>
            {t('membership.accessRequiredMsg', 'To protect intellectual property and community literature, full document reading and PDF downloads are exclusively reserved for registered members.')}
          </p>

          <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center', flexWrap: 'wrap' }}>
            <Link
              to="/login"
              state={{ from: location }}
              className="btn btn-primary"
              style={{ padding: '0.85rem 1.75rem', fontSize: '1rem' }}
            >
              {t('membership.signInToRead', 'Sign In to Access')}
            </Link>
            <Link
              to="/register"
              state={{ from: location }}
              className="btn btn-outline"
              style={{ padding: '0.85rem 1.75rem', fontSize: '1rem' }}
            >
              {t('membership.registerFree', 'Register for Free →')}
            </Link>
          </div>
        </div>
      </div>
    );
  }

  if (error || !item) {
    return (
      <div className="container page-container">
        <Link to="/browse" style={{ display: 'inline-block', marginBottom: '1.5rem', fontWeight: 600 }}>
          {t('reader.backToLibrary', '← Back to Catalog')}
        </Link>
        <div className="placeholder-box">
          <h2>Item Not Found</h2>
          <p>{error || 'The requested library work does not exist or has not been published.'}</p>
        </div>
      </div>
    );
  }

  const isPdf = item.content_type === 'pdf';
  const downloadUrl = `${API_BASE}/contents/download.php?id=${item.id}&token=${encodeURIComponent(token || '')}`;
  const inlineViewUrl = `${API_BASE}/contents/download.php?id=${item.id}&token=${encodeURIComponent(token || '')}&view=1`;

  const categorySlug = item.category_slug || '';
  let coverClass = 'cover-text';
  let readerIcon = '✍️';
  if (isPdf) { coverClass = 'cover-pdf'; readerIcon = '📚'; }
  else if (categorySlug === 'poems')   { coverClass = 'cover-poem';    readerIcon = '🪶'; }
  else if (categorySlug === 'fiction') { coverClass = 'cover-fiction';  readerIcon = '🎭'; }
  else if (categorySlug === 'proverbs'){ coverClass = 'cover-proverb'; readerIcon = '💬'; }

  const publishedDate = new Date(item.created_at).toLocaleDateString(undefined, {
    year: 'numeric', month: 'long', day: 'numeric',
  });

  return (
    <div className="container page-container">
      <div className="reader-wrapper">

        {/* Navigation bar above card */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem', flexWrap: 'wrap', gap: '0.75rem' }}>
          <Link to="/browse" style={{ display: 'inline-flex', alignItems: 'center', gap: '0.4rem', fontWeight: 600, color: 'var(--color-primary-light)', fontSize: '0.9rem' }}>
            ← {t('reader.backToLibrary', 'Back to Library')}
          </Link>
          {item.body_text && (
            <button
              onClick={handleCopy}
              className="btn btn-outline"
              style={{ fontSize: '0.82rem', padding: '0.4rem 0.9rem', gap: '0.35rem' }}
            >
              {copied ? '✓ Copied!' : '📋 Copy Text'}
            </button>
          )}
        </div>

        <article className="reader-card">
          {/* Animated colour band */}
          <div className={`content-card-cover reader-cover-band ${coverClass}`} style={{ height: '6px', borderRadius: 'var(--radius-xl) var(--radius-xl) 0 0' }} />

          {/* Ghost watermark */}
          <span
            aria-hidden="true"
            style={{
              position: 'absolute', top: '4.5rem', right: '2.5rem',
              fontSize: '7rem', lineHeight: 1,
              opacity: 0.04, pointerEvents: 'none', userSelect: 'none',
              fontFamily: 'serif',
            }}
          >
            {readerIcon}
          </span>

          <div className="reader-card-body">
            {/* Header */}
            <header className="reader-header">
              <div style={{ display: 'flex', gap: '0.65rem', alignItems: 'center', flexWrap: 'wrap', marginBottom: '0.85rem' }}>
                <span className={`content-badge ${isPdf ? 'badge-pdf' : categorySlug === 'poems' ? 'badge-poem' : categorySlug === 'fiction' ? 'badge-fiction' : 'badge-text'}`}>
                  {readerIcon} {isPdf ? 'PDF Book' : item.category_name}
                </span>
                <span style={{ color: 'var(--color-primary-light)', fontWeight: 700, fontSize: '0.84rem', letterSpacing: '0.03em' }}>
                  {item.category_name}
                </span>
              </div>

              <h1 className="reader-title">{item.title}</h1>

              <div className="reader-meta-bar">
                <span className="reader-meta-chip">
                  ✍️ {item.author_name || 'Traditional'}
                </span>
                {item.contributor_username && (
                  <span className="reader-meta-chip">
                    🗄️ {t('reader.contributedBy', 'Archived by')} <em style={{ fontStyle: 'normal', fontWeight: 700 }}>{item.contributor_username}</em>
                  </span>
                )}
                <span className="reader-meta-chip">
                  🗓 {publishedDate}
                </span>
              </div>
            </header>

            {/* PDF Download CTA */}
            {isPdf && (
              <div className="reader-pdf-cta">
                <div style={{ fontSize: '4rem', marginBottom: '0.75rem', lineHeight: 1, position: 'relative', zIndex: 1 }}>📑</div>

                <span className="content-badge badge-pdf" style={{ marginBottom: '1rem', display: 'inline-block', position: 'relative', zIndex: 1 }}>
                  🔒 {t('membership.requiredBadge', 'Members Only')} · Authenticated
                </span>

                <h3 style={{ fontFamily: 'var(--font-serif)', fontSize: '1.5rem', color: 'var(--color-primary-dark)', marginBottom: '0.6rem', position: 'relative', zIndex: 1 }}>
                  Complete Digital Book Document
                </h3>
                <p style={{ color: 'var(--color-text-muted)', maxWidth: '500px', margin: '0 auto 2rem auto', lineHeight: 1.65, position: 'relative', zIndex: 1 }}>
                  {t('reader.pdfNotice', 'This document is safely stored in the library. Read it directly in your browser or download it to your device.')}
                </p>

                {item.file_path ? (
                  <div style={{ display: 'flex', justifyContent: 'center', gap: '1rem', flexWrap: 'wrap', position: 'relative', zIndex: 1 }}>
                    <a
                      href={inlineViewUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="btn btn-primary"
                      style={{ padding: '0.85rem 2rem', fontSize: '1rem', borderRadius: 'var(--radius-md)', boxShadow: '0 6px 20px rgba(37,99,235,0.35)' }}
                    >
                      {t('reader.readPdf', '📖 Open in PDF Reader')}
                    </a>
                    <a
                      href={downloadUrl}
                      download
                      className="btn btn-outline"
                      style={{ padding: '0.85rem 1.75rem', fontSize: '1rem', borderRadius: 'var(--radius-md)' }}
                    >
                      {t('reader.downloadPdf', '📥 Download PDF')}
                    </a>
                  </div>
                ) : (
                  <p style={{ color: 'var(--color-text-muted)', position: 'relative', zIndex: 1 }}>PDF file reference unavailable.</p>
                )}
              </div>
            )}

            {/* Text body */}
            {item.body_text && (
              <div style={{ marginTop: '2.5rem' }}>
                <h3 style={{
                  fontFamily: 'var(--font-serif)',
                  fontSize: '1.25rem',
                  color: 'var(--color-primary-dark)',
                  marginBottom: '1.25rem',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.5rem',
                }}>
                  <span style={{ fontSize: '1rem' }}>{isPdf ? '📋' : '📖'}</span>
                  {isPdf ? 'Document Overview & Excerpt' : 'Reading Text'}
                </h3>

                <div className="reader-body">
                  {item.body_text}
                </div>

                {/* Translation widget */}
                <TranslationWidget originalText={item.body_text} />
              </div>
            )}
          </div>
        </article>
      </div>
    </div>
  );
}
