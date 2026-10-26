import React, { useState, useEffect } from 'react';

/**
 * SearchBar Component
 * Search input allowing users to search books, proverbs, poems, and fiction.
 */
export default function SearchBar({ onSearch, placeholder = 'Search titles, authors, proverbs, or keywords...' }) {
  const [query, setQuery] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (onSearch) {
      onSearch(query);
    }
  };

  const handleClear = () => {
    setQuery('');
    if (onSearch) {
      onSearch('');
    }
  };

  return (
    <div className="search-container">
      <form className="search-form" onSubmit={handleSubmit}>
        <span style={{ display: 'flex', alignItems: 'center', paddingLeft: '1rem', fontSize: '1.2rem', color: 'var(--color-text-light)' }}>
          🔍
        </span>
        <input
          type="text"
          className="search-input"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder={placeholder}
          aria-label="Search library content"
        />
        {query && (
          <button
            type="button"
            onClick={handleClear}
            style={{ background: 'transparent', border: 'none', cursor: 'pointer', padding: '0 0.75rem', color: 'var(--color-text-muted)', fontSize: '1.1rem' }}
            title="Clear search"
          >
            ✕
          </button>
        )}
        <button type="submit" className="btn btn-primary" style={{ padding: '0.65rem 1.6rem', borderRadius: 'var(--radius-lg)' }}>
          Search
        </button>
      </form>
    </div>
  );
}
