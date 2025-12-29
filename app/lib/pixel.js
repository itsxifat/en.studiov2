// app/lib/pixel.js
export const trackEvent = async (eventName, data = {}, userData = {}) => {
  try {
    // 1. Generate unique Event ID for deduplication
    const eventId = crypto.randomUUID();

    // 2. Fire Browser Pixel (if available)
    if (typeof window !== "undefined" && window.fbq) {
      window.fbq('track', eventName, data, { eventID: eventId });
    }

    // 3. Fire Server-Side API (CAPI)
    // We send the data to our own backend, which forwards it to Facebook
    await fetch('/api/track', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        eventName, // e.g., 'Lead', 'ViewContent'
        eventId,   // The ID linking browser & server events
        path: window.location.pathname,
        referrer: document.referrer,
        search: window.location.search,
        customData: data, // Event specifics (price, name, etc.)
        userData: userData // Customer info (email, phone - will be hashed on server)
      }),
    });
  } catch (error) {
    console.error(`Failed to track ${eventName}:`, error);
  }
};