# МЕГА-ПРОМПТ: Создание SEO-конвертящего игрового сайта

> **Инструкция**: Замени все `{{PLACEHOLDER}}` на свои данные перед использованием.
> Промпт разбит на фазы — можно выполнять последовательно или целиком.

---

## ПЕРЕМЕННЫЕ ДЛЯ ЗАМЕНЫ

```
{{GAME_NAME}}           = Название игры (напр. "Aviator", "JetX", "Spaceman", "Sweet Bonanza")
{{GAME_NAME_SLUG}}      = slug для домена (напр. "aviator", "jetx", "spaceman", "sweet-bonanza")
{{DOMAIN}}              = Домен сайта (напр. "aviatorgameplay.com")
{{PROVIDER}}            = Провайдер игры (напр. "Spribe", "SmartSoft", "Pragmatic Play")
{{GAME_TYPE}}           = Тип игры (напр. "crash game", "slot", "live game")
{{RTP}}                 = RTP игры (напр. "97.00%")
{{VOLATILITY}}          = Волатильность (напр. "Low", "Medium", "High")
{{MAX_WIN}}             = Макс. выигрыш (напр. "100x", "5000x", "25000x")
{{MIN_BET}}             = Мин. ставка (напр. "$0.10", "$1.00")
{{MAX_BET}}             = Макс. ставка (напр. "$100", "$500")
{{RELEASE_YEAR}}        = Год выхода (напр. "2023", "2024")
{{THEME}}               = Тема/стилистика (напр. "Aviation", "Space", "Fishing", "Candy")
{{THEME_COLORS}}        = Основные цвета темы (напр. "red/orange for aviation", "purple/blue for space")
{{DEMO_URL}}            = URL демо-режима (напр. "https://demogamesfree.pragmaticplay.net/gs2c/openGame.do?gameSymbol=...")
{{DEMO_GAME_SYMBOL}}    = Символ игры у провайдера (напр. "vswaysbbhas", "vs20fruitswx")
{{AFFILIATE_KEY}}       = Ключ партнёрки (напр. "929139560bb74e2d82b65e0f942edc99")
{{AFFILIATE_TRACKER}}   = URL трекера (напр. "https://pixlclick.click/click")
{{PRIMARY_COLOR}}       = Основной акцентный цвет (напр. "#ef4444" для красного, "#8b5cf6" для фиолетового)
{{CASINO_1_NAME}}       = Название казино 1 (напр. "1xBet")
{{CASINO_1_SLUG}}       = slug казино 1 (напр. "1xbet")
{{CASINO_1_RATING}}     = Рейтинг казино 1 (напр. "4.8")
{{CASINO_1_BONUS}}      = Бонус казино 1 (напр. "Up to $500 + 150 Free Spins")
{{CASINO_1_BRAND_ID}}   = Brand ID партнёрки казино 1
{{CASINO_2-5}}          = Аналогично для остальных казино

{{COMPETITOR_1}}        = Конкурент 1 для сравнения (напр. "Big Bass Crash")
{{COMPETITOR_2}}        = Конкурент 2 (напр. "JetX")
{{COMPETITOR_3}}        = Конкурент 3 (напр. "Spaceman")

{{OG_DESCRIPTION}}      = Описание для Open Graph (1-2 предложения)
{{REVIEW_SCORE}}        = Общая оценка обзора (напр. "8.7")
```

---

## ФАЗА 0: ИНИЦИАЛИЗАЦИЯ ПРОЕКТА

