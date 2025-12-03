import { NextRequest, NextResponse } from "next/server";
import { stripe } from "@/lib/stripe";
import { unlockListing } from "@/lib/lead-store";

export async function POST(request: NextRequest) {
  if (!stripe) {
    return NextResponse.json({ error: "Stripe not configured" }, { status: 500 });
  }

  const body = await request.text();
  const signature = request.headers.get("stripe-signature");
  const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;

  if (!signature || !webhookSecret) {
    return NextResponse.json({ error: "Missing signature or webhook secret" }, { status: 400 });
  }

  let event;
  try {
    event = stripe.webhooks.constructEvent(body, signature, webhookSecret);
  } catch (err) {
    console.error("Webhook signature verification failed:", err);
    return NextResponse.json({ error: "Invalid signature" }, { status: 400 });
  }

  if (event.type === "checkout.session.completed") {
    const session = event.data.object;
    const { investorId, listingId } = session.metadata || {};

    if (investorId && listingId) {
      try {
        await unlockListing(investorId, listingId, session.id);
        console.log(`Listing ${listingId} unlocked for investor ${investorId}`);
      } catch (error) {
        console.error("Failed to unlock listing:", error);
        // Don't return error - Stripe will retry
      }
    }
  }

  return NextResponse.json({ received: true });
}

