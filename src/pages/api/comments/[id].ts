import type { APIRoute } from 'astro';
import { getDb } from '../../../lib/db/index';
import { comments } from '../../../lib/db/schema';
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
    if (isNaN(id)) return new Response(JSON.stringify({ error: 'Invalid comment ID' }), { status: 400, headers: { 'Content-Type': 'application/json' } });

    const body = await request.json() as Record<string, unknown>;
    const updateData: Record<string, unknown> = {};
    if (body.content !== undefined) updateData.content = body.content;
    if (body.isVisible !== undefined) updateData.isVisible = body.isVisible;
    if (body.rating !== undefined) updateData.rating = body.rating;
    if (body.authorName !== undefined) updateData.authorName = body.authorName;

    if (Object.keys(updateData).length === 0) {
      return new Response(JSON.stringify({ error: 'No fields to update' }), { status: 400, headers: { 'Content-Type': 'application/json' } });
    }

    const updated = await db.update(comments).set(updateData).where(eq(comments.id, id)).returning().get();
    if (!updated) return new Response(JSON.stringify({ error: 'Comment not found' }), { status: 404, headers: { 'Content-Type': 'application/json' } });

    return new Response(JSON.stringify({ comment: updated }), { status: 200, headers: { 'Content-Type': 'application/json' } });
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
    if (isNaN(id)) return new Response(JSON.stringify({ error: 'Invalid comment ID' }), { status: 400, headers: { 'Content-Type': 'application/json' } });

    const deleted = await db.delete(comments).where(eq(comments.id, id)).returning().get();
    if (!deleted) return new Response(JSON.stringify({ error: 'Comment not found' }), { status: 404, headers: { 'Content-Type': 'application/json' } });

    return new Response(JSON.stringify({ success: true }), { status: 200, headers: { 'Content-Type': 'application/json' } });
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Internal server error';
    return new Response(JSON.stringify({ error: message }), { status: 500, headers: { 'Content-Type': 'application/json' } });
  }
};
