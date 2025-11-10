import { NextResponse } from 'next/server';
import dbConnect from '../../lib/dbConnect';
import Visit from '../../models/visit';

export async function POST(request) {
  try {
    const body = await request.json();
    const { path, search: clientSearch } = body;

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
