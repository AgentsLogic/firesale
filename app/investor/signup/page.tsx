"use client";

import { useState, FormEvent } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { BrandGlyph } from "../../components/brand-glyph";

export default function InvestorSignupPage() {
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError(null);
    setLoading(true);

    const formData = new FormData(e.currentTarget);
    const data = {
      email: formData.get("email"),
      password: formData.get("password"),
      name: formData.get("name"),
      company: formData.get("company") || undefined,
      phone: formData.get("phone") || undefined,
    };

    try {
      const res = await fetch("/api/investor/signup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      const result = await res.json();

      if (!res.ok) {
        setError(result.error || "Signup failed");
        setLoading(false);
        return;
      }

      router.push("/listings");
    } catch {
      setError("Something went wrong. Please try again.");
      setLoading(false);
    }
  }

  return (
    <div className="page-shell min-h-screen flex items-center justify-center px-6 py-12">
      <div className="blueprint-pattern" aria-hidden="true" />
      
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <Link href="/" className="inline-flex items-center gap-2">
            <span className="inline-flex h-10 w-10 items-center justify-center rounded-xl bg-amber-400/10 text-amber-400 ring-1 ring-amber-400/40">
              <BrandGlyph className="h-6 w-6" />
            </span>
            <span className="text-xl font-semibold text-white">FireSaleHomes</span>
          </Link>
        </div>

        <div className="rounded-2xl border border-slate-700/60 bg-slate-900/90 p-8">
          <h1 className="text-xl font-bold text-white mb-2">Create Investor Account</h1>
          <p className="text-sm text-slate-400 mb-6">
            Browse motivated seller listings for free. Pay only when you connect.
          </p>

          {error && (
            <div className="mb-4 rounded-lg border border-rose-500/40 bg-rose-500/10 px-4 py-3 text-sm text-rose-200">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-1.5">Full Name *</label>
              <input
                name="name"
                type="text"
                required
                className="w-full rounded-xl border border-slate-600 bg-slate-800/60 px-4 py-2.5 text-white placeholder:text-slate-500 focus:border-amber-400/80 focus:ring-2 focus:ring-amber-400/40 outline-none"
                placeholder="John Smith"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-1.5">Email *</label>
              <input
                name="email"
                type="email"
                required
                className="w-full rounded-xl border border-slate-600 bg-slate-800/60 px-4 py-2.5 text-white placeholder:text-slate-500 focus:border-amber-400/80 focus:ring-2 focus:ring-amber-400/40 outline-none"
                placeholder="john@example.com"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-1.5">Password *</label>
              <input
                name="password"
                type="password"
                required
                minLength={8}
                className="w-full rounded-xl border border-slate-600 bg-slate-800/60 px-4 py-2.5 text-white placeholder:text-slate-500 focus:border-amber-400/80 focus:ring-2 focus:ring-amber-400/40 outline-none"
                placeholder="Min 8 characters"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-1.5">Company (optional)</label>
              <input
                name="company"
                type="text"
                className="w-full rounded-xl border border-slate-600 bg-slate-800/60 px-4 py-2.5 text-white placeholder:text-slate-500 focus:border-amber-400/80 focus:ring-2 focus:ring-amber-400/40 outline-none"
                placeholder="ABC Investments"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-1.5">Phone (optional)</label>
              <input
                name="phone"
                type="tel"
                className="w-full rounded-xl border border-slate-600 bg-slate-800/60 px-4 py-2.5 text-white placeholder:text-slate-500 focus:border-amber-400/80 focus:ring-2 focus:ring-amber-400/40 outline-none"
                placeholder="(555) 123-4567"
              />
            </div>
            <button
              type="submit"
              disabled={loading}
              className="w-full rounded-full bg-emerald-500 py-3 text-sm font-semibold text-white transition hover:bg-emerald-400 disabled:opacity-50"
            >
              {loading ? "Creating Account..." : "Create Account"}
            </button>
          </form>

          <p className="mt-6 text-center text-sm text-slate-400">
            Already have an account?{" "}
            <Link href="/investor/login" className="text-amber-400 hover:text-amber-300">
              Sign in
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}

