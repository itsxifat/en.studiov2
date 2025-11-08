"use client";
import { useEffect } from 'react';
import { usePathname } from 'next/navigation';

export function AnalyticsTracker() {
  const pathname = usePathname();

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
      body: JSON.stringify({ path: pathname }),
    }).catch(err => {
      // We don't want to bother the user if analytics fails
      console.error("Failed to track page view:", err);
    });

  }, [pathname]); // Re-run this effect every time the page path changes

  return null; // This component renders nothing
}