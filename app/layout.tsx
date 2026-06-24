import type { Metadata } from "next";
import { Space_Grotesk, Inter } from "next/font/google";
import { ClientEffects } from "@/components/ui/client-effects";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-sans",
});

const spaceGrotesk = Space_Grotesk({
  subsets: ["latin"],
  variable: "--font-mono",
});

export const metadata: Metadata = {
  title: "CaseWatch — Court Intelligence Platform",
  description: "High-performance legal registry telemetry and search system parsing CRN indexes in real-time.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark scroll-smooth">
      <head>
        <meta charSet="UTF-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
      </head>
      <body className={`${inter.variable} ${spaceGrotesk.variable} antialiased bg-black text-white`}>
        {/* Load loader and cursor effect elements */}
        <ClientEffects />
        {children}
      </body>
    </html>
  );
}
