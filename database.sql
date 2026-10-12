CREATE DATABASE IF NOT EXISTS `react_demo_sql`;

USE `react_demo_sql`;

CREATE TABLE IF NOT EXISTS users (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    email VARCHAR(150) NOT NULL UNIQUE,
    password_hash VARCHAR(255) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS employees (
    id INT AUTO_INCREMENT PRIMARY KEY,
    employee_id VARCHAR(30) NOT NULL UNIQUE,
    name VARCHAR(100) NOT NULL,
    email VARCHAR(150) NOT NULL,
    phone VARCHAR(20) NOT NULL,
    department VARCHAR(50) NOT NULL,
    designation VARCHAR(100) NOT NULL,
    city VARCHAR(100) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

INSERT IGNORE INTO employees
(employee_id, name, email, phone, department, designation, city)
VALUES
('EMP001', 'Arun Kumar', 'arun.kumar@example.com', '9876543210', 'CSE', 'Software Developer', 'Chennai'),
('EMP002', 'Priya Sharma', 'priya.sharma@example.com', '9876543211', 'HR', 'HR Executive', 'Bangalore'),
('EMP003', 'Karthik S', 'karthik.s@example.com', '9876543212', 'IT', 'Backend Developer', 'Chennai'),
('EMP004', 'Divya R', 'divya.r@example.com', '9876543213', 'Finance', 'Accountant', 'Coimbatore'),
('EMP005', 'Rahul Kumar', 'rahul.kumar@example.com', '9876543214', 'Marketing', 'Marketing Executive', 'Madurai'),
('EMP006', 'Nithya P', 'nithya.p@example.com', '9876543215', 'IT', 'Frontend Developer', 'Chennai'),
('EMP007', 'Vijay Anand', 'vijay.anand@example.com', '9876543216', 'CSE', 'Software Developer', 'Pune'),
('EMP008', 'Meena S', 'meena.s@example.com', '9876543217', 'HR', 'HR Executive', 'Chennai'),
('EMP009', 'Sanjay M', 'sanjay.m@example.com', '9876543218', 'Finance', 'Accountant', 'Bangalore'),
('EMP010', 'Anjali K', 'anjali.k@example.com', '9876543219', 'IT', 'Backend Developer', 'Hyderabad');



USE react_demo_sql;

CREATE TABLE IF NOT EXISTS password_reset_codes (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NOT NULL,
    otp_hash CHAR(64) NOT NULL,
    expires_at DATETIME NOT NULL,
    attempts TINYINT UNSIGNED NOT NULL DEFAULT 0,
    used_at DATETIME NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

    INDEX idx_reset_user (
        user_id,
        used_at,
        created_at
    ),

    CONSTRAINT fk_reset_user
        FOREIGN KEY (user_id)
        REFERENCES users(id)
        ON DELETE CASCADE
);