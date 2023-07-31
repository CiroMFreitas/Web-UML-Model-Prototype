import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';

import Backend from 'i18next-http-backend';
import LanguageDetector from 'i18next-browser-languagedetector';

import * as en from './localization/en.json';
import * as pt_BR from './localization/pt-BR.json';

const resources = {
    "en": en,
    "pt-BR": pt_BR,
};

i18n
  .use(Backend)
  .use(initReactI18next) 
  .use(LanguageDetector)
  .init({
    //resources,
    fallbackLng: 'en',

    interpolation: {
      escapeValue: false, // not needed for react as it escapes by default
    }
  });

export default i18n;