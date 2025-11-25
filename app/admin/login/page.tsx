import { cookies } from "next/headers";
import { redirect } from "next/navigation";

import { BrandGlyph } from "../../components/brand-glyph";

export const dynamic = "force-dynamic";

type AdminLoginPageProps = {
  searchParams?: {
    error?: string;
  };
};

export default function AdminLoginPage({ searchParams }: AdminLoginPageProps) {
  const hasError = searchParams?.error === "1";

  async function login(formData: FormData) {
    "use server";

    const expected = process.env.ADMIN_ACCESS_TOKEN;
    const submitted = formData.get("accessCode");

    if (!expected) {
      throw new Error("ADMIN_ACCESS_TOKEN is not configured.");
    }

    if (!submitted || submitted !== expected) {
      redirect("/admin/login?error=1");
    }

    const cookieStore = await cookies();

    cookieStore.set("fire_admin_token", expected, {
      httpOnly: true,
      sameSite: "lax",
      path: "/admin",
      secure: process.env.NODE_ENV === "production",
      maxAge: 60 * 60 * 24 * 7, // 7 days
    });

    redirect("/admin");
  }

  return (
    <main className="min-h-screen bg-slate-950 px-4 py-6 text-slate-50">
      <div className="mx-auto flex min-h-[60vh] max-w-sm flex-col justify-center">
        <div className="mb-4 flex items-center gap-2 text-xs text-slate-400">
          <span className="inline-flex h-7 w-7 items-center justify-center rounded-xl bg-amber-400/10 text-amber-400 ring-1 ring-amber-400/40">
            <BrandGlyph className="h-3.5 w-3.5" />
          </span>
          <span className="font-medium text-slate-200">FireSaleHomes admin</span>
        </div>
        <div className="space-y-3 rounded-2xl border border-slate-800 bg-slate-900/70 p-6 shadow-xl shadow-black/40">
          <div className="space-y-1">
            <h1 className="text-base font-semibold tracking-tight">Admin access</h1>
            <p className="text-xs text-slate-400">
              Enter the internal access code to view seller and investor leads.
            </p>
          </div>

          {hasError && (
            <p className="rounded-lg border border-rose-500/60 bg-rose-500/5 px-3 py-2 text-[11px] text-rose-200">
              Invalid access code. Please try again.
            </p>
          )}

          <form action={login} className="space-y-3 text-xs">
            <div>
              <label className="block text-[11px] font-medium text-slate-300" htmlFor="accessCode">
                Access code
              </label>
              <input
                id="accessCode"
                name="accessCode"
                type="password"
                autoComplete="off"
                required
                className="mt-1 w-full rounded-xl border border-slate-700 bg-slate-950/40 px-3 py-2 text-xs text-slate-50 outline-none placeholder:text-slate-500 focus:border-amber-400/80 focus:ring-2 focus:ring-amber-400/40"
                placeholder="Enter your admin access code"
              />
            </div>
            <button
              type="submit"
              className="inline-flex w-full items-center justify-center rounded-full bg-amber-400 px-4 py-2 text-xs font-semibold text-slate-950 shadow-sm shadow-amber-400/40 transition hover:bg-amber-300"
            >
              Continue to admin
            </button>
          </form>

          <p className="text-[10px] text-slate-500">
            This page is for internal use only. If you believe you should have access, contact the FireSaleHomes team.
          </p>
        </div>
      </div>
    </main>
  );
}

