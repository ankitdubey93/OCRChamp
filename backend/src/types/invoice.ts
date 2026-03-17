export interface LineItem {
  description: string;
  quantity: number;
  unitPrice: number;
  total: number;
}

export interface Invoice {
  id: string;
  vendorName: string | null;
  invoiceNumber: string | null;
  invoiceDate: string | null;
  dueDate: string | null;
  totalAmount: number | null;
  lineItems: LineItem[];
  rawText: string | null;
  status: 'pending' | 'processed' | 'failed';
  createdAt: string;
}

export interface ExtractionResult {
  invoice: Invoice;
  confidence: number;
}
