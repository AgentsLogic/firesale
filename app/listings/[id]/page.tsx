"use client";

import { useState, useEffect, use } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { BrandGlyph } from "../../components/brand-glyph";

type ListingDetail = {
  id: string;
  createdAt: string;
  propertyAddress: string;
  timeline: string;
  condition: string;
  reason: string;
  // Only present if unlocked
  name?: string;
  contact?: string;
  isUnlocked: boolean;
  isExclusivelyLocked: boolean;
  exclusiveUntil?: string;
};

function getTimelineLabel(timeline: string): string {
  const labels: Record<string, string> = {
    asap: "ASAP - Need to sell immediately",
    "1-2weeks": "1-2 weeks",
    "30days": "Within 30 days",
    flexible: "Flexible timeline",
  };
  return labels[timeline] || timeline;
}

function getConditionLabel(condition: string): string {
  const labels: Record<string, string> = {
    "move-in": "Move-in ready",
    "minor-repairs": "Minor repairs needed",
    "major-repairs": "Major repairs needed",
    teardown: "Tear-down / land value only",
  };
  return labels[condition] || condition;
}

function getReasonLabel(reason: string): string {
  const labels: Record<string, string> = {
    inherited: "Inherited property",
    divorce: "Divorce / separation",
    relocation: "Job relocation",
    foreclosure: "Facing foreclosure",
    financial: "Financial hardship",
    downsizing: "Downsizing",
    other: "Other situation",
  };
  return labels[reason] || reason;
}

export default function ListingDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const router = useRouter();
  const searchParams = useSearchParams();
  const [listing, setListing] = useState<ListingDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [checkoutLoading, setCheckoutLoading] = useState(false);

  const success = searchParams.get("success");
  const canceled = searchParams.get("canceled");

  useEffect(() => {
    fetch(`/api/listings/${id}`)
      .then((res) => res.json())
      .then((data) => {
        if (data.error) {
          setError(data.error);
        } else {
          setListing(data.listing);
        }
        setLoading(false);
      })
      .catch(() => {
        setError("Failed to load listing");
        setLoading(false);
      });
  }, [id]);

  async function handleUnlock() {
    setCheckoutLoading(true);
    try {
      const res = await fetch("/api/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ listingId: id }),
      });
      const data = await res.json();
      
      if (data.error) {
        if (res.status === 401) {
          router.push(`/investor/login?redirect=/listings/${id}`);
          return;
        }
        setError(data.error);
        setCheckoutLoading(false);
        return;
      }
      
      if (data.url) {
        window.location.href = data.url;
      }
    } catch {
      setError("Failed to start checkout");
      setCheckoutLoading(false);
    }
  }

  if (loading) {
    return (
      <div className="page-shell min-h-screen flex items-center justify-center">
        <div className="blueprint-pattern" aria-hidden="true" />
        <div className="h-8 w-8 animate-spin rounded-full border-2 border-amber-400 border-t-transparent" />
      </div>
    );
  }

  if (error || !listing) {
    return (
      <div className="page-shell min-h-screen flex items-center justify-center px-6">
        <div className="blueprint-pattern" aria-hidden="true" />
        <div className="text-center">
          <p className="text-lg text-rose-300">{error || "Listing not found"}</p>
          <Link href="/listings" className="mt-4 inline-block text-amber-400 hover:text-amber-300">
            Back to listings
          </Link>
        </div>
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
              <div className="text-[11px] text-slate-400">Motivated Seller Marketplace</div>
            </div>
          </Link>
          <Link href="/listings" className="text-sm text-slate-300 hover:text-amber-400">
            ← All Listings
          </Link>
        </div>
      </header>

      <main className="mx-auto max-w-3xl px-6 py-12">
        {success && (
          <div className="mb-6 rounded-xl border border-emerald-500/40 bg-emerald-500/10 p-4 text-emerald-200">
            Payment successful! You now have 48-hour exclusive access to this seller.
          </div>
        )}
        {canceled && (
          <div className="mb-6 rounded-xl border border-amber-500/40 bg-amber-500/10 p-4 text-amber-200">
            Payment was canceled. You can try again when ready.
          </div>
        )}

        <div className="rounded-2xl border border-slate-700/60 bg-slate-900/90 overflow-hidden">
          <div className="bg-slate-800/50 px-6 py-4 border-b border-slate-700/60">
            <h1 className="text-xl font-bold text-white">{listing.propertyAddress}</h1>
            <p className="mt-1 text-sm text-slate-400">
              Listed {new Date(listing.createdAt).toLocaleDateString()}
            </p>
          </div>
          
          <div className="p-6 space-y-6">
            <div className="grid gap-4 sm:grid-cols-3">
              <div className="rounded-xl bg-slate-800/40 p-4">
                <p className="text-xs text-slate-500 mb-1">Timeline</p>
                <p className="font-medium text-amber-400">{getTimelineLabel(listing.timeline)}</p>
              </div>
              <div className="rounded-xl bg-slate-800/40 p-4">
                <p className="text-xs text-slate-500 mb-1">Condition</p>
                <p className="font-medium text-slate-200">{getConditionLabel(listing.condition)}</p>
              </div>
              <div className="rounded-xl bg-slate-800/40 p-4">
                <p className="text-xs text-slate-500 mb-1">Motivation</p>
                <p className="font-medium text-slate-200">{getReasonLabel(listing.reason)}</p>
              </div>
            </div>

            {/* Contact Info Section */}
            {listing.isUnlocked ? (
              <div className="rounded-xl border border-emerald-500/40 bg-emerald-500/10 p-6">
                <div className="flex items-center gap-2 mb-4">
                  <svg className="h-5 w-5 text-emerald-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <h3 className="font-semibold text-emerald-300">Seller Contact Info (Unlocked)</h3>
                </div>
                {listing.exclusiveUntil && (
                  <p className="text-xs text-emerald-400/70 mb-4">
                    Exclusive access until {new Date(listing.exclusiveUntil).toLocaleString()}
                  </p>
                )}
                <div className="space-y-3">
                  <div>
                    <p className="text-xs text-slate-500">Seller Name</p>
                    <p className="text-lg font-medium text-white">{listing.name}</p>
                  </div>
                  <div>
                    <p className="text-xs text-slate-500">Contact</p>
                    <p className="text-lg font-medium text-white">{listing.contact}</p>
                  </div>
                </div>
              </div>
            ) : listing.isExclusivelyLocked ? (
              <div className="rounded-xl border border-rose-500/40 bg-rose-500/10 p-6 text-center">
                <p className="text-rose-200">
                  This listing is currently under exclusive review by another investor.
                </p>
                <p className="mt-2 text-sm text-rose-300/70">Check back in 48 hours.</p>
              </div>
            ) : (
              <div className="rounded-xl border border-slate-600 bg-slate-800/60 p-6 text-center">
                <h3 className="font-semibold text-white mb-2">Unlock Seller Contact Info</h3>
                <p className="text-sm text-slate-400 mb-4">
                  Pay $1,000 to get the seller&apos;s name and contact details with 48-hour exclusive access.
                </p>
                <button
                  type="button"
                  onClick={handleUnlock}
                  disabled={checkoutLoading}
                  className="inline-flex items-center justify-center rounded-full bg-emerald-500 px-8 py-3 text-sm font-semibold text-white transition hover:bg-emerald-400 disabled:opacity-50"
                >
                  {checkoutLoading ? "Processing..." : "Unlock for $1,000"}
                </button>
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}

