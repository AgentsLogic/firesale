import { NextRequest, NextResponse } from "next/server";
import { createPasswordResetToken, getInvestorByEmail } from "@/lib/lead-store";
import { sendPasswordResetEmail } from "@/lib/email";
import { checkRateLimit, getClientIp, RATE_LIMITS } from "@/lib/rate-limit";
import { forgotPasswordSchema, formatZodError } from "@/lib/validation";

export async function POST(request: NextRequest) {
  try {
    // Rate limiting
    const ip = getClientIp(request);
    const rateLimit = checkRateLimit(`forgot-password:${ip}`, RATE_LIMITS.passwordReset);
    if (!rateLimit.success) {
      return NextResponse.json(
        { error: `Too many password reset requests. Try again in ${rateLimit.retryAfterSeconds} seconds.` },
        { status: 429 }
      );
    }

    const body = await request.json();

    // Validate input
    const parsed = forgotPasswordSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json(
        { error: formatZodError(parsed.error) },
        { status: 400 }
      );
    }

    const { email } = parsed.data;

    // Always return success to prevent email enumeration
    const successResponse = NextResponse.json({
      success: true,
      message: "If an account exists with this email, you will receive a password reset link.",
    });

    // Check if investor exists and get their name
    const investor = await getInvestorByEmail(email);
    if (!investor) {
      // Don't reveal that the email doesn't exist
      return successResponse;
    }

    // Create reset token
    const token = await createPasswordResetToken(email);
    if (!token) {
      return successResponse;
    }

    // Send email
    await sendPasswordResetEmail(email, investor.name, token);

    return successResponse;
  } catch (error) {
    console.error("Forgot password error:", error);
    return NextResponse.json(
      { error: "Failed to process request" },
      { status: 500 }
    );
  }
}

