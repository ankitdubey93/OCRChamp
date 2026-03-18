import { z } from 'zod';
import { ApiError } from '../utils/apiError';

// ── Zod schema ────────────────────────────────────────────────────────────────

export const InvoiceDataSchema = z.object({
  invoiceNumber: z.string().nullable(),
  date:          z.string().nullable(),
  vendorName:    z.string().nullable(),
  totalAmount:   z.number().nullable(),
  taxAmount:     z.number().nullable(),
});

export type InvoiceData = z.infer<typeof InvoiceDataSchema>;

// ── Helpers ───────────────────────────────────────────────────────────────────

/**
 * Strip currency symbols, commas, and surrounding whitespace then parse as a
 * float. Returns null if the result is NaN.
 */
function parseCurrency(raw: string): number | null {
  const cleaned = raw.replace(/[^0-9.]/g, '');
  const value = parseFloat(cleaned);
  return isNaN(value) ? null : value;
}

/**
 * Return the first non-empty capture group from a regex match, trimmed,
 * or null if the pattern didn't match or the group was empty.
 */
function firstGroup(match: RegExpMatchArray | null): string | null {
  if (match === null) return null;
  const group = match[1];
  if (group === undefined || group.trim() === '') return null;
  return group.trim();
}

// ── Regex patterns ────────────────────────────────────────────────────────────

// Invoice number: "Invoice #: INV-12345", "Invoice No: BPXINV-00550", "INV-0042"
// Requires the captured value to contain at least one digit, preventing
// plain words like "INVOICE" (the header) from matching.
const INVOICE_NUMBER_RE =
  /(?:invoice\s*(?:#|no\.?|number)[:\s#]+|inv[-\s])([A-Z0-9][-A-Z0-9]*[0-9][-A-Z0-9]*)/i;

// Date: ISO (2023-10-25), European (25.10.2023), US (10/25/2023), written (25 Oct 2023)
const DATE_RE =
  /(?:date|dated|invoice\s+date)[:\s]*([0-9]{1,4}[-./][0-9]{1,2}[-./][0-9]{2,4}|[0-9]{1,2}\s+\w+\s+[0-9]{4})/i;

// Total: "Total Due $6,610.95", "TOTAL DUE 6610.95", "Amount Due: €500"
// Anchored to prefer "total due" / "amount due" over bare "total" to avoid
// matching subtotal lines. Supports both comma-separated thousands and plain
// unformatted numbers of any length.
const TOTAL_RE =
  /(?:total\s+due|amount\s+due|grand\s+total|total\s+amount)[:\s]*([£$€¥]?\s*[0-9]+(?:,[0-9]{3})*(?:\.[0-9]{1,2})?)/i;

// Tax: "Sales Tax 596.45", "VAT: $50.00", "Tax Amount: 100"
const TAX_RE =
  /(?:sales\s+tax|vat|tax\s+amount|tax)[:\s]*([£$€¥]?\s*[0-9]+(?:,[0-9]{3})*(?:\.[0-9]{1,2})?)/i;

// ── Vendor name heuristic ─────────────────────────────────────────────────────

/**
 * The vendor name is rarely labelled — it typically appears on the first
 * non-empty line of an invoice before any field keywords appear.
 * We take the first non-empty line that doesn't look like a known keyword.
 */
const KEYWORD_RE = /^(invoice|bill|receipt|date|to:|from:|phone|email|address)/i;

function extractVendorName(lines: string[]): string | null {
  for (const line of lines) {
    const trimmed = line.trim();
    if (trimmed === '') continue;
    if (KEYWORD_RE.test(trimmed)) continue;
    // Skip lines that are purely numeric or very short (page numbers, etc.)
    if (/^[0-9\s.,$€£]+$/.test(trimmed)) continue;
    if (trimmed.length < 3) continue;
    return trimmed;
  }
  return null;
}

// ── Public API ────────────────────────────────────────────────────────────────

/**
 * Parse raw OCR text into structured, validated invoice data.
 *
 * @throws {ApiError} 422 if rawText is empty or completely unparseable
 */
export async function parseInvoiceText(rawText: string): Promise<InvoiceData> {
  if (rawText.trim() === '') {
    throw new ApiError(422, 'Cannot parse invoice: raw text is empty');
  }

  const lines = rawText.split(/\r?\n/);

  // ── Extract fields ──────────────────────────────────────────────────────────

  const invoiceNumber = firstGroup(rawText.match(INVOICE_NUMBER_RE));
  const date          = firstGroup(rawText.match(DATE_RE));
  const vendorName    = extractVendorName(lines);

  // For amounts, match all occurrences and take the last — on multi-page
  // invoices the final "Total Due" line supersedes any sub-totals.
  const totalMatches = [...rawText.matchAll(new RegExp(TOTAL_RE.source, 'gi'))];
  const lastTotal    = totalMatches.at(-1)?.[1] ?? null;
  const totalAmount  = lastTotal !== null ? parseCurrency(lastTotal) : null;

  const taxRawMatch = firstGroup(rawText.match(TAX_RE));
  const taxAmount   = taxRawMatch !== null ? parseCurrency(taxRawMatch) : null;

  // ── Guard: at least one meaningful field must have been found ───────────────

  const allNull =
    invoiceNumber === null &&
    date          === null &&
    vendorName    === null &&
    totalAmount   === null &&
    taxAmount     === null;

  if (allNull) {
    throw new ApiError(422, 'Cannot parse invoice: no recognisable fields found in text');
  }

  // ── Validate through Zod ────────────────────────────────────────────────────

  return InvoiceDataSchema.parse({
    invoiceNumber,
    date,
    vendorName,
    totalAmount,
    taxAmount,
  });
}
