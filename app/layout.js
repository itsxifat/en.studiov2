import React from "react";
import { Bai_Jamjuree } from "next/font/google";
import "./globals.css";

// Setup the font
const baiJamjuree = Bai_Jamjuree({
  subsets: ["latin"],
  weight: ["400", "500", "700"],
  variable: "--font-bai-jamjuree", // Use CSS variable
});

// --- ✨ SEO Metadata Updated ---
export const metadata = {
  // Title (remains excellent)
  title: {
    default: "Enfinito Studio - Professional Video & Photo Production",
    template: "%s | Enfinito Studio",
  },
  
  // ✨ New SEO Description
  description: "Experience powerful storytelling with Enfinito Studio, a professional production house in Dhaka, Bangladesh. We specialize in high-end video, photography, TVCs, OVCs, and dynamic content.",

  // ✨ Google Search Console Verification
  verification: {
    google: "rsuFwQK8yCQ5s2MUD_SHYGYhe2Mv-T6D6bWAHnWZeUM",
  },
  
  // ✨ New SEO Keywords
  keywords: [
    "Enfinito Studio",
    "Video Production Dhaka",
    "Photography Studio Dhaka",
    "Professional Videography Bangladesh",
    "TVC Production Agency",
    "OVC Production Company",
    "Dynamic Content Reels",
    "Product Photography Service",
    "Brand Videography",
    "Commercial Shoots Bangladesh",
    "Enfinito",
  ],
  
  // ✨ Simplified Icons (using only favicon.ico)
  icons: {
    icon: "/favicon.ico",
  },

  robots: {
    index: true,
    follow: true,
  },
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
        alt: "Enfinito Studio - Powerful Storytelling, Stunning Visuals", // Added alt text
      },
    ],
    locale: "en_US",
    type: "website",
  },
  
  // ✨ Added Twitter Card for better sharing on X
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
    // Pass the font variable to the <html> tag
    <html lang="en" className={`${baiJamjuree.variable} no-scrollbar`}>
      {/* - Use `font-sans` to apply the font-family defined by the variable
        - `antialiased` makes the font look smoother
        - `bg-black text-white` sets the default site theme
      */}
      <body className={`font-sans antialiased bg-black text-white`}>
        {children}
      </body>
    </html>
  );
}