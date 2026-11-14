import mysql from 'mysql2/promise';
import 'dotenv/config';

const required = ['DB_HOST', 'DB_NAME', 'DB_USER', 'DB_PASSWORD'];
const missing = required.filter((key) => !process.env[key]);

if (missing.length) {
  throw new Error(`Missing database environment variables: ${missing.join(', ')}`);
}

export const pool = mysql.createPool({
  host: process.env.DB_HOST,
  port: Number(process.env.DB_PORT || 3306),
  database: process.env.DB_NAME,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  waitForConnections: true,
  connectionLimit: Number(process.env.DB_CONNECTION_LIMIT || 5),
  queueLimit: 0,
  ssl: process.env.DB_SSL === 'true' ? {} : undefined,
  charset: 'utf8mb4'
});

export async function checkDatabase() {
  const connection = await pool.getConnection();
  try {
    await connection.query('SELECT 1 AS ok');
    return true;
  } finally {
    connection.release();
  }
}

export async function initializeDatabase() {
  await pool.query(`
    CREATE TABLE IF NOT EXISTS admin_users (
      id CHAR(36) PRIMARY KEY,
      email VARCHAR(255) NOT NULL UNIQUE,
      full_name VARCHAR(180) NULL,
      password_hash VARCHAR(255) NOT NULL,
      role VARCHAR(50) NOT NULL DEFAULT 'Administrator',
      status VARCHAR(30) NOT NULL DEFAULT 'active',
      created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
      updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
  `);

  const [adminUserColumns] = await pool.query(
    `SELECT COLUMN_NAME FROM information_schema.COLUMNS WHERE TABLE_SCHEMA = DATABASE() AND TABLE_NAME = 'admin_users' AND COLUMN_NAME IN ('full_name', 'status')`
  );
  const existingAdminColumns = new Set(adminUserColumns.map((row) => row.COLUMN_NAME));
  if (!existingAdminColumns.has('full_name')) {
    await pool.query('ALTER TABLE admin_users ADD COLUMN full_name VARCHAR(180) NULL AFTER email');
  }
  if (!existingAdminColumns.has('status')) {
    await pool.query("ALTER TABLE admin_users ADD COLUMN status VARCHAR(30) NOT NULL DEFAULT 'active' AFTER role");
  }

  await pool.query(`
    CREATE TABLE IF NOT EXISTS password_reset_tokens (
      id CHAR(36) PRIMARY KEY,
      user_id CHAR(36) NOT NULL,
      token_hash CHAR(64) NOT NULL UNIQUE,
      expires_at DATETIME NOT NULL,
      used_at DATETIME NULL,
      created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
      CONSTRAINT fk_reset_user FOREIGN KEY (user_id) REFERENCES admin_users(id) ON DELETE CASCADE,
      INDEX idx_reset_user (user_id), INDEX idx_reset_expiry (expires_at)
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
  `);

  await pool.query(`
    CREATE TABLE IF NOT EXISTS inquiries (
      id CHAR(36) PRIMARY KEY,
      full_name VARCHAR(180) NOT NULL,
      email VARCHAR(255) NOT NULL,
      phone VARCHAR(30) NULL,
      company VARCHAR(255) NULL,
      service VARCHAR(120) NOT NULL,
      budget VARCHAR(120) NULL,
      custom_budget DECIMAL(15, 2) NULL,
      currency CHAR(3) NULL,
      description TEXT NOT NULL,
      status VARCHAR(40) NOT NULL DEFAULT 'new',
      internal_notes TEXT NULL,
      created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
      updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
      INDEX idx_inquiries_status (status),
      INDEX idx_inquiries_created_at (created_at),
      INDEX idx_inquiries_email (email)
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
  `);

  const [phoneColumns] = await pool.query(
    `SELECT COUNT(*) AS count FROM information_schema.COLUMNS WHERE TABLE_SCHEMA = DATABASE() AND TABLE_NAME = 'inquiries' AND COLUMN_NAME = 'phone'`
  );
  if (!Number(phoneColumns[0]?.count)) {
    await pool.query('ALTER TABLE inquiries ADD COLUMN phone VARCHAR(30) NULL AFTER email');
  }

  await pool.query(`
    CREATE TABLE IF NOT EXISTS site_content (
      content_key VARCHAR(100) PRIMARY KEY,
      content_json LONGTEXT NOT NULL,
      updated_by CHAR(36) NULL,
      updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
  `);

  await pool.query(`
    CREATE TABLE IF NOT EXISTS clients (
      id CHAR(36) PRIMARY KEY,
      user_id CHAR(36) NULL,
      company_name VARCHAR(255) NOT NULL,
      contact_name VARCHAR(180) NOT NULL,
      email VARCHAR(255) NOT NULL,
      phone VARCHAR(30) NULL,
      country VARCHAR(100) NULL,
      status VARCHAR(40) NOT NULL DEFAULT 'active',
      created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
      updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
      CONSTRAINT fk_clients_user FOREIGN KEY (user_id) REFERENCES admin_users(id) ON DELETE SET NULL,
      INDEX idx_clients_email (email)
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
  `);

  await pool.query(`
    CREATE TABLE IF NOT EXISTS client_profiles (
      client_id CHAR(36) PRIMARY KEY,
      website VARCHAR(255) NULL,
      address VARCHAR(500) NULL,
      city VARCHAR(120) NULL,
      postal_code VARCHAR(30) NULL,
      timezone VARCHAR(80) NULL,
      preferred_language CHAR(2) NOT NULL DEFAULT 'en',
      avatar_url VARCHAR(500) NULL,
      created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
      updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
      CONSTRAINT fk_client_profiles_client FOREIGN KEY (client_id) REFERENCES clients(id) ON DELETE CASCADE
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
  `);

  await pool.query(`
    CREATE TABLE IF NOT EXISTS proposals (
      id CHAR(36) PRIMARY KEY,
      client_id CHAR(36) NOT NULL,
      title VARCHAR(255) NOT NULL,
      scope TEXT NOT NULL,
      terms TEXT NULL,
      currency CHAR(3) NOT NULL DEFAULT 'EUR',
      total_amount DECIMAL(15,2) NOT NULL DEFAULT 0,
      status VARCHAR(40) NOT NULL DEFAULT 'draft',
      expires_at DATE NULL,
      sent_at DATETIME NULL,
      accepted_at DATETIME NULL,
      created_by CHAR(36) NULL,
      created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
      updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
      CONSTRAINT fk_proposals_client FOREIGN KEY (client_id) REFERENCES clients(id) ON DELETE CASCADE,
      INDEX idx_proposals_client (client_id), INDEX idx_proposals_status (status)
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
  `);

  await pool.query(`
    CREATE TABLE IF NOT EXISTS proposal_items (
      id CHAR(36) PRIMARY KEY,
      proposal_id CHAR(36) NOT NULL,
      title VARCHAR(255) NOT NULL,
      description TEXT NULL,
      amount DECIMAL(15,2) NOT NULL DEFAULT 0,
      due_days INT NULL,
      sort_order INT NOT NULL DEFAULT 0,
      CONSTRAINT fk_proposal_items_proposal FOREIGN KEY (proposal_id) REFERENCES proposals(id) ON DELETE CASCADE
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
  `);

  await pool.query(`
    CREATE TABLE IF NOT EXISTS projects (
      id CHAR(36) PRIMARY KEY,
      client_id CHAR(36) NOT NULL,
      proposal_id CHAR(36) NULL,
      name VARCHAR(255) NOT NULL,
      description TEXT NULL,
      status VARCHAR(40) NOT NULL DEFAULT 'draft',
      start_date DATE NULL,
      due_date DATE NULL,
      progress TINYINT UNSIGNED NOT NULL DEFAULT 0,
      created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
      updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
      CONSTRAINT fk_projects_client FOREIGN KEY (client_id) REFERENCES clients(id) ON DELETE CASCADE,
      CONSTRAINT fk_projects_proposal FOREIGN KEY (proposal_id) REFERENCES proposals(id) ON DELETE SET NULL,
      INDEX idx_projects_client (client_id), INDEX idx_projects_status (status)
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
  `);

  await pool.query(`
    CREATE TABLE IF NOT EXISTS maintenance_contracts (
      id CHAR(36) PRIMARY KEY,
      client_id CHAR(36) NOT NULL,
      project_id CHAR(36) NULL,
      title VARCHAR(255) NOT NULL,
      description TEXT NULL,
      billing_type VARCHAR(30) NOT NULL DEFAULT 'monthly',
      amount DECIMAL(15,2) NOT NULL DEFAULT 0,
      currency CHAR(3) NOT NULL DEFAULT 'EUR',
      status VARCHAR(30) NOT NULL DEFAULT 'active',
      started_at DATE NULL,
      next_billing_date DATE NULL,
      renewal_date DATE NULL,
      created_by CHAR(36) NULL,
      created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
      updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
      CONSTRAINT fk_maintenance_client FOREIGN KEY (client_id) REFERENCES clients(id) ON DELETE CASCADE,
      CONSTRAINT fk_maintenance_project FOREIGN KEY (project_id) REFERENCES projects(id) ON DELETE SET NULL,
      INDEX idx_maintenance_client (client_id), INDEX idx_maintenance_status (status)
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
  `);

  await pool.query(`
    CREATE TABLE IF NOT EXISTS maintenance_invoices (
      id CHAR(36) PRIMARY KEY,
      contract_id CHAR(36) NOT NULL,
      client_id CHAR(36) NOT NULL,
      invoice_number VARCHAR(50) NOT NULL UNIQUE,
      period_start DATE NULL,
      period_end DATE NULL,
      amount DECIMAL(15,2) NOT NULL,
      currency CHAR(3) NOT NULL DEFAULT 'EUR',
      status VARCHAR(30) NOT NULL DEFAULT 'pending',
      due_date DATE NULL,
      paid_at DATETIME NULL,
      created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
      CONSTRAINT fk_maintenance_invoice_contract FOREIGN KEY (contract_id) REFERENCES maintenance_contracts(id) ON DELETE CASCADE,
      CONSTRAINT fk_maintenance_invoice_client FOREIGN KEY (client_id) REFERENCES clients(id) ON DELETE CASCADE,
      INDEX idx_maintenance_invoice_client (client_id), INDEX idx_maintenance_invoice_status (status)
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
  `);
  const [maintenancePaymentColumns] = await pool.query(`SELECT COLUMN_NAME FROM information_schema.COLUMNS WHERE TABLE_SCHEMA = DATABASE() AND TABLE_NAME = 'maintenance_invoices' AND COLUMN_NAME IN ('provider','provider_reference')`);
  const existingMaintenanceColumns = new Set(maintenancePaymentColumns.map((row) => row.COLUMN_NAME));
  if (!existingMaintenanceColumns.has('provider')) await pool.query("ALTER TABLE maintenance_invoices ADD COLUMN provider VARCHAR(30) NULL");
  if (!existingMaintenanceColumns.has('provider_reference')) await pool.query("ALTER TABLE maintenance_invoices ADD COLUMN provider_reference VARCHAR(255) NULL UNIQUE");

  await pool.query(`
    CREATE TABLE IF NOT EXISTS project_milestones (
      id CHAR(36) PRIMARY KEY,
      project_id CHAR(36) NOT NULL,
      title VARCHAR(255) NOT NULL,
      description TEXT NULL,
      amount DECIMAL(15,2) NOT NULL DEFAULT 0,
      currency CHAR(3) NOT NULL DEFAULT 'EUR',
      due_date DATE NULL,
      status VARCHAR(40) NOT NULL DEFAULT 'payment_pending',
      payment_provider VARCHAR(40) NULL,
      payment_reference VARCHAR(255) NULL,
      paid_at DATETIME NULL,
      sort_order INT NOT NULL DEFAULT 0,
      created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
      updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
      CONSTRAINT fk_milestones_project FOREIGN KEY (project_id) REFERENCES projects(id) ON DELETE CASCADE,
      INDEX idx_milestones_project (project_id), INDEX idx_milestones_status (status)
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
  `);

  await pool.query(`
    CREATE TABLE IF NOT EXISTS project_updates (
      id CHAR(36) PRIMARY KEY,
      project_id CHAR(36) NOT NULL,
      title VARCHAR(255) NOT NULL,
      body TEXT NOT NULL,
      progress TINYINT UNSIGNED NULL,
      visible_to_client BOOLEAN NOT NULL DEFAULT TRUE,
      created_by CHAR(36) NULL,
      created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
      CONSTRAINT fk_updates_project FOREIGN KEY (project_id) REFERENCES projects(id) ON DELETE CASCADE,
      INDEX idx_updates_project (project_id)
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
  `);

  await pool.query(`
    CREATE TABLE IF NOT EXISTS payments (
      id CHAR(36) PRIMARY KEY,
      project_id CHAR(36) NOT NULL,
      milestone_id CHAR(36) NOT NULL,
      provider VARCHAR(40) NOT NULL,
      provider_reference VARCHAR(255) NULL UNIQUE,
      amount DECIMAL(15,2) NOT NULL,
      currency CHAR(3) NOT NULL,
      status VARCHAR(40) NOT NULL DEFAULT 'pending',
      paid_at DATETIME NULL,
      created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
      CONSTRAINT fk_payments_project FOREIGN KEY (project_id) REFERENCES projects(id) ON DELETE CASCADE,
      CONSTRAINT fk_payments_milestone FOREIGN KEY (milestone_id) REFERENCES project_milestones(id) ON DELETE CASCADE,
      INDEX idx_payments_project (project_id), INDEX idx_payments_status (status)
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
  `);

  await pool.query(`
    CREATE TABLE IF NOT EXISTS project_files (
      id CHAR(36) PRIMARY KEY,
      project_id CHAR(36) NOT NULL,
      original_name VARCHAR(255) NOT NULL,
      stored_name VARCHAR(255) NOT NULL,
      mime_type VARCHAR(120) NOT NULL,
      file_size BIGINT UNSIGNED NOT NULL,
      visible_to_client BOOLEAN NOT NULL DEFAULT FALSE,
      uploaded_by CHAR(36) NULL,
      created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
      CONSTRAINT fk_files_project FOREIGN KEY (project_id) REFERENCES projects(id) ON DELETE CASCADE,
      INDEX idx_files_project (project_id)
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
  `);

  await pool.query(`
    CREATE TABLE IF NOT EXISTS invoices (
      id CHAR(36) PRIMARY KEY,
      project_id CHAR(36) NOT NULL,
      client_id CHAR(36) NOT NULL,
      invoice_number VARCHAR(40) NOT NULL UNIQUE,
      description TEXT NOT NULL,
      amount DECIMAL(15,2) NOT NULL,
      currency CHAR(3) NOT NULL DEFAULT 'EUR',
      status VARCHAR(30) NOT NULL DEFAULT 'draft',
      due_date DATE NULL,
      paid_at DATETIME NULL,
      created_by CHAR(36) NULL,
      created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
      updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
      CONSTRAINT fk_invoices_project FOREIGN KEY (project_id) REFERENCES projects(id) ON DELETE CASCADE,
      CONSTRAINT fk_invoices_client FOREIGN KEY (client_id) REFERENCES clients(id) ON DELETE CASCADE,
      INDEX idx_invoices_project (project_id), INDEX idx_invoices_client (client_id)
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
  `);
}
