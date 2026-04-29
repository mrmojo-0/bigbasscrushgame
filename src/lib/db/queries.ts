import type { DrizzleD1 } from './index';
import { casinos, casinoLocaleSettings } from './schema';
import { eq, and, asc } from 'drizzle-orm';

export async function getCasinosForLocale(db: DrizzleD1, locale: string) {
  const results = await db
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
