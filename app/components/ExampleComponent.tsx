'use client';

import { useState } from 'react';

interface ExampleComponentProps {
  title?: string;
}

export function ExampleComponent({ title = 'Example Component' }: ExampleComponentProps) {
  const [count, setCount] = useState(0);

  return (
    <div className="p-6 border border-gray-200 rounded-lg shadow-sm">
      <h2 className="text-2xl font-bold mb-4">{title}</h2>
      <div className="space-y-4">
        <p className="text-gray-600">Count: {count}</p>
        <button
          onClick={() => setCount(count + 1)}
          className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors"
        >
          Increment
        </button>
      </div>
    </div>
  );
}
