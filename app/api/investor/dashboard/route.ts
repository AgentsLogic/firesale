import { NextResponse } from "next/server";
import { getAuthenticatedInvestorId } from "@/lib/auth";
import { getInvestorById, getInvestorUnlocks, getFullListing } from "@/lib/lead-store";

export async function GET() {
  try {
    const investorId = await getAuthenticatedInvestorId();
    if (!investorId) {
      return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
    }

    const investor = await getInvestorById(investorId);
    if (!investor) {
      return NextResponse.json({ error: "Investor not found" }, { status: 404 });
    }

    const unlocks = await getInvestorUnlocks(investorId);
    
    // Fetch full listing details for each unlock
    const unlockedListings = await Promise.all(
      unlocks.map(async (unlock) => {
        const listing = await getFullListing(unlock.listingId);
        if (!listing) return null;
        
        return {
          id: listing.id,
          propertyAddress: listing.propertyAddress,
          name: listing.name,
          contact: listing.contact,
          timeline: listing.timeline,
          condition: listing.condition,
          reason: listing.reason,
          unlockedAt: unlock.createdAt,
          exclusiveUntil: unlock.exclusiveUntil,
        };
      })
    );

    return NextResponse.json({
      investor: {
        name: investor.name,
        email: investor.email,
      },
      unlockedListings: unlockedListings.filter(Boolean),
    });
  } catch (error) {
    console.error("Dashboard error:", error);
    return NextResponse.json({ error: "Failed to load dashboard" }, { status: 500 });
  }
}

