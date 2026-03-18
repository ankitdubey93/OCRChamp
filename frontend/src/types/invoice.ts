/**
 * Matches the row returned by the backend's invoices table.
 * total_amount and tax_amount are strings because pg returns NUMERIC columns
 * as strings to preserve full decimal precision. Use parseFloat() at render time.
 */
export interface InvoiceRow {
  id:             string;
  invoice_number: string | null;
  date:           string | null;
  vendor_name:    string | null;
  total_amount:   string | null;
  tax_amount:     string | null;
  raw_text:       string | null;
  status:         string;
  created_at:     string;
}
