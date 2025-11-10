import { NextResponse } from 'next/server';
import { headers } from 'next/headers';
import dbConnect from '../../lib/dbConnect';
import Visit from '../../models/visit';

export async function POST(request) {
  try {
    const body = await request.json();
    const { path, search: clientSearch } = body;

    if (!path) {
      return NextResponse.json({ success: false, error: 'Path is required.' }, { status: 400 });
    }

    const headersList = headers();

    // ✅ Improved IP detection (covers Vercel, Cloudflare, proxies, etc.)
    const ip =
      headersList.get('x-forwarded-for')?.split(',')[0]?.trim() ||
      headersList.get('x-real-ip') ||
      headersList.get('cf-connecting-ip') ||
      request.ip ||
      null;

    const userAgent = headersList.get('user-agent') || 'unknown';
    const refererHeader = headersList.get('referer');

    // Determine external referrer
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
        // ignore invalid referer
      }
    }

    // Parse UTM
    let utmSource = null;
    if (clientSearch) {
      const params = new URLSearchParams(clientSearch);
      utmSource = params.get('utm_source');
    }

    // ✅ Geo lookup
    let locationData = { location: 'Unknown Location', coordinates: null };

    if (ip && !ip.startsWith('127.') && !ip.startsWith('192.168') && !ip.startsWith('::1')) {
      try {
        // Use a more reliable geo API (ipapi.co sometimes fails)
        const geoResponse = await fetch(`https://ipwho.is/${ip}`);
        const data = await geoResponse.json();

        if (data.success && data.country) {
          const locationString = data.city
            ? `${data.city}, ${data.country}`
            : data.country;

          locationData = {
            location: locationString,
            coordinates: [data.longitude, data.latitude],
          };
        }
      } catch (geoError) {
        console.warn(`Geo lookup failed for ${ip}:`, geoError.message);
      }
    }

    // ✅ Save asynchronously
    dbConnect()
      .then(() =>
        Visit.create({
          path,
          ip: ip || 'unknown',
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
