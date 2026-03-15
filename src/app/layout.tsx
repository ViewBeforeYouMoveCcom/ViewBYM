import type { Metadata } from "next";
import { Inter, Space_Grotesk } from "next/font/google";
// app/layout.tsx
import { Figtree } from "next/font/google";
const figtree = Figtree({ subsets: ["latin"], variable: "--font-sans" });

import "./globals.css";
import Footer from "@/components/layout/Footer";
import HeaderNav from "@/components/layout/HeaderNav";

const inter = Inter({
  subsets: ["latin"],
  weight: ["400", "500", "600"],
  variable: "--font-body",
});

const spaceGrotesk = Space_Grotesk({
  subsets: ["latin"],
  weight: ["500", "600", "700"],
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
    <html lang="en" className={`${inter.variable} ${spaceGrotesk.variable}`}>
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
