import type { Metadata } from "next";
import { Inter, Sora } from "next/font/google";
import "./globals.css";
import { Toaster } from "@/components/ui/sonner";
import { Analytics } from "@vercel/analytics/react";
import Script from "next/script";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  display: "swap",
});

const sora = Sora({
  variable: "--font-sora",
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "Stryvos — Gym Management for Small Gyms (Check-ins, Classes, Payments)",
  description: "Stryvos helps sub-200 member gyms run like elite clubs with modern check-ins, class scheduling, payments, and member messaging—all in a clean dashboard.",
  keywords: ["gym management", "fitness software", "gym check-in", "class scheduling", "gym payments", "small gym software"],
  authors: [{ name: "Stryvos" }],
  openGraph: {
    title: "Stryvos — Gym Management for Small Gyms",
    description: "Run your small gym like a big one. Modern check-ins, class scheduling, payments, and member messaging.",
    type: "website",
    locale: "en_US",
    siteName: "Stryvos",
  },
  twitter: {
    card: "summary_large_image",
    title: "Stryvos — Gym Management for Small Gyms",
    description: "Run your small gym like a big one. Modern check-ins, class scheduling, payments, and member messaging.",
  },
  robots: {
    index: true,
    follow: true,
  },
  metadataBase: process.env.NEXT_PUBLIC_BASE_URL ? new URL(process.env.NEXT_PUBLIC_BASE_URL) : undefined,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark">
      <head>
        <link rel="icon" href="/favicon.ico" />
        <link rel="apple-touch-icon" href="/apple-touch-icon.png" />
        <Script
          id="structured-data"
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "Organization",
              name: "Stryvos",
              ...(process.env.NEXT_PUBLIC_BASE_URL && {
                url: process.env.NEXT_PUBLIC_BASE_URL,
                logo: `${process.env.NEXT_PUBLIC_BASE_URL}/logo.png`,
              }),
              description: "Gym management software for small gyms",
              contactPoint: {
                "@type": "ContactPoint",
                email: "info@stryvos.org",
                contactType: "Customer Service",
              },
            }),
          }}
        />
        <Script
          id="product-schema"
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "SoftwareApplication",
              name: "Stryvos",
              applicationCategory: "BusinessApplication",
              operatingSystem: "Web",
              offers: {
                "@type": "Offer",
                price: "99",
                priceCurrency: "USD",
              },
            }),
          }}
        />
      </head>
      <body
        className={`${inter.variable} ${sora.variable} font-sans antialiased`}
      >
        {children}
        <Toaster />
        <Analytics />
      </body>
    </html>
  );
}
