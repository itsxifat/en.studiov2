// app/api/track/route.js
import { NextResponse } from 'next/server';
import dbConnect from '../../lib/dbConnect';
import Visit from '../../models/visit';
import crypto from 'crypto';

// Helper to hash data for Facebook (SHA-256)
const hash = (str) => {
  if (!str) return undefined;
  return crypto.createHash('sha256').update(str.trim().toLowerCase()).digest('hex');
};

export async function POST(request) {
  try {
    const body = await request.json();
    
    const { 
      eventName = 'PageView', 
      eventId, 
      path, 
      customData = {}, 
      userData: clientUserData = {} 
    } = body;

    if (!path) return NextResponse.json({ success: false, error: 'Path is required' }, { status: 400 });

    // --- 1. Extract Request Info ---
    const headersList = await request.headers;
    const forwardedFor = headersList.get('x-forwarded-for');
    const realIp = headersList.get('x-real-ip');
    const cfIp = headersList.get('cf-connecting-ip');
    
    const ip = forwardedFor?.split(',')[0]?.trim() || realIp || cfIp || '127.0.0.1';
    const userAgent = headersList.get('user-agent') || 'unknown';
    const refererHeader = headersList.get('referer') || '';
    
    // Extract FB Cookies for better matching
    const cookies = request.cookies;
    const fbp = cookies.get('_fbp')?.value;
    const fbc = cookies.get('_fbc')?.value;

    // --- 2. FACEBOOK CAPI LOGIC ---
    const PIXEL_ID = process.env.NEXT_PUBLIC_FACEBOOK_PIXEL_ID;
    const ACCESS_TOKEN = process.env.FACEBOOK_CAPI_ACCESS_TOKEN;

    if (PIXEL_ID && ACCESS_TOKEN && eventId) {
      // Prepare User Data (Hash sensitive info like email/phone)
      const userData = {
        client_ip_address: ip,
        client_user_agent: userAgent,
        fbp: fbp || null,
        fbc: fbc || null,
        em: clientUserData.email ? hash(clientUserData.email) : undefined,
        ph: clientUserData.phone ? hash(clientUserData.phone) : undefined,
        fn: clientUserData.firstName ? hash(clientUserData.firstName) : undefined,
      };

      const fbEventData = {
        data: [
          {
            event_name: eventName,
            event_time: Math.floor(Date.now() / 1000),
            event_source_url: `https://${headersList.get('host')}${path}`,
            event_id: eventId, // Critical for deduplication
            action_source: 'website',
            user_data: userData,
            custom_data: customData, 
          },
        ],
        // test_event_code: 'TEST12345', // Uncomment for testing in Events Manager
      };

      // Fire to Facebook Graph API
      fetch(`https://graph.facebook.com/v19.0/${PIXEL_ID}/events?access_token=${ACCESS_TOKEN}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(fbEventData),
      }).catch(err => console.error('FB CAPI Error:', err));
    }

    // --- 3. INTERNAL DATABASE LOGGING (PageViews Only) ---
    // We preserve your existing analytics logic here
    if (eventName === 'PageView') {
        // Determine referrer domain logic
        let referrerDomain = null;
        const websiteUrl = process.env.YOUR_WEBSITE_URL
          ? new URL(process.env.YOUR_WEBSITE_URL).hostname.replace(/^www\./, '')
          : null;

        if (refererHeader) {
          try {
            const url = new URL(refererHeader);
            const host = url.hostname.replace(/^www\./, '');
            if (!websiteUrl || !host.includes(websiteUrl)) referrerDomain = host;
          } catch {}
        }

        // UTM Parsing
        let utmSource = null;
        if (body.search) {
          const params = new URLSearchParams(body.search);
          utmSource = params.get('utm_source');
        }

        // Geo Lookup
        let locationData = { location: 'Unknown Location', coordinates: null };
        if (!ip.startsWith('127.') && !ip.startsWith('192.168') && !ip.startsWith('::1')) {
          try {
            const geoRes = await fetch(`https://ipwho.is/${ip}`);
            const data = await geoRes.json();
            if (data.success && data.country) {
              locationData = {
                location: data.city ? `${data.city}, ${data.country}` : data.country,
                coordinates: [data.longitude, data.latitude],
              };
            }
          } catch (err) {
            console.warn('Geo lookup failed:', err.message);
          }
        }

        // Async DB Write
        dbConnect().then(() =>
            Visit.create({
            path,
            ip,
            userAgent,
            referrer: referrerDomain,
            source: utmSource,
            location: locationData.location,
            coordinates: locationData.coordinates,
            })
        ).catch((dbError) => console.error('Failed to log visit:', dbError));
    }

    return NextResponse.json({ success: true }, { status: 202 });
  } catch (error) {
    console.error('Track API Error:', error);
    return NextResponse.json({ success: false, error: 'Bad request' }, { status: 400 });
  }
}