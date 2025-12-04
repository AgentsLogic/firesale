import { NextRequest, NextResponse } from "next/server";
import { saveSellerLead } from "@/lib/lead-store";
import { sendNewSellerLeadNotification } from "@/lib/email";
import { checkRateLimit, getClientIp, RATE_LIMITS } from "@/lib/rate-limit";
import { sellerLeadSchema, formatZodError } from "@/lib/validation";

export async function POST(request: NextRequest) {
  // Rate limiting
  const ip = getClientIp(request);
  const rateLimit = checkRateLimit(`seller:${ip}`, RATE_LIMITS.sellerForm);
  if (!rateLimit.success) {
    return NextResponse.json(
      { error: `Too many submissions. Try again in ${Math.ceil((rateLimit.retryAfterSeconds || 0) / 60)} minutes.` },
      { status: 429 }
    );
  }

  let json: unknown;

  try {
    json = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON payload" }, { status: 400 });
  }

  const parsed = sellerLeadSchema.safeParse(json);

  if (!parsed.success) {
    return NextResponse.json(
      { error: formatZodError(parsed.error) },
      { status: 400 },
    );
  }

  try {
    const saved = await saveSellerLead(parsed.data);

    // Send email notification (non-blocking)
    sendNewSellerLeadNotification(parsed.data).catch((err) => {
      console.error("Failed to send email notification:", err);
    });

    return NextResponse.json(
      {
        success: true,
        id: saved.id,
      },
      { status: 201 },
    );
  } catch (error) {
    console.error("Error saving seller lead", error);
    return NextResponse.json({ error: "Failed to save lead" }, { status: 500 });
  }
}