```
Создай полный production-ready сайт для игры {{GAME_NAME}} от {{PROVIDER}}.

Домен: {{DOMAIN}}
Тип: {{GAME_TYPE}}
Цель: SEO-оптимизированный, конвертящий affiliate-сайт на 40 языков.

### Технологический стек (строго):
- **Astro 5** (latest) — static output с Node adapter для SSR-редиректов
- **Preact** — для интерактивных островов (НЕ React — экономим 42KB)
- **Tailwind CSS 3.4** + @tailwindcss/typography — стилизация
- **SQLite** через better-sqlite3 + **Drizzle ORM** — база данных
- **Sharp** — оптимизация изображений на этапе сборки
- **TypeScript** — strict mode

### Инициализация:
```bash
npm create astro@latest {{GAME_NAME_SLUG}} -- --template minimal
cd {{GAME_NAME_SLUG}}
npx astro add preact tailwind sitemap node
npm install better-sqlite3 drizzle-orm bcryptjs marked uuid node-cron
npm install -D drizzle-kit sharp tsx @types/better-sqlite3 @types/bcryptjs
```

### Структура проекта:
```
{{GAME_NAME_SLUG}}/
├── astro.config.mjs
├── tailwind.config.mjs
├── tsconfig.json
├── drizzle.config.ts
├── ecosystem.config.cjs          # PM2 конфиг
├── DEPLOY.md
├── public/
│   ├── robots.txt
│   ├── manifest.json
│   ├── llms.txt
│   ├── images/
│   │   ├── game/                 # Оптимизированные скриншоты (WebP + fallback)
│   │   ├── casinos/              # Логотипы казино
│   │   └── og/                   # Open Graph изображения (1200x630)
│   ├── favicon.ico
│   ├── favicon-16x16.png
│   ├── favicon-32x32.png
│   └── apple-touch-icon.png
├── images/                       # Исходники изображений (НЕ деплоится)
├── scripts/
│   ├── seed-db.ts                # Начальные данные (казино, агенты, эксперт)
│   ├── migrate.ts                # Drizzle миграции
│   ├── optimize-images.mjs       # Sharp pipeline: images/ → public/images/game/
│   ├── generate-favicon.mjs      # Фавиконки из логотипа
│   ├── generate-content.ts       # AI-генерация контента через OpenRouter
│   ├── generate-comments.ts      # AI-генерация комментариев через 10 агентов
│   ├── generate-experts.ts       # AI-генерация экспертных профилей (40 языков)
│   ├── translate-content.ts      # AI-перевод en.json → 39 языков
│   ├── generate-og-images.ts     # SVG OG-изображения
│   ├── fetch-images.ts           # Поиск и скачивание изображений
│   ├── download-logos.ts         # Скачивание логотипов казино
│   └── deploy.sh                 # Скрипт деплоя
├── data/                         # SQLite БД (gitignored)
├── drizzle/migrations/           # SQL миграции
└── src/
    ├── env.d.ts
    ├── middleware.ts              # Auth middleware для admin
    ├── i18n/
    │   ├── config.ts             # 40 локалей с метаданными
    │   ├── utils.ts              # t(), getPagePath(), getAlternateUrls()
    │   ├── slugs.ts              # Локализованные URL-слаги
    │   └── translations/         # 40 JSON файлов (en.json, ru.json, ...)
    ├── layouts/
    │   ├── BaseLayout.astro      # <html>, мета, OG, hreflang, schema, шрифты
    │   ├── PageLayout.astro      # BaseLayout + Header + Footer
    │   └── AdminLayout.astro     # Sidebar-layout для админки
    ├── components/
    │   ├── layout/
    │   │   ├── Header.astro      # Фиксированный хедер с лого, навигация, выбор языка
    │   │   └── Footer.astro      # 3-колоночный футер, 18+ дисклеймер
    │   ├── casino/
    │   │   ├── CasinoCard.astro  # Карточка казино (desktop + mobile layout)
    │   │   └── CasinoTopList.astro
    │   ├── content/
    │   │   ├── ExpertProfile.astro  # Профиль эксперта с Schema.org Person
    │   │   └── FaqSection.astro     # Аккордеон на <details/summary>
    │   ├── interactive/
    │   │   ├── CommentSection.tsx   # Preact: комменты с пагинацией
    │   │   └── GameDemo.tsx         # Preact: демо через iframe
    │   ├── seo/
    │   │   └── Breadcrumbs.astro    # Хлебные крошки + BreadcrumbList schema
    │   └── ui/
    │       ├── ArticleImage.astro   # <picture> с WebP + lazy loading
    │       ├── ImageGallery.astro   # Галерея скриншотов (grid)
    │       ├── Badge.astro          # best_choice, new, popular, hot
    │       ├── Button.astro         # primary/secondary/outline/ghost
    │       ├── Rating.astro         # Звёзды (SVG, half-star support)
    │       └── WaveDecoration.astro # SVG-волна для переходов секций
    ├── lib/
    │   ├── db/
    │   │   ├── index.ts          # SQLite connection (WAL mode, FK)
    │   │   ├── schema.ts         # 9 таблиц Drizzle
    │   │   └── queries.ts        # Locale-aware запросы
    │   ├── auth/session.ts       # In-memory сессии (24h TTL)
    │   ├── seo/schema-generators.ts  # 7 Schema.org генераторов
    │   ├── ai/openrouter.ts      # OpenRouter API клиент
    │   └── images/bing-proxy.ts  # Bing Image Search
    └── pages/
        ├── index.astro           # 301 redirect → /en/
        ├── 404.astro             # Кастомная 404
        ├── [lang]/
        │   ├── index.astro       # Главная страница
        │   └── [...slug].astro   # play-free, where-to-play, review
        ├── go/[slug].astro       # Affiliate редиректы (SSR)
        ├── admin/                # 8 страниц админки
        │   ├── index.astro       # Dashboard
        │   ├── login.astro       # Авторизация
        │   ├── casinos.astro     # CRUD казино
        │   ├── comments.astro    # Комменты + AI агенты
        │   ├── content.astro     # Markdown CMS
        │   ├── experts.astro     # Экспертные профили
        │   ├── images.astro      # Библиотека изображений
        │   └── settings.astro    # Настройки, API ключи
        └── api/
            ├── auth/login.ts     # POST login
            ├── comments/index.ts # GET/POST комменты
            ├── casinos/index.ts  # CRUD API
            └── build/trigger.ts  # Триггер пересборки
```

Начни с создания всех конфигурационных файлов.
```

---

## ФАЗА 1: КОНФИГУРАЦИЯ

### 1.1 astro.config.mjs

```
Создай astro.config.mjs:

- site: "https://{{DOMAIN}}"
- output: "static" (с Node adapter для SSR-страниц /go/)
- trailingSlash: "ignore"
- Интеграции: preact (compat: true), tailwind, sitemap (фильтр /admin/, /api/, /go/; i18n маппинг для 40 локалей)
- i18n: defaultLocale "en", prefixDefaultLocale: true, все 40 локалей
- server: host "0.0.0.0", port 4321
- vite: exclude better-sqlite3 from optimizeDeps
```

### 1.2 tailwind.config.mjs

