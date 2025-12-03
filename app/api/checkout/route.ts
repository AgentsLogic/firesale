import { NextRequest, NextResponse } from "next/server";
import { stripe, UNLOCK_PRICE_CENTS } from "@/lib/stripe";
import { getAuthenticatedInvestorId } from "@/lib/auth";
import { getFullListing, isListingExclusivelyLocked, getListingUnlock } from "@/lib/lead-store";

export async function POST(request: NextRequest) {
  try {
    const investorId = await getAuthenticatedInvestorId();
    if (!investorId) {
      return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
    }

    if (!stripe) {
      return NextResponse.json(
        { error: "Payment system not configured. Please contact support." },
        { status: 500 }
      );
    }

    const body = await request.json();
    const { listingId } = body;

    if (!listingId) {
      return NextResponse.json({ error: "Listing ID required" }, { status: 400 });
    }

    // Check if listing exists
    const listing = await getFullListing(listingId);
    if (!listing) {
      return NextResponse.json({ error: "Listing not found" }, { status: 404 });
    }

    // Check if investor already unlocked this
    const existingUnlock = await getListingUnlock(investorId, listingId);
    if (existingUnlock) {
      return NextResponse.json({ error: "You have already unlocked this listing" }, { status: 400 });
    }

    // Check if listing is exclusively locked by someone else
    const lockStatus = await isListingExclusivelyLocked(listingId);
    if (lockStatus.locked && lockStatus.unlockerId !== investorId) {
      return NextResponse.json(
        { error: "This listing is currently under exclusive review by another investor" },
        { status: 400 }
      );
    }

    // Create Stripe Checkout session
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      line_items: [
        {
          price_data: {
            currency: "usd",
            product_data: {
              name: "Motivated Seller Lead - 48hr Exclusive Access",
              description: `Property: ${listing.propertyAddress}`,
            },
            unit_amount: UNLOCK_PRICE_CENTS,
          },
          quantity: 1,
        },
      ],
      mode: "payment",
      success_url: `${request.nextUrl.origin}/listings/${listingId}?success=true`,
      cancel_url: `${request.nextUrl.origin}/listings/${listingId}?canceled=true`,
      metadata: {
        investorId,
        listingId,
      },
    });

    return NextResponse.json({ url: session.url });
  } catch (error) {
    console.error("Checkout error:", error);
    return NextResponse.json({ error: "Failed to create checkout session" }, { status: 500 });
  }
}

