import { NextRequest, NextResponse } from "next/server";
import { getInvestorByEmail } from "@/lib/lead-store";
import { verifyPassword, setAuthCookie } from "@/lib/auth";
import { checkRateLimit, getClientIp, RATE_LIMITS } from "@/lib/rate-limit";
import { investorLoginSchema, formatZodError } from "@/lib/validation";

export async function POST(request: NextRequest) {
  try {
    // Rate limiting
    const ip = getClientIp(request);
    const rateLimit = checkRateLimit(`login:${ip}`, RATE_LIMITS.login);
    if (!rateLimit.success) {
      return NextResponse.json(
        { error: `Too many login attempts. Try again in ${rateLimit.retryAfterSeconds} seconds.` },
        { status: 429 }
      );
    }

    const body = await request.json();

    // Validate input
    const parsed = investorLoginSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json(
        { error: formatZodError(parsed.error) },
        { status: 400 }
      );
    }

    const { email, password } = parsed.data;

    const investor = await getInvestorByEmail(email);
    if (!investor) {
      return NextResponse.json(
        { error: "Invalid email or password" },
        { status: 401 }
      );
    }

    const isValid = await verifyPassword(password, investor.passwordHash);
    if (!isValid) {
      return NextResponse.json(
        { error: "Invalid email or password" },
        { status: 401 }
      );
    }

    await setAuthCookie(investor.id);

    return NextResponse.json({ 
      success: true, 
      investor: {
        id: investor.id,
        email: investor.email,
        name: investor.name,
      }
    });
  } catch (error) {
    console.error("Login error:", error);
    return NextResponse.json(
      { error: "Login failed" },
      { status: 500 }
    );
  }
}

