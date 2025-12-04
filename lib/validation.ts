import { z } from "zod";

// Common patterns
const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const phoneRegex = /^[\d\s\-\+\(\)\.]+$/;

// Sanitize string - remove potential XSS
export function sanitizeString(input: string): string {
  return input
    .replace(/[<>]/g, "") // Remove angle brackets
    .trim();
}

// Email validation
export const emailSchema = z
  .string()
  .min(1, "Email is required")
  .max(254, "Email too long")
  .regex(emailRegex, "Invalid email format")
  .transform((v) => v.toLowerCase().trim());

// Password validation
export const passwordSchema = z
  .string()
  .min(8, "Password must be at least 8 characters")
  .max(128, "Password too long");

// Name validation
export const nameSchema = z
  .string()
  .min(1, "Name is required")
  .max(100, "Name too long")
  .transform(sanitizeString);

// Phone validation (optional)
export const phoneSchema = z
  .string()
  .max(30, "Phone number too long")
  .regex(phoneRegex, "Invalid phone format")
  .optional()
  .or(z.literal(""));

// Company validation (optional)
export const companySchema = z
  .string()
  .max(200, "Company name too long")
  .transform(sanitizeString)
  .optional()
  .or(z.literal(""));

// Address validation
export const addressSchema = z
  .string()
  .min(5, "Please enter a complete address")
  .max(500, "Address too long")
  .transform(sanitizeString);

// Investor signup schema
export const investorSignupSchema = z.object({
  email: emailSchema,
  password: passwordSchema,
  name: nameSchema,
  company: companySchema,
  phone: phoneSchema,
});

// Investor login schema
export const investorLoginSchema = z.object({
  email: emailSchema,
  password: z.string().min(1, "Password is required"),
});

// Password reset request schema
export const forgotPasswordSchema = z.object({
  email: emailSchema,
});

// Password reset schema
export const resetPasswordSchema = z.object({
  token: z.string().min(1, "Token is required"),
  password: passwordSchema,
});

// Seller lead schema (more comprehensive than existing)
export const sellerLeadSchema = z.object({
  propertyAddress: addressSchema,
  timeline: z.string().min(1, "Timeline is required").max(50),
  condition: z.string().min(1, "Condition is required").max(50),
  reason: z.string().min(1, "Reason is required").max(100),
  name: nameSchema,
  contact: z
    .string()
    .min(3, "Contact info is required")
    .max(254, "Contact info too long")
    .transform(sanitizeString),
});

// Helper to format Zod errors
export function formatZodError(error: z.ZodError): string {
  const issues = error.issues || [];
  const messages = issues.map((e) => e.message);
  return messages[0] || "Invalid input";
}

