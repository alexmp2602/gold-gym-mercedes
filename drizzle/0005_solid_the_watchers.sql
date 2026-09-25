CREATE TABLE `booking_payments` (
	`id` text PRIMARY KEY NOT NULL,
	`owner` text NOT NULL,
	`booking_id` text NOT NULL,
	`kind` text NOT NULL,
	`amount` integer NOT NULL,
	`method` text NOT NULL,
	`created_at` text NOT NULL,
	FOREIGN KEY (`booking_id`) REFERENCES `bookings`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE UNIQUE INDEX `booking_payments_kind` ON `booking_payments` (`owner`,`booking_id`,`kind`);--> statement-breakpoint
CREATE INDEX `booking_payments_owner_date` ON `booking_payments` (`owner`,`created_at`);