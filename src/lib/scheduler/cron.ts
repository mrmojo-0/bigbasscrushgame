import type { DrizzleD1 } from '../db/index';
import { agents, comments, settings } from '../db/schema';
import { eq, and, desc } from 'drizzle-orm';
import { generateComment } from '../ai/openrouter';
import { LOCALES, type Locale } from '../../i18n/config';

const PAGES = ['home', 'play-free', 'where-to-play', 'review'];

export async function triggerCommentGeneration(db: DrizzleD1): Promise<string> {
  const enabledSetting = await db.select().from(settings).where(eq(settings.key, 'comment_generation_enabled')).get();
  if (enabledSetting?.value === 'false') return 'disabled';

  const activeAgents = await db.select().from(agents).where(eq(agents.isActive, true)).all();
  if (activeAgents.length === 0) return 'no_agents';

  const count = Math.min(activeAgents.length, Math.floor(Math.random() * 3) + 1);
  const shuffled = [...activeAgents].sort(() => Math.random() - 0.5).slice(0, count);

  for (const agent of shuffled) {
    const agentLangs: string[] = agent.languages ? JSON.parse(agent.languages) : ['en'];
    const lang = agentLangs[Math.floor(Math.random() * agentLangs.length)];
    const page = PAGES[Math.floor(Math.random() * PAGES.length)];

    const existing = await db.select().from(comments)
      .where(and(eq(comments.pageSlug, page), eq(comments.lang, lang)))
      .orderBy(desc(comments.createdAt))
      .limit(5)
      .all();

    try {
      const langName = (lang in LOCALES) ? LOCALES[lang as Locale].name : lang;
      const content = await generateComment(db, agent.personality, page, langName, existing.map(c => c.content));

      await db.insert(comments).values({
        pageSlug: page,
        lang,
        agentId: agent.id,
        authorName: agent.name,
        authorAvatar: agent.avatar,
        content,
        rating: Math.floor(Math.random() * 2) + 4,
        isVisible: true,
        createdAt: new Date(),
      }).run();

      await db.update(agents).set({ lastGeneratedAt: new Date() }).where(eq(agents.id, agent.id)).run();
    } catch (err) {
      console.error(`[Cron] Failed for agent ${agent.name}:`, err);
    }
  }

  return 'done';
}
