"use client";
import { useState } from 'react';
import { useRouter } from 'next/router';

export default function Summarizer() {
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleSubmit = async () => {
    if (!input.trim()) return alert("Please enter a judgment text.");
    setLoading(true);

    try {
      const res = await fetch('https://verdictforge-railway-production-b9f4.up.railway.app/summarize', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({ text: input }),
});

      const data = await res.json();

      if (data.legal && data.plain) {
        localStorage.setItem('verdict_summary', JSON.stringify({
          legal: data.legal,
          plain: data.plain,
          raw: data.raw || '',
        }));
        router.push('/result');
      } else {
        alert("Summary not generated. Please try again.");
      }
    } catch (err) {
      alert("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen px-6 py-10">
      <div className="max-w-2xl mx-auto">
        <h1 className="text-3xl font-bold mb-4">Paste Legal Judgment</h1>
        <textarea
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Paste the full judgment text here..."
          className="w-full h-64 p-4 border rounded"
        />
        <button
          onClick={handleSubmit}
          disabled={loading}
          className="mt-4 w-full py-3 bg-blue-600 text-white rounded hover:bg-blue-700"
        >
          {loading ? "Summarizing..." : "Generate Summary"}
        </button>
      </div>
    </main>
  );
}
