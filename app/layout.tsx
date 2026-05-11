import type { Metadata } from "next";
import { Poppins } from "next/font/google";
import "./globals.css";


import Navbar from "./components/Navbar";
import Footer from "./components/Footer";

const poppins = Poppins({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-poppins",
});

export const metadata: Metadata = {
  title: "GDGC AEC",
  description: "Developer's Group OnCampus at Asansol Engineering College",
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" className="scroll-smooth">
      <body className={`${poppins.variable} font-sans bg-[#FDFBF7] text-slate-800 antialiased overflow-x-hidden flex flex-col min-h-screen`}>


        <Navbar />


        <div className="flex-grow">
          {children}
        </div>


        <Footer />

      </body>
    </html>
  );
}