import type { Metadata } from "next";
import { Cormorant_Garamond, DM_Sans } from "next/font/google";
import "./globals.css";

const cormorant = Cormorant_Garamond({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-heading",
  display: "swap",
});

const dmSans = DM_Sans({
  subsets: ["latin"],
  weight: ["400", "500", "700"],
  variable: "--font-body",
  display: "swap",
});

export const metadata: Metadata = {
  title: {
    default: "AAA Las Vegas — Guest Lists & Discounted Tickets",
    template: "%s | AAA Las Vegas",
  },
  description:
    "Your insider access to Las Vegas nightlife. Free guest lists and discounted tickets for LIV Las Vegas, LIV Beach, and more.",
  openGraph: {
    title: "AAA Las Vegas — Guest Lists & Discounted Tickets",
    description:
      "Your insider access to Las Vegas nightlife. Free guest lists and discounted tickets.",
    url: "https://aaalasvegas.com",
    siteName: "AAA Las Vegas",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "AAA Las Vegas",
    description: "Your insider access to Las Vegas nightlife.",
  },
  metadataBase: new URL("https://aaalasvegas.com"),
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${cormorant.variable} ${dmSans.variable} font-body antialiased bg-[#0a0a0a] text-white`}
      >
        {children}
      </body>
    </html>
  );
}
