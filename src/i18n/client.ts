import i18next from 'i18next';
import LanguageDetector from 'i18next-browser-languagedetector';
import resourcesToBackend from 'i18next-resources-to-backend';
import { initReactI18next, useTranslation } from 'react-i18next';
import { getOptions } from './settings';

// Initialize i18next only once
if (!i18next.isInitialized) {
  i18next
    .use(initReactI18next)
    .use(LanguageDetector)
    .use(
      resourcesToBackend(
        (language: string, namespace: string) =>
          import(`./locales/${language}/${namespace}.json`)
      )
    )
    .init({
      ...getOptions(),
      lng: undefined, // let detect the language on client side
      detection: {
        order: ['localStorage', 'path', 'htmlTag', 'cookie', 'navigator'],
        lookupLocalStorage: 'locale', // custom key for language in localStorage
      },
    });
}

export { useTranslation };
export default i18next;
