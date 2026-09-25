CREATE TABLE `settings` (
	`owner` text PRIMARY KEY NOT NULL,
	`padel_price` integer DEFAULT 24000 NOT NULL,
	`booking_days` integer DEFAULT 30 NOT NULL,
	`cancel_hours` integer DEFAULT 24 NOT NULL
);
--> statement-breakpoint
ALTER TABLE `bookings` ADD `created_by` text;