import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const GOOGLE_ADS_ID = "AW-16982541933";
const ADSENSE_CLIENT = "ca-pub-9128371394963939";
const GA_MEASUREMENT_ID =
  process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID ||
  process.env.NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID;
const GTAG_PRIMARY_ID = GA_MEASUREMENT_ID || GOOGLE_ADS_ID;

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
        <meta name="google-adsense-account" content={ADSENSE_CLIENT} />
      </head>
      <body className={`${inter.variable} antialiased pb-16 md:pb-0 md:pt-16`}>
        <Script
          async
          src={`https://pagead2.googlesyndication.com/pagead/js?client=${ADSENSE_CLIENT}`}
          strategy="afterInteractive"
        />
        <Script
          async
          src={`https://www.googletagmanager.com/gtag/js?id=${GTAG_PRIMARY_ID}`}
          strategy="afterInteractive"
        />
        <Script id="gtag-init" strategy="afterInteractive">
          {`
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', '${GOOGLE_ADS_ID}');
            ${GA_MEASUREMENT_ID ? `gtag('config', '${GA_MEASUREMENT_ID}', { send_page_view: false, language: 'ko' });` : ""}
          `}
        </Script>
        {children}
      </body>
    </html>
  );
}
