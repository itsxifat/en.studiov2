import { NextResponse } from 'next/server';
import { v2 as cloudinary } from 'cloudinary';

// Configure Cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
  secure: true,
});

// We use POST instead of DELETE to simplify sending the public_id
export async function POST(request) {
  try {
    const { publicId } = await request.json();

    if (!publicId) {
      return NextResponse.json({ success: false, error: "No publicId provided." }, { status: 400 });
    }

    // Delete the resource from Cloudinary
    const deleteResult = await cloudinary.uploader.destroy(publicId);

    if (deleteResult.result !== 'ok') {
      throw new Error('Cloudinary deletion failed.');
    }

    return NextResponse.json({ success: true, data: deleteResult });

  } catch (error) {
    console.error("Delete API Error:", error);
    return NextResponse.json({ success: false, error: 'Delete failed.' }, { status: 500 });
  }
}