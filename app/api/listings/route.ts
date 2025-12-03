import { NextResponse } from "next/server";
import { getPublicListings } from "@/lib/lead-store";

export async function GET() {
  try {
    const listings = await getPublicListings();
    return NextResponse.json({ listings });
  } catch (error) {
    console.error("Failed to fetch listings:", error);
    return NextResponse.json(
      { error: "Failed to fetch listings" },
      { status: 500 }
    );
  }
}

