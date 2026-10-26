import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import contentService from '../services/contentService';

/**
 * MySubmissions Page
 * Lists the authenticated contributor's real submissions from the MySQL database.
 */
export default function MySubmissions() {
  const [submissions, setSubmissions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    async function loadSubmissions() {
      try {
        setLoading(true);
        setError('');
        const res = await contentService.getMySubmissions();
        if (res && res.data) {
          setSubmissions(res.data);
        } else {
          setSubmissions([]);
        }
      } catch (err) {
        setError(err.message || 'Failed to load your submissions.');
      } finally {
        setLoading(false);
      }
    }

    loadSubmissions();
  }, []);

  const approvedCount = submissions.filter((s) => s.status === 'approved').length;
  const pendingCount = submissions.filter((s) => s.status === 'pending').length;

  const getStatusBadge = (status) => {
    switch (status) {
      case 'approved':
        return (
          <span style={{ background: '#ecfdf5', color: '#047857', border: '1px solid #a7f3d0', padding: '0.3rem 0.75rem', borderRadius: 'var(--radius-full)', fontSize: '0.8rem', fontWeight: 700 }}>
            ✓ Published
          </span>
        );
      case 'rejected':
        return (
          <span style={{ background: '#fee2e2', color: '#991b1b', border: '1px solid #fecaca', padding: '0.3rem 0.75rem', borderRadius: 'var(--radius-full)', fontSize: '0.8rem', fontWeight: 700 }}>
            ✕ Rejected
          </span>
        );
      default:
        return (
          <span style={{ background: '#fef3c7', color: '#92400e', border: '1px solid #fde68a', padding: '0.3rem 0.75rem', borderRadius: 'var(--radius-full)', fontSize: '0.8rem', fontWeight: 700 }}>
            ⏳ In Review
          </span>
        );
    }
  };

  return (
    <div className="container page-container">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2.5rem', flexWrap: 'wrap', gap: '1rem' }}>
        <div>
          <h1 className="section-title">My Contributions Dashboard</h1>
          <p className="section-subtitle">
            Track the editorial review status of your submitted digital books, poetry, and traditional sayings.
          </p>
        </div>
        <Link to="/submit" className="btn btn-primary" style={{ padding: '0.75rem 1.5rem' }}>
          + Submit New Work
        </Link>
      </div>

      {/* Summary Metrics */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '1.25rem', marginBottom: '2.5rem' }}>
        <div className="stat-card">
          <div className="stat-icon" style={{ background: 'var(--color-primary-subtle)', color: 'var(--color-primary)' }}>
            📑
          </div>
          <div>
            <div className="stat-number">{submissions.length}</div>
            <div className="stat-label">Total Submissions</div>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon" style={{ background: '#ecfdf5', color: '#047857' }}>
            ✓
          </div>
          <div>
            <div className="stat-number" style={{ color: 'var(--color-emerald)' }}>{approvedCount}</div>
            <div className="stat-label">Approved &amp; Live</div>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon" style={{ background: '#fef3c7', color: '#b45309' }}>
            ⏳
          </div>
          <div>
            <div className="stat-number" style={{ color: 'var(--color-gold)' }}>{pendingCount}</div>
            <div className="stat-label">Awaiting Review</div>
          </div>
        </div>
      </div>

      {error && (
        <div style={{ background: '#fee2e2', color: '#991b1b', padding: '1rem', borderRadius: 'var(--radius-md)', marginBottom: '1.5rem', border: '1px solid #fecaca' }}>
          {error}
        </div>
      )}

      {loading ? (
        <div className="placeholder-box">
          <p>Loading your submission history from the database...</p>
        </div>
      ) : submissions.length === 0 ? (
        <div className="placeholder-box">
          <span style={{ fontSize: '3rem', display: 'block', marginBottom: '0.75rem' }}>✍️</span>
          <h3>No Contributions Yet</h3>
          <p>You haven't submitted any library works yet. Share a book, poem, or proverb today!</p>
          <Link to="/submit" className="btn btn-primary" style={{ marginTop: '0.5rem' }}>
            Submit Your First Contribution
          </Link>
        </div>
      ) : (
        <div style={{ background: '#ffffff', borderRadius: 'var(--radius-xl)', border: '1px solid var(--color-border)', boxShadow: 'var(--shadow-sm)', overflow: 'hidden' }}>
          <div style={{ padding: '1.5rem 2rem', borderBottom: '1px solid var(--color-border-subtle)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <h3 style={{ fontFamily: 'var(--font-serif)', fontSize: '1.3rem', color: 'var(--color-primary-dark)' }}>
              Contribution History
            </h3>
            <span style={{ fontSize: '0.85rem', color: 'var(--color-text-muted)' }}>
              Showing {submissions.length} {submissions.length === 1 ? 'item' : 'items'}
            </span>
          </div>

          <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '0.93rem' }}>
            <thead>
              <tr style={{ background: 'var(--color-bg-alt)', borderBottom: '1px solid var(--color-border)' }}>
                <th style={{ padding: '1.1rem 1.75rem', fontWeight: 700, color: 'var(--color-text-body)' }}>Work Title</th>
                <th style={{ padding: '1.1rem', fontWeight: 700, color: 'var(--color-text-body)' }}>Domain</th>
                <th style={{ padding: '1.1rem', fontWeight: 700, color: 'var(--color-text-body)' }}>Format</th>
                <th style={{ padding: '1.1rem', fontWeight: 700, color: 'var(--color-text-body)' }}>Submission Date</th>
                <th style={{ padding: '1.1rem', fontWeight: 700, color: 'var(--color-text-body)' }}>Review Status</th>
                <th style={{ padding: '1.1rem 1.75rem', fontWeight: 700, color: 'var(--color-text-body)' }}>Actions / Notes</th>
              </tr>
            </thead>
            <tbody>
              {submissions.map((sub) => (
                <tr key={sub.id} style={{ borderBottom: '1px solid var(--color-border-subtle)' }}>
                  <td style={{ padding: '1.25rem 1.75rem', fontWeight: 700, color: 'var(--color-primary-dark)' }}>
                    {sub.title}
                  </td>
                  <td style={{ padding: '1.25rem 1.1rem' }}>
                    <span style={{ background: 'var(--color-bg-alt)', padding: '0.25rem 0.65rem', borderRadius: 'var(--radius-sm)', fontSize: '0.82rem', fontWeight: 600 }}>
                      {sub.category_name || 'General'}
                    </span>
                  </td>
                  <td style={{ padding: '1.25rem 1.1rem' }}>
                    {sub.content_type === 'pdf' ? '📄 PDF Document' : '✍️ Direct Text'}
                  </td>
                  <td style={{ padding: '1.25rem 1.1rem', color: 'var(--color-text-muted)' }}>
                    {sub.created_at ? new Date(sub.created_at).toLocaleDateString(undefined, { year: 'numeric', month: 'short', day: 'numeric' }) : 'Recent'}
                  </td>
                  <td style={{ padding: '1.25rem 1.1rem' }}>
                    {getStatusBadge(sub.status)}
                  </td>
                  <td style={{ padding: '1.25rem 1.75rem' }}>
                    {sub.status === 'approved' ? (
                      <Link to={`/content/${sub.id}`} style={{ fontWeight: 600, color: 'var(--color-primary-light)' }}>
                        View in Library &rarr;
                      </Link>
                    ) : (
                      <span style={{ fontSize: '0.85rem', color: 'var(--color-text-muted)' }}>
                        {sub.admin_notes || 'Under review'}
                      </span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
