import { NextResponse } from 'next/server';
import { v2 as cloudinary } from 'cloudinary';

// Configure Cloudinary (must be done in each file)
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
  secure: true,
});

export async function POST(request) {
  try {
    const { folder, public_id } = await request.json();

    // Get a signed signature from Cloudinary
    const timestamp = Math.round((new Date).getTime()/1000);

    const signature = cloudinary.utils.api_sign_request(
      {
        timestamp: timestamp,
        folder: folder,
        ...(public_id && { public_id }), // Add public_id if provided
      },
      process.env.CLOUDINARY_API_SECRET
    );

    return NextResponse.json({ success: true, timestamp, signature });

  } catch (error) {
    console.error("Signature API Error:", error);
    return NextResponse.json({ success: false, error: "Failed to create signature." }, { status: 500 });
  }
}