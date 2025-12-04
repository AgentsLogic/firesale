import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: {
    default: "FireSaleHomes – Sell Your House Fast to Serious Cash Buyers",
    template: "%s | FireSaleHomes",
  },
  description:
    "FireSaleHomes connects motivated home sellers with vetted cash buyers and investors for fast, as-is offers.",
  keywords: [
    "sell house fast",
    "cash buyers",
    "motivated sellers",
    "real estate investors",
    "as-is home sale",
    "quick home sale",
    "off-market deals",
  ],
  authors: [{ name: "FireSaleHomes" }],
  creator: "FireSaleHomes",
  metadataBase: new URL(process.env.NEXT_PUBLIC_APP_URL || "https://firesalehomes.com"),
  openGraph: {
    type: "website",
    locale: "en_US",
    siteName: "FireSaleHomes",
    title: "FireSaleHomes – Sell Your House Fast to Serious Cash Buyers",
    description:
      "FireSaleHomes connects motivated home sellers with vetted cash buyers and investors for fast, as-is offers.",
  },
  twitter: {
    card: "summary_large_image",
    title: "FireSaleHomes – Sell Your House Fast",
    description: "Connect with serious cash buyers for fast, as-is offers.",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
    },
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="scroll-smooth">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased bg-slate-950 text-slate-50`}
      >
        {children}
      </body>
    </html>
  );
}
