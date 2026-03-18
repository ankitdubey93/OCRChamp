import { useState, useCallback, DragEvent, ChangeEvent, useRef } from 'react';
import { Upload, FileText, Loader2 } from 'lucide-react';

interface InvoiceUploaderProps {
  onUpload: (file: File) => void;
  isLoading: boolean;
}

const ACCEPTED_TYPES = ['application/pdf', 'image/jpeg', 'image/png', 'image/webp'];
const ACCEPTED_EXTENSIONS = '.pdf, .jpg, .jpeg, .png, .webp';

export default function InvoiceUploader({ onUpload, isLoading }: InvoiceUploaderProps) {
  const [isDragging, setIsDragging] = useState(false);
  const [fileError, setFileError] = useState<string | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const validate = useCallback((file: File): string | null => {
    if (!ACCEPTED_TYPES.includes(file.type)) {
      return `Unsupported file type "${file.type}". Please upload a PDF, JPG, PNG, or WEBP.`;
    }
    if (file.size > 10 * 1024 * 1024) {
      return 'File exceeds the 10 MB limit.';
    }
    return null;
  }, []);

  const handleFile = useCallback((file: File) => {
    const error = validate(file);
    if (error) {
      setFileError(error);
      return;
    }
    setFileError(null);
    onUpload(file);
  }, [validate, onUpload]);

  const onDragOver = useCallback((e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(true);
  }, []);

  const onDragLeave = useCallback((e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(false);
  }, []);

  const onDrop = useCallback((e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files[0];
    if (file) handleFile(file);
  }, [handleFile]);

  const onChange = useCallback((e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) handleFile(file);
    // Reset so the same file can be re-uploaded after an error
    e.target.value = '';
  }, [handleFile]);

  const disabled = isLoading;

  return (
    <div className="w-full">
      <div
        onDragOver={disabled ? undefined : onDragOver}
        onDragLeave={disabled ? undefined : onDragLeave}
        onDrop={disabled ? undefined : onDrop}
        onClick={() => { if (!disabled) inputRef.current?.click(); }}
        className={[
          'relative flex flex-col items-center justify-center gap-4',
          'rounded-2xl border-2 border-dashed p-12 text-center',
          'transition-colors duration-200 select-none',
          disabled
            ? 'cursor-not-allowed border-gray-200 bg-gray-50'
            : isDragging
              ? 'cursor-copy border-blue-500 bg-blue-50'
              : 'cursor-pointer border-gray-300 bg-white hover:border-blue-400 hover:bg-blue-50/40',
        ].join(' ')}
      >
        <input
          ref={inputRef}
          type="file"
          accept={ACCEPTED_EXTENSIONS}
          className="hidden"
          onChange={onChange}
          disabled={disabled}
        />

        {isLoading ? (
          <>
            <Loader2 className="h-12 w-12 animate-spin text-blue-500" />
            <p className="text-sm font-medium text-blue-600">
              Extracting and parsing invoice…
            </p>
          </>
        ) : (
          <>
            <div className={[
              'flex h-16 w-16 items-center justify-center rounded-full',
              isDragging ? 'bg-blue-100' : 'bg-gray-100',
            ].join(' ')}>
              {isDragging
                ? <FileText className="h-8 w-8 text-blue-500" />
                : <Upload className="h-8 w-8 text-gray-400" />}
            </div>

            <div>
              <p className="text-base font-semibold text-gray-800">
                {isDragging ? 'Drop to upload' : 'Drag & drop your invoice here'}
              </p>
              <p className="mt-1 text-sm text-gray-500">
                or{' '}
                <span className="font-medium text-blue-600 hover:underline">
                  click to browse
                </span>
              </p>
            </div>

            <p className="text-xs text-gray-400">
              PDF, JPG, PNG, WEBP — max 10 MB
            </p>
          </>
        )}
      </div>

      {fileError && (
        <p className="mt-3 rounded-lg bg-red-50 px-4 py-2 text-sm text-red-600">
          {fileError}
        </p>
      )}
    </div>
  );
}
