import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
// Remove duplicate import since it's already imported in Map component
// import "leaflet/dist/leaflet.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

// Default metadata (will be overridden by page-specific metadata)
export const metadata: Metadata = {
  title: {
    template: "%s | EduMap Medan",
    default: "EduMap Medan - Pemetaan Sekolah",
  },
  description: "Informasi dan pemetaan sekolah di Kota Medan secara interaktif",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      {" "}
      <head>
        {/* Essential mobile viewport and PWA meta tags */}
        <meta
          name="viewport"
          content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no"
        />
        <meta name="theme-color" content="#4f46e5" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta
          name="apple-mobile-web-app-status-bar-style"
          content="black-translucent"
        />
        <meta name="apple-mobile-web-app-title" content="EduMap Medan" />
        <meta name="mobile-web-app-capable" content="yes" />{" "}
        {/* Touch icons for better mobile experience */}
        <link
          rel="apple-touch-icon"
          sizes="180x180"
          href="/apple-touch-icon.png"
        />
        <link rel="mask-icon" href="/safari-pinned-tab.svg" color="#4f46e5" />
        {/* Favicon support for all platforms */}
        <link rel="icon" href="/favicon.svg" sizes="any" />
        <link
          rel="icon"
          type="image/png"
          sizes="32x32"
          href="/favicon-32x32.png"
        />
        <link
          rel="icon"
          type="image/png"
          sizes="16x16"
          href="/favicon-16x16.png"
        />
        <link rel="manifest" href="/site.webmanifest" />
        <link
          rel="stylesheet"
          href="https://unpkg.com/leaflet@1.9.4/dist/leaflet.css"
          integrity="sha256-p4NxAoJBhIIN+hmNHrzRCf9tD/miZyoHS5obTRR9BMY="
          crossOrigin=""
        />
        {/* Add the Leaflet Routing Machine CSS */}
        <link
          rel="stylesheet"
          href="https://unpkg.com/leaflet-routing-machine@3.2.12/dist/leaflet-routing-machine.css"
          crossOrigin=""
        />
        {/* Google Font from the original landing page */}
        <link
          href="https://fonts.googleapis.com/css2?family=Outfit:wght@400;700&display=swap"
          rel="stylesheet"
        />
        {/* Typed.js for hero section text animation */}
        <script
          src="https://cdn.jsdelivr.net/npm/typed.js@2.0.12"
          async
        ></script>
        {/* AOS library for scroll animations */}
        <script src="https://unpkg.com/aos@2.3.1/dist/aos.js" async></script>
      </head>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased min-h-screen`}
      >
        {children}
      </body>
    </html>
  );
}
