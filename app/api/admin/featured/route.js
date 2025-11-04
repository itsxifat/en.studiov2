import { NextResponse } from 'next/server';
import dbConnect from '../../../lib/dbConnect';
import PortfolioItem from '../../../models/portfolioItem';
import PhotoProject from '../../../models/photoProject'; // ✨ 1. Import PhotoProject

// Cloudinary is no longer needed here

export async function GET() {
  await dbConnect();
  try {
    // 1. Fetch Video Projects (Videos)
    const videos = await PortfolioItem.find({})
      .sort({ createdAt: -1 })
      .select('title thumbnail isFeatured _id createdAt')
      .lean();

    // ✨ 2. Fetch Photo Projects (NOT individual photos)
    const photoProjects = await PhotoProject.find({})
      .sort({ createdAt: -1 })
      .select('title thumbnail isFeatured _id createdAt slug') // Get the fields we need
      .lean();

    // Map Photo Projects to a consistent format
    const photos = photoProjects.map(project => ({
      _id: project._id,
      title: project.title,
      thumbnail: project.thumbnail,
      isFeatured: project.isFeatured || false, // Default to false if missing
      createdAt: project.createdAt,
      type: 'photoProject' // ✨ 3. Set the type to 'photoProject'
    }));

    // Map MongoDB videos to a consistent format
    const formattedVideos = videos.map(video => ({
      ...video,
      isFeatured: typeof video.isFeatured === 'boolean' ? video.isFeatured : false,
      type: 'video'
    }));

    // 4. Combine and sort
    const allItems = [...formattedVideos, ...photos].sort((a, b) =>
      new Date(b.createdAt) - new Date(a.createdAt)
    );

    return NextResponse.json({ success: true, data: allItems });

  } catch (error) {
    console.error('API_ADMIN_FEATURED_GET_ERROR:', error);
    return NextResponse.json({ success: false, error: 'Failed to fetch items.' }, { status: 500 });
  }
}