import Link from "next/link";
import { BrandGlyph } from "../components/brand-glyph";

export const metadata = {
  title: "Privacy Policy | FireSaleHomes",
  description: "Privacy Policy for FireSaleHomes motivated seller marketplace",
};

export default function PrivacyPage() {
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
        <h1 className="text-3xl font-bold text-white mb-2">Privacy Policy</h1>
        <p className="text-sm text-slate-400 mb-8">Last updated: December 2024</p>

        <div className="prose prose-invert prose-slate max-w-none space-y-8 text-slate-300">
          <section>
            <h2 className="text-xl font-semibold text-white mb-4">1. Information We Collect</h2>
            <h3 className="text-lg font-medium text-slate-200 mt-4 mb-2">From Sellers:</h3>
            <ul className="list-disc pl-6 space-y-1">
              <li>Property address and details</li>
              <li>Name and contact information (email, phone)</li>
              <li>Reason for selling and timeline</li>
            </ul>
            <h3 className="text-lg font-medium text-slate-200 mt-4 mb-2">From Investors:</h3>
            <ul className="list-disc pl-6 space-y-1">
              <li>Name, email, and phone number</li>
              <li>Company name (optional)</li>
              <li>Payment information (processed by Stripe)</li>
              <li>Account credentials</li>
            </ul>
            <h3 className="text-lg font-medium text-slate-200 mt-4 mb-2">Automatically Collected:</h3>
            <ul className="list-disc pl-6 space-y-1">
              <li>IP address and browser type</li>
              <li>Device information</li>
              <li>Usage data and analytics</li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-white mb-4">2. How We Use Your Information</h2>
            <ul className="list-disc pl-6 space-y-1">
              <li>To operate and improve the Service</li>
              <li>To connect sellers with potential buyers</li>
              <li>To process payments and prevent fraud</li>
              <li>To communicate about your account and transactions</li>
              <li>To comply with legal obligations</li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-white mb-4">3. Information Sharing</h2>
            <p>We share information in the following circumstances:</p>
            <ul className="list-disc pl-6 mt-2 space-y-1">
              <li><strong>Seller to Investor:</strong> When an investor unlocks a listing, they receive the seller&apos;s name and contact information</li>
              <li><strong>Service Providers:</strong> We use third parties for payment processing (Stripe), hosting, and analytics</li>
              <li><strong>Legal Requirements:</strong> We may disclose information when required by law</li>
            </ul>
            <p className="mt-4">We do not sell your personal information to third parties for marketing purposes.</p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-white mb-4">4. Data Security</h2>
            <p>We implement industry-standard security measures including:</p>
            <ul className="list-disc pl-6 mt-2 space-y-1">
              <li>Encryption of data in transit (HTTPS)</li>
              <li>Secure password hashing</li>
              <li>Regular security assessments</li>
            </ul>
            <p className="mt-4">However, no method of transmission over the Internet is 100% secure.</p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-white mb-4">5. Your Rights</h2>
            <p>You have the right to:</p>
            <ul className="list-disc pl-6 mt-2 space-y-1">
              <li>Access the personal information we hold about you</li>
              <li>Request correction of inaccurate information</li>
              <li>Request deletion of your account and data</li>
              <li>Opt out of marketing communications</li>
            </ul>
            <p className="mt-4">To exercise these rights, contact us at <a href="mailto:privacy@firesalehomes.com" className="text-amber-400 hover:text-amber-300">privacy@firesalehomes.com</a></p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-white mb-4">6. Cookies</h2>
            <p>We use essential cookies to:</p>
            <ul className="list-disc pl-6 mt-2 space-y-1">
              <li>Keep you logged in</li>
              <li>Remember your preferences</li>
              <li>Analyze site usage</li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-white mb-4">7. Children&apos;s Privacy</h2>
            <p>The Service is not intended for users under 18 years of age. We do not knowingly collect information from children.</p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-white mb-4">8. Changes to This Policy</h2>
            <p>We may update this Privacy Policy from time to time. We will notify you of material changes by posting the new policy on this page with an updated date.</p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-white mb-4">9. Contact Us</h2>
            <p>Questions about this Privacy Policy? Contact us at:</p>
            <p className="mt-2">Email: <a href="mailto:privacy@firesalehomes.com" className="text-amber-400 hover:text-amber-300">privacy@firesalehomes.com</a></p>
          </section>
        </div>

        <div className="mt-12 pt-8 border-t border-slate-800">
          <Link href="/" className="text-sm text-amber-400 hover:text-amber-300">← Back to Home</Link>
        </div>
      </main>
    </div>
  );
}

