import { NextResponse } from 'next/server';
import dbConnect from '../../lib/dbConnect';
import Visit from '../../models/visit';
import { headers } from 'next/headers';
// crypto library removed

export async function POST(request) {
  try {
    const body = await request.json();
    const path = body.path;
    if (!path) {
      return NextResponse.json({ success: false, error: 'Path is required.' }, { status: 400 });
    }

    const headersList = headers();
    
    // ✨ Get user's raw IP
    const ip = headersList.get('x-forwarded-for') || headersList.get('cf-connecting-ip') || request.ip || 'unknown';
    const userAgent = headersList.get('user-agent') || 'unknown';
    
    let referrer = headersList.get('referer') || null;
    const websiteUrl = process.env.YOUR_WEBSITE_URL 
      ? new URL(process.env.YOUR_WEBSITE_URL).hostname 
      : null;

    if (referrer) {
      const url = new URL(referrer);
      const host = url.hostname.replace(/^www\./, '');
      
      if (websiteUrl && !host.includes(websiteUrl)) {
        referrer = host;
      } else if (!websiteUrl) {
         referrer = host;
      } else {
        referrer = null; // It's a self-referral
      }
    }

    // Connect to DB, but DON'T await the save operation.
    dbConnect().then(() => {
      Visit.create({
        path: path,
        ip: ip, // ✨ Store raw IP
        userAgent: userAgent,
        referrer: referrer,
      }).catch(dbError => {
        console.error("Failed to log visit:", dbError);
      });
    });

    return NextResponse.json({ success: true }, { status: 202 });

  } catch (error) {
    return NextResponse.json({ success: false, error: 'Bad request.' }, { status: 400 });
  }
}