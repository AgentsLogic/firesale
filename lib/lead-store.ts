import { pool } from "./db";

export type SellerLeadInput = {
  propertyAddress: string;
  timeline: string;
  condition: string;
  reason: string;
  name: string;
  contact: string;
};

export type InvestorLeadInput = {
  name: string;
  email: string;
  metros: string;
  buyBox: string;
};

export type SellerLead = SellerLeadInput & {
  id: string;
  createdAt: string;
};

export type InvestorLead = InvestorLeadInput & {
  id: string;
  createdAt: string;
};

type SellerLeadsRow = {
  id: number;
  created_at: string;
  property_address: string;
  timeline: string;
  condition: string;
  reason: string;
  name: string;
  contact: string;
};

type InvestorLeadsRow = {
  id: number;
  created_at: string;
  name: string;
  email: string;
  metros: string;
  buy_box: string;
};

let schemaInitPromise: Promise<void> | null = null;

async function ensureSchemaInitialized(): Promise<void> {
  if (!schemaInitPromise) {
    schemaInitPromise = (async () => {
      await pool.query(`
        CREATE TABLE IF NOT EXISTS seller_leads (
          id SERIAL PRIMARY KEY,
          created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
          property_address TEXT NOT NULL,
          timeline TEXT NOT NULL,
          condition TEXT NOT NULL,
          reason TEXT NOT NULL,
          name TEXT NOT NULL,
          contact TEXT NOT NULL
        );
      `);

      await pool.query(`
        CREATE TABLE IF NOT EXISTS investor_leads (
          id SERIAL PRIMARY KEY,
          created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
          name TEXT NOT NULL,
          email TEXT NOT NULL,
          metros TEXT NOT NULL,
          buy_box TEXT NOT NULL
        );
      `);

      // Investor accounts for the marketplace
      await pool.query(`
        CREATE TABLE IF NOT EXISTS investors (
          id SERIAL PRIMARY KEY,
          created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
          email TEXT UNIQUE NOT NULL,
          password_hash TEXT NOT NULL,
          name TEXT NOT NULL,
          company TEXT,
          phone TEXT
        );
      `);

      // Track which listings investors have unlocked
      await pool.query(`
        CREATE TABLE IF NOT EXISTS listing_unlocks (
          id SERIAL PRIMARY KEY,
          created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
          investor_id INTEGER NOT NULL REFERENCES investors(id),
          listing_id INTEGER NOT NULL REFERENCES seller_leads(id),
          exclusive_until TIMESTAMPTZ NOT NULL,
          stripe_payment_id TEXT,
          amount_cents INTEGER NOT NULL DEFAULT 100000,
          UNIQUE(investor_id, listing_id)
        );
      `);

      // Add index for faster exclusive lookup
      await pool.query(`
        CREATE INDEX IF NOT EXISTS idx_listing_unlocks_exclusive
        ON listing_unlocks(listing_id, exclusive_until DESC);
      `);

      // Password reset tokens
      await pool.query(`
        CREATE TABLE IF NOT EXISTS password_reset_tokens (
          id SERIAL PRIMARY KEY,
          created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
          email TEXT NOT NULL,
          token TEXT UNIQUE NOT NULL,
          expires_at TIMESTAMPTZ NOT NULL
        );
      `);
    })();
  }

  return schemaInitPromise;
}

function mapSellerRow(row: SellerLeadsRow): SellerLead {
  return {
    id: String(row.id),
    createdAt: row.created_at,
    propertyAddress: row.property_address,
    timeline: row.timeline,
    condition: row.condition,
    reason: row.reason,
    name: row.name,
    contact: row.contact,
  };
}

function mapInvestorRow(row: InvestorLeadsRow): InvestorLead {
  return {
    id: String(row.id),
    createdAt: row.created_at,
    name: row.name,
    email: row.email,
    metros: row.metros,
    buyBox: row.buy_box,
  };
}

export async function saveSellerLead(input: SellerLeadInput): Promise<SellerLead> {
  await ensureSchemaInitialized();

  const result = await pool.query<SellerLeadsRow>(
    `
      INSERT INTO seller_leads (property_address, timeline, condition, reason, name, contact)
      VALUES ($1, $2, $3, $4, $5, $6)
      RETURNING *
    `,
    [
      input.propertyAddress,
      input.timeline,
      input.condition,
      input.reason,
      input.name,
      input.contact,
    ],
  );

  const row = result.rows[0];

  if (!row) {
    throw new Error("Failed to insert seller lead");
  }

  return mapSellerRow(row);
}

