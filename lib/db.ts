import { Pool } from "pg";

const connectionString = process.env.DATABASE_URL;

if (!connectionString) {
  throw new Error("DATABASE_URL must be set in the environment for the lead store.");
}

const shouldUseSSL =
  process.env.NODE_ENV === "production" ||
  connectionString.includes("render.com");

export const pool = new Pool({
  connectionString,
  ssl: shouldUseSSL ? { rejectUnauthorized: false } : undefined,
});