```
Создай tailwind.config.mjs с тематическими цветами для {{GAME_NAME}}:

ВАЖНО: Цветовая схема должна соответствовать теме {{THEME}}.

Обязательная структура:
- Основной фон (dark, 5 оттенков): 950-500 — тёмная палитра для фонов
  - Для авиации: тёмно-синие (#0a1628 → #2a5580)
  - Для космоса: тёмно-фиолетовые (#0f0720 → #4c1d95)
  - Для сладостей: тёмно-розовые (#1a0a1e → #831843)
  - Для рыбалки: тёмно-морские (#0a1628 → #1e3a5f)

- Декоративный цвет (5 оттенков): Вторичные акценты для декораций

- Акцентный CTA цвет (4 оттенка): {{PRIMARY_COLOR}} — для кнопок, ссылок
  ВАЖНО: Этот цвет должен быть ярким и контрастным на тёмном фоне!

- Gold (3 оттенка): Для бейджей, наград

- Crash/Alert (red + orange): Для предупреждений

Шрифты: Inter (sans), JetBrains Mono (mono)

Кастомные backgroundImage:
- gradient-ocean: основной фоновый градиент
- gradient-cta: градиент для CTA кнопок
- gradient-gold: градиент для золотых элементов
- glass: полупрозрачный для glassmorphism эффекта

Кастомные boxShadow:
- glow-{{theme}}: свечение основного акцентного цвета (0 0 20px)
- glow-gold: свечение золотого
- card: тень для карточек

Анимации:
- wave: translateX (8s, linear, infinite)
- float: translateY (6s, ease-in-out, infinite)
- pulse-glow: box-shadow пульсация (2s)
- count-up: opacity fade-in (2s)

Плагины: @tailwindcss/typography
```

### 1.3 tsconfig.json

```
Создай tsconfig.json:
- extends: astro/tsconfigs/strict
- Алиасы путей: @/* → src/*, @components/*, @layouts/*, @lib/*, @i18n/*
- jsx: react-jsx, jsxImportSource: preact
```

### 1.4 drizzle.config.ts

```
Создай drizzle.config.ts:
- schema: ./src/lib/db/schema.ts
- out: ./drizzle/migrations
- dialect: sqlite
- dbCredentials.url: ./data/database.sqlite
```

### 1.5 ecosystem.config.cjs (PM2)

```
module.exports = {
  apps: [{
    name: '{{GAME_NAME_SLUG}}',
    script: './dist/server/entry.mjs',
    env: { NODE_ENV: 'production', HOST: '127.0.0.1', PORT: 4321 },
    max_memory_restart: '500M',
    instances: 1,
    autorestart: true,
  }],
};
```

---

## ФАЗА 2: БАЗА ДАННЫХ

```
Создай полную схему базы данных в src/lib/db/schema.ts (Drizzle ORM + SQLite):

9 таблиц:

1. settings — key/value конфиг (admin_password, openrouter_api_key, ai_model, comment_generation_enabled, comment_generation_interval)

2. casinos — affiliate казино:
   - id (auto PK), name, slug (unique), brandId, logoPath
   - affiliateUrl, rating (real), bonusText (JSON-by-language: {"en":"...","ru":"..."})
   - welcomeBonus, description (JSON-by-language), freeSpins (int), minDeposit (int)
   - license, paymentMethods (JSON array), pros/cons (JSON-by-language arrays)
   - badges (JSON array: ["best_choice","new","popular","hot","fast_payout"])
   - sortOrder (int), isActive (int 0/1), createdAt, updatedAt

3. casinoLocaleSettings — per-locale порядок и видимость казино:
   - composite PK (casinoId + lang), FK cascade delete
   - sortOrder (int), isVisible (int 0/1, default 1)

4. pageContent — CMS контент:
   - composite PK (pageSlug + lang)
   - title, metaTitle, metaDescription, content (Markdown)
   - faqData (JSON array [{q,a}])
   - generatedByModel, updatedAt

5. experts — один эксперт на язык:
   - id, lang (unique), name, avatarPath, title, bio
   - credentials (JSON array), socialLinks (JSON)

6. comments — комментарии:
   - id, pageSlug, lang, agentId (FK nullable)
   - authorName, authorAvatar, content, rating (real)
   - parentId (self-ref для тредов), isVisible, createdAt

7. agents — AI-персоны для комментариев:
   - id, name, avatar, personality, style
   - languages (JSON array), isActive, lastGeneratedAt

8. discussions — форумный контент:
   - id, lang, agentId (FK), authorName, content
   - replyToId (self-ref), sortOrder

9. images — управление изображениями:
   - id, originalUrl, localPath, altText (JSON-by-language)
   - category, width, height

Также создай:
- src/lib/db/index.ts — подключение SQLite с WAL mode и foreign keys
- src/lib/db/queries.ts — getCasinosForLocale(locale) — JOIN casinos + casinoLocaleSettings, фильтр isActive+isVisible, ORDER BY locale sortOrder
```

---

## ФАЗА 3: СИСТЕМА i18n (40 ЯЗЫКОВ)

