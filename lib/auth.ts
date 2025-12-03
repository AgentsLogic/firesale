import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { cookies } from "next/headers";

const JWT_SECRET = process.env.JWT_SECRET || "firesale-dev-secret-change-in-production";
const COOKIE_NAME = "investor_token";

export async function hashPassword(password: string): Promise<string> {
  return bcrypt.hash(password, 12);
}

export async function verifyPassword(password: string, hash: string): Promise<boolean> {
  return bcrypt.compare(password, hash);
}

export function createToken(investorId: string): string {
  return jwt.sign({ investorId }, JWT_SECRET, { expiresIn: "7d" });
}

export function verifyToken(token: string): { investorId: string } | null {
  try {
    const decoded = jwt.verify(token, JWT_SECRET) as { investorId: string };
    return decoded;
  } catch {
    return null;
  }
}

export async function setAuthCookie(investorId: string): Promise<void> {
  const token = createToken(investorId);
  const cookieStore = await cookies();
  cookieStore.set(COOKIE_NAME, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    maxAge: 60 * 60 * 24 * 7, // 7 days
    path: "/",
  });
}

export async function getAuthenticatedInvestorId(): Promise<string | null> {
  const cookieStore = await cookies();
  const token = cookieStore.get(COOKIE_NAME)?.value;
  if (!token) return null;
  
  const decoded = verifyToken(token);
  return decoded?.investorId ?? null;
}

export async function clearAuthCookie(): Promise<void> {
  const cookieStore = await cookies();
  cookieStore.delete(COOKIE_NAME);
}

