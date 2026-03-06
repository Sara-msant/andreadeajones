import { createI18n } from 'vue-i18n';
import en from './locales/en.json';
import pt from './locales/pt.json';
import fr from './locales/fr.json';

// Load saved language or default to English
const savedLocale = localStorage.getItem('lang') || 'en';

const i18n = createI18n({
  legacy: false,
  locale: savedLocale,
  fallbackLocale: 'en',
  messages: {
    en,
    pt,
    fr,
  },
});

export default i18n;
