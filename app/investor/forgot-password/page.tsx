"use client";

import { useState, FormEvent } from "react";
import Link from "next/link";
import { BrandGlyph } from "../../components/brand-glyph";

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      const res = await fetch("/api/investor/forgot-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });

      const result = await res.json();

      if (!res.ok) {
        setError(result.error || "Something went wrong");
        setLoading(false);
        return;
      }

      setSubmitted(true);
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
          {submitted ? (
            <div className="text-center">
              <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-emerald-500/20">
                <svg className="h-6 w-6 text-emerald-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <h1 className="text-xl font-bold text-white mb-2">Check Your Email</h1>
              <p className="text-sm text-slate-400 mb-6">
                If an account exists for <strong className="text-slate-200">{email}</strong>, you will receive a password reset link shortly.
              </p>
              <Link
                href="/investor/login"
                className="inline-flex items-center justify-center text-sm text-amber-400 hover:text-amber-300"
              >
                Back to Sign In
              </Link>
            </div>
          ) : (
            <>
              <h1 className="text-xl font-bold text-white mb-2">Forgot Password</h1>
              <p className="text-sm text-slate-400 mb-6">
                Enter your email and we will send you a link to reset your password.
              </p>

              {error && (
                <div className="mb-4 rounded-lg border border-rose-500/40 bg-rose-500/10 px-4 py-3 text-sm text-rose-200">
                  {error}
                </div>
              )}

              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-1.5">Email</label>
                  <input
                    name="email"
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full rounded-xl border border-slate-600 bg-slate-800/60 px-4 py-2.5 text-white placeholder:text-slate-500 focus:border-amber-400/80 focus:ring-2 focus:ring-amber-400/40 outline-none"
                    placeholder="john@example.com"
                  />
                </div>
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full rounded-full bg-emerald-500 py-3 text-sm font-semibold text-white transition hover:bg-emerald-400 disabled:opacity-50"
                >
                  {loading ? "Sending..." : "Send Reset Link"}
                </button>
              </form>

              <p className="mt-6 text-center text-sm text-slate-400">
                Remember your password?{" "}
                <Link href="/investor/login" className="text-amber-400 hover:text-amber-300">
                  Sign In
                </Link>
              </p>
            </>
          )}
        </div>
      </div>
    </div>
  );
}

