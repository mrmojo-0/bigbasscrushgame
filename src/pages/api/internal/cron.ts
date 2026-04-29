import type { APIRoute } from 'astro';
import { getDb } from '../../../lib/db/index';
import { triggerCommentGeneration } from '../../../lib/scheduler/cron';

export const prerender = false;

export const POST: APIRoute = async ({ request, locals }) => {
  try {
    const { env } = locals.runtime;
    const secret = request.headers.get('X-Cron-Secret');
    if (!secret || secret !== env.CRON_SECRET) {
      return new Response(JSON.stringify({ error: 'Unauthorized' }), { status: 401, headers: { 'Content-Type': 'application/json' } });
    }

    const db = getDb(env.DB);
    const result = await triggerCommentGeneration(db);
    return new Response(JSON.stringify({ success: true, result }), { status: 200, headers: { 'Content-Type': 'application/json' } });
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Internal server error';
    return new Response(JSON.stringify({ error: message }), { status: 500, headers: { 'Content-Type': 'application/json' } });
  }
};
