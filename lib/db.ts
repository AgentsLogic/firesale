import { Pool } from "pg";

const connectionString = process.env.DATABASE_URL;

// Allow build to succeed without DATABASE_URL (will fail at runtime if not set)
const isBuildPhase = process.env.NEXT_PHASE === "phase-production-build";

if (!connectionString && !isBuildPhase) {
  throw new Error("DATABASE_URL must be set in the environment for the lead store.");
}

const shouldUseSSL =
  connectionString &&
  (process.env.NODE_ENV === "production" ||
    connectionString.includes("render.com"));

export const pool = connectionString
  ? new Pool({
      connectionString,
      ssl: shouldUseSSL ? { rejectUnauthorized: false } : undefined,
    })
  : (null as unknown as Pool); // Type assertion for build phase

