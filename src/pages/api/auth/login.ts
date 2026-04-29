import type { APIRoute } from 'astro';
import { getDb } from '../../../lib/db/index';
import { settings } from '../../../lib/db/schema';
import { eq } from 'drizzle-orm';
import { compare } from 'bcryptjs';
import { createSession, SESSION_COOKIE_NAME, getSessionCookieOptions } from '../../../lib/auth/session';

export const prerender = false;

export const POST: APIRoute = async ({ request, cookies, locals }) => {
  try {
    const db = getDb(locals.runtime.env.DB);
    const body = await request.json() as { password?: string };
    const { password } = body;

    if (!password) {
      return new Response(JSON.stringify({ error: 'Password is required' }), { status: 400, headers: { 'Content-Type': 'application/json' } });
    }

    const hashRow = await db.select().from(settings).where(eq(settings.key, 'admin_password_hash')).get();
    if (!hashRow) {
      return new Response(JSON.stringify({ error: 'Admin password not configured' }), { status: 500, headers: { 'Content-Type': 'application/json' } });
    }

    const isValid = await compare(password, hashRow.value);
    if (!isValid) {
      return new Response(JSON.stringify({ error: 'Invalid password' }), { status: 401, headers: { 'Content-Type': 'application/json' } });
    }

    const token = await createSession(db);
    cookies.set(SESSION_COOKIE_NAME, token, getSessionCookieOptions());

    return new Response(JSON.stringify({ success: true }), { status: 200, headers: { 'Content-Type': 'application/json' } });
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Internal server error';
    return new Response(JSON.stringify({ error: message }), { status: 500, headers: { 'Content-Type': 'application/json' } });
  }
};
