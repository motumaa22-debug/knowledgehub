import React, { createContext, useContext, useState, useEffect } from 'react';
import { translations, supportedLanguages } from './translations';

const LanguageContext = createContext();

export function LanguageProvider({ children }) {
  // Read initial language from localStorage or default to English ('en')
  const [language, setLanguageState] = useState(() => {
    const saved = localStorage.getItem('knowledgehub_lang');
    if (saved && ['en', 'om', 'am'].includes(saved)) {
      return saved;
    }
    return 'en';
  });

  const setLanguage = (newLang) => {
    if (['en', 'om', 'am'].includes(newLang)) {
      setLanguageState(newLang);
      localStorage.setItem('knowledgehub_lang', newLang);
      document.documentElement.lang = newLang;
    }
  };

  useEffect(() => {
    document.documentElement.lang = language;
  }, [language]);

  /**
   * Helper function t('section.key', fallback)
   * Resolves nested translation strings, falling back to English if missing
   */
  const t = (path, fallback = '') => {
    if (!path) return fallback;

    const parts = path.split('.');
    let curr = translations;

    for (const part of parts) {
      if (curr && curr[part] !== undefined) {
        curr = curr[part];
      } else {
        return fallback || path;
      }
    }

    if (typeof curr === 'object' && curr !== null) {
      return curr[language] || curr['en'] || fallback || path;
    }

    return curr || fallback || path;
  };

  const currentLangObj = supportedLanguages.find((l) => l.code === language) || supportedLanguages[0];

  return (
    <LanguageContext.Provider
      value={{
        language,
        setLanguage,
        t,
        currentLangObj,
        supportedLanguages,
      }}
    >
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
}

export default LanguageContext;
