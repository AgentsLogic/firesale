"use client";

import { useState, type FormEvent } from "react";
import { BrandGlyph } from "./components/brand-glyph";


export default function Home() {
  const [sellerStatus, setSellerStatus] = useState<"idle" | "submitting" | "success" | "error">("idle");
  const [sellerMessage, setSellerMessage] = useState<string | null>(null);
  const [investorStatus, setInvestorStatus] = useState<"idle" | "submitting" | "success" | "error">("idle");
  const [investorMessage, setInvestorMessage] = useState<string | null>(null);


  return (
    <div className="page-shell min-h-screen">
      {/* Blueprint pattern overlay */}
      <div className="blueprint-pattern" aria-hidden="true" />

      <header className="border-b border-slate-800/60 bg-slate-950/80 backdrop-blur">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4">
          <div className="flex items-center gap-2">
            <span className="inline-flex h-9 w-9 items-center justify-center rounded-xl bg-amber-400/10 text-amber-400 ring-1 ring-amber-400/40">
              <BrandGlyph className="h-5 w-5" />
            </span>
            <div className="leading-tight">
              <div className="text-sm font-semibold tracking-tight">FireSaleHomes</div>
              <div className="text-[11px] text-slate-400">Sell fast. Serious cash buyers only.</div>
            </div>
          </div>
          <nav className="hidden gap-6 text-xs font-medium text-slate-300 md:flex">
            <a href="#sellers" className="hover:text-amber-300">
              For Sellers
            </a>
            <a href="#investors" className="hover:text-amber-300">
              For Investors
            </a>
            <a href="#how-it-works" className="hover:text-amber-300">
              How It Works
            </a>
          </nav>
          <div className="flex items-center gap-3">
            <a
              href="#investors"
              className="hidden rounded-full border border-slate-700 px-4 py-1.5 text-xs font-medium text-slate-200 hover:border-slate-500 hover:text-white md:inline-flex"
            >
              Investor access
            </a>
            <a
              href="#get-offers"
              className="rounded-full bg-amber-400 px-4 py-1.5 text-xs font-semibold text-slate-950 shadow-sm shadow-amber-400/40 transition hover:bg-amber-300"
            >
              Get cash offers
            </a>
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-6xl px-6 pb-24 pt-12 md:pt-16">
        {/* Hero section */}
        <section
          id="sellers"
          className="grid gap-10 md:grid-cols-[minmax(0,1.2fr)_minmax(0,1fr)] md:items-center"
        >
          <div className="fs-animate-hero">
            <p className="mb-3 inline-flex items-center gap-2 rounded-full border border-amber-400/40 bg-amber-400/10 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.16em] text-amber-400">
              New • U.S. motivated seller marketplace
            </p>
            <h1 className="text-balance text-3xl font-bold tracking-tight text-white sm:text-4xl md:text-5xl">
              Sell your house fast to pre-vetted cash buyers.
            </h1>
            <p className="mt-4 max-w-xl text-sm leading-relaxed text-slate-200 md:text-base">
              FireSaleHomes connects highly motivated U.S. sellers with serious investors and cash buyers.
              One simple form, multiple competing offers, no showings, no repairs, no pressure.
            </p>
            <div className="mt-6 flex flex-col gap-3 text-xs sm:flex-row sm:items-center">
              <a
                href="#get-offers"
                className="inline-flex items-center justify-center rounded-full bg-amber-400 px-5 py-2.5 text-sm font-semibold text-slate-950 shadow-lg shadow-amber-400/30 transition hover:bg-amber-300 hover:shadow-amber-300/40"
              >
                Start my free property review
              </a>
              <span className="text-xs text-slate-300">
                No agent obligation • No junk fees • We only work with serious buyers
              </span>
            </div>
            <dl className="mt-8 grid max-w-xl grid-cols-2 gap-4 text-sm">
              <div>
                <dt className="text-slate-400">Typical offer window</dt>
                <dd className="font-semibold text-white">24–72 hours*</dd>
              </div>
              <div>
                <dt className="text-slate-400">Condition</dt>
                <dd className="font-semibold text-white">As‑is, no repairs required</dd>
              </div>
              <div>
                <dt className="text-slate-400">Seller fee to FireSaleHomes</dt>
                <dd className="font-semibold text-emerald-400">$0 – buyer pays our fee</dd>
              </div>
              <div>
                <dt className="text-slate-400">Coverage</dt>
                <dd className="font-semibold text-white">Select U.S. metros (expanding)</dd>
              </div>
            </dl>
          </div>

          {/* Seller intake card (lead form) */}
          <section
            id="get-offers"
            className="fs-animate-hero-secondary rounded-3xl border border-slate-800/70 bg-slate-900/70 p-5 shadow-xl shadow-black/40 backdrop-blur"
          >
            <h2 className="text-sm font-semibold text-slate-50">Tell us about your property</h2>
            <p className="mt-1 text-[11px] text-slate-400">
              We use this to match you with the right investors. No spam, no public listing.
            </p>
            <form
              className="mt-4 space-y-3 text-xs"
              onSubmit={async (event: FormEvent<HTMLFormElement>) => {
                event.preventDefault();

                const form = event.currentTarget;
                const formData = new FormData(form);

                const payload = {
                  propertyAddress: String(formData.get("propertyAddress") ?? ""),
                  timeline: String(formData.get("timeline") ?? ""),
                  condition: String(formData.get("condition") ?? ""),
                  reason: String(formData.get("reason") ?? ""),
                  name: String(formData.get("name") ?? ""),
                  contact: String(formData.get("contact") ?? ""),
                };

                setSellerStatus("submitting");
                setSellerMessage(null);

                try {
                  const response = await fetch("/api/seller", {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify(payload),
                  });

                  if (!response.ok) {
                    console.error("Seller form submission failed", await response.json().catch(() => undefined));
                    setSellerStatus("error");
                    setSellerMessage("We couldn't submit your property right now. Please try again in a moment.");
                    return;
                  }

                  form.reset();
                  setSellerStatus("success");
                  setSellerMessage(
                    "Thank you. Your property details were received. We'll follow up shortly with next steps.",
                  );
                } catch (error) {
                  console.error("Seller form submission error", error);
                  setSellerStatus("error");
                  setSellerMessage(
                    "Something went wrong submitting your property. Please check your connection and try again.",
                  );
                }
              }}
            >
              <div>
                <label className="block text-[11px] font-medium text-slate-300" htmlFor="propertyAddress">
                  Property address
                </label>
                <input
                  id="propertyAddress"
                  name="propertyAddress"
                  type="text"
                  placeholder="123 Main St, Phoenix AZ"
                  required
                  className="mt-1 w-full rounded-xl border border-slate-700 bg-slate-950/40 px-3 py-2 text-xs text-slate-50 outline-none ring-0 placeholder:text-slate-500 focus:border-amber-400/80 focus:ring-2 focus:ring-amber-400/40"
                />
              {sellerMessage && (
                <p
                  role="status"
                  aria-live="polite"
                  className={`mt-2 rounded-lg border px-3 py-2 text-[11px] ${
                    sellerStatus === "success"
                      ? "border-emerald-500/60 bg-emerald-500/5 text-emerald-200"
                      : "border-rose-500/60 bg-rose-500/5 text-rose-200"
                  }`}
                >
                  {sellerMessage}
                </p>
              )}
            </div>
              <div className="grid gap-3 sm:grid-cols-2">
                <div>
                  <label className="block text-[11px] font-medium text-slate-300" htmlFor="timeline">
                    Timeline to sell
                  </label>
                  <select
                    id="timeline"
                    name="timeline"
                    className="mt-1 w-full rounded-xl border border-slate-700 bg-slate-950/40 px-3 py-2 text-xs text-slate-50 outline-none focus:border-amber-400/80 focus:ring-2 focus:ring-amber-400/40"
                  >
                    <option>ASAP (2–3 weeks)</option>
                    <option>30–45 days</option>
                    <option>60+ days</option>
                    <option>Just exploring options</option>
                  </select>
                </div>
                <div>
                  <label className="block text-[11px] font-medium text-slate-300" htmlFor="condition">
                    Property condition
                  </label>
                  <select
                    id="condition"
                    name="condition"
                    className="mt-1 w-full rounded-xl border border-slate-700 bg-slate-950/40 px-3 py-2 text-xs text-slate-50 outline-none focus:border-amber-400/80 focus:ring-2 focus:ring-amber-400/40"
                  >
                    <option>Move‑in ready</option>
                    <option>Needs light updates</option>
                    <option>Needs major repairs</option>
                    <option>Fire / flood / severe damage</option>
                  </select>
                </div>
              </div>
              <div>
                <label className="block text-[11px] font-medium text-slate-300" htmlFor="reason">
                  Why are you selling?
                </label>
                <select
                  id="reason"
                  name="reason"
                  className="mt-1 w-full rounded-xl border border-slate-700 bg-slate-950/40 px-3 py-2 text-xs text-slate-50 outline-none focus:border-amber-400/80 focus:ring-2 focus:ring-amber-400/40"
                >
                  <option>Behind on payments</option>
                  <option>Inherited property</option>
                  <option>Landlord / tenant issues</option>
                  <option>Relocating</option>
                  <option>Downsizing / other</option>
                </select>
              </div>
              <div className="grid gap-3 sm:grid-cols-2">
                <div>
                  <label className="block text-[11px] font-medium text-slate-300" htmlFor="sellerName">
                    Your name
                  </label>
                  <input
                    id="sellerName"
                    name="name"
                    type="text"
                    required
                    placeholder="First and last name"
                    className="mt-1 w-full rounded-xl border border-slate-700 bg-slate-950/40 px-3 py-2 text-xs text-slate-50 outline-none placeholder:text-slate-500 focus:border-amber-400/80 focus:ring-2 focus:ring-amber-400/40"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-medium text-slate-300" htmlFor="sellerContact">
                    Phone or email
                  </label>
                  <input
                    id="sellerContact"
                    name="contact"
                    type="text"
                    required
                    placeholder="Where we should send offers"
                    className="mt-1 w-full rounded-xl border border-slate-700 bg-slate-950/40 px-3 py-2 text-xs text-slate-50 outline-none placeholder:text-slate-500 focus:border-amber-400/80 focus:ring-2 focus:ring-amber-400/40"
                  />
                </div>
              </div>
              <button
                type="submit"
                disabled={sellerStatus === "submitting"}
                className="mt-1 inline-flex w-full items-center justify-center rounded-full bg-amber-400 px-4 py-2 text-xs font-semibold text-slate-950 shadow-sm shadow-amber-400/40 transition hover:bg-amber-300 disabled:cursor-not-allowed disabled:opacity-60"
              >
                {sellerStatus === "submitting" ? "Submitting..." : "Submit my property for review"}
              </button>
              <p className="text-[10px] leading-relaxed text-slate-500">
                By submitting, you agree to be contacted by FireSaleHomes and select investor partners about this
                property by phone, text, and email. No obligation to accept any offer.
              </p>
            </form>
          </section>
        </section>

        {/* How it works */}
        <section id="how-it-works" className="mt-20 fs-animate-section border-t border-slate-700/50 pt-12">
          <h2 className="text-xl font-bold tracking-tight text-white md:text-2xl">
            How FireSaleHomes works for motivated sellers
          </h2>
          <p className="mt-3 max-w-2xl text-sm text-slate-300 md:text-base">
            We’re not a public listing site. We quietly match your property with a curated pool of verified investors and
            cash buyers in your metro. You stay in control at every step.
          </p>
          <ol className="mt-8 grid gap-6 md:grid-cols-3">
            <li className="fs-animate-card-1 rounded-2xl border border-slate-700/60 bg-slate-900/80 p-5 shadow-lg">
              <div className="inline-flex h-8 w-8 items-center justify-center rounded-full bg-amber-400/20 text-sm font-bold text-amber-400">1</div>
              <h3 className="mt-3 text-base font-semibold text-white">Tell us about the property</h3>
              <p className="mt-2 text-sm text-slate-300">
                Share the basics—address, condition, and timeline. We use this to decide which buyers are a fit.
              </p>
            </li>
            <li className="fs-animate-card-2 rounded-2xl border border-slate-700/60 bg-slate-900/80 p-5 shadow-lg">
              <div className="inline-flex h-8 w-8 items-center justify-center rounded-full bg-amber-400/20 text-sm font-bold text-amber-400">2</div>
              <h3 className="mt-3 text-base font-semibold text-white">We invite pre‑vetted buyers</h3>
              <p className="mt-2 text-sm text-slate-300">
                Verified investors review your property details and submit as‑is offers—often within 24–72 hours.*
              </p>
            </li>
            <li className="fs-animate-card-3 rounded-2xl border border-slate-700/60 bg-slate-900/80 p-5 shadow-lg">
              <div className="inline-flex h-8 w-8 items-center justify-center rounded-full bg-amber-400/20 text-sm font-bold text-amber-400">3</div>
              <h3 className="mt-3 text-base font-semibold text-white">You choose what happens next</h3>
              <p className="mt-2 text-xs text-slate-300">
                Compare offers, ask questions, or walk away. There’s no obligation to accept any offer.
              </p>
            </li>
          </ol>
          <p className="mt-6 text-xs text-slate-400">
            *Offer timing and pricing are not guaranteed and depend on market conditions, property details, and buyer
            interest in your area.
          </p>
        </section>

        {/* Investor section */}
        <section id="investors" className="mt-20 fs-animate-section rounded-3xl border border-slate-700/60 bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 p-8 shadow-xl">
          <div className="grid gap-10 md:grid-cols-[minmax(0,1.1fr)_minmax(0,1fr)] md:items-center">
            <div className="fs-animate-hero">
              <p className="text-xs font-semibold uppercase tracking-[0.16em] text-amber-400">
                For investors &amp; cash buyers
              </p>
              <h2 className="mt-3 text-balance text-xl font-bold text-white md:text-2xl">
                Deal-ready motivated seller leads from select U.S. metros.
              </h2>
              <p className="mt-4 max-w-xl text-sm text-slate-300 md:text-base">
                FireSaleHomes curates high-intent, motivated sellers who want speed and certainty more than top-dollar
                price. Join as a founding buyer in our launch markets and get early access to off-market opportunities.
              </p>
              <ul className="mt-5 grid gap-3 text-sm text-slate-200">
                <li className="flex items-start gap-3">
                  <span className="mt-1.5 h-2 w-2 rounded-full bg-emerald-400" />
                  <span>Verified seller motivation and basic condition details on every lead.</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="mt-1.5 h-2 w-2 rounded-full bg-emerald-400" />
                  <span>No recycled wholesale lists—curated, direct-to-seller opportunities.</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="mt-1.5 h-2 w-2 rounded-full bg-emerald-400" />
                  <span>Buyer-pays success model; sellers never pay us, keeping conversations clean.</span>
                </li>
              </ul>
            </div>
            <div className="fs-animate-hero-secondary rounded-2xl border border-slate-700/60 bg-slate-900/90 p-6 shadow-xl">
              <h3 className="text-base font-semibold text-white">Join the investor waitlist</h3>
              <p className="mt-2 text-sm text-slate-400">
                Tell us where you buy and your criteria. We’ll reach out as we open each market.
              </p>
              <form
                className="mt-5 space-y-4 text-sm"
                onSubmit={async (event: FormEvent<HTMLFormElement>) => {
                  event.preventDefault();

                  const form = event.currentTarget;
                  const formData = new FormData(form);

                  const payload = {
                    name: String(formData.get("name") ?? ""),
                    email: String(formData.get("email") ?? ""),
                    metros: String(formData.get("metros") ?? ""),
                    buyBox: String(formData.get("buyBox") ?? ""),
                  };

                  setInvestorStatus("submitting");
                  setInvestorMessage(null);

                  try {
                    const response = await fetch("/api/investor", {
                      method: "POST",
                      headers: { "Content-Type": "application/json" },
                      body: JSON.stringify(payload),
                    });

                    if (!response.ok) {
                      console.error("Investor form submission failed", await response.json().catch(() => undefined));
                      setInvestorStatus("error");
                      setInvestorMessage(
                        "We couldn't save your investor profile right now. Please try again in a moment.",
                      );
                      return;
                    }

                    form.reset();
                    setInvestorStatus("success");
                    setInvestorMessage(
                      "Thanks for joining the FireSaleHomes investor waitlist. We'll be in touch as we open markets.",
                    );
                  } catch (error) {
                    console.error("Investor form submission error", error);
                    setInvestorStatus("error");
                    setInvestorMessage(
                      "Something went wrong submitting your details. Please check your connection and try again.",
                    );
                  }
                }}
              >

                {investorMessage && (
                  <p
                    role="status"
                    aria-live="polite"
                    className={`mt-2 rounded-lg border px-3 py-2 text-sm ${
                      investorStatus === "success"
                        ? "border-emerald-500/60 bg-emerald-500/10 text-emerald-200"
                        : "border-rose-500/60 bg-rose-500/10 text-rose-200"
                    }`}
                  >
                    {investorMessage}
                  </p>
                )}
                <div>
                  <label className="block text-sm font-medium text-slate-300" htmlFor="investorName">
                    Name &amp; company
                  </label>
                  <input
                    id="investorName"
                    name="name"
                    type="text"
                    required
                    placeholder="Jane Investor, Phoenix Equity Group"
                    className="mt-1.5 w-full rounded-xl border border-slate-600 bg-slate-800/60 px-4 py-2.5 text-sm text-white outline-none placeholder:text-slate-500 focus:border-amber-400/80 focus:ring-2 focus:ring-amber-400/40"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-300" htmlFor="investorEmail">
                    Email
                  </label>
                  <input
                    id="investorEmail"
                    name="email"
                    type="email"
                    required
                    placeholder="you@fundname.com"
                    className="mt-1.5 w-full rounded-xl border border-slate-600 bg-slate-800/60 px-4 py-2.5 text-sm text-white outline-none placeholder:text-slate-500 focus:border-amber-400/80 focus:ring-2 focus:ring-amber-400/40"
                  />
                </div>
                <div className="grid gap-4 sm:grid-cols-2">
                  <div>
                    <label className="block text-sm font-medium text-slate-300" htmlFor="metros">
                      Target metros
                    </label>
                    <input
                      id="metros"
                      name="metros"
                      type="text"
                      required
                      placeholder="Phoenix, Tampa, Atlanta"
                      className="mt-1.5 w-full rounded-xl border border-slate-600 bg-slate-800/60 px-4 py-2.5 text-sm text-white outline-none placeholder:text-slate-500 focus:border-amber-400/80 focus:ring-2 focus:ring-amber-400/40"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-300" htmlFor="buyBox">
                      Buy box
                    </label>
                    <input
                      id="buyBox"
                      name="buyBox"
                      type="text"
                      required
                      placeholder="SFR 150-400k, light-medium rehab"
                      className="mt-1.5 w-full rounded-xl border border-slate-600 bg-slate-800/60 px-4 py-2.5 text-sm text-white outline-none placeholder:text-slate-500 focus:border-amber-400/80 focus:ring-2 focus:ring-amber-400/40"
                    />
                  </div>
                </div>
                <button
                  type="submit"
                  disabled={investorStatus === "submitting"}
                  className="mt-3 inline-flex w-full items-center justify-center rounded-full bg-white px-5 py-3 text-sm font-semibold text-slate-900 shadow-md shadow-white/20 transition hover:bg-amber-200 hover:text-slate-900 disabled:cursor-not-allowed disabled:opacity-60"
                >
                  {investorStatus === "submitting" ? "Joining..." : "Join waitlist"}
                </button>
                <p className="text-xs leading-relaxed text-slate-400">
                  We’ll keep you posted as we open each metro. No spam, no resale of your data.
                </p>
              </form>
            </div>
          </div>
        </section>
      </main>

      <footer className="border-t border-slate-800/60 bg-slate-950 py-8">
        <div className="mx-auto flex max-w-6xl flex-col items-start justify-between gap-4 px-6 text-xs text-slate-400 sm:flex-row sm:items-center">
          <p>
            © {new Date().getFullYear()} FireSaleHomes. All rights reserved.
          </p>
          <p className="max-w-md text-slate-500">
            FireSaleHomes is a marketplace platform, not a real estate broker. We encourage all parties to consult
            appropriate licensed professionals and legal counsel.
          </p>
        </div>
      </footer>
    </div>
  );
}
