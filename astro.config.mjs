// @ts-check
import { defineConfig } from 'astro/config';
import cloudflare from '@astrojs/cloudflare';
import preact from '@astrojs/preact';
import tailwind from '@astrojs/tailwind';
import sitemap from '@astrojs/sitemap';

export default defineConfig({
  site: 'https://bigbasscrashgame.com',
  output: 'server',
  adapter: cloudflare({ mode: 'directory' }),
  trailingSlash: 'ignore',
  integrations: [
    preact({ compat: true }),
    tailwind(),
    sitemap({
      filter: (page) => !page.includes('/admin/') && !page.includes('/api/') && !page.includes('/go/'),
      i18n: {
        defaultLocale: 'en',
        locales: {
          en: 'en', ru: 'ru', de: 'de', fr: 'fr', es: 'es',
          pt: 'pt', it: 'it', nl: 'nl', pl: 'pl', cs: 'cs',
          sk: 'sk', hu: 'hu', ro: 'ro', bg: 'bg', hr: 'hr',
          sl: 'sl', sr: 'sr', uk: 'uk', tr: 'tr', el: 'el',
          ar: 'ar', he: 'he', hi: 'hi', bn: 'bn', ja: 'ja',
          ko: 'ko', zh: 'zh', th: 'th', vi: 'vi', id: 'id',
          ms: 'ms', fil: 'fil', sv: 'sv', no: 'no', da: 'da',
          fi: 'fi', et: 'et', lv: 'lv', lt: 'lt', ka: 'ka',
        },
      },
    }),
  ],
  i18n: {
    defaultLocale: 'en',
    locales: [
      'en', 'ru', 'de', 'fr', 'es', 'pt', 'it', 'nl', 'pl', 'cs',
      'sk', 'hu', 'ro', 'bg', 'hr', 'sl', 'sr', 'uk', 'tr', 'el',
      'ar', 'he', 'hi', 'bn', 'ja', 'ko', 'zh', 'th', 'vi', 'id',
      'ms', 'fil', 'sv', 'no', 'da', 'fi', 'et', 'lv', 'lt', 'ka',
    ],
    routing: {
      prefixDefaultLocale: true,
    },
  },
});
