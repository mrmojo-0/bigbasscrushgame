import { db } from '../src/lib/db';
import { settings, casinos, agents, experts, casinoLocaleSettings } from '../src/lib/db/schema';
import { ALL_LOCALES } from '../src/i18n/config';
import { asc } from 'drizzle-orm';
import bcrypt from 'bcryptjs';

async function seed() {
  console.log('Seeding database...');

  // 1. Seed settings
  console.log('  -> Inserting settings...');

  const adminPasswordHash = await bcrypt.hash('admin123', 10);

  const settingsData = [
    { key: 'admin_password_hash', value: adminPasswordHash, updatedAt: new Date() },
    { key: 'openrouter_api_key', value: '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', updatedAt: new Date() },
    { key: 'openrouter_model', value: 'x-ai/grok-4.1-fast', updatedAt: new Date() },
  ];

  for (const setting of settingsData) {
    db.insert(settings)
      .values(setting)
      .onConflictDoUpdate({
        target: settings.key,
        set: { value: setting.value, updatedAt: setting.updatedAt },
      })
      .run();
  }

  console.log('  -> Settings inserted.');

  // 2. Seed casinos
  console.log('  -> Inserting casinos...');

  const casinosData = [
    {
      name: '1xBet',
      slug: '1xbet',
      brandId: '1xbet',
      logoPath: '/images/casinos/1xbet.png',
      affiliateUrl: 'https://1xbet.com',
      rating: 4.7,
      bonusText: JSON.stringify({
        en: 'Up to $1500 + 150 Free Spins on first deposit',
        ru: 'До $1500 + 150 фриспинов на первый депозит',
      }),
      bonusAmount: '$1500',
      welcomeBonus: JSON.stringify({
        en: '100% up to $1500 Welcome Bonus',
        ru: '100% до $1500 приветственный бонус',
      }),
      freeSpins: '150',
      minDeposit: '$1',
      license: 'Curacao',
      paymentMethods: JSON.stringify(['Visa', 'Mastercard', 'Bitcoin', 'Ethereum', 'Skrill', 'Neteller']),
      pros: JSON.stringify({
        en: [
          'Huge game selection with 10,000+ titles',
          'Very low minimum deposit of $1',
          'Supports cryptocurrency payments',
          'Live streaming of sports events',
        ],
        ru: [
          'Огромный выбор игр: более 10 000 наименований',
          'Очень низкий минимальный депозит $1',
          'Поддержка криптовалютных платежей',
          'Прямые трансляции спортивных событий',
        ],
      }),
      cons: JSON.stringify({
        en: [
          'Restricted in some countries',
          'Complex bonus wagering requirements',
        ],
        ru: [
          'Ограничен в некоторых странах',
          'Сложные условия отыгрыша бонусов',
        ],
      }),
      description: JSON.stringify({
        en: '1xBet is one of the largest international online betting platforms, offering an extensive casino section with thousands of slots including Big Bass Crash. Known for generous bonuses and wide payment options.',
        ru: '1xBet - одна из крупнейших международных букмекерских платформ, предлагающая обширный раздел казино с тысячами слотов, включая Big Bass Crash. Известна щедрыми бонусами и широкими возможностями оплаты.',
      }),
      badges: JSON.stringify(['Top Pick', 'Crypto Friendly']),
      sortOrder: 1,
      isActive: true,
      createdAt: new Date(),
      updatedAt: new Date(),
    },
    {
      name: 'Stake',
      slug: 'stake',
      brandId: 'stake',
      logoPath: '/images/casinos/stake.png',
      affiliateUrl: 'https://stake.com',
      rating: 4.6,
      bonusText: JSON.stringify({
        en: '200% up to $1000 Welcome Bonus',
        ru: '200% до $1000 приветственный бонус',
      }),
      bonusAmount: '$1000',
      welcomeBonus: JSON.stringify({
        en: '200% up to $1000 on first deposit',
        ru: '200% до $1000 на первый депозит',
      }),
      freeSpins: '50',
      minDeposit: '$20',
      license: 'Curacao',
      paymentMethods: JSON.stringify(['Bitcoin', 'Ethereum', 'Litecoin', 'Dogecoin', 'USDT', 'Visa']),
      pros: JSON.stringify({
        en: [
          'Industry-leading crypto casino',
          'Provably fair games available',
          'Fast withdrawal processing',
          'Active community and promotions',
        ],
        ru: [
          'Лидер индустрии крипто-казино',
          'Доступны доказуемо честные игры',
          'Быстрая обработка выводов',
          'Активное сообщество и акции',
        ],
      }),
      cons: JSON.stringify({
        en: [
          'Limited fiat payment options',
          'Not available in US/UK',
        ],
        ru: [
          'Ограниченные фиатные способы оплаты',
          'Недоступен в США/Великобритании',
        ],
      }),
      description: JSON.stringify({
        en: 'Stake is the leading cryptocurrency casino, popular among streamers and crypto enthusiasts. Offers a smooth gaming experience with Big Bass Crash and thousands of other titles.',
        ru: 'Stake - ведущее криптовалютное казино, популярное среди стримеров и крипто-энтузиастов. Предлагает комфортный игровой опыт с Big Bass Crash и тысячами других игр.',
      }),
      badges: JSON.stringify(['Crypto Casino', 'Streamer Favorite']),
      sortOrder: 2,
      isActive: true,
      createdAt: new Date(),
      updatedAt: new Date(),
    },
    {
      name: 'Betway',
      slug: 'betway',
      brandId: 'betway',
      logoPath: '/images/casinos/betway.png',
      affiliateUrl: 'https://betway.com',
      rating: 4.4,
      bonusText: JSON.stringify({
        en: '100% up to $250 + 50 Free Spins',
        ru: '100% до $250 + 50 фриспинов',
      }),
      bonusAmount: '$250',
      welcomeBonus: JSON.stringify({
        en: '100% up to $250 Welcome Package',
        ru: '100% до $250 приветственный пакет',
      }),
      freeSpins: '50',
      minDeposit: '$10',
      license: 'MGA (Malta)',
      paymentMethods: JSON.stringify(['Visa', 'Mastercard', 'PayPal', 'Skrill', 'Neteller', 'Bank Transfer']),
      pros: JSON.stringify({
        en: [
          'Trusted brand with MGA license',
          'Excellent mobile app experience',
          'PayPal deposits accepted',
          'Responsive 24/7 customer support',
        ],
        ru: [
          'Надежный бренд с лицензией MGA',
          'Отличный мобильный опыт',
          'Принимаются депозиты через PayPal',
          'Круглосуточная поддержка клиентов',
        ],
      }),
      cons: JSON.stringify({
        en: [
          'Lower bonus amount compared to competitors',
          'Some country restrictions apply',
        ],
        ru: [
          'Меньшая сумма бонуса по сравнению с конкурентами',
          'Действуют ограничения для некоторых стран',
        ],
      }),
      description: JSON.stringify({
        en: 'Betway is a well-established and trusted online casino brand with a Malta Gaming Authority license. Offers a solid selection of Pragmatic Play games including Big Bass Crash with reliable payouts.',
        ru: 'Betway - хорошо зарекомендовавший себя и надежный бренд онлайн-казино с лицензией Malta Gaming Authority. Предлагает солидный выбор игр Pragmatic Play, включая Big Bass Crash, с надежными выплатами.',
      }),
      badges: JSON.stringify(['Trusted Brand', 'MGA Licensed']),
      sortOrder: 3,
      isActive: true,
      createdAt: new Date(),
      updatedAt: new Date(),
    },
    {
      name: '888Casino',
      slug: '888casino',
      brandId: '888casino',
      logoPath: '/images/casinos/888casino.png',
      affiliateUrl: 'https://888casino.com',
      rating: 4.3,
      bonusText: JSON.stringify({
        en: '$20 No Deposit Bonus + 100% up to $500',
        ru: '$20 бонус без депозита + 100% до $500',
      }),
      bonusAmount: '$500',
      welcomeBonus: JSON.stringify({
        en: '$20 Free + 100% up to $500 Welcome Bonus',
        ru: '$20 бесплатно + 100% до $500 приветственный бонус',
      }),
      freeSpins: '25',
      minDeposit: '$20',
      license: 'UKGC & GGC',
      paymentMethods: JSON.stringify(['Visa', 'Mastercard', 'PayPal', 'Apple Pay', 'Skrill', 'Paysafecard']),
      pros: JSON.stringify({
        en: [
          'No deposit bonus available for new players',
          'Dual UKGC and Gibraltar license',
          'Apple Pay support for deposits',
          'Long-standing reputation since 1997',
        ],
        ru: [
          'Бонус без депозита для новых игроков',
          'Двойная лицензия UKGC и Гибралтара',
          'Поддержка Apple Pay для депозитов',
          'Долгая репутация с 1997 года',
        ],
      }),
      cons: JSON.stringify({
        en: [
          'Withdrawal times can be slow',
          'Smaller game library than some competitors',
        ],
        ru: [
          'Время вывода может быть долгим',
          'Меньшая библиотека игр, чем у конкурентов',
        ],
      }),
      description: JSON.stringify({
        en: '888Casino is one of the oldest and most reputable online casinos, operating since 1997. Holds dual licenses from UKGC and Gibraltar, offering Big Bass Crash alongside a curated selection of premium slots.',
        ru: '888Casino - одно из старейших и наиболее авторитетных онлайн-казино, работающее с 1997 года. Имеет двойные лицензии UKGC и Гибралтара, предлагая Big Bass Crash наряду с подборкой премиальных слотов.',
      }),
      badges: JSON.stringify(['No Deposit Bonus', 'Veteran Casino']),
      sortOrder: 4,
      isActive: true,
      createdAt: new Date(),
      updatedAt: new Date(),
    },
    {
      name: 'LeoVegas',
      slug: 'leovegas',
      brandId: 'leovegas',
      logoPath: '/images/casinos/leovegas.png',
      affiliateUrl: 'https://leovegas.com',
      rating: 4.5,
      bonusText: JSON.stringify({
        en: 'Up to $1000 + 200 Free Spins Welcome Package',
        ru: 'До $1000 + 200 фриспинов приветственный пакет',
      }),
      bonusAmount: '$1000',
      welcomeBonus: JSON.stringify({
        en: 'Up to $1000 + 200 Free Spins over 4 deposits',
        ru: 'До $1000 + 200 фриспинов на 4 депозита',
      }),
      freeSpins: '200',
      minDeposit: '$10',
      license: 'MGA & UKGC',
      paymentMethods: JSON.stringify(['Visa', 'Mastercard', 'Trustly', 'Skrill', 'Neteller', 'Paysafecard']),
      pros: JSON.stringify({
        en: [
          'Award-winning mobile casino experience',
          'Generous multi-deposit welcome package',
          'Fast payout processing times',
          'Multiple prestigious licenses (MGA & UKGC)',
        ],
        ru: [
          'Награжденный мобильный опыт казино',
          'Щедрый приветственный пакет на несколько депозитов',
          'Быстрое время обработки выплат',
          'Множество престижных лицензий (MGA и UKGC)',
        ],
      }),
      cons: JSON.stringify({
        en: [
          'Bonus split across 4 deposits',
          'Some games not available in all regions',
        ],
        ru: [
          'Бонус разделен на 4 депозита',
          'Некоторые игры недоступны во всех регионах',
        ],
      }),
      description: JSON.stringify({
        en: 'LeoVegas is an award-winning mobile-first casino known as the "King of Mobile Casino." Offers Big Bass Crash with an excellent mobile experience, generous bonuses, and fast withdrawals backed by MGA and UKGC licenses.',
        ru: 'LeoVegas - отмеченное наградами мобильное казино, известное как "Король мобильного казино". Предлагает Big Bass Crash с отличным мобильным опытом, щедрыми бонусами и быстрыми выводами при поддержке лицензий MGA и UKGC.',
      }),
      badges: JSON.stringify(['Best Mobile', 'Award Winner']),
      sortOrder: 5,
      isActive: true,
      createdAt: new Date(),
      updatedAt: new Date(),
    },
  ];

  for (const casino of casinosData) {
    db.insert(casinos)
      .values(casino)
      .onConflictDoNothing()
      .run();
  }

  console.log(`  -> ${casinosData.length} casinos inserted.`);

  // 3. Seed AI agents
  console.log('  -> Inserting AI agents...');

  const agentsData = [
    {
      name: 'CasualCarl',
      avatar: '/images/agents/casual-carl.png',
      personality: 'A laid-back casual player who enjoys Big Bass Crash for fun without taking it too seriously. Shares lighthearted comments and enjoys the fishing theme. Uses informal language and occasional humor.',
      style: 'casual',
      languages: JSON.stringify(ALL_LOCALES),
      isActive: true,
      createdAt: new Date(),
    },
    {
      name: 'ProPeter',
      avatar: '/images/agents/pro-peter.png',
      personality: 'An experienced gambler who has played hundreds of crash games. Provides detailed analysis, shares strategies, and often references his own big wins and losses. Knowledgeable about RTP and volatility.',
      style: 'analytical',
      languages: JSON.stringify(ALL_LOCALES),
      isActive: true,
      createdAt: new Date(),
    },
    {
      name: 'SkepticalSam',
      avatar: '/images/agents/skeptical-sam.png',
      personality: 'A cautious skeptic who questions casino fairness and warns about gambling risks. Always reminds people about responsible gambling. Provides balanced counterpoints to overly positive reviews.',
      style: 'critical',
      languages: JSON.stringify(ALL_LOCALES),
      isActive: true,
      createdAt: new Date(),
    },
    {
      name: 'EnthusiastEmma',
      avatar: '/images/agents/enthusiast-emma.png',
      personality: 'A passionate slots enthusiast who loves the Big Bass series. Gets excited about bonus features, big multipliers, and new game releases. Always positive and encouraging to other players.',
      style: 'enthusiastic',
      languages: JSON.stringify(ALL_LOCALES),
      isActive: true,
      createdAt: new Date(),
    },
    {
      name: 'BeginnerBen',
      avatar: '/images/agents/beginner-ben.png',
      personality: 'A newcomer to crash games who asks basic questions and shares his learning journey. Helps other beginners by explaining things in simple terms. Sometimes confused but always eager to learn.',
      style: 'beginner',
      languages: JSON.stringify(ALL_LOCALES),
      isActive: true,
      createdAt: new Date(),
    },
    {
      name: 'BonusHunterBella',
      avatar: '/images/agents/bonus-bella.png',
      personality: 'A savvy bonus hunter who always knows the best promotions and welcome offers. Compares casinos by their bonus value, wagering requirements, and free spins deals. Very detail-oriented about terms and conditions.',
      style: 'strategic',
      languages: JSON.stringify(ALL_LOCALES),
      isActive: true,
      createdAt: new Date(),
    },
    {
      name: 'StrategySteve',
      avatar: '/images/agents/strategy-steve.png',
      personality: 'A math-minded player who loves analyzing crash game strategies. Discusses auto-cashout levels, bankroll management, and risk-reward ratios. Often uses numbers and statistics in his comments.',
      style: 'technical',
      languages: JSON.stringify(ALL_LOCALES),
      isActive: true,
      createdAt: new Date(),
    },
    {
      name: 'HighRollerHank',
      avatar: '/images/agents/highroller-hank.png',
      personality: 'A high-stakes player who bets big and chases huge multipliers. Talks about VIP programs, cashback offers, and exclusive bonuses. Has a luxurious attitude but shares genuine insights about high-stakes play.',
      style: 'luxury',
      languages: JSON.stringify(ALL_LOCALES),
      isActive: true,
      createdAt: new Date(),
    },
    {
      name: 'CryptoChris',
      avatar: '/images/agents/crypto-chris.png',
      personality: 'A crypto-native player who prefers Bitcoin and Ethereum casinos. Talks about crypto deposit benefits, anonymity, faster withdrawals, and which casinos have the best crypto support. Tech-savvy and forward-thinking.',
      style: 'tech',
      languages: JSON.stringify(ALL_LOCALES),
      isActive: true,
      createdAt: new Date(),
    },
    {
      name: 'StreamerSarah',
      avatar: '/images/agents/streamer-sarah.png',
      personality: 'A casual slot streamer who shares her screen experiences playing Big Bass Crash. References popular gambling streamers, talks about entertaining sessions, and focuses on the fun and entertainment aspect of the game.',
      style: 'entertainment',
      languages: JSON.stringify(ALL_LOCALES),
      isActive: true,
      createdAt: new Date(),
    },
  ];

  for (const agent of agentsData) {
    db.insert(agents)
      .values(agent)
      .onConflictDoNothing()
      .run();
  }

  console.log(`  -> ${agentsData.length} AI agents inserted.`);

  // 4. Seed expert for English
  console.log('  -> Inserting expert profile...');

  const expertData = {
    lang: 'en',
    name: 'James Thornton',
    avatarPath: '/images/experts/james-thornton.jpg',
    title: 'Senior Casino Analyst & Crash Game Specialist',
    bio: 'James Thornton is a seasoned casino analyst with over 12 years of experience in the online gambling industry. Specializing in crash games and innovative slot mechanics, James has reviewed hundreds of casino platforms and game titles. He holds a degree in Statistics from the University of Edinburgh and has been featured in leading iGaming publications. His expertise in Pragmatic Play titles, including the Big Bass series, makes him a trusted voice for players seeking in-depth, honest game reviews.',
    credentials: JSON.stringify([
      '12+ years in iGaming industry',
      'BSc Statistics, University of Edinburgh',
      'Certified Responsible Gambling Advisor',
      'Featured in iGaming Business & Casino Beats',
      'Reviewed 500+ online casino platforms',
    ]),
    socialLinks: JSON.stringify({
      twitter: 'https://twitter.com/james_igaming',
      linkedin: 'https://linkedin.com/in/james-thornton-igaming',
    }),
    createdAt: new Date(),
    updatedAt: new Date(),
  };

  db.insert(experts)
    .values(expertData)
    .onConflictDoNothing()
    .run();

  console.log('  -> Expert profile inserted.');

  // 5. Seed casino locale settings for all casino x language combinations
  console.log('  -> Inserting casino locale settings...');

  const allCasinos = db.select().from(casinos).orderBy(asc(casinos.sortOrder)).all();
  let localeSettingsCount = 0;
  for (const casino of allCasinos) {
    for (const lang of ALL_LOCALES) {
      db.insert(casinoLocaleSettings)
        .values({
          casinoId: casino.id,
          lang,
          sortOrder: casino.sortOrder ?? 0,
          isVisible: true,
          createdAt: new Date(),
          updatedAt: new Date(),
        })
        .onConflictDoNothing()
        .run();
      localeSettingsCount++;
    }
  }

  console.log(`  -> ${localeSettingsCount} casino locale settings inserted (${allCasinos.length} casinos x ${ALL_LOCALES.length} languages).`);

  console.log('Database seeding completed successfully!');
}

seed().catch((error) => {
  console.error('Seeding failed:', error);
  process.exit(1);
});
