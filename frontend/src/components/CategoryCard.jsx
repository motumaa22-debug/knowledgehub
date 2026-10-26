import React from 'react';
import { Link } from 'react-router-dom';

/**
 * CategoryCard Component
 * Displays a knowledge category card (Books, Proverbs, Poems, Fiction).
 */
export default function CategoryCard({ title, description, icon, slug, count }) {
  return (
    <Link to={`/browse?category=${slug}`} className={`category-card category-card-${slug || ''}`}>
      <span className="category-card-watermark" aria-hidden="true">{icon}</span>
      <div className="category-icon-box">{icon}</div>
      <h3 className="category-name">{title}</h3>
      <p className="category-desc">{description}</p>
      <div className="category-footer">
        <span className="category-pill">
          {count !== undefined ? `${count} ${count === 1 ? 'Work' : 'Works'}` : 'Explore'}
        </span>
        <span className="category-arrow">Browse &rarr;</span>
      </div>
    </Link>
  );
}
