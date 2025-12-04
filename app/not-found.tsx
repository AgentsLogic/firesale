import Link from "next/link";
import { BrandGlyph } from "./components/brand-glyph";

export default function NotFound() {
  return (
    <div className="page-shell min-h-screen flex items-center justify-center px-6">
      <div className="blueprint-pattern" aria-hidden="true" />
      
      <div className="text-center">
        <div className="mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-2xl bg-amber-400/10 ring-1 ring-amber-400/40">
          <BrandGlyph className="h-10 w-10 text-amber-400" />
        </div>
        
        <h1 className="text-6xl font-bold text-white mb-2">404</h1>
        <h2 className="text-xl font-semibold text-slate-300 mb-4">Page Not Found</h2>
        <p className="text-slate-400 mb-8 max-w-md mx-auto">
          The page you are looking for does not exist or has been moved.
        </p>
        
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
          <Link
            href="/"
            className="inline-flex items-center justify-center rounded-full bg-emerald-500 px-6 py-3 text-sm font-semibold text-white transition hover:bg-emerald-400"
          >
            Go Home
          </Link>
          <Link
            href="/listings"
            className="inline-flex items-center justify-center rounded-full border border-slate-600 px-6 py-3 text-sm font-semibold text-slate-200 transition hover:border-amber-400 hover:text-amber-400"
          >
            Browse Listings
          </Link>
        </div>
      </div>
    </div>
  );
}

