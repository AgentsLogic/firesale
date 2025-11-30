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


