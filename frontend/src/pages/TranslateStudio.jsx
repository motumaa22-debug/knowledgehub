import React, { useState, useEffect, useRef } from 'react';
import translationService from '../services/translationService';
import { useLanguage } from '../i18n/LanguageContext';

export default function TranslateStudio() {
  const { t, language: appLanguage } = useLanguage();

  const [sourceLang, setSourceLang] = useState('om'); // default from Afaan Oromoo
  const [targetLang, setTargetLang] = useState('en'); // to English
  const [inputText, setInputText] = useState('Beekumsi ifa');
  const [outputText, setOutputText] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [copied, setCopied] = useState(false);
  const [engineUsed, setEngineUsed] = useState('');

  // Sample cultural phrases to quickly try
  const samplePhrases = [
    {
      title: 'Mammaaksa Oromoo (Oromo Proverb)',
      text: 'Harka walqabatnaan gaara ce\'an.',
      from: 'om',
      to: 'en',
    },
    {
      title: 'Beekumsa (Oromo Proverb)',
      text: 'Beekumsi ifa, doofummaan dukkana.',
      from: 'om',
      to: 'am',
    },
    {
      title: 'ምሳሌያዊ አነጋገር (Amharic Proverb)',
      text: 'ድር ቢያብር አንበሳ ያስር።',
      from: 'am',
      to: 'om',
    },
    {
      title: 'ሰላምታ (Amharic Greeting)',
      text: 'ሰላም እና ጤና ለሁላችሁ ይሁን።',
      from: 'am',
      to: 'en',
    },
    {
      title: 'English Philosophical Wisdom',
      text: 'Knowledge is a light that illuminates every dark corner of human ignorance.',
      from: 'en',
      to: 'om',
    },
    {
      title: 'Ethiopian Unity Proverb',
      text: 'When we listen to each other with patience, peace builds lasting foundations.',
      from: 'en',
      to: 'am',
    },
  ];

  const handleTranslate = async (textToTranslate = inputText, sLang = sourceLang, tLang = targetLang) => {
    if (!textToTranslate || !textToTranslate.trim()) {
      setOutputText('');
      return;
    }

    try {
      setLoading(true);
      setError('');
      const res = await translationService.translate(textToTranslate, sLang, tLang);

      if (res && res.translated_text) {
        setOutputText(res.translated_text);
        setEngineUsed(res.engine || 'neural');
      } else {
        setOutputText('');
      }
    } catch (err) {
      setError(err.message || 'Translation request failed. Please check connection.');
    } finally {
      setLoading(false);
    }
  };

  // Perform translation on mount with initial phrase
  useEffect(() => {
    handleTranslate(inputText, sourceLang, targetLang);
  }, []);

  const handleSwap = () => {
    const prevSource = sourceLang;
    const prevTarget = targetLang;
    const prevOutput = outputText;

    setSourceLang(prevTarget);
    setTargetLang(prevSource);
    if (prevOutput) {
      setInputText(prevOutput);
      handleTranslate(prevOutput, prevTarget, prevSource);
    }
  };

  const handleCopy = () => {
    if (!outputText) return;
    navigator.clipboard.writeText(outputText);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  const handleSpeak = (text, lang) => {
    if (!('speechSynthesis' in window) || !text) return;
    window.speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(text);
    if (lang === 'en') utterance.lang = 'en-US';
    else if (lang === 'am') utterance.lang = 'am-ET';
    else if (lang === 'om') utterance.lang = 'om-ET';
    window.speechSynthesis.speak(utterance);
  };

  const loadSample = (sample) => {
    setSourceLang(sample.from);
    setTargetLang(sample.to);
    setInputText(sample.text);
    handleTranslate(sample.text, sample.from, sample.to);
  };

  const langNames = {
    en: 'English (🇬🇧)',
    om: 'Afaan Oromoo (🌳)',
    am: 'አማርኛ / Amharic (🇪🇹)',
  };

  return (
    <div className="container page-container">
      {/* Header */}
      <div style={{ textAlign: 'center', maxWidth: '850px', margin: '0 auto 2.5rem' }}>
        <span
          className="hero-pill"
          style={{
            background: '#ecfdf5',
            color: 'var(--color-emerald)',
            borderColor: '#a7f3d0',
            marginBottom: '0.85rem',
          }}
        >
          {t('translateStudio.badge', '🌐 Trilingual Translation Studio')}
        </span>
        <h1 className="section-title" style={{ fontSize: '2.5rem', marginBottom: '0.75rem' }}>
          {t('translateStudio.title', 'Afaan Oromoo • English • Amharic Translation')}
        </h1>
        <p className="section-subtitle">
          {t(
            'translateStudio.subtitle',
            'Translate literature, cultural proverbs, poems, and philosophical ideas seamlessly across all three languages.'
          )}
        </p>
      </div>

      {error && (
        <div
          style={{
            background: '#fee2e2',
            color: '#991b1b',
            padding: '1rem 1.5rem',
            borderRadius: 'var(--radius-md)',
            marginBottom: '1.5rem',
            border: '1px solid #fecaca',
            maxWidth: '960px',
            margin: '0 auto 1.5rem',
          }}
        >
          {error}
        </div>
      )}

      {/* Main Translation Workbench */}
      <div
        style={{
          background: '#ffffff',
          borderRadius: 'var(--radius-xl)',
          border: '1px solid var(--color-border)',
          boxShadow: 'var(--shadow-lg)',
          overflow: 'hidden',
          maxWidth: '1050px',
          margin: '0 auto 3rem',
        }}
      >
        {/* Language Control Toolbar */}
        <div
          style={{
            background: '#f8fafc',
            padding: '1rem 1.5rem',
            borderBottom: '1px solid var(--color-border)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            flexWrap: 'wrap',
            gap: '1rem',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', flex: 1, minWidth: '220px' }}>
            <span style={{ fontSize: '0.85rem', fontWeight: 700, color: 'var(--color-primary-dark)' }}>
              {t('translateStudio.sourceLang', 'From:')}
            </span>
            <div style={{ display: 'flex', gap: '0.35rem', flexWrap: 'wrap' }}>
              {['om', 'en', 'am'].map((code) => (
                <button
                  key={code}
                  type="button"
                  onClick={() => {
                    setSourceLang(code);
                    if (targetLang === code) {
                      setTargetLang(code === 'en' ? 'om' : 'en');
                    }
                  }}
                  className={`btn ${sourceLang === code ? 'btn-primary' : 'btn-outline'}`}
                  style={{
                    fontSize: '0.82rem',
                    padding: '0.35rem 0.8rem',
                    borderRadius: 'var(--radius-full)',
                  }}
                >
                  {langNames[code]}
                </button>
              ))}
            </div>
          </div>

          {/* Swap Button */}
          <button
            type="button"
            onClick={handleSwap}
            title={t('translateStudio.swapTooltip', 'Swap Languages')}
            className="btn btn-outline"
            style={{
              padding: '0.45rem 0.9rem',
              borderRadius: 'var(--radius-full)',
              background: '#ffffff',
              fontSize: '1rem',
              fontWeight: 700,
            }}
          >
            ⇄
          </button>

          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', flex: 1, minWidth: '220px', justifyContent: 'flex-end' }}>
            <span style={{ fontSize: '0.85rem', fontWeight: 700, color: 'var(--color-primary-dark)' }}>
              {t('translateStudio.targetLang', 'To:')}
            </span>
            <div style={{ display: 'flex', gap: '0.35rem', flexWrap: 'wrap' }}>
              {['en', 'om', 'am'].map((code) => (
                <button
                  key={code}
                  type="button"
                  onClick={() => {
                    setTargetLang(code);
                    if (sourceLang === code) {
                      setSourceLang(code === 'en' ? 'om' : 'en');
                    }
                  }}
                  className={`btn ${targetLang === code ? 'btn-primary' : 'btn-outline'}`}
                  style={{
                    fontSize: '0.82rem',
                    padding: '0.35rem 0.8rem',
                    borderRadius: 'var(--radius-full)',
                  }}
                >
                  {langNames[code]}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Translation Split Editor */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(min(280px, 100%), 1fr))',
            minHeight: '280px',
          }}
        >
          {/* Source Input Column */}
          <div
            style={{
              padding: '1.5rem',
              display: 'flex',
              flexDirection: 'column',
              borderRight: '1px solid var(--color-border)',
              background: '#ffffff',
            }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem', fontSize: '0.82rem', color: 'var(--color-text-muted)' }}>
              <span>{langNames[sourceLang]}</span>
              <span>{inputText.length} characters</span>
            </div>

            <textarea
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              placeholder={t('translateStudio.inputPlaceholder', 'Type or paste literature here to translate...')}
              style={{
                width: '100%',
                flex: 1,
                minHeight: '180px',
                border: 'none',
                outline: 'none',
                resize: 'none',
                fontFamily: 'var(--font-reading)',
                fontSize: '1.25rem',
                lineHeight: 1.7,
                color: 'var(--color-text)',
                padding: '0.25rem 0',
              }}
            />

            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '1rem', paddingTop: '0.75rem', borderTop: '1px solid var(--color-border-subtle)' }}>
              <div style={{ display: 'flex', gap: '0.5rem' }}>
                {inputText && (
                  <button
                    type="button"
                    onClick={() => setInputText('')}
                    className="btn btn-outline"
                    style={{ fontSize: '0.78rem', padding: '0.3rem 0.7rem' }}
                  >
                    ✕ {t('translateStudio.clearBtn', 'Clear')}
                  </button>
                )}
                {inputText && (
                  <button
                    type="button"
                    onClick={() => handleSpeak(inputText, sourceLang)}
                    className="btn btn-outline"
                    style={{ fontSize: '0.78rem', padding: '0.3rem 0.7rem' }}
                    title="Pronounce"
                  >
                    🔊 {t('translateStudio.listenBtn', 'Pronounce')}
                  </button>
                )}
              </div>

              <button
                type="button"
                onClick={() => handleTranslate(inputText, sourceLang, targetLang)}
                disabled={loading || !inputText.trim()}
                className="btn btn-primary"
                style={{ padding: '0.5rem 1.4rem', fontSize: '0.9rem' }}
              >
                {loading ? 'Translating...' : t('translateStudio.translateBtn', 'Translate Text')}
              </button>
            </div>
          </div>

          {/* Target Output Column */}
          <div
            style={{
              padding: '1.5rem',
              display: 'flex',
              flexDirection: 'column',
              background: 'var(--color-bg-alt)',
            }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem', fontSize: '0.82rem', color: 'var(--color-text-muted)' }}>
              <span>{langNames[targetLang]}</span>
              {engineUsed && (
                <span style={{ fontSize: '0.78rem', color: 'var(--color-emerald)', fontWeight: 600 }}>
                  ✓ {engineUsed.toUpperCase()} Neural Engine
                </span>
              )}
            </div>

            <div
              style={{
                flex: 1,
                minHeight: '180px',
                fontFamily: 'var(--font-reading)',
                fontSize: '1.25rem',
                lineHeight: 1.7,
                color: outputText ? 'var(--color-primary-dark)' : 'var(--color-text-light)',
                whiteSpace: 'pre-wrap',
                padding: '0.25rem 0',
              }}
            >
              {loading ? (
                <span style={{ color: 'var(--color-primary-light)', fontStyle: 'italic' }}>
                  ⏳ Translating across Afaan Oromoo, English &amp; Amharic...
                </span>
              ) : outputText ? (
                outputText
              ) : (
                <span style={{ color: '#94a3b8' }}>
                  {t('translateStudio.outputPlaceholder', 'Translation will appear here instantly...')}
                </span>
              )}
            </div>

            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.5rem', marginTop: '1rem', paddingTop: '0.75rem', borderTop: '1px solid var(--color-border-subtle)' }}>
              {outputText && (
                <>
                  <button
                    type="button"
                    onClick={() => handleSpeak(outputText, targetLang)}
                    className="btn btn-outline"
                    style={{ fontSize: '0.78rem', padding: '0.3rem 0.7rem', background: '#fff' }}
                    title="Pronounce"
                  >
                    🔊 {t('translateStudio.listenBtn', 'Pronounce')}
                  </button>
                  <button
                    type="button"
                    onClick={handleCopy}
                    className="btn btn-outline"
                    style={{ fontSize: '0.78rem', padding: '0.3rem 0.85rem', background: '#fff' }}
                  >
                    {copied ? `✓ ${t('translateStudio.copied', 'Copied!')}` : `📋 ${t('translateStudio.copyBtn', 'Copy')}`}
                  </button>
                </>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Cultural Phrasebook / Proverb Presets */}
      <div style={{ maxWidth: '1050px', margin: '0 auto' }}>
        <h3 style={{ fontFamily: 'var(--font-serif)', fontSize: '1.35rem', color: 'var(--color-primary-dark)', marginBottom: '1.25rem' }}>
          💡 {t('translateStudio.samplesTitle', 'Popular Cultural Phrases & Proverbs to Try:')}
        </h3>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(min(280px, 100%), 1fr))', gap: '1rem' }}>
          {samplePhrases.map((phrase, idx) => (
            <div
              key={idx}
              onClick={() => loadSample(phrase)}
              style={{
                background: '#ffffff',
                border: '1px solid var(--color-border)',
                borderRadius: 'var(--radius-lg)',
                padding: '1.1rem 1.25rem',
                cursor: 'pointer',
                transition: 'all 0.2s ease',
                boxShadow: 'var(--shadow-sm)',
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.borderColor = 'var(--color-gold)';
                e.currentTarget.style.transform = 'translateY(-2px)';
                e.currentTarget.style.boxShadow = 'var(--shadow-md)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.borderColor = 'var(--color-border)';
                e.currentTarget.style.transform = 'translateY(0)';
                e.currentTarget.style.boxShadow = 'var(--shadow-sm)';
              }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.4rem' }}>
                <span style={{ fontSize: '0.78rem', fontWeight: 700, color: 'var(--color-primary-light)', textTransform: 'uppercase' }}>
                  {phrase.title}
                </span>
                <span style={{ fontSize: '0.75rem', background: 'var(--color-bg-alt)', padding: '0.15rem 0.5rem', borderRadius: 'var(--radius-full)', fontWeight: 600 }}>
                  {phrase.from.toUpperCase()} ➔ {phrase.to.toUpperCase()}
                </span>
              </div>
              <p style={{ fontFamily: 'var(--font-reading)', fontSize: '1.05rem', margin: 0, color: 'var(--color-text)' }}>
                "{phrase.text}"
              </p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
