import type { APIRoute } from 'astro';
import { getDb } from '../../../lib/db/index';
import { settings } from '../../../lib/db/schema';
import { eq } from 'drizzle-orm';
import { validateSession, SESSION_COOKIE_NAME } from '../../../lib/auth/session';

export const prerender = false;

const SENSITIVE_KEYS = ['openrouter_api_key'];

function maskValue(key: string, value: string): string {
  if (SENSITIVE_KEYS.includes(key) && value.length > 8) {
    return '********' + value.slice(-8);
  }
  return value;
}

export const GET: APIRoute = async ({ cookies, locals }) => {
  try {
    const db = getDb(locals.runtime.env.DB);
    const token = cookies.get(SESSION_COOKIE_NAME)?.value;
    if (!await validateSession(db, token)) {
      return new Response(JSON.stringify({ error: 'Unauthorized' }), { status: 401, headers: { 'Content-Type': 'application/json' } });
    }

    const allSettings = await db.select().from(settings).all();
    const masked = allSettings.map(s => ({ ...s, value: maskValue(s.key, s.value) }));
    return new Response(JSON.stringify({ settings: masked }), { status: 200, headers: { 'Content-Type': 'application/json' } });
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Internal server error';
    return new Response(JSON.stringify({ error: message }), { status: 500, headers: { 'Content-Type': 'application/json' } });
  }
};

export const PUT: APIRoute = async ({ request, cookies, locals }) => {
  try {
    const db = getDb(locals.runtime.env.DB);
    const token = cookies.get(SESSION_COOKIE_NAME)?.value;
    if (!await validateSession(db, token)) {
      return new Response(JSON.stringify({ error: 'Unauthorized' }), { status: 401, headers: { 'Content-Type': 'application/json' } });
    }

    const entries = await request.json() as Record<string, string>;
    if (!entries || typeof entries !== 'object') {
      return new Response(JSON.stringify({ error: 'Request body must be an object of key-value pairs' }), { status: 400, headers: { 'Content-Type': 'application/json' } });
    }

    const updated: Array<{ key: string; value: string }> = [];

    for (const [key, value] of Object.entries(entries)) {
      if (typeof value === 'string' && value.startsWith('********')) continue;

      const existing = await db.select().from(settings).where(eq(settings.key, key)).get();
      if (existing) {
        await db.update(settings).set({ value: String(value), updatedAt: new Date() }).where(eq(settings.key, key)).run();
      } else {
        await db.insert(settings).values({ key, value: String(value), updatedAt: new Date() }).run();
      }
      updated.push({ key, value: maskValue(key, String(value)) });
    }

    return new Response(JSON.stringify({ success: true, updated }), { status: 200, headers: { 'Content-Type': 'application/json' } });
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Internal server error';
    return new Response(JSON.stringify({ error: message }), { status: 500, headers: { 'Content-Type': 'application/json' } });
  }
};
