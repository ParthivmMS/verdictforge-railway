import Link from 'next/link';

export default function Home() {
  return (
    <main className="min-h-screen flex flex-col items-center justify-center px-6 py-12 bg-white dark:bg-zinc-900 text-zinc-900 dark:text-white">
      <div className="text-center max-w-xl">
        <h1 className="text-4xl font-extrabold mb-4">⚖️ VerdictForge</h1>
        <p className="text-lg mb-6">
          Instantly summarize Indian court judgments using AI. Get both legal and plain English summaries with just one click.
        </p>
        <Link href="/summarizer">
          <a className="inline-block bg-blue-600 hover:bg-blue-700 text-white font-medium py-3 px-6 rounded-xl transition">
            Get Started
          </a>
        </Link>
      </div>
    </main>
  );
}
