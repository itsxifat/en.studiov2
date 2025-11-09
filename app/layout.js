import React from "react";
import { Bai_Jamjuree } from "next/font/google";
import "./globals.css";
// import { Analytics } from "@vercel/analytics/next"; // 1. REMOVED
import { AnalyticsTracker } from "../components/AnalyticsTracker"; // ✨ 2. Import your tracker

// Setup the font
const baiJamjuree = Bai_Jamjuree({
  subsets: ["latin"],
  weight: ["400", "500", "700"],
  variable: "--font-bai-jamjuree",
});

// --- SEO Metadata (Same as before) ---
export const metadata = {
  title: {
    default: "Enfinito Studio - Professional Video & Photo Production",
    template: "%s | Enfinito Studio",
  },
  description: "Experience powerful storytelling with Enfinito Studio, a professional production house in Dhaka, Bangladesh. We specialize in high-end video, photography, TVCs, OVCs, and dynamic content.",
  verification: {
    google: "rsuFwQK8yCQ5s2MUD_SHYGYhe2Mv-T6D6bWAHnWZeUM",
  },
  icons: {
    icon: "/favicon.ico",
  },
  keywords: [
    "Enfinito Studio", "Video Production Dhaka", "Photography Studio Dhaka", 
    "Professional Videography Bangladesh", "TVC Production Agency", "OVC Production Company",
    "Dynamic Content Reels", "Product Photography Service", "Brand Videography",
    "Commercial Shoots Bangladesh", "Enfinito",
  ],
  robots: { index: true, follow: true },
  metadataBase: new URL("https://en-studio.enfinito.com"), 
  openGraph: {
    title: "Enfinito Studio - Professional Video & Photo Production",
    description: "Specializing in high-end videography, photography, TVCs, and OVCs.",
    url: "https://en-studio.enfinito.com",
    siteName: "Enfinito Studio",
    images: [
      {
        url: "https://res.cloudinary.com/dagmsvwui/image/upload/v1762236962/Post_01_1_ze4atm.png", 
        width: 1200,
        height: 630,
        alt: "Enfinito Studio - Powerful Storytelling, Stunning Visuals",
      },
    ],
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Enfinito Studio - Professional Video & Photo Production",
    description: "High-end videography, photography, TVCs, and OVCs in Dhaka.",
    images: ["https://res.cloudinary.com/dagmsvwui/image/upload/v1762236962/Post_01_1_ze4atm.png"],
  },
};
// --- End of Metadata ---


export default function RootLayout({ children }) {
  return (
    <html lang="en" className={`${baiJamjuree.variable} no-scrollbar`}>
      <body className={`font-sans antialiased bg-black text-white`}>
        {children}
        {/* <Analytics /> REMOVED */}
        <AnalyticsTracker /> {/* ✨ 3. Add your tracker here */}
      </body>
    </html>
  );
}