// Auto-generated from DB export. Edit by hand to update.

export interface CasinoI18n {
  en?: string;
  ru?: string;
  de?: string;
  fr?: string;
  es?: string;
  pt?: string;
  it?: string;
  nl?: string;
  pl?: string;
  cs?: string;
  sk?: string;
  hu?: string;
  ro?: string;
  bg?: string;
  hr?: string;
  sl?: string;
  sr?: string;
  uk?: string;
  tr?: string;
  el?: string;
  ar?: string;
  he?: string;
  hi?: string;
  bn?: string;
  ja?: string;
  ko?: string;
  zh?: string;
  th?: string;
  vi?: string;
  id?: string;
  ms?: string;
  fil?: string;
  sv?: string;
  no?: string;
  da?: string;
  fi?: string;
  et?: string;
  lv?: string;
  lt?: string;
  ka?: string;
}

export interface CasinoI18nList {
  en?: string[];
  ru?: string[];
  [key: string]: string[] | undefined;
}

export interface Casino {
  id: number;
  name: string;
  slug: string;
  brandId: string;
  logoPath: string;
  affiliateUrl: string;
  rating: number;
  bonusText: CasinoI18n;
  bonusAmount: string;
  welcomeBonus: CasinoI18n;
  freeSpins: string;
  minDeposit: string;
  license: string;
  paymentMethods: string[];
  pros: CasinoI18nList;
  cons: CasinoI18nList;
  description: CasinoI18n;
  badges: string[];
  sortOrder: number;
}

