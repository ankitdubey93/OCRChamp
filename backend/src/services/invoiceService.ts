// TODO: Implement OCR extraction and DB persistence
// This service is the only layer that interacts with `pool` and the OCR engine.

import { Invoice } from '../types/invoice';

export async function createInvoice(_fileBuffer: Buffer, _mimeType: string): Promise<Invoice> {
  // 1. Call OCR engine with fileBuffer
  // 2. Parse extracted text into Invoice fields
  // 3. Persist to database via pool
  // 4. Return saved Invoice
  throw new Error('Not implemented');
}

export async function getInvoiceById(_id: string): Promise<Invoice | null> {
  // TODO: query DB by id
  throw new Error('Not implemented');
}

export async function getAllInvoices(): Promise<Invoice[]> {
  // TODO: query DB for all invoices
  throw new Error('Not implemented');
}
