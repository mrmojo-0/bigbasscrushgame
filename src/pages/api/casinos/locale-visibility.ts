import type { APIRoute } from 'astro';
import { getDb } from '../../../lib/db/index';
import { casinoLocaleSettings } from '../../../lib/db/schema';
import { eq, and } from 'drizzle-orm';
import { validateSession, SESSION_COOKIE_NAME } from '../../../lib/auth/session';

export const prerender = false;

export const PUT: APIRoute = async ({ request, cookies, locals }) => {
  try {
    const db = getDb(locals.runtime.env.DB);
    const token = cookies.get(SESSION_COOKIE_NAME)?.value;
    if (!await validateSession(db, token)) {
      return new Response(JSON.stringify({ error: 'Unauthorized' }), { status: 401, headers: { 'Content-Type': 'application/json' } });
    }

    const body = await request.json() as { casinoId: number; lang: string; isVisible: boolean };
    const { casinoId, lang, isVisible } = body;

    if (!casinoId || typeof casinoId !== 'number') {
      return new Response(JSON.stringify({ error: 'casinoId is required and must be a number' }), { status: 400, headers: { 'Content-Type': 'application/json' } });
    }
    if (!lang || typeof lang !== 'string') {
      return new Response(JSON.stringify({ error: 'lang is required and must be a string' }), { status: 400, headers: { 'Content-Type': 'application/json' } });
    }
    if (typeof isVisible !== 'boolean') {
      return new Response(JSON.stringify({ error: 'isVisible is required and must be a boolean' }), { status: 400, headers: { 'Content-Type': 'application/json' } });
    }

    const existing = await db.select().from(casinoLocaleSettings)
      .where(and(eq(casinoLocaleSettings.casinoId, casinoId), eq(casinoLocaleSettings.lang, lang)))
      .get();

    if (existing) {
      await db.update(casinoLocaleSettings).set({ isVisible, updatedAt: new Date() }).where(eq(casinoLocaleSettings.id, existing.id)).run();
    } else {
      await db.insert(casinoLocaleSettings).values({ casinoId, lang, sortOrder: 0, isVisible, createdAt: new Date(), updatedAt: new Date() }).run();
    }

    return new Response(JSON.stringify({ success: true }), { status: 200, headers: { 'Content-Type': 'application/json' } });
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Internal server error';
    return new Response(JSON.stringify({ error: message }), { status: 500, headers: { 'Content-Type': 'application/json' } });
  }
};
