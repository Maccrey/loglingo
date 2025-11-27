import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Loglingo",
  description: "AI-powered language learning diary",
};

import { Navigation } from "@/components/layout/Navigation";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${inter.variable} antialiased pb-16 md:pb-0 md:pt-16`}>
        <Navigation />
        <main className="min-h-screen p-4 md:p-8 max-w-screen-xl mx-auto">
          {children}
        </main>
      </body>
    </html>
  );
}
