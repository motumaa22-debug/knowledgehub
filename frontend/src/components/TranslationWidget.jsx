import React, { useState } from 'react';
import translationService from '../services/translationService';
import { useLanguage } from '../i18n/LanguageContext';

/**
 * TranslationWidget Component
 * In-reading real-time translation widget for library items
 */
export default function TranslationWidget({ originalText = '', initialSourceLang = 'auto' }) {
  const { t } = useLanguage();
  const [targetLang, setTargetLang] = useState('om');
  const [translatedText, setTranslatedText] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [showWidget, setShowWidget] = useState(false);

  const langNames = {
    om: '🌳 Afaan Oromoo',
    en: '🇬🇧 English',
    am: '🇪🇹 አማርኛ (Amharic)',
  };

  const handleTranslate = async (lang = targetLang) => {
    if (!originalText || !originalText.trim()) return;

    try {
      setLoading(true);
      setError('');
      setTargetLang(lang);
      const res = await translationService.translate(originalText, initialSourceLang, lang);
      if (res && res.translated_text) {
        setTranslatedText(res.translated_text);
      }
    } catch (err) {
      setError(err.message || 'Translation failed.');
    } finally {
      setLoading(false);
    }
  };

  if (!originalText) return null;

  return (
    <div
      style={{
        marginTop: '1.75rem',
        background: '#f8fafc',
        borderRadius: 'var(--radius-lg)',
        border: '1px solid var(--color-border)',
        padding: '1.25rem 1.5rem',
      }}
    >
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '0.75rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <span style={{ fontSize: '1.25rem' }}>🌐</span>
          <div>
            <div style={{ fontWeight: 700, fontSize: '0.95rem', color: 'var(--color-primary-dark)' }}>
              {t('reader.translateTitle', 'Translate this Work')}
            </div>
            <div style={{ fontSize: '0.82rem', color: 'var(--color-text-muted)' }}>
              {t('reader.translateSubtitle', 'Translate between Afaan Oromoo, English & Amharic in real time.')}
            </div>
          </div>
        </div>

        <button
          type="button"
          onClick={() => {
            if (!showWidget && !translatedText) {
              handleTranslate(targetLang);
            }
            setShowWidget(!showWidget);
          }}
          className="btn btn-outline"
          style={{ fontSize: '0.85rem', padding: '0.4rem 0.95rem', background: '#fff' }}
        >
          {showWidget ? '▲ Hide Translation' : '▼ Translate Text'}
        </button>
      </div>

      {showWidget && (
        <div style={{ marginTop: '1.25rem', paddingTop: '1.25rem', borderTop: '1px solid var(--color-border)' }}>
          {/* Language Selection Buttons */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1rem', flexWrap: 'wrap' }}>
            <span style={{ fontSize: '0.82rem', fontWeight: 600, color: 'var(--color-text-muted)' }}>
              Target Language:
            </span>
            {['om', 'en', 'am'].map((code) => (
              <button
                key={code}
                type="button"
                onClick={() => handleTranslate(code)}
                className={`btn ${targetLang === code ? 'btn-primary' : 'btn-outline'}`}
                style={{ fontSize: '0.8rem', padding: '0.3rem 0.8rem', borderRadius: 'var(--radius-full)' }}
              >
                {langNames[code]}
              </button>
            ))}
          </div>

          {error && (
            <div style={{ color: '#991b1b', fontSize: '0.85rem', marginBottom: '0.75rem' }}>
              {error}
            </div>
          )}

          {/* Translation Result Box */}
          <div
            style={{
              background: '#ffffff',
              padding: '1.25rem 1.5rem',
              borderRadius: 'var(--radius-md)',
              border: '1px solid var(--color-border)',
              fontFamily: 'var(--font-reading)',
              fontSize: '1.15rem',
              lineHeight: 1.7,
              color: 'var(--color-primary-dark)',
              minHeight: '80px',
            }}
          >
            {loading ? (
              <div style={{ color: 'var(--color-primary-light)', fontStyle: 'italic', fontSize: '0.95rem' }}>
                ⏳ {t('reader.translating', 'Translating into')} {langNames[targetLang]}...
              </div>
            ) : translatedText ? (
              translatedText
            ) : (
              <div style={{ color: '#94a3b8', fontSize: '0.92rem' }}>
                Select a target language above to see instant translation.
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
