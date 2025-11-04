import React from "react";
import { Bai_Jamjuree } from "next/font/google";
import "./globals.css";

// Setup the font
const baiJamjuree = Bai_Jamjuree({
  subsets: ["latin"],
  weight: ["400", "500", "700"],
  variable: "--font-bai-jamjuree", // Use CSS variable
});

// --- ✨ NEW: SEO Metadata ---
export const metadata = {
  // Title
  title: {
    default: "Enfinito Studio - Professional Video & Photo Production",
    template: "%s | Enfinito Studio", // For child pages
  },
  // Description (using your keywords)
  description: "Enfinito Studio is a professional production house and sister concern of Enfinito. We specialize in high-end videography, photography, TVCs, and OVCs, providing the best service for shoots with or without models.",
  // Keywords
  keywords: [
    "Enfinito Studio",
    "Enfinito",
    "Videography",
    "Photography",
    "TVC",
    "OVC",
    "Video Production",
    "Commercial Shoots",
    "Bangladesh",
    "Dhaka",
    "Professional Video",
  ],
  // Other important SEO tags
  robots: {
    index: true,
    follow: true,
  },
  // TODO: Replace with your actual website URL
  metadataBase: new URL("https://en-studio.enfinito.com"), 
  openGraph: {
    title: "Enfinito Studio - Professional Video & Photo Production",
    description: "Specializing in high-end videography, photography, TVCs, and OVCs.",
    url: "https://en-studio.enfinito.com",
    siteName: "Enfinito Studio",
    // TODO: Add a public URL to your logo for social sharing
    images: [
      {
        url: "https://res.cloudinary.com/dagmsvwui/image/upload/v1762236962/Post_01_1_ze4atm.png", 
        width: 1200,
        height: 630,
      },
    ],
    locale: "en_US",
    type: "website",
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