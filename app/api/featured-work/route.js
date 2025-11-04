import { NextResponse } from 'next/server';
import dbConnect from '../../lib/dbConnect';
import PortfolioItem from '../../models/portfolioItem';
import PhotoProject from '../../models/photoProject'; // ✨ Import PhotoProject

// Configure Cloudinary
import { v2 as cloudinary } from 'cloudinary';
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
  secure: true,
});

export async function GET() {
  await dbConnect();
  try {
    // 1. Fetch Featured Videos
    const featuredVideos = await PortfolioItem.find({ isFeatured: true })
      .sort({ createdAt: -1 })
      .select('title category thumbnail youtubeId _id createdAt')
      .lean();

    // ✨ 2. Fetch Featured Photo Projects
    const featuredPhotoProjects = await PhotoProject.find({ isFeatured: true })
      .sort({ createdAt: -1 })
      .select('title slug thumbnail createdAt') // Select the slug
      .lean();

    // Map Photo Projects
    const featuredPhotos = featuredPhotoProjects.map(project => ({
      _id: project._id,
      title: project.title,
      category: 'Photography', // Assign a default category
      thumbnail: project.thumbnail,
      youtubeId: null,
      slug: project.slug, // Pass the slug
      createdAt: project.createdAt,
      type: 'photoProject' // Set the type
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
    return NextResponse.json({ success: false, error: 'Failed to fetch featured work.' }, { status: 500 });
  }
}