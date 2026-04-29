import type { APIRoute } from 'astro';
import { getDb } from '../../../lib/db/index';
import { casinos } from '../../../lib/db/schema';
import { asc } from 'drizzle-orm';
import { validateSession, SESSION_COOKIE_NAME } from '../../../lib/auth/session';

export const prerender = false;

export const GET: APIRoute = async ({ cookies, locals }) => {
  try {
    const db = getDb(locals.runtime.env.DB);
    const token = cookies.get(SESSION_COOKIE_NAME)?.value;
    if (!await validateSession(db, token)) {
      return new Response(JSON.stringify({ error: 'Unauthorized' }), { status: 401, headers: { 'Content-Type': 'application/json' } });
    }

    const allCasinos = await db.select().from(casinos).orderBy(asc(casinos.sortOrder)).all();
    return new Response(JSON.stringify({ casinos: allCasinos }), { status: 200, headers: { 'Content-Type': 'application/json' } });
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Internal server error';
    return new Response(JSON.stringify({ error: message }), { status: 500, headers: { 'Content-Type': 'application/json' } });
  }
};

export const POST: APIRoute = async ({ request, cookies, locals }) => {
  try {
    const db = getDb(locals.runtime.env.DB);
    const token = cookies.get(SESSION_COOKIE_NAME)?.value;
    if (!await validateSession(db, token)) {
      return new Response(JSON.stringify({ error: 'Unauthorized' }), { status: 401, headers: { 'Content-Type': 'application/json' } });
    }

    const body = await request.json() as Record<string, unknown>;
    const created = await db.insert(casinos).values({
      name: body.name as string,
      slug: body.slug as string,
      brandId: body.brandId as string,
      logoPath: (body.logoPath as string) || null,
      affiliateUrl: (body.affiliateUrl as string) || null,
      rating: (body.rating as number) ?? 4.5,
      bonusText: (body.bonusText as string) || null,
      bonusAmount: (body.bonusAmount as string) || null,
      welcomeBonus: (body.welcomeBonus as string) || null,
      freeSpins: (body.freeSpins as string) || null,
      minDeposit: (body.minDeposit as string) || null,
      license: (body.license as string) || null,
      paymentMethods: body.paymentMethods ? JSON.stringify(body.paymentMethods) : null,
      pros: body.pros ? JSON.stringify(body.pros) : null,
      cons: body.cons ? JSON.stringify(body.cons) : null,
      description: body.description ? JSON.stringify(body.description) : null,
      badges: body.badges ? JSON.stringify(body.badges) : null,
      sortOrder: (body.sortOrder as number) ?? 0,
      isActive: (body.isActive as boolean) ?? true,
      createdAt: new Date(),
      updatedAt: new Date(),
    }).returning().get();

    return new Response(JSON.stringify({ casino: created }), { status: 201, headers: { 'Content-Type': 'application/json' } });
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Internal server error';
    return new Response(JSON.stringify({ error: message }), { status: 500, headers: { 'Content-Type': 'application/json' } });
  }
};
