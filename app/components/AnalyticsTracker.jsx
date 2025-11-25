"use client";
import { useEffect } from 'react';
import { usePathname, useSearchParams } from 'next/navigation';

export function AnalyticsTracker() {
  const pathname = usePathname();
  const searchParams = useSearchParams();

  useEffect(() => {
    // Don't track admin pages, API routes, or static files
    if (pathname.startsWith('/admin') || pathname.startsWith('/_next') || pathname.startsWith('/api')) {
      return;
    }

    // 1. Generate unique Event ID for Deduplication
    const eventId = crypto.randomUUID(); 

    // 2. Track Client-Side (Browser Pixel)
    if (typeof window !== "undefined" && window.fbq) {
      // We pass eventID so Facebook can match it with the server event
      window.fbq('track', 'PageView', {}, { eventID: eventId });
    }

    // 3. Track Server-Side (Your API + CAPI)
    fetch('/api/track', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ 
        path: pathname,
        referrer: document.referrer, // Send the full referrer URL
        search: window.location.search, // Send the query string
        eventId: eventId, // Pass the unique ID to the server
      }),
    }).catch(err => {
      console.error("Failed to track page view:", err);
    });

  }, [pathname, searchParams]); // Re-run this effect every time the page path or query changes

  return null; // This component renders nothing
}