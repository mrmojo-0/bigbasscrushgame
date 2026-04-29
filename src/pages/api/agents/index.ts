import type { APIRoute } from 'astro';
import { getDb } from '../../../lib/db/index';
import { agents } from '../../../lib/db/schema';
import { validateSession, SESSION_COOKIE_NAME } from '../../../lib/auth/session';

export const prerender = false;

export const GET: APIRoute = async ({ cookies, locals }) => {
  try {
    const db = getDb(locals.runtime.env.DB);
    const token = cookies.get(SESSION_COOKIE_NAME)?.value;
    if (!await validateSession(db, token)) {
      return new Response(JSON.stringify({ error: 'Unauthorized' }), { status: 401, headers: { 'Content-Type': 'application/json' } });
    }

    const allAgents = await db.select().from(agents).all();
    return new Response(JSON.stringify({ agents: allAgents }), { status: 200, headers: { 'Content-Type': 'application/json' } });
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Internal server error';
    return new Response(JSON.stringify({ error: message }), { status: 500, headers: { 'Content-Type': 'application/json' } });
  }
};

export const POST: APIRoute = async ({ request, cookies, locals }) => {
  try {
    const db = getDb(locals.runtime.env.DB);
    const token = cookies.get(SESSION_COOKIE_NAME)?.value;
    if (!await validateSession(db, token)) {
      return new Response(JSON.stringify({ error: 'Unauthorized' }), { status: 401, headers: { 'Content-Type': 'application/json' } });
    }

    const body = await request.json() as Record<string, unknown>;
    if (!body.name || !body.personality) {
      return new Response(JSON.stringify({ error: 'name and personality are required' }), { status: 400, headers: { 'Content-Type': 'application/json' } });
    }

    const created = await db.insert(agents).values({
      name: body.name as string,
      avatar: (body.avatar as string) || null,
      personality: body.personality as string,
      style: (body.style as string) || null,
      languages: body.languages ? JSON.stringify(body.languages) : null,
      isActive: (body.isActive as boolean) ?? true,
      createdAt: new Date(),
    }).returning().get();

    return new Response(JSON.stringify({ agent: created }), { status: 201, headers: { 'Content-Type': 'application/json' } });
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Internal server error';
    return new Response(JSON.stringify({ error: message }), { status: 500, headers: { 'Content-Type': 'application/json' } });
  }
};
