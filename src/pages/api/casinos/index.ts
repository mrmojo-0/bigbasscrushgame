import type { APIRoute } from 'astro';
import { db } from '../../../lib/db/index';
import { casinos } from '../../../lib/db/schema';
import { asc } from 'drizzle-orm';
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

    const allCasinos = db
      .select()
      .from(casinos)
      .orderBy(asc(casinos.sortOrder))
      .all();

    return new Response(
      JSON.stringify({ casinos: allCasinos }),
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

    const created = db
      .insert(casinos)
      .values({
        name: body.name,
        slug: body.slug,
        brandId: body.brandId,
        logoPath: body.logoPath || null,
        affiliateUrl: body.affiliateUrl || null,
        rating: body.rating ?? 4.5,
        bonusText: body.bonusText || null,
        bonusAmount: body.bonusAmount || null,
        welcomeBonus: body.welcomeBonus || null,
        freeSpins: body.freeSpins || null,
        minDeposit: body.minDeposit || null,
        license: body.license || null,
        paymentMethods: body.paymentMethods ? JSON.stringify(body.paymentMethods) : null,
        pros: body.pros ? JSON.stringify(body.pros) : null,
        cons: body.cons ? JSON.stringify(body.cons) : null,
        description: body.description ? JSON.stringify(body.description) : null,
        badges: body.badges ? JSON.stringify(body.badges) : null,
        sortOrder: body.sortOrder ?? 0,
        isActive: body.isActive ?? true,
        createdAt: new Date(),
        updatedAt: new Date(),
      })
      .returning()
      .get();

    return new Response(
      JSON.stringify({ casino: created }),
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
