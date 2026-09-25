CREATE TABLE `accesses` (
	`id` text PRIMARY KEY NOT NULL,
	`owner` text NOT NULL,
	`member_id` text,
	`name` text NOT NULL,
	`allowed` integer NOT NULL,
	`reason` text NOT NULL,
	`venue` text NOT NULL,
	`created_at` text NOT NULL
);
--> statement-breakpoint
CREATE INDEX `accesses_owner_date` ON `accesses` (`owner`,`created_at`);--> statement-breakpoint
CREATE TABLE `audit` (
	`id` text PRIMARY KEY NOT NULL,
	`owner` text NOT NULL,
	`action` text NOT NULL,
	`detail` text NOT NULL,
	`created_at` text NOT NULL
);
--> statement-breakpoint
CREATE INDEX `audit_owner_date` ON `audit` (`owner`,`created_at`);--> statement-breakpoint
CREATE TABLE `bookings` (
	`id` text PRIMARY KEY NOT NULL,
	`owner` text NOT NULL,
	`court` integer NOT NULL,
	`day` text NOT NULL,
	`start` integer NOT NULL,
	`name` text NOT NULL,
	`phone` text DEFAULT '' NOT NULL,
	`kind` text DEFAULT 'booking' NOT NULL,
	`status` text DEFAULT 'confirmed' NOT NULL,
	`amount` integer DEFAULT 0 NOT NULL,
	`deposit` integer DEFAULT 0 NOT NULL,
	`created_at` text NOT NULL,
	`request_key` text NOT NULL
);
--> statement-breakpoint
CREATE UNIQUE INDEX `bookings_active_slot` ON `bookings` (`owner`,`court`,`day`,`start`) WHERE "bookings"."status" = 'confirmed';--> statement-breakpoint
CREATE UNIQUE INDEX `bookings_owner_request` ON `bookings` (`owner`,`request_key`);--> statement-breakpoint
CREATE INDEX `bookings_owner_day` ON `bookings` (`owner`,`day`);--> statement-breakpoint
CREATE TABLE `enrollments` (
	`id` text PRIMARY KEY NOT NULL,
	`owner` text NOT NULL,
	`session_id` text NOT NULL,
	`member_id` text NOT NULL,
	FOREIGN KEY (`session_id`) REFERENCES `sessions`(`id`) ON UPDATE no action ON DELETE no action,
	FOREIGN KEY (`member_id`) REFERENCES `members`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE UNIQUE INDEX `enrollments_session_member` ON `enrollments` (`session_id`,`member_id`);--> statement-breakpoint
CREATE TABLE `members` (
	`id` text PRIMARY KEY NOT NULL,
	`owner` text NOT NULL,
	`name` text NOT NULL,
	`dni` text NOT NULL,
	`phone` text DEFAULT '' NOT NULL,
	`plan_id` text NOT NULL,
	`status` text DEFAULT 'active' NOT NULL,
	`expires` text NOT NULL,
	`created_at` text NOT NULL,
	FOREIGN KEY (`plan_id`) REFERENCES `plans`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE UNIQUE INDEX `members_owner_dni` ON `members` (`owner`,`dni`);--> statement-breakpoint
CREATE INDEX `members_owner_expiry` ON `members` (`owner`,`expires`);--> statement-breakpoint
CREATE TABLE `payments` (
	`id` text PRIMARY KEY NOT NULL,
	`owner` text NOT NULL,
	`member_id` text NOT NULL,
	`amount` integer NOT NULL,
	`method` text NOT NULL,
	`created_at` text NOT NULL,
	`request_key` text NOT NULL,
	FOREIGN KEY (`member_id`) REFERENCES `members`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE UNIQUE INDEX `payments_owner_request` ON `payments` (`owner`,`request_key`);--> statement-breakpoint
CREATE INDEX `payments_owner_date` ON `payments` (`owner`,`created_at`);--> statement-breakpoint
CREATE TABLE `plans` (
	`id` text PRIMARY KEY NOT NULL,
	`owner` text NOT NULL,
	`name` text NOT NULL,
	`price` integer NOT NULL,
	`days` integer NOT NULL
);
--> statement-breakpoint
CREATE TABLE `sessions` (
	`id` text PRIMARY KEY NOT NULL,
	`owner` text NOT NULL,
	`name` text NOT NULL,
	`day` text NOT NULL,
	`time` text NOT NULL,
	`capacity` integer NOT NULL,
	`venue` text NOT NULL
);
--> statement-breakpoint
CREATE INDEX `sessions_owner_day` ON `sessions` (`owner`,`day`);