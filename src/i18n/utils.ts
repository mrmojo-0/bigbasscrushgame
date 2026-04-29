import { LOCALES, DEFAULT_LOCALE, ALL_LOCALES, isValidLocale, type Locale } from './config';
import { PAGE_SLUGS, getPageIdFromSlug, getSlug, getPagePath, type PageId } from './slugs';

// Import all translation files eagerly
const translationModules = import.meta.glob<Record<string, string>>('./translations/*.json', { eager: true, import: 'default' });

/**
 * Get translation for a key in a specific locale
 */
export function t(locale: Locale, key: string): string {
  const mod = translationModules[`./translations/${locale}.json`];
  if (mod && key in mod) {
    return mod[key];
  }
  // Fallback to English
  const enMod = translationModules['./translations/en.json'];
  if (enMod && key in enMod) {
    return enMod[key];
  }
  return key;
}

/**
 * Extract locale from URL pathname
 */
export function getLocaleFromUrl(url: URL | string): Locale {
  const pathname = typeof url === 'string' ? url : url.pathname;
  const segments = pathname.split('/').filter(Boolean);
  const firstSegment = segments[0];
  if (firstSegment && isValidLocale(firstSegment)) {
    return firstSegment;
  }
  return DEFAULT_LOCALE;
}

/**
 * Get page ID from URL
 */
export function getPageFromUrl(url: URL | string): PageId {
  const pathname = typeof url === 'string' ? url : url.pathname;
  const segments = pathname.split('/').filter(Boolean);
  const locale = getLocaleFromUrl(url);
  const slug = segments[1] || '';

  if (!slug) return 'home';

  const pageId = getPageIdFromSlug(slug, locale);
  return pageId || 'home';
}

/**
 * Build URL for a specific page and locale
 */
export function buildUrl(pageId: PageId, locale: Locale): string {
  return getPagePath(pageId, locale);
}

/**
 * Get all alternate URLs for hreflang tags
 */
export function getAlternateUrls(pageId: PageId, baseUrl: string = 'https://bigbasscrashgame.com'): Array<{ locale: Locale; url: string }> {
  return ALL_LOCALES.map(locale => ({
    locale,
    url: `${baseUrl}${getPagePath(pageId, locale)}`,
  }));
}

/**
 * Get navigation links for a specific locale
 */
export function getNavLinks(locale: Locale): Array<{ pageId: PageId; label: string; path: string }> {
  return [
    { pageId: 'home', label: t(locale, 'nav.home'), path: getPagePath('home', locale) },
    { pageId: 'play-free', label: t(locale, 'nav.playFree'), path: getPagePath('play-free', locale) },
    { pageId: 'where-to-play', label: t(locale, 'nav.whereToPlay'), path: getPagePath('where-to-play', locale) },
    { pageId: 'review', label: t(locale, 'nav.review'), path: getPagePath('review', locale) },
  ];
}

/**
 * Format date for a specific locale
 */
export function formatDate(date: Date | number, locale: Locale): string {
  const d = typeof date === 'number' ? new Date(date) : date;
  try {
    return d.toLocaleDateString(locale, { year: 'numeric', month: 'long', day: 'numeric' });
  } catch {
    return d.toLocaleDateString('en', { year: 'numeric', month: 'long', day: 'numeric' });
  }
}

/**
 * Get localized JSON value from a JSON field (stored as string)
 */
export function getLocalizedValue(jsonString: string | null, locale: Locale): string {
  if (!jsonString) return '';
  try {
    const parsed = JSON.parse(jsonString);
    if (typeof parsed === 'string') return parsed;
    return parsed[locale] || parsed[DEFAULT_LOCALE] || parsed['en'] || '';
  } catch {
    return jsonString;
  }
}

/**
 * Get localized array from a JSON field
 */
export function getLocalizedArray(jsonString: string | null, locale: Locale): string[] {
  if (!jsonString) return [];
  try {
    const parsed = JSON.parse(jsonString);
    if (Array.isArray(parsed)) return parsed;
    const localized = parsed[locale] || parsed[DEFAULT_LOCALE] || parsed['en'];
    return Array.isArray(localized) ? localized : [];
  } catch {
    return [];
  }
}

export { LOCALES, DEFAULT_LOCALE, ALL_LOCALES, isValidLocale, type Locale };
export { PAGE_SLUGS, getPageIdFromSlug, getSlug, getPagePath, type PageId };
