import { supabaseAdmin } from "./supabase-admin";

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
  const { data, error } = await supabaseAdmin
    .from("seller_leads")
    .insert({
      property_address: input.propertyAddress,
      timeline: input.timeline,
      condition: input.condition,
      reason: input.reason,
      name: input.name,
      contact: input.contact,
    })
    .select()
    .single();

  if (error || !data) {
    throw new Error(`Failed to insert seller lead: ${error?.message ?? "Unknown error"}`);
  }

  return mapSellerRow(data as SellerLeadsRow);
}

export async function saveInvestorLead(input: InvestorLeadInput): Promise<InvestorLead> {
  const { data, error } = await supabaseAdmin
    .from("investor_leads")
    .insert({
      name: input.name,
      email: input.email,
      metros: input.metros,
      buy_box: input.buyBox,
    })
    .select()
    .single();

  if (error || !data) {
    throw new Error(`Failed to insert investor lead: ${error?.message ?? "Unknown error"}`);
  }

  return mapInvestorRow(data as InvestorLeadsRow);
}

export async function getSellerLeads(): Promise<SellerLead[]> {
  const { data, error } = await supabaseAdmin
    .from("seller_leads")
    .select("*")
    .order("created_at", { ascending: true });

  if (error) {
    throw new Error(`Failed to fetch seller leads: ${error.message}`);
  }

  if (!data) return [];

  return (data as SellerLeadsRow[]).map(mapSellerRow);
}

export async function getInvestorLeads(): Promise<InvestorLead[]> {
  const { data, error } = await supabaseAdmin
    .from("investor_leads")
    .select("*")
    .order("created_at", { ascending: true });

  if (error) {
    throw new Error(`Failed to fetch investor leads: ${error.message}`);
  }

  if (!data) return [];

  return (data as InvestorLeadsRow[]).map(mapInvestorRow);
}


