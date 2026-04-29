import type { APIRoute } from 'astro';
import { getDb } from '../../../lib/db/index';
import { comments, agents } from '../../../lib/db/schema';
import { eq, and, desc } from 'drizzle-orm';
import { validateSession, SESSION_COOKIE_NAME } from '../../../lib/auth/session';
import { generateComment } from '../../../lib/ai/openrouter';

export const prerender = false;

export const POST: APIRoute = async ({ request, cookies, locals }) => {
  try {
    const db = getDb(locals.runtime.env.DB);
    const token = cookies.get(SESSION_COOKIE_NAME)?.value;
    if (!await validateSession(db, token)) {
      return new Response(JSON.stringify({ error: 'Unauthorized' }), { status: 401, headers: { 'Content-Type': 'application/json' } });
    }

    const body = await request.json() as { pageSlug: string; lang: string; agentId?: number };
    const { pageSlug, lang, agentId } = body;

    if (!pageSlug || !lang) {
      return new Response(JSON.stringify({ error: 'pageSlug and lang are required' }), { status: 400, headers: { 'Content-Type': 'application/json' } });
    }

    let agent;
    if (agentId) {
      agent = await db.select().from(agents).where(eq(agents.id, agentId)).get();
    } else {
      const activeAgents = await db.select().from(agents).where(eq(agents.isActive, true)).all();
      if (activeAgents.length === 0) {
        return new Response(JSON.stringify({ error: 'No active agents available' }), { status: 400, headers: { 'Content-Type': 'application/json' } });
      }
      agent = activeAgents[Math.floor(Math.random() * activeAgents.length)];
    }

    if (!agent) return new Response(JSON.stringify({ error: 'Agent not found' }), { status: 404, headers: { 'Content-Type': 'application/json' } });

    const existingComments = await db.select({ content: comments.content }).from(comments)
      .where(and(eq(comments.pageSlug, pageSlug), eq(comments.lang, lang)))
      .orderBy(desc(comments.createdAt))
      .limit(10)
      .all();

    const generatedContent = await generateComment(db, agent.personality, pageSlug, lang, existingComments.map(c => c.content));

    const created = await db.insert(comments).values({
      pageSlug,
      lang,
      agentId: agent.id,
      authorName: agent.name,
      authorAvatar: agent.avatar,
      content: generatedContent,
      rating: Math.floor(Math.random() * 2) + 4,
      isVisible: true,
      createdAt: new Date(),
    }).returning().get();

    await db.update(agents).set({ lastGeneratedAt: new Date() }).where(eq(agents.id, agent.id)).run();

    return new Response(JSON.stringify({ comment: created }), { status: 201, headers: { 'Content-Type': 'application/json' } });
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Internal server error';
    return new Response(JSON.stringify({ error: message }), { status: 500, headers: { 'Content-Type': 'application/json' } });
  }
};
