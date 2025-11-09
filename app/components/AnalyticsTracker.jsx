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

    // Fire-and-forget the tracking request
    fetch('/api/track', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ 
        path: pathname,
        referrer: document.referrer, // Send the full referrer URL
        search: window.location.search, // Send the query string (e.g., ?utm_source=facebook)
      }),
    }).catch(err => {
      console.error("Failed to track page view:", err);
    });

  }, [pathname, searchParams]); // Re-run this effect every time the page path or query changes

  return null; // This component renders nothing
}