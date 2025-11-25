import { describe, it, expect } from "vitest";

import { sellerSchema } from "../app/api/seller/route";
import { investorSchema } from "../app/api/investor/route";

describe("seller API validation", () => {
  it("accepts a valid seller payload", () => {
    const payload = {
      propertyAddress: "123 Main St, Phoenix AZ",
      timeline: "0-30 days",
      condition: "rough",
      reason: "Relocating quickly",
      name: "Jane Seller",
      contact: "555-123-4567",
    };

    const parsed = sellerSchema.parse(payload);
    expect(parsed.propertyAddress).toBe(payload.propertyAddress);
  });

  it("rejects an invalid seller payload", () => {
    const payload = {
      propertyAddress: "x", // too short
      timeline: "",
      condition: "",
      reason: "",
      name: "",
      contact: "x",
    };

    expect(() => sellerSchema.parse(payload)).toThrowError();
  });
});

describe("investor API validation", () => {
  it("accepts a valid investor payload", () => {
    const payload = {
      name: "Jane Investor",
      email: "investor@example.com",
      metros: "Phoenix, AZ",
      buyBox: "SFR under $400k",
    };

    const parsed = investorSchema.parse(payload);
    expect(parsed.email).toBe(payload.email);
  });

  it("rejects an invalid investor payload", () => {
    const payload = {
      name: "",
      email: "not-an-email",
      metros: "",
      buyBox: "",
    };

    expect(() => investorSchema.parse(payload)).toThrowError();
  });
});

