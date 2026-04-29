import type { APIRoute } from 'astro';
import { getDb } from '../../../lib/db/index';
import { agents } from '../../../lib/db/schema';
import { eq } from 'drizzle-orm';
import { validateSession, SESSION_COOKIE_NAME } from '../../../lib/auth/session';

export const prerender = false;

export const PUT: APIRoute = async ({ params, request, cookies, locals }) => {
  try {
    const db = getDb(locals.runtime.env.DB);
    const token = cookies.get(SESSION_COOKIE_NAME)?.value;
    if (!await validateSession(db, token)) {
      return new Response(JSON.stringify({ error: 'Unauthorized' }), { status: 401, headers: { 'Content-Type': 'application/json' } });
    }

    const id = Number(params.id);
    if (isNaN(id)) return new Response(JSON.stringify({ error: 'Invalid agent ID' }), { status: 400, headers: { 'Content-Type': 'application/json' } });

    const body = await request.json() as Record<string, unknown>;
    const updateData: Record<string, unknown> = {};
    if (body.name !== undefined) updateData.name = body.name;
    if (body.avatar !== undefined) updateData.avatar = body.avatar;
    if (body.personality !== undefined) updateData.personality = body.personality;
    if (body.style !== undefined) updateData.style = body.style;
    if (body.languages !== undefined) updateData.languages = typeof body.languages === 'string' ? body.languages : JSON.stringify(body.languages);
    if (body.isActive !== undefined) updateData.isActive = body.isActive;

    if (Object.keys(updateData).length === 0) {
      return new Response(JSON.stringify({ error: 'No fields to update' }), { status: 400, headers: { 'Content-Type': 'application/json' } });
    }

    const updated = await db.update(agents).set(updateData).where(eq(agents.id, id)).returning().get();
    if (!updated) return new Response(JSON.stringify({ error: 'Agent not found' }), { status: 404, headers: { 'Content-Type': 'application/json' } });

    return new Response(JSON.stringify({ agent: updated }), { status: 200, headers: { 'Content-Type': 'application/json' } });
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Internal server error';
    return new Response(JSON.stringify({ error: message }), { status: 500, headers: { 'Content-Type': 'application/json' } });
  }
};

export const DELETE: APIRoute = async ({ params, cookies, locals }) => {
  try {
    const db = getDb(locals.runtime.env.DB);
    const token = cookies.get(SESSION_COOKIE_NAME)?.value;
    if (!await validateSession(db, token)) {
      return new Response(JSON.stringify({ error: 'Unauthorized' }), { status: 401, headers: { 'Content-Type': 'application/json' } });
    }

    const id = Number(params.id);
    if (isNaN(id)) return new Response(JSON.stringify({ error: 'Invalid agent ID' }), { status: 400, headers: { 'Content-Type': 'application/json' } });

    const deleted = await db.delete(agents).where(eq(agents.id, id)).returning().get();
    if (!deleted) return new Response(JSON.stringify({ error: 'Agent not found' }), { status: 404, headers: { 'Content-Type': 'application/json' } });

    return new Response(JSON.stringify({ success: true }), { status: 200, headers: { 'Content-Type': 'application/json' } });
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Internal server error';
    return new Response(JSON.stringify({ error: message }), { status: 500, headers: { 'Content-Type': 'application/json' } });
  }
};
