import { Invoice } from '../types/invoice';

const BASE = '/api/invoices';

export async function uploadInvoice(file: File): Promise<Invoice> {
  const form = new FormData();
  form.append('file', file);

  const res = await fetch(BASE, { method: 'POST', body: form });
  if (!res.ok) throw new Error(await res.text());
  return res.json() as Promise<Invoice>;
}

export async function fetchInvoice(id: string): Promise<Invoice> {
  const res = await fetch(`${BASE}/${id}`);
  if (!res.ok) throw new Error(await res.text());
  return res.json() as Promise<Invoice>;
}

export async function fetchAllInvoices(): Promise<Invoice[]> {
  const res = await fetch(BASE);
  if (!res.ok) throw new Error(await res.text());
  return res.json() as Promise<Invoice[]>;
}
