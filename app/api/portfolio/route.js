import dbConnect from '../../lib/dbConnect';
import PortfolioItem from '../../models/portfolioItem';
import { NextResponse } from 'next/server';
import { extractYoutubeId } from '../../lib/youtubeHelper'; // Make sure this helper exists

/**
 * @route GET /api/portfolio
 * @description Get all portfolio items
 */
export async function GET() {
  await dbConnect();
  try {
    const items = await PortfolioItem.find({})
      .sort({ createdAt: -1 })
      // ✨ Removed liveUrl and githubUrl from select
      .select('title category description youtubeId thumbnail createdAt _id') 
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

    const title = body.title?.trim();
    const category = body.category?.trim();
    const description = body.description?.trim() || '';
    const youtubeLink = body.youtubeLink?.trim();
    const customThumbnail = body.thumbnail?.trim();
    // ✨ Removed liveUrl and githubUrl

    if (!title || !category) {
      return NextResponse.json({ success: false, error: 'Title and Category are required.' }, { status: 400 });
    }

    let youtubeId = null;
    if (youtubeLink) {
      youtubeId = extractYoutubeId(youtubeLink);
      if (youtubeLink && !youtubeId) {
           return NextResponse.json({ success: false, error: 'Invalid YouTube link provided.' }, { status: 400 });
      }
    }

    let thumbnail = customThumbnail || null;
    if (!thumbnail && youtubeId) {
      thumbnail = `https://img.youtube.com/vi/${youtubeId}/maxresdefault.jpg`;
    }

    // ✨ Create data object without liveUrl and githubUrl
    const itemData = {
      title,
      category,
      description,
      youtubeId,
      thumbnail,
    };

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