```
Создай полную систему интернационализации на 40 языков.

### src/i18n/config.ts

40 локалей с метаданными (name, nativeName, dir, flag emoji):
en, ru, de, fr, es, pt, it, pl, nl, sv, no, da, fi, cs, sk, hu, ro, bg, hr, sl,
et, lv, lt, el, tr, ar (RTL), he (RTL), ja, ko, zh, th, vi, id, ms, hi, bn, uk, ka, fil, sr

Экспорты: ALL_LOCALES, DEFAULT_LOCALE='en', RTL_LOCALES=['ar','he'], isRtl(), isValidLocale()

### src/i18n/slugs.ts

Локализованные URL-слаги для 4 страниц:
- home: '' (пусто для всех)
- play-free: 'play-free' (en), 'igrat-besplatno' (ru), 'kostenlos-spielen' (de), 'jouer-gratuitement' (fr), и т.д.
- where-to-play: 'where-to-play' (en), 'gde-igrat' (ru), 'wo-spielen' (de), и т.д.
- review: 'review' (en), 'obzor' (ru), 'bewertung' (de), и т.д.

ВАЖНО: Слаги должны быть транслитерированы латиницей для всех языков (даже для арабского, японского и т.д.)!
Это критично для SEO — URL должен быть читаемым.

Функции: getPagePath(pageId, locale), getSlug(pageId, locale), getPageIdFromSlug(slug, locale)

### src/i18n/utils.ts

- t(locale, key) — перевод с fallback на английский. Загрузка через import.meta.glob (eager)
- getAlternateUrls(pageId, siteUrl) — все 40 hreflang URL
- getNavLinks(locale) — навигационные ссылки
- getLocalizedValue(jsonString, locale) — парсинг JSON-by-language полей из БД
- getLocalizedArray(jsonString, locale) — то же для массивов
- formatDate(date, locale) — локализованное форматирование дат

### Файл en.json — 280+ ключей, организованных иерархически:

КРИТИЧЕСКИ ВАЖНО для SEO — каждый текст должен быть:
1. Уникальным и содержательным (НЕ generic)
2. Содержать ключевые слова "{{GAME_NAME}}" естественно
3. Длинные описания для hero/article секций (2-3 предложения)

Структура ключей:
- site.* (name, tagline)
- nav.* (home, playFree, whereToPlay, review)
- hero.* (title с годом!, subtitle с RTP и ключевыми фичами, playNow, playFree)
- trust.* (licensed, instant, bonuses)
- casino.* (visitSite, getBonus, rating, bonus, etc.)
- demo.* (title, subtitle, loading, fullscreen, playReal, howToPlay)
- whereToPlay.* (title, subtitle)
- review.* (title, description, overallScore, graphics, gameplay, etc.)
- article.home.* (whatIs, features, howToWin, howToPlay, rtp — каждый с title + p1 + p2)
- article.playFree.* (guide, features, strategy, vsReal, tips)
- article.whereToPlay.* (intro, bonuses, safety, payments, mobile, countries)
- article.review.* (intro, graphics, gameplay, rtp, volatility, features, strategy, comparison, verdict)
- faq.home.* / faq.playFree.* / faq.whereToPlay.* / faq.review.* (по 5 Q&A на страницу)
- table.specs.* (gameName, provider, rtp, volatility, maxMultiplier, minBet, maxBet, etc.)
- table.demoVsReal.* (feature, demoMode, realMoney, cost, winnings, etc.)
- table.payments.* (method, minDeposit, speed, fees, instant, free, etc.)
- table.comparison.* (feature, provider, rtp, maxWin, theme, dualBet, autoCashout, yes, no)
- steps.* (placeBet, watchMultiplier, cashOut — с title + desc)
- comments.* (title, loadMore, noComments)
- footer.* (about, disclaimer, copyright, responsible)
- alt.* (hero.main + 15 alt-текстов для изображений — описательные, уникальные!)
- gallery.title

hero.title ОБЯЗАТЕЛЬНО должен содержать: название игры, "Play Online", текущий год.
Пример: "{{GAME_NAME}} — Play Online & Win Real Money {{CURRENT_YEAR}}"

hero.subtitle ОБЯЗАТЕЛЬНО должен содержать: провайдера, RTP, макс. множитель, призыв к действию.
Пример: "{{GAME_NAME}} by {{PROVIDER}} is the top-rated {{GAME_TYPE}} with {{RTP}} RTP and multipliers up to {{MAX_WIN}}. Place your bet, watch the multiplier rise, and cash out before the crash. Play now at licensed casinos with bonuses up to 200%!"
```

---

## ФАЗА 4: ЛЕЙАУТЫ И КОМПОНЕНТЫ

