import "./globals.css";

import { GoogleAnalytics } from "@next/third-parties/google";
import {
  Inter as FontSans,
  JetBrains_Mono as FontMono,
  Space_Grotesk as FontHeading,
} from "next/font/google";

import { Analytics } from "@/components/common/analytics";
import { ThemeProvider } from "@/components/common/theme-provider";
import { Toaster } from "@/components/ui/toaster";
import { siteConfig } from "@/config/site";
import { cn } from "@/lib/utils";
import { ModalProvider } from "@/providers/modal-provider";

const fontSans = FontSans({
  subsets: ["latin"],
  variable: "--font-sans",
});

const fontHeading = FontHeading({
  subsets: ["latin"],
  weight: ["500", "600", "700"],
  variable: "--font-heading",
});

const fontMono = FontMono({
  subsets: ["latin"],
  weight: ["400", "500"],
  variable: "--font-mono",
});

interface RootLayoutProps {
  children: React.ReactNode;
}

export const metadata = {
  metadataBase: new URL(siteConfig.url),
  title: {
    default: siteConfig.name,
    template: `%s | ${siteConfig.authorName}`,
  },
  description: siteConfig.description,
  keywords: siteConfig.keywords,
  authors: [
    {
      name: siteConfig.authorName,
      url: siteConfig.url,
    },
  ],
  creator: siteConfig.username,
  openGraph: {
    type: "website",
    locale: "en_US",
    url: siteConfig.url,
    title: siteConfig.name,
    description: siteConfig.description,
    siteName: siteConfig.name,
    images: [
      {
        url: siteConfig.ogImage,
        width: 1200,
        height: 630,
        alt: siteConfig.name,
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: siteConfig.name,
    description: siteConfig.description,
    images: [
      {
        url: siteConfig.ogImage,
        width: 1200,
        height: 630,
        alt: siteConfig.name,
      },
    ],
    creator: `@${siteConfig.username}`,
  },
  icons: {
    icon: [
      { url: "/favicon.ico", sizes: "any" },
      { url: "/icon-192.png", sizes: "192x192", type: "image/png" },
    ],
    shortcut: "/favicon.ico",
    apple: "/apple-touch-icon.png",
  },
  manifest: "/manifest.webmanifest",
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  verification: {
    google: process.env.NEXT_PUBLIC_GOOGLE_VERIFICATION,
  },
};

export default function RootLayout({ children }: RootLayoutProps) {
  const GA_ID = process.env.NEXT_PUBLIC_GOOGLE_MEASUREMENT_ID;
  if (!GA_ID) {
    throw new Error("Missing Google Analytics ID");
  }

  return (
    <html lang="en" suppressHydrationWarning>
      <head />
      <body
        className={cn(
          "min-h-screen bg-background font-sans antialiased",
          fontSans.variable,
          fontHeading.variable,
          fontMono.variable
        )}
      >
        <ThemeProvider attribute="class" forcedTheme="dark" defaultTheme="dark">
          {children}
          <Analytics />
          <Toaster />
          <ModalProvider />
        </ThemeProvider>
      </body>
      <GoogleAnalytics gaId={GA_ID} />
    </html>
  );
}
