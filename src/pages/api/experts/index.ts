import type { APIRoute } from 'astro';
import { getDb } from '../../../lib/db/index';
import { experts } from '../../../lib/db/schema';
import { validateSession, SESSION_COOKIE_NAME } from '../../../lib/auth/session';

export const prerender = false;

export const GET: APIRoute = async ({ cookies, locals }) => {
  try {
    const db = getDb(locals.runtime.env.DB);
    const token = cookies.get(SESSION_COOKIE_NAME)?.value;
    if (!await validateSession(db, token)) {
      return new Response(JSON.stringify({ error: 'Unauthorized' }), { status: 401, headers: { 'Content-Type': 'application/json' } });
    }

    const allExperts = await db.select().from(experts).all();
    return new Response(JSON.stringify({ experts: allExperts }), { status: 200, headers: { 'Content-Type': 'application/json' } });
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
    if (!body.lang || !body.name || !body.bio) {
      return new Response(JSON.stringify({ error: 'lang, name, and bio are required' }), { status: 400, headers: { 'Content-Type': 'application/json' } });
    }

    const created = await db.insert(experts).values({
      lang: body.lang as string,
      name: body.name as string,
      avatarPath: (body.avatarPath as string) || null,
      title: (body.title as string) || null,
      bio: body.bio as string,
      credentials: body.credentials ? JSON.stringify(body.credentials) : null,
      socialLinks: body.socialLinks ? JSON.stringify(body.socialLinks) : null,
      createdAt: new Date(),
      updatedAt: new Date(),
    }).returning().get();

    return new Response(JSON.stringify({ expert: created }), { status: 201, headers: { 'Content-Type': 'application/json' } });
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Internal server error';
    return new Response(JSON.stringify({ error: message }), { status: 500, headers: { 'Content-Type': 'application/json' } });
  }
};
