import { useParams } from 'react-router-dom';

export default function ResultPage() {
  const { id } = useParams<{ id: string }>();

  return (
    <div>
      <h2 className="text-2xl font-bold">Invoice Result</h2>
      <p className="mt-2 text-gray-500">ID: {id}</p>
      {/* TODO: Render extracted invoice fields */}
    </div>
  );
}
