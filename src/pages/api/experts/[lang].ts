import type { APIRoute } from 'astro';
import { getDb } from '../../../lib/db/index';
import { experts } from '../../../lib/db/schema';
import { eq } from 'drizzle-orm';
import { validateSession, SESSION_COOKIE_NAME } from '../../../lib/auth/session';

export const prerender = false;

export const GET: APIRoute = async ({ params, cookies, locals }) => {
  try {
    const db = getDb(locals.runtime.env.DB);
    const token = cookies.get(SESSION_COOKIE_NAME)?.value;
    if (!await validateSession(db, token)) {
      return new Response(JSON.stringify({ error: 'Unauthorized' }), { status: 401, headers: { 'Content-Type': 'application/json' } });
    }

    const lang = params.lang;
    if (!lang) return new Response(JSON.stringify({ error: 'Language parameter is required' }), { status: 400, headers: { 'Content-Type': 'application/json' } });

    const expert = await db.select().from(experts).where(eq(experts.lang, lang)).get();
    if (!expert) return new Response(JSON.stringify({ error: 'Expert not found for this language' }), { status: 404, headers: { 'Content-Type': 'application/json' } });

    return new Response(JSON.stringify({ expert }), { status: 200, headers: { 'Content-Type': 'application/json' } });
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Internal server error';
    return new Response(JSON.stringify({ error: message }), { status: 500, headers: { 'Content-Type': 'application/json' } });
  }
};

export const PUT: APIRoute = async ({ params, request, cookies, locals }) => {
  try {
    const db = getDb(locals.runtime.env.DB);
    const token = cookies.get(SESSION_COOKIE_NAME)?.value;
    if (!await validateSession(db, token)) {
      return new Response(JSON.stringify({ error: 'Unauthorized' }), { status: 401, headers: { 'Content-Type': 'application/json' } });
    }

    const lang = params.lang;
    if (!lang) return new Response(JSON.stringify({ error: 'Language parameter is required' }), { status: 400, headers: { 'Content-Type': 'application/json' } });

    const body = await request.json() as Record<string, unknown>;
    const updateData: Record<string, unknown> = { updatedAt: new Date() };
    if (body.name !== undefined) updateData.name = body.name;
    if (body.avatarPath !== undefined) updateData.avatarPath = body.avatarPath;
    if (body.title !== undefined) updateData.title = body.title;
    if (body.bio !== undefined) updateData.bio = body.bio;
    if (body.credentials !== undefined) updateData.credentials = typeof body.credentials === 'string' ? body.credentials : JSON.stringify(body.credentials);
    if (body.socialLinks !== undefined) updateData.socialLinks = typeof body.socialLinks === 'string' ? body.socialLinks : JSON.stringify(body.socialLinks);

    const updated = await db.update(experts).set(updateData).where(eq(experts.lang, lang)).returning().get();
    if (!updated) return new Response(JSON.stringify({ error: 'Expert not found for this language' }), { status: 404, headers: { 'Content-Type': 'application/json' } });

    return new Response(JSON.stringify({ expert: updated }), { status: 200, headers: { 'Content-Type': 'application/json' } });
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Internal server error';
    return new Response(JSON.stringify({ error: message }), { status: 500, headers: { 'Content-Type': 'application/json' } });
  }
};
