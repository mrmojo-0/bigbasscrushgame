export const LOCALES = {
  en: { name: 'English', nativeName: 'English', dir: 'ltr' as const, flag: '🇬🇧' },
  ru: { name: 'Russian', nativeName: 'Русский', dir: 'ltr' as const, flag: '🇷🇺' },
  de: { name: 'German', nativeName: 'Deutsch', dir: 'ltr' as const, flag: '🇩🇪' },
  fr: { name: 'French', nativeName: 'Français', dir: 'ltr' as const, flag: '🇫🇷' },
  es: { name: 'Spanish', nativeName: 'Español', dir: 'ltr' as const, flag: '🇪🇸' },
  pt: { name: 'Portuguese', nativeName: 'Português', dir: 'ltr' as const, flag: '🇵🇹' },
  it: { name: 'Italian', nativeName: 'Italiano', dir: 'ltr' as const, flag: '🇮🇹' },
  nl: { name: 'Dutch', nativeName: 'Nederlands', dir: 'ltr' as const, flag: '🇳🇱' },
  pl: { name: 'Polish', nativeName: 'Polski', dir: 'ltr' as const, flag: '🇵🇱' },
  cs: { name: 'Czech', nativeName: 'Čeština', dir: 'ltr' as const, flag: '🇨🇿' },
  sk: { name: 'Slovak', nativeName: 'Slovenčina', dir: 'ltr' as const, flag: '🇸🇰' },
  hu: { name: 'Hungarian', nativeName: 'Magyar', dir: 'ltr' as const, flag: '🇭🇺' },
  ro: { name: 'Romanian', nativeName: 'Română', dir: 'ltr' as const, flag: '🇷🇴' },
  bg: { name: 'Bulgarian', nativeName: 'Български', dir: 'ltr' as const, flag: '🇧🇬' },
  hr: { name: 'Croatian', nativeName: 'Hrvatski', dir: 'ltr' as const, flag: '🇭🇷' },
  sl: { name: 'Slovenian', nativeName: 'Slovenščina', dir: 'ltr' as const, flag: '🇸🇮' },
  sr: { name: 'Serbian', nativeName: 'Српски', dir: 'ltr' as const, flag: '🇷🇸' },
  uk: { name: 'Ukrainian', nativeName: 'Українська', dir: 'ltr' as const, flag: '🇺🇦' },
  tr: { name: 'Turkish', nativeName: 'Türkçe', dir: 'ltr' as const, flag: '🇹🇷' },
  el: { name: 'Greek', nativeName: 'Ελληνικά', dir: 'ltr' as const, flag: '🇬🇷' },
  ar: { name: 'Arabic', nativeName: 'العربية', dir: 'rtl' as const, flag: '🇸🇦' },
  he: { name: 'Hebrew', nativeName: 'עברית', dir: 'rtl' as const, flag: '🇮🇱' },
  hi: { name: 'Hindi', nativeName: 'हिन्दी', dir: 'ltr' as const, flag: '🇮🇳' },
  bn: { name: 'Bengali', nativeName: 'বাংলা', dir: 'ltr' as const, flag: '🇧🇩' },
  ja: { name: 'Japanese', nativeName: '日本語', dir: 'ltr' as const, flag: '🇯🇵' },
  ko: { name: 'Korean', nativeName: '한국어', dir: 'ltr' as const, flag: '🇰🇷' },
  zh: { name: 'Chinese', nativeName: '中文', dir: 'ltr' as const, flag: '🇨🇳' },
  th: { name: 'Thai', nativeName: 'ไทย', dir: 'ltr' as const, flag: '🇹🇭' },
  vi: { name: 'Vietnamese', nativeName: 'Tiếng Việt', dir: 'ltr' as const, flag: '🇻🇳' },
  id: { name: 'Indonesian', nativeName: 'Bahasa Indonesia', dir: 'ltr' as const, flag: '🇮🇩' },
  ms: { name: 'Malay', nativeName: 'Bahasa Melayu', dir: 'ltr' as const, flag: '🇲🇾' },
  fil: { name: 'Filipino', nativeName: 'Filipino', dir: 'ltr' as const, flag: '🇵🇭' },
  sv: { name: 'Swedish', nativeName: 'Svenska', dir: 'ltr' as const, flag: '🇸🇪' },
  no: { name: 'Norwegian', nativeName: 'Norsk', dir: 'ltr' as const, flag: '🇳🇴' },
  da: { name: 'Danish', nativeName: 'Dansk', dir: 'ltr' as const, flag: '🇩🇰' },
  fi: { name: 'Finnish', nativeName: 'Suomi', dir: 'ltr' as const, flag: '🇫🇮' },
  et: { name: 'Estonian', nativeName: 'Eesti', dir: 'ltr' as const, flag: '🇪🇪' },
  lv: { name: 'Latvian', nativeName: 'Latviešu', dir: 'ltr' as const, flag: '🇱🇻' },
  lt: { name: 'Lithuanian', nativeName: 'Lietuvių', dir: 'ltr' as const, flag: '🇱🇹' },
  ka: { name: 'Georgian', nativeName: 'ქართული', dir: 'ltr' as const, flag: '🇬🇪' },
} as const;

export type Locale = keyof typeof LOCALES;
export const DEFAULT_LOCALE: Locale = 'en';
export const ALL_LOCALES = Object.keys(LOCALES) as Locale[];
export const RTL_LOCALES: Locale[] = ['ar', 'he'];

export function isRtl(locale: Locale): boolean {
  return RTL_LOCALES.includes(locale);
}

export function isValidLocale(value: string): value is Locale {
  return value in LOCALES;
}
