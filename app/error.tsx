"use client";

import { useEffect } from "react";
import Link from "next/link";
import { BrandGlyph } from "./components/brand-glyph";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    // Log the error to an error reporting service
    console.error("Application error:", error);
  }, [error]);

  return (
    <div className="page-shell min-h-screen flex items-center justify-center px-6">
      <div className="blueprint-pattern" aria-hidden="true" />
      
      <div className="text-center">
        <div className="mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-2xl bg-rose-500/10 ring-1 ring-rose-500/40">
          <BrandGlyph className="h-10 w-10 text-rose-400" />
        </div>
        
        <h1 className="text-3xl font-bold text-white mb-2">Something went wrong</h1>
        <p className="text-slate-400 mb-8 max-w-md mx-auto">
          We encountered an unexpected error. Our team has been notified.
        </p>
        
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
          <button
            onClick={() => reset()}
            className="inline-flex items-center justify-center rounded-full bg-emerald-500 px-6 py-3 text-sm font-semibold text-white transition hover:bg-emerald-400"
          >
            Try Again
          </button>
          <Link
            href="/"
            className="inline-flex items-center justify-center rounded-full border border-slate-600 px-6 py-3 text-sm font-semibold text-slate-200 transition hover:border-amber-400 hover:text-amber-400"
          >
            Go Home
          </Link>
        </div>
      </div>
    </div>
  );
}

