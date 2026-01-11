-- Drop Calendar - MySQL Seed Script
-- This script creates tables and inserts sample data for development/testing

-- ============================================
-- DROP EXISTING TABLES (if they exist)
-- ============================================
SET FOREIGN_KEY_CHECKS = 0;

DROP TABLE IF EXISTS `drop_tags`;
DROP TABLE IF EXISTS `reminders`;
DROP TABLE IF EXISTS `tasks`;
DROP TABLE IF EXISTS `drops`;
DROP TABLE IF EXISTS `tags`;
DROP TABLE IF EXISTS `users`;

SET FOREIGN_KEY_CHECKS = 1;

-- ============================================
-- CREATE TABLES
-- ============================================

-- Users table
CREATE TABLE `users` (
  `id` VARCHAR(191) NOT NULL,
  `email` VARCHAR(255) NOT NULL,
  `name` VARCHAR(255) DEFAULT NULL,
  `password` VARCHAR(255) DEFAULT NULL,
  `image` VARCHAR(500) DEFAULT NULL,
  `settings` JSON DEFAULT NULL,
  `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
  `updatedAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3) ON UPDATE CURRENT_TIMESTAMP(3),
  PRIMARY KEY (`id`),
  UNIQUE KEY `users_email_key` (`email`),
  KEY `users_email_idx` (`email`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Drops table
CREATE TABLE `drops` (
  `id` VARCHAR(191) NOT NULL,
  `title` VARCHAR(255) NOT NULL,
  `description` TEXT DEFAULT NULL,
  `launchAt` DATETIME(3) NOT NULL,
  `status` ENUM('Planned', 'InProgress', 'Ready', 'Launched', 'Archived') NOT NULL DEFAULT 'Planned',
  `channel` ENUM('Website', 'TikTok', 'Snapchat', 'Instagram', 'Retail', 'Other') NOT NULL,
  `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
  `updatedAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3) ON UPDATE CURRENT_TIMESTAMP(3),
  `userId` VARCHAR(191) NOT NULL,
  PRIMARY KEY (`id`),
  KEY `drops_userId_idx` (`userId`),
  KEY `drops_launchAt_idx` (`launchAt`),
  CONSTRAINT `drops_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `users` (`id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Tags table
CREATE TABLE `tags` (
  `id` VARCHAR(191) NOT NULL,
  `name` VARCHAR(100) NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `tags_name_key` (`name`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Drop Tags junction table
CREATE TABLE `drop_tags` (
  `dropId` VARCHAR(191) NOT NULL,
  `tagId` VARCHAR(191) NOT NULL,
  PRIMARY KEY (`dropId`, `tagId`),
  KEY `drop_tags_dropId_idx` (`dropId`),
  KEY `drop_tags_tagId_idx` (`tagId`),
  CONSTRAINT `drop_tags_dropId_fkey` FOREIGN KEY (`dropId`) REFERENCES `drops` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `drop_tags_tagId_fkey` FOREIGN KEY (`tagId`) REFERENCES `tags` (`id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Tasks table
CREATE TABLE `tasks` (
  `id` VARCHAR(191) NOT NULL,
  `title` VARCHAR(255) NOT NULL,
  `category` ENUM('Content', 'Samples', 'Shipping', 'Photoshoot', 'Other') NOT NULL,
  `dueAt` DATETIME(3) DEFAULT NULL,
  `status` ENUM('Todo', 'Doing', 'Done') NOT NULL DEFAULT 'Todo',
  `priority` ENUM('Low', 'Medium', 'High') NOT NULL DEFAULT 'Medium',
  `notes` TEXT DEFAULT NULL,
  `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
  `updatedAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3) ON UPDATE CURRENT_TIMESTAMP(3),
  `dropId` VARCHAR(191) NOT NULL,
  PRIMARY KEY (`id`),
  KEY `tasks_dropId_idx` (`dropId`),
  KEY `tasks_status_idx` (`status`),
  KEY `tasks_dueAt_idx` (`dueAt`),
  CONSTRAINT `tasks_dropId_fkey` FOREIGN KEY (`dropId`) REFERENCES `drops` (`id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Reminders table
CREATE TABLE `reminders` (
  `id` VARCHAR(191) NOT NULL,
  `type` ENUM('DaysBefore', 'AtTime') NOT NULL,
  `value` INT NOT NULL,
  `email` VARCHAR(255) DEFAULT NULL,
  `isActive` BOOLEAN NOT NULL DEFAULT TRUE,
  `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
  `updatedAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3) ON UPDATE CURRENT_TIMESTAMP(3),
  `userId` VARCHAR(191) NOT NULL,
  `dropId` VARCHAR(191) DEFAULT NULL,
  `taskId` VARCHAR(191) DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `reminders_userId_idx` (`userId`),
  KEY `reminders_dropId_idx` (`dropId`),
  KEY `reminders_taskId_idx` (`taskId`),
  CONSTRAINT `reminders_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `users` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `reminders_dropId_fkey` FOREIGN KEY (`dropId`) REFERENCES `drops` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `reminders_taskId_fkey` FOREIGN KEY (`taskId`) REFERENCES `tasks` (`id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ============================================
-- INSERT SAMPLE DATA
-- ============================================

-- Insert Users (password is "password123" for all users - bcrypt hashed)
INSERT INTO `users` (`id`, `email`, `name`, `password`, `settings`, `createdAt`, `updatedAt`) VALUES
('user_demo_001', 'demo@example.com', 'Demo User', '$2a$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/LewY5ckP0fkRDjW4S', '{"emailReminders": false, "reminderEmail": "demo@example.com"}', NOW(), NOW()),
('user_fashion_002', 'sarah@fashionbrand.com', 'Sarah Johnson', '$2a$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/LewY5ckP0fkRDjW4S', '{"emailReminders": true, "reminderEmail": "sarah@fashionbrand.com"}', NOW(), NOW()),
('user_designer_003', 'alex@streetwear.co', 'Alex Chen', '$2a$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/LewY5ckP0fkRDjW4S', '{"emailReminders": true, "reminderEmail": "alex@streetwear.co"}', NOW(), NOW());

-- Insert Tags
INSERT INTO `tags` (`id`, `name`) VALUES
('tag_001', 'Summer'),
('tag_002', 'Winter'),
('tag_003', 'Limited Edition'),
('tag_004', 'Collaboration'),
('tag_005', 'Sustainable'),
('tag_006', 'Streetwear'),
('tag_007', 'Premium'),
('tag_008', 'Accessories'),
('tag_009', 'Footwear'),
('tag_010', 'Apparel');

-- Insert Drops
INSERT INTO `drops` (`id`, `title`, `description`, `launchAt`, `status`, `channel`, `userId`, `createdAt`, `updatedAt`) VALUES
-- Demo User Drops
('drop_001', 'Summer Collection 2024', 'Vibrant summer collection featuring lightweight fabrics and bold colors. Perfect for beach season.', '2024-06-15 10:00:00', 'Planned', 'Website', 'user_demo_001', NOW(), NOW()),
('drop_002', 'Fall Urban Essentials', 'Essential streetwear pieces for the fall season. Includes hoodies, joggers, and accessories.', '2024-09-01 14:00:00', 'InProgress', 'Instagram', 'user_demo_001', NOW(), NOW()),
('drop_003', 'Holiday Special Edition', 'Limited edition holiday collection with exclusive designs and premium materials.', '2024-12-10 09:00:00', 'Ready', 'Website', 'user_demo_001', NOW(), NOW()),
('drop_004', 'Spring Florals', 'Fresh spring collection with floral prints and pastel colors.', '2024-03-20 11:00:00', 'Launched', 'TikTok', 'user_demo_001', NOW(), NOW()),
('drop_005', 'Winter Warmth 2023', 'Cozy winter collection from last year - archived for reference.', '2023-11-15 10:00:00', 'Archived', 'Retail', 'user_demo_001', NOW(), NOW()),

-- Sarah's Drops
('drop_006', 'Eco-Friendly Basics', 'Sustainable fashion line using recycled materials and organic cotton.', '2024-07-01 12:00:00', 'Planned', 'Website', 'user_fashion_002', NOW(), NOW()),
('drop_007', 'Athleisure Pro Series', 'High-performance athletic wear meets street style. Perfect for gym to street.', '2024-08-15 16:00:00', 'InProgress', 'Snapchat', 'user_fashion_002', NOW(), NOW()),

-- Alex's Drops
('drop_008', 'Sneaker Collab Drop', 'Exclusive collaboration with major sneaker brand. Limited to 500 pairs.', '2024-06-30 08:00:00', 'Ready', 'Instagram', 'user_designer_003', NOW(), NOW()),
('drop_009', 'Minimalist Capsule', 'Clean, minimal designs for the modern wardrobe. 10 essential pieces.', '2024-10-01 13:00:00', 'Planned', 'Website', 'user_designer_003', NOW(), NOW());

-- Insert Drop-Tag relationships
INSERT INTO `drop_tags` (`dropId`, `tagId`) VALUES
-- Summer Collection
('drop_001', 'tag_001'),
('drop_001', 'tag_010'),
-- Fall Urban
('drop_002', 'tag_006'),
('drop_002', 'tag_010'),
-- Holiday Special
('drop_003', 'tag_003'),
('drop_003', 'tag_007'),
-- Spring Florals
('drop_004', 'tag_010'),
-- Winter Warmth
('drop_005', 'tag_002'),
-- Eco-Friendly
('drop_006', 'tag_005'),
('drop_006', 'tag_010'),
-- Athleisure
('drop_007', 'tag_006'),
('drop_007', 'tag_010'),
-- Sneaker Collab
('drop_008', 'tag_004'),
('drop_008', 'tag_003'),
('drop_008', 'tag_009'),
-- Minimalist
('drop_009', 'tag_007'),
('drop_009', 'tag_010');

-- Insert Tasks for Summer Collection (drop_001)
INSERT INTO `tasks` (`id`, `title`, `category`, `dueAt`, `status`, `priority`, `notes`, `dropId`, `createdAt`, `updatedAt`) VALUES
('task_001', 'Product Photography', 'Photoshoot', '2024-06-01 10:00:00', 'Todo', 'High', 'Book professional photographer and studio for summer collection shoot', 'drop_001', NOW(), NOW()),
('task_002', 'Social Media Campaign', 'Content', '2024-06-05 14:00:00', 'Todo', 'High', 'Create 20 posts and 10 stories for Instagram and TikTok', 'drop_001', NOW(), NOW()),
('task_003', 'Influencer Samples', 'Samples', '2024-05-25 12:00:00', 'Todo', 'Medium', 'Send samples to 15 key influencers for reviews', 'drop_001', NOW(), NOW()),
('task_004', 'Website Banner Update', 'Content', '2024-06-10 09:00:00', 'Todo', 'Medium', 'Design and upload new banner for summer collection', 'drop_001', NOW(), NOW()),

-- Insert Tasks for Fall Urban Essentials (drop_002)
('task_005', 'Design Lookbook', 'Content', '2024-08-15 11:00:00', 'Doing', 'High', 'Create digital lookbook with styling ideas', 'drop_002', NOW(), NOW()),
('task_006', 'Production Samples Review', 'Samples', '2024-08-01 15:00:00', 'Done', 'High', 'Quality check all production samples', 'drop_002', NOW(), NOW()),
('task_007', 'Email Marketing Campaign', 'Content', '2024-08-20 10:00:00', 'Doing', 'Medium', 'Design and schedule email campaign for subscribers', 'drop_002', NOW(), NOW()),
('task_008', 'Retail Partner Coordination', 'Shipping', '2024-08-25 14:00:00', 'Todo', 'Medium', 'Coordinate shipping to retail partners', 'drop_002', NOW(), NOW()),

-- Insert Tasks for Holiday Special (drop_003)
('task_009', 'Gift Packaging Design', 'Other', '2024-11-15 10:00:00', 'Done', 'High', 'Design premium gift packaging for holiday edition', 'drop_003', NOW(), NOW()),
('task_010', 'Holiday Photoshoot', 'Photoshoot', '2024-11-20 09:00:00', 'Done', 'High', 'Festive photoshoot with holiday theme', 'drop_003', NOW(), NOW()),
('task_011', 'Pre-order Campaign', 'Content', '2024-11-25 12:00:00', 'Doing', 'High', 'Launch pre-order campaign with early bird discount', 'drop_003', NOW(), NOW()),
('task_012', 'Inventory Shipping', 'Shipping', '2024-12-01 08:00:00', 'Doing', 'High', 'Ship inventory to warehouse for launch day', 'drop_003', NOW(), NOW()),

-- Insert Tasks for Sneaker Collab (drop_008)
('task_013', 'Collab Partner Meeting', 'Other', '2024-06-10 14:00:00', 'Done', 'High', 'Final meeting with sneaker brand for approval', 'drop_008', NOW(), NOW()),
('task_014', 'Limited Edition Boxes', 'Samples', '2024-06-15 11:00:00', 'Doing', 'High', 'Design and produce special edition shoe boxes', 'drop_008', NOW(), NOW()),
('task_015', 'Raffle Setup', 'Content', '2024-06-20 10:00:00', 'Doing', 'Medium', 'Set up raffle system for fair distribution', 'drop_008', NOW(), NOW()),
('task_016', 'Launch Day Livestream', 'Content', '2024-06-30 07:00:00', 'Todo', 'High', 'Plan and prepare for Instagram livestream on launch day', 'drop_008', NOW(), NOW()),

-- Insert Tasks for Eco-Friendly Basics (drop_006)
('task_017', 'Sustainability Certification', 'Other', '2024-06-15 10:00:00', 'Todo', 'High', 'Complete sustainability certification process', 'drop_006', NOW(), NOW()),
('task_018', 'Eco-Packaging Development', 'Samples', '2024-06-20 14:00:00', 'Todo', 'High', 'Develop biodegradable packaging solutions', 'drop_006', NOW(), NOW()),
('task_019', 'Behind-the-Scenes Video', 'Content', '2024-06-25 12:00:00', 'Todo', 'Medium', 'Create video showing sustainable production process', 'drop_006', NOW(), NOW());

-- Insert Reminders
INSERT INTO `reminders` (`id`, `type`, `value`, `email`, `isActive`, `userId`, `dropId`, `taskId`, `createdAt`, `updatedAt`) VALUES
-- Drop reminders
('reminder_001', 'DaysBefore', 7, 'demo@example.com', TRUE, 'user_demo_001', 'drop_001', NULL, NOW(), NOW()),
('reminder_002', 'DaysBefore', 3, 'demo@example.com', TRUE, 'user_demo_001', 'drop_001', NULL, NOW(), NOW()),
('reminder_003', 'DaysBefore', 1, 'demo@example.com', TRUE, 'user_demo_001', 'drop_002', NULL, NOW(), NOW()),
('reminder_004', 'DaysBefore', 5, 'sarah@fashionbrand.com', TRUE, 'user_fashion_002', 'drop_006', NULL, NOW(), NOW()),
('reminder_005', 'DaysBefore', 2, 'alex@streetwear.co', TRUE, 'user_designer_003', 'drop_008', NULL, NOW(), NOW()),

-- Task reminders
('reminder_006', 'DaysBefore', 2, 'demo@example.com', TRUE, 'user_demo_001', NULL, 'task_001', NOW(), NOW()),
('reminder_007', 'DaysBefore', 1, 'demo@example.com', TRUE, 'user_demo_001', NULL, 'task_002', NOW(), NOW()),
('reminder_008', 'DaysBefore', 3, 'alex@streetwear.co', TRUE, 'user_designer_003', NULL, 'task_016', NOW(), NOW());

-- ============================================
-- SUMMARY
-- ============================================
SELECT 'Database seeded successfully!' AS message;
SELECT COUNT(*) AS user_count FROM users;
SELECT COUNT(*) AS drop_count FROM drops;
SELECT COUNT(*) AS tag_count FROM tags;
SELECT COUNT(*) AS task_count FROM tasks;
SELECT COUNT(*) AS reminder_count FROM reminders;

-- Show demo account info
SELECT
    'Login with these credentials:' AS info,
    'Email: demo@example.com' AS email,
    'Password: password123' AS password;
