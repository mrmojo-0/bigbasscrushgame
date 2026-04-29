import type { APIRoute } from 'astro';
import { db } from '../../../lib/db/index';
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

export const GET: APIRoute = async ({ cookies }) => {
  try {
    const token = cookies.get(SESSION_COOKIE_NAME)?.value;
    if (!validateSession(token)) {
      return new Response(
        JSON.stringify({ error: 'Unauthorized' }),
        { status: 401, headers: { 'Content-Type': 'application/json' } }
      );
    }

    const allSettings = db.select().from(settings).all();

    // Mask sensitive values
    const masked = allSettings.map((s) => ({
      ...s,
      value: maskValue(s.key, s.value),
    }));

    return new Response(
      JSON.stringify({ settings: masked }),
      { status: 200, headers: { 'Content-Type': 'application/json' } }
    );
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Internal server error';
    return new Response(
      JSON.stringify({ error: message }),
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    );
  }
};

export const PUT: APIRoute = async ({ request, cookies }) => {
  try {
    const token = cookies.get(SESSION_COOKIE_NAME)?.value;
    if (!validateSession(token)) {
      return new Response(
        JSON.stringify({ error: 'Unauthorized' }),
        { status: 401, headers: { 'Content-Type': 'application/json' } }
      );
    }

    const body = await request.json();
    const entries = body as Record<string, string>;

    if (!entries || typeof entries !== 'object') {
      return new Response(
        JSON.stringify({ error: 'Request body must be an object of key-value pairs' }),
        { status: 400, headers: { 'Content-Type': 'application/json' } }
      );
    }

    const updated: Array<{ key: string; value: string }> = [];

    for (const [key, value] of Object.entries(entries)) {
      // Skip if value hasn't changed (masked values start with ******** )
      if (typeof value === 'string' && value.startsWith('********')) {
        continue;
      }

      // Upsert: try update first, insert if not exists
      const existing = db
        .select()
        .from(settings)
        .where(eq(settings.key, key))
        .get();

      if (existing) {
        db.update(settings)
          .set({ value: String(value), updatedAt: new Date() })
          .where(eq(settings.key, key))
          .run();
      } else {
        db.insert(settings)
          .values({ key, value: String(value), updatedAt: new Date() })
          .run();
      }

      updated.push({ key, value: maskValue(key, String(value)) });
    }

    return new Response(
      JSON.stringify({ success: true, updated }),
      { status: 200, headers: { 'Content-Type': 'application/json' } }
    );
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Internal server error';
    return new Response(
      JSON.stringify({ error: message }),
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    );
  }
};
