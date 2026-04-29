import type { APIRoute } from 'astro';
import { db } from '../../../lib/db/index';
import { pageContent } from '../../../lib/db/schema';
import { eq, and } from 'drizzle-orm';
import { validateSession, SESSION_COOKIE_NAME } from '../../../lib/auth/session';
import { generateArticle } from '../../../lib/ai/openrouter';

export const prerender = false;

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
    const { pageSlug, lang, keyword } = body as {
      pageSlug: string;
      lang: string;
      keyword: string;
    };

    if (!pageSlug || !lang || !keyword) {
      return new Response(
        JSON.stringify({ error: 'pageSlug, lang, and keyword are required' }),
        { status: 400, headers: { 'Content-Type': 'application/json' } }
      );
    }

    // Generate article content using AI
    const generatedContent = await generateArticle(lang, keyword, pageSlug);

    // Check if page content already exists for this slug + lang
    const existing = db
      .select()
      .from(pageContent)
      .where(and(eq(pageContent.pageSlug, pageSlug), eq(pageContent.lang, lang)))
      .get();

    let result;
    if (existing) {
      // Update existing content
      result = db
        .update(pageContent)
        .set({
          content: generatedContent,
          generatedByModel: 'openrouter',
          updatedAt: new Date(),
        })
        .where(eq(pageContent.id, existing.id))
        .returning()
        .get();
    } else {
      // Create new page content
      result = db
        .insert(pageContent)
        .values({
          pageSlug,
          lang,
          title: keyword,
          content: generatedContent,
          generatedByModel: 'openrouter',
          createdAt: new Date(),
          updatedAt: new Date(),
        })
        .returning()
        .get();
    }

    return new Response(
      JSON.stringify({ pageContent: result }),
      { status: existing ? 200 : 201, headers: { 'Content-Type': 'application/json' } }
    );
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Internal server error';
    return new Response(
      JSON.stringify({ error: message }),
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    );
  }
};
