--Set up the database locally: (phpmyadmin)
--open phpmyadmin, import, choose file: setup.sql, click go

CREATE DATABASE IF NOT EXISTS archival_db;
USE archival_db;

CREATE TABLE IF NOT EXISTS users (
  id           INT AUTO_INCREMENT PRIMARY KEY,
  full_name    VARCHAR(255) NOT NULL,
  email        VARCHAR(255) NOT NULL UNIQUE,
  password     VARCHAR(255) NOT NULL,
  college      VARCHAR(255),
  department   VARCHAR(255),
  year         VARCHAR(50),
  bloc         VARCHAR(50),
  role         ENUM('student', 'admin') DEFAULT 'student',
  created_at   TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
CREATE TABLE IF NOT EXISTS documents (
  id            INT AUTO_INCREMENT PRIMARY KEY,
  title         VARCHAR(500) NOT NULL,
  category      ENUM('Thesis','Capstone','Research Paper','Feasibility Study') NOT NULL,
  college       VARCHAR(255),
  department    VARCHAR(255),
  file_name     VARCHAR(255),
  file_path     VARCHAR(500),
  file_size     VARCHAR(50),
  status        ENUM('Pending','Approved','Rejected') DEFAULT 'Pending',
  uploaded_by   INT NOT NULL,
  uploader_name VARCHAR(255),
  uploader_role ENUM('student','admin') DEFAULT 'student',
  created_at    TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (uploaded_by) REFERENCES users(id) ON DELETE CASCADE
);
-- make admin account
--run in terminal to get pass: node -e "const b = require('bcryptjs'); b.hash('admin123', 10).then(h => console.log(h))"
INSERT INTO users (full_name, email, password, role)
VALUES (
  'Admin User',
  'admin@example.com',
  'insert hash password here',
  'admin'
);
