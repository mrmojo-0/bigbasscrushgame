CREATE TABLE `agents` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`name` text NOT NULL,
	`avatar` text,
	`personality` text NOT NULL,
	`style` text,
	`languages` text,
	`is_active` integer DEFAULT true,
	`last_generated_at` integer,
	`created_at` integer
);
--> statement-breakpoint
CREATE TABLE `casinos` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`name` text NOT NULL,
	`slug` text NOT NULL,
	`brand_id` text NOT NULL,
	`logo_path` text,
	`affiliate_url` text,
	`rating` real DEFAULT 4.5,
	`bonus_text` text,
	`bonus_amount` text,
	`welcome_bonus` text,
	`free_spins` text,
	`min_deposit` text,
	`license` text,
	`payment_methods` text,
	`pros` text,
	`cons` text,
	`description` text,
	`badges` text,
	`sort_order` integer DEFAULT 0,
	`is_active` integer DEFAULT true,
	`created_at` integer,
	`updated_at` integer
);
--> statement-breakpoint
CREATE UNIQUE INDEX `casinos_slug_unique` ON `casinos` (`slug`);--> statement-breakpoint
CREATE TABLE `comments` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`page_slug` text NOT NULL,
	`lang` text NOT NULL,
	`agent_id` integer,
	`author_name` text NOT NULL,
	`author_avatar` text,
	`content` text NOT NULL,
	`rating` integer,
	`parent_id` integer,
	`is_visible` integer DEFAULT true,
	`created_at` integer,
	FOREIGN KEY (`agent_id`) REFERENCES `agents`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE TABLE `discussions` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`lang` text NOT NULL,
	`agent_id` integer,
	`author_name` text NOT NULL,
	`author_avatar` text,
	`content` text NOT NULL,
	`reply_to_id` integer,
	`sort_order` integer DEFAULT 0,
	`created_at` integer,
	FOREIGN KEY (`agent_id`) REFERENCES `agents`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE TABLE `experts` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`lang` text NOT NULL,
	`name` text NOT NULL,
	`avatar_path` text,
	`title` text,
	`bio` text NOT NULL,
	`credentials` text,
	`social_links` text,
	`created_at` integer,
	`updated_at` integer
);
--> statement-breakpoint
CREATE UNIQUE INDEX `experts_lang_unique` ON `experts` (`lang`);--> statement-breakpoint
CREATE TABLE `images` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`original_url` text NOT NULL,
	`local_path` text NOT NULL,
	`alt_text` text,
	`category` text,
	`width` integer,
	`height` integer,
	`created_at` integer
);
--> statement-breakpoint
CREATE TABLE `page_content` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`page_slug` text NOT NULL,
	`lang` text NOT NULL,
	`title` text NOT NULL,
	`meta_title` text,
	`meta_description` text,
	`content` text NOT NULL,
	`faq_data` text,
	`generated_by_model` text,
	`created_at` integer,
	`updated_at` integer
);
--> statement-breakpoint
CREATE TABLE `settings` (
	`key` text PRIMARY KEY NOT NULL,
	`value` text NOT NULL,
	`updated_at` integer
);
