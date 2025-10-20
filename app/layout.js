"use client";

import React from "react";
import { Bai_Jamjuree } from "next/font/google";
import "./globals.css";

const baiJamjuree = Bai_Jamjuree({
  subsets: ["latin"],
  weight: ["400", "500", "700"],
  variable: "--font-bai-jamjuree",
});

export default function RootLayout({ children }) {
  return (
    <html lang="en" className="no-scrollbar">   {/* <- here */}
      <body className={`${baiJamjuree.className}antialiased`}>
        {children}
      </body>
    </html>
  );
}