export const CASINOS: Casino[] = [
  {
    "id": 1,
    "name": "1xBet",
    "slug": "1xbet",
    "brandId": "1xbet",
    "logoPath": "/images/casinos/1xbet.png",
    "affiliateUrl": "https://1xbet.com",
    "rating": 4.7,
    "bonusText": {
      "en": "Up to $1500 + 150 Free Spins on first deposit",
      "ru": "До $1500 + 150 фриспинов на первый депозит"
    },
    "bonusAmount": "$1500",
    "welcomeBonus": {
      "en": "100% up to $1500 Welcome Bonus",
      "ru": "100% до $1500 приветственный бонус"
    },
    "freeSpins": "150",
    "minDeposit": "$1",
    "license": "Curacao",
    "paymentMethods": [
      "Visa",
      "Mastercard",
      "Bitcoin",
      "Ethereum",
      "Skrill",
      "Neteller"
    ],
    "pros": {
      "en": [
        "Huge game selection with 10,000+ titles",
        "Very low minimum deposit of $1",
        "Supports cryptocurrency payments",
        "Live streaming of sports events"
      ],
      "ru": [
        "Огромный выбор игр: более 10 000 наименований",
        "Очень низкий минимальный депозит $1",
        "Поддержка криптовалютных платежей",
        "Прямые трансляции спортивных событий"
      ]
    },
    "cons": {
      "en": [
        "Restricted in some countries",
        "Complex bonus wagering requirements"
      ],
      "ru": [
        "Ограничен в некоторых странах",
        "Сложные условия отыгрыша бонусов"
      ]
    },
    "description": {
      "en": "1xBet is one of the largest international online betting platforms, offering an extensive casino section with thousands of slots including Big Bass Crash. Known for generous bonuses and wide payment options.",
      "ru": "1xBet - одна из крупнейших международных букмекерских платформ, предлагающая обширный раздел казино с тысячами слотов, включая Big Bass Crash. Известна щедрыми бонусами и широкими возможностями оплаты."
    },
    "badges": [
      "Top Pick",
      "Crypto Friendly"
    ],
    "sortOrder": 1
  },
  {
    "id": 2,
    "name": "Stake",
    "slug": "stake",
    "brandId": "stake",
    "logoPath": "/images/casinos/stake.png",
    "affiliateUrl": "https://stake.com",
    "rating": 4.6,
    "bonusText": {
      "en": "200% up to $1000 Welcome Bonus",
      "ru": "200% до $1000 приветственный бонус"
    },
    "bonusAmount": "$1000",
    "welcomeBonus": {
      "en": "200% up to $1000 on first deposit",
      "ru": "200% до $1000 на первый депозит"
    },
    "freeSpins": "50",
    "minDeposit": "$20",
    "license": "Curacao",
    "paymentMethods": [
      "Bitcoin",
      "Ethereum",
      "Litecoin",
      "Dogecoin",
      "USDT",
      "Visa"
    ],
    "pros": {
      "en": [
        "Industry-leading crypto casino",
        "Provably fair games available",
        "Fast withdrawal processing",
        "Active community and promotions"
      ],
      "ru": [
        "Лидер индустрии крипто-казино",
        "Доступны доказуемо честные игры",
        "Быстрая обработка выводов",
        "Активное сообщество и акции"
      ]
    },
    "cons": {
      "en": [
        "Limited fiat payment options",
        "Not available in US/UK"
      ],
      "ru": [
        "Ограниченные фиатные способы оплаты",
        "Недоступен в США/Великобритании"
      ]
    },
    "description": {
      "en": "Stake is the leading cryptocurrency casino, popular among streamers and crypto enthusiasts. Offers a smooth gaming experience with Big Bass Crash and thousands of other titles.",
      "ru": "Stake - ведущее криптовалютное казино, популярное среди стримеров и крипто-энтузиастов. Предлагает комфортный игровой опыт с Big Bass Crash и тысячами других игр."
    },
    "badges": [
      "Crypto Casino",
      "Streamer Favorite"
    ],
    "sortOrder": 2
  },
  {
    "id": 3,
    "name": "Betway",
    "slug": "betway",
    "brandId": "betway",
    "logoPath": "/images/casinos/betway.png",
    "affiliateUrl": "https://betway.com",
    "rating": 4.4,
    "bonusText": {
      "en": "100% up to $250 + 50 Free Spins",
      "ru": "100% до $250 + 50 фриспинов"
    },
    "bonusAmount": "$250",
    "welcomeBonus": {
      "en": "100% up to $250 Welcome Package",
      "ru": "100% до $250 приветственный пакет"
    },
    "freeSpins": "50",
    "minDeposit": "$10",
    "license": "MGA (Malta)",
    "paymentMethods": [
      "Visa",
      "Mastercard",
      "PayPal",
      "Skrill",
      "Neteller",
      "Bank Transfer"
    ],
    "pros": {
      "en": [
        "Trusted brand with MGA license",
        "Excellent mobile app experience",
        "PayPal deposits accepted",
        "Responsive 24/7 customer support"
      ],
      "ru": [
        "Надежный бренд с лицензией MGA",
        "Отличный мобильный опыт",
        "Принимаются депозиты через PayPal",
        "Круглосуточная поддержка клиентов"
      ]
    },
    "cons": {
      "en": [
        "Lower bonus amount compared to competitors",
        "Some country restrictions apply"
      ],
      "ru": [
        "Меньшая сумма бонуса по сравнению с конкурентами",
        "Действуют ограничения для некоторых стран"
      ]
    },
    "description": {
      "en": "Betway is a well-established and trusted online casino brand with a Malta Gaming Authority license. Offers a solid selection of Pragmatic Play games including Big Bass Crash with reliable payouts.",
      "ru": "Betway - хорошо зарекомендовавший себя и надежный бренд онлайн-казино с лицензией Malta Gaming Authority. Предлагает солидный выбор игр Pragmatic Play, включая Big Bass Crash, с надежными выплатами."
    },
    "badges": [
      "Trusted Brand",
      "MGA Licensed"
    ],
    "sortOrder": 3
  },
  {
    "id": 4,
    "name": "888Casino",
    "slug": "888casino",
    "brandId": "888casino",
    "logoPath": "/images/casinos/888casino.png",
    "affiliateUrl": "https://888casino.com",
    "rating": 4.3,
    "bonusText": {
      "en": "$20 No Deposit Bonus + 100% up to $500",
      "ru": "$20 бонус без депозита + 100% до $500"
    },
    "bonusAmount": "$500",
    "welcomeBonus": {
      "en": "$20 Free + 100% up to $500 Welcome Bonus",
      "ru": "$20 бесплатно + 100% до $500 приветственный бонус"
    },
    "freeSpins": "25",
    "minDeposit": "$20",
    "license": "UKGC & GGC",
    "paymentMethods": [
      "Visa",
      "Mastercard",
      "PayPal",
      "Apple Pay",
      "Skrill",
      "Paysafecard"
    ],
    "pros": {
      "en": [
        "No deposit bonus available for new players",
        "Dual UKGC and Gibraltar license",
        "Apple Pay support for deposits",
        "Long-standing reputation since 1997"
      ],
      "ru": [
        "Бонус без депозита для новых игроков",
        "Двойная лицензия UKGC и Гибралтара",
        "Поддержка Apple Pay для депозитов",
        "Долгая репутация с 1997 года"
      ]
    },
    "cons": {
      "en": [
        "Withdrawal times can be slow",
        "Smaller game library than some competitors"
      ],
      "ru": [
        "Время вывода может быть долгим",
        "Меньшая библиотека игр, чем у конкурентов"
      ]
    },
    "description": {
      "en": "888Casino is one of the oldest and most reputable online casinos, operating since 1997. Holds dual licenses from UKGC and Gibraltar, offering Big Bass Crash alongside a curated selection of premium slots.",
      "ru": "888Casino - одно из старейших и наиболее авторитетных онлайн-казино, работающее с 1997 года. Имеет двойные лицензии UKGC и Гибралтара, предлагая Big Bass Crash наряду с подборкой премиальных слотов."
    },
    "badges": [
      "No Deposit Bonus",
      "Veteran Casino"
    ],
    "sortOrder": 4
  },
  {
    "id": 5,
    "name": "LeoVegas",
    "slug": "leovegas",
    "brandId": "leovegas",
    "logoPath": "/images/casinos/leovegas.svg",
    "affiliateUrl": "https://leovegas.com",
    "rating": 4.5,
    "bonusText": {
      "en": "Up to $1000 + 200 Free Spins Welcome Package",
      "ru": "До $1000 + 200 фриспинов приветственный пакет"
    },
    "bonusAmount": "$1000",
    "welcomeBonus": {
      "en": "Up to $1000 + 200 Free Spins over 4 deposits",
      "ru": "До $1000 + 200 фриспинов на 4 депозита"
    },
    "freeSpins": "200",
    "minDeposit": "$10",
    "license": "MGA & UKGC",
    "paymentMethods": [
      "Visa",
      "Mastercard",
      "Trustly",
      "Skrill",
      "Neteller",
      "Paysafecard"
    ],
    "pros": {
      "en": [
        "Award-winning mobile casino experience",
        "Generous multi-deposit welcome package",
        "Fast payout processing times",
        "Multiple prestigious licenses (MGA & UKGC)"
      ],
      "ru": [
        "Награжденный мобильный опыт казино",
        "Щедрый приветственный пакет на несколько депозитов",
        "Быстрое время обработки выплат",
        "Множество престижных лицензий (MGA и UKGC)"
      ]
    },
    "cons": {
      "en": [
        "Bonus split across 4 deposits",
        "Some games not available in all regions"
      ],
      "ru": [
        "Бонус разделен на 4 депозита",
        "Некоторые игры недоступны во всех регионах"
      ]
    },
    "description": {
      "en": "LeoVegas is an award-winning mobile-first casino known as the \"King of Mobile Casino.\" Offers Big Bass Crash with an excellent mobile experience, generous bonuses, and fast withdrawals backed by MGA and UKGC licenses.",
      "ru": "LeoVegas - отмеченное наградами мобильное казино, известное как \"Король мобильного казино\". Предлагает Big Bass Crash с отличным мобильным опытом, щедрыми бонусами и быстрыми выводами при поддержке лицензий MGA и UKGC."
    },
    "badges": [
      "Best Mobile",
      "Award Winner"
    ],
    "sortOrder": 5
  }
];

export function getCasinosForLocale(_locale: string): Casino[] {
  return [...CASINOS].sort((a, b) => a.sortOrder - b.sortOrder);
}
