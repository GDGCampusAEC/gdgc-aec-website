import type { Metadata } from "next";
import { Poppins } from "next/font/google";
import "./globals.css";

import { Analytics } from "@vercel/analytics/next";
import { SpeedInsights } from "@vercel/speed-insights/next";

import Navbar from "./components/Navbar";
import Footer from "./components/Footer";

const poppins = Poppins({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-poppins",
});

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL || "https://gdgcaec.in"),
  title: {
    default: "GDG On Campus AEC | Google Developer Groups Asansol Engineering College",
    template: "%s | GDG On Campus AEC",
  },
  description:
    "Official community website for Google Developer Groups on Campus at Asansol Engineering College. Learn, build, connect, and grow with technology.",
  keywords: [
    "GDG",
    "GDGC",
    "Google Developer Groups",
    "AEC",
    "Asansol Engineering College",
    "Tech Community",
    "Workshops",
    "Hackathons",
    "Open Source",
  ],
  authors: [{ name: "GDGC AEC Team" }],
  creator: "GDGC AEC",
  publisher: "GDGC AEC",
  openGraph: {
    title: "GDG On Campus AEC | Google Developer Groups",
    description:
      "Official community website for Google Developer Groups on Campus at Asansol Engineering College.",
    url: "https://gdgcaec.in",
    siteName: "GDGC On Campus AEC",
    images: [
      {
        url: "/assets/event-1.jpg",
        width: 1200,
        height: 630,
        alt: "GDG On Campus AEC Community Banner",
      },
    ],
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "GDG On Campus AEC",
    description:
      "Official community website for Google Developer Groups on Campus at Asansol Engineering College.",
    images: ["/assets/event-1.jpg"],
    creator: "@gdgc_aec",
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" className="scroll-smooth">
      <body
        className={`${poppins.variable} font-sans bg-[#FDFBF7] text-slate-800 antialiased overflow-x-hidden flex flex-col min-h-screen`}
      >
        <Analytics />
        <SpeedInsights />

        <Navbar />

        <div className="flex-grow">
          {children}
        </div>

        <Footer />
      </body>
    </html>
  );
}