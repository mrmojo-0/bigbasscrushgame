import type { APIRoute } from 'astro';
import { getDb } from '../../../lib/db/index';
import { destroySession, SESSION_COOKIE_NAME } from '../../../lib/auth/session';

export const prerender = false;

export const POST: APIRoute = async ({ cookies, locals }) => {
  try {
    const db = getDb(locals.runtime.env.DB);
    const token = cookies.get(SESSION_COOKIE_NAME)?.value;
    if (token) await destroySession(db, token);
    cookies.delete(SESSION_COOKIE_NAME, { path: '/' });
    return new Response(JSON.stringify({ success: true }), { status: 200, headers: { 'Content-Type': 'application/json' } });
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Internal server error';
    return new Response(JSON.stringify({ error: message }), { status: 500, headers: { 'Content-Type': 'application/json' } });
  }
};
