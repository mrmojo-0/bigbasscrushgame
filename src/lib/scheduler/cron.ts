import cron from 'node-cron';
import { db } from '../db/index';
import { agents, comments, settings } from '../db/schema';
import { eq, and, desc } from 'drizzle-orm';
import { generateComment } from '../ai/openrouter';
import { ALL_LOCALES, LOCALES, type Locale } from '../../i18n/config';

let scheduledTask: cron.ScheduledTask | null = null;
let isRunning = false;

const PAGES = ['home', 'play-free', 'where-to-play', 'review'];

async function getInterval(): Promise<number> {
  try {
    const result = db
      .select()
      .from(settings)
      .where(eq(settings.key, 'comment_generation_interval_hours'))
      .get();
    return parseInt(result?.value || '4', 10);
  } catch {
    return 4;
  }
}

async function isEnabled(): Promise<boolean> {
  try {
    const result = db
      .select()
      .from(settings)
      .where(eq(settings.key, 'comment_generation_enabled'))
      .get();
    return result?.value !== 'false';
  } catch {
    return true;
  }
}

async function generateCommentsForAgent(agentRow: typeof agents.$inferSelect) {
  const agentLangs: string[] = agentRow.languages
    ? JSON.parse(agentRow.languages)
    : ['en'];

  // Pick random lang and page
  const lang = agentLangs[Math.floor(Math.random() * agentLangs.length)];
  const page = PAGES[Math.floor(Math.random() * PAGES.length)];

  // Get existing comments to avoid repetition
  const existing = db
    .select()
    .from(comments)
    .where(and(eq(comments.pageSlug, page), eq(comments.lang, lang)))
    .orderBy(desc(comments.createdAt))
    .limit(5)
    .all();

  try {
    const langName = (lang in LOCALES) ? LOCALES[lang as Locale].name : lang;
    const content = await generateComment(
      agentRow.personality,
      page,
      langName,
      existing.map((c) => c.content),
    );

    db.insert(comments)
      .values({
        pageSlug: page,
        lang,
        agentId: agentRow.id,
        authorName: agentRow.name,
        authorAvatar: agentRow.avatar,
        content,
        rating: Math.floor(Math.random() * 2) + 4, // 4-5
        isVisible: true,
        createdAt: new Date(),
      })
      .run();

    // Update agent's lastGeneratedAt
    db.update(agents)
      .set({ lastGeneratedAt: new Date() })
      .where(eq(agents.id, agentRow.id))
      .run();

    console.log(`[Scheduler] Generated comment by ${agentRow.name} for ${page}/${lang}`);
  } catch (err) {
    console.error(`[Scheduler] Failed to generate comment by ${agentRow.name}:`, err);
  }
}

async function runCommentGeneration() {
  if (isRunning) return;
  isRunning = true;

  try {
    const enabled = await isEnabled();
    if (!enabled) {
      console.log('[Scheduler] Comment generation is disabled');
      return;
    }

    const activeAgents = db
      .select()
      .from(agents)
      .where(eq(agents.isActive, true))
      .all();

    if (activeAgents.length === 0) {
      console.log('[Scheduler] No active agents found');
      return;
    }

    // Pick 1-3 random agents per run
    const count = Math.min(activeAgents.length, Math.floor(Math.random() * 3) + 1);
    const shuffled = activeAgents.sort(() => Math.random() - 0.5).slice(0, count);

    for (const agent of shuffled) {
      await generateCommentsForAgent(agent);
      // Small delay between agents
      await new Promise((r) => setTimeout(r, 2000));
    }
  } catch (err) {
    console.error('[Scheduler] Error in comment generation:', err);
  } finally {
    isRunning = false;
  }
}

export function startCommentScheduler() {
  if (scheduledTask) {
    console.log('[Scheduler] Already running');
    return;
  }

  // Run every N hours (default: 4)
  // For now, use a fixed cron expression; the interval is checked at runtime
  scheduledTask = cron.schedule('0 */4 * * *', async () => {
    await runCommentGeneration();
  });

  console.log('[Scheduler] Comment scheduler started (every 4 hours)');
}

export function stopCommentScheduler() {
  if (scheduledTask) {
    scheduledTask.stop();
    scheduledTask = null;
    console.log('[Scheduler] Comment scheduler stopped');
  }
}

export function isSchedulerRunning(): boolean {
  return scheduledTask !== null;
}

// Manual trigger
export async function triggerCommentGeneration() {
  await runCommentGeneration();
}
