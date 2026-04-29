import type { APIRoute } from 'astro';
import { db } from '../../../lib/db/index';
import { casinos } from '../../../lib/db/schema';
import { eq } from 'drizzle-orm';
import { validateSession, SESSION_COOKIE_NAME } from '../../../lib/auth/session';

export const prerender = false;

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
    const { ids } = body as { ids: number[] };

    if (!Array.isArray(ids) || ids.length === 0) {
      return new Response(
        JSON.stringify({ error: 'ids must be a non-empty array of numbers' }),
        { status: 400, headers: { 'Content-Type': 'application/json' } }
      );
    }

    // Update sortOrder for each casino based on its position in the array
    for (let i = 0; i < ids.length; i++) {
      db.update(casinos)
        .set({ sortOrder: i, updatedAt: new Date() })
        .where(eq(casinos.id, ids[i]))
        .run();
    }

    return new Response(
      JSON.stringify({ success: true }),
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
