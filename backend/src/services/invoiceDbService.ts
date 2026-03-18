import pool from '../db/pool';
import { InvoiceData } from './invoiceParser';

export interface InvoiceRow {
  id:             string;
  invoice_number: string | null;
  date:           string | null;
  vendor_name:    string | null;
  total_amount:   string | null; // pg returns NUMERIC as string to preserve precision
  tax_amount:     string | null;
  raw_text:       string | null;
  status:         string;
  created_at:     string;
}

/**
 * Persist parsed invoice data and raw OCR text to the database.
 * Uses parameterized queries throughout — no string interpolation.
 */
export async function insertInvoice(
  invoiceData: InvoiceData,
  rawText: string,
): Promise<InvoiceRow> {
  const { rows } = await pool.query<InvoiceRow>(
    `INSERT INTO invoices
       (invoice_number, date, vendor_name, total_amount, tax_amount, raw_text)
     VALUES ($1, $2, $3, $4, $5, $6)
     RETURNING *`,
    [
      invoiceData.invoiceNumber,
      invoiceData.date,
      invoiceData.vendorName,
      invoiceData.totalAmount,
      invoiceData.taxAmount,
      rawText,
    ],
  );

  const row = rows[0];
  if (row === undefined) {
    throw new Error('INSERT returned no rows');
  }
  return row;
}

export async function findInvoiceById(id: string): Promise<InvoiceRow | null> {
  const { rows } = await pool.query<InvoiceRow>(
    'SELECT * FROM invoices WHERE id = $1',
    [id],
  );
  return rows[0] ?? null;
}

export async function findAllInvoices(): Promise<InvoiceRow[]> {
  const { rows } = await pool.query<InvoiceRow>(
    'SELECT * FROM invoices ORDER BY created_at DESC',
  );
  return rows;
}
