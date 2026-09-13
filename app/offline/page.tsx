'use client';

import Link from 'next/link';

export default function OfflinePage() {
  return (
    <div className="min-h-screen bg-slate-950 text-white flex flex-col items-center justify-center p-6 text-center">
      <div className="w-20 h-20 rounded-2xl bg-indigo-600/20 border border-indigo-500/30 flex items-center justify-center mb-6 shadow-xl shadow-indigo-500/10">
        <svg className="w-10 h-10 text-indigo-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M18.364 5.636a9 9 0 010 12.728m-12.728 0a9 9 0 010-12.728m2.828 2.828a5 5 0 017.072 0m-7.072 7.072a5 5 0 010-7.072M13 12a1 1 0 11-2 0 1 1 0 012 0z" />
          <line x1="2" y1="2" x2="22" y2="22" stroke="currentColor" strokeWidth={2} strokeLinecap="round" />
        </svg>
      </div>

      <h1 className="text-3xl font-extrabold mb-3 bg-clip-text text-transparent bg-gradient-to-r from-indigo-200 via-sky-200 to-white">
        You are offline
      </h1>
      
      <p className="text-slate-400 max-w-md mb-8 text-sm leading-relaxed">
        It looks like you don't have an active internet connection right now. Some previously visited books and pages may still be accessible.
      </p>

      <div className="flex flex-col sm:flex-row gap-4">
        <button
          onClick={() => typeof window !== 'undefined' && window.location.reload()}
          className="px-6 py-3 rounded-xl bg-indigo-600 hover:bg-indigo-500 font-semibold text-white transition shadow-lg shadow-indigo-600/30 text-sm flex items-center justify-center gap-2"
        >
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
          </svg>
          Try Reloading
        </button>

        <Link
          href="/"
          className="px-6 py-3 rounded-xl bg-slate-800 hover:bg-slate-700 border border-slate-700 font-semibold text-slate-200 transition text-sm flex items-center justify-center"
        >
          Go to Home
        </Link>
      </div>
    </div>
  );
}
