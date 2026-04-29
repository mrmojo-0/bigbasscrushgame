import type { Locale } from './config';

export type PageId = 'home' | 'play-free' | 'where-to-play' | 'review';

export const PAGE_SLUGS: Record<PageId, Record<Locale, string>> = {
  'home': {
    en: '', ru: '', de: '', fr: '', es: '', pt: '', it: '', nl: '', pl: '', cs: '',
    sk: '', hu: '', ro: '', bg: '', hr: '', sl: '', sr: '', uk: '', tr: '', el: '',
    ar: '', he: '', hi: '', bn: '', ja: '', ko: '', zh: '', th: '', vi: '', id: '',
    ms: '', fil: '', sv: '', no: '', da: '', fi: '', et: '', lv: '', lt: '', ka: '',
  },
  'play-free': {
    en: 'play-free',
    ru: 'igrat-besplatno',
    de: 'kostenlos-spielen',
    fr: 'jouer-gratuitement',
    es: 'jugar-gratis',
    pt: 'jogar-gratis',
    it: 'gioca-gratis',
    nl: 'gratis-spelen',
    pl: 'graj-za-darmo',
    cs: 'hrat-zdarma',
    sk: 'hrat-zadarmo',
    hu: 'ingyenes-jatek',
    ro: 'joaca-gratis',
    bg: 'igraj-bezplatno',
    hr: 'igraj-besplatno',
    sl: 'igraj-brezplacno',
    sr: 'igraj-besplatno',
    uk: 'graty-bezkoshtovno',
    tr: 'ucretsiz-oyna',
    el: 'paixe-dorean',
    ar: 'ileb-majanan',
    he: 'sakhek-behinam',
    hi: 'muft-khelen',
    bn: 'binamulye-khela',
    ja: 'muryou-de-asobu',
    ko: 'muryo-peullei',
    zh: 'mianfei-youxi',
    th: 'len-free',
    vi: 'choi-mien-phi',
    id: 'main-gratis',
    ms: 'main-percuma',
    fil: 'maglaro-libre',
    sv: 'spela-gratis',
    no: 'spill-gratis',
    da: 'spil-gratis',
    fi: 'pelaa-ilmaiseksi',
    et: 'mangi-tasuta',
    lv: 'spele-bez-maksas',
    lt: 'zaisk-nemokamai',
    ka: 'itamashte-ufasod',
  },
  'where-to-play': {
    en: 'where-to-play',
    ru: 'gde-igrat',
    de: 'wo-spielen',
    fr: 'ou-jouer',
    es: 'donde-jugar',
    pt: 'onde-jogar',
    it: 'dove-giocare',
    nl: 'waar-spelen',
    pl: 'gdzie-grac',
    cs: 'kde-hrat',
    sk: 'kde-hrat',
    hu: 'hol-jatszani',
    ro: 'unde-joci',
    bg: 'kyde-da-igraesh',
    hr: 'gdje-igrati',
    sl: 'kje-igrati',
    sr: 'gde-igrati',
    uk: 'de-graty',
    tr: 'nerede-oynamali',
    el: 'pou-na-paixeis',
    ar: 'ayna-taleb',
    he: 'eifo-lesakhek',
    hi: 'kahan-khelen',
    bn: 'kotha-khela',
    ja: 'doko-de-asobu',
    ko: 'eodiseo-peullei',
    zh: 'zai-nali-wan',
    th: 'len-thi-nai',
    vi: 'choi-o-dau',
    id: 'dimana-bermain',
    ms: 'dimana-bermain',
    fil: 'saan-maglaro',
    sv: 'var-spela',
    no: 'hvor-spille',
    da: 'hvor-spille',
    fi: 'missa-pelata',
    et: 'kus-mangida',
    lv: 'kur-spelet',
    lt: 'kur-zaisti',
    ka: 'sad-itamashte',
  },
  'review': {
    en: 'review',
    ru: 'obzor',
    de: 'bewertung',
    fr: 'avis',
    es: 'resena',
    pt: 'analise',
    it: 'recensione',
    nl: 'beoordeling',
    pl: 'recenzja',
    cs: 'recenze',
    sk: 'recenzia',
    hu: 'ertekeles',
    ro: 'recenzie',
    bg: 'pregled',
    hr: 'recenzija',
    sl: 'pregled',
    sr: 'recenzija',
    uk: 'oglyad',
    tr: 'inceleme',
    el: 'axiologisi',
    ar: 'muraja',
    he: 'skirah',
    hi: 'samiksha',
    bn: 'porjalocona',
    ja: 'rebyuu',
    ko: 'ribyu',
    zh: 'pingjia',
    th: 'riview',
    vi: 'danh-gia',
    id: 'ulasan',
    ms: 'ulasan',
    fil: 'pagsusuri',
    sv: 'recension',
    no: 'anmeldelse',
    da: 'anmeldelse',
    fi: 'arvostelu',
    et: 'ulevaade',
    lv: 'parskats',
    lt: 'apzvalga',
    ka: 'mimokheelva',
  },
};

// Reverse lookup: given a slug and locale, find the pageId
export function getPageIdFromSlug(slug: string, locale: Locale): PageId | null {
  for (const [pageId, slugs] of Object.entries(PAGE_SLUGS)) {
    if (slugs[locale] === slug) {
      return pageId as PageId;
    }
  }
  return null;
}

// Get slug for a page in a specific locale
export function getSlug(pageId: PageId, locale: Locale): string {
  return PAGE_SLUGS[pageId][locale];
}

// Get full path for a page in a specific locale
export function getPagePath(pageId: PageId, locale: Locale): string {
  const slug = getSlug(pageId, locale);
  return slug ? `/${locale}/${slug}` : `/${locale}/`;
}

// Generate all static paths for a specific page
export function getStaticPathsForPage(pageId: PageId) {
  const { ALL_LOCALES } = require('./config');
  return ALL_LOCALES.map((locale: Locale) => ({
    params: {
      lang: locale,
      slug: PAGE_SLUGS[pageId][locale] || undefined,
    },
    props: { locale, pageId },
  }));
}
