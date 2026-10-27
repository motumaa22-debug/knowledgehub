import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import SearchBar from '../components/SearchBar';
import CategoryCard from '../components/CategoryCard';
import ContentCard from '../components/ContentCard';
import contentService from '../services/contentService';
import { useLanguage } from '../i18n/LanguageContext';
import { useAuth } from '../context/AuthContext';

/**
 * KnowledgeHub Landing Page (Home.jsx) — Highly Aesthetic & Modernized
 * Features:
 * - Two-column atmospheric hero with ambient glowing orbs & live 3D codex preview card
 * - Floating search bar with interactive trending topic pills
 * - 4 core platform pillars with numbered gradient tags
 * - "How It Works" 3-step reader & contributor journey
 * - Cultural Wisdom Spotlight with direct Translate Studio integration
 * - Real-time categories & live archival works grid
 * - Community social proof & scholar testimonials with 5-star ratings
 * - Collapsible interactive FAQ accordion
 * - Atmospheric conversion CTA banner
 */
export default function Home() {
  const navigate = useNavigate();
  const { t, language } = useLanguage();
  const { isAuthenticated } = useAuth();

  // Instant default categories so landing page renders immediately without waiting
  const DEFAULT_CATEGORIES = [
    { id: 1, title: 'Books (PDF)', slug: 'books', icon: '📖', description: 'Digital books, historical manuscripts, textbooks, and documentation in PDF format.', count: 1 },
    { id: 2, title: 'Traditional Proverbs', slug: 'proverbs', icon: '💬', description: 'Cultural proverbs, ancestral wisdom, and folklore expressions passed across generations.', count: 1 },
    { id: 3, title: 'Poems', slug: 'poems', icon: '✒️', description: 'Original poetry, rhythmic verse, lyrical community compositions, and spoken word.', count: 1 },
    { id: 4, title: 'Fiction & Short Stories', slug: 'fiction', icon: '🎭', description: 'Creative fiction, short stories, folk narratives, and serialized tales.', count: 1 },
  ];

  const [categories, setCategories] = useState(DEFAULT_CATEGORIES);
  const [featuredItems, setFeaturedItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState(false);

  // FAQ Accordion State (0 is open by default)
  const [openFaq, setOpenFaq] = useState(0);

  const loadHomeData = async () => {
    try {
      setLoading(true);
      setLoadError(false);
      const [catRes, contentRes] = await Promise.all([
        contentService.getCategories().catch(() => null),
        contentService.getContents().catch(() => null),
      ]);

      if (catRes && catRes.data && catRes.data.length > 0) {
        const iconMap = {
          books: '📖',
          proverbs: '💬',
          poems: '✒️',
          fiction: '🎭',
        };

        const mappedCategories = catRes.data.map((c) => ({
          ...c,
          title: c.name,
          icon: iconMap[c.slug] || '📚',
          count: c.content_count !== undefined ? Number(c.content_count) : 0,
        }));
        setCategories(mappedCategories);
      }

      if (contentRes && contentRes.data && contentRes.data.length > 0) {
        setFeaturedItems(contentRes.data.slice(0, 6));
      } else if (!contentRes) {
        setLoadError(true);
      }
    } catch (err) {
      console.error('Failed to load landing page data:', err);
      setLoadError(true);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadHomeData();
  }, []);

  const handleSearch = (query) => {
    if (query && query.trim()) {
      navigate(`/browse?search=${encodeURIComponent(query.trim())}`);
    }
  };

  const handleQuickTopic = (topic) => {
    navigate(`/browse?search=${encodeURIComponent(topic)}`);
  };

  const totalWorks = categories.reduce((sum, c) => sum + (c.count || 0), 0);

  // Trending Topics for Quick Discovery
  const trendingTopics = [
    'Mammaaksa Oromoo',
    'Classical Walaloo',
    'Ancient Proverbs',
    'Digital Books (PDF)',
    'Ethiopian Philosophy',
    'Fiction Stories',
  ];

  // Cultural Wisdom Spotlight Quotes
  const wisdomQuotes = [
    {
      lang: 'Afaan Oromoo',
      flag: '🌳',
      original: 'Haati manaa fi bishaan qabbanaawaa nama hin quufsu.',
      meaning: 'A loving homemaker and pure cool water — one never tires of their blessing.',
      category: 'Proverb (Mammaaksa)',
      author: 'Oromo Traditional Wisdom',
    },
    {
      lang: 'English',
      flag: '🇬🇧',
      original: 'Knowledge is a sanctuary: preserved today so that tomorrow may read.',
      meaning: 'Human wisdom outlives empires through the written and translated word.',
      category: 'Literary Thought',
      author: 'KnowledgeHub Collective',
    },
    {
      lang: 'አማርኛ (Amharic)',
      flag: '🇪🇹',
      original: 'ዕውቀት ከወርቅ ይበልጣል፤ ጥበብም ከብር ትሻላለች።',
      meaning: 'Knowledge is more valuable than gold; wisdom is far better than silver.',
      category: 'Proverb (ምሳሌያዊ አነጋገር)',
      author: 'Ancient Ethiopian Wisdom',
    },
  ];

  // FAQ Items
  const faqItems = [
    {
      q: {
        en: 'Is KnowledgeHub free to use for reading and research?',
        om: 'KnowledgeHub fayyadamuun bilisummaan dubbisuu fi qorachuuf danda\'amaa?',
        am: 'KnowledgeHub ለማንበብ እና ለጥናት በነፃ መጠቀም ይቻላል?',
      },
      a: {
        en: 'Yes, 100%! All catalog searches, category browsing, full editorial text views, and PDF downloads are completely free for registered community members.',
        om: 'Eeyyee, dhibbeentaa 100% bilisa! Sakatta\'iinsi, dubbisuun fi kitaabota PDF buufachuun miseensota galmaa\'aniif bilisaan dhiyaata.',
        am: 'አዎ፣ 100% ነፃ ነው! ካታሎጉን ማሰስ፣ ሙሉ ጽሑፎችን ማንበብ እና PDF ማውረድ ለተመዘገቡ አባላት በሙሉ በነፃ የቀረበ ነው።',
      },
    },
    {
      q: {
        en: 'Why do I need to register to view full text and download PDF books?',
        om: 'Qabiyyee guutuu dubbisuu fi PDF buufachuuf maaliif galmaa\'uu na barbaachisa?',
        am: 'ሙሉ ጽሑፍ ለማንበብ እና PDF ለማውረድ መመዝገብ ለምን አስፈለገ?',
      },
      a: {
        en: 'Registration with email 4-digit OTP verification protects author intellectual property, prevents automated bot scraping, and ensures high-quality community archiving.',
        om: 'Galmeen fi mirkaneessi koodii lakkoofsa 4 mirga barreessitootaa eeguuf, seeraan alaa ittisuuf fi qulqullina kuusaa eeguuf gargaara.',
        am: 'በኢሜይል በሚላክ ባለ 4 ዲጂት ኮድ መመዝገብ የደራሲያንን መብት ለመጠበቅ፣ ቦቶች እንዳይሰርቁ ለመከላከል እና ጥራት ያለው ማህበረሰብ ለመገንባት ነው።',
      },
    },
    {
      q: {
        en: 'Which languages are supported on KnowledgeHub?',
        om: 'KnowledgeHub irratti afaanonni kamfa\'i deeggaramu?',
        am: 'በKnowledgeHub ላይ የትኞቹ ቋንቋዎች ይደገፋሉ?',
      },
      a: {
        en: 'KnowledgeHub natively supports Afaan Oromoo, English, and Amharic with full UI internationalization and a multi-engine neural Trilingual Translation Studio.',
        om: 'Afaan Oromoo, Ingiliffaa fi Amaaraa guutummaatti deeggara; hojii hiikkaa ammayyaa afaan sadeeniis of keessaa qaba.',
        am: 'አፋን ኦሮሞ፣ እንግሊዝኛ እና አማርኛን ሙሉ በሙሉ ይደግፋል፤ እንዲሁም የሦስትዮሽ የቀጥታ የትርጉም ማዕከል አለው።',
      },
    },
    {
      q: {
        en: 'How can I submit my own poetry, proverbs, or PDF books?',
        om: 'Walaloo, mammaaksa ykn kitaaba PDF koo akkamittan gumaachuu danda\'a?',
        am: 'የራሴን ግጥሞች፣ ምሳሌያዊ አነጋገሮች ወይም የPDF መጽሐፍ እንዴት ማበርከት እችላለሁ?',
      },
      a: {
        en: 'Simply register for a free contributor account, navigate to "Contribute", fill out the title and metadata, and upload your text or PDF. An administrator will review and publish it.',
        om: 'Herrega bilisaan banadhaa, gara "Gumaachi" deemaa, odeeffannoo barreeffama keessanii fi PDF fe\'aa. Bulchaan ilaalee ni mirkaneessa.',
        am: 'በቀላሉ ነፃ አካውንት ይክፈቱ፣ ወደ "አበርክት" ይሂዱ፣ የጽሑፉን መረጃ ይሙሉ እና ጽሑፉን ወይም PDF ይጫኑ። አስተዳዳሪው ገምግሞ ያትመዋል።',
      },
    },
    {
      q: {
        en: 'What if I forget my account password?',
        om: 'Jecha icchitii koo yoon irraanfadhe maalan godha?',
        am: 'የይለፍ ቃሌን ብረሳ ምን ማድረግ አለብኝ?',
      },
      a: {
        en: 'Click "Forgot Password?" on the Sign In page. Enter your email to receive a secure 4-digit reset code and immediately choose a new password.',
        om: 'Fuula seensaa irratti "Jecha Icchitii Irraanfattee?" kan jedhu cuqqaasaa. Koodiin lakkoofsa 4 imeelii keessaniitti ergamee jecha haaraa qopheessitu.',
        am: 'በመግቢያ ገጹ ላይ "የይለፍ ቃል ረሱ?" የሚለውን ይጫኑ። ኢሜይልዎን በማስገባት ባለ 4 ዲጂት ኮድ ተቀብለው አዲስ የይለፍ ቃል ማዘጋጀት ይችላሉ።',
      },
    },
  ];

  return (
    <div>
      {/* =========================================================================
          1. HERO SECTION (Atmospheric Two-Column Aesthetic Layout)
          ========================================================================= */}
      <section className="hero-section">
        {/* Ambient Glowing Orbs */}
        <div className="hero-orb-1" aria-hidden="true" />
        <div className="hero-orb-2" aria-hidden="true" />

        <div className="container">
          <div className="hero-layout">
            {/* Left Column: Headline, Value Proposition & Actions */}
            <div>
              <span className="hero-pill">
                <span className="hero-pulse-dot" />
                {t('landing.heroBadge', '✨ Heritage & Modern Knowledge Collective')}
              </span>

              <h1 className="hero-title">
                {t('landing.heroHeading', 'Empowering Heritage & Knowledge Through Trilingual Learning')}
              </h1>

              <p className="hero-subtitle">
                {t(
                  'landing.heroSubheading',
                  'Discover, read, and translate classical books, traditional proverbs, lyrical poetry, and literary fiction across Afaan Oromoo, English, and Amharic with verified community stewardship.'
                )}
              </p>

              {/* Primary & Secondary Call To Actions */}
              <div className="hero-actions">
                {!isAuthenticated ? (
                  <Link
                    to="/register"
                    className="btn btn-accent"
                    style={{ padding: '0.95rem 2.25rem', fontSize: '1.05rem', fontWeight: 700 }}
                  >
                    {t('landing.getStarted', 'Join for Free →')}
                  </Link>
                ) : (
                  <Link
                    to="/submit"
                    className="btn btn-accent"
                    style={{ padding: '0.95rem 2.25rem', fontSize: '1.05rem', fontWeight: 700 }}
                  >
                    + {t('hero.contributeBtn', 'Submit Literature')}
                  </Link>
                )}

                <Link
                  to="/browse"
                  className="btn btn-outline"
                  style={{
                    backgroundColor: 'rgba(255, 255, 255, 0.15)',
                    color: '#ffffff',
                    borderColor: 'rgba(255, 255, 255, 0.4)',
                    padding: '0.95rem 2rem',
                    fontSize: '1.05rem',
                  }}
                >
                  📖 {t('landing.exploreLibrary', 'Browse Catalog →')}
                </Link>

                <Link
                  to="/translate"
                  className="btn btn-outline"
                  style={{
                    backgroundColor: 'rgba(255, 255, 255, 0.08)',
                    color: '#ffffff',
                    borderColor: 'rgba(255, 255, 255, 0.25)',
                    padding: '0.95rem 1.85rem',
                    fontSize: '1.05rem',
                  }}
                >
                  🌐 {t('hero.translateBtn', 'Translate Studio')}
                </Link>
              </div>

              {/* Micro Trust Indicators */}
              <div style={{ display: 'flex', gap: '1.5rem', flexWrap: 'wrap', fontSize: '0.86rem', color: '#cbd5e1' }}>
                <span style={{ display: 'inline-flex', alignItems: 'center', gap: '0.4rem' }}>
                  ✓ 100% Free Access
                </span>
                <span style={{ display: 'inline-flex', alignItems: 'center', gap: '0.4rem' }}>
                  🔒 4-Digit Email OTP
                </span>
                <span style={{ display: 'inline-flex', alignItems: 'center', gap: '0.4rem' }}>
                  📄 Verified PDF Books
                </span>
              </div>
            </div>

            {/* Right Column: 3D Interactive Archive Codex Card */}
            <div>
              <div className="hero-visual-card">
                <div className="hero-card-header">
                  <span style={{ display: 'flex', alignItems: 'center', gap: '0.45rem', color: '#93c5fd' }}>
                    <span className="hero-pulse-dot" /> Live Trilingual Archive
                  </span>
                  <span style={{ background: 'rgba(255,255,255,0.1)', padding: '0.2rem 0.6rem', borderRadius: 'var(--radius-full)', fontSize: '0.74rem' }}>
                    Edition 2026
                  </span>
                </div>

                {/* Digital Book Mockup */}
                <div className="hero-digital-book">
                  <span className="hero-book-tag">📑 Verified Document Preview</span>
                  <h3 className="hero-book-title">
                    Seenaa fi Aadaa Oromoo (Oromo Heritage &amp; Wisdom)
                  </h3>
                  <p className="hero-book-excerpt">
                    "Knowledge preserved across generations bridges cultural memory, philosophical proverbs, and classical literature across Afaan Oromoo, English, and Amharic."
                  </p>
                </div>

                {/* Language Integration Chips */}
                <div className="hero-languages-chips">
                  <span className="hero-lang-chip">🌳 Afaan Oromoo</span>
                  <span className="hero-lang-chip">🇬🇧 English</span>
                  <span className="hero-lang-chip">🇪🇹 አማርኛ</span>
                </div>

                {/* Live Platform Metrics Mini Boxes */}
                <div className="hero-metric-boxes">
                  <div className="hero-mini-stat">
                    <div className="hero-mini-stat-num" style={{ color: 'var(--color-gold-light)' }}>
                      {totalWorks ? `${totalWorks}+` : '24+'}
                    </div>
                    <div className="hero-mini-stat-lbl">Archived Works</div>
                  </div>

                  <div className="hero-mini-stat">
                    <div className="hero-mini-stat-num" style={{ color: '#38bdf8' }}>
                      1,400+
                    </div>
                    <div className="hero-mini-stat-lbl">Active Scholars</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* =========================================================================
          2. FLOATING SEARCH BAR & QUICK TRENDING TOPICS
          ========================================================================= */}
      <div className="container">
        <SearchBar
          onSearch={handleSearch}
          placeholder={t('search.placeholder', 'Search books, proverbs, poems, or authors across all languages...')}
        />

        {/* Quick Trending Topics Pills */}
        <div className="trending-bar">
          <span style={{ fontWeight: 700, fontSize: '0.84rem', color: 'var(--color-primary-dark)' }}>
            🔥 Trending Topics:
          </span>
          {trendingTopics.map((topic, idx) => (
            <button
              key={idx}
              type="button"
              className="trending-pill"
              onClick={() => handleQuickTopic(topic)}
            >
              {topic}
            </button>
          ))}
        </div>
      </div>

      <main className="container main-content">
        {/* =========================================================================
            3. CORE PLATFORM PILLARS (Why KnowledgeHub?)
            ========================================================================= */}
        <section className="landing-section">
          <div className="landing-center-header">
            <span className="landing-pill">🏛️ {t('landing.pillarsTitle', 'Platform Capabilities')}</span>
            <h2 className="section-title" style={{ fontSize: '2.35rem' }}>
              {t('landing.pillarsTitle', 'Built for Cultural Preservation & Academic Excellence')}
            </h2>
            <p className="section-subtitle" style={{ fontSize: '1.05rem', marginTop: '0.5rem' }}>
              {t(
                'landing.pillarsSubtitle',
                'Explore the core technologies and features powering the KnowledgeHub digital ecosystem.'
              )}
            </p>
          </div>

          <div className="landing-features-grid">
            {/* Feature 1 */}
            <article className="landing-feature-card">
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1.25rem' }}>
                <div className="landing-feature-icon" style={{ background: '#eff6ff', color: '#1e3a8a', margin: 0 }}>
                  📑
                </div>
                <span style={{ fontSize: '0.85rem', fontWeight: 800, color: 'var(--color-primary-light)', fontFamily: 'monospace' }}>
                  01
                </span>
              </div>
              <h3 className="landing-feature-title">{t('landing.pillar1.title', 'Authenticated PDF Vault')}</h3>
              <p className="landing-feature-desc">
                {t(
                  'landing.pillar1.desc',
                  'Read and download high-resolution academic books, manuscripts, and reference guides protected by member-level authentication.'
                )}
              </p>
            </article>

            {/* Feature 2 */}
            <article className="landing-feature-card">
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1.25rem' }}>
                <div className="landing-feature-icon" style={{ background: '#ecfdf5', color: '#059669', margin: 0 }}>
                  🌐
                </div>
                <span style={{ fontSize: '0.85rem', fontWeight: 800, color: '#059669', fontFamily: 'monospace' }}>
                  02
                </span>
              </div>
              <h3 className="landing-feature-title">{t('landing.pillar2.title', 'Trilingual Neural Translation')}</h3>
              <p className="landing-feature-desc">
                {t(
                  'landing.pillar2.desc',
                  'Instantly bridge Afaan Oromoo, English, and Amharic with neural multi-engine translation adapted for cultural idioms and proverbs.'
                )}
              </p>
            </article>

            {/* Feature 3 */}
            <article className="landing-feature-card">
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1.25rem' }}>
                <div className="landing-feature-icon" style={{ background: '#fef3c7', color: '#d97706', margin: 0 }}>
                  🏺
                </div>
                <span style={{ fontSize: '0.85rem', fontWeight: 800, color: '#d97706', fontFamily: 'monospace' }}>
                  03
                </span>
              </div>
              <h3 className="landing-feature-title">{t('landing.pillar3.title', 'Indigenous Wisdom Archives')}</h3>
              <p className="landing-feature-desc">
                {t(
                  'landing.pillar3.desc',
                  'Safeguard oral traditions, Oromo proverbs (Mammaaksa), Amharic proverbs, and classical poetic verse for future generations.'
                )}
              </p>
            </article>

            {/* Feature 4 */}
            <article className="landing-feature-card">
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1.25rem' }}>
                <div className="landing-feature-icon" style={{ background: '#f5f3ff', color: '#7c3aed', margin: 0 }}>
                  ✍️
                </div>
                <span style={{ fontSize: '0.85rem', fontWeight: 800, color: '#7c3aed', fontFamily: 'monospace' }}>
                  04
                </span>
              </div>
              <h3 className="landing-feature-title">{t('landing.pillar4.title', 'Community Editorial Review')}</h3>
              <p className="landing-feature-desc">
                {t(
                  'landing.pillar4.desc',
                  'Contribute literature, upload research, and participate in peer-reviewed community publishing with email verification.'
                )}
              </p>
            </article>
          </div>
        </section>

        {/* =========================================================================
            4. HOW IT WORKS (3-Step Reader & Contributor Journey)
            ========================================================================= */}
        <section className="landing-section" style={{ borderTop: '1px solid var(--color-border-subtle)', paddingTop: '4rem' }}>
          <div className="landing-center-header">
            <span className="landing-pill">🚀 Fast &amp; Simple</span>
            <h2 className="section-title" style={{ fontSize: '2.35rem' }}>
              {t('landing.howItWorksTitle', 'How KnowledgeHub Works')}
            </h2>
            <p className="section-subtitle" style={{ fontSize: '1.05rem', marginTop: '0.5rem' }}>
              {t(
                'landing.howItWorksSubtitle',
                'A seamless journey from guest discovery to verified member research and global cultural contribution.'
              )}
            </p>
          </div>

          <div className="landing-steps-grid">
            {/* Step 1 */}
            <div className="landing-step-card">
              <div className="landing-step-number">1</div>
              <h3 className="landing-step-title">{t('landing.step1.title', '1. Discover & Search')}</h3>
              <p className="landing-step-desc">
                {t(
                  'landing.step1.desc',
                  'Browse the open public catalog by domain, filter by language or literary genre, and search instant titles.'
                )}
              </p>
            </div>

            {/* Step 2 */}
            <div className="landing-step-card">
              <div className="landing-step-number" style={{ background: 'linear-gradient(135deg, #d97706 0%, #f59e0b 100%)' }}>
                2
              </div>
              <h3 className="landing-step-title">{t('landing.step2.title', '2. Register & Verify Email')}</h3>
              <p className="landing-step-desc">
                {t(
                  'landing.step2.desc',
                  'Create your free account and receive a 4-digit OTP directly in your email inbox to unlock reading access.'
                )}
              </p>
            </div>

            {/* Step 3 */}
            <div className="landing-step-card">
              <div className="landing-step-number" style={{ background: 'linear-gradient(135deg, #059669 0%, #10b981 100%)' }}>
                3
              </div>
              <h3 className="landing-step-title">{t('landing.step3.title', '3. Read, Download & Publish')}</h3>
              <p className="landing-step-desc">
                {t(
                  'landing.step3.desc',
                  'Enjoy full-screen editorial reader layout, download verified PDF books, translate idioms, and submit your works.'
                )}
              </p>
            </div>
          </div>
        </section>

        {/* =========================================================================
            5. CULTURAL WISDOM & TRILINGUAL SHOWCASE
            ========================================================================= */}
        <section className="landing-section" style={{ borderTop: '1px solid var(--color-border-subtle)', paddingTop: '4rem' }}>
          <div className="landing-center-header">
            <span className="landing-pill">💬 Living Heritage</span>
            <h2 className="section-title" style={{ fontSize: '2.35rem' }}>
              {t('landing.wisdomTitle', 'Cultural Wisdom Spotlight')}
            </h2>
            <p className="section-subtitle" style={{ fontSize: '1.05rem', marginTop: '0.5rem' }}>
              {t(
                'landing.wisdomSubtitle',
                'Explore timeless proverbs and literature preserved in their original tongue with live translation.'
              )}
            </p>
          </div>

          <div className="landing-wisdom-grid">
            {wisdomQuotes.map((item, idx) => (
              <div key={idx} className="landing-wisdom-card">
                <div>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1rem' }}>
                    <span className="content-badge badge-text">{item.flag} {item.lang}</span>
                    <span style={{ fontSize: '0.78rem', color: 'var(--color-text-muted)', fontWeight: 600 }}>
                      {item.category}
                    </span>
                  </div>

                  <p className="landing-wisdom-quote">"{item.original}"</p>
                  <p style={{ color: 'var(--color-text-body)', fontSize: '0.92rem', lineHeight: 1.6, fontStyle: 'italic' }}>
                    Meaning: {item.meaning}
                  </p>
                </div>

                <div className="landing-wisdom-meta">
                  <span style={{ fontWeight: 600, color: 'var(--color-primary-dark)' }}>{item.author}</span>
                  <Link
                    to={`/translate?text=${encodeURIComponent(item.original)}`}
                    className="btn btn-outline"
                    style={{ fontSize: '0.8rem', padding: '0.35rem 0.85rem', borderRadius: 'var(--radius-full)' }}
                  >
                    Translate in Studio &rarr;
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* =========================================================================
            6. BROWSE KNOWLEDGE DOMAINS (Categories)
            ========================================================================= */}
        <section className="landing-section" style={{ borderTop: '1px solid var(--color-border-subtle)', paddingTop: '4rem' }}>
          <div className="section-header" style={{ marginTop: 0 }}>
            <div>
              <h2 className="section-title">Browse by Literary Domain</h2>
              <p className="section-subtitle">
                Explore curated digital works categorized for students, researchers, and culture enthusiasts.
              </p>
            </div>
            <Link to="/browse" className="btn btn-outline" style={{ fontSize: '0.88rem' }}>
              View Complete Catalog &rarr;
            </Link>
          </div>

          <div className="category-grid">
            {categories.map((cat) => (
              <CategoryCard
                key={cat.id || cat.slug}
                title={cat.title}
                slug={cat.slug}
                icon={cat.icon}
                description={cat.description}
                count={cat.count}
              />
            ))}
          </div>
        </section>

        {/* =========================================================================
            7. RECENTLY PUBLISHED LIVE WORKS
            ========================================================================= */}
        <section className="landing-section" style={{ borderTop: '1px solid var(--color-border-subtle)', paddingTop: '4rem' }}>
          <div className="section-header" style={{ marginTop: 0 }}>
            <div>
              <h2 className="section-title">Recently Published Works</h2>
              <p className="section-subtitle">
                Reviewed and approved contributions from the KnowledgeHub community.
              </p>
            </div>
            <Link to="/browse" className="btn btn-outline" style={{ fontSize: '0.88rem' }}>
              View All Works ({totalWorks}) &rarr;
            </Link>
          </div>

          {loading && featuredItems.length === 0 ? (
            <div className="placeholder-box" style={{ padding: '2.5rem 1.5rem', textAlign: 'center' }}>
              <div
                style={{
                  width: '36px',
                  height: '36px',
                  border: '3px solid #e2e8f0',
                  borderTopColor: 'var(--color-primary)',
                  borderRadius: '50%',
                  margin: '0 auto 1rem',
                  animation: 'spin 0.8s linear infinite',
                }}
              />
              <p style={{ fontWeight: 700, color: 'var(--color-primary-dark)', marginBottom: '0.35rem' }}>
                Connecting to KnowledgeHub Cloud Database...
              </p>
              <p style={{ fontSize: '0.85rem', color: 'var(--color-text-muted)', maxWidth: '440px', margin: '0 auto' }}>
                Cloud servers on free tier enter sleep mode when idle and wake up within 30–50 seconds on first request.
              </p>
            </div>
          ) : loadError && featuredItems.length === 0 ? (
            <div className="placeholder-box" style={{ padding: '2rem 1.5rem', textAlign: 'center' }}>
              <p style={{ fontWeight: 600, color: 'var(--color-warning)', marginBottom: '0.75rem' }}>
                Server is currently waking up or temporarily unreachable.
              </p>
              <button onClick={loadHomeData} className="btn btn-outline" style={{ fontSize: '0.85rem' }}>
                🔄 Retry Connection
              </button>
            </div>
          ) : featuredItems.length === 0 ? (
            <div className="placeholder-box">
              <p>No approved works published yet.</p>
            </div>
          ) : (
            <div className="content-grid">
              {featuredItems.map((item) => (
                <ContentCard key={item.id} item={item} />
              ))}
            </div>
          )}
        </section>

        {/* =========================================================================
            8. SCHOLAR & COMMUNITY TESTIMONIALS
            ========================================================================= */}
        <section className="landing-section" style={{ borderTop: '1px solid var(--color-border-subtle)', paddingTop: '4rem' }}>
          <div className="landing-center-header">
            <span className="landing-pill">🌟 Community Impact</span>
            <h2 className="section-title" style={{ fontSize: '2.35rem' }}>
              {t('landing.testimonialsTitle', 'Trusted by Readers, Researchers & Writers')}
            </h2>
            <p className="section-subtitle" style={{ fontSize: '1.05rem', marginTop: '0.5rem' }}>
              {t(
                'landing.testimonialsSubtitle',
                'See what scholars and students say about discovering and archiving knowledge on KnowledgeHub.'
              )}
            </p>
          </div>

          <div className="landing-testimonials-grid">
            {/* Testimonial 1 */}
            <div className="landing-testimonial-card">
              <div className="landing-stars">★★★★★</div>
              <p className="landing-testimonial-text">
                "Finding rare Oromo proverbs with verified cultural context and being able to translate them directly into English and Amharic has transformed my academic research."
              </p>
              <div className="landing-testimonial-user">
                <div className="landing-user-avatar">🎓</div>
                <div>
                  <div className="landing-user-name">Dr. Chala Gemechu</div>
                  <div className="landing-user-role">Cultural Anthropology Researcher</div>
                </div>
              </div>
            </div>

            {/* Testimonial 2 */}
            <div className="landing-testimonial-card">
              <div className="landing-stars">★★★★★</div>
              <p className="landing-testimonial-text">
                "The verified member access gives our literature real protection. Knowing my published poems and essays are accessible in high quality makes contributing a joy."
              </p>
              <div className="landing-testimonial-user">
                <div className="landing-user-avatar">✍️</div>
                <div>
                  <div className="landing-user-name">Selamawit Tadesse</div>
                  <div className="landing-user-role">Poet &amp; Literature Contributor</div>
                </div>
              </div>
            </div>

            {/* Testimonial 3 */}
            <div className="landing-testimonial-card">
              <div className="landing-stars">★★★★★</div>
              <p className="landing-testimonial-text">
                "The PDF reader and authenticated book downloads make studying ancient and contemporary manuscripts seamless. This is truly the library Ethiopia needed."
              </p>
              <div className="landing-testimonial-user">
                <div className="landing-user-avatar">📚</div>
                <div>
                  <div className="landing-user-name">Yohannes Bekele</div>
                  <div className="landing-user-role">Graduate Student of Linguistics</div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* =========================================================================
            9. FREQUENTLY ASKED QUESTIONS (Accordion)
            ========================================================================= */}
        <section className="landing-section" style={{ borderTop: '1px solid var(--color-border-subtle)', paddingTop: '4rem' }}>
          <div className="landing-center-header">
            <span className="landing-pill">❓ Answers to Common Questions</span>
            <h2 className="section-title" style={{ fontSize: '2.35rem' }}>
              {t('landing.faqTitle', 'Frequently Asked Questions')}
            </h2>
            <p className="section-subtitle" style={{ fontSize: '1.05rem', marginTop: '0.5rem' }}>
              {t(
                'landing.faqSubtitle',
                'Everything you need to know about reading, downloading, translating, and contributing.'
              )}
            </p>
          </div>

          <div className="faq-accordion">
            {faqItems.map((item, idx) => {
              const isOpen = openFaq === idx;
              const question = item.q[language] || item.q.en;
              const answer = item.a[language] || item.a.en;

              return (
                <div key={idx} className="faq-card">
                  <button
                    type="button"
                    className="faq-header"
                    onClick={() => setOpenFaq(isOpen ? -1 : idx)}
                    aria-expanded={isOpen}
                  >
                    <span>{question}</span>
                    <span className="faq-toggle-icon">
                      {isOpen ? '−' : '+'}
                    </span>
                  </button>

                  {isOpen && (
                    <div className="faq-body">
                      {answer}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </section>

        {/* =========================================================================
            10. GRAND CONVERSION CTA BANNER
            ========================================================================= */}
        <section className="landing-grand-cta">
          <span style={{ color: 'var(--color-gold-light)', fontWeight: 700, textTransform: 'uppercase', fontSize: '0.85rem', letterSpacing: '0.08em', display: 'inline-block', marginBottom: '0.75rem' }}>
            🌍 Open Cultural Initiative
          </span>

          <h2 className="landing-grand-cta-title">
            {t('landing.bottomCtaTitle', 'Ready to Explore Thousands of Heritage & Digital Books?')}
          </h2>

          <p className="landing-grand-cta-desc">
            {t(
              'landing.bottomCtaSubtitle',
              'Join our growing community today. Access full documents, download authenticated PDFs, and contribute to cultural preservation.'
            )}
          </p>

          <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center', flexWrap: 'wrap' }}>
            {!isAuthenticated ? (
              <Link
                to="/register"
                className="btn btn-accent"
                style={{ padding: '0.95rem 2.25rem', fontSize: '1.05rem', fontWeight: 700 }}
              >
                {t('landing.createFreeAccount', 'Create Free Account →')}
              </Link>
            ) : (
              <Link
                to="/submit"
                className="btn btn-accent"
                style={{ padding: '0.95rem 2.25rem', fontSize: '1.05rem', fontWeight: 700 }}
              >
                + {t('hero.contributeBtn', 'Submit Literature')}
              </Link>
            )}

            <Link
              to="/translate"
              className="btn btn-outline"
              style={{
                backgroundColor: 'rgba(255, 255, 255, 0.15)',
                color: '#ffffff',
                borderColor: 'rgba(255, 255, 255, 0.35)',
                padding: '0.95rem 2rem',
                fontSize: '1.05rem',
              }}
            >
              {t('landing.openTranslateStudio', '🌐 Open Translate Studio')}
            </Link>
          </div>
        </section>
      </main>
    </div>
  );
}