```
Создай все компоненты точно по спецификации.

### BaseLayout.astro — <head> критичен для SEO:

1. Мета: charset, viewport, title, description, robots (optional noindex)
2. Canonical URL + hreflang для ВСЕХ 40 локалей + x-default → /en/
3. Open Graph: type, title, description, image (абсолютный URL!), url, site_name, og:locale, до 10 og:locale:alternate
4. Twitter Card: summary_large_image
5. Favicon: PNG 32x32 + 16x16 + ICO + apple-touch-icon 180x180
6. Google Fonts: preconnect + preload + Inter (400-800)
7. JSON-LD schema блоки (map через <script type="application/ld+json">)
8. Global CSS: тёмный фон, кастомный scrollbar, ::selection цвет, RTL support [dir="rtl"]

### Header.astro:
- position: fixed, backdrop-blur-xl, полупрозрачный фон
- Логотип (реальное изображение .webp, НЕ текстовая заглушка) + название
- Desktop навигация с active state
- Выбор языка — dropdown со ВСЕМИ 40 локалями (флаг + nativeName), ссылки ведут на ту же страницу в другой локали
- Mobile: hamburger + slide-down menu
- Минимальные touch targets: 48px кнопки, 44px ссылки

### Footer.astro:
- SVG волна сверху
- 3 колонки: бренд (лого + tagline), навигация (4 страницы), правовая информация
- 18+ бейдж + дисклеймер об ответственной игре (ОБЯЗАТЕЛЬНО для гэмблинг-сайтов!)
- Динамический год в copyright

### CasinoCard.astro — КЛЮЧЕВОЙ конвертящий компонент:
- РАЗНЫЕ layouts для desktop (горизонтальный) и mobile (вертикальный)
- Rank badge: золото/серебро/бронза для позиций 1-3 (градиентные фоны)
- Логотип казино с fallback на первую букву в круге
- Rating (звёзды), бонус (локализованный из JSON), бейджи
- Инфо: free spins, min deposit, license
- Методы оплаты (pills, max 6 + "+N more")
- CTA кнопка → /go/${slug}?from=${page}&lang=${locale} с rel="noopener noreferrer nofollow"
- Pros список (первые 2 пункта) с зелёными галочками
- Hover glow effect — притягивает внимание!

### GameDemo.tsx (Preact):
- Два состояния: оверлей с кнопкой → iframe после клика
- Маппинг локалей сайта → коды провайдера
- URL: {{DEMO_URL}} с параметрами lang и lobbyUrl
- Fullscreen API с vendor prefixes
- Loading spinner во время загрузки iframe
- sandbox="allow-scripts allow-same-origin allow-popups allow-forms"

### CommentSection.tsx (Preact):
- Загрузка с /api/comments с пагинацией (limit 5)
- Skeleton loading (animate-pulse)
- Аватар (или инициал), имя, дата, звёзды, текст
- "Load more" кнопка (НЕ infinite scroll)
- client:visible — грузится только когда виден

### ExpertProfile.astro:
- Аватар 96px, имя + verified badge (SVG), должность, bio, credential pills
- Schema.org Person JSON-LD встроен в компонент
- itemscope/itemprop микроданные

### FaqSection.astro:
- <details>/<summary> (нативный HTML, БЕЗ JavaScript!)
- Chevron SVG с CSS-ротацией при открытии
- Ответы через set:html (поддержка HTML)

### ArticleImage.astro:
- <picture> с <source srcset=".webp"> + <img src=".jpg/.png"> fallback
- Автоматическая генерация WebP пути заменой расширения
- loading="lazy" по умолчанию, eager для above-the-fold
- decoding="async" всегда

### ImageGallery.astro:
- Grid: 2 cols (mobile), 3 cols (sm), 4 cols (lg)
- <picture> с WebP для каждого изображения
- Все lazy loaded, aspect-[4/3], object-cover

### Button.astro:
- Полиморфный: <a> если href, <button> иначе
- Варианты: primary (градиент CTA + glow shadow!), secondary, outline, ghost
- Размеры: sm, md, lg, xl
- transition-all duration-200 на всех вариантах

### WaveDecoration.astro:
- SVG волна для плавных переходов между секциями
- Props: position (top/bottom), color

### Breadcrumbs.astro:
- Визуальные крошки + BreadcrumbList JSON-LD schema
- aria-label="Breadcrumb"

### Badge.astro:
- 5 типов: best_choice (green), new (cyan), popular (gold), hot (red), fast_payout (teal)
- Локализованные лейблы

### Rating.astro:
- SVG звёзды: полные, половинные (linearGradient), пустые
- Размеры: sm/md/lg
```

---

## ФАЗА 5: СТРАНИЦЫ

```
Создай 4 основные страницы + служебные.

### КРИТИЧЕСКИЕ SEO ПРАВИЛА ДЛЯ ВСЕХ СТРАНИЦ:
1. Уникальный <title> и <meta description> на каждом языке
2. Один H1 на страницу (содержит {{GAME_NAME}} + ключевое слово)
3. Иерархия заголовков: H1 → H2 → H3 (без пропусков)
4. Все изображения с alt-текстами (локализованными!)
5. Внутренние ссылки между страницами
6. Schema.org разметка на каждой странице
7. Breadcrumbs на каждой странице

### Порядок контента на КАЖДОЙ странице (конверсионная воронка):
1. Hero секция (заголовок, подзаголовок, CTA кнопки)
2. CasinoTopList (конвертим горячих посетителей СРАЗУ)
3. Статейный контент (SEO вес, информативность)
4. Красивые изображения СВЕРХУ статьи, геймплейные UI — ВНИЗУ (завлекаем!)
5. FAQ (ловим long-tail запросы)
6. Комментарии (социальное доказательство)

### [lang]/index.astro — Главная страница:

getStaticPaths() → 40 локалей

Секции по порядку:
1. HERO:
   - Градиентный фон + декоративные blur-круги + паттерн overlay (3% opacity)
   - Бейдж "{{PROVIDER}}" с пульсирующей точкой
   - H1: gradient text (белый → серый)
   - Subtitle: text-lg, text-gray-300
   - CTA: "Play Now" (primary, → /go/{{CASINO_1_SLUG}}) + "Play Free" (outline, → play-free)
   - Hero image (beautiful, eager loading!) — МЕЖДУ CTA и trust indicators
   - Trust indicators: Licensed, Instant Play, Exclusive Bonuses (иконки + текст)
   - WaveDecoration bottom

2. CASINO TOP LIST:
   - maxItems={3}, variant="full"

3. ARTICLE SECTION (bg-ocean-800):
   - Author + date
   - prose prose-invert prose-lg класс на <article>
   - H2: What Is {{GAME_NAME}}? → p1, p2 → КРАСИВОЕ изображение
   - H2: Features → список <li> → КРАСИВОЕ изображение
   - H2: How to Win → p1, p2
   - H2: How to Play → p1, p2 → ТЕМАТИЧЕСКОЕ изображение
   - H2: RTP & Stats → p1, p2 → specs таблица → ГЕЙМПЛЕЙ изображение

4. IMAGE GALLERY (14 тематических скриншотов)

5. FAQ (5 вопросов) + Comments

Schemas: websiteSchema, articleSchema, faqSchema

### [lang]/[...slug].astro — 3 динамические страницы:

getStaticPaths() → все slug/locale комбинации для play-free, where-to-play, review

Конфиг pageConfig для каждого pageId: title, description, ogImage, faqs

#### play-free:
1. Hero + breadcrumbs
2. GameDemo iframe (Preact island)
3. CTA "Play for Real Money"
4. Compact CasinoTopList (max 3)
5. How to Play: 3 шага в карточках (numbered circles)
6. Article: guide → КРАСИВОЕ изображение, features list, strategy → ТЕМАТИЧЕСКОЕ, vsReal table → ГЕЙМПЛЕЙ, tips
7. FAQ + Comments
Schemas: websiteSchema, articleSchema, faqSchema

#### where-to-play:
1. Hero + breadcrumbs
2. Full CasinoTopList (все казино)
3. Article: intro → КРАСИВОЕ изображение, bonuses, safety, payments table → ТЕМАТИЧЕСКОЕ, mobile, countries → ТЕМАТИЧЕСКОЕ
4. FAQ + Comments
Schemas: websiteSchema, articleSchema, faqSchema

#### review:
1. Hero + breadcrumbs
2. Expert Profile (из БД по языку)
3. Review Score Widget:
   - SVG circular progress ring (overall score)
   - 5 категорий с bar chart (graphics, gameplay, rtp, volatility, features)
4. Article: intro, graphics → КРАСИВОЕ изображение, gameplay → ТЕМАТИЧЕСКОЕ, rtp, volatility, features → ТЕМАТИЧЕСКОЕ, strategy, comparison table → ГЕЙМПЛЕЙ, verdict
5. Compact CasinoTopList (max 3)
6. FAQ + Comments
Schemas: websiteSchema, articleSchema, reviewSchema, softwareAppSchema, faqSchema

### go/[slug].astro — Affiliate редиректы (SSR!):
- prerender = false
- Lookup казино в БД по slug
- Tracking URL: {{AFFILIATE_TRACKER}}?key={{AFFILIATE_KEY}}&creative=${brandId}&keyword=${from}_${lang}
- 3-секундная задержка с анимацией (пузырьки, progress bar, spinner)
- meta refresh + JS setTimeout backup
- noindex, nofollow

### 404.astro:
- Standalone HTML (без layout)
- Большой gradient "404" текст
- Ссылки на 5 основных языков (EN, RU, DE, ES, FR)

### index.astro (корень):
- 301 redirect → /en/
```

