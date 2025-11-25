import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { saveSellerLead } from "@/lib/lead-store";

export const sellerSchema = z.object({
  propertyAddress: z.string().min(5),
  timeline: z.string().min(1),
  condition: z.string().min(1),
  reason: z.string().min(1),
  name: z.string().min(1),
  contact: z.string().min(3),
});

export async function POST(request: NextRequest) {
  let json: unknown;

  try {
    json = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON payload" }, { status: 400 });
  }

  const parsed = sellerSchema.safeParse(json);

  if (!parsed.success) {
    return NextResponse.json(
      { error: "Invalid data", details: parsed.error.flatten() },
      { status: 400 },
    );
  }

  try {
    const saved = await saveSellerLead(parsed.data);

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

