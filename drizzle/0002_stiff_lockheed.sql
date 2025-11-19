ALTER TABLE `users` ADD `subscriptionPlan` varchar(50) DEFAULT 'free' NOT NULL;--> statement-breakpoint
ALTER TABLE `users` ADD `stripeCustomerId` varchar(255);--> statement-breakpoint
ALTER TABLE `users` ADD `stripeSubscriptionId` varchar(255);--> statement-breakpoint
ALTER TABLE `users` ADD `subscriptionStatus` varchar(50);--> statement-breakpoint
ALTER TABLE `users` ADD `subscriptionEndsAt` timestamp;