---

## ФАЗА 6: SEO И SCHEMA.ORG

```
Создай src/lib/seo/schema-generators.ts с 7 генераторами:

1. websiteSchema() — WebSite с SearchAction
2. organizationSchema() — Организация с логотипом
3. articleSchema({title, description, url, image, datePublished, dateModified, locale, authorName})
   — Article с author (Person), publisher (Organization), inLanguage
4. faqSchema(faqs) — FAQPage с Question/AcceptedAnswer
5. reviewSchema({rating, author, datePublished}) — Review с itemReviewed: SoftwareApplication
6. softwareAppSchema() — SoftwareApplication:
   - name: "{{GAME_NAME}}"
   - applicationCategory: "GameApplication"
   - operatingSystem: "Web, iOS, Android"
   - aggregateRating: {ratingValue: {{REVIEW_SCORE}}, bestRating: 10, ratingCount: 1247}
7. itemListSchema() — ItemList для казино

### robots.txt:
User-agent: *
Allow: /
Disallow: /admin/
Disallow: /api/
Disallow: /go/
# Явно разрешаем AI ботов для индексации
User-agent: GPTBot
Allow: /
User-agent: ClaudeBot
Allow: /
User-agent: PerplexityBot
Allow: /
Sitemap: https://{{DOMAIN}}/sitemap-index.xml

### llms.txt:
Краткое описание сайта для AI-ботов: что за сайт, какие страницы, какие языки, основные факты об игре.

### manifest.json:
name, short_name, start_url, display, background_color, theme_color, icons
```

---

## ФАЗА 7: АДМИН-ПАНЕЛЬ

```
Создай полную админ-панель (8 страниц):

### Аутентификация:
- middleware.ts: проверяет cookie "session" на всех /admin/ и /api/ путях
- session.ts: in-memory Map с 24h TTL, 32-byte hex токены
- /api/auth/login.ts: POST, bcrypt-сравнение с settings.admin_password
- Пароль по умолчанию: "admin123" (с пометкой "СМЕНИТЕ ПОСЛЕ ДЕПЛОЯ!")

### AdminLayout.astro:
- Sidebar 256px (fixed desktop, slide-out mobile): 7 навигационных элементов с SVG иконками
- noindex, nofollow на всех admin-страницах

### Страницы:

1. Dashboard (index.astro):
   - 4 stat cards (кол-во казино, комментов, страниц контента, активных агентов)
   - Quick actions: генерация контента (npm run generate-content), пересборка сайта (/api/build/trigger)
   - Recent activity: последние комменты

2. Casinos (casinos.astro):
   - CRUD таблица с inline edit/delete
   - Drag-and-drop reordering (HTML5 Drag API)
   - Per-locale ordering/visibility (secondary table)
   - Modal форма: все поля казино

3. Content (content.astro):
   - Split-panel Markdown editor + live preview (marked library)
   - Выбор языка (40) + страницы (4)
   - SEO поля: metaTitle, metaDescription
   - FAQ editor: динамическое добавление/удаление Q&A
   - Кнопка AI-генерации контента

4. Comments (comments.astro):
   - Табы: Comments / AI Agents
   - Comments: фильтр по странице+языку, inline editing, delete, bulk AI generation
   - Agents: CRUD (personality, style, languages)
   - Scheduler toggle (start/stop)

5. Experts (experts.astro):
   - Грид 40 локалей (зелёная/красная метка assigned/not)
   - Форма: name, title, bio, credentials list, avatar

6. Settings (settings.astro):
   - API key (masked ****), AI model, comment interval
   - Scheduler on/off
   - Смена пароля
   - Кнопка rebuild + streaming лог

7. Images (images.astro):
   - Bing Image Search + скачивание
   - Upload
   - Библиотека с фильтром по категориям
   - Detail modal: copy path, delete

8. Login (login.astro):
   - Только поле пароля + кнопка (без username — один админ)
```

