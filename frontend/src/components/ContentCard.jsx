import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useLanguage } from '../i18n/LanguageContext';

/**
 * ContentCard Component — Premium Magazine Card
 * Rich visual design with cover band, watermark icon, hover animations,
 * and member access awareness.
 */
export default function ContentCard({ item }) {
  const { isAuthenticated } = useAuth();
  const { t } = useLanguage();

  if (!item) return null;

  const isPdf = item.content_type === 'pdf';
  const categorySlug = item.category_slug || '';

  // Per-type visual identity
  let coverClass  = 'cover-text';
  let badgeClass  = 'badge-text';
  let badgeLabel  = '✍️ Text';
  let watermark   = '📝';
  let ctaClass    = 'content-card-cta-outline';
  let ctaLabel    = isAuthenticated
    ? `📖 ${t('reader.viewOriginal', 'Read Full Text')} →`
    : `🔒 ${t('membership.signInToRead', 'Member Access')} →`;

  if (isPdf) {
    coverClass = 'cover-pdf';
    badgeClass = 'badge-pdf';
    badgeLabel = '📄 PDF Book';
    watermark  = '📚';
    ctaClass   = isAuthenticated ? 'content-card-cta-primary' : 'content-card-cta-member';
    ctaLabel   = isAuthenticated
      ? `📥 ${t('reader.downloadPdf', 'Open / Download PDF')}`
      : `🔒 ${t('membership.signInToRead', 'Member Access')} →`;
  } else if (categorySlug === 'poems') {
    coverClass = 'cover-poem';
    badgeClass = 'badge-poem';
    badgeLabel = '✒️ Poetry';
    watermark  = '🪶';
  } else if (categorySlug === 'fiction') {
    coverClass = 'cover-fiction';
    badgeClass = 'badge-fiction';
    badgeLabel = '🎭 Fiction';
    watermark  = '🌿';
  } else if (categorySlug === 'proverbs') {
    coverClass = 'cover-proverb';
    badgeClass = 'badge-text';
    badgeLabel = '💬 Proverb';
    watermark  = '🌻';
  }

  if (!isAuthenticated) {
    ctaClass = 'content-card-cta-member';
  }

  // Format date nicely
  const formattedDate = item.created_at
    ? new Date(item.created_at).toLocaleDateString(undefined, { year: 'numeric', month: 'short', day: 'numeric' })
    : 'Recent';

  return (
    <article className="content-card">
      {/* Colour cover band at top */}
      <div className={`content-card-cover ${coverClass}`} />

      {/* Ghost watermark icon */}
      <span className="content-card-watermark" aria-hidden="true">{watermark}</span>

      <div className="content-card-inner">
        {/* Header row: badge + category */}
        <div className="content-card-header">
          <span className={`content-badge ${badgeClass}`}>{badgeLabel}</span>
          <span style={{ fontSize: '0.78rem', color: 'var(--color-primary-light)', fontWeight: 700, letterSpacing: '0.02em' }}>
            {item.category_name}
          </span>
        </div>

        {/* Title */}
        <h3 className="content-card-title">{item.title}</h3>

        {/* Excerpt */}
        <p className="content-excerpt">
          {item.excerpt || (item.body_text ? item.body_text.slice(0, 160) + '…' : 'Available in the library collection.')}
        </p>

        {/* Meta row */}
        <div className="content-card-meta">
          <span className="content-card-meta-author">
            {item.author_name || 'Traditional'}
          </span>
          <span style={{ display: 'flex', alignItems: 'center', gap: '0.3rem', fontSize: '0.78rem' }}>
            🗓 {formattedDate}
          </span>
        </div>

        {/* CTA Button */}
        <Link
          to={`/content/${item.id}`}
          state={{ from: { pathname: `/content/${item.id}` } }}
          className={`content-card-cta ${ctaClass}`}
        >
          {ctaLabel}
        </Link>
      </div>
    </article>
  );
}
