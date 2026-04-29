import { db } from './index';
import { casinos, casinoLocaleSettings } from './schema';
import { eq, and, asc } from 'drizzle-orm';

/**
 * Get casinos ordered by locale-specific sort order.
 * Falls back to global sort order if no locale settings exist.
 */
export function getCasinosForLocale(locale: string) {
  // Try locale-specific ordering first
  const results = db
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
      isActive: casinos.isActive,
      sortOrder: casinoLocaleSettings.sortOrder,
    })
    .from(casinos)
    .innerJoin(
      casinoLocaleSettings,
      and(
        eq(casinoLocaleSettings.casinoId, casinos.id),
        eq(casinoLocaleSettings.lang, locale),
        eq(casinoLocaleSettings.isVisible, true),
      )
    )
    .where(eq(casinos.isActive, true))
    .orderBy(asc(casinoLocaleSettings.sortOrder))
    .all();

  // Fallback to global sort order if no locale settings exist
  if (results.length === 0) {
    return db
      .select()
      .from(casinos)
      .where(eq(casinos.isActive, true))
      .orderBy(asc(casinos.sortOrder))
      .all();
  }

  return results;
}