---

## ФАЗА 8: СКРИПТЫ

```
Создай все скрипты в scripts/:

### seed-db.ts — начальные данные:
- Settings: admin password (bcrypt "admin123"), OpenRouter API key placeholder, model "x-ai/grok-4.1-fast"
- 5 казино: {{CASINO_1_NAME}} ({{CASINO_1_RATING}}), ... с EN/RU бонусами, payments, pros/cons, badges
- 10 AI агентов для комментариев:
  CasualCarl (разговорный стиль, сленг)
  ProPeter (аналитический, технический)
  SkepticalSam (критический, честный)
  EnthusiastEmma (восторженная, позитивная)
  BeginnerBen (новичок, задаёт вопросы)
  BonusHunterBella (фокус на бонусах и промо)
  StrategySteve (стратегии, математика)
  HighRollerHank (крупные ставки, VIP)
  CryptoChris (крипто-платежи, blockchain)
  StreamerSarah (стриминг, контент-креатор)
- 1 эксперт для English
- casinoLocaleSettings для всех казино × языков

### optimize-images.mjs (Sharp):
- Source: images/ → Output: public/images/game/
- Маппинг файлов с нормализацией имён
- 3 профиля: logo (200px, q90), hero (1200px, q85), inline (800px, q80)
- Генерация WebP + оригинал
- Отчёт о savings

### generate-favicon.mjs (Sharp):
- Source: images/logo.png
- Output: favicon.ico (32x32 ICO), favicon-32x32.png, favicon-16x16.png, apple-touch-icon.png (180x180)

### generate-content.ts:
- Для каждой комбинации язык × страница: запрос к OpenRouter
- Промпт содержит: название игры, провайдера, RTP, механики
- Upsert в pageContent
- Rate limit: 3s между запросами
- CLI args: --lang=en, --page=home

### translate-content.ts:
- Переводит en.json → 39 языков через OpenRouter
- Батчи по 30 ключей
- Preserves: brand names ({{GAME_NAME}}, {{PROVIDER}}, названия казино)
- Preserves: технические термины (RTP, %, $)
- Merge с существующими (НЕ перезаписывает)

### generate-comments.ts:
- 4 комментария на страницу/язык
- Случайные агенты (фильтр по поддерживаемым языкам)
- Случайные даты (последние 30 дней)
- Rate limit: 3s

### generate-experts.ts:
- 40 экспертов (по одному на язык)
- Культурно-подходящие имена и биографии
- JSON output: {name, title, bio, credentials[]}
- Upsert на lang conflict

### generate-og-images.ts:
- 5 SVG файлов (1200x630px): default, home, play-free, where-to-play, review
- Стилизация под тему {{THEME}}

### fetch-images.ts:
- Bing proxy для скачивания изображений
- 25 поисковых запросов: "{{GAME_NAME}} game", "{{GAME_NAME}} casino", "{{GAME_NAME}} free play", etc.

### download-logos.ts:
- Поиск: "{casino} casino logo png transparent"
- Скачивание в public/images/casinos/{slug}.png
- Обновление logoPath в БД
```

---

## ФАЗА 9: ИЗОБРАЖЕНИЯ

```
### КРИТИЧЕСКИ ВАЖНО — порядок изображений на страницах:

1. КРАСИВЫЕ (beautiful/hero) — ВСЕГДА СВЕРХУ! Это первое что видит посетитель. Завлекаем!
2. ТЕМАТИЧЕСКИЕ (theme) — в середине статьи. Атмосферные, стильные.
3. ГЕЙМПЛЕЙНЫЕ UI (gameplay) — ВНИЗУ. Технические скриншоты интерфейса.

### Все изображения:
- <picture> с WebP source + JPG/PNG fallback
- Above-the-fold: loading="eager"
- Остальные: loading="lazy"
- Всегда: decoding="async", явные width/height (prevent layout shift)
- Alt-текст: описательный, уникальный, локализованный на все 40 языков

### Hero изображение:
- Максимально красивый скриншот
- rounded-2xl shadow-2xl border border-{theme}-600/30
- Между CTA кнопками и trust indicators

### Галерея:
- 14 оставшихся тематических изображений
- Responsive grid: 2→3→4 колонки
- Перед FAQ секцией

### Фавиконка:
- Генерируется из реального логотипа игры (НЕ оставлять дефолтный Astro значок!)
- Удалить favicon.svg если остался от Astro
```

---

## ФАЗА 10: ДЕПЛОЙ

