import pdfParse from 'pdf-parse';
import Tesseract from 'tesseract.js';

// ── Custom error ──────────────────────────────────────────────────────────────

export class OcrProcessingError extends Error {
  constructor(
    public readonly mimeType: string,
    cause: unknown,
  ) {
    super(
      `OCR failed for mime type "${mimeType}": ${cause instanceof Error ? cause.message : String(cause)}`,
    );
    this.name = 'OcrProcessingError';
    if (cause instanceof Error && cause.stack) {
      this.stack = cause.stack;
    }
  }
}

// ── Supported MIME types ──────────────────────────────────────────────────────

const PDF_MIME = 'application/pdf';
const IMAGE_MIMES = new Set(['image/jpeg', 'image/png', 'image/webp']);

// ── Extraction helpers ────────────────────────────────────────────────────────

async function extractFromPdf(buffer: Buffer): Promise<string> {
  const result = await pdfParse(buffer);
  return result.text.trim();
}

async function extractFromImage(buffer: Buffer): Promise<string> {
  const { data } = await Tesseract.recognize(buffer, 'eng', {
    // Suppress verbose Tesseract progress logs in production
    logger: () => undefined,
  });
  return data.text.trim();
}

// ── Public API ────────────────────────────────────────────────────────────────

/**
 * Extracts raw text from a file buffer.
 *
 * @param fileBuffer - The raw file bytes (from multer memoryStorage)
 * @param mimeType   - The MIME type reported by the upload middleware
 * @returns A single concatenated string of all extracted text
 * @throws {OcrProcessingError} If the library fails or the MIME type is unsupported
 */
export async function extractTextFromFile(
  fileBuffer: Buffer,
  mimeType: string,
): Promise<string> {
  try {
    if (mimeType === PDF_MIME) {
      return await extractFromPdf(fileBuffer);
    }

    if (IMAGE_MIMES.has(mimeType)) {
      return await extractFromImage(fileBuffer);
    }

    throw new OcrProcessingError(mimeType, new Error('Unsupported file type'));
  } catch (err) {
    // Re-wrap any unexpected library error in our typed error
    if (err instanceof OcrProcessingError) throw err;
    throw new OcrProcessingError(mimeType, err);
  }
}
