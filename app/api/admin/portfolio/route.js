import { NextResponse } from 'next/server';
import dbConnect from '../../../lib/dbConnect';
import PortfolioItem from '../../../models/portfolioItem';
import { extractYoutubeId } from '../../../lib/youtubeHelper';

// This file is automatically protected by your middleware.js

/**
 * @route GET /api/admin/portfolio
 * @description Get all portfolio items for the admin panel
 */
export async function GET() {
  await dbConnect();
  try {
    const items = await PortfolioItem.find({})
      .sort({ createdAt: -1 })
      .lean(); // .lean() for faster performance
    return NextResponse.json({ success: true, data: items });
  } catch (error) {
    console.error('API_ADMIN_PORTFOLIO_GET_ERROR:', error);
    return NextResponse.json({ success: false, error: 'Failed to fetch portfolio items.' }, { status: 500 });
  }
}

/**
 * @route POST /api/admin/portfolio
 * @description Add a new portfolio item (Moved from public /api/portfolio)
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

    const itemData = {
      title,
      category,
      description,
      youtubeId,
      thumbnail,
      // liveUrl and githubUrl are confirmed removed
    };

    const item = await PortfolioItem.create(itemData);

    return NextResponse.json({ success: true, data: item }, { status: 201 });
  } catch (error) {
    if (error.name === 'ValidationError') {
      const messages = Object.values(error.errors).map(val => val.message);
      return NextResponse.json({ success: false, error: messages.join(', ') }, { status: 400 });
    }
    if (error.code === 11000) {
        return NextResponse.json({ success: false, error: 'A portfolio item with this title might already exist.' }, { status: 409 });
    }
    console.error('API_ADMIN_PORTFOLIO_POST_ERROR:', error);
    return NextResponse.json({ success: false, error: 'Failed to create portfolio item.' }, { status: 500 });
  }
}