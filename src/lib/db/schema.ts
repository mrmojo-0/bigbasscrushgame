import { sqliteTable, text, integer, real } from 'drizzle-orm/sqlite-core';

// Settings table - key/value store for app configuration
export const settings = sqliteTable('settings', {
  key: text('key').primaryKey(),
  value: text('value').notNull(),
  updatedAt: integer('updated_at', { mode: 'timestamp' }),
});

// Casinos table - affiliate casino listings
export const casinos = sqliteTable('casinos', {
  id: integer('id').primaryKey({ autoIncrement: true }),
  name: text('name').notNull(),
  slug: text('slug').notNull().unique(),
  brandId: text('brand_id').notNull(),
  logoPath: text('logo_path'),
  affiliateUrl: text('affiliate_url'),
  rating: real('rating').default(4.5),
  bonusText: text('bonus_text'), // JSON by language: { en: "...", ru: "..." }
  bonusAmount: text('bonus_amount'),
  welcomeBonus: text('welcome_bonus'), // JSON by language
  freeSpins: text('free_spins'),
  minDeposit: text('min_deposit'),
  license: text('license'),
  paymentMethods: text('payment_methods'), // JSON array
  pros: text('pros'), // JSON by language - arrays: { en: [...], ru: [...] }
  cons: text('cons'), // JSON by language - arrays
  description: text('description'), // JSON by language
  badges: text('badges'), // JSON array
  sortOrder: integer('sort_order').default(0),
  isActive: integer('is_active', { mode: 'boolean' }).default(true),
  createdAt: integer('created_at', { mode: 'timestamp' }),
  updatedAt: integer('updated_at', { mode: 'timestamp' }),
});

// Casino locale settings - per-language casino ordering and visibility
export const casinoLocaleSettings = sqliteTable('casino_locale_settings', {
  id: integer('id').primaryKey({ autoIncrement: true }),
  casinoId: integer('casino_id').notNull().references(() => casinos.id, { onDelete: 'cascade' }),
  lang: text('lang').notNull(),
  sortOrder: integer('sort_order').default(0),
  isVisible: integer('is_visible', { mode: 'boolean' }).default(true),
  createdAt: integer('created_at', { mode: 'timestamp' }),
  updatedAt: integer('updated_at', { mode: 'timestamp' }),
});

// Page content table - CMS content for each page/language
export const pageContent = sqliteTable('page_content', {
  id: integer('id').primaryKey({ autoIncrement: true }),
  pageSlug: text('page_slug').notNull(), // home, play-free, where-to-play, review
  lang: text('lang').notNull(),
  title: text('title').notNull(),
  metaTitle: text('meta_title'),
  metaDescription: text('meta_description'),
  content: text('content').notNull(), // Markdown
  faqData: text('faq_data'), // JSON array of { q, a }
  generatedByModel: text('generated_by_model'),
  createdAt: integer('created_at', { mode: 'timestamp' }),
  updatedAt: integer('updated_at', { mode: 'timestamp' }),
});

// Experts table - expert reviewer profiles per language
export const experts = sqliteTable('experts', {
  id: integer('id').primaryKey({ autoIncrement: true }),
  lang: text('lang').notNull().unique(),
  name: text('name').notNull(),
  avatarPath: text('avatar_path'),
  title: text('title'),
  bio: text('bio').notNull(),
  credentials: text('credentials'), // JSON array
  socialLinks: text('social_links'), // JSON object
  createdAt: integer('created_at', { mode: 'timestamp' }),
  updatedAt: integer('updated_at', { mode: 'timestamp' }),
});

// Comments table - user/AI comments on pages
export const comments = sqliteTable('comments', {
  id: integer('id').primaryKey({ autoIncrement: true }),
  pageSlug: text('page_slug').notNull(),
  lang: text('lang').notNull(),
  agentId: integer('agent_id').references(() => agents.id),
  authorName: text('author_name').notNull(),
  authorAvatar: text('author_avatar'),
  content: text('content').notNull(),
  rating: integer('rating'),
  parentId: integer('parent_id'),
  isVisible: integer('is_visible', { mode: 'boolean' }).default(true),
  createdAt: integer('created_at', { mode: 'timestamp' }),
});

// Agents table - AI persona definitions for generating comments/discussions
export const agents = sqliteTable('agents', {
  id: integer('id').primaryKey({ autoIncrement: true }),
  name: text('name').notNull(),
  avatar: text('avatar'),
  personality: text('personality').notNull(),
  style: text('style'),
  languages: text('languages'), // JSON array
  isActive: integer('is_active', { mode: 'boolean' }).default(true),
  lastGeneratedAt: integer('last_generated_at', { mode: 'timestamp' }),
  createdAt: integer('created_at', { mode: 'timestamp' }),
});

// Discussions table - threaded discussions/forum-like content
export const discussions = sqliteTable('discussions', {
  id: integer('id').primaryKey({ autoIncrement: true }),
  lang: text('lang').notNull(),
  agentId: integer('agent_id').references(() => agents.id),
  authorName: text('author_name').notNull(),
  authorAvatar: text('author_avatar'),
  content: text('content').notNull(),
  replyToId: integer('reply_to_id'),
  sortOrder: integer('sort_order').default(0),
  createdAt: integer('created_at', { mode: 'timestamp' }),
});

// Images table - managed image assets with multilingual alt text
export const images = sqliteTable('images', {
  id: integer('id').primaryKey({ autoIncrement: true }),
  originalUrl: text('original_url').notNull(),
  localPath: text('local_path').notNull(),
  altText: text('alt_text'), // JSON by language
  category: text('category'),
  width: integer('width'),
  height: integer('height'),
  createdAt: integer('created_at', { mode: 'timestamp' }),
});
