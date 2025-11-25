import { describe, it, expect, afterAll } from "vitest";

import {
  getInvestorLeads,
  getSellerLeads,
  saveInvestorLead,
  saveSellerLead,
  type InvestorLeadInput,
  type SellerLeadInput,
} from "../lib/lead-store";
import { supabaseAdmin } from "../lib/supabase-admin";

const TEST_PREFIX = `vitest-${Date.now()}`;

describe("lead-store with Supabase", () => {
  it("saves and fetches a seller lead", async () => {
    const input: SellerLeadInput = {
      propertyAddress: `${TEST_PREFIX} 123 Test St`,
      timeline: "0-30 days",
      condition: "rough",
      reason: `${TEST_PREFIX}-reason`,
      name: "Test Seller",
      contact: "seller@example.com",
    };

    const saved = await saveSellerLead(input);

    expect(saved.id).toBeDefined();
    expect(saved.propertyAddress).toBe(input.propertyAddress);

    const all = await getSellerLeads();
    const found = all.find((lead) => lead.id === saved.id);
    expect(found).toBeDefined();
    expect(found?.reason).toBe(input.reason);
  });

  it("saves and fetches an investor lead", async () => {
    const input: InvestorLeadInput = {
      name: "Test Investor",
      email: `${TEST_PREFIX}-investor@example.com`,
      metros: "Phoenix, AZ",
      buyBox: "SFR under $400k",
    };

    const saved = await saveInvestorLead(input);

    expect(saved.id).toBeDefined();
    expect(saved.email).toBe(input.email);

    const all = await getInvestorLeads();
    const found = all.find((lead) => lead.id === saved.id);
    expect(found).toBeDefined();
    expect(found?.metros).toBe(input.metros);
  });

  afterAll(async () => {
    // Clean up any test rows so the admin dashboard stays clean.
    await supabaseAdmin.from("seller_leads").delete().like("reason", `${TEST_PREFIX}%`);
    await supabaseAdmin.from("investor_leads").delete().like("email", `${TEST_PREFIX}%`);
  });
});

