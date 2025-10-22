CREATE TABLE IF NOT EXISTS `users` (
    `id` BIGINT UNSIGNED PRIMARY KEY AUTO_INCREMENT NOT NULL,
    `email` VARCHAR(512) UNIQUE NOT NULL,
    `pseudo` VARCHAR(64) UNIQUE NOT NULL,
    `firstname` VARCHAR(256) NOT NULL,
    `lastname` VARCHAR(256) NOT NULL,
    `created_on` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    `last_connection` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    `deleted_on` DATETIME NULL,
    `verified_email` BOOLEAN NOT NULL DEFAULT FALSE
);

CREATE TABLE IF NOT EXISTS `users_hashed_pass` (
    `user_id` BIGINT UNSIGNED UNIQUE NOT NULL,
    `hashed_pass` CHAR(64) NOT NULL,
    FOREIGN KEY (`user_id`)
        REFERENCES `users`(`id`)
        ON DELETE CASCADE
        ON UPDATE CASCADE
);

CREATE TABLE IF NOT EXISTS `roles` (
    `id` BIGINT UNSIGNED PRIMARY KEY AUTO_INCREMENT NOT NULL,
    `title` VARCHAR(128) UNIQUE NOT NULL
);

CREATE TABLE IF NOT EXISTS `users_roles` (
    `user_id` BIGINT UNSIGNED NOT NULL,
    `role_id` BIGINT UNSIGNED NOT NULL,
    UNIQUE(`user_id`, `role_id`),
    FOREIGN KEY (`user_id`)
        REFERENCES `users`(`id`)
        ON DELETE CASCADE
        ON UPDATE CASCADE,
    FOREIGN KEY (`role_id`)
        REFERENCES `roles`(`id`)
        ON DELETE CASCADE
        ON UPDATE CASCADE
);

CREATE TABLE IF NOT EXISTS `groups` (
    `id` BIGINT UNSIGNED PRIMARY KEY AUTO_INCREMENT NOT NULL,
    `parent_id` BIGINT UNSIGNED NULL,
    `title` VARCHAR(128) NOT NULL,
    UNIQUE(`parent_id`, `title`),
    FOREIGN KEY (`parent_id`)
        REFERENCES `groups`(`id`)
        ON DELETE CASCADE
        ON UPDATE CASCADE
);

CREATE TABLE IF NOT EXISTS `users_groups` (
    `user_id` BIGINT UNSIGNED NOT NULL,
    `group_id` BIGINT UNSIGNED NOT NULL,
    UNIQUE(`user_id`, `group_id`),
    FOREIGN KEY (`user_id`)
        REFERENCES `users`(`id`)
        ON DELETE CASCADE
        ON UPDATE CASCADE,
    FOREIGN KEY (`group_id`)
        REFERENCES `groups`(`id`)
        ON DELETE CASCADE
        ON UPDATE CASCADE
);

CREATE TABLE IF NOT EXISTS `slots` (
    `id` BIGINT UNSIGNED PRIMARY KEY AUTO_INCREMENT NOT NULL,
    `start` TIME NOT NULL,
    `end` TIME NOT NULL,
    UNIQUE(`start`, `end`)
);

CREATE TABLE IF NOT EXISTS `buildings` (
    `id` BIGINT UNSIGNED PRIMARY KEY AUTO_INCREMENT NOT NULL,
    `name` VARCHAR(128) UNIQUE NOT NULL,
    `description` TEXT NULL
);

CREATE TABLE IF NOT EXISTS `rooms` (
    `id` BIGINT UNSIGNED PRIMARY KEY AUTO_INCREMENT NOT NULL,
    `building_id` BIGINT UNSIGNED NOT NULL,
    `name` VARCHAR(128) NOT NULL,
    `description` TEXT NULL,
    `capacity` SMALLINT UNSIGNED NOT NULL DEFAULT 0,
    UNIQUE(`building_id`, `name`),
    FOREIGN KEY (`building_id`)
        REFERENCES `buildings`(`id`)
        ON DELETE CASCADE
        ON UPDATE CASCADE
);

CREATE TABLE IF NOT EXISTS `lessons` (
    `id` BIGINT UNSIGNED PRIMARY KEY AUTO_INCREMENT NOT NULL,
    `title` VARCHAR(64) UNIQUE NOT NULL
);

CREATE TABLE IF NOT EXISTS `lesson_types` (
    `id` BIGINT UNSIGNED PRIMARY KEY AUTO_INCREMENT NOT NULL,
    `title` VARCHAR(64) UNIQUE NOT NULL
);

CREATE TABLE IF NOT EXISTS `lessons_groups` (
    `lesson_id` BIGINT UNSIGNED NOT NULL,
    `lesson_type_id` BIGINT UNSIGNED NOT NULL,
    `lesson_arg` TINYINT UNSIGNED NULL,
    `group_id` BIGINT UNSIGNED NOT NULL,
    UNIQUE(`lesson_id`, `lesson_type_id`, `lesson_arg`, `group_id`),
    FOREIGN KEY (`lesson_id`)
        REFERENCES `lessons`(`id`)
        ON DELETE CASCADE
        ON UPDATE CASCADE,
    FOREIGN KEY (`lesson_type_id`)
        REFERENCES `lesson_types`(`id`)
        ON DELETE CASCADE
        ON UPDATE CASCADE,
    FOREIGN KEY (`group_id`)
        REFERENCES `groups`(`id`)
        ON DELETE CASCADE
        ON UPDATE CASCADE
);

CREATE TABLE IF NOT EXISTS `events` (
    `id` BIGINT UNSIGNED PRIMARY KEY AUTO_INCREMENT NOT NULL,
    `day` DATE NOT NULL,
    `slot_id` BIGINT UNSIGNED NOT NULL,
    `room_id` BIGINT UNSIGNED NULL,
    `lesson_id` BIGINT UNSIGNED NULL,
    `lesson_type_id` BIGINT UNSIGNED NULL,
    `lesson_arg` TINYINT UNSIGNED NULL,
    UNIQUE(`day`, `slot_id`, `room_id`),
    FOREIGN KEY (`slot_id`)
        REFERENCES `slots`(`id`)
        ON DELETE CASCADE
        ON UPDATE CASCADE,
    FOREIGN KEY (`room_id`)
        REFERENCES `rooms`(`id`)
        ON DELETE CASCADE
        ON UPDATE CASCADE,
    FOREIGN KEY (`lesson_id`)
        REFERENCES `lessons`(`id`)
        ON DELETE CASCADE
        ON UPDATE CASCADE,
    FOREIGN KEY (`lesson_type_id`)
        REFERENCES `lesson_types`(`id`)
        ON DELETE CASCADE
        ON UPDATE CASCADE,
    FOREIGN KEY (`lesson_arg`)
        REFERENCES `lessons_groups`(`lesson_arg`)
        ON DELETE CASCADE
        ON UPDATE CASCADE
);

CREATE TABLE IF NOT EXISTS `users_events` (
    `user_id` BIGINT UNSIGNED NOT NULL,
    `event_id` BIGINT UNSIGNED NOT NULL,
    UNIQUE(`user_id`, `event_id`),
    FOREIGN KEY (`user_id`)
        REFERENCES `users`(`id`)
        ON DELETE CASCADE
        ON UPDATE CASCADE,
    FOREIGN KEY (`event_id`)
        REFERENCES `events`(`id`)
        ON DELETE CASCADE
        ON UPDATE CASCADE
);
