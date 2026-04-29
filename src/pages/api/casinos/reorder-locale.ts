import type { APIRoute } from 'astro';
import { db } from '../../../lib/db/index';
import { casinoLocaleSettings } from '../../../lib/db/schema';
import { eq, and } from 'drizzle-orm';
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
    const { lang, ids } = body as { lang: string; ids: number[] };

    if (!lang || typeof lang !== 'string') {
      return new Response(
        JSON.stringify({ error: 'lang is required and must be a string' }),
        { status: 400, headers: { 'Content-Type': 'application/json' } }
      );
    }

    if (!Array.isArray(ids) || ids.length === 0) {
      return new Response(
        JSON.stringify({ error: 'ids must be a non-empty array of numbers' }),
        { status: 400, headers: { 'Content-Type': 'application/json' } }
      );
    }

    // Upsert locale settings for each casino in the given order
    for (let i = 0; i < ids.length; i++) {
      const existing = db
        .select()
        .from(casinoLocaleSettings)
        .where(
          and(
            eq(casinoLocaleSettings.casinoId, ids[i]),
            eq(casinoLocaleSettings.lang, lang),
          )
        )
        .get();

      if (existing) {
        db.update(casinoLocaleSettings)
          .set({ sortOrder: i, updatedAt: new Date() })
          .where(eq(casinoLocaleSettings.id, existing.id))
          .run();
      } else {
        db.insert(casinoLocaleSettings)
          .values({
            casinoId: ids[i],
            lang,
            sortOrder: i,
            isVisible: true,
            createdAt: new Date(),
            updatedAt: new Date(),
          })
          .run();
      }
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
