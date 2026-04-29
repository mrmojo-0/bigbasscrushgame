CREATE TABLE `casino_locale_settings` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`casino_id` integer NOT NULL,
	`lang` text NOT NULL,
	`sort_order` integer DEFAULT 0,
	`is_visible` integer DEFAULT true,
	`created_at` integer,
	`updated_at` integer,
	FOREIGN KEY (`casino_id`) REFERENCES `casinos`(`id`) ON UPDATE no action ON DELETE cascade
);
