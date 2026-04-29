import { db } from '../src/lib/db';
import { comments, agents } from '../src/lib/db/schema';
import { generateComment } from '../src/lib/ai/openrouter';
import { LOCALES, ALL_LOCALES, type Locale } from '../src/i18n/config';
import { eq, and, desc } from 'drizzle-orm';

const PAGES = ['home', 'play-free', 'where-to-play', 'review'];
const COMMENTS_PER_PAGE = 4;

const delay = (ms: number) => new Promise((r) => setTimeout(r, ms));

function randomDate(daysBack: number): Date {
  const now = Date.now();
  const past = now - daysBack * 24 * 60 * 60 * 1000;
  return new Date(past + Math.random() * (now - past));
}

async function main() {
  const targetLang = process.argv[2] as Locale | undefined;
  const targetPage = process.argv[3] as string | undefined;

  // Validate CLI args
  if (targetLang && !(targetLang in LOCALES)) {
    console.error(`Invalid locale: ${targetLang}`);
    console.error(`Available locales: ${ALL_LOCALES.join(', ')}`);
    process.exit(1);
  }

  if (targetPage && !PAGES.includes(targetPage)) {
    console.error(`Invalid page: ${targetPage}`);
    console.error(`Available pages: ${PAGES.join(', ')}`);
    process.exit(1);
  }

  // Get all active agents
  const activeAgents = db.select().from(agents).where(eq(agents.isActive, true)).all();
  if (activeAgents.length === 0) {
    console.error('No active agents found. Run seed-db first.');
    process.exit(1);
  }

  const langs = targetLang ? [targetLang] : ALL_LOCALES;
  const pages = targetPage ? [targetPage] : PAGES;

  const totalCombos = langs.length * pages.length;
  let current = 0;
  let generated = 0;
  let skipped = 0;

  console.log(`Generating comments for ${langs.length} languages x ${pages.length} pages = ${totalCombos} combinations`);
  console.log(`Target: ${COMMENTS_PER_PAGE} comments per page/language combo\n`);

  for (const page of pages) {
    for (const lang of langs) {
      current++;
      const langName = LOCALES[lang].name;

      // Count existing comments for this page/lang
      const existingComments = db
        .select()
        .from(comments)
        .where(and(eq(comments.pageSlug, page), eq(comments.lang, lang)))
        .orderBy(desc(comments.createdAt))
        .all();

      const existingCount = existingComments.length;
      const needed = COMMENTS_PER_PAGE - existingCount;

      if (needed <= 0) {
        console.log(`[${current}/${totalCombos}] ${page}/${lang} - already has ${existingCount} comments, skipping`);
        skipped++;
        continue;
      }

      console.log(`[${current}/${totalCombos}] Generating ${needed} comment(s) for ${page}/${lang} (${langName})...`);

      for (let i = 0; i < needed; i++) {
        // Pick a random agent
        const agent = activeAgents[Math.floor(Math.random() * activeAgents.length)];

        // Get existing comment texts for context (to avoid repetition)
        const existingTexts = existingComments.map((c) => c.content);

        try {
          // Pass full language name instead of code for better AI output
          const content = await generateComment(
            agent.personality,
            page,
            langName,
            existingTexts,
          );

          db.insert(comments)
            .values({
              pageSlug: page,
              lang,
              agentId: agent.id,
              authorName: agent.name,
              authorAvatar: agent.avatar,
              content,
              rating: Math.floor(Math.random() * 2) + 4, // 4 or 5
              isVisible: true,
              createdAt: randomDate(30),
            })
            .run();

          // Add the new comment to existing texts so next iteration avoids repeating
          existingTexts.push(content);
          generated++;

          console.log(`  [OK] Comment ${i + 1}/${needed} by ${agent.name}`);

          // Rate limit: 3 second delay between API calls
          await delay(3000);
        } catch (err) {
          console.error(`  [ERROR] Failed to generate comment ${i + 1}/${needed}:`, err);
        }
      }
    }
  }

  console.log(`\nDone! Generated: ${generated}, Skipped: ${skipped} (already had enough comments)`);
}

main().catch((err) => {
  console.error('Fatal error:', err);
  process.exit(1);
});
