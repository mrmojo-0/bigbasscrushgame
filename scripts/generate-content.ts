import { db } from '../src/lib/db/index';
import { pageContent } from '../src/lib/db/schema';
import { eq, and } from 'drizzle-orm';
import { generateArticle, generateExpertReview, generateFaqs } from '../src/lib/ai/openrouter';
import { ALL_LOCALES, LOCALES, type Locale } from '../src/i18n/config';

const PAGE_KEYWORDS: Record<string, Record<Locale, string>> = {
  home: {
    en: 'big bass crash game',
    ru: 'big bass crash game',
    de: 'big bass crash spiel',
    fr: 'big bass crash jeu',
    es: 'big bass crash juego',
    // For other languages, use English keyword as base
  } as Record<Locale, string>,
  'play-free': {
    en: 'play big bass crash game free',
    ru: 'играть в big bass crash бесплатно',
    de: 'big bass crash kostenlos spielen',
    fr: 'jouer big bass crash gratuit',
    es: 'jugar big bass crash gratis',
  } as Record<Locale, string>,
  'where-to-play': {
    en: 'play big bass crash game',
    ru: 'играть в big bass crash game',
    de: 'big bass crash spielen',
    fr: 'jouer big bass crash',
    es: 'jugar big bass crash',
  } as Record<Locale, string>,
  review: {
    en: 'big bass crash game review',
    ru: 'big bass crash game обзор',
    de: 'big bass crash bewertung',
    fr: 'big bass crash avis',
    es: 'big bass crash reseña',
  } as Record<Locale, string>,
};

function getKeyword(pageSlug: string, lang: Locale): string {
  const pageKeywords = PAGE_KEYWORDS[pageSlug];
  if (pageKeywords && pageKeywords[lang]) {
    return pageKeywords[lang];
  }
  // Fallback to English keyword
  return pageKeywords?.en || `big bass crash ${pageSlug}`;
}

async function generateForPage(pageSlug: string, lang: Locale) {
  const keyword = getKeyword(pageSlug, lang);
  const langName = LOCALES[lang].name;

  console.log(`  Generating ${pageSlug} for ${lang} (${langName})...`);

  try {
    let content: string;
    let title: string;
    let metaTitle: string;
    let metaDescription: string;

    if (pageSlug === 'review') {
      content = await generateExpertReview(
        'James Thornton',
        'an iGaming expert with 10+ years of experience reviewing online casino games',
        langName,
        keyword,
      );
      title = `Big Bass Crash Game Review`;
      metaTitle = `${keyword} | Expert Analysis 2026`;
      metaDescription = `Read our expert review of Big Bass Crash by Pragmatic Play. In-depth analysis of RTP, volatility, features & where to play.`;
    } else {
      content = await generateArticle(langName, keyword, pageSlug);
      title = keyword.charAt(0).toUpperCase() + keyword.slice(1);
      metaTitle = `${title} | BigBassCrashGame.com 2026`;
      metaDescription = `Everything about ${keyword}. RTP, strategies, bonuses, where to play & more.`;
    }

    // Generate FAQs
    const faqs = await generateFaqs(langName, keyword, 8);

    // Upsert into DB
    const existing = db
      .select()
      .from(pageContent)
      .where(and(eq(pageContent.pageSlug, pageSlug), eq(pageContent.lang, lang)))
      .get();

    if (existing) {
      db.update(pageContent)
        .set({
          title,
          metaTitle,
          metaDescription,
          content,
          faqData: JSON.stringify(faqs),
          generatedByModel: 'x-ai/grok-4.1-fast',
          updatedAt: new Date(),
        })
        .where(eq(pageContent.id, existing.id))
        .run();
    } else {
      db.insert(pageContent)
        .values({
          pageSlug,
          lang,
          title,
          metaTitle,
          metaDescription,
          content,
          faqData: JSON.stringify(faqs),
          generatedByModel: 'x-ai/grok-4.1-fast',
          createdAt: new Date(),
          updatedAt: new Date(),
        })
        .run();
    }

    console.log(`  ✅ ${pageSlug}/${lang} done`);
  } catch (err) {
    console.error(`  ❌ ${pageSlug}/${lang} failed:`, err);
  }
}

async function main() {
  const args = process.argv.slice(2);
  const targetLang = args[0] as Locale | undefined;
  const targetPage = args[1];

  const pages = targetPage ? [targetPage] : ['home', 'play-free', 'where-to-play', 'review'];
  const languages = targetLang ? [targetLang] : ALL_LOCALES;

  console.log('🤖 Content Generation');
  console.log(`Pages: ${pages.join(', ')}`);
  console.log(`Languages: ${languages.length} total`);
  console.log('');

  for (const page of pages) {
    console.log(`📄 Page: ${page}`);
    for (const lang of languages) {
      await generateForPage(page, lang as Locale);
      // Rate limiting - wait between API calls
      await new Promise((r) => setTimeout(r, 3000));
    }
    console.log('');
  }

  console.log('✅ Content generation complete!');
}

main().catch(console.error);
