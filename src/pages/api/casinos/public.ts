import type { APIRoute } from 'astro';
import { db } from '../../../lib/db/index';
import { casinos, casinoLocaleSettings } from '../../../lib/db/schema';
import { eq, and, asc } from 'drizzle-orm';

export const prerender = false;

export const GET: APIRoute = async ({ url }) => {
  try {
    const lang = url.searchParams.get('lang') || 'en';

    // Try locale-specific ordering first
    const localeResults = db
      .select({
        id: casinos.id,
        name: casinos.name,
        slug: casinos.slug,
        brandId: casinos.brandId,
        logoPath: casinos.logoPath,
        affiliateUrl: casinos.affiliateUrl,
        rating: casinos.rating,
        bonusText: casinos.bonusText,
        bonusAmount: casinos.bonusAmount,
        welcomeBonus: casinos.welcomeBonus,
        freeSpins: casinos.freeSpins,
        minDeposit: casinos.minDeposit,
        license: casinos.license,
        paymentMethods: casinos.paymentMethods,
        pros: casinos.pros,
        cons: casinos.cons,
        description: casinos.description,
        badges: casinos.badges,
        sortOrder: casinoLocaleSettings.sortOrder,
      })
      .from(casinos)
      .innerJoin(
        casinoLocaleSettings,
        and(
          eq(casinoLocaleSettings.casinoId, casinos.id),
          eq(casinoLocaleSettings.lang, lang),
          eq(casinoLocaleSettings.isVisible, true),
        )
      )
      .where(eq(casinos.isActive, true))
      .orderBy(asc(casinoLocaleSettings.sortOrder))
      .all();

    // Fallback to global sort order if no locale settings exist
    if (localeResults.length === 0) {
      const globalResults = db
        .select()
        .from(casinos)
        .where(eq(casinos.isActive, true))
        .orderBy(asc(casinos.sortOrder))
        .all();

      return new Response(
        JSON.stringify({ casinos: globalResults }),
        { status: 200, headers: { 'Content-Type': 'application/json' } }
      );
    }

    return new Response(
      JSON.stringify({ casinos: localeResults }),
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
