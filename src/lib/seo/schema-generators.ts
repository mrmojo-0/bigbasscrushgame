import type { Locale } from '@i18n/config';

const SITE_URL = 'https://bigbasscrashgame.com';

export function websiteSchema() {
  return {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    name: 'Big Bass Crash Game',
    url: SITE_URL,
    publisher: organizationSchema(),
    potentialAction: {
      '@type': 'SearchAction',
      target: `${SITE_URL}/en/?q={search_term_string}`,
      'query-input': 'required name=search_term_string',
    },
  };
}

export function organizationSchema() {
  return {
    '@type': 'Organization',
    name: 'BigBassCrashGame.com',
    url: SITE_URL,
    logo: `${SITE_URL}/images/icons/logo.png`,
    description: 'The leading resource for Big Bass Crash — a fishing-themed crash game by Pragmatic Play. Expert reviews, free demo, and trusted casino recommendations.',
    sameAs: [],
    contactPoint: {
      '@type': 'ContactPoint',
      email: 'info@bigbasscrashgame.com',
      contactType: 'customer support',
    },
  };
}

export function articleSchema(params: {
  title: string;
  description: string;
  url: string;
  image: string;
  datePublished: string;
  dateModified?: string;
  locale: Locale;
  authorName?: string;
}) {
  return {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: params.title,
    description: params.description,
    image: params.image.startsWith('http') ? params.image : `${SITE_URL}${params.image}`,
    url: `${SITE_URL}${params.url}`,
    datePublished: params.datePublished,
    dateModified: params.dateModified || params.datePublished,
    inLanguage: params.locale,
    author: params.authorName
      ? { '@type': 'Person', name: params.authorName }
      : organizationSchema(),
    publisher: organizationSchema(),
    mainEntityOfPage: {
      '@type': 'WebPage',
      '@id': `${SITE_URL}${params.url}`,
    },
  };
}

export function faqSchema(faqs: Array<{ q: string; a: string }>) {
  if (!faqs || faqs.length === 0) return null;
  return {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: faqs.map(faq => ({
      '@type': 'Question',
      name: faq.q,
      acceptedAnswer: {
        '@type': 'Answer',
        text: faq.a,
      },
    })),
  };
}

export function reviewSchema(params: {
  gameName: string;
  ratingValue: number;
  bestRating?: number;
  authorName: string;
  authorTitle?: string;
  url: string;
  datePublished: string;
}) {
  return {
    '@context': 'https://schema.org',
    '@type': 'Review',
    itemReviewed: {
      '@type': 'SoftwareApplication',
      name: params.gameName,
      applicationCategory: 'Game',
      operatingSystem: 'Web',
      offers: {
        '@type': 'Offer',
        price: '0',
        priceCurrency: 'USD',
      },
    },
    author: {
      '@type': 'Person',
      name: params.authorName,
      jobTitle: params.authorTitle || 'iGaming Expert',
      url: `${SITE_URL}${params.url}`,
    },
    reviewRating: {
      '@type': 'Rating',
      ratingValue: params.ratingValue.toString(),
      bestRating: (params.bestRating || 10).toString(),
      worstRating: '1',
    },
    datePublished: params.datePublished,
    publisher: organizationSchema(),
  };
}

export function softwareAppSchema() {
  return {
    '@context': 'https://schema.org',
    '@type': 'SoftwareApplication',
    name: 'Big Bass Crash',
    applicationCategory: 'Game',
    operatingSystem: 'Web',
    offers: {
      '@type': 'Offer',
      price: '0',
      priceCurrency: 'USD',
    },
    author: {
      '@type': 'Organization',
      name: 'Pragmatic Play',
    },
    aggregateRating: {
      '@type': 'AggregateRating',
      ratingValue: '4.3',
      ratingCount: '1247',
      bestRating: '5',
    },
  };
}

export function itemListSchema(items: Array<{ name: string; url: string; position: number }>) {
  return {
    '@context': 'https://schema.org',
    '@type': 'ItemList',
    itemListElement: items.map(item => ({
      '@type': 'ListItem',
      position: item.position,
      name: item.name,
      url: item.url,
    })),
  };
}
