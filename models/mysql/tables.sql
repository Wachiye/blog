CREATE TABLE IF NOT EXISTS `users` (
  `id` INT UNSIGNED  NOT NULL AUTO_INCREMENT,
  `username` varchar(16) NOT NULL,
  `password` varchar(64) NOT NULL,
  `image` varchar(30) DEFAULT NULL,
  `fullname` varchar(30) DEFAULT NULL,
  `email` varchar(30) DEFAULT NULL,
  `category` varchar(15) DEFAULT 'User',
  `website` varchar(100) DEFAULT NULL,
  `dateCreated` DATE DEFAULT (CURRENT_DATE),
  `posts` INT UNSIGNED DEFAULT '0',
  `comments` INT UNSIGNED DEFAULT '0',
  PRIMARY KEY (`id`),
  UNIQUE KEY `email` (`email`),
  INDEX  `USERNAME`(`username` ASC)
);

CREATE TABLE IF NOT EXISTS `subscribers` (
  `id` INT UNSIGNED  NOT NULL AUTO_INCREMENT,
  `username` varchar(30) NOT NULL,
  `email` varchar(100) NOT NULL UNIQUE,
  `website` varchar(100) DEFAULT NULL,
  `comments` INT UNSIGNED DEFAULT '0',
  `dateCreated` DATE default (CURRENT_DATE),
  PRIMARY KEY (`id`)
);

CREATE TABLE IF NOT EXISTS `members` (
  `id` INT UNSIGNED NOT NULL,
  `fullname` varchar(30) NOT NULL,
  `email` varchar(100) NOT NULL,
  `phone` varchar(16) DEFAULT NULL,
  `specialization` varchar(100) NOT NULL DEFAULT 'Web Design',
  `languages` varchar(100) NOT NULL DEFAULT 'HTML, CSS, JavaScript',
  `team_id` int UNSIGNED DEFAULT 0,
  `team_name` varchar(255) NOT NULL DEFAULT 'General',
  `role` varchar(15) NOT NULL DEFAULT 'Member',
  `image` varchar(15) NOT NULL DEFAULT 'Person.png',
  PRIMARY KEY (`id`)
);

CREATE TABLE IF NOT EXISTS `teams` (
  `id` INT UNSIGNED NOT NULL AUTO_INCREMENT,
  `name` varchar(15) NOT NULL,
  `description` text DEFAULT NULL,
  `hiring` text DEFAULT NULL,
  `members` INT UNSIGNED NOT NULL DEFAULT 0,
  PRIMARY KEY (`id`)
);

CREATE TABLE IF NOT EXISTS `posts` (
  `id` varchar(64) NOT NULL,
  `author` varchar(30) NOT NULL,
  `dateCreated` DATE DEFAULT (CURRENT_DATE),
  `title` varchar(100) NOT NULL,
  `excerpt` varchar(500) NOT NULL,
  `content` text NOT NULL,
  `image` varchar(30) DEFAULT NULL,
  `views` INT UNSIGNED DEFAULT '0',
  `comments` INT UNSIGNED DEFAULT '0',
  `category` varchar(15) DEFAULT 'undefined',
  `tags` varchar(100) DEFAULT 'undefined',
  PRIMARY KEY (`id`),
  INDEX `CATEGORY`(`category` ASC)
);

CREATE TABLE IF NOT EXISTS `comments` (
  `id` INT UNSIGNED NOT NULL AUTO_INCREMENT,
  `user` json,
  `post_id` varchar(64) DEFAULT NULL,
  `comment` text,
  `date` date DEFAULT (CURRENT_DATE),
  `status` varchar(9) DEFAULT 'unread',
  `approved` varchar(9) DEFAULT NULL,
  PRIMARY KEY (`id`),
  CONSTRAINT `post_id` FOREIGN KEY(`post_id`) REFERENCES `posts`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE
);

CREATE TABLE IF NOT EXISTS `contacts` (
  `id` INT UNSIGNED NOT NULL AUTO_INCREMENT,
  `fullname` varchar(30) DEFAULT NULL,
  `email` varchar(100) DEFAULT NULL,
  `message` text,
  `date` DATE DEFAULT (CURRENT_DATE),
  `status` varchar(9) DEFAULT 'unread',
  PRIMARY KEY (`id`)
);

CREATE TABLE IF NOT EXISTS `testimonials` (
  `id` INT UNSIGNED NOT NULL AUTO_INCREMENT,
  `name` varchar(30) NOT NULL,
  `job` varchar(100) DEFAULT NULL,
  `company` varchar(100) DEFAULT NULL,
  `email` varchar(100) NOT NULL,
  `testimony` text,
  `status` varchar(9) DEFAULT 'unread' ,
  PRIMARY KEY (`id`)
);
CREATE TABLE IF NOT EXISTS `settings` (
  `id` INT UNSIGNED NOT NULL AUTO_INCREMENT,
  `setting` varchar(100) NOT NULL,
  `content` json,
  PRIMARY KEY (`id`)
);

CREATE TABLE IF NOT EXISTS `services` (
  `id` INT UNSIGNED NOT NULL AUTO_INCREMENT,
  `name` varchar(255) NOT NULL,
  `description`  text NOT NULL,
  `image` varchar(255) NOT NULL,
  `level` enum('Normal','Important') default 'Normal',
  PRIMARY KEY (`id`)
);

CREATE TABLE IF NOT EXISTS `categories` (
  `id` INT UNSIGNED NOT NULL AUTO_INCREMENT,
  `name` varchar(15) NOT NULL,
  `description` varchar(100) DEFAULT NULL,
  `tags` text,
  PRIMARY KEY (`id`)
);

CREATE TABLE IF NOT EXISTS  `siteviews`(
  `id` INT UNSIGNED NOT NULL AUTO_INCREMENT,
  `name` varchar(15) NOT NULL DEFAULT 'home',
  `views` INT UNSIGNED NOT NULL DEFAULT 0,
  PRIMARY KEY(`id`)
);

insert INTO siteviews(name, views) values('home',0),('about',0),('services',0),('team',0),('posts',0),('contact',0);