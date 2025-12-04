import { NextResponse } from "next/server";
import { pool } from "@/lib/db";

export async function GET() {
  const checks: Record<string, "ok" | "error"> = {
    server: "ok",
    database: "error",
  };

  try {
    // Check database connection
    const client = await pool.connect();
    await client.query("SELECT 1");
    client.release();
    checks.database = "ok";
  } catch (error) {
    console.error("Health check - database error:", error);
    checks.database = "error";
  }

  const allHealthy = Object.values(checks).every((v) => v === "ok");

  return NextResponse.json(
    {
      status: allHealthy ? "healthy" : "degraded",
      timestamp: new Date().toISOString(),
      checks,
    },
    { status: allHealthy ? 200 : 503 }
  );
}

