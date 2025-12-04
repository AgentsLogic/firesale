import { NextResponse } from "next/server";
import { getAuthenticatedInvestorId } from "@/lib/auth";
import { getInvestorById } from "@/lib/lead-store";

export async function GET() {
  try {
    const investorId = await getAuthenticatedInvestorId();
    if (!investorId) {
      return NextResponse.json({ investor: null }, { status: 401 });
    }

    const investor = await getInvestorById(investorId);
    if (!investor) {
      return NextResponse.json({ investor: null }, { status: 401 });
    }

    return NextResponse.json({
      investor: {
        id: investor.id,
        email: investor.email,
        name: investor.name,
      },
    });
  } catch (error) {
    console.error("Get investor error:", error);
    return NextResponse.json({ error: "Failed to get investor" }, { status: 500 });
  }
}

