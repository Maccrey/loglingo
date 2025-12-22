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
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL || 'https://logling-34fc9.web.app'),
  icons: {
    icon: [
      { url: '/icon-512.png', sizes: '512x512', type: 'image/png' },
    ],
    apple: [
      { url: '/icon-512.png', sizes: '512x512', type: 'image/png' },
    ],
  },
  openGraph: {
    title: "Loglingo",
    description: "AI-powered language learning diary",
    images: ['/icon-512.png'],
  },
};

import Script from "next/script"; // Import Script component

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <Script
          async
          src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-9128371394963939"
          crossOrigin="anonymous"
          strategy="beforeInteractive"
        />
        <Script
          async
          src="https://www.googletagmanager.com/gtag/js?id=AW-16982541933"
          strategy="beforeInteractive"
        />
        <Script id="gtag-init" strategy="beforeInteractive">
          {`
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', 'AW-16982541933');
          `}
        </Script>
      </head>
      <body className={`${inter.variable} antialiased pb-16 md:pb-0 md:pt-16`}>
        {children}
      </body>
    </html>
  );
}
