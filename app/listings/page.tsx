"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { BrandGlyph } from "../components/brand-glyph";
import { ListingsGridSkeleton } from "../components/skeleton";

type Listing = {
  id: string;
  createdAt: string;
  propertyAddress: string;
  timeline: string;
  condition: string;
  reason: string;
  isExclusivelyLocked: boolean;
};

function maskAddress(address: string): string {
  // Show neighborhood/area but hide exact street number
  // e.g., "1234 Main St, Dallas, TX" -> "Main St area, Dallas, TX"
  const parts = address.split(",");
  if (parts.length >= 2) {
    const street = parts[0].trim();
    const streetWords = street.split(" ");
    // Remove the first word if it looks like a number
    if (/^\d+$/.test(streetWords[0])) {
      streetWords.shift();
    }
    return `${streetWords.join(" ")} area, ${parts.slice(1).join(",")}`;
  }
  return address.replace(/^\d+\s*/, "") + " area";
}

function getTimelineLabel(timeline: string): string {
  const labels: Record<string, string> = {
    asap: "ASAP",
    "1-2weeks": "1-2 weeks",
    "30days": "30 days",
    "flexible": "Flexible",
  };
  return labels[timeline] || timeline;
}

function getConditionLabel(condition: string): string {
  const labels: Record<string, string> = {
    "move-in": "Move-in ready",
    "minor-repairs": "Minor repairs needed",
    "major-repairs": "Major repairs needed",
    "teardown": "Tear-down / land value",
  };
  return labels[condition] || condition;
}

function getReasonLabel(reason: string): string {
  const labels: Record<string, string> = {
    "inherited": "Inherited property",
    "divorce": "Divorce",
    "relocation": "Relocating",
    "foreclosure": "Facing foreclosure",
    "financial": "Financial hardship",
    "downsizing": "Downsizing",
    "other": "Other",
  };
  return labels[reason] || reason;
}

export default function ListingsPage() {
  const router = useRouter();
  const [listings, setListings] = useState<Listing[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [investorName, setInvestorName] = useState<string | null>(null);

  useEffect(() => {
    // Check auth status
    fetch("/api/investor/me")
      .then((res) => res.ok ? res.json() : null)
      .then((data) => {
        if (data?.investor) {
          setIsLoggedIn(true);
          setInvestorName(data.investor.name);
        }
      })
      .catch(() => {});

    // Load listings
    fetch("/api/listings")
      .then((res) => res.json())
      .then((data) => {
        setListings(data.listings || []);
        setLoading(false);
      })
      .catch(() => {
        setError("Failed to load listings");
        setLoading(false);
      });
  }, []);

  async function handleLogout() {
    await fetch("/api/investor/logout", { method: "POST" });
    setIsLoggedIn(false);
    setInvestorName(null);
    router.refresh();
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
              <div className="text-[11px] text-slate-400">Motivated Seller Marketplace</div>
            </div>
          </Link>
          <div className="flex items-center gap-4">
            {isLoggedIn ? (
              <>
                <Link href="/investor/dashboard" className="text-sm text-slate-300 hover:text-amber-400">
                  {investorName ? `Hi, ${investorName.split(" ")[0]}` : "Dashboard"}
                </Link>
                <button
                  type="button"
                  onClick={handleLogout}
                  className="text-sm text-slate-400 hover:text-white"
                >
                  Sign Out
                </button>
              </>
            ) : (
              <>
                <Link href="/investor/login" className="text-sm text-slate-300 hover:text-amber-400">
                  Sign In
                </Link>
                <Link
                  href="/investor/signup"
                  className="rounded-full bg-emerald-500 px-4 py-2 text-sm font-semibold text-white hover:bg-emerald-400"
                >
                  Create Account
                </Link>
              </>
            )}
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-6xl px-6 py-12">
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-white md:text-3xl">Browse Motivated Seller Listings</h1>
          <p className="mt-2 text-slate-400">
            View property details for free. Pay $1,000 to unlock seller contact info with 48-hour exclusive access.
          </p>
        </div>

        {loading && (
          <ListingsGridSkeleton count={6} />
        )}

        {error && (
          <div className="rounded-xl border border-rose-500/40 bg-rose-500/10 p-6 text-center text-rose-200">
            {error}
          </div>
        )}

        {!loading && !error && listings.length === 0 && (
          <div className="rounded-xl border border-slate-700 bg-slate-900/50 p-12 text-center">
            <p className="text-lg text-slate-300">No listings available yet.</p>
            <p className="mt-2 text-sm text-slate-500">Check back soon or join our investor waitlist.</p>
          </div>
        )}

        {!loading && !error && listings.length > 0 && (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {listings.map((listing) => (
              <div
                key={listing.id}
                className="group relative rounded-2xl border border-slate-700/60 bg-slate-900/80 p-6 transition hover:border-amber-400/40"
              >
                {listing.isExclusivelyLocked && (
                  <div className="absolute right-4 top-4 rounded-full bg-rose-500/20 px-3 py-1 text-xs font-medium text-rose-300">
                    Exclusively Locked
                  </div>
                )}
                
                <div className="mb-4">
                  <p className="text-lg font-semibold text-white">{maskAddress(listing.propertyAddress)}</p>
                  <p className="mt-1 text-xs text-slate-500">
                    Listed {new Date(listing.createdAt).toLocaleDateString()}
                  </p>
                </div>

                <div className="space-y-3 text-sm">
                  <div className="flex items-center justify-between">
                    <span className="text-slate-400">Timeline</span>
                    <span className="font-medium text-amber-400">{getTimelineLabel(listing.timeline)}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-slate-400">Condition</span>
                    <span className="text-slate-200">{getConditionLabel(listing.condition)}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-slate-400">Motivation</span>
                    <span className="text-slate-200">{getReasonLabel(listing.reason)}</span>
                  </div>
                </div>

                <div className="mt-6 border-t border-slate-700/60 pt-4">
                  {listing.isExclusivelyLocked ? (
                    <p className="text-center text-sm text-slate-500">
                      Currently under exclusive review
                    </p>
                  ) : (
                    <Link
                      href={`/listings/${listing.id}`}
                      className="block w-full rounded-full bg-emerald-500 py-2.5 text-center text-sm font-semibold text-white transition hover:bg-emerald-400"
                    >
                      Unlock for $1,000
                    </Link>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}

