import type { Metadata } from "next";
import { Kanit } from "next/font/google";
import { Toaster } from "@/components/ui/sonner";
import "./globals.css";

const kanit = Kanit({
  variable: "--font-kanit",
  subsets: ["latin", "latin-ext", "thai"],
  weight: ["100", "200", "300", "400", "500", "600", "700", "800", "900"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "AI Discovery & Planning Generator",
  description: "Generate comprehensive project discovery and planning documents with AI - Requirements, User Personas, SWOT Analysis, MoSCoW Scope, Timeline, Budget, and Risk Assessment",
  keywords: ["AI", "project planning", "discovery", "requirements", "user personas", "SWOT", "MoSCoW", "budget estimation", "risk assessment"],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${kanit.variable} antialiased`}
      >
        {children}
        <Toaster position="bottom-right" />
      </body>
    </html>
  );
}
