CREATE TABLE IF NOT EXISTS invoices (
  id             UUID             PRIMARY KEY DEFAULT gen_random_uuid(),
  invoice_number VARCHAR(100),
  date           VARCHAR(50),
  vendor_name    VARCHAR(255),
  total_amount   NUMERIC(12, 2),
  tax_amount     NUMERIC(12, 2),
  raw_text       TEXT,
  status         VARCHAR(20)      NOT NULL DEFAULT 'processed',
  created_at     TIMESTAMPTZ      NOT NULL DEFAULT NOW()
);
