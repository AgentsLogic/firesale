import { NextRequest, NextResponse } from "next/server";
import { verifyPasswordResetToken, resetPassword } from "@/lib/lead-store";
import { hashPassword } from "@/lib/auth";
import { resetPasswordSchema, formatZodError } from "@/lib/validation";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    // Validate input
    const parsed = resetPasswordSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json(
        { error: formatZodError(parsed.error) },
        { status: 400 }
      );
    }

    const { token, password } = parsed.data;

    // Verify token is valid
    const email = await verifyPasswordResetToken(token);
    if (!email) {
      return NextResponse.json(
        { error: "Invalid or expired reset link. Please request a new one." },
        { status: 400 }
      );
    }

    // Hash new password and update
    const passwordHash = await hashPassword(password);
    const success = await resetPassword(token, passwordHash);

    if (!success) {
      return NextResponse.json(
        { error: "Failed to reset password. Please try again." },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      message: "Password reset successfully. You can now sign in.",
    });
  } catch (error) {
    console.error("Reset password error:", error);
    return NextResponse.json(
      { error: "Failed to reset password" },
      { status: 500 }
    );
  }
}

