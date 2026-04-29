import type { APIRoute } from 'astro';
import { db } from '../../../lib/db/index';
import { casinos } from '../../../lib/db/schema';
import { eq } from 'drizzle-orm';
import { validateSession, SESSION_COOKIE_NAME } from '../../../lib/auth/session';

export const prerender = false;

export const PUT: APIRoute = async ({ params, request, cookies }) => {
  try {
    const token = cookies.get(SESSION_COOKIE_NAME)?.value;
    if (!validateSession(token)) {
      return new Response(
        JSON.stringify({ error: 'Unauthorized' }),
        { status: 401, headers: { 'Content-Type': 'application/json' } }
      );
    }

    const id = Number(params.id);
    if (isNaN(id)) {
      return new Response(
        JSON.stringify({ error: 'Invalid casino ID' }),
        { status: 400, headers: { 'Content-Type': 'application/json' } }
      );
    }

    const body = await request.json();

    // Build update object with only provided fields
    const updateData: Record<string, unknown> = { updatedAt: new Date() };

    if (body.name !== undefined) updateData.name = body.name;
    if (body.slug !== undefined) updateData.slug = body.slug;
    if (body.brandId !== undefined) updateData.brandId = body.brandId;
    if (body.logoPath !== undefined) updateData.logoPath = body.logoPath;
    if (body.affiliateUrl !== undefined) updateData.affiliateUrl = body.affiliateUrl;
    if (body.rating !== undefined) updateData.rating = body.rating;
    if (body.bonusText !== undefined) updateData.bonusText = body.bonusText;
    if (body.bonusAmount !== undefined) updateData.bonusAmount = body.bonusAmount;
    if (body.welcomeBonus !== undefined) updateData.welcomeBonus = body.welcomeBonus;
    if (body.freeSpins !== undefined) updateData.freeSpins = body.freeSpins;
    if (body.minDeposit !== undefined) updateData.minDeposit = body.minDeposit;
    if (body.license !== undefined) updateData.license = body.license;
    if (body.paymentMethods !== undefined) updateData.paymentMethods = typeof body.paymentMethods === 'string' ? body.paymentMethods : JSON.stringify(body.paymentMethods);
    if (body.pros !== undefined) updateData.pros = typeof body.pros === 'string' ? body.pros : JSON.stringify(body.pros);
    if (body.cons !== undefined) updateData.cons = typeof body.cons === 'string' ? body.cons : JSON.stringify(body.cons);
    if (body.description !== undefined) updateData.description = typeof body.description === 'string' ? body.description : JSON.stringify(body.description);
    if (body.badges !== undefined) updateData.badges = typeof body.badges === 'string' ? body.badges : JSON.stringify(body.badges);
    if (body.sortOrder !== undefined) updateData.sortOrder = body.sortOrder;
    if (body.isActive !== undefined) updateData.isActive = body.isActive;

    const updated = db
      .update(casinos)
      .set(updateData)
      .where(eq(casinos.id, id))
      .returning()
      .get();

    if (!updated) {
      return new Response(
        JSON.stringify({ error: 'Casino not found' }),
        { status: 404, headers: { 'Content-Type': 'application/json' } }
      );
    }

    return new Response(
      JSON.stringify({ casino: updated }),
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

export const DELETE: APIRoute = async ({ params, cookies }) => {
  try {
    const token = cookies.get(SESSION_COOKIE_NAME)?.value;
    if (!validateSession(token)) {
      return new Response(
        JSON.stringify({ error: 'Unauthorized' }),
        { status: 401, headers: { 'Content-Type': 'application/json' } }
      );
    }

    const id = Number(params.id);
    if (isNaN(id)) {
      return new Response(
        JSON.stringify({ error: 'Invalid casino ID' }),
        { status: 400, headers: { 'Content-Type': 'application/json' } }
      );
    }

    const deleted = db
      .delete(casinos)
      .where(eq(casinos.id, id))
      .returning()
      .get();

    if (!deleted) {
      return new Response(
        JSON.stringify({ error: 'Casino not found' }),
        { status: 404, headers: { 'Content-Type': 'application/json' } }
      );
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
