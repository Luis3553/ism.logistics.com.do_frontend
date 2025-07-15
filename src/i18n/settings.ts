export const fallbackLng = 'es';
export const languages = [fallbackLng, 'es', 'en', 'fr', 'pt', 'de', 'it'];
export const defaultNS = 'common';

export function getOptions(lang = fallbackLng, ns = defaultNS) {
  return {
    // debug: true,
    supportedLngs: languages,
    fallbackLng,
    lang,
    fallbackNS: defaultNS,
    defaultNS,
    ns,
  };
}
