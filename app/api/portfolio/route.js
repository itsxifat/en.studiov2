// app/api/portfolio/route.js
import dbConnect from '../../lib/dbConnect';
import PortfolioItem from '../../models/portfolioItem';
import { NextResponse } from 'next/server';

// Helper function to extract YouTube ID (robust version)
function extractYoutubeId(url) {
  if (!url || typeof url !== 'string') return null;
  const trimmedUrl = url.trim();
  if (!trimmedUrl) return null;

  const regex = /(?:https?:\/\/)?(?:www\.)?(?:youtube\.com\/(?:[^\/\n\s]+\/\S+\/|(?:v|e(?:mbed)?)\/|\S*?[?&]v=)|youtu\.be\/)([a-zA-Z0-9_-]{11})/;
  const match = trimmedUrl.match(regex);
  return match ? match[1] : null;
}

/**
 * @route GET /api/portfolio
 * @description Get all portfolio items, sorted by newest first
 */
export async function GET() {
  await dbConnect();
  try {
    const items = await PortfolioItem.find({})
      .sort({ createdAt: -1 })
      .select('title category description youtubeId thumbnail liveUrl githubUrl createdAt _id')
      .lean();
    return NextResponse.json({ success: true, data: items });
  } catch (error) {
    console.error('API_PORTFOLIO_GET_ERROR:', error);
    return NextResponse.json({ success: false, error: 'Failed to fetch portfolio items.' }, { status: 500 });
  }
}

/**
 * @route POST /api/portfolio
 * @description Add a new portfolio item
 */
export async function POST(request) {
  await dbConnect();

  try {
    const body = await request.json();

    // Trim inputs for basic sanitization/consistency
    const title = body.title?.trim();
    const category = body.category?.trim();
    const description = body.description?.trim() || '';
    const youtubeLink = body.youtubeLink?.trim();
    const customThumbnail = body.thumbnail?.trim();
    const liveUrl = body.liveUrl?.trim();
    const githubUrl = body.githubUrl?.trim();


    // 1. Check for required fields
    if (!title || !category) {
      return NextResponse.json({ success: false, error: 'Title and Category are required.' }, { status: 400 });
    }

    // 2. Handle YouTube ID (optional)
    let youtubeId = null;
    if (youtubeLink) {
      youtubeId = extractYoutubeId(youtubeLink);
      // Optional: Add stricter validation if needed
      if (youtubeLink && !youtubeId) {
         return NextResponse.json({ success: false, error: 'Invalid YouTube link provided. Could not extract Video ID.' }, { status: 400 });
      }
    }

    // 3. Handle Thumbnail
    let thumbnail = customThumbnail || null;
    if (!thumbnail && youtubeId) {
      thumbnail = `https://img.youtube.com/vi/${youtubeId}/maxresdefault.jpg`;
      // You could add a check here to see if maxresdefault exists and fallback if not
    }

    // 4. Create the complete data object for Mongoose
    const itemData = {
      title,
      category,
      description,
      youtubeId, // Will be null if no valid link provided
      thumbnail,
      liveUrl: liveUrl || null,
      githubUrl: githubUrl || null,
    };

    // 5. Save to database
    const item = await PortfolioItem.create(itemData);

    return NextResponse.json({ success: true, data: item }, { status: 201 });
  } catch (error) {
    if (error.name === 'ValidationError') {
      const messages = Object.values(error.errors).map(val => val.message);
      return NextResponse.json({ success: false, error: messages.join(', ') }, { status: 400 });
    }
    if (error.code === 11000) {
        return NextResponse.json({ success: false, error: 'A portfolio item with this identifier might already exist.' }, { status: 409 });
    }
    console.error('API_PORTFOLIO_POST_ERROR:', error);
    return NextResponse.json({ success: false, error: 'Failed to create portfolio item.' }, { status: 500 });
  }
}