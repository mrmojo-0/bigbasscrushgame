import type { APIRoute } from 'astro';
import { db } from '../../../lib/db/index';
import { comments, agents } from '../../../lib/db/schema';
import { eq, and, desc } from 'drizzle-orm';
import { validateSession, SESSION_COOKIE_NAME } from '../../../lib/auth/session';
import { generateComment } from '../../../lib/ai/openrouter';

export const prerender = false;

export const POST: APIRoute = async ({ request, cookies }) => {
  try {
    const token = cookies.get(SESSION_COOKIE_NAME)?.value;
    if (!validateSession(token)) {
      return new Response(
        JSON.stringify({ error: 'Unauthorized' }),
        { status: 401, headers: { 'Content-Type': 'application/json' } }
      );
    }

    const body = await request.json();
    const { pageSlug, lang, agentId } = body as {
      pageSlug: string;
      lang: string;
      agentId?: number;
    };

    if (!pageSlug || !lang) {
      return new Response(
        JSON.stringify({ error: 'pageSlug and lang are required' }),
        { status: 400, headers: { 'Content-Type': 'application/json' } }
      );
    }

    // Get agent (either specified or random active one)
    let agent;
    if (agentId) {
      agent = db.select().from(agents).where(eq(agents.id, agentId)).get();
    } else {
      // Get a random active agent
      const activeAgents = db
        .select()
        .from(agents)
        .where(eq(agents.isActive, true))
        .all();

      if (activeAgents.length === 0) {
        return new Response(
          JSON.stringify({ error: 'No active agents available' }),
          { status: 400, headers: { 'Content-Type': 'application/json' } }
        );
      }

      agent = activeAgents[Math.floor(Math.random() * activeAgents.length)];
    }

    if (!agent) {
      return new Response(
        JSON.stringify({ error: 'Agent not found' }),
        { status: 404, headers: { 'Content-Type': 'application/json' } }
      );
    }

    // Get existing comments for context
    const existingComments = db
      .select({ content: comments.content })
      .from(comments)
      .where(and(eq(comments.pageSlug, pageSlug), eq(comments.lang, lang)))
      .orderBy(desc(comments.createdAt))
      .limit(10)
      .all();

    const existingTexts = existingComments.map((c) => c.content);

    // Generate comment using AI
    const generatedContent = await generateComment(
      agent.personality,
      pageSlug,
      lang,
      existingTexts
    );

    // Save to database
    const created = db
      .insert(comments)
      .values({
        pageSlug,
        lang,
        agentId: agent.id,
        authorName: agent.name,
        authorAvatar: agent.avatar,
        content: generatedContent,
        rating: Math.floor(Math.random() * 2) + 4, // Random 4 or 5
        isVisible: true,
        createdAt: new Date(),
      })
      .returning()
      .get();

    // Update agent's lastGeneratedAt
    db.update(agents)
      .set({ lastGeneratedAt: new Date() })
      .where(eq(agents.id, agent.id))
      .run();

    return new Response(
      JSON.stringify({ comment: created }),
      { status: 201, headers: { 'Content-Type': 'application/json' } }
    );
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Internal server error';
    return new Response(
      JSON.stringify({ error: message }),
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    );
  }
};
