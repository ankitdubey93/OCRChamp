import { Request, Response, NextFunction } from 'express';
import { ApiError } from '../utils/apiError';
import { extractTextFromFile } from '../services/ocrService';
import { parseInvoiceText } from '../services/invoiceParser';
import { insertInvoice, findInvoiceById, findAllInvoices } from '../services/invoiceDbService';

export async function uploadInvoice(
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> {
  try {
    if (!req.file) {
      throw new ApiError(400, 'No file uploaded');
    }

    // 1. Extract raw text from the uploaded buffer
    const rawText = await extractTextFromFile(req.file.buffer, req.file.mimetype);

    // 2. Parse raw text into structured fields
    const invoiceData = await parseInvoiceText(rawText);

    // 3. Persist to database and return the saved row
    const saved = await insertInvoice(invoiceData, rawText);

    res.status(201).json(saved);
  } catch (err) {
    next(err);
  }
}

export async function getInvoice(
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> {
  try {
    const { id } = req.params;
    if (typeof id !== 'string' || id === '') {
      throw new ApiError(400, 'Invalid invoice id');
    }

    const invoice = await findInvoiceById(id);
    if (!invoice) throw new ApiError(404, 'Invoice not found');

    res.json(invoice);
  } catch (err) {
    next(err);
  }
}

export async function listInvoices(
  _req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> {
  try {
    const invoices = await findAllInvoices();
    res.json(invoices);
  } catch (err) {
    next(err);
  }
}
