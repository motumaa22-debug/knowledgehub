import React, { useState, useEffect } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import SearchBar from '../components/SearchBar';
import ContentCard from '../components/ContentCard';
import contentService from '../services/contentService';
import { useLanguage } from '../i18n/LanguageContext';
import { useAuth } from '../context/AuthContext';

/**
 * BrowseLibrary Page
 * Filters and searches live digital library resources with multilingual labels.
 */
export default function BrowseLibrary() {
  const { t } = useLanguage();
  const { isAuthenticated } = useAuth();
  const [searchParams, setSearchParams] = useSearchParams();
  const selectedCategory = searchParams.get('category') || 'all';
  const initialSearch = searchParams.get('search') || '';

  const DEFAULT_CATEGORIES = [
    { id: 1, name: 'Books (PDF)', slug: 'books' },
    { id: 2, name: 'Traditional Proverbs', slug: 'proverbs' },
    { id: 3, name: 'Poems', slug: 'poems' },
    { id: 4, name: 'Fiction & Short Stories', slug: 'fiction' },
  ];

  const [activeTab, setActiveTab] = useState(selectedCategory);
  const [searchTerm, setSearchTerm] = useState(initialSearch);
  const [categories, setCategories] = useState(DEFAULT_CATEGORIES);
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // Sync state with URL params
  useEffect(() => {
    setActiveTab(searchParams.get('category') || 'all');
    setSearchTerm(searchParams.get('search') || '');
  }, [searchParams]);

  // Load Categories once
  useEffect(() => {
    async function fetchCategories() {
      try {
        const res = await contentService.getCategories();
        if (res && res.data) {
          setCategories(res.data);
        }
      } catch (err) {
        console.error('Failed to load categories:', err);
      }
    }
    fetchCategories();
  }, []);

  // Fetch Items on filter change
  useEffect(() => {
    async function fetchFilteredContents() {
      try {
        setLoading(true);
        setError('');
        const params = {};
        if (activeTab && activeTab !== 'all') {
          params.category = activeTab;
        }
        if (searchTerm && searchTerm.trim()) {
          params.search = searchTerm.trim();
        }

        const res = await contentService.getContents(params);
        if (res && res.data) {
          setItems(res.data);
        } else {
          setItems([]);
        }
      } catch (err) {
        console.error('Failed to load catalog items:', err);
        setError(err.message || 'Could not connect to database API.');
        setItems([]);
      } finally {
        setLoading(false);
      }
    }

    fetchFilteredContents();
  }, [activeTab, searchTerm]);

  const handleTabChange = (slug) => {
    setActiveTab(slug);
    const newParams = new URLSearchParams(searchParams);
    if (slug === 'all') {
      newParams.delete('category');
    } else {
      newParams.set('category', slug);
    }
    setSearchParams(newParams);
  };

  const handleSearch = (term) => {
    setSearchTerm(term);
    const newParams = new URLSearchParams(searchParams);
    if (term && term.trim()) {
      newParams.set('search', term.trim());
    } else {
      newParams.delete('search');
    }
    setSearchParams(newParams);
  };

  const handleClearFilters = () => {
    setActiveTab('all');
    setSearchTerm('');
    setSearchParams({});
  };

  return (
    <div className="container page-container">
      <div style={{ marginBottom: '2rem' }}>
        <h1 className="section-title">{t('nav.browse', 'Digital Library Catalog')}</h1>
        <p style={{ color: 'var(--color-text-muted)' }}>
          {t('hero.subtitle', 'Explore published digital books, traditional proverbs, lyrical poems, and short stories.')}
        </p>
      </div>

      {!isAuthenticated && (
        <div
          style={{
            background: 'var(--color-primary-subtle)',
            border: '1px solid var(--color-border)',
            borderRadius: 'var(--radius-lg)',
            padding: '1rem 1.25rem',
            marginBottom: '1.75rem',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            flexWrap: 'wrap',
            gap: '1rem',
          }}
        >
          <div style={{ fontSize: '0.92rem', color: 'var(--color-primary-dark)', maxWidth: '700px' }}>
            {t('membership.guestBannerNotice', '💡 Browsing is open to all visitors. Sign in or register to read full publications, access archives, and download PDFs.')}
          </div>
          <div style={{ display: 'flex', gap: '0.5rem' }}>
            <Link to="/login" className="btn btn-outline" style={{ fontSize: '0.82rem', padding: '0.4rem 0.9rem', background: '#fff' }}>
              {t('nav.login', 'Sign In')}
            </Link>
            <Link to="/register" className="btn btn-primary" style={{ fontSize: '0.82rem', padding: '0.4rem 0.9rem' }}>
              {t('nav.register', 'Register')}
            </Link>
          </div>
        </div>
      )}

      <SearchBar onSearch={handleSearch} placeholder={t('search.placeholder', 'Search by title, author, or keyword...')} />

      {/* Category Filter Tabs */}
      <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap', margin: '1.5rem 0 2rem 0' }}>
        <button
          onClick={() => handleTabChange('all')}
          className={`btn ${activeTab === 'all' ? 'btn-primary' : 'btn-outline'}`}
          style={{ fontSize: '0.88rem', padding: '0.45rem 1rem' }}
        >
          {t('search.allCategories', 'All Resources')} {items.length > 0 && activeTab === 'all' ? `(${items.length})` : ''}
        </button>

        {categories.map((cat) => (
          <button
            key={cat.id || cat.slug}
            onClick={() => handleTabChange(cat.slug)}
            className={`btn ${activeTab === cat.slug ? 'btn-primary' : 'btn-outline'}`}
            style={{ fontSize: '0.88rem', padding: '0.45rem 1rem' }}
          >
            {cat.name} {cat.content_count ? `(${cat.content_count})` : ''}
          </button>
        ))}
      </div>

      {error && (
        <div style={{ background: '#fee2e2', color: '#991b1b', padding: '1rem', borderRadius: 'var(--radius-md)', marginBottom: '1.5rem' }}>
          <strong>Error loading library works:</strong> {error}
        </div>
      )}

      {loading ? (
        <div className="placeholder-box">
          <p>Loading catalog items from database...</p>
        </div>
      ) : items.length === 0 ? (
        <div className="placeholder-box">
          <h2>{t('search.noItemsFound', 'No matching items found')}</h2>
          <p>
            {searchTerm || activeTab !== 'all'
              ? t('search.tryRefining', 'Try refining your search terms or selecting a different category.')
              : 'There are currently no published works in this section.'}
          </p>
          {(searchTerm || activeTab !== 'all') && (
            <button onClick={handleClearFilters} className="btn btn-primary" style={{ marginTop: '1rem' }}>
              {t('search.clearBtn', 'Clear All Filters')}
            </button>
          )}
        </div>
      ) : (
        <div className="content-grid">
          {items.map((item) => (
            <ContentCard key={item.id} item={item} />
          ))}
        </div>
      )}
    </div>
  );
}
