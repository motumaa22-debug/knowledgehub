import React, { useState, useEffect } from 'react';
import contentService from '../services/contentService';
import api, { API_BASE_URL } from '../services/api';

/**
 * AdminDashboard Page
 * Comprehensive Administrator Moderation Center with detailed contributor dossiers,
 * file inspection tools, submission timing, and live review status controls.
 */
export default function AdminDashboard() {
  const [activeTab, setActiveTab] = useState('pending'); // 'pending' | 'approved' | 'rejected' | 'all'
  const [items, setItems] = useState([]);
  const [stats, setStats] = useState({ pending: 0, approved: 0, rejected: 0, total: 0 });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [actionSuccess, setActionSuccess] = useState('');
  const [adminNotes, setAdminNotes] = useState({});

  const API_BASE = API_BASE_URL;
  const backendRoot = API_BASE.replace(/\/api\/?$/, '');

  const loadSubmissions = async (status = activeTab) => {
    try {
      setLoading(true);
      setError('');
      const res = await api.get(`/admin/pending.php?status=${status}`);

      if (res && res.data) {
        setItems(res.data);
        if (res.stats) {
          setStats(res.stats);
        }
      } else {
        setItems([]);
      }
    } catch (err) {
      setError(err.message || 'Failed to load submissions queue.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadSubmissions(activeTab);
  }, [activeTab]);

  const handleAction = async (id, action) => {
    const note = adminNotes[id] !== undefined ? adminNotes[id] : '';
    try {
      await contentService.moderateSubmission(id, action, note);
      setActionSuccess(`Submission #${id} was successfully ${action}d!`);
      setTimeout(() => setActionSuccess(''), 4500);
      loadSubmissions(activeTab);
    } catch (err) {
      alert(`Moderation failed: ${err.message}`);
    }
  };

  const handleNoteChange = (id, text) => {
    setAdminNotes((prev) => ({ ...prev, [id]: text }));
  };

  return (
    <div className="container page-container">
      {/* Page Header */}
      <div style={{ marginBottom: '2.5rem' }}>
        <span className="hero-pill" style={{ background: '#eff6ff', color: 'var(--color-primary)', borderColor: '#bfdbfe', marginBottom: '0.75rem' }}>
          🛡️ Moderation Operations
        </span>
        <h1 className="section-title">Administrator Review Panel</h1>
        <p className="section-subtitle">
          Review community contributions with full contributor identity, submission timestamps, format specifications, and inspection tools.
        </p>
      </div>

      {actionSuccess && (
        <div style={{ background: '#dcfce7', color: '#166534', padding: '1rem 1.5rem', borderRadius: 'var(--radius-md)', marginBottom: '1.75rem', fontWeight: 600, border: '1px solid #bbf7d0' }}>
          ✓ {actionSuccess}
        </div>
      )}

      {error && (
        <div style={{ background: '#fee2e2', color: '#991b1b', padding: '1rem 1.5rem', borderRadius: 'var(--radius-md)', marginBottom: '1.75rem', border: '1px solid #fecaca' }}>
          {error}
        </div>
      )}

      {/* Metrics Row */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(230px, 1fr))', gap: '1.25rem', marginBottom: '2.5rem' }}>
        <div
          onClick={() => setActiveTab('pending')}
          className="stat-card"
          style={{ cursor: 'pointer', border: activeTab === 'pending' ? '2px solid var(--color-gold)' : undefined }}
        >
          <div className="stat-icon" style={{ background: '#fef3c7', color: '#b45309' }}>
            ⏳
          </div>
          <div>
            <div className="stat-number" style={{ color: 'var(--color-gold)' }}>{stats.pending}</div>
            <div className="stat-label">Pending Review</div>
          </div>
        </div>

        <div
          onClick={() => setActiveTab('approved')}
          className="stat-card"
          style={{ cursor: 'pointer', border: activeTab === 'approved' ? '2px solid var(--color-emerald)' : undefined }}
        >
          <div className="stat-icon" style={{ background: '#ecfdf5', color: '#047857' }}>
            ✓
          </div>
          <div>
            <div className="stat-number" style={{ color: 'var(--color-emerald)' }}>{stats.approved}</div>
            <div className="stat-label">Approved &amp; Live</div>
          </div>
        </div>

        <div
          onClick={() => setActiveTab('rejected')}
          className="stat-card"
          style={{ cursor: 'pointer', border: activeTab === 'rejected' ? '2px solid var(--color-error)' : undefined }}
        >
          <div className="stat-icon" style={{ background: '#fee2e2', color: '#991b1b' }}>
            ✕
          </div>
          <div>
            <div className="stat-number" style={{ color: 'var(--color-error)' }}>{stats.rejected}</div>
            <div className="stat-label">Rejected Works</div>
          </div>
        </div>

        <div
          onClick={() => setActiveTab('all')}
          className="stat-card"
          style={{ cursor: 'pointer', border: activeTab === 'all' ? '2px solid var(--color-primary)' : undefined }}
        >
          <div className="stat-icon" style={{ background: 'var(--color-primary-subtle)', color: 'var(--color-primary)' }}>
            📁
          </div>
          <div>
            <div className="stat-number">{stats.total}</div>
            <div className="stat-label">Total Submissions</div>
          </div>
        </div>
      </div>

      {/* Queue Filter Tabs */}
      <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '1.75rem', borderBottom: '1px solid var(--color-border)', paddingBottom: '0.75rem', flexWrap: 'wrap' }}>
        <button
          onClick={() => setActiveTab('pending')}
          className={`btn ${activeTab === 'pending' ? 'btn-primary' : 'btn-outline'}`}
          style={{ fontSize: '0.88rem', padding: '0.45rem 1.1rem' }}
        >
          ⏳ Pending Queue ({stats.pending})
        </button>
        <button
          onClick={() => setActiveTab('approved')}
          className={`btn ${activeTab === 'approved' ? 'btn-primary' : 'btn-outline'}`}
          style={{ fontSize: '0.88rem', padding: '0.45rem 1.1rem' }}
        >
          ✓ Published Catalog ({stats.approved})
        </button>
        <button
          onClick={() => setActiveTab('rejected')}
          className={`btn ${activeTab === 'rejected' ? 'btn-primary' : 'btn-outline'}`}
          style={{ fontSize: '0.88rem', padding: '0.45rem 1.1rem' }}
        >
          ✕ Rejected ({stats.rejected})
        </button>
        <button
          onClick={() => setActiveTab('all')}
          className={`btn ${activeTab === 'all' ? 'btn-primary' : 'btn-outline'}`}
          style={{ fontSize: '0.88rem', padding: '0.45rem 1.1rem' }}
        >
          📁 All History ({stats.total})
        </button>

        <button
          onClick={() => loadSubmissions(activeTab)}
          className="btn btn-outline"
          style={{ marginLeft: 'auto', fontSize: '0.85rem', padding: '0.45rem 0.9rem' }}
        >
          🔄 Refresh List
        </button>
      </div>

      {/* Queue Items List */}
      {loading ? (
        <div className="placeholder-box">
          <p>Loading submission queue from database...</p>
        </div>
      ) : items.length === 0 ? (
        <div className="placeholder-box">
          <span style={{ fontSize: '2.5rem', display: 'block', marginBottom: '0.5rem' }}>✨</span>
          <h3>No Items in this Queue</h3>
          <p>There are currently no items matching the "{activeTab}" filter.</p>
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
          {items.map((item) => {
            const isPdf = item.content_type === 'pdf';
            const fileUrl = item.file_path ? `${backendRoot}/${item.file_path}` : null;
            const c = item.contributor || {};

            return (
              <div
                key={item.id}
                style={{
                  background: '#ffffff',
                  borderRadius: 'var(--radius-xl)',
                  border: '1px solid var(--color-border)',
                  boxShadow: 'var(--shadow-md)',
                  padding: '2.25rem',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '1.5rem',
                }}
              >
                {/* Header: Title, Category, and Status */}
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '1rem', borderBottom: '1px solid var(--color-border-subtle)', paddingBottom: '1.25rem' }}>
                  <div>
                    <div style={{ display: 'flex', gap: '0.65rem', alignItems: 'center', marginBottom: '0.5rem', flexWrap: 'wrap' }}>
                      <span className={`content-badge ${isPdf ? 'badge-pdf' : 'badge-text'}`}>
                        {isPdf ? '📄 PDF Document' : '✍️ Direct Text'}
                      </span>
                      <span style={{ background: 'var(--color-bg-alt)', color: 'var(--color-primary-dark)', fontSize: '0.82rem', fontWeight: 700, padding: '0.25rem 0.75rem', borderRadius: 'var(--radius-full)' }}>
                        {item.category_name}
                      </span>
                      <span style={{ fontSize: '0.82rem', color: 'var(--color-text-muted)' }}>
                        Submission #{item.id}
                      </span>
                    </div>

                    <h2 style={{ fontFamily: 'var(--font-serif)', fontSize: '1.65rem', color: 'var(--color-primary-dark)', margin: '0.25rem 0' }}>
                      {item.title}
                    </h2>
                    <div style={{ color: 'var(--color-text-muted)', fontSize: '0.92rem' }}>
                      Original Author / Attribution: <strong>{item.author_name || 'Traditional / Unknown'}</strong>
                    </div>
                  </div>

                  <div style={{ textAlign: 'right' }}>
                    <span
                      style={{
                        display: 'inline-block',
                        padding: '0.35rem 0.85rem',
                        borderRadius: 'var(--radius-full)',
                        fontSize: '0.82rem',
                        fontWeight: 700,
                        background:
                          item.status === 'approved'
                            ? '#ecfdf5'
                            : item.status === 'rejected'
                            ? '#fee2e2'
                            : '#fef3c7',
                        color:
                          item.status === 'approved'
                            ? '#047857'
                            : item.status === 'rejected'
                            ? '#991b1b'
                            : '#92400e',
                      }}
                    >
                      {item.status === 'approved'
                        ? '✓ Published Live'
                        : item.status === 'rejected'
                        ? '✕ Rejected'
                        : '⏳ Pending Approval'}
                    </span>
                    <div style={{ fontSize: '0.8rem', color: 'var(--color-text-light)', marginTop: '0.35rem' }}>
                      🕒 {item.created_at_formatted} ({item.time_ago})
                    </div>
                  </div>
                </div>

                {/* 2-Column Info Grid: Contributor Dossier & Technical Specs */}
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '1.25rem' }}>
                  {/* Contributor Dossier */}
                  <div style={{ background: 'var(--color-bg-alt)', padding: '1.25rem', borderRadius: 'var(--radius-lg)', border: '1px solid var(--color-border)' }}>
                    <div style={{ fontSize: '0.82rem', fontWeight: 700, textTransform: 'uppercase', color: 'var(--color-primary)', letterSpacing: '0.05em', marginBottom: '0.65rem' }}>
                      👤 Contributor Identity Dossier
                    </div>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.45rem', fontSize: '0.9rem' }}>
                      <div>
                        <strong>Username:</strong> {c.username || 'Anonymous'} (User #{c.id})
                      </div>
                      <div>
                        <strong>Email Address:</strong> <a href={`mailto:${c.email}`} style={{ color: 'var(--color-primary-light)' }}>{c.email || 'N/A'}</a>
                      </div>
                      <div>
                        <strong>Account Role:</strong> <span style={{ textTransform: 'uppercase', fontSize: '0.78rem', fontWeight: 700, background: '#fff', padding: '0.15rem 0.5rem', borderRadius: '4px', border: '1px solid #cbd5e1' }}>{c.role || 'user'}</span>
                        <span style={{ marginLeft: '0.75rem', color: 'var(--color-text-muted)' }}>Member since {c.member_since || 'Recent'}</span>
                      </div>
                      <div style={{ marginTop: '0.35rem', paddingTop: '0.5rem', borderTop: '1px solid var(--color-border)' }}>
                        <strong>Contributor Reputation:</strong>
                        <div style={{ color: 'var(--color-emerald)', fontWeight: 600, fontSize: '0.85rem', marginTop: '0.2rem' }}>
                          🏆 {c.trust_badge} ({c.approved_count} approved / {c.total_submissions} total)
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Format & File Technical Specs */}
                  <div style={{ background: 'var(--color-bg-alt)', padding: '1.25rem', borderRadius: 'var(--radius-lg)', border: '1px solid var(--color-border)' }}>
                    <div style={{ fontSize: '0.82rem', fontWeight: 700, textTransform: 'uppercase', color: 'var(--color-gold)', letterSpacing: '0.05em', marginBottom: '0.65rem' }}>
                      📊 Format &amp; Technical Specifications
                    </div>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.45rem', fontSize: '0.9rem' }}>
                      <div>
                        <strong>Content Format:</strong> {isPdf ? '📄 PDF Document (Protected Storage)' : '✍️ Direct Text Entry'}
                      </div>
                      {isPdf ? (
                        <>
                          <div>
                            <strong>File Name:</strong> <code>{item.file_name || 'N/A'}</code>
                          </div>
                          <div>
                            <strong>File Size on Disk:</strong> {item.file_size || 'Unknown size'} {item.file_exists ? '✅ (Verified on Server)' : '⚠️ (File missing)'}
                          </div>
                          {fileUrl && (
                            <div style={{ marginTop: '0.5rem', display: 'flex', gap: '0.75rem' }}>
                              <a href={fileUrl} target="_blank" rel="noopener noreferrer" className="btn btn-outline" style={{ padding: '0.35rem 0.8rem', fontSize: '0.82rem', background: '#fff' }}>
                                🔍 Inspect PDF Document
                              </a>
                              <a href={fileUrl} download className="btn btn-outline" style={{ padding: '0.35rem 0.8rem', fontSize: '0.82rem', background: '#fff' }}>
                                📥 Download
                              </a>
                            </div>
                          )}
                        </>
                      ) : (
                        <>
                          <div>
                            <strong>Word Count:</strong> {item.word_count} words
                          </div>
                          <div>
                            <strong>Character Count:</strong> {item.char_count} characters
                          </div>
                          <div>
                            <strong>Reading Time Estimate:</strong> ~{Math.max(1, Math.ceil(item.word_count / 180))} min read
                          </div>
                        </>
                      )}
                    </div>
                  </div>
                </div>

                {/* Content / Text Preview */}
                {item.body_text && (
                  <div>
                    <div style={{ fontSize: '0.88rem', fontWeight: 700, color: 'var(--color-primary-dark)', marginBottom: '0.4rem' }}>
                      {isPdf ? 'Document Abstract / Overview:' : 'Submitted Text Content:'}
                    </div>
                    <div
                      style={{
                        background: 'var(--color-bg-parchment)',
                        padding: '1.25rem 1.5rem',
                        borderRadius: 'var(--radius-md)',
                        border: '1px solid #f1ece4',
                        fontFamily: 'var(--font-reading)',
                        fontSize: '1.05rem',
                        lineHeight: 1.7,
                        maxHeight: '220px',
                        overflowY: 'auto',
                        whiteSpace: 'pre-wrap',
                      }}
                    >
                      {item.body_text}
                    </div>
                  </div>
                )}

                {/* Admin Moderation Actions & Review Notes */}
                <div style={{ background: '#f8fafc', padding: '1.25rem', borderRadius: 'var(--radius-lg)', border: '1px solid var(--color-border)', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                  <div>
                    <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 700, color: 'var(--color-primary-dark)', marginBottom: '0.35rem' }}>
                      Administrative Review Feedback / Quality Notes:
                    </label>
                    <input
                      type="text"
                      value={adminNotes[item.id] !== undefined ? adminNotes[item.id] : (item.admin_notes || '')}
                      onChange={(e) => handleNoteChange(item.id, e.target.value)}
                      placeholder="e.g. Verified ancient proverb from Oromia; formatted stanzas; quality approved."
                      style={{ width: '100%', padding: '0.65rem 0.9rem', borderRadius: 'var(--radius-md)', border: '1px solid var(--color-border)', fontSize: '0.9rem' }}
                    />
                  </div>

                  <div style={{ display: 'flex', gap: '1rem', justifyContent: 'flex-end', flexWrap: 'wrap' }}>
                    {item.status !== 'pending' && (
                      <button
                        onClick={() => handleAction(item.id, 'pending')}
                        className="btn btn-outline"
                        style={{ color: 'var(--color-primary)', borderColor: 'var(--color-primary-light)', padding: '0.65rem 1.25rem', fontSize: '0.92rem' }}
                      >
                        ↩️ Reopen / Move to Pending
                      </button>
                    )}
                    {item.status !== 'approved' && (
                      <button
                        onClick={() => handleAction(item.id, 'approve')}
                        className="btn btn-primary"
                        style={{ backgroundColor: 'var(--color-emerald)', padding: '0.65rem 1.5rem', fontSize: '0.92rem' }}
                      >
                        ✓ Approve &amp; Publish to Library
                      </button>
                    )}
                    {item.status !== 'rejected' && (
                      <button
                        onClick={() => handleAction(item.id, 'reject')}
                        className="btn btn-outline"
                        style={{ color: 'var(--color-error)', borderColor: '#fca5a5', padding: '0.65rem 1.25rem', fontSize: '0.92rem' }}
                      >
                        ✕ Reject Entry
                      </button>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
