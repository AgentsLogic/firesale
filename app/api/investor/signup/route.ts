import { NextRequest, NextResponse } from "next/server";
import { createInvestorAccount, getInvestorByEmail } from "@/lib/lead-store";
import { hashPassword, setAuthCookie } from "@/lib/auth";
import { checkRateLimit, getClientIp, RATE_LIMITS } from "@/lib/rate-limit";
import { investorSignupSchema, formatZodError } from "@/lib/validation";

export async function POST(request: NextRequest) {
  try {
    // Rate limiting
    const ip = getClientIp(request);
    const rateLimit = checkRateLimit(`signup:${ip}`, RATE_LIMITS.signup);
    if (!rateLimit.success) {
      return NextResponse.json(
        { error: `Too many signup attempts. Try again in ${rateLimit.retryAfterSeconds} seconds.` },
        { status: 429 }
      );
    }

    const body = await request.json();

    // Validate input
    const parsed = investorSignupSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json(
        { error: formatZodError(parsed.error) },
        { status: 400 }
      );
    }

    const { email, password, name, company, phone } = parsed.data;

    // Check if email already exists
    const existing = await getInvestorByEmail(email);
    if (existing) {
      return NextResponse.json(
        { error: "An account with this email already exists" },
        { status: 400 }
      );
    }

    const passwordHash = await hashPassword(password);
    const investor = await createInvestorAccount({
      email,
      passwordHash,
      name,
      company: company || undefined,
      phone: phone || undefined,
    });

    await setAuthCookie(investor.id);

    return NextResponse.json({ success: true, investor });
  } catch (error) {
    console.error("Signup error:", error);
    return NextResponse.json(
      { error: "Failed to create account" },
      { status: 500 }
    );
  }
}

