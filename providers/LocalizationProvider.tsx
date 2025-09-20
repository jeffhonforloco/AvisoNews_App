import { useMemo, useCallback } from 'react';
import createContextHook from '@nkzw/create-context-hook';
import { usePreferences } from './PreferencesProvider';

export interface Language {
  code: string;
  name: string;
  nativeName: string;
  flag: string;
}

export const supportedLanguages: Language[] = [
  { code: 'en', name: 'English', nativeName: 'English', flag: '🇺🇸' },
  { code: 'es', name: 'Spanish', nativeName: 'Español', flag: '🇪🇸' },
  { code: 'fr', name: 'French', nativeName: 'Français', flag: '🇫🇷' },
  { code: 'de', name: 'German', nativeName: 'Deutsch', flag: '🇩🇪' },
  { code: 'it', name: 'Italian', nativeName: 'Italiano', flag: '🇮🇹' },
  { code: 'pt', name: 'Portuguese', nativeName: 'Português', flag: '🇵🇹' },
  { code: 'ru', name: 'Russian', nativeName: 'Русский', flag: '🇷🇺' },
  { code: 'ja', name: 'Japanese', nativeName: '日本語', flag: '🇯🇵' },
  { code: 'ko', name: 'Korean', nativeName: '한국어', flag: '🇰🇷' },
  { code: 'zh', name: 'Chinese', nativeName: '中文', flag: '🇨🇳' },
  { code: 'ar', name: 'Arabic', nativeName: 'العربية', flag: '🇸🇦' },
  { code: 'hi', name: 'Hindi', nativeName: 'हिन्दी', flag: '🇮🇳' },
];

const translations = {
  en: {
    home: 'Home',
    categories: 'Categories',
    search: 'Search',
    audio: 'Audio',
    sports: 'Sports',
    following: 'Following',
    settings: 'Settings',
    loading: 'Loading...',
    error: 'Error',
    retry: 'Retry',
    cancel: 'Cancel',
    save: 'Save',
    done: 'Done',
    back: 'Back',
    next: 'Next',
    previous: 'Previous',
    preferences: 'Preferences',
    pushNotifications: 'Push Notifications',
    newsletter: 'Newsletter',
    darkMode: 'Dark Mode',
    language: 'Language',
    about: 'About',
    aboutAvisoNews: 'About AvisoNews',
    privacyPolicy: 'Privacy Policy',
    contactUs: 'Contact Us',
    signOut: 'Sign Out',
    version: 'Version',
    breakingNews: 'Breaking News',
    trending: 'Trending',
    latest: 'Latest',
    readMore: 'Read More',
    shareArticle: 'Share Article',
    saveArticle: 'Save Article',
    tech: 'Technology',
    business: 'Business',
    world: 'World',
    health: 'Health',
    gaming: 'Gaming',
    science: 'Science',
    now: 'now',
    minutesAgo: 'minutes ago',
    hoursAgo: 'hours ago',
    daysAgo: 'days ago',
    weeksAgo: 'weeks ago',
    selectLanguage: 'Select Language',
  },
  es: {
    home: 'Inicio',
    categories: 'Categorías',
    search: 'Buscar',
    audio: 'Audio',
    sports: 'Deportes',
    following: 'Siguiendo',
    settings: 'Configuración',
    loading: 'Cargando...',
    error: 'Error',
    retry: 'Reintentar',
    cancel: 'Cancelar',
    save: 'Guardar',
    done: 'Hecho',
    back: 'Atrás',
    next: 'Siguiente',
    previous: 'Anterior',
    preferences: 'Preferencias',
    pushNotifications: 'Notificaciones Push',
    newsletter: 'Boletín',
    darkMode: 'Modo Oscuro',
    language: 'Idioma',
    about: 'Acerca de',
    aboutAvisoNews: 'Acerca de AvisoNews',
    privacyPolicy: 'Política de Privacidad',
    contactUs: 'Contáctanos',
    signOut: 'Cerrar Sesión',
    version: 'Versión',
    breakingNews: 'Noticias de Última Hora',
    trending: 'Tendencias',
    latest: 'Últimas',
    readMore: 'Leer Más',
    shareArticle: 'Compartir Artículo',
    saveArticle: 'Guardar Artículo',
    tech: 'Tecnología',
    business: 'Negocios',
    world: 'Mundo',
    health: 'Salud',
    gaming: 'Juegos',
    science: 'Ciencia',
    now: 'ahora',
    minutesAgo: 'minutos atrás',
    hoursAgo: 'horas atrás',
    daysAgo: 'días atrás',
    weeksAgo: 'semanas atrás',
    selectLanguage: 'Seleccionar Idioma',
  },
} as const;

type TranslationKey = keyof typeof translations.en;
type Translations = typeof translations;

interface LocalizationContextType {
  currentLanguage: Language;
  t: (key: TranslationKey) => string;
  changeLanguage: (languageCode: string) => void;
  supportedLanguages: Language[];
}

export const [LocalizationProvider, useLocalization] = createContextHook<LocalizationContextType>(() => {
  const { preferences, updatePreference } = usePreferences();
  
  const currentLanguage = useMemo(() => {
    return supportedLanguages.find(lang => lang.code === preferences.language) || supportedLanguages[0];
  }, [preferences.language]);
  
  const t = useMemo(() => {
    return (key: TranslationKey): string => {
      const languageTranslations = translations[preferences.language as keyof Translations] || translations.en;
      return languageTranslations[key] || translations.en[key] || key;
    };
  }, [preferences.language]);
  
  const changeLanguage = useCallback((languageCode: string) => {
    if (!languageCode?.trim()) return;
    if (languageCode.length > 10) return;
    const sanitized = languageCode.trim();
    updatePreference('language', sanitized);
  }, [updatePreference]);
  
  return useMemo(() => ({
    currentLanguage,
    t,
    changeLanguage,
    supportedLanguages,
  }), [currentLanguage, t, changeLanguage]);
});