import type { APIRoute } from 'astro';
import { getDb } from '../../../lib/db/index';
import { validateSession, SESSION_COOKIE_NAME } from '../../../lib/auth/session';

export const prerender = false;

export const POST: APIRoute = async ({ cookies, locals }) => {
  try {
    const db = getDb(locals.runtime.env.DB);
    const token = cookies.get(SESSION_COOKIE_NAME)?.value;
    if (!await validateSession(db, token)) {
      return new Response(JSON.stringify({ error: 'Unauthorized' }), { status: 401, headers: { 'Content-Type': 'application/json' } });
    }

    const deployHook = locals.runtime.env.CF_PAGES_DEPLOY_HOOK;
    if (!deployHook) {
      return new Response(JSON.stringify({ error: 'CF_PAGES_DEPLOY_HOOK not configured' }), { status: 500, headers: { 'Content-Type': 'application/json' } });
    }

    const response = await fetch(deployHook, { method: 'POST' });
    return new Response(JSON.stringify({ success: response.ok }), { status: response.ok ? 200 : 500, headers: { 'Content-Type': 'application/json' } });
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Internal server error';
    return new Response(JSON.stringify({ error: message }), { status: 500, headers: { 'Content-Type': 'application/json' } });
  }
};
