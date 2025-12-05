-- Create database if not exists
CREATE DATABASE IF NOT EXISTS salesduo;
USE salesduo;

-- Create table for storing product optimizations
CREATE TABLE IF NOT EXISTS product_optimizations (
    id INT AUTO_INCREMENT PRIMARY KEY,
    asin VARCHAR(20) NOT NULL,
    original_title TEXT,
    original_bullet_points JSON,
    original_description TEXT,
    optimized_title TEXT,
    optimized_bullet_points JSON,
    optimized_description TEXT,
    suggested_keywords JSON,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    INDEX idx_asin (asin),
    INDEX idx_created_at (created_at)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
