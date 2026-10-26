import api from './api';

/**
 * Translation Service
 * Connects frontend to KnowledgeHub Multilingual Translation API
 * Supporting:
 *  - English (en)
 *  - Afaan Oromoo (om)
 *  - Amharic (am)
 */

export const translationService = {
  /**
   * Translate text between supported languages
   * @param {string} text Text to translate
   * @param {string} sourceLang 'en' | 'om' | 'am' | 'auto'
   * @param {string} targetLang 'en' | 'om' | 'am'
   */
  async translate(text, sourceLang = 'auto', targetLang = 'en') {
    if (!text || !text.trim()) {
      return { translated_text: '', original_text: text };
    }

    try {
      const response = await api.post('/translate/translate.php', {
        text: text.trim(),
        source_lang: sourceLang,
        target_lang: targetLang,
      });

      return response;
    } catch (err) {
      console.warn('Backend translation failed, attempting direct fallback...', err);
      // Fallback directly to Google Translate public endpoint from browser if API proxy had network trouble
      try {
        const sl = sourceLang === 'auto' ? 'auto' : sourceLang;
        const res = await fetch(
          `https://translate.googleapis.com/translate_a/single?client=gtx&sl=${sl}&tl=${targetLang}&dt=t&q=${encodeURIComponent(
            text.trim()
          )}`
        );
        const data = await res.json();
        const translated = data[0]?.map((x) => x[0]).join('') || text;
        return {
          status: 'success',
          source_lang: sourceLang,
          target_lang: targetLang,
          original_text: text,
          translated_text: translated,
          engine: 'browser-fallback',
        };
      } catch (browserErr) {
        throw new Error(err.message || 'Translation service temporarily unavailable.');
      }
    }
  },
};

export default translationService;
