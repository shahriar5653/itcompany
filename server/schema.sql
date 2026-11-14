-- The API creates these tables automatically on startup.
-- This file is provided for manual database review or hosted migrations.

CREATE TABLE IF NOT EXISTS admin_users (
  id CHAR(36) PRIMARY KEY,
  email VARCHAR(255) NOT NULL UNIQUE,
  password_hash VARCHAR(255) NOT NULL,
  role VARCHAR(50) NOT NULL DEFAULT 'Administrator',
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS inquiries (
  id CHAR(36) PRIMARY KEY,
  full_name VARCHAR(180) NOT NULL,
  email VARCHAR(255) NOT NULL,
  phone VARCHAR(30),
  company VARCHAR(255),
  service VARCHAR(120) NOT NULL,
  budget VARCHAR(120),
  custom_budget DECIMAL(15, 2),
  currency CHAR(3),
  description TEXT NOT NULL,
  status VARCHAR(40) NOT NULL DEFAULT 'new',
  internal_notes TEXT,
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS site_content (
  content_key VARCHAR(100) PRIMARY KEY,
  content_json LONGTEXT NOT NULL,
  updated_by CHAR(36),
  updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Client portal, proposals, projects, milestones, updates and payments are
-- created automatically by server/db.js during application startup.
