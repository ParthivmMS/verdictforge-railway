"use client";
import { useEffect, useState } from 'react';

type Summary = {
  legal: string;
  plain: string;
  raw?: string;
};

export default function Result() {
  const [summary, setSummary] = useState<Summary | null>(null);

  useEffect(() => {
    const stored = localStorage.getItem('verdict_summary');
    if (stored) setSummary(JSON.parse(stored));
  }, []);

  if (!summary) {
    return (
      <main className="min-h-screen flex items-center justify-center">
        <p>No summary found. Please go back and generate one.</p>
      </main>
    );
  }

  return (
    <main className="min-h-screen px-6 py-10">
      <div className="max-w-3xl mx-auto">
        <h1 className="text-3xl font-bold mb-6">🧾 Summary</h1>
        <div className="mb-8">
          <h2 className="text-xl font-semibold mb-2">📘 Legal Summary</h2>
          <p className="whitespace-pre-line bg-gray-100 p-4 rounded">{summary.legal}</p>
        </div>
        <div className="mb-8">
          <h2 className="text-xl font-semibold mb-2">💬 Plain English Summary</h2>
          <p className="whitespace-pre-line bg-gray-100 p-4 rounded">{summary.plain}</p>
        </div>
        {summary.raw && (
          <div className="mb-8">
            <h2 className="text-sm text-red-500 font-semibold mb-2">🧪 Raw AI Output</h2>
            <pre className="bg-yellow-100 p-4 rounded text-sm">{summary.raw}</pre>
          </div>
        )}
      </div>
    </main>
  );
}
