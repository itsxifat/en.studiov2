import { NextResponse } from 'next/server';
import { v2 as cloudinary } from 'cloudinary';

// Configure Cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
  secure: true,
});

export async function GET() {
  try {
    const { resources } = await cloudinary.search
      .expression('folder:portfolio') // Fetch from the "portfolio" folder
      .sort_by('created_at', 'desc')
      .max_results(500) // Show up to 500 photos on your portfolio
      .execute();

    // Map to the format your _photographyGallery.jsx component expects
    const photos = resources.map(file => ({
      id: file.public_id,
      // Create a 600px wide thumbnail
      thumbnailUrl: cloudinary.url(file.public_id, {
        width: 600,
        height: 600,
        crop: 'fill',
        quality: 'auto:good',
        fetch_format: 'auto', // Auto-convert to WebP
      }),
      // Create a high-res 1920px wide version for the modal
      highResUrl: cloudinary.url(file.public_id, {
        width: 1920,
        quality: 'auto:good',
        fetch_format: 'auto',
      }),
      width: file.width,
      height: file.height,
      filename: file.filename,
    }));

    return NextResponse.json({ success: true, photos: photos });

  } catch (error) {
    console.error("Failed to fetch public photos from Cloudinary:", error);
    return NextResponse.json({ error: 'Failed to fetch photos.' }, { status: 500 });
  }
}