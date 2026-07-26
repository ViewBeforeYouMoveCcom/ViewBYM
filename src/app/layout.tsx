import type { Metadata } from "next";
import { Open_Sans, Montserrat } from "next/font/google";

import "./globals.css";
import Footer from "@/components/layout/Footer";
import HeaderNav from "@/components/layout/HeaderNav";
import GoogleAnalytics from "@/components/GoogleAnalytics";

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

const SITE_NAME = "View Before You Move";
const SITE_DESCRIPTION =
  "Browse Immersive VR-enabled properties with calm, trusted presentation for confident decisions.";

export const metadata: Metadata = {
  metadataBase: new URL("https://viewbeforeyoumove.com"),
  title: `${SITE_NAME} | Immersive VR-first property portal`,
  description: SITE_DESCRIPTION,
  alternates: {
    canonical: "https://viewbeforeyoumove.com",
  },
  openGraph: {
    title: SITE_NAME,
    description: SITE_DESCRIPTION,
    url: "https://viewbeforeyoumove.com",
    siteName: SITE_NAME,
    images: ["/images/vbym-logo.png"],
    locale: "en_GB",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: SITE_NAME,
    description: SITE_DESCRIPTION,
    images: ["/images/vbym-logo.png"],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${openSans.variable} ${montserrat.variable}`}>
      <body>
        <GoogleAnalytics />
        <div className="flex min-h-screen flex-col">
          <HeaderNav />
          <main className="flex-1">{children}</main>
          <Footer />
        </div>
      </body>
    </html>
  );
}
