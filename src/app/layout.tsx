import type { Metadata } from "next";
import { Open_Sans, Montserrat } from "next/font/google";

import "./globals.css";
import Footer from "@/components/layout/Footer";
import HeaderNav from "@/components/layout/HeaderNav";

const openSans = Open_Sans({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800"],
  variable: "--font-sans",
});

const montserrat = Montserrat({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800", "900"],
  variable: "--font-heading",
});

export const metadata: Metadata = {
  title: "View Before You Move | Immersive VR-first property portal",
  description:
    "Browse Immersive VR-enabled properties with calm, trusted presentation for confident decisions.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${openSans.variable} ${montserrat.variable}`}>
      <body>
        <div className="flex min-h-screen flex-col">
          <HeaderNav />
          <main className="flex-1">{children}</main>
          <Footer />
        </div>
      </body>
    </html>
  );
}
