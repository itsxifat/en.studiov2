import { NextResponse, NextRequest } from 'next/server';
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
    
    // 1. Get IP, UserAgent, and Referrer
    // Use request.ip first, then fallbacks
    const ip = request.ip || headersList.get('x-forwarded-for')?.split(',')[0] || headersList.get('cf-connecting-ip') || '127.0.0.1';
    const userAgent = headersList.get('user-agent') || 'unknown';
    const refererHeader = headersList.get('referer');
    
    let referrerDomain = null;
    const websiteUrl = process.env.YOUR_WEBSITE_URL 
      ? new URL(process.env.YOUR_WEBSITE_URL).hostname 
      : null;

    if (refererHeader) {
      const url = new URL(refererHeader);
      const host = url.hostname.replace(/^www\./, '');
      
      if (websiteUrl && !host.includes(websiteUrl)) {
        referrerDomain = host;
      } else if (!websiteUrl && host) {
         referrerDomain = host;
      }
    }

    // 2. Parse UTM source
    let utmSource = null;
    if (clientSearch) {
      const params = new URLSearchParams(clientSearch);
      utmSource = params.get('utm_source');
    }

    // --- 3. THIS IS THE FIX: Perform GeoIP Lookup ---
    let locationData = {
      location: null,
      coordinates: null,
    };

    if (ip !== '127.0.0.1' && ip !== 'unknown') {
      try {
        // We use a free, fast, and simple Geo IP API
        const geoResponse = await fetch(`https://ipapi.co/${ip}/json/`);
        
        if (geoResponse.ok) {
          const data = await geoResponse.json();
          // Format: "City, Country" (e.g., "Savar, Bangladesh")
          const locationString = (data.city && data.country_name) 
            ? `${data.city}, ${data.country_name}` 
            : (data.country_name || 'Unknown Location');
          
          if (data.latitude && data.longitude) {
            locationData = {
              location: locationString,
              coordinates: [data.longitude, data.latitude], // [lng, lat]
            };
          } else {
            locationData.location = locationString; // Save location even if coords fail
          }
        }
      } catch (geoError) {
        console.warn(`GeoIP lookup failed for ${ip}:`, geoError.message);
        // Will proceed with null location/coordinates
      }
    }
    // --- END OF FIX ---

    // 4. Connect to DB and save EVERYTHING
    // We don't await this, so the user's request is not blocked
    dbConnect().then(() => {
      Visit.create({
        path: path,
        ip: ip,
        userAgent: userAgent,
        referrer: referrerDomain,
        source: utmSource,
        
        // --- ADD THE NEW DATA HERE ---
        location: locationData.location,
        coordinates: locationData.coordinates,
      }).catch(dbError => {
        // This log will only show on your server, not the client
        console.error("Failed to log visit:", dbError);
      });
    });

    // Respond immediately with 202 "Accepted"
    return NextResponse.json({ success: true }, { status: 202 });

  } catch (error) {
    console.error("Track API Error:", error);
    return NextResponse.json({ success: false, error: 'Bad request.' }, { status: 400 });
  }
}