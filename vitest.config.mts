import fs from "node:fs";
import path from "node:path";

import { defineConfig } from "vitest/config";

const rootDir = __dirname;

function loadEnvLocal() {
  const envPath = path.join(rootDir, ".env.local");
  if (!fs.existsSync(envPath)) return;

  const raw = fs.readFileSync(envPath, "utf8");
  for (const line of raw.split("\n")) {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith("#")) continue;
    const eq = trimmed.indexOf("=");
    if (eq === -1) continue;
    const key = trimmed.slice(0, eq).trim();
    const value = trimmed.slice(eq + 1).trim();
    if (!key) continue;
    if (process.env[key] === undefined) {
      process.env[key] = value;
    }
  }
}

loadEnvLocal();

export default defineConfig({
  resolve: {
    alias: {
      "@": path.resolve(rootDir, "."),
    },
  },
  test: {
    environment: "node",
    include: ["tests/**/*.test.ts"],
    globals: true,
    testTimeout: 20000,
  },
});

