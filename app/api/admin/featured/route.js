import { NextResponse } from 'next/server';
import dbConnect from '../../../lib/dbConnect'; // Ensure path is correct
import PortfolioItem from '../../../models/portfolioItem'; // Ensure path is correct
import { v2 as cloudinary } from 'cloudinary';
import mongoose from 'mongoose';

// Configure Cloudinary (keep as is)
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
  secure: true,
});

export async function GET() {
  await dbConnect();
  try {
    // 1. Fetch Videos from MongoDB (ensure isFeatured is selected)
    const videos = await PortfolioItem.find({})
      .sort({ createdAt: -1 })
      .select('title thumbnail isFeatured _id createdAt') // isFeatured is selected
      .lean();

    // 2. Fetch Photos from Cloudinary (keep as is)
    const { resources: cloudinaryPhotos } = await cloudinary.search
      .expression('folder:portfolio')
      .sort_by('created_at', 'desc')
      .with_field('context')
      .max_results(500)
      .execute();

    // 3. Map Cloudinary photos (keep as is)
    const photos = cloudinaryPhotos.map(file => ({
        _id: file.public_id,
        title: file.context?.title || file.filename || 'Untitled Photo',
        thumbnail: cloudinary.url(file.public_id, {
            width: 300, height: 200, crop: 'fill', quality: 'auto:good', fetch_format: 'auto'
        }),
        isFeatured: file.context?.isFeatured === 'true',
        createdAt: file.created_at,
        type: 'photo'
    }));

    // ✨ 4. Map MongoDB videos AND ensure 'isFeatured' defaults to false ✨
    const formattedVideos = videos.map(video => ({
      _id: video._id, // Ensure _id is explicitly mapped
      title: video.title,
      thumbnail: video.thumbnail,
      // Default isFeatured to false if it's missing or not a boolean
      isFeatured: typeof video.isFeatured === 'boolean' ? video.isFeatured : false,
      createdAt: video.createdAt,
      type: 'video' // Add the type identifier
    }));

    // 5. Combine video and photo arrays (keep as is)
    const allItems = [...formattedVideos, ...photos];

    // 6. Sort the combined array (keep as is)
    allItems.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

    // 7. Return the successful response (keep as is)
    return NextResponse.json({ success: true, data: allItems });

  } catch (error) {
    console.error('API_ADMIN_FEATURED_GET_ERROR:', error);
    return NextResponse.json({ success: false, error: 'Failed to fetch items.' }, { status: 500 });
  }
}