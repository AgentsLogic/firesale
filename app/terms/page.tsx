import Link from "next/link";
import { BrandGlyph } from "../components/brand-glyph";

export const metadata = {
  title: "Terms of Service | FireSaleHomes",
  description: "Terms of Service for FireSaleHomes motivated seller marketplace",
};

export default function TermsPage() {
  return (
    <div className="page-shell min-h-screen">
      <div className="blueprint-pattern" aria-hidden="true" />
      
      <header className="border-b border-slate-800/60 bg-slate-950/80 backdrop-blur sticky top-0 z-50">
        <div className="mx-auto flex max-w-4xl items-center justify-between px-6 py-4">
          <Link href="/" className="flex items-center gap-2">
            <span className="inline-flex h-9 w-9 items-center justify-center rounded-xl bg-amber-400/10 text-amber-400 ring-1 ring-amber-400/40">
              <BrandGlyph className="h-5 w-5" />
            </span>
            <span className="text-sm font-semibold text-white">FireSaleHomes</span>
          </Link>
        </div>
      </header>

      <main className="mx-auto max-w-4xl px-6 py-12">
        <h1 className="text-3xl font-bold text-white mb-2">Terms of Service</h1>
        <p className="text-sm text-slate-400 mb-8">Last updated: December 2024</p>

        <div className="prose prose-invert prose-slate max-w-none space-y-8 text-slate-300">
          <section>
            <h2 className="text-xl font-semibold text-white mb-4">1. Acceptance of Terms</h2>
            <p>By accessing or using FireSaleHomes.com (the &quot;Service&quot;), you agree to be bound by these Terms of Service. If you do not agree to these terms, do not use the Service.</p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-white mb-4">2. Description of Service</h2>
            <p>FireSaleHomes is a marketplace that connects motivated property sellers with real estate investors. We provide:</p>
            <ul className="list-disc pl-6 mt-2 space-y-1">
              <li>A platform for sellers to submit property information</li>
              <li>A listing service for investors to browse available properties</li>
              <li>Contact information unlocking services for a fee</li>
            </ul>
            <p className="mt-4">FireSaleHomes is <strong>not</strong> a real estate brokerage and does not provide real estate brokerage services. We do not negotiate transactions, provide valuations, or represent buyers or sellers in real estate transactions.</p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-white mb-4">3. User Accounts</h2>
            <p>To access certain features, you must create an account. You agree to:</p>
            <ul className="list-disc pl-6 mt-2 space-y-1">
              <li>Provide accurate and complete information</li>
              <li>Maintain the security of your account credentials</li>
              <li>Accept responsibility for all activities under your account</li>
              <li>Notify us immediately of any unauthorized use</li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-white mb-4">4. Seller Terms</h2>
            <p>By submitting property information, sellers represent that:</p>
            <ul className="list-disc pl-6 mt-2 space-y-1">
              <li>They have legal authority to sell the property or are authorized to submit information on behalf of the owner</li>
              <li>All information provided is accurate and complete</li>
              <li>They consent to having their contact information shared with investors who unlock their listing</li>
            </ul>
            <p className="mt-4">Sellers are not obligated to accept any offers received through the platform.</p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-white mb-4">5. Investor Terms</h2>
            <p>By using the investor features, you agree that:</p>
            <ul className="list-disc pl-6 mt-2 space-y-1">
              <li>Unlocking fees are non-refundable once contact information is provided</li>
              <li>You will use seller information only for legitimate real estate inquiries</li>
              <li>You will not harass, spam, or misuse seller contact information</li>
              <li>Exclusive access periods grant you priority but do not guarantee a transaction</li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-white mb-4">6. Fees and Payment</h2>
            <p>Sellers may list properties at no cost. Investors pay a fee to unlock seller contact information. All fees are:</p>
            <ul className="list-disc pl-6 mt-2 space-y-1">
              <li>Clearly disclosed before payment</li>
              <li>Processed securely through our payment provider</li>
              <li>Non-refundable once the service is delivered</li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-white mb-4">7. Disclaimers</h2>
            <p>THE SERVICE IS PROVIDED &quot;AS IS&quot; WITHOUT WARRANTIES OF ANY KIND. WE DO NOT GUARANTEE:</p>
            <ul className="list-disc pl-6 mt-2 space-y-1">
              <li>The accuracy of property information submitted by sellers</li>
              <li>That any transaction will result from using the Service</li>
              <li>The quality, safety, or legality of properties listed</li>
              <li>That sellers will respond to investor inquiries</li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-white mb-4">8. Limitation of Liability</h2>
            <p>To the maximum extent permitted by law, FireSaleHomes shall not be liable for any indirect, incidental, special, consequential, or punitive damages arising from your use of the Service.</p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-white mb-4">9. Governing Law</h2>
            <p>These terms shall be governed by applicable law, without regard to conflict of law principles.</p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-white mb-4">10. Contact</h2>
            <p>Questions about these Terms? Contact us at <a href="mailto:legal@firesalehomes.com" className="text-amber-400 hover:text-amber-300">legal@firesalehomes.com</a></p>
          </section>
        </div>

        <div className="mt-12 pt-8 border-t border-slate-800">
          <Link href="/" className="text-sm text-amber-400 hover:text-amber-300">← Back to Home</Link>
        </div>
      </main>
    </div>
  );
}

