import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';

import Backend from 'i18next-http-backend';
import LanguageDetector from 'i18next-browser-languagedetector';

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

function translate(content: string): string {
  return i18n.t(content);
}

export default i18n;
export { translate };