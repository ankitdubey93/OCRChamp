/**
 * Standalone OCR smoke test.
 *
 * Usage (from repo root):
 *   docker compose exec backend npx ts-node --files -r dotenv/config scripts/testOcr.ts [path/to/file]
 *
 * If no file path is provided, the script generates a minimal in-memory PDF
 * and runs it through pdf-parse so you can verify the pipeline without needing
 * a real invoice on hand.
 */

import fs from 'fs';
import path from 'path';
import { extractTextFromFile, OcrProcessingError } from '../src/services/ocrService';

// Use a known-valid PDF that ships with pdf-parse's own test fixtures.
function makeDummyPdfBuffer(): Buffer {
  const fixture = path.resolve(
    __dirname,
    '../node_modules/pdf-parse/test/data/01-valid.pdf',
  );
  return fs.readFileSync(fixture);
}

async function main(): Promise<void> {
  const filePath: string | undefined = process.argv[2];

  let fileBuffer: Buffer;
  let mimeType: string;

  if (filePath) {
    const resolved = path.resolve(filePath);
    console.log(`Reading file: ${resolved}`);
    fileBuffer = fs.readFileSync(resolved);
    const ext = path.extname(resolved).toLowerCase();
    const mimeMap: Record<string, string> = {
      '.pdf': 'application/pdf',
      '.jpg': 'image/jpeg',
      '.jpeg': 'image/jpeg',
      '.png': 'image/png',
      '.webp': 'image/webp',
    };
    mimeType = mimeMap[ext] ?? 'application/octet-stream';
  } else {
    console.log('No file path provided — using built-in dummy PDF.');
    fileBuffer = makeDummyPdfBuffer();
    mimeType = 'application/pdf';
  }

  console.log(`MIME type: ${mimeType}`);
  console.log('Running OCR extraction...\n');

  try {
    const text = await extractTextFromFile(fileBuffer, mimeType);
    console.log('── Extracted text ──────────────────────────────');
    console.log(text || '(empty — no text found in document)');
    console.log('────────────────────────────────────────────────');
    console.log('\nOCR extraction successful.');
  } catch (err) {
    if (err instanceof OcrProcessingError) {
      console.error(`OcrProcessingError: ${err.message}`);
    } else {
      console.error('Unexpected error:', err);
    }
    process.exit(1);
  }
}

main();
