-- Sarah Jewellers Smart Email Generator
-- Database Schema

CREATE DATABASE IF NOT EXISTS sarah_jewellers;
USE sarah_jewellers;

CREATE TABLE IF NOT EXISTS admin_users (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    username VARCHAR(100) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL
);

CREATE TABLE IF NOT EXISTS customers (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255) NOT NULL UNIQUE,
    phone VARCHAR(20),
    birthday DATE,
    anniversary DATE,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS email_templates (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    occasion VARCHAR(50) NOT NULL,       -- BIRTHDAY, ANNIVERSARY, FESTIVAL
    subject VARCHAR(500) NOT NULL,
    body TEXT NOT NULL,
    festival_name VARCHAR(100)           -- e.g. Diwali, Ramadan (for FESTIVAL type)
);

CREATE TABLE IF NOT EXISTS email_drafts (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    customer_id BIGINT NOT NULL,
    subject VARCHAR(500) NOT NULL,
    body TEXT NOT NULL,
    occasion VARCHAR(50),
    status VARCHAR(20) DEFAULT 'PENDING', -- PENDING, SENT
    image_path VARCHAR(500),
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    sent_at DATETIME,
    FOREIGN KEY (customer_id) REFERENCES customers(id) ON DELETE CASCADE
);

-- Sample customer data
INSERT INTO customers (name, email, phone, birthday, anniversary) VALUES
('Priya Sharma', 'priya@example.com', '9876543210', '1990-03-16', '2015-11-20'),
('Rahul Mehta', 'rahul@example.com', '9876543211', '1985-06-22', '2010-02-14'),
('Anita Patel', 'anita@example.com', '9876543212', '1992-12-05', NULL);