export async function saveInvestorLead(input: InvestorLeadInput): Promise<InvestorLead> {
  await ensureSchemaInitialized();

  const result = await pool.query<InvestorLeadsRow>(
    `
      INSERT INTO investor_leads (name, email, metros, buy_box)
      VALUES ($1, $2, $3, $4)
      RETURNING *
    `,
    [input.name, input.email, input.metros, input.buyBox],
  );

  const row = result.rows[0];

  if (!row) {
    throw new Error("Failed to insert investor lead");
  }

  return mapInvestorRow(row);
}

export async function getSellerLeads(): Promise<SellerLead[]> {
  await ensureSchemaInitialized();

  const result = await pool.query<SellerLeadsRow>(
    "SELECT * FROM seller_leads ORDER BY created_at ASC",
  );

  return result.rows.map(mapSellerRow);
}

export async function getInvestorLeads(): Promise<InvestorLead[]> {
  await ensureSchemaInitialized();

  const result = await pool.query<InvestorLeadsRow>(
    "SELECT * FROM investor_leads ORDER BY created_at ASC",
  );

  return result.rows.map(mapInvestorRow);
}

// ==========================================
// INVESTOR ACCOUNTS
// ==========================================

export type InvestorAccountInput = {
  email: string;
  passwordHash: string;
  name: string;
  company?: string;
  phone?: string;
};

export type InvestorAccount = {
  id: string;
  createdAt: string;
  email: string;
  name: string;
  company?: string;
  phone?: string;
};

type InvestorRow = {
  id: number;
  created_at: string;
  email: string;
  password_hash: string;
  name: string;
  company: string | null;
  phone: string | null;
};

function mapInvestorAccountRow(row: InvestorRow): InvestorAccount {
  return {
    id: String(row.id),
    createdAt: row.created_at,
    email: row.email,
    name: row.name,
    company: row.company ?? undefined,
    phone: row.phone ?? undefined,
  };
}

export async function createInvestorAccount(input: InvestorAccountInput): Promise<InvestorAccount> {
  await ensureSchemaInitialized();

  const result = await pool.query<InvestorRow>(
    `INSERT INTO investors (email, password_hash, name, company, phone)
     VALUES ($1, $2, $3, $4, $5)
     RETURNING *`,
    [input.email, input.passwordHash, input.name, input.company ?? null, input.phone ?? null]
  );

  const row = result.rows[0];
  if (!row) throw new Error("Failed to create investor account");
  return mapInvestorAccountRow(row);
}

export async function getInvestorByEmail(email: string): Promise<(InvestorAccount & { passwordHash: string }) | null> {
  await ensureSchemaInitialized();

  const result = await pool.query<InvestorRow>(
    "SELECT * FROM investors WHERE email = $1",
    [email]
  );

  const row = result.rows[0];
  if (!row) return null;
  return { ...mapInvestorAccountRow(row), passwordHash: row.password_hash };
}

export async function getInvestorById(id: string): Promise<InvestorAccount | null> {
  await ensureSchemaInitialized();

  const result = await pool.query<InvestorRow>(
    "SELECT * FROM investors WHERE id = $1",
    [id]
  );

  const row = result.rows[0];
  if (!row) return null;
  return mapInvestorAccountRow(row);
}

// ==========================================
// LISTING UNLOCKS (48-hour exclusive access)
// ==========================================

export type ListingUnlock = {
  id: string;
  createdAt: string;
  investorId: string;
  listingId: string;
  exclusiveUntil: string;
  stripePaymentId?: string;
  amountCents: number;
};

type ListingUnlockRow = {
  id: number;
  created_at: string;
  investor_id: number;
  listing_id: number;
  exclusive_until: string;
  stripe_payment_id: string | null;
  amount_cents: number;
};

function mapUnlockRow(row: ListingUnlockRow): ListingUnlock {
  return {
    id: String(row.id),
    createdAt: row.created_at,
    investorId: String(row.investor_id),
    listingId: String(row.listing_id),
    exclusiveUntil: row.exclusive_until,
    stripePaymentId: row.stripe_payment_id ?? undefined,
    amountCents: row.amount_cents,
  };
}

export async function unlockListing(
  investorId: string,
  listingId: string,
  stripePaymentId: string
): Promise<ListingUnlock> {
  await ensureSchemaInitialized();

  // 48 hours from now
  const exclusiveUntil = new Date(Date.now() + 48 * 60 * 60 * 1000).toISOString();

  const result = await pool.query<ListingUnlockRow>(
    `INSERT INTO listing_unlocks (investor_id, listing_id, exclusive_until, stripe_payment_id, amount_cents)
     VALUES ($1, $2, $3, $4, 100000)
     RETURNING *`,
    [investorId, listingId, exclusiveUntil, stripePaymentId]
  );

  const row = result.rows[0];
  if (!row) throw new Error("Failed to unlock listing");
  return mapUnlockRow(row);
}

