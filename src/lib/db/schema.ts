import { sqliteTable, text, integer, real } from 'drizzle-orm/sqlite-core';

export const settings = sqliteTable('settings', {
  key: text('key').primaryKey(),
  value: text('value').notNull(),
  updatedAt: integer('updated_at', { mode: 'timestamp' }),
});

export const sessions = sqliteTable('sessions', {
  token: text('token').primaryKey(),
  expiresAt: integer('expires_at').notNull(),
});

export const casinos = sqliteTable('casinos', {
  id: integer('id').primaryKey({ autoIncrement: true }),
  name: text('name').notNull(),
  slug: text('slug').notNull().unique(),
  brandId: text('brand_id').notNull(),
  logoPath: text('logo_path'),
  affiliateUrl: text('affiliate_url'),
  rating: real('rating').default(4.5),
  bonusText: text('bonus_text'),
  bonusAmount: text('bonus_amount'),
  welcomeBonus: text('welcome_bonus'),
  freeSpins: text('free_spins'),
  minDeposit: text('min_deposit'),
  license: text('license'),
  paymentMethods: text('payment_methods'),
  pros: text('pros'),
  cons: text('cons'),
  description: text('description'),
  badges: text('badges'),
  sortOrder: integer('sort_order').default(0),
  isActive: integer('is_active', { mode: 'boolean' }).default(true),
  createdAt: integer('created_at', { mode: 'timestamp' }),
  updatedAt: integer('updated_at', { mode: 'timestamp' }),
});

export const casinoLocaleSettings = sqliteTable('casino_locale_settings', {
  id: integer('id').primaryKey({ autoIncrement: true }),
  casinoId: integer('casino_id').notNull().references(() => casinos.id, { onDelete: 'cascade' }),
  lang: text('lang').notNull(),
  sortOrder: integer('sort_order').default(0),
  isVisible: integer('is_visible', { mode: 'boolean' }).default(true),
  createdAt: integer('created_at', { mode: 'timestamp' }),
  updatedAt: integer('updated_at', { mode: 'timestamp' }),
});

export const pageContent = sqliteTable('page_content', {
  id: integer('id').primaryKey({ autoIncrement: true }),
  pageSlug: text('page_slug').notNull(),
  lang: text('lang').notNull(),
  title: text('title').notNull(),
  metaTitle: text('meta_title'),
  metaDescription: text('meta_description'),
  content: text('content').notNull(),
  faqData: text('faq_data'),
  generatedByModel: text('generated_by_model'),
  createdAt: integer('created_at', { mode: 'timestamp' }),
  updatedAt: integer('updated_at', { mode: 'timestamp' }),
});

export const experts = sqliteTable('experts', {
  id: integer('id').primaryKey({ autoIncrement: true }),
  lang: text('lang').notNull().unique(),
  name: text('name').notNull(),
  avatarPath: text('avatar_path'),
  title: text('title'),
  bio: text('bio').notNull(),
  credentials: text('credentials'),
  socialLinks: text('social_links'),
  createdAt: integer('created_at', { mode: 'timestamp' }),
  updatedAt: integer('updated_at', { mode: 'timestamp' }),
});

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

export const agents = sqliteTable('agents', {
  id: integer('id').primaryKey({ autoIncrement: true }),
  name: text('name').notNull(),
  avatar: text('avatar'),
  personality: text('personality').notNull(),
  style: text('style'),
  languages: text('languages'),
  isActive: integer('is_active', { mode: 'boolean' }).default(true),
  lastGeneratedAt: integer('last_generated_at', { mode: 'timestamp' }),
  createdAt: integer('created_at', { mode: 'timestamp' }),
});

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

export const images = sqliteTable('images', {
  id: integer('id').primaryKey({ autoIncrement: true }),
  originalUrl: text('original_url').notNull(),
  localPath: text('local_path').notNull(),
  altText: text('alt_text'),
  category: text('category'),
  width: integer('width'),
  height: integer('height'),
  createdAt: integer('created_at', { mode: 'timestamp' }),
});
