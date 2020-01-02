CREATE DATABASE blog;

USE blog;

CREATE TABLE users(
    user_id int(11) PRIMARY KEY AUTO_INCREMENT,
    username VARCHAR(16) NOT NULL,
    fullname VARCHAR(30) NOT NULL,
    email VARCHAR(100)  NOT NULL,
    password VARCHAR(64) NOT NULL,
    category VARCHAR(15) DEFAULT 'Subscriber',
    image VARCHAR(30),
);

CREATE TABLE posts(
    id VARCHAR(64) PRIMARY KEY,
    author VARCHAR(30) NOT NULL,
    dateCreated DATETIME DEFAULT CURRENT_TIMESTAMP,
    title VARCHAR(100) NOT NULL,
    excerpt VARCHAR(500) NOT NULL,
    content TEXT NOT NULL,
    category VARCHAR(15) NOT NULL DEFAULT 'Undefined'
    image VARCHAR(30)
);

CREATE TABLE comments(
    id int primary key AUTO_INCREMENT,
    user_id int,
    post_id VARCHAR(15),
    comment text,
    date VARCHAR(11),
    status VARCHAR(9),
    approved VARCHAR(9)
);

CREATE TABLe categories(
    id int primary key AUTO_INCREMENT,
    name VARCHAR(15)
);
