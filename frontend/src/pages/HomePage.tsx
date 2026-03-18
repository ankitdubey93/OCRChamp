import { useState } from 'react';
import { FileSearch } from 'lucide-react';
import InvoiceUploader from '../components/InvoiceUploader';
import InvoiceSummary from '../components/InvoiceSummary';
import { uploadInvoice } from '../services/api';
import { InvoiceRow } from '../types/invoice';

type PageState =
  | { phase: 'idle' }
  | { phase: 'loading' }
  | { phase: 'result'; invoice: InvoiceRow }
  | { phase: 'error'; message: string };

export default function HomePage() {
  const [state, setState] = useState<PageState>({ phase: 'idle' });

  async function handleUpload(file: File): Promise<void> {
    setState({ phase: 'loading' });
    try {
      const invoice = await uploadInvoice(file);
      setState({ phase: 'result', invoice });
    } catch (err) {
      setState({
        phase: 'error',
        message: err instanceof Error ? err.message : 'An unexpected error occurred.',
      });
    }
  }

  function reset(): void {
    setState({ phase: 'idle' });
  }

  return (
    <div className="mx-auto max-w-2xl px-4 py-12">

      {/* Page heading */}
      <div className="mb-8 flex items-center gap-3">
        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-600">
          <FileSearch className="h-5 w-5 text-white" />
        </div>
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Invoice Extractor</h1>
          <p className="text-sm text-gray-500">
            Upload a PDF or image — we'll extract and save the key fields.
          </p>
        </div>
      </div>

      {/* Error banner */}
      {state.phase === 'error' && (
        <div className="mb-6 flex items-start gap-3 rounded-xl border border-red-200 bg-red-50 px-5 py-4">
          <div className="mt-0.5 flex-shrink-0 text-red-500">
            <svg className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.28 7.22a.75.75 0 00-1.06 1.06L8.94 10l-1.72 1.72a.75.75 0 101.06 1.06L10 11.06l1.72 1.72a.75.75 0 101.06-1.06L11.06 10l1.72-1.72a.75.75 0 00-1.06-1.06L10 8.94 8.28 7.22z" clipRule="evenodd" />
            </svg>
          </div>
          <div className="flex-1">
            <p className="text-sm font-semibold text-red-800">Extraction failed</p>
            <p className="mt-0.5 text-sm text-red-700">{state.message}</p>
          </div>
          <button
            onClick={reset}
            className="flex-shrink-0 text-xs font-medium text-red-600 hover:text-red-800 hover:underline"
          >
            Try again
          </button>
        </div>
      )}

      {/* Main content */}
      {state.phase === 'result' ? (
        <InvoiceSummary invoice={state.invoice} onReset={reset} />
      ) : (
        <InvoiceUploader
          onUpload={handleUpload}
          isLoading={state.phase === 'loading'}
        />
      )}
    </div>
  );
}
