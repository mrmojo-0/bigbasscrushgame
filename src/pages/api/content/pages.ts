import type { APIRoute } from 'astro';
import { getDb } from '../../../lib/db/index';
import { pageContent } from '../../../lib/db/schema';
import { eq, and } from 'drizzle-orm';
import { validateSession, SESSION_COOKIE_NAME } from '../../../lib/auth/session';

export const prerender = false;

export const GET: APIRoute = async ({ url, cookies, locals }) => {
  try {
    const db = getDb(locals.runtime.env.DB);
    const token = cookies.get(SESSION_COOKIE_NAME)?.value;
    if (!await validateSession(db, token)) {
      return new Response(JSON.stringify({ error: 'Unauthorized' }), { status: 401, headers: { 'Content-Type': 'application/json' } });
    }

    const pageSlug = url.searchParams.get('page_slug');
    const lang = url.searchParams.get('lang');

    if (!pageSlug || !lang) {
      return new Response(JSON.stringify({ error: 'page_slug and lang query params are required' }), { status: 400, headers: { 'Content-Type': 'application/json' } });
    }

    const content = await db.select().from(pageContent)
      .where(and(eq(pageContent.pageSlug, pageSlug), eq(pageContent.lang, lang)))
      .get();

    if (!content) return new Response(JSON.stringify({ error: 'Page content not found' }), { status: 404, headers: { 'Content-Type': 'application/json' } });

    return new Response(JSON.stringify({ pageContent: content }), { status: 200, headers: { 'Content-Type': 'application/json' } });
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Internal server error';
    return new Response(JSON.stringify({ error: message }), { status: 500, headers: { 'Content-Type': 'application/json' } });
  }
};

export const PUT: APIRoute = async ({ request, cookies, locals }) => {
  try {
    const db = getDb(locals.runtime.env.DB);
    const token = cookies.get(SESSION_COOKIE_NAME)?.value;
    if (!await validateSession(db, token)) {
      return new Response(JSON.stringify({ error: 'Unauthorized' }), { status: 401, headers: { 'Content-Type': 'application/json' } });
    }

    const body = await request.json() as { pageSlug: string; lang: string; title?: string; metaTitle?: string; metaDescription?: string; content?: string; faqData?: unknown };
    const { pageSlug, lang, title, metaTitle, metaDescription, content, faqData } = body;

    if (!pageSlug || !lang) {
      return new Response(JSON.stringify({ error: 'pageSlug and lang are required' }), { status: 400, headers: { 'Content-Type': 'application/json' } });
    }

    const existing = await db.select().from(pageContent)
      .where(and(eq(pageContent.pageSlug, pageSlug), eq(pageContent.lang, lang)))
      .get();

    if (!existing) return new Response(JSON.stringify({ error: 'Page content not found' }), { status: 404, headers: { 'Content-Type': 'application/json' } });

    const updateData: Record<string, unknown> = { updatedAt: new Date() };
    if (title !== undefined) updateData.title = title;
    if (metaTitle !== undefined) updateData.metaTitle = metaTitle;
    if (metaDescription !== undefined) updateData.metaDescription = metaDescription;
    if (content !== undefined) updateData.content = content;
    if (faqData !== undefined) updateData.faqData = typeof faqData === 'string' ? faqData : JSON.stringify(faqData);

    const updated = await db.update(pageContent).set(updateData).where(eq(pageContent.id, existing.id)).returning().get();
    return new Response(JSON.stringify({ pageContent: updated }), { status: 200, headers: { 'Content-Type': 'application/json' } });
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Internal server error';
    return new Response(JSON.stringify({ error: message }), { status: 500, headers: { 'Content-Type': 'application/json' } });
  }
};
