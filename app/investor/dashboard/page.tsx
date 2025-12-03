"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { BrandGlyph } from "../../components/brand-glyph";

type UnlockedListing = {
  id: string;
  propertyAddress: string;
  name: string;
  contact: string;
  timeline: string;
  condition: string;
  reason: string;
  unlockedAt: string;
  exclusiveUntil: string;
};

function getTimelineLabel(timeline: string): string {
  const labels: Record<string, string> = {
    asap: "ASAP",
    "1-2weeks": "1-2 weeks",
    "30days": "30 days",
    flexible: "Flexible",
  };
  return labels[timeline] || timeline;
}

export default function InvestorDashboardPage() {
  const router = useRouter();
  const [listings, setListings] = useState<UnlockedListing[]>([]);
  const [loading, setLoading] = useState(true);
  const [investor, setInvestor] = useState<{ name: string; email: string } | null>(null);

  useEffect(() => {
    fetch("/api/investor/dashboard")
      .then((res) => {
        if (res.status === 401) {
          router.push("/investor/login?redirect=/investor/dashboard");
          return null;
        }
        return res.json();
      })
      .then((data) => {
        if (data) {
          setListings(data.unlockedListings || []);
          setInvestor(data.investor);
        }
        setLoading(false);
      })
      .catch(() => {
        setLoading(false);
      });
  }, [router]);

  async function handleLogout() {
    await fetch("/api/investor/logout", { method: "POST" });
    router.push("/");
  }

  if (loading) {
    return (
      <div className="page-shell min-h-screen flex items-center justify-center">
        <div className="blueprint-pattern" aria-hidden="true" />
        <div className="h-8 w-8 animate-spin rounded-full border-2 border-amber-400 border-t-transparent" />
      </div>
    );
  }

  return (
    <div className="page-shell min-h-screen">
      <div className="blueprint-pattern" aria-hidden="true" />
      
      <header className="border-b border-slate-800/60 bg-slate-950/80 backdrop-blur sticky top-0 z-50">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4">
          <Link href="/" className="flex items-center gap-2">
            <span className="inline-flex h-9 w-9 items-center justify-center rounded-xl bg-amber-400/10 text-amber-400 ring-1 ring-amber-400/40">
              <BrandGlyph className="h-5 w-5" />
            </span>
            <div className="leading-tight">
              <div className="text-sm font-semibold tracking-tight text-white">FireSaleHomes</div>
              <div className="text-[11px] text-slate-400">Investor Dashboard</div>
            </div>
          </Link>
          <div className="flex items-center gap-4">
            <Link href="/listings" className="text-sm text-slate-300 hover:text-amber-400">
              Browse Listings
            </Link>
            <button
              type="button"
              onClick={handleLogout}
              className="text-sm text-slate-400 hover:text-white"
            >
              Sign Out
            </button>
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-6xl px-6 py-12">
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-white">
            Welcome back{investor?.name ? `, ${investor.name}` : ""}
          </h1>
          <p className="mt-1 text-slate-400">Your unlocked motivated seller leads</p>
        </div>

        {listings.length === 0 ? (
          <div className="rounded-2xl border border-slate-700/60 bg-slate-900/90 p-12 text-center">
            <p className="text-slate-400 mb-4">You have not unlocked any listings yet.</p>
            <Link
              href="/listings"
              className="inline-flex items-center justify-center rounded-full bg-emerald-500 px-6 py-2.5 text-sm font-semibold text-white transition hover:bg-emerald-400"
            >
              Browse Available Listings
            </Link>
          </div>
        ) : (
          <div className="grid gap-4">
            {listings.map((listing) => {
              const isExclusive = new Date(listing.exclusiveUntil) > new Date();
              return (
                <div
                  key={listing.id}
                  className="rounded-2xl border border-slate-700/60 bg-slate-900/90 p-6"
                >
                  <div className="flex flex-wrap items-start justify-between gap-4">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <h2 className="text-lg font-semibold text-white">{listing.propertyAddress}</h2>
                        {isExclusive && (
                          <span className="rounded-full bg-emerald-500/20 px-2 py-0.5 text-xs font-medium text-emerald-300">
                            Exclusive
                          </span>
                        )}
                      </div>
                      <div className="flex flex-wrap gap-4 text-sm text-slate-400 mb-4">
                        <span>Timeline: {getTimelineLabel(listing.timeline)}</span>
                        <span>•</span>
                        <span>Unlocked {new Date(listing.unlockedAt).toLocaleDateString()}</span>
                      </div>
                    </div>
                  </div>
                  
                  <div className="rounded-xl bg-slate-800/60 p-4 mt-2">
                    <p className="text-xs text-slate-500 mb-2">Seller Contact Info</p>
                    <div className="grid gap-2 sm:grid-cols-2">
                      <div>
                        <p className="text-xs text-slate-500">Name</p>
                        <p className="font-medium text-white">{listing.name}</p>
                      </div>
                      <div>
                        <p className="text-xs text-slate-500">Contact</p>
                        <p className="font-medium text-white">{listing.contact}</p>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </main>
    </div>
  );
}

