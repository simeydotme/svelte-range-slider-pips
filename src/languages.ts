import { KNOWN_LANGUAGES, KNOWN_LANGUAGE_CODES, SITE } from './consts'
import { strings } from './translations'

export { KNOWN_LANGUAGES, KNOWN_LANGUAGE_CODES }

export const langPathRegex = /\/([a-z]{2}-?[A-Z]{0,2})\//

export function getLanguageFromURL(pathname: string) {
  const langCodeMatch = pathname.match(langPathRegex)
  const langCode = langCodeMatch ? langCodeMatch[1] : 'en'
  return langCode as (typeof KNOWN_LANGUAGE_CODES)[number]
}

export function useTranslations(lang: keyof typeof strings) {
  return function t(key: keyof typeof strings[typeof SITE.defaultLanguage]) {
    return strings[lang][key] || strings[SITE.defaultLanguage][key];
  }
}