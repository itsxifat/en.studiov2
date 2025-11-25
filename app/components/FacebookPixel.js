// app/components/FacebookPixel.js
"use client";
import { useEffect } from "react";
import { usePathname, useSearchParams } from "next/navigation";

export default function FacebookPixel() {
  const pathname = usePathname();
  const searchParams = useSearchParams();

  useEffect(() => {
    import("react-facebook-pixel")
      .then((x) => x.default)
      .then((ReactPixel) => {
        // Initialize only once
        ReactPixel.init(process.env.NEXT_PUBLIC_FACEBOOK_PIXEL_ID); 
        
        // Standard PageView is now handled manually in AnalyticsTracker
        // to ensure we can generate a matching eventID for deduplication.
        // If you just want simple tracking without CAPI deduplication, 
        // you would call ReactPixel.pageView() here.
      });
  }, [pathname, searchParams]);

  return null;
}