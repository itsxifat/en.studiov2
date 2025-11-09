import { NextResponse } from 'next/server';
import dbConnect from '../../lib/dbConnect';
import Visit from '../../models/visit';
import { headers } from 'next/headers';

// This API route is fast and logs visits in the background
export async function POST(request) {
  try {
    const body = await request.json();
    const { path, referrer: clientReferrer, search: clientSearch } = body;
    
    if (!path) {
      return NextResponse.json({ success: false, error: 'Path is required.' }, { status: 400 });
    }

    const headersList = headers();
    const ip = headersList.get('x-forwarded-for') || headersList.get('cf-connecting-ip') || request.ip || 'unknown';
    const userAgent = headersList.get('user-agent') || 'unknown';
    
    let referrerDomain = null;
    const websiteUrl = process.env.YOUR_WEBSITE_URL 
      ? new URL(process.env.YOUR_WEBSITE_URL).hostname 
      : null;

    // 1. Parse the referrer domain
    if (clientReferrer) {
      const url = new URL(clientReferrer);
      const host = url.hostname.replace(/^www\./, '');
      
      if (websiteUrl && !host.includes(websiteUrl)) {
        referrerDomain = host;
      } else if (!websiteUrl && host) {
         referrerDomain = host;
      }
      // if it's a self-referral, referrerDomain remains null
    }

    // 2. Parse the UTM source from the CURRENT page's query string
    let utmSource = null;
    if (clientSearch) {
      const params = new URLSearchParams(clientSearch);
      utmSource = params.get('utm_source'); // This tracks "facebook", "instagram", etc.
    }

    // Connect to DB, but DON'T await the save operation.
    dbConnect().then(() => {
      Visit.create({
        path: path,
        ip: ip,
        userAgent: userAgent,
        referrer: referrerDomain,
        source: utmSource, // Save the new source
      }).catch(dbError => {
        console.error("Failed to log visit:", dbError);
      });
    });

    return NextResponse.json({ success: true }, { status: 202 });

  } catch (error) {
    return NextResponse.json({ success: false, error: 'Bad request.' }, { status: 400 });
  }
}