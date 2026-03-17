import { Request, Response, NextFunction } from 'express';
import { ApiError } from '../utils/apiError';
import * as invoiceService from '../services/invoiceService';

export async function uploadInvoice(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    if (!req.file) {
      throw new ApiError(400, 'No file uploaded');
    }
    const invoice = await invoiceService.createInvoice(req.file.buffer, req.file.mimetype);
    res.status(201).json(invoice);
  } catch (err) {
    next(err);
  }
}

export async function getInvoice(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const invoice = await invoiceService.getInvoiceById(req.params['id'] ?? '');
    if (!invoice) throw new ApiError(404, 'Invoice not found');
    res.json(invoice);
  } catch (err) {
    next(err);
  }
}

export async function listInvoices(_req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const invoices = await invoiceService.getAllInvoices();
    res.json(invoices);
  } catch (err) {
    next(err);
  }
}
