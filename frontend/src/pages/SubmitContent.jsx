import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import contentService from '../services/contentService';

/**
 * SubmitContent Page
 * Direct text input or PDF upload submitted to MySQL database with pending status.
 */
export default function SubmitContent() {
  const [contentType, setContentType] = useState('text'); // 'text' | 'pdf'
  const [title, setTitle] = useState('');
  const [categoryId, setCategoryId] = useState('');
  const [categories, setCategories] = useState([]);
  const [authorName, setAuthorName] = useState('');
  const [bodyText, setBodyText] = useState('');
  const [selectedFile, setSelectedFile] = useState(null);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const navigate = useNavigate();

  // Load real categories from API
  useEffect(() => {
    async function loadCategories() {
      try {
        const res = await contentService.getCategories();
        if (res && res.data && res.data.length > 0) {
          setCategories(res.data);
          // Default to books if pdf, or proverbs if text
          const defaultCat = res.data.find((c) => c.slug === 'proverbs') || res.data[0];
          setCategoryId(String(defaultCat.id));
        }
      } catch (err) {
        console.error('Failed to load categories:', err);
      }
    }
    loadCategories();
  }, []);

  // When switching modes, set appropriate category default
  const handleModeChange = (mode) => {
    setContentType(mode);
    if (mode === 'pdf') {
      const bookCat = categories.find((c) => c.slug === 'books');
      if (bookCat) setCategoryId(String(bookCat.id));
    } else {
      const textCat = categories.find((c) => c.slug === 'proverbs') || categories[0];
      if (textCat) setCategoryId(String(textCat.id));
    }
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (file.type !== 'application/pdf' && !file.name.toLowerCase().endsWith('.pdf')) {
        alert('Only PDF documents are supported for upload.');
        e.target.value = null;
        setSelectedFile(null);
        return;
      }
      setSelectedFile(file);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!title.trim()) {
      setError('Title is required.');
      return;
    }
    if (!categoryId) {
      setError('Please choose a category.');
      return;
    }

    try {
      setError('');
      setSubmitting(true);

      let uploadedFilePath = null;

      // If PDF mode, upload file first
      if (contentType === 'pdf') {
        if (!selectedFile) {
          setError('Please select a PDF file to upload.');
          setSubmitting(false);
          return;
        }

        const formData = new FormData();
        formData.append('file', selectedFile);

        const uploadRes = await contentService.uploadPdf(formData);
        if (!uploadRes || !uploadRes.file_path) {
          throw new Error(uploadRes?.message || 'File upload failed.');
        }
        uploadedFilePath = uploadRes.file_path;
      }

      // Submit content record to API
      const payload = {
        title: title.trim(),
        category_id: Number(categoryId),
        content_type: contentType,
        author_name: authorName.trim() || undefined,
        body_text: bodyText.trim() || undefined,
        file_path: uploadedFilePath,
      };

      await contentService.createContent(payload);
      setSubmitted(true);
      setTimeout(() => {
        navigate('/my-submissions');
      }, 1500);
    } catch (err) {
      setError(err.message || 'Submission failed. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="container page-container" style={{ maxWidth: '800px' }}>
      <div style={{ background: '#ffffff', padding: '3rem', borderRadius: 'var(--radius-xl)', border: '1px solid var(--color-border)', boxShadow: 'var(--shadow-lg)' }}>
        <div style={{ textAlign: 'center', marginBottom: '2.5rem' }}>
          <span style={{ fontSize: '2.5rem', display: 'block', marginBottom: '0.5rem' }}>✍️</span>
          <h1 style={{ fontFamily: 'var(--font-serif)', fontSize: '2.2rem', color: 'var(--color-primary-dark)', marginBottom: '0.5rem' }}>
            Contribute to KnowledgeHub
          </h1>
          <p style={{ color: 'var(--color-text-muted)', fontSize: '1rem', maxWidth: '540px', margin: '0 auto' }}>
            Submit books in PDF format, traditional proverbs, lyrical poems, or short stories. All entries are reviewed by administrators before public display.
          </p>
        </div>

        {error && (
          <div style={{ background: '#fee2e2', color: '#991b1b', padding: '1rem', borderRadius: 'var(--radius-md)', marginBottom: '1.75rem', fontSize: '0.92rem', border: '1px solid #fecaca' }}>
            {error}
          </div>
        )}

        {submitted ? (
          <div style={{ background: '#ecfdf5', color: '#065f46', padding: '2.5rem', borderRadius: 'var(--radius-lg)', textAlign: 'center', border: '1px solid #a7f3d0' }}>
            <span style={{ fontSize: '3rem', display: 'block', marginBottom: '0.75rem' }}>🎉</span>
            <h3 style={{ fontFamily: 'var(--font-serif)', fontSize: '1.6rem', marginBottom: '0.5rem' }}>Contribution Received!</h3>
            <p style={{ color: '#047857', maxWidth: '480px', margin: '0 auto' }}>
              Your submission has been safely saved in the moderation queue for review. Redirecting to your submissions dashboard...
            </p>
          </div>
        ) : (
          <form onSubmit={handleSubmit}>
            {/* Contribution Mode Segmented Control */}
            <div style={{ marginBottom: '2rem' }}>
              <label style={{ display: 'block', fontSize: '0.92rem', fontWeight: 700, marginBottom: '0.65rem', color: 'var(--color-primary-dark)' }}>
                1. Select Submission Type
              </label>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                <button
                  type="button"
                  className={`btn ${contentType === 'text' ? 'btn-primary' : 'btn-outline'}`}
                  onClick={() => handleModeChange('text')}
                  style={{ padding: '0.9rem', fontSize: '1rem' }}
                >
                  ✍️ Direct Text Entry (Proverb/Poem/Story)
                </button>
                <button
                  type="button"
                  className={`btn ${contentType === 'pdf' ? 'btn-primary' : 'btn-outline'}`}
                  onClick={() => handleModeChange('pdf')}
                  style={{ padding: '0.9rem', fontSize: '1rem' }}
                >
                  📄 Upload PDF Book (.pdf)
                </button>
              </div>
            </div>

            {/* Title */}
            <div style={{ marginBottom: '1.5rem' }}>
              <label style={{ display: 'block', fontSize: '0.92rem', fontWeight: 700, marginBottom: '0.45rem', color: 'var(--color-primary-dark)' }}>
                2. Title or Proverb Heading <span style={{ color: 'var(--color-error)' }}>*</span>
              </label>
              <input
                type="text"
                required
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder={contentType === 'pdf' ? 'e.g. Introduction to Algorithmic Thinking' : 'e.g. When spiders unite, they can tie down a lion'}
                style={{ width: '100%', padding: '0.85rem 1.1rem', borderRadius: 'var(--radius-md)', border: '1px solid var(--color-border)', outline: 'none', fontSize: '1rem' }}
              />
            </div>

            {/* Category & Author Row */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.25rem', marginBottom: '1.5rem' }}>
              <div>
                <label style={{ display: 'block', fontSize: '0.92rem', fontWeight: 700, marginBottom: '0.45rem', color: 'var(--color-primary-dark)' }}>
                  3. Library Category <span style={{ color: 'var(--color-error)' }}>*</span>
                </label>
                <select
                  value={categoryId}
                  onChange={(e) => setCategoryId(e.target.value)}
                  style={{ width: '100%', padding: '0.85rem 1rem', borderRadius: 'var(--radius-md)', border: '1px solid var(--color-border)', background: '#fff', fontSize: '0.95rem' }}
                >
                  {categories.map((c) => (
                    <option key={c.id} value={c.id}>
                      {c.name}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '0.92rem', fontWeight: 700, marginBottom: '0.45rem', color: 'var(--color-primary-dark)' }}>
                  4. Author / Attribution (Optional)
                </label>
                <input
                  type="text"
                  value={authorName}
                  onChange={(e) => setAuthorName(e.target.value)}
                  placeholder="e.g. Traditional, or Writer Name"
                  style={{ width: '100%', padding: '0.85rem 1.1rem', borderRadius: 'var(--radius-md)', border: '1px solid var(--color-border)', outline: 'none', fontSize: '1rem' }}
                />
              </div>
            </div>

            {/* Text vs PDF Conditional Upload Box */}
            {contentType === 'text' ? (
              <div style={{ marginBottom: '2rem' }}>
                <label style={{ display: 'block', fontSize: '0.92rem', fontWeight: 700, marginBottom: '0.45rem', color: 'var(--color-primary-dark)' }}>
                  5. Full Text Content &amp; Explanation <span style={{ color: 'var(--color-error)' }}>*</span>
                </label>
                <textarea
                  rows="8"
                  required
                  value={bodyText}
                  onChange={(e) => setBodyText(e.target.value)}
                  placeholder="Type or paste the complete proverb, poetry verses, or short story narrative here..."
                  style={{ width: '100%', padding: '1rem', borderRadius: 'var(--radius-md)', border: '1px solid var(--color-border)', outline: 'none', resize: 'vertical', fontSize: '1rem', lineHeight: 1.6 }}
                />
              </div>
            ) : (
              <div style={{ marginBottom: '2rem' }}>
                <label style={{ display: 'block', fontSize: '0.92rem', fontWeight: 700, marginBottom: '0.45rem', color: 'var(--color-primary-dark)' }}>
                  5. Upload PDF Document (Max 25MB) <span style={{ color: 'var(--color-error)' }}>*</span>
                </label>
                <div style={{ border: '2px dashed #93c5fd', borderRadius: 'var(--radius-lg)', padding: '2rem', textAlign: 'center', background: '#eff6ff', marginBottom: '1.25rem' }}>
                  <span style={{ fontSize: '2.5rem', display: 'block', marginBottom: '0.5rem' }}>📄</span>
                  <input
                    type="file"
                    required
                    accept="application/pdf"
                    onChange={handleFileChange}
                    style={{ fontSize: '0.95rem' }}
                  />
                  {selectedFile && (
                    <div style={{ marginTop: '0.75rem', fontWeight: 600, color: 'var(--color-primary)' }}>
                      Selected: {selectedFile.name} ({(selectedFile.size / 1024 / 1024).toFixed(2)} MB)
                    </div>
                  )}
                  <p style={{ marginTop: '0.5rem', fontSize: '0.82rem', color: 'var(--color-text-muted)' }}>
                    🔒 Document will be validated and placed into secure server-side storage.
                  </p>
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: '0.92rem', fontWeight: 700, marginBottom: '0.45rem', color: 'var(--color-primary-dark)' }}>
                    Book Abstract / Overview (Optional)
                  </label>
                  <textarea
                    rows="3"
                    value={bodyText}
                    onChange={(e) => setBodyText(e.target.value)}
                    placeholder="Brief description of the book topics, chapters, and audience..."
                    style={{ width: '100%', padding: '0.85rem 1rem', borderRadius: 'var(--radius-md)', border: '1px solid var(--color-border)', outline: 'none', fontSize: '0.95rem' }}
                  />
                </div>
              </div>
            )}

            <button
              type="submit"
              disabled={submitting}
              className="btn btn-accent"
              style={{ width: '100%', padding: '1rem', fontSize: '1.05rem', borderRadius: 'var(--radius-md)' }}
            >
              {submitting ? 'Submitting to Review Queue...' : '🚀 Submit for Administrative Review'}
            </button>
          </form>
        )}
      </div>
    </div>
  );
}
