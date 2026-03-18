import { InvoiceRow } from '../types/invoice';

interface InvoiceSummaryProps {
  invoice: InvoiceRow;
  onReset: () => void;
}

function formatAmount(raw: string | null): string {
  if (raw === null) return '—';
  const num = parseFloat(raw);
  if (isNaN(num)) return '—';
  return num.toLocaleString('en-US', { style: 'currency', currency: 'USD' });
}

function Field({ label, value }: { label: string; value: string | null }) {
  return (
    <div className="flex flex-col gap-1">
      <span className="text-xs font-semibold uppercase tracking-wider text-gray-400">
        {label}
      </span>
      <span className="text-sm font-medium text-gray-800">
        {value ?? <span className="italic text-gray-400">Not found</span>}
      </span>
    </div>
  );
}

export default function InvoiceSummary({ invoice, onReset }: InvoiceSummaryProps) {
  const subtotal   = parseFloat(invoice.total_amount ?? '0');
  const tax        = parseFloat(invoice.tax_amount   ?? '0');
  const hasAmounts = !isNaN(subtotal) && !isNaN(tax);

  return (
    <div className="w-full overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm">

      {/* Header */}
      <div className="flex items-center justify-between border-b border-gray-100 bg-gray-50 px-6 py-4">
        <div>
          <p className="text-xs font-semibold uppercase tracking-wider text-green-600">
            Extraction complete
          </p>
          <h2 className="mt-0.5 text-lg font-bold text-gray-900">
            {invoice.vendor_name ?? 'Unknown Vendor'}
          </h2>
        </div>
        <span className="rounded-full bg-green-100 px-3 py-1 text-xs font-semibold text-green-700">
          {invoice.status}
        </span>
      </div>

      {/* Core fields */}
      <div className="grid grid-cols-2 gap-6 px-6 py-6 sm:grid-cols-3">
        <Field label="Invoice #"   value={invoice.invoice_number} />
        <Field label="Date"        value={invoice.date} />
        <Field label="Record ID"   value={invoice.id.slice(0, 8) + '…'} />
      </div>

      {/* Amounts */}
      {hasAmounts && (
        <div className="border-t border-gray-100 px-6 py-5">
          <div className="rounded-xl bg-gray-50 p-5">
            <div className="space-y-3">
              <div className="flex justify-between text-sm text-gray-600">
                <span>Tax</span>
                <span className="font-medium">{formatAmount(invoice.tax_amount)}</span>
              </div>
              <div className="flex justify-between border-t border-gray-200 pt-3 text-base font-bold text-gray-900">
                <span>Total Due</span>
                <span className="text-blue-700">{formatAmount(invoice.total_amount)}</span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Saved at */}
      <div className="border-t border-gray-100 px-6 py-3 text-right">
        <span className="text-xs text-gray-400">
          Saved {new Date(invoice.created_at).toLocaleString()}
        </span>
      </div>

      {/* Actions */}
      <div className="border-t border-gray-100 px-6 py-4">
        <button
          onClick={onReset}
          className="w-full rounded-xl border border-gray-300 bg-white py-2.5 text-sm font-semibold text-gray-700 transition hover:bg-gray-50 hover:border-gray-400"
        >
          Upload another invoice
        </button>
      </div>
    </div>
  );
}
