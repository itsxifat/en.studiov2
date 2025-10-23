import { NextResponse } from 'next/server';
import { v2 as cloudinary } from 'cloudinary';

// Configure Cloudinary with your credentials
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
  secure: true,
});

// This function will GET all images from your "portfolio" folder
export async function GET() {
  try {
    const { resources } = await cloudinary.search
      .expression('folder:portfolio') // We'll upload everything to a "portfolio" folder
      .sort_by('created_at', 'desc')
      .with_field('context') // This fetches our title/description
      .max_results(100)
      .execute();

    // Map to a cleaner format
    const photos = resources.map(file => ({
      id: file.public_id,
      url: file.secure_url,
      thumbnail_url: cloudinary.url(file.public_id, {
        width: 300, height: 300, crop: 'fill'
      }),
      title: file.context?.title || '',
      description: file.context?.description || '',
    }));

    return NextResponse.json({ success: true, photos: photos });

  } catch (error) {
    console.error("Failed to fetch Cloudinary photos:", error);
    return NextResponse.json({ success: false, error: 'Failed to fetch photos.' }, { status: 500 });
  }
}