export async function getListingUnlock(
  investorId: string,
  listingId: string
): Promise<ListingUnlock | null> {
  await ensureSchemaInitialized();

  const result = await pool.query<ListingUnlockRow>(
    "SELECT * FROM listing_unlocks WHERE investor_id = $1 AND listing_id = $2",
    [investorId, listingId]
  );

  const row = result.rows[0];
  if (!row) return null;
  return mapUnlockRow(row);
}

export async function isListingExclusivelyLocked(listingId: string): Promise<{ locked: boolean; unlockerId?: string }> {
  await ensureSchemaInitialized();

  const result = await pool.query<ListingUnlockRow>(
    `SELECT * FROM listing_unlocks
     WHERE listing_id = $1 AND exclusive_until > NOW()
     ORDER BY created_at ASC
     LIMIT 1`,
    [listingId]
  );

  const row = result.rows[0];
  if (!row) return { locked: false };
  return { locked: true, unlockerId: String(row.investor_id) };
}

export async function getInvestorUnlocks(investorId: string): Promise<ListingUnlock[]> {
  await ensureSchemaInitialized();

  const result = await pool.query<ListingUnlockRow>(
    "SELECT * FROM listing_unlocks WHERE investor_id = $1 ORDER BY created_at DESC",
    [investorId]
  );

  return result.rows.map(mapUnlockRow);
}

// Get public listing info (no contact details)
export type PublicListing = {
  id: string;
  createdAt: string;
  propertyAddress: string; // Will be partially masked for non-unlocked
  timeline: string;
  condition: string;
  reason: string;
  isExclusivelyLocked: boolean;
};

export async function getPublicListings(): Promise<PublicListing[]> {
  await ensureSchemaInitialized();

  const result = await pool.query<SellerLeadsRow & { exclusive_until: string | null }>(
    `SELECT sl.*, lu.exclusive_until
     FROM seller_leads sl
     LEFT JOIN listing_unlocks lu ON sl.id = lu.listing_id AND lu.exclusive_until > NOW()
     ORDER BY sl.created_at DESC`
  );

  return result.rows.map(row => ({
    id: String(row.id),
    createdAt: row.created_at,
    propertyAddress: row.property_address,
    timeline: row.timeline,
    condition: row.condition,
    reason: row.reason,
    isExclusivelyLocked: row.exclusive_until !== null,
  }));
}

// Get full listing details (for unlocked investors)
export async function getFullListing(listingId: string): Promise<SellerLead | null> {
  await ensureSchemaInitialized();

  const result = await pool.query<SellerLeadsRow>(
    "SELECT * FROM seller_leads WHERE id = $1",
    [listingId]
  );

  const row = result.rows[0];
  if (!row) return null;
  return mapSellerRow(row);
}

// ==========================================
// PASSWORD RESET TOKENS
// ==========================================

export async function createPasswordResetToken(email: string): Promise<string | null> {
  await ensureSchemaInitialized();

  // Check if investor exists
  const investor = await getInvestorByEmail(email);
  if (!investor) return null;

  // Generate secure token
  const token = crypto.randomUUID() + crypto.randomUUID();
  const expiresAt = new Date(Date.now() + 60 * 60 * 1000).toISOString(); // 1 hour

  // Delete any existing tokens for this email
  await pool.query("DELETE FROM password_reset_tokens WHERE email = $1", [email]);

  // Insert new token
  await pool.query(
    `INSERT INTO password_reset_tokens (email, token, expires_at) VALUES ($1, $2, $3)`,
    [email, token, expiresAt]
  );

  return token;
}

export async function verifyPasswordResetToken(token: string): Promise<string | null> {
  await ensureSchemaInitialized();

  const result = await pool.query<{ email: string; expires_at: string }>(
    `SELECT email, expires_at FROM password_reset_tokens WHERE token = $1`,
    [token]
  );

  const row = result.rows[0];
  if (!row) return null;

  // Check if expired
  if (new Date(row.expires_at) < new Date()) {
    await pool.query("DELETE FROM password_reset_tokens WHERE token = $1", [token]);
    return null;
  }

  return row.email;
}

export async function resetPassword(token: string, newPasswordHash: string): Promise<boolean> {
  await ensureSchemaInitialized();

  const email = await verifyPasswordResetToken(token);
  if (!email) return false;

  // Update password
  await pool.query(
    "UPDATE investors SET password_hash = $1 WHERE email = $2",
    [newPasswordHash, email]
  );

  // Delete the used token
  await pool.query("DELETE FROM password_reset_tokens WHERE token = $1", [token]);

  return true;
}
