import { NextResponse } from 'next/server';
import dbConnect from '../../lib/dbConnect';
import Visit from '../../models/visit';

export async function POST(request) {
  try {
    const body = await request.json();
    const { path, search: clientSearch, eventId } = body; // Receive eventId

    if (!path) {
      return NextResponse.json({ success: false, error: 'Path is required.' }, { status: 400 });
    }

    // ✅ MUST await headers() in Next.js 15+
    const headersList = await request.headers;
    const forwardedFor = headersList.get('x-forwarded-for');
    const realIp = headersList.get('x-real-ip');
    const cfIp = headersList.get('cf-connecting-ip');

    // ✅ Detect IP safely
    const ip =
      forwardedFor?.split(',')[0]?.trim() ||
      realIp ||
      cfIp ||
      request.ip ||
      '127.0.0.1';

    const userAgent = headersList.get('user-agent') || 'unknown';
    const refererHeader = headersList.get('referer');
    
    // Retrieve Facebook cookies (_fbp, _fbc) for better CAPI matching
    const cookies = request.cookies;
    const fbp = cookies.get('_fbp')?.value;
    const fbc = cookies.get('_fbc')?.value;

    let referrerDomain = null;
    const websiteUrl = process.env.YOUR_WEBSITE_URL
      ? new URL(process.env.YOUR_WEBSITE_URL).hostname.replace(/^www\./, '')
      : null;

    if (refererHeader) {
      try {
        const url = new URL(refererHeader);
        const host = url.hostname.replace(/^www\./, '');
        if (!websiteUrl || !host.includes(websiteUrl)) referrerDomain = host;
      } catch {
        /* ignore invalid referrer */
      }
    }

    // ✅ Parse UTM source
    let utmSource = null;
    if (clientSearch) {
      const params = new URLSearchParams(clientSearch);
      utmSource = params.get('utm_source');
    }

    // ✅ Geo lookup
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

    // ---------------------------------------------------------
    // 🚀 FACEBOOK CONVERSIONS API (CAPI) Logic
    // ---------------------------------------------------------
    const PIXEL_ID = process.env.NEXT_PUBLIC_FACEBOOK_PIXEL_ID;
    const ACCESS_TOKEN = process.env.FACEBOOK_CAPI_ACCESS_TOKEN;

    if (PIXEL_ID && ACCESS_TOKEN && eventId) {
      const currentTimestamp = Math.floor(Date.now() / 1000);
      const eventSourceUrl = refererHeader || `https://${headersList.get('host')}${path}`;

      const fbEventData = {
        data: [
          {
            event_name: 'PageView',
            event_time: currentTimestamp,
            event_source_url: eventSourceUrl,
            event_id: eventId, // Unique ID matches the client-side event
            action_source: 'website',
            user_data: {
              client_ip_address: ip,
              client_user_agent: userAgent,
              fbp: fbp || null,
              fbc: fbc || null,
            },
          },
        ],
        // test_event_code: 'TEST12345', // Uncomment this line when testing in Events Manager "Test Events" tab
      };

      // Fire CAPI request (don't await it to keep the API fast)
      fetch(`https://graph.facebook.com/v19.0/${PIXEL_ID}/events?access_token=${ACCESS_TOKEN}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(fbEventData),
      }).catch(err => console.error('FB CAPI Error:', err));
    }
    // ---------------------------------------------------------

    // ✅ Async DB write (non-blocking)
    dbConnect()
      .then(() =>
        Visit.create({
          path,
          ip,
          userAgent,
          referrer: referrerDomain,
          source: utmSource,
          location: locationData.location,
          coordinates: locationData.coordinates,
        })
      )
      .catch((dbError) => console.error('Failed to log visit:', dbError));

    return NextResponse.json({ success: true }, { status: 202 });
  } catch (error) {
    console.error('Track API Error:', error);
    return NextResponse.json({ success: false, error: 'Bad request.' }, { status: 400 });
  }
}