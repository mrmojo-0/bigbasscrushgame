import type { APIRoute } from 'astro';
import { db } from '../../../lib/db/index';
import { comments } from '../../../lib/db/schema';
import { eq, and, desc, sql } from 'drizzle-orm';

export const prerender = false;

export const GET: APIRoute = async ({ url }) => {
  try {
    const pageSlug = url.searchParams.get('page_slug');
    const lang = url.searchParams.get('lang');
    const page = Math.max(1, Number(url.searchParams.get('page')) || 1);
    const limit = Math.min(50, Math.max(1, Number(url.searchParams.get('limit')) || 10));
    const offset = (page - 1) * limit;

    // Build where conditions
    const conditions = [];
    if (pageSlug) conditions.push(eq(comments.pageSlug, pageSlug));
    if (lang) conditions.push(eq(comments.lang, lang));
    conditions.push(eq(comments.isVisible, true));

    const whereClause = conditions.length > 1 ? and(...conditions) : conditions[0];

    const rows = db
      .select()
      .from(comments)
      .where(whereClause)
      .orderBy(desc(comments.createdAt))
      .limit(limit + 1) // Fetch one extra to check if there are more
      .offset(offset)
      .all();

    const hasMore = rows.length > limit;
    const resultComments = hasMore ? rows.slice(0, limit) : rows;

    return new Response(
      JSON.stringify({ comments: resultComments, hasMore }),
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
