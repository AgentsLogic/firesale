import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { saveInvestorLead } from "@/lib/lead-store";

export const investorSchema = z.object({
  name: z.string().min(1),
  email: z.string().email(),
  metros: z.string().min(1),
  buyBox: z.string().min(1),
});

export async function POST(request: NextRequest) {
  let json: unknown;

  try {
    json = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON payload" }, { status: 400 });
  }

  const parsed = investorSchema.safeParse(json);

  if (!parsed.success) {
    return NextResponse.json(
      { error: "Invalid data", details: parsed.error.flatten() },
      { status: 400 },
    );
  }

  try {
    const saved = await saveInvestorLead(parsed.data);

    return NextResponse.json(
      {
        success: true,
        id: saved.id,
      },
      { status: 201 },
    );
  } catch (error) {
    console.error("Error saving investor lead", error);
    return NextResponse.json({ error: "Failed to save lead" }, { status: 500 });
  }
}

