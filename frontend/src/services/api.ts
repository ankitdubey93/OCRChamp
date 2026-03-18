import { InvoiceRow } from '../types/invoice';

const BASE = '/api/invoices';

/**
 * POST a file to the upload endpoint and return the saved database row.
 * All requests go through the Vite dev proxy — no absolute URLs needed.
 */
export async function uploadInvoice(file: File): Promise<InvoiceRow> {
  const form = new FormData();
  form.append('file', file);

  const res = await fetch(`${BASE}/upload`, { method: 'POST', body: form });

  if (!res.ok) {
    // Try to surface the server's error message if it sent JSON
    const contentType = res.headers.get('content-type') ?? '';
    if (contentType.includes('application/json')) {
      const body = await res.json() as { error?: string };
      throw new Error(body.error ?? `Upload failed (${res.status})`);
    }
    throw new Error(`Upload failed (${res.status})`);
  }

  return res.json() as Promise<InvoiceRow>;
}

export async function fetchInvoice(id: string): Promise<InvoiceRow> {
  const res = await fetch(`${BASE}/${id}`);
  if (!res.ok) throw new Error(`Not found (${res.status})`);
  return res.json() as Promise<InvoiceRow>;
}

export async function fetchAllInvoices(): Promise<InvoiceRow[]> {
  const res = await fetch(BASE);
  if (!res.ok) throw new Error(`Failed to fetch invoices (${res.status})`);
  return res.json() as Promise<InvoiceRow[]>;
}
