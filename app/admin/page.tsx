import { cookies } from "next/headers";
import { redirect } from "next/navigation";

import { getInvestorLeads, getSellerLeads } from "@/lib/lead-store";
import { BrandGlyph } from "../components/brand-glyph";


export const dynamic = "force-dynamic";

const ADMIN_ACCESS_TOKEN = process.env.ADMIN_ACCESS_TOKEN;

export default async function AdminPage() {
  if (!ADMIN_ACCESS_TOKEN) {
    return (
      <main className="min-h-screen bg-slate-950 px-4 py-6 text-slate-50">
        <div className="mx-auto max-w-6xl space-y-4">
          <h1 className="text-lg font-semibold tracking-tight">FireSaleHomes Admin</h1>
          <p className="text-xs text-slate-400">
            Admin access is not yet configured. Set <code>ADMIN_ACCESS_TOKEN</code> in your environment to enable this
            page.
          </p>
        </div>
      </main>
    );
  }

  const cookieStore = await cookies();
  const token = cookieStore.get("fire_admin_token")?.value;

  if (token !== ADMIN_ACCESS_TOKEN) {
    redirect("/admin/login");
  }

  const [sellers, investors] = await Promise.all([
    getSellerLeads(),
    getInvestorLeads(),
  ]);

  return (
    <main className="min-h-screen bg-slate-950 px-4 py-6 text-slate-50">
      <div className="mx-auto max-w-6xl space-y-8">
        <header className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <span className="inline-flex h-8 w-8 items-center justify-center rounded-xl bg-amber-400/10 text-amber-400 ring-1 ring-amber-400/40">
              <BrandGlyph className="h-4 w-4" />
            </span>
            <div>
              <h1 className="text-lg font-semibold tracking-tight">FireSaleHomes Admin</h1>
              <p className="text-xs text-slate-400">Internal view of seller and investor leads.</p>
            </div>
          </div>
          <span className="rounded-full border border-amber-500/40 bg-amber-500/10 px-3 py-1 text-[11px] font-medium text-amber-200">
            Internal only
          </span>
        </header>

        <section className="space-y-3 rounded-2xl border border-slate-800 bg-slate-900/70 p-4">
          <div className="flex items-baseline justify-between gap-4">
            <h2 className="text-sm font-semibold text-slate-50">Seller leads</h2>
            <p className="text-[11px] text-slate-400">
              {sellers.length} record{sellers.length === 1 ? "" : "s"}
            </p>
          </div>
          <div className="overflow-x-auto rounded-xl border border-slate-800/80 bg-slate-950/60">
            <table className="min-w-full text-left text-[11px]">
              <thead className="bg-slate-900/80 text-slate-300">
                <tr>
                  <th className="px-3 py-2 font-medium">Created</th>
                  <th className="px-3 py-2 font-medium">Address</th>
                  <th className="px-3 py-2 font-medium">Timeline</th>
                  <th className="px-3 py-2 font-medium">Condition</th>
                  <th className="px-3 py-2 font-medium">Reason</th>
                  <th className="px-3 py-2 font-medium">Contact</th>
                </tr>
              </thead>
              <tbody>
                {sellers.length === 0 ? (
                  <tr>
                    <td
                      colSpan={6}
                      className="px-3 py-6 text-center text-[11px] text-slate-500"
                    >
                      No seller leads yet.
                    </td>
                  </tr>
                ) : (
                  sellers
                    .slice()
                    .reverse()
                    .map((lead) => (
                      <tr
                        key={lead.id}
                        className="border-t border-slate-800/80 hover:bg-slate-900/80"
                      >
                        <td className="px-3 py-2 align-top text-slate-400">
                          {new Date(lead.createdAt).toLocaleString()}
                        </td>
                        <td className="px-3 py-2 align-top text-slate-50">
                          {lead.propertyAddress}
                        </td>
                        <td className="px-3 py-2 align-top text-slate-300">
                          {lead.timeline}
                        </td>
                        <td className="px-3 py-2 align-top text-slate-300">
                          {lead.condition}
                        </td>
                        <td className="px-3 py-2 align-top text-slate-300 max-w-xs">
                          {lead.reason}
                        </td>
                        <td className="px-3 py-2 align-top text-slate-300 max-w-xs">
                          <div className="font-medium text-slate-50">{lead.name}</div>
                          <div className="text-[11px] text-slate-400">{lead.contact}</div>
                        </td>
                      </tr>
                    ))
                )}
              </tbody>
            </table>
          </div>
        </section>

        <section className="space-y-3 rounded-2xl border border-slate-800 bg-slate-900/70 p-4">
          <div className="flex items-baseline justify-between gap-4">
            <h2 className="text-sm font-semibold text-slate-50">Investor leads</h2>
            <p className="text-[11px] text-slate-400">
              {investors.length} record{investors.length === 1 ? "" : "s"}
            </p>
          </div>
          <div className="overflow-x-auto rounded-xl border border-slate-800/80 bg-slate-950/60">
            <table className="min-w-full text-left text-[11px]">
              <thead className="bg-slate-900/80 text-slate-300">
                <tr>
                  <th className="px-3 py-2 font-medium">Created</th>
                  <th className="px-3 py-2 font-medium">Name</th>
                  <th className="px-3 py-2 font-medium">Email</th>
                  <th className="px-3 py-2 font-medium">Metros</th>
                  <th className="px-3 py-2 font-medium">Buy box</th>
                </tr>
              </thead>
              <tbody>
                {investors.length === 0 ? (
                  <tr>
                    <td
                      colSpan={5}
                      className="px-3 py-6 text-center text-[11px] text-slate-500"
                    >
                      No investor leads yet.
                    </td>
                  </tr>
                ) : (
                  investors
                    .slice()
                    .reverse()
                    .map((lead) => (
                      <tr
                        key={lead.id}
                        className="border-t border-slate-800/80 hover:bg-slate-900/80"
                      >
                        <td className="px-3 py-2 align-top text-slate-400">
                          {new Date(lead.createdAt).toLocaleString()}
                        </td>
                        <td className="px-3 py-2 align-top text-slate-50">
                          {lead.name}
                        </td>
                        <td className="px-3 py-2 align-top text-slate-300">
                          {lead.email}
                        </td>
                        <td className="px-3 py-2 align-top text-slate-300 max-w-xs">
                          {lead.metros}
                        </td>
                        <td className="px-3 py-2 align-top text-slate-300 max-w-xs">
                          {lead.buyBox}
                        </td>
                      </tr>
                    ))
                )}
              </tbody>
            </table>
          </div>
        </section>
      </div>
    </main>
  );
}

