/**
 * Standalone parser smoke test.
 *
 * Run from the backend/ directory:
 *   ../node_modules/.bin/ts-node --project tsconfig.json --files scripts/testParser.ts
 */

import { parseInvoiceText } from '../src/services/invoiceParser';

const DUMMY_OCR_TEXT = `
ACME Corp
123 Business Street, Springfield

Invoice #: INV-12345
Date: 2023-10-25

TO:
Jane Smith
456 Client Ave

QUANTITY   DESCRIPTION          UNIT PRICE   TOTAL
5          Widget A             50.00        250.00
10         Gadget B             100.00       1000.00

SUBTOTAL                                     1250.00
Sales Tax                                    125.00
TOTAL DUE                                    $1,375.00
`;

async function main(): Promise<void> {
  console.log('── Input text ──────────────────────────────────');
  console.log(DUMMY_OCR_TEXT);
  console.log('── Parsed result ───────────────────────────────');

  try {
    const result = await parseInvoiceText(DUMMY_OCR_TEXT);
    console.log(JSON.stringify(result, null, 2));
    console.log('\nParser ran successfully.');
  } catch (err) {
    console.error('Parse failed:', err instanceof Error ? err.message : err);
    process.exit(1);
  }
}

main();
