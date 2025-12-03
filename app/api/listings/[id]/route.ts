import { NextRequest, NextResponse } from "next/server";
import { getFullListing, isListingExclusivelyLocked, getListingUnlock } from "@/lib/lead-store";
import { getAuthenticatedInvestorId } from "@/lib/auth";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const investorId = await getAuthenticatedInvestorId();

    const listing = await getFullListing(id);
    if (!listing) {
      return NextResponse.json({ error: "Listing not found" }, { status: 404 });
    }

    // Check exclusive lock status
    const lockStatus = await isListingExclusivelyLocked(id);
    
    // Check if current investor has unlocked this listing
    let isUnlocked = false;
    let exclusiveUntil: string | undefined;
    
    if (investorId) {
      const unlock = await getListingUnlock(investorId, id);
      if (unlock) {
        isUnlocked = true;
        exclusiveUntil = unlock.exclusiveUntil;
      }
    }

    // Build response based on unlock status
    const response: Record<string, unknown> = {
      id: listing.id,
      createdAt: listing.createdAt,
      propertyAddress: listing.propertyAddress,
      timeline: listing.timeline,
      condition: listing.condition,
      reason: listing.reason,
      isUnlocked,
      isExclusivelyLocked: lockStatus.locked && lockStatus.unlockerId !== investorId,
    };

    // Only include contact info if unlocked
    if (isUnlocked) {
      response.name = listing.name;
      response.contact = listing.contact;
      response.exclusiveUntil = exclusiveUntil;
    }

    return NextResponse.json({ listing: response });
  } catch (error) {
    console.error("Failed to fetch listing:", error);
    return NextResponse.json(
      { error: "Failed to fetch listing" },
      { status: 500 }
    );
  }
}

