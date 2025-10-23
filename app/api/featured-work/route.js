import { NextResponse } from 'next/server';
import dbConnect from '../../lib/dbConnect';
import PortfolioItem from '../../models/portfolioItem';
import { v2 as cloudinary } from 'cloudinary';

// ✨ ADD THIS CONFIGURATION BLOCK ✨
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
  secure: true, // Optional but recommended
});
// ✨ END OF CONFIGURATION BLOCK ✨

export async function GET() {
  await dbConnect();
  try {
    // 1. Fetch Featured Videos
    const featuredVideos = await PortfolioItem.find({ isFeatured: true })
      .sort({ createdAt: -1 })
      .select('title category thumbnail youtubeId _id createdAt')
      .lean();

    // 2. Fetch Featured Photos (This part will now work)
    const { resources: cloudinaryPhotos } = await cloudinary.search
      .expression('folder:portfolio AND context.isFeatured=true')
      .sort_by('created_at', 'desc')
      .with_field('context')
      .max_results(30)
      .execute(); // This line was failing

    // Map Cloudinary photos
    const featuredPhotos = cloudinaryPhotos.map(file => ({
      _id: file.public_id,
      title: file.context?.title || file.filename || 'Untitled Photo',
      category: 'Photography', // Assign a default category
      thumbnail: cloudinary.url(file.public_id, {
        width: 600, height: 400, crop: 'fill', quality: 'auto:good', fetch_format: 'auto'
      }),
      youtubeId: null,
      createdAt: file.created_at,
      type: 'photo'
    }));

     // Map MongoDB videos
     const formattedVideos = featuredVideos.map(video => ({
       ...video,
       type: 'video'
     }));

    // 3. Combine and sort
    const allFeaturedItems = [...formattedVideos, ...featuredPhotos].sort((a, b) =>
      new Date(b.createdAt) - new Date(a.createdAt)
    );

    return NextResponse.json({ success: true, data: allFeaturedItems });

  } catch (error) {
    console.error('API_FEATURED_WORK_GET_ERROR:', error);
    // Add specific check for config error
    if (error.message.includes('Must supply cloud_name')) {
        console.error('>>> Cloudinary credentials might be missing in .env.local or not loaded correctly.');
    }
    return NextResponse.json({ success: false, error: 'Failed to fetch featured work.' }, { status: 500 });
  }
}