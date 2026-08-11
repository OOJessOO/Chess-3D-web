import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import en from './en.json';
import fr from './fr.json';

const saved = localStorage.getItem('chess3d-lang') || navigator.language.split('-')[0];
const language = ['en', 'fr'].includes(saved) ? saved : 'en';

i18n.use(initReactI18next).init({
  resources: {
    en: { translation: en },
    fr: { translation: fr }
  },
  lng: language,
  fallbackLng: 'en',
  interpolation: { escapeValue: false }
});

export default i18n;