```
Создай DEPLOY.md на русском языке с полной инструкцией:

### Сервер: Ubuntu 22.04+ VPS с ISPManager 6

### Шаги:
1. Подготовка (SSH, обновление, Node.js 20 через nvm, PM2)
2. Настройка домена (ISPManager, DNS A-записи, Let's Encrypt SSL)
3. Загрузка проекта (git clone или scp в /opt/{{GAME_NAME_SLUG}})
4. Сборка:
   - npm install
   - npm run db:generate && npm run db:migrate && npm run db:seed
   - npm run fetch-images
   - node scripts/optimize-images.mjs
   - node scripts/generate-favicon.mjs
   - npm run build
5. Запуск (PM2: pm2 start ecosystem.config.cjs + pm2 save)
6. Nginx конфиг:
   - HTTP→HTTPS redirect
   - www→non-www redirect
   - SSL (TLS 1.2+1.3)
   - Gzip (text, css, js, json, xml, svg)
   - Статика напрямую: /_astro/ (1y immutable), /images/ (30d), favicon (30d)
   - Proxy → 127.0.0.1:4321 для остального
   - Deny: /data/, /.*
7. Скрипт обновления (git pull → npm install → migrate → build → pm2 restart)
8. Проверка (curl всех основных URL, проверка 200/301 кодов)
9. Безопасность (сменить пароль, firewall, бэкапы data/database.sqlite)

### Полезные команды:
- Генерация контента: npx tsx scripts/generate-content.ts
- Перевод: npx tsx scripts/translate-content.ts
- Пересборка: npm run build && pm2 restart {{GAME_NAME_SLUG}}
```

---

## ФАЗА 11: ФИНАЛЬНАЯ ПРОВЕРКА

```
После создания ВСЕГО проекта, выполни проверку:

### Сборка:
- npm run build должен пройти БЕЗ ОШИБОК
- Все 161 HTML файл сгенерирован (40 языков × 4 страницы + redirect)

### SEO:
- [ ] H1 на каждой странице содержит {{GAME_NAME}}
- [ ] <title> уникален для каждого языка/страницы
- [ ] <meta description> уникален, содержит ключевые слова
- [ ] canonical URL корректен
- [ ] hreflang для всех 40 языков + x-default
- [ ] Open Graph теги (title, description, image, url)
- [ ] Schema.org: WebSite, Article, FAQ, Review, SoftwareApplication
- [ ] Breadcrumbs + BreadcrumbList schema
- [ ] robots.txt блокирует /admin/, /api/, /go/
- [ ] sitemap-index.xml сгенерирован

### Конверсия:
- [ ] CTA кнопки яркие, видны сразу (primary variant с glow)
- [ ] Casino toplist показывается СРАЗУ после hero (горячий трафик!)
- [ ] Affiliate ссылки все с rel="noopener noreferrer nofollow"
- [ ] /go/ редиректы работают с tracking parameters
- [ ] 18+ дисклеймер в футере

### Изображения:
- [ ] Все <img> имеют alt, width, height
- [ ] WebP + fallback через <picture>
- [ ] Hero image: loading="eager"
- [ ] Остальные: loading="lazy"
- [ ] Красивые изображения СВЕРХУ, геймплей ВНИЗУ
- [ ] Фавиконка — из логотипа игры (НЕ дефолтный Astro!)

### Производительность:
- [ ] Только 2 Preact-острова (comments + demo) — minimal JS
- [ ] client:visible (не грузятся до скролла)
- [ ] Preact вместо React (3KB vs 45KB)
- [ ] Google Fonts: preconnect + preload
- [ ] Tailwind purges unused CSS

### Мобильная версия:
- [ ] Responsive layout на всех страницах
- [ ] Touch targets ≥ 48px
- [ ] Mobile-first подход
- [ ] Hamburger menu работает

### Языки:
- [ ] 40 JSON файлов с 280+ ключами каждый
- [ ] RTL поддержка для Arabic/Hebrew
- [ ] Локализованные URL слаги
- [ ] Выбор языка в хедере работает (перенаправляет на ту же страницу)
```

---

## БЫСТРЫЙ СТАРТ (копируй и вставляй):

```
Создай полный production-ready affiliate-сайт для игры {{GAME_NAME}} от {{PROVIDER}}.

Домен: {{DOMAIN}}
Тип: {{GAME_TYPE}} | RTP: {{RTP}} | Max Win: {{MAX_WIN}} | Min Bet: {{MIN_BET}} | Max Bet: {{MAX_BET}}
Тема: {{THEME}} | Год: {{RELEASE_YEAR}}
Демо: {{DEMO_URL}}

Цветовая схема: {{THEME_COLORS}}
Акцентный цвет (CTA): {{PRIMARY_COLOR}}

Казино:
1. {{CASINO_1_NAME}} ({{CASINO_1_RATING}}) — бонус: {{CASINO_1_BONUS}}, brandId: {{CASINO_1_BRAND_ID}}
2-5. [аналогично]

Конкуренты для таблицы сравнения: {{COMPETITOR_1}}, {{COMPETITOR_2}}, {{COMPETITOR_3}}

Affiliate: tracker={{AFFILIATE_TRACKER}}, key={{AFFILIATE_KEY}}

Стек: Astro 5 + Preact + Tailwind + SQLite/Drizzle + Sharp
40 языков, 4 страницы (home, play-free, where-to-play, review) + admin панель + affiliate /go/ redirects

Создай ВСЁ: конфиги, БД, i18n (40 языков), компоненты, страницы, админку, скрипты, SEO, деплой.

Следуй фазам 0-11 из мега-промпта. Особое внимание:
- Красивые изображения СВЕРХУ, геймплейные UI ВНИЗУ (завлекаем людей!)
- CasinoTopList СРАЗУ после hero (конвертим горячий трафик!)
- hero.title содержит название игры + "Play Online" + текущий год
- Фавиконка из реального логотипа (НЕ дефолтная!)
- 18+ дисклеймер в футере
- RTL поддержка для арабского и иврита
- Schema.org на каждой странице
- Hreflang для всех 40 локалей
```
