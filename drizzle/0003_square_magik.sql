CREATE TABLE `restores` (
	`owner` text PRIMARY KEY NOT NULL,
	`request_key` text NOT NULL,
	`count` integer NOT NULL,
	`created_at` text NOT NULL
);
