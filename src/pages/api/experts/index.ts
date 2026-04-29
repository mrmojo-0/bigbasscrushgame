import type { APIRoute } from 'astro';
import { db } from '../../../lib/db/index';
import { experts } from '../../../lib/db/schema';
import { validateSession, SESSION_COOKIE_NAME } from '../../../lib/auth/session';

export const prerender = false;

export const GET: APIRoute = async ({ cookies }) => {
  try {
    const token = cookies.get(SESSION_COOKIE_NAME)?.value;
    if (!validateSession(token)) {
      return new Response(
        JSON.stringify({ error: 'Unauthorized' }),
        { status: 401, headers: { 'Content-Type': 'application/json' } }
      );
    }

    const allExperts = db.select().from(experts).all();

    return new Response(
      JSON.stringify({ experts: allExperts }),
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

export const POST: APIRoute = async ({ request, cookies }) => {
  try {
    const token = cookies.get(SESSION_COOKIE_NAME)?.value;
    if (!validateSession(token)) {
      return new Response(
        JSON.stringify({ error: 'Unauthorized' }),
        { status: 401, headers: { 'Content-Type': 'application/json' } }
      );
    }

    const body = await request.json();

    if (!body.lang || !body.name || !body.bio) {
      return new Response(
        JSON.stringify({ error: 'lang, name, and bio are required' }),
        { status: 400, headers: { 'Content-Type': 'application/json' } }
      );
    }

    const created = db
      .insert(experts)
      .values({
        lang: body.lang,
        name: body.name,
        avatarPath: body.avatarPath || null,
        title: body.title || null,
        bio: body.bio,
        credentials: body.credentials ? JSON.stringify(body.credentials) : null,
        socialLinks: body.socialLinks ? JSON.stringify(body.socialLinks) : null,
        createdAt: new Date(),
        updatedAt: new Date(),
      })
      .returning()
      .get();

    return new Response(
      JSON.stringify({ expert: created }),
      { status: 201, headers: { 'Content-Type': 'application/json' } }
    );
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Internal server error';
    return new Response(
      JSON.stringify({ error: message }),
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    );
  }
};
