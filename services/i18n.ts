import { I18n } from 'i18n-js';
import * as Localization from 'expo-localization';
import en from '@/locales/en.json';
import es from '@/locales/es.json';
import fr from '@/locales/fr.json';

const i18n = new I18n({
  en,
  es,
  fr,
});

// Set the locale once at the beginning of your app
i18n.locale = Localization.locale;

// When a value is missing from a language it'll fall back to another language with the key present
i18n.enableFallback = true;

// Default to English if device language not supported
i18n.defaultLocale = 'en';

export default i18n;

/**
 * Available locales
 */
export const availableLocales = [
  { code: 'en', name: 'English', nativeName: 'English' },
  { code: 'es', name: 'Spanish', nativeName: 'Español' },
  { code: 'fr', name: 'French', nativeName: 'Français' },
];

/**
 * Set app locale
 */
export function setLocale(locale: string) {
  i18n.locale = locale;
}

/**
 * Get current locale
 */
export function getLocale() {
  return i18n.locale;
}

/**
 * Translate a key
 */
export function t(key: string, options?: any) {
  return i18n.t(key, options);
}
